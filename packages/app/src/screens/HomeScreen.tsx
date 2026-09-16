import { theme } from '@moajam/ui';
import { Image, type ImageSourcePropType, useWindowDimensions, View } from 'react-native';
import rehearsalRoom from '../../assets/images/mock/rehearsal-room.png';
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
  SongCover,
  Stack,
  Surface,
} from '../components/ProductUI';
import { AppIcon } from '../components/icons';
import type { ScreenProps } from '../navigation';
import { Avatar, AvatarText } from '../styles/layout';

const songs = [
  { id: 'oasis', title: "Don't Look Back in Anger", artist: 'Oasis', ready: '2 / 5', value: 42 },
  { id: 'creep', title: 'Creep', artist: 'Radiohead', ready: '3 / 5', value: 60 },
  { id: 'nirvana', title: 'Smells Like Teen Spirit', artist: 'Nirvana', ready: '1 / 5', value: 20 },
] as const;

const activities = [
  ['영희', '#fde4bc', '이영희', 'Creep 곡에 댓글을 남겼습니다.', '3시간 전'],
  ['민수', '#ffd8c8', '김민수', '다음 합주 일정을 만들었습니다.', '5시간 전'],
  ['지수', '#d7e8ff', '박지수', '채택 후보를 추천했습니다.', '1일 전'],
] as const;

