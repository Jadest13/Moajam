# Moajam API 설계

이 문서는 [`openapi.yaml`](../openapi.yaml)의 설계 의도와 아직 확정하지 않은 부분을 설명한다.
제품 범위와 도메인 불변 조건은 루트의 `docs/product-requirements.md`와
`docs/domain-model.md`를 기준으로 한다.

## 1. 범위

첫 계약은 다음 MVP 흐름을 포함한다.

1. 현재 사용자와 Workspace 조회
2. 추천 등록, 좋아요, 채택 추천, 댓글, Owner의 채택·보류
3. 채택곡, 파트 배정, 준비 상태, 의견, Decision, Checklist
4. 자료 메타데이터, 직접 업로드, Timeline Comment
5. Stem Job, 개인 Practice Take
6. 합주 Session

알림, 결제/사용량 정책, 개인 작업실의 악기 추출·구조화 악보 편집 API는 핵심 협업 API 구현 후
별도 계약으로 확장한다. 엔터티와 상태는 이미 도메인 문서에 보존한다.

## 2. 공통 계약

### Base URL과 형식

- Base path: `/v1`
- 요청과 응답: `application/json; charset=utf-8`
- 시각: UTC ISO 8601 문자열(예: `2026-09-16T10:30:00Z`)
- 기간과 Timeline 위치: 정수 millisecond
- ID: 서버가 발급하는 opaque string. 클라이언트는 형식을 해석하지 않는다.
- 선택 필드: 값이 없으면 필드를 생략한다. 의미 있는 경우에만 `null`을 사용한다.

### 인증

Supabase Auth가 Access token을 발급·갱신한다. 보호된 요청은
`Authorization: Bearer <access-token>`을 사용하며, NestJS Auth Guard가 Supabase의 공개 Signing Key로
Token을 검증한다. 검증된 `sub` Claim을 Moajam 사용자 ID로 사용한다. API 응답이나 로그에 Token을
기록하지 않는다.

### 응답

단일 리소스는 별도 `data` 포장 없이 리소스 자체를 반환한다. 목록은 아래 형식으로 통일한다.

```json
{
  "items": [],
  "nextCursor": "opaque-cursor"
}
```

`nextCursor`가 없으면 마지막 페이지다. 목록 정렬은 기본적으로 `createdAt DESC, id DESC`이며 Cursor는
서버만 생성하고 해석한다.

### 오류

오류는 `application/problem+json`을 사용한다.

```json
{
  "type": "https://api.moajam.app/problems/validation-failed",
  "title": "요청 값이 올바르지 않습니다.",
  "status": 422,
  "code": "VALIDATION_FAILED",
  "traceId": "01K5...",
  "errors": [{ "field": "title", "reason": "REQUIRED", "message": "곡 제목을 입력해 주세요." }]
}
```

주요 상태 코드는 다음과 같다.

| 상태 | 의미                                          |
| ---- | --------------------------------------------- |
| 400  | JSON 형식, Cursor 등 요청 자체가 잘못됨       |
| 401  | 인증이 없거나 만료됨                          |
| 403  | Workspace 권한 또는 리소스 소유권 부족        |
| 404  | 리소스가 없거나 현재 사용자에게 노출되지 않음 |
| 409  | 상태 전이 충돌, 중복, 이미 처리된 명령        |
| 413  | 업로드 허용 크기 초과                         |
| 415  | 지원하지 않는 미디어 형식                     |
| 422  | 필드 유효성 검사 실패                         |
| 429  | 요청 또는 처리 Job 제한 초과                  |

다른 Workspace의 리소스 존재 여부를 노출하지 않기 위해 Membership이 없는 중첩 리소스는 `404`로
응답할 수 있다.

### 멱등성과 동시성

- 추천 생성, 곡 채택, 업로드 세션 생성, Job 생성은 `Idempotency-Key`를 받는다.
- 같은 사용자·경로·Key·Body 조합의 재요청은 최초 결과를 반환한다.
- 같은 Key에 다른 Body를 보내면 `409 IDEMPOTENCY_KEY_REUSED`다.
- 좋아요, 채택 추천, Checklist 완료는 원하는 최종 상태를 `PUT`으로 보내므로 자체적으로 멱등이다.
- 추후 동시 편집 충돌이 실제로 생기는 리소스에는 `ETag`와 `If-Match`를 추가한다.

