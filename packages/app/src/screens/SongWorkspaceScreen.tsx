import { theme } from '@moajam/ui';
import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { AppShell } from '../components/AppShell';
import {
  ActionButton,
  CheckItem,
  Copy,
  Divider,
  FlexBetween,
  FlexRow,
  Heading,
  Meta,
  PageHeading,
  Pill,
  PillText,
  Progress,
  ProgressValue,
  ResponsiveGrid,
  SongCover,
  Stack,
  Surface,
} from '../components/ProductUI';
import { AppIcon } from '../components/icons';
import { initialChecklist, members, preparations } from '../mocks/data';
import type { ScreenProps } from '../navigation';
import { Avatar, AvatarText, Input } from '../styles/layout';

const tabs = ['개요', '의견', '자료', '연습', '합주 기록'] as const;
type Tab = (typeof tabs)[number];

export function SongWorkspaceScreen({ navigate }: ScreenProps) {
  const { width } = useWindowDimensions();
  const [tab, setTab] = useState<Tab>('개요');
  return (
    <AppShell activeRoute="song" onNavigate={navigate}>
      <Surface>
        <FlexBetween>
          <FlexRow gap={16}>
            <SongCover id="creep" size={88} />
            <View style={{ gap: 5 }}>
              <PageHeading>Creep</PageHeading>
              <Copy>Radiohead</Copy>
              <FlexRow wrap>
                <Pill>
                  <PillText>Rock</PillText>
                </Pill>
                <Pill>
                  <PillText>Key G</PillText>
                </Pill>
                <Pill>
                  <PillText>BPM 92</PillText>
                </Pill>
                <Pill tone="amber">
                  <PillText tone="amber">연습 중</PillText>
                </Pill>
              </FlexRow>
            </View>
          </FlexRow>
          {width > 650 ? (
            <FlexRow>
              <ActionButton secondary onPress={() => navigate('score-editor')}>
                악보 편집
              </ActionButton>
              <ActionButton>공유</ActionButton>
            </FlexRow>
          ) : null}
        </FlexBetween>
        <Divider />
        <FlexRow wrap>
          {tabs.map((item) => (
            <Pill
              key={item}
              active={tab === item}
              onPress={() => (item === '연습' ? navigate('practice') : setTab(item))}
            >
              <PillText active={tab === item}>{item}</PillText>
            </Pill>
          ))}
        </FlexRow>
      </Surface>
      {tab === '개요' ? <Overview /> : null}
      {tab === '의견' ? <Opinions /> : null}
      {tab === '자료' ? <Resources navigate={navigate} /> : null}
      {tab === '합주 기록' ? <SongHistory navigate={navigate} /> : null}
    </AppShell>
  );
}

