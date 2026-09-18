import { useEffect, useState } from 'react';
import { api, serverConfigured } from '../lib/remote';
import { ActionButton, Copy, Heading, Meta, Surface } from './ProductUI';
type Notification = { id: string; message: string; readAt: string | null; createdAt: string };
export function Notifications() {
  const [items, setItems] = useState<Notification[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    if (serverConfigured)
      void api<Notification[]>('/notifications')
        .then(setItems)
        .catch((error: Error) => setError(error.message));
  }, []);
  return (
    <Surface>
      <Heading>내 알림</Heading>
      {!serverConfigured ? (
        <Meta>서버 로그인 후 밴드 알림을 받을 수 있습니다.</Meta>
      ) : !items.length ? (
        <Meta>새로운 알림이 없습니다.</Meta>
      ) : null}
      {error ? <Meta>{error}</Meta> : null}
      {items.map((item) => (
        <Surface key={item.id} tint={item.readAt ? 'white' : '#eef4ff'}>
          <Copy>{item.message}</Copy>
          <Meta>{new Date(item.createdAt).toLocaleString('ko-KR')}</Meta>
          {!item.readAt ? (
            <ActionButton
              secondary
              compact
              onPress={() =>
                void api(`/notifications/${item.id}/read`, 'POST')
                  .then(() =>
                    setItems((all) =>
                      all.map((value) =>
                        value.id === item.id
                          ? { ...value, readAt: new Date().toISOString() }
                          : value,
                      ),
                    ),
                  )
                  .catch((error: Error) => setError(error.message))
              }
            >
              읽음으로 표시
            </ActionButton>
          ) : null}
        </Surface>
      ))}
    </Surface>
  );
}
