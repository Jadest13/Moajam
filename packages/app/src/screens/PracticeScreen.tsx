import styled from '@emotion/native';
import { Badge, Body, Button, Card, Muted, theme } from '@moajam/ui';
import { useState } from 'react';
import { View } from 'react-native';
import { AppShell } from '../components/AppShell';
import type { ScreenProps } from '../navigation';
import {
  Artwork,
  ArtworkText,
  Between,
  Input,
  Inline,
  Label,
  PageTitle,
  SectionTitle,
} from '../styles/layout';

const Timeline = styled.View`
  padding: 16px;
  gap: 11px;
  border-radius: 12px;
  background-color: #f7f9fc;
`;

const Track = styled.Pressable<{ tint: string; muted?: boolean }>`
  height: 46px;
  opacity: ${({ muted }) => (muted ? 0.35 : 1)};
  justify-content: center;
  padding: 0 12px;
  border-radius: 8px;
  background-color: ${({ tint }) => tint};
`;

const Marker = styled.View<{ position: number }>`
  position: absolute;
  left: ${({ position }) => position}%;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: ${theme.colors.danger};
`;

const trackList = [
  ['Original', '#dce4ef'],
  ['Vocal', '#f8c9dc'],
  ['Drums', '#bcd8ff'],
  ['Bass', '#bfe8d3'],
  ['나머지 반주', '#d9d0ff'],
] as const;

export function PracticeScreen({ navigate }: ScreenProps) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState<string[]>([]);
  const [position, setPosition] = useState(28);
  const [draft, setDraft] = useState('');
  const [comments, setComments] = useState([
    { id: '1', time: '01:42', text: '여기 기타 들어오는 타이밍을 반 박자 늦춰보자.' },
  ]);

  const addComment = () => {
    if (!draft.trim()) return;
    setComments((items) => [
      ...items,
      { id: String(Date.now()), time: '01:42', text: draft.trim() },
    ]);
    setDraft('');
  };

  return (
    <AppShell activeRoute="practice" onNavigate={navigate}>
      <Between>
        <Inline>
          <Artwork tint="#e86545">
            <ArtworkText>♪</ArtworkText>
          </Artwork>
          <View>
            <PageTitle>Creep</PageTitle>
            <Muted>연습 · 01:42 / 03:58</Muted>
          </View>
        </Inline>
        <Button secondary onPress={() => navigate('song')}>
          곡으로 돌아가기
        </Button>
      </Between>
      <Card>
        <Between>
          <Inline>
            <Button onPress={() => setPlaying((value) => !value)}>
              {playing ? 'Ⅱ 일시정지' : '▶ 재생'}
            </Button>
            <Button secondary onPress={() => setPosition(0)}>
              처음으로
            </Button>
            <Badge>1.0×</Badge>
          </Inline>
          <Muted>A/B Loop 준비됨</Muted>
        </Between>
        <Timeline>
          <Between>
            <Muted>00:00</Muted>
            <Muted>01:00</Muted>
            <Muted>02:00</Muted>
            <Muted>03:00</Muted>
            <Muted>03:58</Muted>
          </Between>
          <View style={{ position: 'relative', gap: 10 }}>
            {trackList.map(([name, tint]) => {
              const isMuted = muted.includes(name);
              return (
                <Track
                  key={name}
                  tint={tint}
                  muted={isMuted}
                  onPress={() =>
                    setMuted((items) =>
                      isMuted ? items.filter((item) => item !== name) : [...items, name],
                    )
                  }
                >
                  <Between>
                    <Label>{name}</Label>
                    <Muted>{isMuted ? 'MUTED' : '▂▅▃▆▇▃▅▂▆▃▇▅▂'}</Muted>
                  </Between>
                </Track>
              );
            })}
            <Marker position={position} />
          </View>
          <Input
            value={String(position)}
            onChangeText={(value) => setPosition(Math.max(0, Math.min(100, Number(value) || 0)))}
            keyboardType="numeric"
            placeholder="재생 위치 (%)"
          />
        </Timeline>
      </Card>
      <Card>
        <Between>
          <SectionTitle>타임라인 코멘트</SectionTitle>
          <Badge>{comments.length}</Badge>
        </Between>
        {comments.map((comment) => (
          <View
            key={comment.id}
            style={{ padding: 12, gap: 5, borderRadius: 10, backgroundColor: '#f7f9fc' }}
          >
            <Inline>
              <Badge tone="danger">{comment.time}</Badge>
              <Label>Guitar · 김민수</Label>
            </Inline>
            <Body>{comment.text}</Body>
          </View>
        ))}
        <Inline>
          <Input
            style={{ flex: 1 }}
            value={draft}
            onChangeText={setDraft}
            placeholder="01:42에 코멘트 남기기"
          />
          <Button onPress={addComment}>등록</Button>
        </Inline>
      </Card>
    </AppShell>
  );
}
