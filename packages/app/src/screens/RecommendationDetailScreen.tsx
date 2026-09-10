import { Body, Button, Card, Muted, Row, Stack, theme } from '@moajam/ui';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { AppShell } from '../components/AppShell';
import type { ScreenProps } from '../navigation';
import {
  Artwork,
  ArtworkText,
  Between,
  Input,
  Label,
  PageTitle,
  SectionTitle,
} from '../styles/layout';

export function RecommendationDetailScreen({ navigate }: ScreenProps) {
  const [liked, setLiked] = useState(false);
  const [voted, setVoted] = useState(false);
  const [draft, setDraft] = useState('');
  const [comments, setComments] = useState([
    { id: '1', author: '이영희', text: '키가 조금 높은 것 같은데 -1 하면 괜찮을 것 같아요!' },
    { id: '2', author: '김하수', text: '맞아요. -1 기준으로 먼저 맞춰봐요.' },
  ]);

  const addComment = () => {
    const value = draft.trim();
    if (!value) return;
    setComments((items) => [...items, { id: String(Date.now()), author: '김민수', text: value }]);
    setDraft('');
  };

  return (
    <AppShell activeRoute="recommendation" onNavigate={navigate}>
      <Text onPress={() => navigate('recommendations')} style={{ color: theme.colors.primary }}>
        ← 곡 추천으로 돌아가기
      </Text>
      <Card>
        <Row gap={18}>
          <Artwork tint="#e86545" size={112}>
            <ArtworkText>♪</ArtworkText>
          </Artwork>
          <View style={{ flex: 1, gap: 5 }}>
            <PageTitle>Creep</PageTitle>
            <Muted>Radiohead</Muted>
            <Row wrap>
              <Label>Rock</Label>
              <Muted>1993</Muted>
              <Muted>03:58</Muted>
            </Row>
            <Body>인트로부터 분위기가 확 살아서 오프닝 곡으로 좋을 것 같아요.</Body>
          </View>
        </Row>
        <Row wrap gap={10}>
          <Button secondary={!liked} onPress={() => setLiked(!liked)}>
            ♥ {8 + (liked ? 1 : 0)} 좋아요
          </Button>
          <Button secondary={!voted} onPress={() => setVoted(!voted)}>
            🎸 {5 + (voted ? 1 : 0)} 채택 추천
          </Button>
          <Button secondary>▶ 레퍼런스 열기</Button>
        </Row>
      </Card>
      <Card>
        <Between>
          <SectionTitle>댓글 {comments.length}</SectionTitle>
          <Muted>자유롭게 의견을 나눠보세요.</Muted>
        </Between>
        <Stack gap={12}>
          {comments.map((comment) => (
            <View key={comment.id} style={{ gap: 4 }}>
              <Label>{comment.author}</Label>
              <Body>{comment.text}</Body>
              <Muted>방금 전 · 답글</Muted>
            </View>
          ))}
        </Stack>
        <Row>
          <Input
            style={{ flex: 1 }}
            value={draft}
            onChangeText={setDraft}
            placeholder="댓글을 입력하세요"
            onSubmitEditing={addComment}
          />
          <Button onPress={addComment}>등록</Button>
        </Row>
      </Card>
    </AppShell>
  );
}
