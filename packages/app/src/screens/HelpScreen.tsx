import { theme } from '@moajam/ui';
import { useState } from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
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
  ResponsiveGrid,
  SoftIcon,
  Stack,
  Surface,
} from '../components/ProductUI';
import { AppIcon } from '../components/icons';
import type { ScreenProps } from '../navigation';
import { Input } from '../styles/layout';

const guides = [
  ['처음 시작하기', '워크스페이스를 만들고 멤버를 초대하는 방법'],
  ['곡 추천과 채택', '후보를 추천하고 팀의 연습곡으로 정하는 흐름'],
  ['멀티트랙 연습', '스템, 악보, 멤버 녹음을 함께 재생하는 방법'],
  ['녹음과 악기 추출', '내 연주를 기록하고 악기 소리만 분리하는 방법'],
];
const faqs = [
  ['스템 분리는 어떤 파일을 지원하나요?', 'MP3, WAV, M4A 파일을 지원하며 고음질 WAV를 권장합니다.'],
  [
    '내 녹음이 다른 멤버에게 공개되나요?',
    '저장할 때 공개 범위를 나만 보기, 팀 공개 중에서 선택할 수 있습니다.',
  ],
  [
    '악보와 음원 싱크가 맞지 않아요.',
    '악보 편집 화면의 싱크 포인트에서 마디 시작 시점을 조정해보세요.',
  ],
];

export function HelpScreen({ navigate }: ScreenProps) {
  const { width } = useWindowDimensions();
  const [open, setOpen] = useState(0);
  const [query, setQuery] = useState('');
  const visible = guides.filter(([title, detail]) => `${title}${detail}`.includes(query));
  return (
    <AppShell activeRoute="help" onNavigate={navigate}>
      <Surface tint="#eef4ff" style={{ paddingVertical: 28 }}>
        <PageTop style={{ alignItems: 'center' }}>
          <PageHeading>무엇을 도와드릴까요?</PageHeading>
          <PageDescription>모아잼의 기능과 합주 준비 방법을 빠르게 찾아보세요.</PageDescription>
        </PageTop>
        <View style={{ width: '100%', maxWidth: 620, alignSelf: 'center' }}>
          <Input
            value={query}
            onChangeText={setQuery}
            placeholder="기능이나 궁금한 점을 검색하세요"
          />
        </View>
      </Surface>
      <ResponsiveGrid stacked={width < 850}>
        <Stack gap={12} style={width < 850 ? undefined : { flex: 1.2 }}>
          <Heading>주요 가이드</Heading>
          {visible.map(([title, detail], index) => (
            <Pressable
              key={title}
              onPress={() =>
                navigate(index === 2 ? 'practice' : index === 3 ? 'instrument' : 'home')
              }
            >
              <Surface>
                <FlexRow>
                  <SoftIcon>
                    <AppIcon
                      name={index === 2 ? 'songs' : index === 3 ? 'guitar' : 'help'}
                      color={theme.colors.primary}
                    />
                  </SoftIcon>
                  <View style={{ flex: 1 }}>
                    <Copy style={{ fontWeight: '900' }}>{title}</Copy>
                    <Meta>{detail}</Meta>
                  </View>
                  <AppIcon name="chevron-right" color={theme.colors.textMuted} />
                </FlexRow>
              </Surface>
            </Pressable>
          ))}
        </Stack>
        <Stack gap={12} style={width < 850 ? undefined : { flex: 1 }}>
          <Heading>자주 묻는 질문</Heading>
          <Surface>
            {faqs.map(([question, answer], index) => (
              <Pressable
                key={question}
                onPress={() => setOpen(index)}
                style={{
                  paddingVertical: 9,
                  borderBottomWidth: index < faqs.length - 1 ? 1 : 0,
                  borderBottomColor: theme.colors.border,
                }}
              >
                <FlexBetween>
                  <Copy style={{ flex: 1, fontWeight: '800' }}>{question}</Copy>
                  <Copy>{open === index ? '−' : '+'}</Copy>
                </FlexBetween>
                {open === index ? <Meta style={{ marginTop: 8 }}>{answer}</Meta> : null}
              </Pressable>
            ))}
          </Surface>
          <Surface tint="#f8faff">
            <Heading>답을 찾지 못했나요?</Heading>
            <Meta>문의 내용을 남기면 영업일 기준 1일 이내에 답변드릴게요.</Meta>
            <ActionButton onPress={() => undefined}>문의하기</ActionButton>
          </Surface>
        </Stack>
      </ResponsiveGrid>
    </AppShell>
  );
}
