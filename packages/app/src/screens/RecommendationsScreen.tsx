import styled from '@emotion/native';
import { Body, Button, Card, Muted, Row, theme } from '@moajam/ui';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { AppShell } from '../components/AppShell';
import { recommendations } from '../mocks/data';
import type { ScreenProps } from '../navigation';
import {
  Artwork,
  ArtworkText,
  Between,
  Chip,
  ChipText,
  Inline,
  PageHeader,
  PageTitle,
  SearchInput,
  SectionTitle,
} from '../styles/layout';

const Recommendation = styled.Pressable`
  padding: 16px 0;
  gap: 14px;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

export function RecommendationsScreen({ navigate }: ScreenProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'전체' | '인기순' | '최신순'>('전체');
  const [liked, setLiked] = useState<string[]>([]);
  const filtered = useMemo(
    () =>
      recommendations
        .filter((song) =>
          `${song.title} ${song.artist}`.toLowerCase().includes(query.toLowerCase()),
        )
        .sort((a, b) =>
          filter === '인기순' ? b.likes - a.likes : filter === '최신순' ? b.year - a.year : 0,
        ),
    [filter, query],
  );

  return (
    <AppShell activeRoute="recommendations" onNavigate={navigate}>
      <PageHeader>
        <Between>
          <View>
            <PageTitle>곡 추천</PageTitle>
            <Muted>다음 합주곡을 함께 골라보세요.</Muted>
          </View>
          <Button>+ 곡 추천하기</Button>
        </Between>
      </PageHeader>
      <Inline wrap>
        <SearchInput value={query} onChangeText={setQuery} placeholder="곡명 또는 아티스트 검색" />
        {(['전체', '인기순', '최신순'] as const).map((item) => (
          <Chip key={item} active={filter === item} onPress={() => setFilter(item)}>
            <ChipText active={filter === item}>{item}</ChipText>
          </Chip>
        ))}
      </Inline>
      <Card>
        <Between>
          <SectionTitle>추천곡 {filtered.length}</SectionTitle>
          <Muted>좋아요와 채택 추천은 별개예요</Muted>
        </Between>
        {filtered.map((song) => {
          const isLiked = liked.includes(song.id);
          return (
            <Recommendation key={song.id} onPress={() => navigate('recommendation')}>
              <Artwork tint={song.tint}>
                <ArtworkText>♪</ArtworkText>
              </Artwork>
              <View style={{ flex: 1, gap: 4 }}>
                <Body style={{ fontWeight: '800' }}>{song.title}</Body>
                <Muted>
                  {song.artist} · {song.year}
                </Muted>
                <Muted numberOfLines={1}>{song.reason}</Muted>
              </View>
              <Row gap={12}>
                <Text
                  onPress={(event) => {
                    event.stopPropagation();
                    setLiked((current) =>
                      isLiked ? current.filter((id) => id !== song.id) : [...current, song.id],
                    );
                  }}
                  style={{ color: isLiked ? theme.colors.danger : theme.colors.textMuted }}
                >
                  ♥ {song.likes + (isLiked ? 1 : 0)}
                </Text>
                <Muted>🎸 {song.votes}</Muted>
                <Muted>▢ {song.comments}</Muted>
              </Row>
            </Recommendation>
          );
        })}
      </Card>
    </AppShell>
  );
}
