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
                              │   └─ TimelineSource
                              │       ├─ Stem / Recording
                              │       └─ TimelineComment
                              └─ RehearsalSession
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
