import { theme } from '@moajam/ui';
import { useState } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { AppShell } from '../components/AppShell';
import {
  ActionButton,
  Copy,
  Divider,
  FlexBetween,
  FlexRow,
  Heading,
  Meta,
  PageDescription,
  PageHeading,
  PageTop,
  Pill,
  PillText,
  ResponsiveGrid,
  Slider,
  Stack,
  Surface,
  Waveform,
} from '../components/ProductUI';
import type { ScreenProps } from '../navigation';

const parts = ['Guitar 1', 'Vocal', 'Guitar 2', 'Bass', 'Drums'];
const sections = [
  'Intro · 1–8',
  'Verse 1 · 9–24',
  'Chorus · 25–40',
  'Verse 2 · 41–56',
  'Ending · 57–64',
];

export function ScoreEditorScreen({ navigate }: ScreenProps) {
  const { width } = useWindowDimensions();
  const stacked = width < 980;
  const [part, setPart] = useState('Guitar 1');
  const [section, setSection] = useState('Chorus · 25–40');
  const [tool, setTool] = useState('선택');
  const [playing, setPlaying] = useState(false);
  const [saved, setSaved] = useState('방금 자동 저장됨');

  return (
    <AppShell
      activeRoute="score-editor"
      onNavigate={navigate}
      comingSoon="악보 편집은 추후 개발됩니다"
      onComingSoonBack={() => navigate('home')}
    >
      <FlexBetween
        style={width < 720 ? { flexDirection: 'column', alignItems: 'stretch' } : undefined}
      >
        <PageTop>
          <PageHeading>악보 편집</PageHeading>
          <PageDescription>Creep · Radiohead · 팀 악보</PageDescription>
        </PageTop>
        <FlexRow wrap>
          <Meta>{saved}</Meta>
          <ActionButton secondary onPress={() => setSaved('지금 저장됨')}>
            저장
          </ActionButton>
          <ActionButton onPress={() => navigate('practice')}>연습에서 열기</ActionButton>
        </FlexRow>
      </FlexBetween>

      <Surface style={{ padding: 10 }}>
        <FlexRow wrap>
          {['↶', '↷', '선택', '음표', '쉼표', '코드', '가사', '마디선'].map((item) => (
            <Pill key={item} active={tool === item} onPress={() => setTool(item)}>
              <PillText active={tool === item}>{item}</PillText>
            </Pill>
          ))}
          <View style={{ flex: 1 }} />
          <Pill>
            <PillText>♩ = 92</PillText>
          </Pill>
          <Pill>
            <PillText>100%</PillText>
          </Pill>
        </FlexRow>
      </Surface>

      <ResponsiveGrid stacked={stacked}>
        {stacked ? (
          <Surface>
            <FlexBetween>
              <Heading>파트 · 구간</Heading>
              <Meta>{section}</Meta>
            </FlexBetween>
            <FlexRow wrap>
              {parts.map((item) => (
                <Pill key={item} active={part === item} onPress={() => setPart(item)}>
                  <PillText active={part === item}>{item}</PillText>
                </Pill>
              ))}
            </FlexRow>
            <FlexRow wrap>
              {sections.map((item) => (
                <Pill key={item} active={section === item} onPress={() => setSection(item)}>
                  <PillText active={section === item}>{item.split(' · ')[0]}</PillText>
                </Pill>
              ))}
            </FlexRow>
          </Surface>
        ) : (
          <Stack gap={16} style={{ width: 210 }}>
            <Surface>
              <Heading>파트</Heading>
              {parts.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setPart(item)}
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    backgroundColor: part === item ? '#edf3ff' : 'transparent',
                  }}
                >
                  <Copy
                    style={{
                      color: part === item ? theme.colors.primary : theme.colors.text,
                      fontWeight: '800',
                    }}
                  >
                    {item}
                  </Copy>
                </Pressable>
              ))}
            </Surface>
            <Surface>
              <Heading>구간</Heading>
              {sections.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setSection(item)}
                  style={{ paddingVertical: 7 }}
                >
                  <Copy
                    style={{
                      color: section === item ? theme.colors.primary : theme.colors.text,
                      fontWeight: section === item ? '900' : '600',
                    }}
                  >
                    {item}
                  </Copy>
                </Pressable>
              ))}
            </Surface>
          </Stack>
        )}

        <Surface style={stacked ? undefined : { flex: 1.55, minHeight: 610 }}>
          <FlexBetween>
            <View>
              <Heading>
                {part} · {section}
              </Heading>
              <Meta>4/4 · Key C · Capo 0</Meta>
            </View>
            <FlexRow>
              <ActionButton secondary compact>
                −
              </ActionButton>
              <Meta>100%</Meta>
              <ActionButton secondary compact>
                +
              </ActionButton>
            </FlexRow>
          </FlexBetween>
          <View
            style={{
              padding: width < 650 ? 10 : 28,
              gap: 24,
              backgroundColor: '#fffdfa',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#eee9df',
            }}
          >
            <FlexBetween>
              <Copy style={{ fontWeight: '900' }}>Creep</Copy>
              <Meta>Guitar 1 · 1 / 3</Meta>
            </FlexBetween>
            {[0, 1, 2, 3].map((row) => (
              <Staff key={row} active={row === 1} />
            ))}
          </View>
          <Meta>💡 음표를 선택한 뒤 위 도구로 코드, 가사, 주법을 입력할 수 있어요.</Meta>
        </Surface>

        <Stack gap={16} style={stacked ? undefined : { width: 250 }}>
          <Surface>
            <Heading>선택한 음표</Heading>
            <Property name="음정" value="G4" />
            <Property name="길이" value="4분음표" />
            <Property name="세기" value="mf" />
            <Property name="프렛" value="3" />
            <Divider />
            <Heading>표현</Heading>
            <FlexRow wrap>
              {['Accent', 'Slide', 'Bend', 'Palm mute'].map((item) => (
                <Pill key={item}>
                  <PillText>{item}</PillText>
                </Pill>
              ))}
            </FlexRow>
            <ActionButton secondary danger>
              선택 삭제
            </ActionButton>
          </Surface>
          <Surface>
            <Heading>악보 싱크</Heading>
            <Meta>현재 마디 시작</Meta>
            <Copy style={{ fontWeight: '900' }}>01:32.480</Copy>
            <Slider value={42} />
            <ActionButton secondary onPress={() => setSaved('싱크 포인트 저장됨')}>
              현재 재생 위치로 맞춤
            </ActionButton>
          </Surface>
        </Stack>
      </ResponsiveGrid>

      <Surface>
        <FlexRow>
          <Pressable
            onPress={() => setPlaying(!playing)}
            style={{
              width: 42,
              height: 42,
              borderRadius: 22,
              backgroundColor: theme.colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: 'white', fontWeight: '900' }}>{playing ? 'Ⅱ' : '▶'}</Text>
          </Pressable>
          <Meta>01:32</Meta>
          <Waveform height={36} />
          <Meta>03:58</Meta>
          <Pill>
            <PillText>1.0×</PillText>
          </Pill>
        </FlexRow>
      </Surface>
    </AppShell>
  );
}

