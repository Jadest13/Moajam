# 도메인 모델

## 관계

```text
User ─< WorkspaceMember >─ Workspace
                              ├─ Recommendation
                              ├─ Song
                              │   ├─ SongPart
                              │   ├─ PreparationStatus
                              │   ├─ Opinion
                              │   ├─ Decision ─> Opinion / TimelineComment
                              │   ├─ Checklist ─> Decision
                              │   ├─ Resource / Reference
                              │   ├─ ScoreAsset ─< ScoreSyncPoint
                              │   ├─ StemJob ─< Stem
                              │   ├─ PracticeTake
                              │   └─ TimelineSource
                              │       ├─ Stem / Recording
                              │       └─ TimelineComment
                              └─ RehearsalSession
User ── PersonalWorkspace
          ├─ PersonalAudioProject ─< DominantInstrumentExtractionJob
          │                           └─ ExtractedInstrumentTrack
          └─ EditableScore ─< ScoreRevision
```

## 주요 상태

- 역할: `OWNER`, `MEMBER`
- 기본 파트: `VOCAL`, `GUITAR`, `BASS`, `DRUMS`, `KEYBOARD`, `OTHER`
- 준비: `NOT_READY`, `PRACTICING`, `READY`
- 추천: `RECOMMENDED`, `CANDIDATE`, `ADOPTED`, `HOLD`
- 업로드/처리: `UPLOADING`, `UPLOADED`, `QUEUED`, `PROCESSING`, `PREPARING_AUDIO`,
  `COMPLETED`, `FAILED`

## 불변 조건

1. 좋아요와 채택 추천은 서로 독립적이다.
2. 곡 채택과 공식 Decision 변경은 Owner 권한을 확인한다.
3. 준비도는 임의 퍼센트가 아니라 실제 담당 파트의 상태를 집계한다.
4. Timeline Comment는 항상 `timelineSourceId`를 가진다.
5. Sync Offset 변경은 공통 Timeline Comment 시각을 변경하지 않는다.
6. Stem 캐시는 `workspaceId + source SHA-256 + separation configuration`으로 격리한다.
7. 실패한 처리 Job은 사용량을 소비하지 않는다.
8. ScoreSyncPoint의 `timeMs`는 Song의 공통 Timeline을 기준으로 한다.
9. PracticeTake의 Offset 변경은 원본 Source와 ScoreSyncPoint를 변경하지 않는다.
10. `PRIVATE` PracticeTake는 작성자 외의 Workspace Member에게 노출하지 않는다.

## 미디어 엔터티

- `ScoreAsset`: PDF, 이미지, Guitar Pro 등 악보 자료와 파트·지원 기능 메타데이터
- `ScoreSyncPoint`: 악보 페이지·구간과 공통 Timeline 시각의 연결
- `StemJob`: 원본 Source에 대한 분리 요청과 처리 상태
- `Stem`: StemJob에서 생성된 Vocal, Drums, Bass, Other TimelineSource
- `PracticeTake`: 멤버의 개인 녹음, 담당 파트, 기준 Source, Offset, 공개 범위
- `RehearsalRecording`: RehearsalSession에 속하며 공통 연습 Timeline과 분리된 별도 TimelineSource

## 개인 작업실 엔터티

- `PersonalAudioProject`: 개인 원본 음원, 분석 설정, 최근 분석 결과
- `DominantInstrumentExtractionJob`: Target Instrument, 우세도 분석, 분리 설정과 처리 상태
- `ExtractedInstrumentTrack`: 원본에서 분리된 대상 악기, 품질 지표, 누음 경고와 출력 설정
- `EditableScore`: 파트·마디·음표를 가진 구조화 악보 문서와 기준 음원 연결
- `ScoreRevision`: 자동 저장과 별도로 복원 가능한 악보 Snapshot

개인 엔터티에는 `workspaceId`를 강제하지 않는다. Workspace로 보낼 때 새 Resource를 생성하며 개인
원본과 자동 동기화하지 않는다.
