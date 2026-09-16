import { theme } from '@moajam/ui';
import { useState } from 'react';
import { Linking, Pressable, useWindowDimensions, View } from 'react-native';
import { AppShell } from '../components/AppShell';
import { ReferenceVideo } from '../components/ReferenceVideo';
import {
  ActionButton,
  Copy,
  FlexBetween,
  FlexRow,
  Heading,
  Meta,
  PageHeading,
  Pill,
  PillText,
  ResponsiveGrid,
  SongCover,
  Stack,
  Surface,
} from '../components/ProductUI';
import type { ScreenProps } from '../navigation';
import { useMockAppState } from '../state/MockAppState';
import { ArtworkImage, Avatar, AvatarText, Input } from '../styles/layout';

export function RecommendationDetailScreen({ navigate, entityId }: ScreenProps) {
  const { width } = useWindowDimensions();
  const { recommendations, selectedRecommendationId, adoptSong, isAdopted } = useMockAppState();
  const song =
    recommendations.find((item) => item.id === (entityId ?? selectedRecommendationId)) ??
    recommendations[0];
  const [liked, setLiked] = useState(false);
  const [voted, setVoted] = useState(false);
  const [draft, setDraft] = useState('');
  const [comments, setComments] = useState([
    {
      id: '1',
      author: '이영희',
      part: 'Vocal',
      text: '키가 조금 높은 것 같은데 −1 하면 괜찮을 것 같아요!',
      time: '3일 전',
    },
    {
      id: '2',
      author: '김민수',
      part: 'Guitar',
      text: '맞아요. −1 기준으로 먼저 맞춰봐요.',
      time: '3일 전',
    },
    {
      id: '3',
      author: '박지수',
      part: 'Drums',
      text: '드럼 패턴도 단순해서 첫 합주 때 빠르게 맞출 수 있을 듯!',
      time: '2일 전',
    },
  ]);
  const add = () => {
    if (!draft.trim()) return;
    setComments((all) => [
      ...all,
      {
        id: String(Date.now()),
        author: '김민수',
        part: 'Guitar',
        text: draft.trim(),
        time: '방금',
      },
    ]);
    setDraft('');
  };
  if (!song) return null;
  const adopted = isAdopted(song.id);
  return (
    <AppShell activeRoute="recommendation" onNavigate={navigate}>
      <Pressable onPress={() => navigate('recommendations')}>
        <Meta style={{ color: theme.colors.primary, fontWeight: '800' }}>
          ← 곡 추천으로 돌아가기
        </Meta>
      </Pressable>
      <ResponsiveGrid stacked={width < 920}>
        <Stack gap={16} style={width < 920 ? undefined : { flex: 1.1 }}>
          <Surface>
            <FlexRow gap={18}>
              {song.thumbnailUrl ? (
                <ArtworkImage
                  source={{ uri: song.thumbnailUrl }}
                  resizeMode="cover"
                  style={{ width: 142, height: 142, borderRadius: 12 }}
                />
              ) : (
                <SongCover id={song.id} size={142} />
              )}
              <View style={{ flex: 1, gap: 6 }}>
                <FlexBetween>
                  <PageHeading style={{ flex: 1 }}>{song.title}</PageHeading>
                  {adopted ? (
                    <Pill tone="green">
                      <PillText tone="green">이미 채택된 곡</PillText>
                    </Pill>
                  ) : null}
                </FlexBetween>
                <Heading>{song.artist}</Heading>
                <FlexRow wrap>
                  <Pill>
                    <PillText>Rock</PillText>
                  </Pill>
                  <Pill>
                    <PillText>{song.year}</PillText>
                  </Pill>
                  <Pill>
                    <PillText>03:58</PillText>
                  </Pill>
                </FlexRow>
                <Meta>추천자 김민수 · 3일 전</Meta>
              </View>
            </FlexRow>
            <Copy style={{ fontSize: 16, lineHeight: 25 }}>“{song.reason}”</Copy>
            <FlexRow wrap>
              <ActionButton secondary={!liked} onPress={() => setLiked(!liked)}>
                ♥ {song.likes + Number(liked)} 좋아요
              </ActionButton>
              <ActionButton secondary={!voted} onPress={() => setVoted(!voted)}>
                🎸 {song.votes + Number(voted)} 채택 추천
              </ActionButton>
            </FlexRow>
          </Surface>
          <Surface>
            <Heading>레퍼런스</Heading>
            <ReferenceVideo
              referenceUrl={song.referenceUrl}
              thumbnailUrl={song.thumbnailUrl}
              title={song.title}
            />
            <FlexBetween>
              <View>
                <Copy style={{ fontWeight: '900' }}>
                  {song.artist} - {song.title}
                </Copy>
                <Meta>YouTube · 4:07</Meta>
              </View>
              <ActionButton
                secondary
                disabled={!song.referenceUrl}
                onPress={() => {
                  if (song.referenceUrl) void Linking.openURL(song.referenceUrl);
                }}
              >
                새 창에서 열기
              </ActionButton>
            </FlexBetween>
          </Surface>
        </Stack>
        <Stack gap={16} style={width < 920 ? undefined : { flex: 0.9 }}>
          <Surface>
            <FlexBetween>
              <Heading>댓글 {comments.length}</Heading>
              <Meta>최신순</Meta>
            </FlexBetween>
            {comments.map((comment) => (
              <View key={comment.id} style={{ gap: 5 }}>
                <FlexRow>
                  <Avatar color="#d7e8ff">
                    <AvatarText>{comment.author.slice(1)}</AvatarText>
                  </Avatar>
                  <View>
                    <Copy style={{ fontWeight: '900' }}>{comment.author}</Copy>
                    <Meta>
                      {comment.part} · {comment.time}
                    </Meta>
                  </View>
                </FlexRow>
                <Copy>{comment.text}</Copy>
                <Meta>좋아요 · 답글</Meta>
              </View>
            ))}
            <Input
              value={draft}
              onChangeText={setDraft}
              placeholder="댓글을 입력하세요"
              multiline
            />
            <ActionButton onPress={add}>댓글 등록</ActionButton>
          </Surface>
          <Surface tint="#f7f9ff">
            <Heading>이 곡을 채택할까요?</Heading>
            <Meta>
              채택하면 팀의 채택곡 워크스페이스가 생성되고 자료·연습·합주 기록을 모을 수 있어요.
            </Meta>
            <ActionButton onPress={() => adoptSong(song.id)} disabled={adopted}>
              {adopted ? '이미 채택된 곡 ✓' : '곡 채택하기'}
            </ActionButton>
            <ActionButton secondary>보류하기</ActionButton>
          </Surface>
        </Stack>
      </ResponsiveGrid>
    </AppShell>
  );
}
