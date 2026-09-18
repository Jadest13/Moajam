import { createClient } from '@supabase/supabase-js';
import type { Workspace } from '../mocks/workspaces';
const env = (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env;
export const serverConfigured = !!(
  env.VITE_API_URL &&
  env.VITE_SUPABASE_URL &&
  env.VITE_SUPABASE_PUBLISHABLE_KEY
);
const client = serverConfigured
  ? createClient(env.VITE_SUPABASE_URL!, env.VITE_SUPABASE_PUBLISHABLE_KEY!)
  : null;
export async function currentIdentity() {
  const { data } = (await client?.auth.getSession()) ?? { data: { session: null } };
  return data.session?.user.id ?? (serverConfigured ? null : 'm1');
}
export function subscribeIdentity(callback: () => void) {
  const sub = client?.auth.onAuthStateChange(() => {
    setTimeout(callback, 0);
  });
  return () => sub?.data.subscription.unsubscribe();
}
export async function signIn(email: string, password: string) {
  if (!client) throw new Error('서버 연결 설정이 필요합니다.');
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
}
export async function signOut() {
  const { error } = (await client?.auth.signOut()) ?? {};
  if (error) throw error;
}
export async function api<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  if (!client) throw new Error('서버가 연결되지 않았습니다.');
  const { data } = await client.auth.getSession();
  if (!data.session) throw new Error('로그인이 필요합니다.');
  const response = await fetch(`${env.VITE_API_URL!.replace(/\/$/, '')}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${data.session.access_token}`,
      'Content-Type': 'application/json',
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (!response.ok) {
    let message = '서버 요청을 처리하지 못했습니다.';
    try {
      const detail = (await response.json()) as { detail?: string; message?: string };
      message = detail.detail ?? detail.message ?? message;
    } catch {
      /* Preserve a useful error for non-JSON upstream responses. */
    }
    throw new Error(message);
  }
  return response.status === 204 ? (undefined as T) : (response.json() as Promise<T>);
}
type RemoteBand = {
  id: string;
  name: string;
  members: { userId: string; role: string; part: string; user: { displayName: string } }[];
};
type Document = { key: string; value: { data: unknown }; revision: number };
const revisions = new Map<string, number>();
export async function loadRemoteWorkspaces(): Promise<Workspace[]> {
  const bands = await api<RemoteBand[]>('/workspaces');
  return Promise.all(
    bands.map(async (band) => {
      const docs = await api<Document[]>(`/workspaces/${band.id}/documents`);
      const documents: Record<string, unknown> = {};
      docs.forEach((doc) => {
        documents[doc.key] = doc.value.data;
        revisions.set(`${band.id}/${doc.key}`, doc.revision);
      });
      return {
        id: band.id,
        name: band.name,
        description: '함께 만드는 밴드',
        color: '#4f75d8',
        members: band.members.map((member) => ({
          id: member.userId,
          name: member.user.displayName,
          role: member.role,
          part: member.part,
          initials: member.user.displayName.slice(-2),
          color: '#d7e8ff',
        })),
        recommendations: (documents.recommendations ?? []) as Workspace['recommendations'],
        adoptedSongs: (documents.songs ?? []) as Workspace['adoptedSongs'],
        rehearsals: (documents.rehearsals ?? []) as Workspace['rehearsals'],
        documents: Object.fromEntries(
          Object.entries(documents).filter(
            ([key]) => !['recommendations', 'songs', 'rehearsals'].includes(key),
          ),
        ),
      };
    }),
  );
}
export async function saveRemoteWorkspace(previous: Workspace, next: Workspace) {
  const before = {
    ...previous.documents,
    recommendations: previous.recommendations,
    songs: previous.adoptedSongs,
    rehearsals: previous.rehearsals,
  };
  const after = {
    ...next.documents,
    recommendations: next.recommendations,
    songs: next.adoptedSongs,
    rehearsals: next.rehearsals,
  };
  for (const [key, data] of Object.entries(after)) {
    if (JSON.stringify(before[key as keyof typeof before]) === JSON.stringify(data)) continue;
    const ref = `${next.id}/${key}`;
    const result = await api<Document>(
      `/workspaces/${next.id}/documents/${encodeURIComponent(key)}`,
      'PUT',
      { revision: revisions.get(ref) ?? 0, value: { data } },
    );
    revisions.set(ref, result.revision);
  }
  for (const member of next.members) {
    const old = previous.members.find((item) => item.id === member.id);
    if (old && (old.role !== member.role || old.part !== member.part))
      await api(`/workspaces/${next.id}/members/${member.id}`, 'PATCH', {
        role: member.role,
        part: member.part,
      });
  }
  for (const member of previous.members) {
    if (!next.members.some((item) => item.id === member.id))
      await api(`/workspaces/${next.id}/members/${member.id}`, 'DELETE');
  }
}
export async function createRemoteWorkspace(name: string) {
  return api<{ id: string }>('/workspaces', 'POST', { name });
}
export async function uploadRemoteFile(
  blob: Blob,
  name: string,
  scope: string,
  workspaceId?: string,
) {
  const mime = (
    blob.type ||
    (name.endsWith('.musicxml') || name.endsWith('.xml')
      ? 'application/xml'
      : 'application/octet-stream')
  ).split(';')[0];
  const upload = await api<{ assetId: string; signedUrl: string }>('/assets/uploads', 'POST', {
    name,
    mime,
    size: blob.size,
    scope,
    ...(workspaceId ? { workspaceId } : {}),
  });
  const body = new FormData();
  body.append('cacheControl', '3600');
  body.append('', blob, name);
  const response = await fetch(upload.signedUrl, { method: 'PUT', body });
  if (!response.ok) throw new Error('파일을 업로드하지 못했습니다. 다시 시도해주세요.');
  await api(`/assets/${upload.assetId}/complete`, 'POST');
  return upload.assetId;
}
