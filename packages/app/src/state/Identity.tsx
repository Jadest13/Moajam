import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { View } from 'react-native';
import { currentIdentity, subscribeIdentity, signIn, serverConfigured, api } from '../lib/remote';
import { activatePreferences } from './preferences';
import { ActionButton, Heading, Meta, Surface } from '../components/ProductUI';
import { Input } from '../styles/layout';
const Identity = createContext('m1');
export function IdentityProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<string | null>(serverConfigured ? null : 'm1');
  const [loading, setLoading] = useState(serverConfigured);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let alive = true;
    const refresh = () => {
      void currentIdentity()
        .then(async (id) => {
          const profile =
            id && serverConfigured ? await api<{ displayName: string } | null>('/me') : null;
          if (alive) {
            if (id) activatePreferences(id, profile?.displayName);
            setUser(id);
            setLoading(false);
          }
        })
        .catch(() => {
          if (alive) {
            setError('로그인을 확인하지 못했어요. 새로고침해주세요.');
            setLoading(false);
          }
        });
    };
    refresh();
    const unsubscribe = subscribeIdentity(refresh);
    return () => {
      alive = false;
      unsubscribe();
    };
  }, []);
  if (loading)
    return (
      <View style={{ padding: 40 }}>
        <Meta>계정 확인 중…</Meta>
      </View>
    );
  if (!user)
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f5f7fb' }}>
        <Surface style={{ maxWidth: 440, width: '100%', alignSelf: 'center' }}>
          <Heading>Moajam 로그인</Heading>
          <Input
            accessibilityLabel="이메일"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="이메일"
          />
          <Input
            accessibilityLabel="비밀번호"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="비밀번호"
          />
          {error ? <Meta accessibilityRole="alert">{error}</Meta> : null}
          <ActionButton
            disabled={busy || !email.trim() || !password}
            onPress={() => {
              setBusy(true);
              setError('');
              void signIn(email.trim(), password)
                .catch((failure: unknown) =>
                  setError(failure instanceof Error ? failure.message : '로그인하지 못했어요.'),
                )
                .finally(() => {
                  setBusy(false);
                  setPassword('');
                });
            }}
          >
            {busy ? '로그인 중…' : '로그인'}
          </ActionButton>
          <Meta>등록된 계정으로 로그인해주세요.</Meta>
        </Surface>
      </View>
    );
  return (
    <Identity.Provider key={user} value={user}>
      {children}
    </Identity.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export function useIdentity() {
  return useContext(Identity);
}
