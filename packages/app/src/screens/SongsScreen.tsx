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
  Pill,
  PillText,
  Progress,
  ProgressValue,
  ResponsiveGrid,
  SongCover,
  Stack,
  StatTile,
  Surface,
} from '../components/ProductUI';
import type { ScreenProps } from '../navigation';
import { useMockAppState, type AdoptedSong } from '../state/MockAppState';
import { Avatar, AvatarText, Input } from '../styles/layout';

export function SongsScreen({ navigate }: ScreenProps) {
  const { width } = useWindowDimensions();
  const { adoptedSongs } = useMockAppState();
  const [tab, setTab] = useState('전체');
  const [query, setQuery] = useState('');
  const visible = adoptedSongs.filter(
    (song) =>
      (tab === '전체' ||
        (tab === '연습 중' ? song.status === 'PRACTICING' : song.status === 'READY')) &&
      `${song.title}${song.artist}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <AppShell activeRoute="songs" onNavigate={navigate}>
      <FlexBetween
        style={width < 650 ? { flexDirection: 'column', alignItems: 'stretch' } : undefined}
      >
        <PageTop>
          <PageHeading>채택곡</PageHeading>
          <PageDescription>
            우리 팀이 함께 완성해갈 곡과 준비 상태를 한눈에 확인하세요.
          </PageDescription>
        </PageTop>
        <ActionButton onPress={() => navigate('recommendations')}>+ 곡 추가</ActionButton>
      </FlexBetween>
      <FlexRow wrap>
        <StatTile icon="songs" label="전체 채택곡" value={`${adoptedSongs.length}곡`} />
        <StatTile
          icon="rehearsal"
          label="연습 중"
          value={`${adoptedSongs.filter((song) => song.status === 'PRACTICING').length}곡`}
          color="#e49a13"
        />
        <StatTile
          icon="users"
          label="준비 완료"
          value={`${adoptedSongs.filter((song) => song.status === 'READY').length}곡`}
          color="#16a36a"
        />
      </FlexRow>
      <FlexBetween
        style={width < 650 ? { flexDirection: 'column', alignItems: 'stretch' } : undefined}
      >
        <FlexRow>
          {['전체', '연습 중', '준비 완료'].map((item) => (
            <Pill key={item} active={tab === item} onPress={() => setTab(item)}>
              <PillText active={tab === item}>{item}</PillText>
            </Pill>
          ))}
        </FlexRow>
        <View style={{ width: width < 650 ? '100%' : Math.min(300, width * 0.4) }}>
          <Input value={query} onChangeText={setQuery} placeholder="곡 또는 아티스트 검색" />
        </View>
      </FlexBetween>
      <ResponsiveGrid stacked={width < 920}>
        <Stack gap={16} style={width < 920 ? undefined : { flex: 1 }}>
          {visible
            .filter((_, index) => index % 2 === 0)
            .map((song) => (
              <SongTile key={song.id} song={song} navigate={navigate} />
            ))}
        </Stack>
        <Stack gap={16} style={width < 920 ? undefined : { flex: 1 }}>
          {visible
            .filter((_, index) => index % 2 === 1)
            .map((song) => (
              <SongTile key={song.id} song={song} navigate={navigate} />
            ))}
          <Pressable onPress={() => navigate('recommendations')}>
            <Surface
              tint="#f7f9ff"
              style={{ minHeight: 180, alignItems: 'center', justifyContent: 'center' }}
            >
              <Heading>다음 연습곡을 찾고 있나요?</Heading>
              <Meta>멤버가 추천한 곡을 보고 함께 투표해보세요.</Meta>
              <ActionButton secondary>곡 추천 보러가기</ActionButton>
            </Surface>
          </Pressable>
        </Stack>
      </ResponsiveGrid>
    </AppShell>
  );
}

function SongTile({ song, navigate }: { song: AdoptedSong; navigate: ScreenProps['navigate'] }) {
  const cover =
    song.id === 'dont-look-back' ? 'oasis' : song.id === 'teen-spirit' ? 'nirvana' : 'creep';
  return (
    <Pressable onPress={() => navigate('song', { id: song.id })}>
      <Surface>
        <FlexRow gap={16}>
          <SongCover id={cover} size={104} />
          <View style={{ flex: 1, gap: 7 }}>
            <FlexBetween>
              <View>
                <Heading>{song.title}</Heading>
                <Meta>
                  {song.artist} · {song.year}
                </Meta>
              </View>
              <Pill tone={song.status === 'READY' ? 'green' : 'amber'}>
                <PillText tone={song.status === 'READY' ? 'green' : 'amber'}>
                  {song.status === 'READY' ? '준비 완료' : '연습 중'}
                </PillText>
              </Pill>
            </FlexBetween>
            <FlexBetween>
              <Meta>파트 준비도</Meta>
              <Copy style={{ fontWeight: '900' }}>
                {song.ready} / {song.total}
              </Copy>
            </FlexBetween>
            <Progress>
              <ProgressValue
                value={(song.ready / song.total) * 100}
                color={song.status === 'READY' ? '#16a36a' : theme.colors.primary}
              />
            </Progress>
            <FlexBetween>
              <FlexRow>
                {['민수', '영희', '준호'].map((name, index) => (
                  <Avatar key={name} size={28} color={['#ffd8c8', '#fde4bc', '#d8f2e3'][index]}>
                    <AvatarText>{name}</AvatarText>
                  </Avatar>
                ))}
              </FlexRow>
              <Meta>의견 {song.comments} · 자료 4</Meta>
            </FlexBetween>
          </View>
        </FlexRow>
        <FlexBetween>
          <Meta>다음 합주 · 9월 12일 18:00</Meta>
          <ActionButton compact onPress={() => navigate('practice')}>
            연습 시작
          </ActionButton>
        </FlexBetween>
      </Surface>
    </Pressable>
  );
}
