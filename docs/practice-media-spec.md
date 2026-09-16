# 연습 미디어와 악보 동기화

## 정보 구조

Song Workspace의 미디어 기능은 **보관**과 **사용**을 분리한다.

| 탭        | 책임                                                                     |
| --------- | ------------------------------------------------------------------------ |
| 자료      | 원본 음원, 악보, Reference, 생성된 Stem의 등록·상태·메타데이터·권한 관리 |
| 연습      | 음원 재생, Stem 믹싱, 악보 동기 보기, 개인 녹음 및 멤버 Take 비교        |
| 합주 기록 | 실제 합주 Session의 녹음, 참석자, 메모, Decision과 다음 Checklist 보관   |

Stem 분리는 `연습` 탭에서 실행하는 것이 기본이다. `자료`의 원본 음원 행에도 같은 분리 Job 흐름을
여는 바로가기를 제공하며, 업로드된 원본과 분리 결과물은 `자료`에서 확인하고 삭제할 수 있다. 개인
녹음은 `연습` 탭에서 만들고 비교하며, 게시된 Take만 Workspace의 다른 멤버가 재생할 수 있다.

## 미디어 흐름

1. 사용자가 권리를 가진 원본 음원을 `자료`에 업로드한다.
2. `연습`에서 Stem 분리를 요청한다.
3. Job은 `QUEUED → PROCESSING → PREPARING_AUDIO → COMPLETED | FAILED`로 진행된다.
4. 완료되면 Vocal, Drums, Bass, Other 트랙을 공통 Timeline에 배치한다.
5. 사용자는 원곡 또는 Stem 모드를 선택하고 Mute, Solo, Volume, Seek, A/B Loop를 사용한다.
6. 선택한 파트를 들으며 개인 Take를 녹음한다. Take에는 기준 Timeline과 수동 Offset이 저장된다.
7. 게시된 본인·다른 멤버 Take를 하나씩 또는 비교 모드로 불러온다.

원곡과 Stem 모드는 동시에 재생하지 않는다. 개인 Take는 선택된 기준 음원 위에 동기화하여 재생할 수
있다. YouTube는 Reference로만 열며 서버에서 다운로드하거나 Stem 원본으로 사용하지 않는다.

## 개인 녹음

- Take는 `songId`, `authorId`, `part`, `baseTimelineSourceId`, `offsetMs`, `visibility`를 가진다.
- 가시성은 `PRIVATE`, `WORKSPACE`로 구분한다. 녹음 직후에는 Private Draft가 기본이다.
- Offset은 재생 정렬값이며 원본 파일이나 Timeline Comment 시각을 변경하지 않는다.
- 다른 멤버 Take는 읽기 전용이다. 작성자만 이름, 공개 범위, Offset, 삭제를 변경할 수 있다.
- 녹음 중에는 입력 장치, 모니터링 여부, 카운트인, 지연 보정 상태를 명확히 표시한다.

## 악보 동기 재생

악보 파일 자체는 `자료`에 저장하고, 실제 재생 경험은 `연습`의 Player와 악보 Viewer를 나란히 배치한다.
사용자는 원곡, Stem, 본인 Take, 멤버 Take 중 어떤 소스를 선택해도 같은 공통 Timeline과 악보를 본다.

`ScoreSyncPoint`는 다음 값을 연결한다.

- 악보 파일과 페이지
- 선택적인 마디 또는 구간 Label
- 공통 Timeline의 `timeMs`
- 생성자와 갱신 시각

MVP에서는 PDF와 이미지 악보의 페이지 미리보기, 수동 페이지 넘김, 재생 시 Sync Point에 따른 자동 페이지
전환, 현재 구간 강조를 지원한다. 악보 내용 편집, 자동 음표 인식, 자동 마디 추출, Annotation 편집기는
범위에서 제외한다. Guitar Pro는 다운로드와 지원 가능한 정적 미리보기를 우선하며 동기 재생 지원 여부를
별도로 표시한다.

## 연습 화면 구성

- 상단: 재생/일시정지, Seek, 현재 시각, 속도, A/B Loop, Marker
- Timeline: 원곡 또는 Stem Waveform, Timeline Comment와 구간 Marker
- 악보 Pane: 페이지, 확대/축소, 자동 넘김, 현재 구간, Sync Point 편집
- Mixer Pane: Original/Stem 전환, 트랙별 Mute/Solo/Volume
- Recording Pane: 녹음 시작, 내 Take, 멤버 Take, 공개 범위, Offset, 비교 재생
- 좁은 화면: Player를 고정하고 악보와 Mixer/Recording을 탭으로 전환

## 오류와 권한

- 업로드 형식·용량 오류, Stem 처리 실패, 마이크 권한 거부, 입력 장치 없음, Sync 정보 없음 상태를 각각
  구분한다.
- 처리 실패 시 재시도할 수 있으며 사용량은 차감하지 않는다.
- 저작권 확인 없이 외부 음원을 가져오는 기능은 제공하지 않는다.
- 삭제하려는 Source가 Comment, Take, Score Sync와 연결되어 있으면 영향 범위를 먼저 보여준다.
