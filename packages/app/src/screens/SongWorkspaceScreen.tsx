import { Badge, Body, Button, Card, Muted, Stack, theme } from '@moajam/ui';
import { useState } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import { AppShell } from '../components/AppShell';
import { initialChecklist, preparations } from '../mocks/data';
import type { ScreenProps } from '../navigation';
import {
  Artwork,
  ArtworkText,
  Between,
  Chip,
  ChipText,
  Column,
  Grid,
  Inline,
  Label,
  PageTitle,
  ProgressFill,
  ProgressTrack,
  SectionTitle,
} from '../styles/layout';

const tabs = ['개요', '의견', '자료', '연습', '합주 기록'] as const;

export function SongWorkspaceScreen({ navigate }: ScreenProps) {
  const { width } = useWindowDimensions();
  const [tab, setTab] = useState<(typeof tabs)[number]>('개요');
  const [checklist, setChecklist] = useState(initialChecklist);

  return (
    <AppShell activeRoute="song" onNavigate={navigate}>
      <Card>
        <Between>
          <Inline gap={16}>
            <Artwork tint="#e86545" size={86}>
              <ArtworkText>♪</ArtworkText>
            </Artwork>
            <View>
              <PageTitle>Creep</PageTitle>
              <Muted>Radiohead</Muted>
              <Inline wrap>
                <Badge>Rock</Badge>
                <Badge>Key G</Badge>
                <Badge>BPM 92</Badge>
              </Inline>
            </View>
          </Inline>
          {width > 620 && (
            <Inline>
              <Button secondary>편집</Button>
              <Button>공유</Button>
            </Inline>
          )}
        </Between>
        <Inline wrap>
          {tabs.map((item) => (
            <Chip key={item} active={tab === item} onPress={() => setTab(item)}>
              <ChipText active={tab === item}>{item}</ChipText>
            </Chip>
          ))}
        </Inline>
      </Card>

      {tab === '개요' && (
        <Grid stacked={width < 900}>
          <Column style={width < 900 ? undefined : { flex: 1 }}>
            <Card>
              <Between>
                <SectionTitle>현재 연습 정보</SectionTitle>
                <Badge tone="warning">연습 중</Badge>
              </Between>
              <Inline>
                <Label>Key</Label>
                <Body>G</Body>
              </Inline>
              <Inline>
                <Label>BPM</Label>
                <Body>92</Body>
              </Inline>
              <Inline>
                <Label>구성</Label>
                <Body>Intro · Verse · Chorus · Verse · Chorus · Outro</Body>
              </Inline>
            </Card>
            <Card>
              <Between>
                <SectionTitle>결정사항</SectionTitle>
                <Button secondary>+ 추가</Button>
              </Between>
              <Stack gap={12}>
                <Body>☑ Key는 원곡과 동일한 G로 진행</Body>
                <Body>☑ Intro는 4마디</Body>
                <Body>☑ 2절 첫 8마디 Guitar 1 OFF</Body>
              </Stack>
            </Card>
          </Column>
          <Column style={width < 900 ? undefined : { flex: 1 }}>
            <Card>
              <Between>
                <SectionTitle>담당 멤버</SectionTitle>
                <Muted>2 / 4 Ready</Muted>
              </Between>
              <ProgressTrack>
                <ProgressFill value={50} />
              </ProgressTrack>
              {preparations.map((part) => (
                <Between key={part.id}>
                  <Label>{part.part}</Label>
                  <Muted>{part.member}</Muted>
                  <Badge
                    tone={
                      part.status === 'READY'
                        ? 'success'
                        : part.status === 'PRACTICING'
                          ? 'warning'
                          : 'danger'
                    }
                  >
                    {part.status === 'READY'
                      ? '준비 완료'
                      : part.status === 'PRACTICING'
                        ? '연습 중'
                        : '미준비'}
                  </Badge>
                </Between>
              ))}
            </Card>
            <Card>
              <Between>
                <SectionTitle>다음 합주 확인사항</SectionTitle>
                <Muted>직접 체크 가능</Muted>
              </Between>
              {checklist.map((item) => (
                <Text
                  key={item.id}
                  onPress={() =>
                    setChecklist((list) =>
                      list.map((value) =>
                        value.id === item.id ? { ...value, done: !value.done } : value,
                      ),
                    )
                  }
                  style={{
                    color: item.done ? theme.colors.success : theme.colors.text,
                    fontSize: 15,
                  }}
                >
                  {item.done ? '☑' : '☐'} {item.label}
                </Text>
              ))}
            </Card>
          </Column>
        </Grid>
      )}
      {tab === '의견' && (
        <Card>
          <SectionTitle>곡 의견</SectionTitle>
          <Body>💡 후렴 직전에 전체 다이내믹을 한 단계 낮춰보면 좋겠어요.</Body>
          <Body>🔧 2절 Guitar 1 진입 타이밍 확인 필요</Body>
          <Button>+ 새 의견 작성</Button>
        </Card>
      )}
      {tab === '자료' && (
        <Card>
          <SectionTitle>악보 · 레퍼런스</SectionTitle>
          <Body>📄 Creep_Chord.pdf · Guitar · 2.4MB</Body>
          <Body>📄 Guitar_TAB.pdf · Guitar · 1.8MB</Body>
          <Body>▶ Radiohead - Creep (Official Video)</Body>
          <Button>+ 파일 업로드</Button>
        </Card>
      )}
      {tab === '연습' && (
        <Card>
          <SectionTitle>파트별 연습</SectionTitle>
          <Body>원곡과 4개의 Stem을 함께 들으며 연습할 수 있어요.</Body>
          <Button onPress={() => navigate('practice')}>멀티트랙 플레이어 열기</Button>
        </Card>
      )}
      {tab === '합주 기록' && (
        <Card>
          <SectionTitle>최근 합주</SectionTitle>
          <Body>2026년 9월 5일 · 합정 합주실 B룸</Body>
          <Muted>Intro 길이와 엔딩 구성을 집중적으로 맞췄습니다.</Muted>
          <Button secondary onPress={() => navigate('rehearsals')}>
            기록 보기
          </Button>
        </Card>
      )}
    </AppShell>
  );
}
