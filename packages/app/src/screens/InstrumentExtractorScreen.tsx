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
  PageDescription,
  PageHeading,
  PageTop,
  Pill,
  PillText,
  Progress,
  ProgressValue,
  ResponsiveGrid,
  Slider,
  SoftIcon,
  Stack,
  Surface,
  Waveform,
} from '../components/ProductUI';
import { AppIcon } from '../components/icons';
import type { ScreenProps } from '../navigation';

const targets = [
  { name: 'Electric Guitar', confidence: 92, color: '#2563eb' },
  { name: 'Drums', confidence: 58, color: '#ef5b68' },
  { name: 'Bass', confidence: 41, color: '#20ad73' },
  { name: 'Vocal', confidence: 25, color: '#9b6bed' },
];

export function InstrumentExtractorScreen({ navigate }: ScreenProps) {
  const { width } = useWindowDimensions();
  const stacked = width < 980;
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState('Electric Guitar');
  const [preview, setPreview] = useState<'원본' | '내 악기' | '제거된 소리'>('내 악기');
  const [status, setStatus] = useState('분석이 완료되었습니다. 결과를 비교해보세요.');

  const runExtraction = () => {
    setStatus('선택한 악기 소리를 다시 분리했습니다. · 18초 전');
    setPreview('내 악기');
  };

  return (
    <AppShell
      activeRoute="instrument"
      onNavigate={navigate}
      comingSoon="내 악기 추출은 추후 개발됩니다"
      onComingSoonBack={() => navigate('home')}
    >
      <FlexBetween
        style={width < 650 ? { flexDirection: 'column', alignItems: 'flex-start' } : undefined}
      >
        <PageTop>
          <PageHeading>내 악기 소리 추출</PageHeading>
          <PageDescription>
            스피커 앞에서 녹음한 음원 중 가장 크게 들리는 내 악기만 선명하게 분리합니다.
          </PageDescription>
        </PageTop>
        <Pill tone="green">
          <PillText tone="green">개인 도구 · Beta</PillText>
        </Pill>
      </FlexBetween>

      <Surface tint="#f7f9ff">
        <FlexRow wrap gap={10}>
          {['1  녹음 선택', '2  악기 확인', '3  분리·비교', '4  저장'].map((step, index) => (
            <View key={step} style={{ flex: 1, minWidth: 140, gap: 7 }}>
              <Meta
                style={{
                  color: index <= 2 ? theme.colors.primary : theme.colors.textMuted,
                  fontWeight: '800',
                }}
              >
                {step}
              </Meta>
              <Progress>
                <ProgressValue value={index <= 2 ? 100 : 0} />
              </Progress>
            </View>
          ))}
        </FlexRow>
      </Surface>

      <ResponsiveGrid stacked={stacked}>
        <Stack gap={16} style={stacked ? undefined : { flex: 1.6 }}>
          <Surface>
            <FlexBetween>
              <View style={{ gap: 3 }}>
                <Heading>rehearsal_guitar_0912.wav</Heading>
                <Meta>03:58 · 48 kHz · iPhone 마이크 녹음</Meta>
              </View>
              <ActionButton secondary onPress={() => setStatus('새 녹음을 선택할 수 있어요.')}>
                파일 바꾸기
              </ActionButton>
            </FlexBetween>
            <FlexRow>
              <Pressable
                onPress={() => setPlaying((value) => !value)}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: 'white', fontSize: 18, fontWeight: '900' }}>
                  {playing ? 'Ⅱ' : '▶'}
                </Text>
              </Pressable>
              <View style={{ flex: 1, gap: 6 }}>
                <Waveform height={52} />
                <FlexBetween>
                  <Meta>01:24</Meta>
                  <Meta>03:58</Meta>
                </FlexBetween>
              </View>
            </FlexRow>
            <FlexRow wrap>
              {(['원본', '내 악기', '제거된 소리'] as const).map((item) => (
                <Pill key={item} active={preview === item} onPress={() => setPreview(item)}>
                  <PillText active={preview === item}>{item}</PillText>
                </Pill>
              ))}
            </FlexRow>
            <Stack gap={12}>
              <FlexRow>
                <Meta style={{ width: 80 }}>Original</Meta>
                <Waveform color="#7f8da4" height={38} />
              </FlexRow>
              <FlexRow>
                <Meta style={{ width: 80 }}>내 악기</Meta>
                <Waveform color="#2563eb" height={44} />
              </FlexRow>
              <FlexRow>
                <Meta style={{ width: 80 }}>나머지</Meta>
                <Waveform color="#a878e7" height={34} />
              </FlexRow>
            </Stack>
          </Surface>

          <Surface>
            <FlexBetween>
              <Heading>분리 결과</Heading>
              <Meta>{status}</Meta>
            </FlexBetween>
            <FlexRow wrap>
              <View style={{ flex: 1, minWidth: 180 }}>
                <Meta>내 악기 보존율</Meta>
                <PageHeading style={{ fontSize: 24 }}>94%</PageHeading>
              </View>
              <View style={{ flex: 1, minWidth: 180 }}>
                <Meta>배경음 감소</Meta>
                <PageHeading style={{ fontSize: 24 }}>−18.4 dB</PageHeading>
              </View>
              <View style={{ flex: 1, minWidth: 180 }}>
                <Meta>처리 품질</Meta>
                <PageHeading style={{ fontSize: 24 }}>High</PageHeading>
              </View>
            </FlexRow>
            <FlexRow wrap>
              <ActionButton onPress={() => setStatus('내 연습 기록에 저장했습니다.')}>
                내 연습에 저장
              </ActionButton>
              <ActionButton secondary onPress={() => setStatus('WAV 내보내기를 준비했습니다.')}>
                WAV 내보내기
              </ActionButton>
            </FlexRow>
          </Surface>
        </Stack>

        <Stack gap={16} style={stacked ? undefined : { flex: 1 }}>
          <Surface>
            <Heading>감지한 세션</Heading>
            <Meta>크기와 음색을 함께 분석했습니다. 실제 연주한 악기를 확인해주세요.</Meta>
            {targets.map((target) => {
              const active = target.name === selected;
              return (
                <Pressable
                  key={target.name}
                  onPress={() => setSelected(target.name)}
                  style={{
                    padding: 12,
                    gap: 8,
                    borderWidth: 1,
                    borderColor: active ? theme.colors.primary : theme.colors.border,
                    borderRadius: 10,
                    backgroundColor: active ? '#f4f7ff' : 'white',
                  }}
                >
                  <FlexBetween>
                    <FlexRow>
                      <SoftIcon size={32} color={`${target.color}18`}>
                        <AppIcon name="guitar" color={target.color} size={16} />
                      </SoftIcon>
                      <Copy style={{ fontWeight: '800' }}>{target.name}</Copy>
                    </FlexRow>
                    <Meta>{target.confidence}%</Meta>
                  </FlexBetween>
                  <Progress>
                    <ProgressValue value={target.confidence} color={target.color} />
                  </Progress>
                </Pressable>
              );
            })}
          </Surface>
          <Surface>
            <Heading>분리 설정</Heading>
            <FlexBetween>
              <Copy>악기 보존</Copy>
              <Meta>85</Meta>
            </FlexBetween>
            <Slider value={85} />
            <FlexBetween>
              <Copy>배경음 제거</Copy>
              <Meta>72</Meta>
            </FlexBetween>
            <Slider value={72} />
            <FlexBetween>
              <Copy>잔향 보존</Copy>
              <Meta>40</Meta>
            </FlexBetween>
            <Slider value={40} />
            <ActionButton onPress={runExtraction}>다시 추출하기</ActionButton>
          </Surface>
          <Surface tint="#eff6ff">
            <FlexRow>
              <SoftIcon>
                <AppIcon name="help" color={theme.colors.primary} />
              </SoftIcon>
              <View style={{ flex: 1 }}>
                <Heading>더 잘 녹음하려면</Heading>
                <Meta>
                  휴대폰을 내 앰프에서 30–70cm 떨어뜨리고, 다른 스피커와 거리를 두면 정확도가
                  높아져요.
                </Meta>
              </View>
            </FlexRow>
          </Surface>
        </Stack>
      </ResponsiveGrid>
    </AppShell>
  );
}
