# 협업·파일·음원 분리 환경 설정

현재 프로젝트의 Nest/Fastify + Prisma/PostgreSQL + Supabase Auth/Storage 구성을 사용한다.
실제 비밀 키가 포함된 환경설정 파일은 현재 저장소에 없으며, 예제 값으로 외부 연결을 시도하지 않았다.

## 1. 웹과 서버

- `apps/web/.env.example`을 참고해 `.env.local`에 `VITE_API_URL`(기본 `http://localhost:3000/v1`), `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`를 설정한다.
- `apps/server/.env.example`을 참고해 `apps/server/.env`에 `DATABASE_URL`, `DIRECT_URL`, Supabase URL과 publishable key, `CORS_ORIGINS`를 설정한다. 웹 주소가 `127.0.0.1`이면 해당 origin도 허용해야 한다.
- 파일 기능에는 서버 전용 `SUPABASE_SECRET_KEY`, `MEDIA_BUCKET=moajam-private`가 추가로 필요하다. secret/service-role 키를 웹 환경 변수에 넣지 않는다.
- Supabase Auth에 테스트 계정 두 개를 등록한다. 현재 웹은 이메일·비밀번호 로그인만 제공한다.
- 웹 변수 세 개가 모두 있어야 서버 모드가 활성화된다. 미설정 시 샘플 밴드와 로컬 저장으로 실행한다. 로컬 샘플 기록은 서버에 자동 업로드하지 않는다.

## 2. 데이터베이스

`202609180001_collaboration`은 기존 migration이 없던 프로젝트를 위한 **전체 초기 스키마**다. 빈 개발 DB에서는 다음 순서로 실행한다.

```sh
npm run prisma:generate --workspace @moajam/server
npm run prisma:deploy --workspace @moajam/server
npm run dev:server
npm run dev:web
```

이미 테이블이 있는 DB에는 초기 migration을 바로 적용하지 않는다. 기존 스키마와 차이를 확인하고 baseline 또는 증분 migration을 준비해야 한다. 이 작업에서 운영 DB를 변경하지 않았다.

문서·멤버·파일 조회는 인증 사용자의 멤버십을 검사한다. 테이블에는 RLS를 활성화했으며 브라우저가 DB를 직접 쓰는 정책은 만들지 않는다. 서버 연결에는 서버에서 관리하는 DB 역할을 사용한다.

문서는 revision 비교로 충돌을 거절한다. 데이터가 오래된 경우 상단 상태와 오류를 확인하고 설정에서 JSON 백업한 뒤 서버 기록을 다시 불러온다. 현재 자동 병합·실시간 구독은 없다.

## 3. 비공개 파일 저장소

- Supabase에 `moajam-private` 비공개 버킷을 만든다. 공개 버킷으로 설정하지 않는다.
- 업로드 허용 형식은 audio/mpeg, wav, x-wav, webm, ogg, mp4, aac, flac; image/png, jpeg, webp; PDF와 XML/MusicXML이다. HTML/SVG는 허용하지 않는다.
- 브라우저 원본 파일은 100MB 제한이며 완료 시 서버가 저장소 메타데이터의 크기·MIME을 확인한다. 버킷에도 파일 제한을 설정한다. WAV 분리 결과는 원본 압축 파일보다 커질 수 있어 작업용 제한을 별도 검토한다.
- 업로드는 서명 URL을 사용한다. 다운로드는 매번 권한 확인 후 5분 URL을 발급한다. 공유 파일은 현재 밴드 멤버만 볼 수 있다.
- 파일 삭제는 메타데이터 soft delete다. 저장소 원본 정리·보존 주기와 사용자 용량 한도는 아직 자동화하지 않았다.

## 4. 분리 작업 서버

`ENABLE_MEDIA_WORKER=true`, `MEDIA_PYTHON`에 Demucs가 설치된 Python 실행 경로를 지정한다. FFmpeg와 모델 실행 환경이 필요하다. 현재 작업에서 Python 패키지·모델을 설치하거나 대용량 모델을 다운로드하지 않았다.

실행 모델은 `htdemucs_6s`, 결과는 선택한 악기와 나머지 소리의 WAV 두 개다. [Demucs 공식 문서](https://github.com/facebookresearch/demucs/blob/main/README.md)를 기준으로 구성했으며 기타·피아노 분리는 실험적이다.

- 서버 프로세스 내 순차 큐, 사용자별 대기/실행 2개 제한 검사, 작업당 30분 제한.
- 취소는 상태 변경과 자식 프로세스 중단. 재시작 시 실행 중이던 작업은 실패로 표시하고 대기 작업은 재개한다.
- **단일 서버 인스턴스만 실행한다.** 여러 인스턴스에 분산 실행할 lease/락과 엄격한 동시 요청 quota는 구현하지 않았다.
- 실패 이유는 사용자용 메시지로 표시한다. 모델 다운로드, GPU/CPU 성능, 저장소 오류는 실제 환경에서 확인해야 한다.

## 5. 연결 후 확인할 흐름

1. 계정 A가 밴드를 만들고 계정 B가 초대로 가입한다. 만료·철회 코드와 중복 가입을 확인한다.
2. 두 계정으로 같은 문서를 수정해 409 충돌과 새로 불러오기를 확인한다. 다른 밴드 접근과 타인 준비도 변경을 거절해야 한다.
3. 마지막 Owner의 강등·탈퇴를 거절하는지 확인한다.
4. 비공개 파일은 B가 볼 수 없어야 하며, A가 공개하면 B가 조회·재생할 수 있어야 한다. 탈퇴 후에는 새 다운로드 URL 발급을 거절해야 한다.
5. 분리 요청·재시작·취소·실패·재시도·결과 다운로드를 확인한다.
6. 앱 내 알림과 읽음 상태를 확인한다. 이메일·푸시가 전송된 것으로 간주하지 않는다.

모바일은 현재 기기 저장 모드다. 웹과 동일한 서버 연동 및 실기기 검증은 별도 작업이 필요하다. 전체 구현 경계는 [화면별 명세](./interaction-spec.md)에 기록했다.
