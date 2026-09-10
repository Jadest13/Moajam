# 개발 가이드

## 요구 환경

- Node.js 22 이상
- npm 11 이상
- 모바일 실행 시 Android Studio 또는 Xcode/Expo Go

## 명령

```bash
npm install
npm run dev:web
npm run dev:mobile
npm run typecheck
npm run lint
npm run format
npm run build
```

## 새 기능 배치 기준

1. 도메인 타입과 순수 규칙은 `packages/domain`에 둔다.
2. 요청 함수와 Query 설정은 `packages/api`에 둔다.
3. 여러 플랫폼에서 보이는 UI와 Screen은 `packages/ui`, `packages/app`에 둔다.
4. 플랫폼별 권한, 라우팅, 브라우저/기기 API만 `apps/web`, `apps/mobile`에 둔다.
5. 플랫폼 차이가 작은 경우 `.web.tsx`, `.native.tsx` 확장자를 사용한다.

`packages/app/src`에서는 화면을 `screens`, 재사용 가능한 앱 컴포넌트를 `components`, 화면 공통
스타일을 `styles`에 둔다. 임시 데이터는 `mocks`에만 두어 실제 API 연결 시 쉽게 제거할 수 있게 한다.

## 환경 변수

웹 공개 변수는 `VITE_`, Expo 공개 변수는 `EXPO_PUBLIC_` 접두사를 사용한다. 비밀 키는 클라이언트
번들에 넣지 않는다. API URL은 추후 각 앱에서 읽어 공통 API gateway에 주입한다.