export function HomeScreen({ navigate }: ScreenProps) {
  const { width } = useWindowDimensions();
  const stacked = width < 1050;
  const compact = width < 650;

  return (
    <AppShell activeRoute="home" onNavigate={navigate}>
      <FlexBetween>
        <PageTop>
          <PageHeading style={compact ? { fontSize: 25, lineHeight: 32 } : undefined}>
            좋은 오후예요, 김민수님! 👋
          </PageHeading>
          <PageDescription>우리 밴드의 다음 합주를 준비해볼까요?</PageDescription>
        </PageTop>
        {!compact ? (
          <FlexRow>
            <ActionButton secondary onPress={() => navigate('members')}>
              멤버 초대
            </ActionButton>
            <Avatar color="#ffd8c8" size={38}>
              <AvatarText>민수</AvatarText>
            </Avatar>
          </FlexRow>
        ) : null}
      </FlexBetween>

      <ResponsiveGrid stacked={stacked}>
        <Surface style={stacked ? undefined : { flex: 1.65 }}>
          <FlexBetween>
            <Heading>다음 합주</Heading>
            <Pill tone="amber">
              <PillText tone="amber">D-3</PillText>
            </Pill>
          </FlexBetween>
          <FlexRow gap={18}>
            <View style={{ flex: 1, gap: 14 }}>
              <FlexRow>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 12,
                    backgroundColor: '#fff0ee',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AppIcon name="calendar" color="#ef4d5e" size={24} />
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Heading>2024년 9월 12일 (토)</Heading>
                  <Copy>18:00 – 21:00</Copy>
                  <Meta>홍대 합주실 A룸</Meta>
                </View>
              </FlexRow>
              <View style={{ alignSelf: 'flex-start' }}>
                <ActionButton secondary onPress={() => navigate('rehearsals')}>
                  일정 보기 →
                </ActionButton>
              </View>
            </View>
            {width >= 760 ? (
              <Image
                source={rehearsalRoom as ImageSourcePropType}
                resizeMode="cover"
                style={{ width: 300, height: 160, borderRadius: 12 }}
              />
            ) : null}
          </FlexRow>
        </Surface>

        <Surface style={stacked ? undefined : { flex: 1 }}>
          <Heading>이번 주 준비도</Heading>
          <FlexRow gap={14}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: '#edf3ff',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AppIcon name="users" color={theme.colors.primary} size={24} />
            </View>
            <PageHeading style={{ fontSize: 24 }}>3 / 5 준비 완료</PageHeading>
          </FlexRow>
          <Progress>
            <ProgressValue value={60} />
          </Progress>
          <FlexRow>
            {['영희', '민수', '준호', '지수', '+1'].map((name, index) => (
              <Avatar
                key={name}
                color={['#fde4bc', '#ffd8c8', '#d8f2e3', '#d7e8ff', '#edf1f6'][index]}
                size={36}
              >
                <AvatarText>{name}</AvatarText>
              </Avatar>
            ))}
          </FlexRow>
          <Meta>멤버들의 준비 상황을 확인하고 함께 연습해요!</Meta>
        </Surface>
      </ResponsiveGrid>

      <ResponsiveGrid stacked={stacked}>
        <Stack gap={16} style={stacked ? undefined : { flex: 1.25 }}>
          <Surface>
            <FlexBetween>
              <Heading>준비가 필요한 곡</Heading>
              <Meta
                onPress={() => navigate('songs')}
                style={{ color: theme.colors.primary, fontWeight: '800' }}
              >
                전체 보기 →
              </Meta>
            </FlexBetween>
            {songs.map((song) => (
              <View
                key={song.title}
                style={{
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.border,
                }}
              >
                <FlexRow gap={12}>
                  <SongCover id={song.id} size={54} />
                  <View style={{ flex: 1, gap: 3 }}>
                    <Copy style={{ fontWeight: '800' }}>{song.title}</Copy>
                    <Meta>{song.artist}</Meta>
                    <FlexRow>
                      <Slider value={song.value} />
                      <Meta>{song.ready} 준비</Meta>
                    </FlexRow>
                  </View>
                  <ActionButton compact onPress={() => navigate('practice')}>
                    연습하기
                  </ActionButton>
                </FlexRow>
              </View>
            ))}
          </Surface>
          <Surface tint="#f5f8ff">
            <FlexBetween>
              <View style={{ gap: 3 }}>
                <Heading>새 합주 만들기</Heading>
                <Meta>다음 일정을 만들고 멤버에게 공유하세요.</Meta>
              </View>
              <ActionButton onPress={() => navigate('rehearsals')}>+ 합주 만들기</ActionButton>
            </FlexBetween>
          </Surface>
        </Stack>

        <Stack gap={16} style={stacked ? undefined : { flex: 1 }}>
          <Surface>
            <FlexBetween>
              <Heading>🔥 채택 후보</Heading>
              <Pill tone="amber">
                <PillText tone="amber">투표 D-2</PillText>
              </Pill>
            </FlexBetween>
            <FlexRow gap={14}>
              <SongCover id="nirvana" size={92} />
              <View style={{ flex: 1, gap: 5 }}>
                <Copy style={{ fontWeight: '800' }}>Smells Like Teen Spirit</Copy>
                <Meta>Nirvana</Meta>
                <Copy numberOfLines={2}>에너지 있고 재미있게 합주할 수 있을 것 같아요!</Copy>
                <FlexRow>
                  <Meta>♥ 8</Meta>
                  <Meta>🎸 6</Meta>
                  <Meta>▢ 10</Meta>
                </FlexRow>
              </View>
            </FlexRow>
            <ActionButton
              secondary
              onPress={() => navigate('recommendation', { id: 'teen-spirit' })}
            >
              후보 상세 보기
            </ActionButton>
          </Surface>
          <Surface>
            <FlexBetween>
              <Heading>최근 활동</Heading>
              <Meta>모두 보기 →</Meta>
            </FlexBetween>
            {activities.map(([initial, color, name, message, time]) => (
              <FlexRow key={message} gap={10}>
                <Avatar color={color} size={34}>
                  <AvatarText>{initial}</AvatarText>
                </Avatar>
                <View style={{ flex: 1 }}>
                  <Copy>
                    <Copy style={{ fontWeight: '800' }}>{name}</Copy> {message}
                  </Copy>
                  <Meta>{time}</Meta>
                </View>
              </FlexRow>
            ))}
          </Surface>
        </Stack>
      </ResponsiveGrid>
    </AppShell>
  );
}
