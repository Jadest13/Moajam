import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import {
  adoptedSongs as initialAdoptedSongs,
  members as initialMembers,
  recommendations as initialRecommendations,
  type RecommendationItem,
} from '../mocks/data';

export type MockMember = (typeof initialMembers)[number];
export type AdoptedSong = RecommendationItem & {
  ready: number;
  total: number;
  status: 'READY' | 'PRACTICING';
};

interface MockAppStateValue {
  recommendations: RecommendationItem[];
  adoptedSongs: AdoptedSong[];
  members: MockMember[];
  selectedRecommendationId: string;
  addRecommendation: (song: RecommendationItem) => void;
  selectRecommendation: (id: string) => void;
  adoptSong: (id: string) => void;
  isAdopted: (id: string) => boolean;
  updateMember: (id: string, changes: Pick<MockMember, 'part' | 'role'>) => void;
  removeMember: (id: string) => void;
}

const MockAppStateContext = createContext<MockAppStateValue | null>(null);

export function MockAppStateProvider({ children }: PropsWithChildren) {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(() => [
    ...initialRecommendations,
  ]);
  const [adoptedSongs, setAdoptedSongs] = useState<AdoptedSong[]>(() =>
    initialAdoptedSongs.map((song) => ({
      ...song,
      status: song.status as AdoptedSong['status'],
    })),
  );
  const [members, setMembers] = useState<MockMember[]>(() => [...initialMembers]);
  const [selectedRecommendationId, setSelectedRecommendationId] = useState('creep');

  const value = useMemo<MockAppStateValue>(
    () => ({
      recommendations,
      adoptedSongs,
      members,
      selectedRecommendationId,
      addRecommendation: (song) => setRecommendations((current) => [song, ...current]),
      selectRecommendation: setSelectedRecommendationId,
      adoptSong: (id) => {
        const song = recommendations.find((item) => item.id === id);
        if (!song) return;
        setAdoptedSongs((current) =>
          current.some((item) => item.id === id)
            ? current
            : [...current, { ...song, ready: 0, total: members.length, status: 'PRACTICING' }],
        );
      },
      isAdopted: (id) => adoptedSongs.some((song) => song.id === id),
      updateMember: (id, changes) =>
        setMembers((current) =>
          current.map((member) => (member.id === id ? { ...member, ...changes } : member)),
        ),
      removeMember: (id) => setMembers((current) => current.filter((member) => member.id !== id)),
    }),
    [adoptedSongs, members, recommendations, selectedRecommendationId],
  );

  return <MockAppStateContext.Provider value={value}>{children}</MockAppStateContext.Provider>;
}

// Provider와 목 상태 훅을 한 파일에서 함께 관리한다.
// eslint-disable-next-line react-refresh/only-export-components
export function useMockAppState() {
  const context = useContext(MockAppStateContext);
  if (!context) throw new Error('useMockAppState must be used inside MockAppStateProvider.');
  return context;
}
