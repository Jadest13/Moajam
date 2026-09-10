import { QueryClient, queryOptions } from '@tanstack/react-query';
import type { WorkspaceOverview } from '@moajam/domain';

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

const demoOverview: WorkspaceOverview = {
  workspace: { id: 'ws-demo', name: '주말 합주단', memberCount: 5, role: 'OWNER' },
  activeSong: {
    id: 'song-demo',
    title: "Don't Look Back in Anger",
    artist: 'Oasis',
    key: 'C',
    bpm: 80,
    preparations: [
      { id: 'p1', part: 'VOCAL', displayName: 'Vocal', memberName: '이영희', status: 'READY' },
      {
        id: 'p2',
        part: 'GUITAR',
        displayName: 'Guitar 1',
        memberName: '김민수',
        status: 'PRACTICING',
      },
      { id: 'p3', part: 'BASS', displayName: 'Bass', memberName: '최민수', status: 'READY' },
      { id: 'p4', part: 'DRUMS', displayName: 'Drums', memberName: '박지수', status: 'NOT_READY' },
    ],
  },
  decisions: [
    { id: 'd1', content: 'Verse 2 첫 8마디 Guitar 1 연주하지 않음' },
    { id: 'd2', content: '원곡 Key C로 합주 진행' },
  ],
  checklist: [
    { id: 'c1', content: 'Intro 길이 결정', completed: false },
    { id: 'c2', content: 'Guitar Tone 확인', completed: false },
    { id: 'c3', content: 'Key 변경 테스트', completed: true },
  ],
};

export const workspaceKeys = {
  all: ['workspaces'] as const,
  overview: (workspaceId: string) => [...workspaceKeys.all, workspaceId, 'overview'] as const,
};

export const workspaceOverviewOptions = (workspaceId: string) =>
  queryOptions({
    queryKey: workspaceKeys.overview(workspaceId),
    queryFn: async () => demoOverview,
  });
