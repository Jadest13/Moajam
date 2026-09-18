import { useState } from 'react';
import { useIdentity } from '../state/Identity';
import { View, Linking } from 'react-native';
import { AppShell } from '../components/AppShell';
import {
  ActionButton,
  CheckItem,
  Copy,
  FlexRow,
  Heading,
  Meta,
  PageHeading,
  Pill,
  PillText,
  Progress,
  ProgressValue,
  Surface,
} from '../components/ProductUI';
import { Discussion } from '../components/Discussion';
import { MediaLibrary } from '../components/MediaLibrary';
import { useMockAppState, useWorkspaceValue } from '../state/MockAppState';
import { Input } from '../styles/layout';
import type { ScreenProps } from '../navigation';
import { shareLink } from '../lib/platformActions';

const tabs = ['개요', '의견', '자료', '연습', '합주 기록'] as const;
export function SongWorkspaceScreen({ navigate, entityId }: ScreenProps) {
  const currentUserId = useIdentity();
  const {
    adoptedSongs,
    workspaceId,
    members,
    canManage,
    updateSong,
    updatePreparation,
    rehearsals,
  } = useMockAppState();
  const song = adoptedSongs.find((item) => item.id === entityId);
  const [tab, setTab] = useState<(typeof tabs)[number]>('개요');
  const [arrangement, setArrangement] = useWorkspaceValue(`song/${entityId}/arrangement`, {
    key: 'C',
    bpm: '120',
    structure: '',
  });
  const [checks, setChecks] = useWorkspaceValue<{ id: string; label: string; done: boolean }[]>(
    `song/${entityId}/checks`,
    [],
  );
  const [draft, setDraft] = useState('');
  const [message, setMessage] = useState('');
  const [links, setLinks] = useWorkspaceValue<{ id: string; title: string; url: string }[]>(
    `song/${entityId}/links`,
    [],
  );
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  if (!song)
    return (
      <AppShell activeRoute="song" onNavigate={navigate}>
        <Surface>
          <Heading>곡을 찾을 수 없어요</Heading>
          <ActionButton onPress={() => navigate('songs')}>채택곡 목록으로</ActionButton>
        </Surface>
      </AppShell>
    );
  const sessions = rehearsals
    .filter((event) => event.songIds?.includes(song.id))
    .sort((a, b) => b.date.localeCompare(a.date));
  return (
    <AppShell activeRoute="song" onNavigate={navigate}>
      <Surface>
        <PageHeading>{song.title}</PageHeading>
        <Copy>
          {song.artist} · 내 파트 {song.myPart || '미참여'}
        </Copy>
        <FlexRow wrap>
          <ActionButton
            secondary
            onPress={() => navigate('score-editor', { id: song.id, workspaceId })}
          >
            악보 편집
          </ActionButton>
          <ActionButton
            secondary
            onPress={() =>
              void shareLink(
                `/workspaces/${encodeURIComponent(workspaceId)}/songs/${encodeURIComponent(song.id)}`,
              )
                .then(() => setMessage('곡 링크를 공유했습니다. 밴드 멤버만 열 수 있습니다.'))
                .catch(() => setMessage('공유하지 못했어요. 주소창의 링크를 복사해주세요.'))
            }
          >
            공유
          </ActionButton>
          {canManage ? (
            <ActionButton
              secondary
              onPress={() => updateSong(song.id, { archived: !song.archived })}
            >
              {song.archived ? '연습 재개' : '보관하기'}
            </ActionButton>
          ) : null}
        </FlexRow>
        {message ? <Meta accessibilityLiveRegion="polite">{message}</Meta> : null}
        <FlexRow wrap>
          {tabs.map((item) => (
            <Pill
              key={item}
              active={tab === item}
              onPress={() =>
                item === '연습' ? navigate('practice', { id: song.id }) : setTab(item)
              }
            >
              <PillText active={tab === item}>{item}</PillText>
            </Pill>
          ))}
        </FlexRow>
      </Surface>
      {tab === '개요' ? (
        <>
          <Surface>
            <Heading>파트 준비 상태</Heading>
            <Copy>
              {song.ready} / {song.total} 파트 준비 완료
            </Copy>
            <Progress>
              <ProgressValue value={song.total ? (song.ready / song.total) * 100 : 0} />
            </Progress>
            {song.participants?.[currentUserId] ? (
              <FlexRow wrap>
                {(['NOT_READY', 'PRACTICING', 'READY'] as const).map((status, index) => (
                  <Pill
                    key={status}
                    active={song.myStatus === status}
                    onPress={() => updatePreparation(workspaceId, song.id, status)}
                  >
                    <PillText active={song.myStatus === status}>
                      {['준비 전', '연습 중', '준비 완료'][index]}
                    </PillText>
                  </Pill>
                ))}
              </FlexRow>
            ) : (
              <Meta>이 곡에 참여자로 배정되지 않았습니다.</Meta>
            )}
            <ActionButton onPress={() => navigate('practice', { id: song.id })}>
              이 곡 연습하기
            </ActionButton>
            {members.map((member) => {
              const participation = song.participants?.[member.id];
              return (
                <FlexRow wrap key={member.id}>
                  <Copy>{member.name}</Copy>
                  <Meta>
                    {participation?.part || '미참여'} ·{' '}
                    {participation?.status === 'READY'
                      ? '준비 완료'
                      : participation?.status === 'PRACTICING'
                        ? '연습 중'
                        : '준비 전'}
                  </Meta>
                  {canManage ? (
                    <>
                      <Input
                        accessibilityLabel={`${member.name} 곡 파트`}
                        value={participation?.part ?? ''}
                        placeholder="곡 파트"
                        style={{ width: 150 }}
                        onChangeText={(part) =>
                          updateSong(song.id, {
                            participants: {
                              ...song.participants,
                              [member.id]: { part, status: participation?.status ?? 'NOT_READY' },
                            },
                          })
                        }
                      />
                      <ActionButton
                        secondary
                        compact
                        onPress={() => {
                          const participants = { ...song.participants };
                          if (participation) delete participants[member.id];
                          else participants[member.id] = { part: member.part, status: 'NOT_READY' };
                          updateSong(song.id, { participants });
                        }}
                      >
                        {participation ? '참여 해제' : '참여 배정'}
                      </ActionButton>
                    </>
                  ) : null}
                </FlexRow>
              );
            })}
          </Surface>
          <Surface>
            <Heading>편곡</Heading>
            <Meta>Key와 BPM, 곡 구성을 기록하세요. 변경 내용은 자동 저장됩니다.</Meta>
            <FlexRow wrap>
              <Input
                editable={canManage}
                accessibilityLabel="곡 Key"
                value={arrangement.key}
                onChangeText={(key) => setArrangement({ ...arrangement, key })}
                style={{ width: 100 }}
              />
              <Input
                editable={canManage}
                accessibilityLabel="곡 BPM"
                value={arrangement.bpm}
                keyboardType="numeric"
                onChangeText={(bpm) => {
                  if (/^\d{0,3}$/.test(bpm)) setArrangement({ ...arrangement, bpm });
                }}
                style={{ width: 100 }}
              />
            </FlexRow>
            <Input
              editable={canManage}
              multiline
              value={arrangement.structure}
              onChangeText={(structure) => setArrangement({ ...arrangement, structure })}
              placeholder="Intro / Verse / Chorus / Ending"
            />
          </Surface>
          <Surface>
            <Heading>다음 합주 확인사항</Heading>
            {checks.map((item) => (
              <FlexRow key={item.id}>
                <View style={{ flex: 1 }}>
                  <CheckItem
                    checked={item.done}
                    label={item.label}
                    onPress={() =>
                      setChecks((all) =>
                        all.map((value) =>
                          value.id === item.id ? { ...value, done: !value.done } : value,
                        ),
                      )
                    }
                  />
                </View>
                <ActionButton
                  secondary
                  compact
                  onPress={() => setChecks((all) => all.filter((value) => value.id !== item.id))}
                >
                  삭제
                </ActionButton>
              </FlexRow>
            ))}
            <Input value={draft} onChangeText={setDraft} placeholder="확인할 내용" />
            <ActionButton
              secondary
              disabled={!draft.trim()}
              onPress={() => {
                setChecks((all) => [
                  ...all,
                  { id: `check-${Date.now()}`, label: draft.trim(), done: false },
                ]);
                setDraft('');
              }}
            >
              항목 추가
            </ActionButton>
          </Surface>
        </>
      ) : null}
      {tab === '의견' ? <Discussion documentKey={`song/${song.id}/discussion`} /> : null}
      {tab === '자료' ? (
        <>
          <MediaLibrary
            key={`${workspaceId}/${song.id}`}
            scopeKey={`song/${workspaceId}/${song.id}`}
          />
          <Surface>
            <Heading>레퍼런스</Heading>
            {links.map((link) => (
              <FlexRow wrap key={link.id}>
                <Copy style={{ flex: 1 }}>
                  {link.title} · {link.url}
                </Copy>
                <ActionButton secondary compact onPress={() => void Linking.openURL(link.url)}>
                  열기
                </ActionButton>
                <ActionButton
                  secondary
                  compact
                  onPress={() => setLinks((all) => all.filter((item) => item.id !== link.id))}
                >
                  삭제
                </ActionButton>
              </FlexRow>
            ))}
            <Input value={linkTitle} onChangeText={setLinkTitle} placeholder="레퍼런스 이름" />
            <Input value={linkUrl} onChangeText={setLinkUrl} placeholder="https://" />
            <ActionButton
              secondary
              disabled={!linkTitle.trim()}
              onPress={() => {
                try {
                  const url = new URL(linkUrl);
                  if (!['https:', 'http:'].includes(url.protocol)) throw new Error();
                  setLinks((all) => [
                    ...all,
                    { id: `link-${Date.now()}`, title: linkTitle.trim(), url: url.href },
                  ]);
                  setLinkTitle('');
                  setLinkUrl('');
                } catch {
                  setMessage('http 또는 https 링크를 입력해주세요.');
                }
              }}
            >
              링크 추가
            </ActionButton>
          </Surface>
        </>
      ) : null}
      {tab === '합주 기록' ? (
        <Surface>
          <Heading>이 곡의 합주</Heading>
          {sessions.map((event) => (
            <FlexRow wrap key={event.id}>
              <Copy style={{ flex: 1 }}>
                {event.date} · {event.title}
                {event.cancelled ? ' · 취소됨' : ''}
              </Copy>
              <ActionButton secondary onPress={() => navigate('rehearsals', { id: event.id })}>
                기록 열기
              </ActionButton>
            </FlexRow>
          ))}
          {!sessions.length ? (
            <Meta>합주 화면에서 이 곡을 세트리스트에 추가하면 기록이 표시됩니다.</Meta>
          ) : null}
          <ActionButton secondary onPress={() => navigate('rehearsals')}>
            밴드 합주 보기
          </ActionButton>
        </Surface>
      ) : null}
    </AppShell>
  );
}
