import { useIdentity } from '../state/Identity';
import { useWindowDimensions, View } from 'react-native';
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
  SongCover,
  Stack,
  Surface,
} from '../components/ProductUI';
import { useMockAppState } from '../state/MockAppState';
import type { ScreenProps } from '../navigation';
import { Avatar, AvatarText } from '../styles/layout';

export function HomeScreen({ navigate }: ScreenProps) {
  const currentUserId = useIdentity();
  const { width } = useWindowDimensions();
  const { workspace, members, adoptedSongs, recommendations, rehearsals } = useMockAppState();
  const next = rehearsals
    .filter((event) => new Date(`${event.date}T${event.end}`) >= new Date())
    .sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`))[0];
  const ready = adoptedSongs.filter((song) => song.myStatus === 'READY').length;
  const candidates = recommendations.filter(
    (song) => !adoptedSongs.some((adopted) => adopted.id === song.id),
  );
  return (
    <AppShell activeRoute="home" onNavigate={navigate}>
      <FlexBetween>
        <PageTop>
          <PageHeading>{workspace?.name}</PageHeading>
          <PageDescription>{workspace?.description}</PageDescription>
        </PageTop>
        {width >= 650 && (
          <ActionButton secondary onPress={() => navigate('members')}>
            멤버 보기
          </ActionButton>
        )}
      </FlexBetween>
      <ResponsiveGrid stacked={width < 1050}>
        <Surface style={{ flex: 1.6 }}>
          <FlexBetween>
            <Heading>다음 합주</Heading>
            {next && (
              <Pill tone="amber">
                <PillText tone="amber">예정</PillText>
              </Pill>
            )}
          </FlexBetween>
          {next ? (
            <>
              <PageHeading style={{ fontSize: 24 }}>{next.date}</PageHeading>
              <Copy>
                {next.title} · {next.start}–{next.end}
              </Copy>
              <Meta>{next.place}</Meta>
              <Meta>{next.goal}</Meta>
              <ActionButton secondary onPress={() => navigate('rehearsals', { id: next.id })}>
                일정 보기 →
              </ActionButton>
            </>
          ) : (
            <>
              <Copy>아직 예정된 합주가 없어요.</Copy>
              <ActionButton secondary onPress={() => navigate('rehearsals')}>
                첫 합주 만들기
              </ActionButton>
            </>
          )}
        </Surface>
        <Surface style={{ flex: 1 }}>
          <Heading>함께 준비하는 음악</Heading>
          <PageHeading style={{ fontSize: 25 }}>
            {adoptedSongs.length}곡 · {members.length}명
          </PageHeading>
          <FlexRow wrap>
            {members.map((member) => (
              <Avatar key={member.id} color={member.color} size={34}>
                <AvatarText>{member.initials}</AvatarText>
              </Avatar>
            ))}
          </FlexRow>
          <Meta>
            내 준비 완료 {ready} / {adoptedSongs.length}곡
          </Meta>
          <Progress>
            <ProgressValue value={adoptedSongs.length ? (ready / adoptedSongs.length) * 100 : 0} />
          </Progress>
        </Surface>
      </ResponsiveGrid>
      <ResponsiveGrid stacked={width < 1050}>
        <Stack style={{ flex: 1.4 }}>
          <Surface>
            <FlexBetween>
              <Heading>함께 연습할 곡</Heading>
              <ActionButton secondary compact onPress={() => navigate('songs')}>
                전체 보기 →
              </ActionButton>
            </FlexBetween>
            {adoptedSongs.map((song) => (
              <View
                key={song.id}
                style={{
                  paddingVertical: 10,
                  gap: 8,
                  borderTopWidth: 1,
                  borderTopColor: '#edf1f6',
                }}
              >
                <FlexRow gap={12}>
                  <SongCover id={song.id} size={50} />
                  <View style={{ flex: 1 }}>
                    <Copy style={{ fontWeight: '500' }}>{song.title}</Copy>
                    <Meta>
                      {song.artist} · {song.ready}/{song.total} 파트 준비
                    </Meta>
                  </View>
                  <ActionButton compact onPress={() => navigate('practice', { id: song.id })}>
                    연습하기
                  </ActionButton>
                </FlexRow>
                <Progress>
                  <ProgressValue value={song.total ? (song.ready / song.total) * 100 : 0} />
                </Progress>
              </View>
            ))}
            {!adoptedSongs.length && <Meta>곡 추천에서 첫 연습곡을 골라보세요.</Meta>}
          </Surface>
          <Surface tint="#f4f7ff">
            <Heading>새 합주 준비하기</Heading>
            <Meta>다음 일정을 만들고 같은 목표로 연습해요.</Meta>
            <ActionButton onPress={() => navigate('rehearsals')}>합주 일정 관리 →</ActionButton>
          </Surface>
        </Stack>
        <Stack style={{ flex: 1 }}>
          <Surface>
            <Heading>다음 채택 후보</Heading>
            {candidates.length ? (
              candidates.slice(0, 3).map((song) => (
                <View key={song.id} style={{ gap: 8 }}>
                  <Copy style={{ fontWeight: '500' }}>{song.title}</Copy>
                  <Meta>
                    {song.artist} · 좋아요 {song.likes} · 채택 추천 {song.votes}
                  </Meta>
                  <ActionButton
                    secondary
                    onPress={() => navigate('recommendation', { id: song.id })}
                  >
                    후보 상세 보기
                  </ActionButton>
                </View>
              ))
            ) : (
              <Meta>새로운 곡을 추천하고 의견을 나눠보세요.</Meta>
            )}
            <ActionButton secondary onPress={() => navigate('recommendations')}>
              곡 추천 보기 →
            </ActionButton>
          </Surface>
          <Surface>
            <Heading>우리 밴드</Heading>
            <Copy>
              {members.find((member) => member.id === currentUserId)?.part} 파트로 함께하고 있어요.
            </Copy>
            <Meta>다른 밴드의 일정과 참여 곡은 개인 공간에서 함께 확인할 수 있어요.</Meta>
            <ActionButton secondary onPress={() => navigate('personal-home')}>
              개인 홈으로 →
            </ActionButton>
          </Surface>
        </Stack>
      </ResponsiveGrid>
    </AppShell>
  );
}
