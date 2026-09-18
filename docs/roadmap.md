# MVP 로드맵

현재 화면별 구현 상태와 우선 보완 항목은 [화면별 기능 명세](./interaction-spec.md)를 기준으로 한다.
아래 목록은 제품의 목표 범위이며, 화면이 존재하거나 개발 예정 오버레이가 제거되었다고 구현 완료를 뜻하지 않는다.

## 1. 기반

- 인증, Workspace 생성/참가/전환
- 공통 디자인 시스템과 앱 셸
- API 오류·로딩·빈 상태 규약

## 2. 선곡

- 추천 등록, 좋아요, 채택 추천, 댓글
- Owner 채택/보류와 Song Workspace 생성

## 3. 곡 협업

- 파트 배정과 준비 상태
- 의견, Decision, Checklist 관계
- 악보와 Reference 등록

## 4. 연습

- 직접 음원 업로드와 처리 상태
- Stem Job/캐시/사용량 API
- Multi-track Player, 개인 녹음, 수동 Sync, A/B Loop
- Timeline Marker와 Point/Range Comment
- PDF·이미지 악보 Viewer와 수동 Score Sync Point
- 재생 중 자동 페이지 전환과 현재 악보 구간 표시
- Private Draft 및 Workspace 공개 범위를 가진 개인 Take
- 게시된 멤버 Take 선택·Offset 조절·비교 재생

## 5. 합주

- Rehearsal Session과 별도 Timeline
- Decision 이력과 다음 합주 Checklist 연결

## 6. 개인 작업실

- 개인 프로젝트 Scope와 파일 보관
- 휴대폰 근접 녹음과 Target Instrument 자동 감지·사용자 교정
- 우세 악기 분리 Job, 누음·Clipping·Noise 품질 피드백
- 원본·추출본·제거된 소리 A/B 비교와 분리 설정 재처리
- WAV·MP3 내보내기와 개인 Practice Take 저장
- 구조화 악보 편집, 자동 저장과 Revision
- 기준 음원 동기 재생과 Score Cursor
- PDF·MusicXML 내보내기와 Workspace 자료로 복사

각 단계는 웹과 모바일의 핵심 흐름, 접근 권한, 오류/빈 상태, 타입 검사와 자동 검증이 함께 완료돼야
끝난 것으로 본다.
