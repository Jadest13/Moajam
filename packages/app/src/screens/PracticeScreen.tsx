import { theme } from '@moajam/ui';
import { useState } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { AppShell } from '../components/AppShell';
import {
  ActionButton,
  Copy,
  FlexBetween,
  FlexRow,
  Heading,
  Meta,
  Pill,
  PillText,
  ResponsiveGrid,
  Slider,
  SongCover,
  Stack,
  Surface,
  Waveform,
} from '../components/ProductUI';
import type { ScreenProps } from '../navigation';
import { Input } from '../styles/layout';

const stems = [
  { name: 'Vocal', color: '#ef79a8', volume: 74 },
  { name: 'Drums', color: '#4f91ed', volume: 82 },
  { name: 'Bass', color: '#39b77c', volume: 68 },
  { name: 'Guitar', color: '#8b68df', volume: 88 },
];
const takes = [
  { name: '김민수 · Guitar · Take 4', time: '오늘 14:24', color: '#4f91ed' },
  { name: '이영희 · Vocal · Take 2', time: '어제 22:10', color: '#ef79a8' },
  { name: '박준호 · Bass · Take 1', time: '9월 8일', color: '#39b77c' },
];

export function PracticeScreen({ navigate }: ScreenProps) {
  const { width } = useWindowDimensions();
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState<string[]>([]);
  const [solo, setSolo] = useState<string | null>(null);
  const [view, setView] = useState<'트랙' | '악보'>('트랙');
  const [recording, setRecording] = useState(false);
  const [draft, setDraft] = useState('');
  const [comments, setComments] = useState([
    { id: '1', time: '01:42', author: '김민수', text: '기타 진입을 반 박자 늦춰보면 좋겠어요.' },
  ]);
  const toggleMute = (name: string) =>
    setMuted((all) => (all.includes(name) ? all.filter((item) => item !== name) : [...all, name]));
  const addComment = () => {
    if (!draft.trim()) return;
    setComments((all) => [
      ...all,
      { id: String(Date.now()), time: '01:42', author: '김민수', text: draft.trim() },
    ]);
    setDraft('');
  };

  return (
    <AppShell
      activeRoute="practice"
      onNavigate={navigate}
      comingSoon="채택곡 연습은 추후 개발됩니다"
      onComingSoonBack={() => navigate('song')}
    >
      <FlexBetween style={width < 650 ? { alignItems: 'flex-start' } : undefined}>
        <FlexRow>
          <SongCover id="creep" size={58} />
          <View>
            <Heading>Creep</Heading>
            <Meta>Radiohead · 개인 연습</Meta>
          </View>
        </FlexRow>
        <FlexRow>
          <ActionButton secondary onPress={() => navigate('song')}>
            {width < 650 ? '곡으로' : '곡으로 돌아가기'}
          </ActionButton>
          {width >= 650 ? (
            <ActionButton secondary onPress={() => navigate('score-editor')}>
              악보 편집
            </ActionButton>
          ) : null}
        </FlexRow>
      </FlexBetween>

      <Surface>
        <FlexBetween>
          <FlexRow>
            <Pressable
              onPress={() => setPlaying(!playing)}
              style={{
                width: 48,
                height: 48,
                borderRadius: 25,
                backgroundColor: theme.colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: 'white', fontSize: 17, fontWeight: '900' }}>
                {playing ? 'Ⅱ' : '▶'}
              </Text>
            </Pressable>
            <View>
              <Copy style={{ fontWeight: '900' }}>01:42 / 03:58</Copy>
              <Meta>Chorus · 25마디</Meta>
            </View>
          </FlexRow>
          <FlexRow>
            <Pill>
              <PillText>A ↔ B</PillText>
            </Pill>
            <Pill>
              <PillText>1.0×</PillText>
            </Pill>
            <Pill>
              <PillText>♩ 92</PillText>
            </Pill>
          </FlexRow>
        </FlexBetween>
        <FlexRow>
          {['Intro', 'Verse 1', 'Chorus', 'Verse 2', 'Chorus', 'Outro'].map((item, index) => (
            <View
              key={`${item}-${index}`}
              style={{
                flex: 1,
                height: 28,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: index === 2 ? '#ffe5b9' : index % 2 ? '#e8f4ec' : '#e6edff',
              }}
            >
              <Meta>{item}</Meta>
            </View>
          ))}
        </FlexRow>
        <FlexBetween>
          <Meta>00:00</Meta>
          <Meta>01:00</Meta>
          <Meta>02:00</Meta>
          <Meta>03:00</Meta>
          <Meta>03:58</Meta>
        </FlexBetween>
      </Surface>

      <ResponsiveGrid stacked={width < 1000}>
        <Stack gap={16} style={width < 1000 ? undefined : { flex: 1.55 }}>
          <Surface>
            <FlexBetween>
              <Heading>원곡 및 Stem</Heading>
              <FlexRow>
                <Pill active={view === '트랙'} onPress={() => setView('트랙')}>
                  <PillText active={view === '트랙'}>트랙</PillText>
                </Pill>
                <Pill active={view === '악보'} onPress={() => setView('악보')}>
                  <PillText active={view === '악보'}>악보</PillText>
                </Pill>
              </FlexRow>
            </FlexBetween>
            {view === '트랙' ? (
              <Stack gap={10}>
                <TrackRow
                  name="Original"
                  color="#7f8da4"
                  volume={90}
                  muted={muted.includes('Original')}
                  solo={solo === 'Original'}
                  onMute={() => toggleMute('Original')}
                  onSolo={() => setSolo(solo === 'Original' ? null : 'Original')}
                />
                {stems.map((stem) => (
                  <TrackRow
                    key={stem.name}
                    {...stem}
                    muted={muted.includes(stem.name)}
                    solo={solo === stem.name}
                    onMute={() => toggleMute(stem.name)}
                    onSolo={() => setSolo(solo === stem.name ? null : stem.name)}
                  />
                ))}
              </Stack>
            ) : (
              <ScorePreview />
            )}
          </Surface>

          <Surface>
            <FlexBetween>
              <View>
                <Heading>내 녹음 트랙</Heading>
                <Meta>원곡·스템·악보를 들으며 내 파트를 녹음하세요.</Meta>
              </View>
              <ActionButton onPress={() => setRecording(!recording)}>
                {recording ? '■ 녹음 끝내기' : '● 녹음 시작'}
              </ActionButton>
            </FlexBetween>
            {recording ? (
              <View style={{ padding: 12, borderRadius: 10, backgroundColor: '#fff0f1' }}>
                <Copy style={{ color: theme.colors.danger, fontWeight: '900' }}>● REC 00:18</Copy>
                <Waveform color={theme.colors.danger} height={38} />
              </View>
            ) : null}
            {takes.map((take, index) => (
              <FlexRow key={take.name}>
                <Pressable
                  onPress={() => setPlaying(!playing)}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 18,
                    backgroundColor: '#eef3ff',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: theme.colors.primary }}>▶</Text>
                </Pressable>
                <View style={{ flex: 1 }}>
                  <Copy style={{ fontWeight: index === 0 ? '900' : '700' }}>{take.name}</Copy>
                  <Meta>
                    {take.time}
                    {index === 0 ? ' · 내 녹음' : ' · 팀 공개'}
                  </Meta>
                </View>
                <Waveform color={take.color} height={30} />
                <ActionButton secondary compact>
                  •••
                </ActionButton>
              </FlexRow>
            ))}
          </Surface>
        </Stack>

        <Stack gap={16} style={width < 1000 ? undefined : { flex: 0.85 }}>
          <Surface>
            <FlexBetween>
              <Heading>타임라인 코멘트</Heading>
              <Pill>
                <PillText>{comments.length}</PillText>
              </Pill>
            </FlexBetween>
            {comments.map((comment) => (
              <View
                key={comment.id}
                style={{ padding: 11, gap: 5, borderRadius: 10, backgroundColor: '#f7f9fc' }}
              >
                <FlexRow>
                  <Pill tone="red">
                    <PillText tone="red">{comment.time}</PillText>
                  </Pill>
                  <Copy style={{ fontWeight: '800' }}>{comment.author}</Copy>
                </FlexRow>
                <Copy>{comment.text}</Copy>
                <Meta>좋아요 2 · 답글</Meta>
              </View>
            ))}
            <Input
              value={draft}
              onChangeText={setDraft}
              placeholder="현재 위치에 코멘트 남기기"
              multiline
            />
            <ActionButton onPress={addComment}>코멘트 등록</ActionButton>
          </Surface>
          <Surface tint="#f8faff">
            <Heading>연습 도구</Heading>
            <ActionButton secondary onPress={() => navigate('instrument')}>
              내 악기만 추출하기
            </ActionButton>
            <ActionButton secondary onPress={() => navigate('score-editor')}>
              악보·음원 싱크 맞추기
            </ActionButton>
          </Surface>
        </Stack>
      </ResponsiveGrid>
    </AppShell>
  );
}