function Overview() {
  const { width } = useWindowDimensions();
  const [checks, setChecks] = useState(initialChecklist);
  return (
    <ResponsiveGrid stacked={width < 900}>
      <Stack gap={16} style={width < 900 ? undefined : { flex: 1 }}>
        <Surface>
          <FlexBetween>
            <Heading>현재 편곡</Heading>
            <ActionButton secondary compact>
              수정하기
            </ActionButton>
          </FlexBetween>
          {[
            ['Key', 'G'],
            ['BPM', '92'],
            ['Intro', '8마디'],
            ['Solo', '16마디'],
            ['Ending', 'Chorus ×2 → Stop'],
          ].map(([key, value]) => (
            <FlexBetween key={key}>
              <Meta>{key}</Meta>
              <Copy style={{ fontWeight: '800' }}>{value}</Copy>
            </FlexBetween>
          ))}
        </Surface>
        <Surface>
          <Heading>다음 합주 확인사항</Heading>
          {checks.map((item) => (
            <CheckItem
              key={item.id}
              checked={item.done}
              label={item.label}
              onPress={() =>
                setChecks((all) =>
                  all.map((check) =>
                    check.id === item.id ? { ...check, done: !check.done } : check,
                  ),
                )
              }
            />
          ))}
        </Surface>
        <Surface>
          <FlexBetween>
            <Heading>관련 링크</Heading>
            <ActionButton secondary compact>
              + 추가
            </ActionButton>
          </FlexBetween>
          <Copy>▶ 원곡 (YouTube)</Copy>
          <Meta>https://youtu.be/XFkzRNyygfk</Meta>
          <Copy>● Spotify</Copy>
          <Meta>open.spotify.com/track/creep</Meta>
        </Surface>
      </Stack>
      <Stack gap={16} style={width < 900 ? undefined : { flex: 1 }}>
        <Surface>
          <FlexBetween>
            <Heading>파트 담당자 및 준비 상태</Heading>
            <Meta>2 / 4 Ready</Meta>
          </FlexBetween>
          <Progress>
            <ProgressValue value={50} />
          </Progress>
          {preparations.map((item, index) => (
            <FlexBetween key={item.id}>
              <FlexRow>
                <Avatar color={members[index]?.color} size={34}>
                  <AvatarText>{members[index]?.initials}</AvatarText>
                </Avatar>
                <View>
                  <Copy style={{ fontWeight: '800' }}>{item.part}</Copy>
                  <Meta>{item.member}</Meta>
                </View>
              </FlexRow>
              <Pill
                tone={
                  item.status === 'READY' ? 'green' : item.status === 'PRACTICING' ? 'amber' : 'red'
                }
              >
                <PillText
                  tone={
                    item.status === 'READY'
                      ? 'green'
                      : item.status === 'PRACTICING'
                        ? 'amber'
                        : 'red'
                  }
                >
                  {item.status === 'READY'
                    ? '준비 완료'
                    : item.status === 'PRACTICING'
                      ? '연습 중'
                      : '미준비'}
                </PillText>
              </Pill>
            </FlexBetween>
          ))}
        </Surface>
        <Surface tint="#f6f8ff">
          <FlexRow>
            <View style={{ flex: 1 }}>
              <Heading>다음 합주</Heading>
              <Copy style={{ fontWeight: '900' }}>9월 12일 (토) · 18:00</Copy>
              <Meta>홍대 합주실 A룸</Meta>
            </View>
            <AppIcon name="calendar" color={theme.colors.primary} size={28} />
          </FlexRow>
        </Surface>
      </Stack>
    </ResponsiveGrid>
  );
}

