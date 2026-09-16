export type AppRoute =
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

export interface ScreenProps {
  navigate: (route: AppRoute, options?: { id?: string }) => void;
  entityId?: string;
}
