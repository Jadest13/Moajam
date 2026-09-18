export type AppRoute =
  | 'personal-home'
  | 'personal-rehearsals'
  | 'personal-songs'
  | 'personal-practice'
  | 'home'
  | 'recommendations'
  | 'recommendation'
  | 'songs'
  | 'song'
  | 'practice'
  | 'rehearsals'
  | 'members'
  | 'instrument'
  | 'score-editor'
  | 'settings'
  | 'help';

export interface NavigationOptions {
  id?: string;
  workspaceId?: string;
}

export interface ScreenProps {
  navigate: (route: AppRoute, options?: NavigationOptions) => void;
  entityId?: string;
}

export function buildAppPath(
  next: AppRoute,
  options: NavigationOptions | undefined,
  context: { route: AppRoute; workspaceId: string; entityId?: string },
) {
  const bandId = options?.workspaceId ?? context.workspaceId;
  const base = `/workspaces/${encodeURIComponent(bandId)}`;
  const id =
    options?.id ??
    (['song', 'practice', 'personal-practice'].includes(context.route)
      ? context.entityId
      : undefined);
  const personalPaths: Partial<Record<AppRoute, string>> = {
    'personal-home': '/me',
    'personal-rehearsals': '/me/rehearsals',
    'personal-songs': '/me/songs',
    instrument: '/me/instrument-extractor',
    'score-editor': id
      ? `/me/score-editor?${new URLSearchParams({ workspaceId: bandId, songId: id })}`
      : '/me/score-editor',
    settings: '/settings',
    help: '/help',
  };
  if (personalPaths[next]) return personalPaths[next]!;
  if (next === 'personal-practice')
    return id
      ? `/me/practice?${new URLSearchParams({ workspaceId: bandId, songId: id })}`
      : '/me/practice';
  const paths: Partial<Record<AppRoute, string>> = {
    home: base,
    recommendations: `${base}/recommendations`,
    songs: `${base}/songs`,
    rehearsals: `${base}/rehearsals${options?.id ? `?sessionId=${encodeURIComponent(options.id)}` : ''}`,
    members: `${base}/members`,
    recommendation: options?.id
      ? `${base}/recommendations/${encodeURIComponent(options.id)}`
      : `${base}/recommendations`,
    song: id ? `${base}/songs/${encodeURIComponent(id)}` : `${base}/songs`,
    practice: id ? `${base}/songs/${encodeURIComponent(id)}/practice` : '/me/practice',
  };
  return paths[next] ?? '/me';
}