function Opinions() {
  const { width } = useWindowDimensions();
  const [draft, setDraft] = useState('');
  const [filter, setFilter] = useState('전체');
  const [items, setItems] = useState([
    {
      id: '1',
      author: '박지수',
      part: 'Drums',
      time: '2일 전',
      text: '후렴 직전에 전체 다이내믹을 한 단계 낮췄다가 한 번에 터뜨리면 좋겠어요.',
      replies: 3,
      resolved: false,
    },
    {
      id: '2',
      author: '김민수',
      part: 'Guitar',
      time: '3일 전',
      text: '2절 첫 8마디는 Guitar 1을 빼고 보컬을 살려봅시다.',
      replies: 1,
      resolved: true,
    },
    {
      id: '3',
      author: '이영희',
      part: 'Vocal',
      time: '5일 전',
      text: 'Key G가 편하고 코러스 화음도 안정적으로 나와요.',
      replies: 2,
      resolved: false,
    },
  ]);
  const add = () => {
    if (!draft.trim()) return;
    setItems((all) => [
      {
        id: String(Date.now()),
        author: '김민수',
        part: 'Guitar',
        time: '방금',
        text: draft.trim(),
        replies: 0,
        resolved: false,
      },
      ...all,
    ]);
    setDraft('');
  };
  const shown = items.filter(
    (item) => filter === '전체' || (filter === '결정됨' ? item.resolved : !item.resolved),
  );
  return (
    <ResponsiveGrid stacked={width < 920}>
      <Stack gap={16} style={width < 920 ? undefined : { flex: 1.5 }}>
        <Surface>
          <Heading>새 의견 남기기</Heading>
          <Input
            value={draft}
            onChangeText={setDraft}
            placeholder="편곡, 톤, 연주 방식에 대한 의견을 남겨주세요."
            multiline
            style={{ minHeight: 92 }}
          />
          <FlexBetween>
            <Meta>특정 구간은 연습 화면에서 타임라인 코멘트로 남길 수 있어요.</Meta>
            <ActionButton onPress={add}>등록</ActionButton>
          </FlexBetween>
        </Surface>
        <FlexRow>
          {['전체', '논의 중', '결정됨'].map((item) => (
            <Pill key={item} active={filter === item} onPress={() => setFilter(item)}>
              <PillText active={filter === item}>{item}</PillText>
            </Pill>
          ))}
        </FlexRow>
        {shown.map((item) => (
          <Surface key={item.id}>
            <FlexBetween>
              <FlexRow>
                <Avatar color="#d7e8ff">
                  <AvatarText>{item.author.slice(1)}</AvatarText>
                </Avatar>
                <View>
                  <Copy style={{ fontWeight: '900' }}>{item.author}</Copy>
                  <Meta>
                    {item.part} · {item.time}
                  </Meta>
                </View>
              </FlexRow>
              <Pill tone={item.resolved ? 'green' : 'amber'}>
                <PillText tone={item.resolved ? 'green' : 'amber'}>
                  {item.resolved ? '결정됨' : '논의 중'}
                </PillText>
              </Pill>
            </FlexBetween>
            <Copy>{item.text}</Copy>
            <FlexBetween>
              <Meta>
                댓글 {item.replies}개 · 좋아요 {item.replies + 2}
              </Meta>
              <ActionButton
                secondary
                compact
                onPress={() =>
                  setItems((all) =>
                    all.map((value) =>
                      value.id === item.id ? { ...value, resolved: !value.resolved } : value,
                    ),
                  )
                }
              >
                {item.resolved ? '다시 논의' : '결정으로 표시'}
              </ActionButton>
            </FlexBetween>
          </Surface>
        ))}
      </Stack>
      <Stack gap={16} style={width < 920 ? undefined : { flex: 0.8 }}>
        <Surface>
          <Heading>의견 요약</Heading>
          <FlexBetween>
            <Meta>전체 의견</Meta>
            <Copy style={{ fontWeight: '900' }}>{items.length}</Copy>
          </FlexBetween>
          <FlexBetween>
            <Meta>결정된 내용</Meta>
            <Copy style={{ fontWeight: '900' }}>
              {items.filter((item) => item.resolved).length}
            </Copy>
          </FlexBetween>
          <FlexBetween>
            <Meta>참여 멤버</Meta>
            <Copy style={{ fontWeight: '900' }}>4명</Copy>
          </FlexBetween>
        </Surface>
        <Surface tint="#f8faff">
          <Heading>정리된 결정</Heading>
          <Copy>✓ Key는 G로 유지</Copy>
          <Copy>✓ Intro 8마디</Copy>
          <Copy>✓ 2절 Guitar 1 제외</Copy>
        </Surface>
      </Stack>
    </ResponsiveGrid>
  );
}

