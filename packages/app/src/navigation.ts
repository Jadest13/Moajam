export type AppRoute =
  | 'home'
  | 'recommendations'
  | 'recommendation'
  | 'songs'
  | 'song'
  | 'practice'
  | 'rehearsals'
  | 'members';

export interface ScreenProps {
  navigate: (route: AppRoute) => void;
}
