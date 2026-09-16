# Moajam Server

Moajam의 HTTP API와 비동기 미디어 작업을 담당하는 서버 애플리케이션이다.

NestJS, Fastify, Prisma와 Supabase를 사용한다.

## 시작하기

1. `.env.example`을 `.env`로 복사한다.
2. Supabase Dashboard의 `Connect`에서 런타임과 Migration 연결 문자열을 입력한다.
3. Supabase Project URL과 Publishable Key를 입력한다.
4. Prisma Client를 생성하고 개발 서버를 실행한다.

```bash
npm run prisma:generate --workspace @moajam/server
npm run dev:server
```

기본 주소는 다음과 같다.

- API 상태: `http://localhost:3000/v1/health`
- Swagger UI: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/docs-json`

## 데이터베이스

- `DATABASE_URL`: API 런타임 연결이다. 장기 실행 서버에서는 Direct Connection을 사용하고,
  IPv4 환경에서는 Supabase Session Pooler를 사용한다.
- `DIRECT_URL`: Prisma Migration 연결이다. 가능하면 Direct Connection을 사용한다.
- Prisma 스키마와 Migration을 DB 구조의 원본으로 사용한다.
- `Profile.id`는 Supabase Auth 사용자의 UUID와 동일하게 유지한다. Auth 사용자 생성 시 Profile을 만드는
  Trigger는 Supabase 프로젝트 연결 후 첫 Migration에 추가한다.

초기 스키마를 Supabase에 반영할 때는 다음 명령을 사용한다.

```bash
npm run prisma:migrate --workspace @moajam/server -- --name init
```

## API 문서

- 실행 중인 `/docs`: Controller와 DTO에서 생성되는 최종 Swagger 문서
- 실행 중인 `/docs-json`: 클라이언트 생성과 CI 검증에 사용하는 OpenAPI JSON
- [`openapi.yaml`](./openapi.yaml): 구현 전 작성한 전체 API 설계 초안
- [`docs/api-design.md`](./docs/api-design.md): API 공통 규칙, 권한, 주요 흐름과 구현 순서

Controller와 DTO에서 생성되는 문서를 최종 계약으로 사용한다. `openapi.yaml`은 엔드포인트 구현 시
참고하고, 코드와 별도의 최종 계약으로 이중 관리하지 않는다.

## 명령

```bash
npm run dev:server
npm run build:server
npm run typecheck --workspace @moajam/server
npm run test --workspace @moajam/server
npm run prisma:studio --workspace @moajam/server
```

## 구현 원칙

- 모든 공개 API는 `/v1` 아래에 둔다.
- Workspace 데이터 경로에는 항상 `workspaceId`를 포함한다.
- 서버는 토큰의 사용자와 Workspace Membership을 모두 검증한다.
- 파일 데이터는 API 서버를 경유하지 않고 업로드 세션으로 Object Storage에 직접 전송한다.
- Stem 분리 같은 장시간 작업은 Job 리소스로 만들고 조회한다.
- 클라이언트가 재시도할 수 있는 생성·명령 API는 `Idempotency-Key`를 지원한다.
