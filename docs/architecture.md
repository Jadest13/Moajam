# 프런트엔드 아키텍처

## 모노레포

```text
apps/
  web/       Vite, React Router DOM, react-native-web
  mobile/    React Native, Expo
packages/
  app/       공유 Provider와 Screen 조합
    src/
      components/  앱 셸과 기능 공통 컴포넌트
      screens/     웹·모바일 공통 화면
      styles/      화면 레이아웃과 공통 스타일
      mocks/       API 연결 전 목 데이터
  api/       API 경계, TanStack Query 설정과 query options
  domain/    플랫폼 독립 도메인 타입과 규칙
  ui/        Emotion Native 기반 디자인 토큰과 공통 컴포넌트
docs/        제품·도메인·기술 기준 문서
```

## 공유 원칙

- Screen과 기능 컴포넌트는 기본적으로 `packages/app`에 작성한다.
- Button, Card, Badge와 디자인 토큰은 `packages/ui`에 작성한다.
- 서버 데이터 접근은 `packages/api`의 query options를 통한다.
- 웹은 `react-native`를 `react-native-web`으로 치환하므로 공통 UI를 그대로 렌더링한다.
- 브라우저 URL, 파일 선택, 오디오 엔진 등 플랫폼 API만 `apps/*` 또는 `.web/.native` 파일에 둔다.
- `packages/domain`은 React와 네트워크 라이브러리에 의존하지 않는다.

## 상태 구분

- 서버 상태: TanStack Query
- 화면 내부의 짧은 상호작용 상태: React state
- URL로 표현할 수 있는 웹 화면 상태: React Router DOM
- 전역 클라이언트 상태 저장소는 실제 교차 화면 요구가 생길 때만 도입한다.

## API 방향

현재 API 패키지는 화면 개발을 위한 mock gateway를 사용한다. 백엔드가 준비되면 같은 함수 계약을
HTTP 구현으로 교체한다. Query key는 Workspace와 Song 식별자를 항상 포함해 팀 간 캐시가 섞이지
않도록 한다.