function TrackRow({
  name,
  color,
  volume,
  muted,
  solo,
  onMute,
  onSolo,
}: {
  name: string;
  color: string;
  volume: number;
  muted: boolean;
  solo: boolean;
  onMute: () => void;
  onSolo: () => void;
}) {
  return (
    <FlexRow>
      <Copy style={{ width: 65, fontWeight: '800' }}>{name}</Copy>
      <Waveform color={color} height={38} />
      <Pressable
        onPress={onMute}
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: muted ? theme.colors.primary : '#eef2f7',
        }}
      >
        <Meta style={{ color: muted ? 'white' : theme.colors.text }}>M</Meta>
      </Pressable>
      <Pressable
        onPress={onSolo}
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: solo ? '#e7a413' : '#eef2f7',
        }}
      >
        <Meta style={{ color: solo ? 'white' : theme.colors.text }}>S</Meta>
      </Pressable>
      <View style={{ width: 80 }}>
        <Slider value={muted ? 0 : volume} color={color} />
      </View>
    </FlexRow>
  );
}

function ScorePreview() {
  return (
    <View
      style={{
        padding: 20,
        gap: 25,
        backgroundColor: '#fffdfa',
        borderWidth: 1,
        borderColor: '#eee9df',
        borderRadius: 8,
      }}
    >
      {[0, 1, 2].map((row) => (
        <View key={row} style={{ gap: 7 }}>
          {[0, 1, 2, 3, 4].map((line) => (
            <View key={line} style={{ height: 1, backgroundColor: '#657080' }} />
          ))}
          <View
            style={{
              position: 'absolute',
              left: `${28 + row * 12}%`,
              top: 0,
              bottom: 0,
              width: 2,
              backgroundColor: theme.colors.primary,
            }}
          />
        </View>
      ))}
      <Meta>재생 위치에 맞춰 악보가 자동으로 넘어갑니다.</Meta>
    </View>
  );
}
