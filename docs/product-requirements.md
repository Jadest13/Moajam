# 제품 요구사항

## 제품 정의

모아잼은 밴드 및 합주팀의 `곡 추천 → 의견 교환 → 채택 → 자료 공유 → 파트별 연습 →
개인 녹음 → 합주 → 결정사항 기록` 흐름을 하나의 Workspace에서 관리하는 서비스다.

핵심 정보 단위는 채팅방이 아니라 **곡(Song)** 이며, 채택된 곡마다 Song Workspace가 생긴다.

## MVP 사용자 흐름

1. 회원가입 또는 로그인
2. Workspace 생성 또는 초대 참가
3. 곡 추천, 좋아요, 댓글, 채택 추천
4. Owner의 곡 채택과 Song Workspace 생성
5. 파트 배정, 자료 및 레퍼런스 등록
6. 권리를 가진 음원 업로드와 비동기 4-Stem 분리
7. Multi-track Player를 이용한 파트별 연습과 개인 녹음 Sync
8. Timeline Comment 작성
9. 합주 Session, Decision, 다음 합주 Checklist 기록

## 권한

- Owner: Workspace/멤버 관리, 곡 채택·보류, 공식 Decision과 팀 설정 관리
- Member: 추천과 상호작용, 의견·자료·레퍼런스 등록, 개인 녹음 업로드, 본인의 준비 상태 변경,
  합주 기록 작성
- Owner는 탈퇴 전에 다른 Member에게 Owner를 이전해야 한다.

## 기능 범위

### 추천과 채택

추천 상태는 `RECOMMENDED → CANDIDATE → ADOPTED | HOLD` 흐름을 따른다. 좋아요와 채택
추천은 별도 데이터이며, 모두 사용자당 한 번이고 취소할 수 있다. 자동 채택은 하지 않는다.

### Song Workspace

Overview, 의견, 자료, 연습, 합주 기록 탭으로 구성한다. 곡 정보, 파트 담당자, 실제 파트별 준비
상태, 현재 유효한 Decision, 다음 합주 Checklist를 보여준다.

### 연습과 Timeline

사용자가 직접 업로드한 음원을 Vocal, Drums, Bass, Other(나머지 반주)로 분리한다. 원곡과
Stem 모드는 동시에 재생하지 않는다. Player는 재생/일시정지, Seek, Waveform, Volume,
Mute/Solo, 동기 재생, Marker, Comment, 개인 녹음, 수동 Offset, A/B Loop를 지원한다.

Timeline Comment는 반드시 `TimelineSource + Time`에 속한다. 작성 시작 시점을 고정하며,
Comment와 Marker 양쪽에서 Seek/열기가 가능해야 한다. 원곡·Stem·Sync된 개인 녹음은 공통
Timeline을 사용하고, Reference 영상과 합주 녹음은 각각 별도 Timeline을 사용한다.

### 의견, 결정, 체크리스트

의견, Decision, Checklist는 복제하지 않고 관계로 연결한다. 구조화된 곡 의견 유형은
`IDEA`, `FIX`, `DISCUSSION`, `DECISION_CANDIDATE`다. Overview에는 현재 유효한 Decision만
표시한다.

### 자료와 레퍼런스

악보는 PDF, 이미지, Guitar Pro 등의 업로드·다운로드·지원 형식 미리보기·파트 지정·설명·삭제를
제공한다. 편집기와 Annotation은 MVP에서 제외한다. YouTube는 Reference로만 사용하며 서버가
임의로 다운로드하지 않는다.

## 명시적 비범위

- 악보/PDF/코드 편집기
- YouTube 음원의 서버 다운로드 및 Stem 생성
- 고정된 과금제와 무료 사용량
- 특정 Stem 분리 모델에 결합된 도메인 설계