## 3. 권한

| 동작                          | Member | Owner |
| ----------------------------- | :----: | :---: |
| 추천·댓글·좋아요·채택 추천    |   O    |   O   |
| 추천을 채택 또는 보류         |   X    |   O   |
| 본인 준비 상태 변경           |   O    |   O   |
| 다른 멤버 파트 배정           |   X    |   O   |
| 의견·자료·Take·합주 기록 작성 |   O    |   O   |
| 공식 Decision 생성·무효화     |   X    |   O   |
| 멤버 역할 변경·제거           |   X    |   O   |
| 본인 Private Take 조회·수정   |   O    |   O   |
| 게시된 Workspace Take 조회    |   O    |   O   |

Owner 이전 없이 마지막 Owner를 제거하거나 탈퇴시키는 요청은 `409 LAST_OWNER_REQUIRED`다.

## 4. 주요 상태 전이

### 추천 채택

```text
RECOMMENDED -> CANDIDATE -> ADOPTED
                         -> HOLD
HOLD -------------------> CANDIDATE
```

좋아요와 채택 추천은 상태 전이와 독립적이다. `POST .../adoption` 성공 시 Recommendation을
`ADOPTED`로 바꾸고 Song을 한 트랜잭션에서 한 번만 만든다.

### 파일과 Stem

```text
create upload session -> client uploads -> complete upload
  -> Resource(UPLOADED) -> StemJob(QUEUED -> PROCESSING -> PREPARING_AUDIO)
  -> COMPLETED | FAILED
```

실패한 Job은 사용량을 소비하지 않는다. 완료된 Stem은 원본 Resource에서 파생된
`TimelineSource`이며 독립 업로드로 취급하지 않는다.

### Practice Take

Take는 `PRIVATE`로 시작한다. 작성자만 이름, Offset, 공개 범위를 바꾸거나 삭제할 수 있다.
`WORKSPACE`로 게시된 Take만 다른 Workspace Member 목록에 나타난다.

## 5. 업로드 프로토콜

1. 클라이언트가 파일명, MIME type, byte size, SHA-256으로 업로드 세션을 만든다.
2. 서버가 제한을 검증하고 짧게 만료되는 `uploadUrl`과 필요한 Header를 반환한다.
3. 클라이언트가 Object Storage로 직접 업로드한다.
4. 클라이언트가 Complete API를 호출한다.
5. 서버는 Object의 크기·Checksum을 확인한 후 Resource 또는 Practice Take를 생성한다.

Complete 호출 전 Object는 임시 상태이며 만료 후 정리한다. 외부 URL, 특히 YouTube URL은 Reference로만
저장하고 서버가 다운로드하지 않는다.

## 6. 조회 모델

화면의 왕복 요청을 줄이기 위해 `GET /workspaces/{workspaceId}/overview`는 다음 합주, 준비 중인 곡,
최근 활동, 채택 후보를 합친 읽기 전용 응답을 제공한다. 세부 화면은 정규 리소스 API를 사용한다.
Overview는 명령을 받지 않으며 원본 리소스가 변경되면 함께 무효화한다.

## 7. 아직 결정할 항목

- 배포 환경에 따른 Supabase Direct Connection 또는 Session Pooler 선택
- Object Storage와 업로드별 최대 크기·허용 MIME 목록
- Job Queue와 미디어 처리 Worker 배포 방식
- 실시간 갱신 방식: 초기에는 polling, 필요 시 SSE 도입
- 삭제 보존 기간과 감사 로그 정책

이 항목들은 HTTP 리소스 모델을 바꾸지 않는 범위에서 구현 단계에 결정한다.

## 8. 구현 순서

1. 공통 오류, 인증 Guard, Workspace Membership Guard
2. Workspace Overview와 Member
3. Recommendation 전체 흐름과 Song 채택 트랜잭션
4. Song, 파트 준비도, Opinion, Decision, Checklist
5. Upload Session, Resource, Timeline Comment
6. Stem Job과 Practice Take
7. Rehearsal Session
