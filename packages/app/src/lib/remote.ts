import type { Workspace } from '../mocks/workspaces';
export const serverConfigured = false;
export async function currentIdentity(): Promise<string | null> {
  return 'm1';
}
export function subscribeIdentity(_callback: () => void) {
  void _callback;
  return () => {};
}
export async function signIn(_email: string, _password: string) {
  void _email;
  void _password;
  throw new Error('모바일 인증 연결이 필요합니다.');
}
export async function signOut() {}
export async function api<T>(_path: string, _method = 'GET', _body?: unknown): Promise<T> {
  void _path;
  void _method;
  void _body;
  throw new Error('서버가 연결되지 않았습니다.');
}
export async function loadRemoteWorkspaces(): Promise<Workspace[]> {
  return [];
}
export async function saveRemoteWorkspace(_previous: Workspace, _next: Workspace) {
  void _previous;
  void _next;
}
export async function createRemoteWorkspace(_name: string): Promise<{ id: string }> {
  void _name;
  throw new Error('서버가 연결되지 않았습니다.');
}
export async function uploadRemoteFile(
  _blob: Blob,
  _name: string,
  _scope: string,
  _workspaceId?: string,
): Promise<string> {
  void _blob;
  void _name;
  void _scope;
  void _workspaceId;
  throw new Error('서버가 연결되지 않았습니다.');
}
