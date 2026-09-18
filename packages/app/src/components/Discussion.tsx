import { useState } from 'react';
import { useIdentity } from '../state/Identity';
import { View } from 'react-native';
import { useMockAppState, useWorkspaceValue } from '../state/MockAppState';
import { Input } from '../styles/layout';
import { ActionButton, Copy, FlexRow, Heading, Meta, Pill, PillText, Surface } from './ProductUI';
type Reply = { id: string; authorId: string; text: string; date: string };
type Opinion = Reply & { resolved: boolean; likes: string[]; replies: Reply[] };
export function Discussion({ documentKey }: { documentKey: string }) {
  const currentUserId = useIdentity();
  const { members, canManage } = useMockAppState();
  const [stored, setItems] = useWorkspaceValue<Opinion[]>(documentKey, []);
  const items = stored.map((item) => ({
    ...item,
    date: item.date ?? new Date(0).toISOString(),
    likes: item.likes ?? [],
    replies: item.replies ?? [],
    resolved: item.resolved ?? false,
  }));
  const [draft, setDraft] = useState('');
  const [filter, setFilter] = useState('전체');
  const [editing, setEditing] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const author = (id: string) => members.find((member) => member.id === id)?.name ?? '탈퇴한 멤버';
  const update = (id: string, changes: Partial<Opinion>) =>
    setItems((all) => all.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  return (
    <>
      <Surface>
        <Heading>의견 남기기</Heading>
        <Input
          multiline
          value={draft}
          onChangeText={setDraft}
          placeholder="편곡, 톤, 연주 방식에 대한 의견"
        />
        <ActionButton
          disabled={!draft.trim()}
          onPress={() => {
            setItems((all) => [
              {
                id: `opinion-${Date.now()}`,
                authorId: currentUserId,
                text: draft.trim(),
                date: new Date().toISOString(),
                resolved: false,
                likes: [],
                replies: [],
              },
              ...all,
            ]);
            setDraft('');
          }}
        >
          등록
        </ActionButton>
        <Meta>
          의견 {items.length} · 결정 {items.filter((item) => item.resolved).length} · 참여{' '}
          {
            new Set(
              items.flatMap((item) => [item.authorId, ...item.replies.map((r) => r.authorId)]),
            ).size
          }
          명
        </Meta>
      </Surface>
      <FlexRow wrap>
        {['전체', '논의 중', '결정됨'].map((value) => (
          <Pill key={value} active={filter === value} onPress={() => setFilter(value)}>
            <PillText active={filter === value}>{value}</PillText>
          </Pill>
        ))}
      </FlexRow>
      {items
        .filter((item) => filter === '전체' || item.resolved === (filter === '결정됨'))
        .map((item) => (
          <Surface key={item.id}>
            <FlexRow wrap>
              <Copy>{author(item.authorId)}</Copy>
              <Meta>{new Date(item.date).toLocaleString('ko-KR')}</Meta>
              {item.resolved ? <Meta>결정됨</Meta> : null}
            </FlexRow>
            {editing === item.id ? (
              <>
                <Input multiline value={editText} onChangeText={setEditText} />
                <ActionButton
                  disabled={!editText.trim()}
                  onPress={() => {
                    update(item.id, { text: editText.trim() });
                    setEditing(null);
                  }}
                >
                  수정 저장
                </ActionButton>
                <ActionButton secondary onPress={() => setEditing(null)}>
                  취소
                </ActionButton>
              </>
            ) : (
              <Copy>{item.text}</Copy>
            )}
            <FlexRow wrap>
              <ActionButton
                secondary
                compact
                onPress={() =>
                  update(item.id, {
                    likes: item.likes.includes(currentUserId)
                      ? item.likes.filter((id) => id !== currentUserId)
                      : [...item.likes, currentUserId],
                  })
                }
              >
                ♥ {item.likes.length}
              </ActionButton>
              <ActionButton
                secondary
                compact
                onPress={() => setReplyTo(replyTo === item.id ? null : item.id)}
              >
                답글 {item.replies.length}
              </ActionButton>
              {canManage ? (
                <ActionButton
                  secondary
                  compact
                  onPress={() => update(item.id, { resolved: !item.resolved })}
                >
                  {item.resolved ? '다시 논의' : '결정으로 표시'}
                </ActionButton>
              ) : null}
              {item.authorId === currentUserId ? (
                <ActionButton
                  secondary
                  compact
                  onPress={() => {
                    setEditing(item.id);
                    setEditText(item.text);
                  }}
                >
                  수정
                </ActionButton>
              ) : null}
              {canManage || item.authorId === currentUserId ? (
                <ActionButton
                  secondary
                  compact
                  onPress={() => setItems((all) => all.filter((value) => value.id !== item.id))}
                >
                  삭제
                </ActionButton>
              ) : null}
            </FlexRow>
            {item.replies.map((r) => (
              <View key={r.id} style={{ padding: 12, backgroundColor: '#f5f7fb', borderRadius: 8 }}>
                <Meta>{author(r.authorId)}</Meta>
                <Copy>{r.text}</Copy>
                {r.authorId === currentUserId || canManage ? (
                  <ActionButton
                    secondary
                    compact
                    onPress={() =>
                      update(item.id, { replies: item.replies.filter((v) => v.id !== r.id) })
                    }
                  >
                    답글 삭제
                  </ActionButton>
                ) : null}
              </View>
            ))}
            {replyTo === item.id ? (
              <>
                <Input value={reply} onChangeText={setReply} placeholder="답글 입력" />
                <ActionButton
                  disabled={!reply.trim()}
                  onPress={() => {
                    update(item.id, {
                      replies: [
                        ...item.replies,
                        {
                          id: `reply-${Date.now()}`,
                          authorId: currentUserId,
                          text: reply.trim(),
                          date: new Date().toISOString(),
                        },
                      ],
                    });
                    setReply('');
                    setReplyTo(null);
                  }}
                >
                  답글 등록
                </ActionButton>
              </>
            ) : null}
          </Surface>
        ))}
      {!items.length ? (
        <Meta>첫 의견을 남겨보세요. 의견과 결정은 화면을 이동해도 유지됩니다.</Meta>
      ) : null}
    </>
  );
}
