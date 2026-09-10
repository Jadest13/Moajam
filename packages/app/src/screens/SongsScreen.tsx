import { Body, Button, Card, Muted, theme } from '@moajam/ui';
import { useState } from 'react';
import { View } from 'react-native';
import { AppShell } from '../components/AppShell';
import { SongCard } from '../components/SongCard';
import { adoptedSongs } from '../mocks/data';
import type { ScreenProps } from '../navigation';
import { Between, Chip, ChipText, Grid, PageHeader, PageTitle } from '../styles/layout';

export function SongsScreen({ navigate }: ScreenProps) {
  const [tab, setTab] = useState<'전체' | '연습 중' | '준비 완료'>('전체');
  const visible = adoptedSongs.filter(
    (song) =>
      tab === '전체' ||
      (tab === '연습 중' ? song.status === 'PRACTICING' : song.status === 'READY'),
  );

  return (
    <AppShell activeRoute="songs" onNavigate={navigate}>
      <PageHeader>
        <Between>
          <View>
            <PageTitle>채택곡</PageTitle>
            <Muted>우리 팀이 함께 연주할 곡이에요.</Muted>
          </View>
          <Button>+ 곡 추가</Button>
        </Between>
      </PageHeader>
      <Grid stacked>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {(['전체', '연습 중', '준비 완료'] as const).map((item) => (
            <Chip key={item} active={tab === item} onPress={() => setTab(item)}>
              <ChipText active={tab === item}>{item}</ChipText>
            </Chip>
          ))}
        </View>
        <Card>
          {visible.map((song) => (
            <SongCard
              key={song.id}
              title={song.title}
              artist={song.artist}
              tint={song.tint}
              ready={`${song.ready} / ${song.total}`}
              navigate={navigate}
            />
          ))}
          {!visible.length && (
            <Body style={{ color: theme.colors.textMuted }}>해당 상태의 곡이 없습니다.</Body>
          )}
        </Card>
      </Grid>
    </AppShell>
  );
}