function Resources({ navigate }: { navigate: ScreenProps['navigate'] }) {
  const [type, setType] = useState('전체');
  const files = [
    ['Creep_Chord.pdf', '악보 · 김민수 · 2.4MB'],
    ['Guitar_TAB.pdf', '타브 · 이영희 · 1.8MB'],
    ['Drums_Score.pdf', '드럼 악보 · 박지수 · 3.1MB'],
    ['band_guide_v3.mp3', '가이드 음원 · 03:58'],
  ];
  return (
    <ResponsiveGrid stacked={useWindowDimensions().width < 850}>
      <Stack gap={14} style={{ flex: 1.2 }}>
        <FlexBetween>
          <FlexRow>
            {['전체', '악보', '음원', '링크'].map((item) => (
              <Pill key={item} active={type === item} onPress={() => setType(item)}>
                <PillText active={type === item}>{item}</PillText>
              </Pill>
            ))}
          </FlexRow>
          <ActionButton>+ 파일 업로드</ActionButton>
        </FlexBetween>
        {files.map(([name, detail], index) => (
          <Surface key={name}>
            <FlexRow>
              <View
                style={{
                  width: 46,
                  height: 54,
                  borderRadius: 8,
                  backgroundColor: index === 3 ? '#e8f6ee' : '#eef3ff',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Copy
                  style={{
                    color: index === 3 ? '#15905e' : theme.colors.primary,
                    fontWeight: '900',
                  }}
                >
                  {index === 3 ? '♪' : 'PDF'}
                </Copy>
              </View>
              <View style={{ flex: 1 }}>
                <Copy style={{ fontWeight: '900' }}>{name}</Copy>
                <Meta>{detail}</Meta>
              </View>
              <ActionButton secondary compact>
                다운로드
              </ActionButton>
            </FlexRow>
          </Surface>
        ))}
      </Stack>
      <Stack gap={14} style={{ flex: 0.8 }}>
        <Surface>
          <Heading>악보 미리보기</Heading>
          <View
            style={{
              height: 250,
              padding: 20,
              gap: 22,
              backgroundColor: '#fffdfa',
              borderWidth: 1,
              borderColor: '#eee9df',
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={{ gap: 5 }}>
                {[0, 1, 2, 3, 4].map((line) => (
                  <View key={line} style={{ height: 1, backgroundColor: '#7b8390' }} />
                ))}
              </View>
            ))}
          </View>
          <ActionButton onPress={() => navigate('score-editor')}>악보 편집에서 열기</ActionButton>
        </Surface>
        <Surface>
          <Heading>레퍼런스</Heading>
          <Copy>▶ Radiohead - Creep (Official Video)</Copy>
          <Meta>YouTube · 4:07</Meta>
          <Divider />
          <Copy>● Spotify 원곡</Copy>
          <Meta>앨범 Pablo Honey</Meta>
        </Surface>
      </Stack>
    </ResponsiveGrid>
  );
}

function SongHistory({ navigate }: { navigate: ScreenProps['navigate'] }) {
  const sessions = [
    [
      '2024년 9월 12일',
      '홍대 합주실 A룸',
      'Intro·Ending을 집중적으로 맞추고 Guitar tone을 조정했어요.',
      '48:32',
    ],
    [
      '2024년 9월 5일',
      '합정 합주실 B룸',
      '첫 합주. Key와 곡 구성을 정하고 파트를 확정했어요.',
      '36:18',
    ],
  ];
  return (
    <ResponsiveGrid stacked={useWindowDimensions().width < 900}>
      <Stack gap={14} style={{ flex: 1.35 }}>
        {sessions.map(([date, place, summary, length], index) => (
          <Surface key={date}>
            <FlexBetween>
              <FlexRow>
                <View
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 10,
                    backgroundColor: '#edf3ff',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AppIcon name="calendar" color={theme.colors.primary} />
                </View>
                <View>
                  <Heading>{date}</Heading>
                  <Meta>{place}</Meta>
                </View>
              </FlexRow>
              <Pill tone={index === 0 ? 'green' : undefined}>
                <PillText tone={index === 0 ? 'green' : undefined}>
                  {index === 0 ? '최근 합주' : '완료'}
                </PillText>
              </Pill>
            </FlexBetween>
            <Copy>{summary}</Copy>
            <FlexRow>
              <ActionButton secondary compact>
                ▶ 녹음 {length}
              </ActionButton>
              <ActionButton secondary compact>
                기록 상세
              </ActionButton>
            </FlexRow>
          </Surface>
        ))}
      </Stack>
      <Stack gap={14} style={{ flex: 0.8 }}>
        <Surface>
          <Heading>곡 변화</Heading>
          <Copy>Key C → G</Copy>
          <Meta>9월 5일 결정</Meta>
          <Divider />
          <Copy>Intro 4 → 8마디</Copy>
          <Meta>9월 12일 결정</Meta>
          <Divider />
          <Copy>Ending Chorus ×2</Copy>
          <Meta>9월 12일 결정</Meta>
        </Surface>
        <Surface tint="#f8faff">
          <Heading>전체 합주 기록</Heading>
          <Meta>다른 곡을 포함한 팀의 모든 합주를 확인하세요.</Meta>
          <ActionButton onPress={() => navigate('rehearsals')}>합주 페이지로</ActionButton>
        </Surface>
      </Stack>
    </ResponsiveGrid>
  );
}