function Property({ name, value }: { name: string; value: string }) {
  return (
    <FlexBetween>
      <Meta>{name}</Meta>
      <Pill>
        <PillText>{value}</PillText>
      </Pill>
    </FlexBetween>
  );
}

function Staff({ active }: { active: boolean }) {
  return (
    <View style={{ gap: 10 }}>
      <FlexRow>
        <Text style={{ width: 24, fontSize: 20 }}>𝄞</Text>
        <Meta>C</Meta>
        <View style={{ flex: 1 }} />
        <Meta>Am</Meta>
        <View style={{ flex: 1 }} />
        <Meta>F</Meta>
        <View style={{ flex: 1 }} />
        <Meta>G</Meta>
      </FlexRow>
      <View
        style={{
          height: 84,
          justifyContent: 'space-between',
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: '#273142',
        }}
      >
        {[0, 1, 2, 3, 4].map((line) => (
          <View key={line} style={{ height: 1, backgroundColor: '#5c6470' }} />
        ))}
        {[12, 28, 46, 63, 78, 91].map((left, index) => (
          <View
            key={left}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: 17 + (index % 4) * 10,
              width: 11,
              height: 8,
              borderRadius: 8,
              backgroundColor: active && index === 2 ? theme.colors.primary : '#182033',
              transform: [{ rotate: '-18deg' }],
            }}
          />
        ))}
        {active ? (
          <View
            style={{
              position: 'absolute',
              left: '44%',
              top: 0,
              bottom: 0,
              width: 2,
              backgroundColor: theme.colors.primary,
            }}
          />
        ) : null}
      </View>
    </View>
  );
}
