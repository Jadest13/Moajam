import { useState } from 'react';
import type { AppRoute } from './navigation';
import { HomeScreen } from './screens/HomeScreen';
import { HelpScreen } from './screens/HelpScreen';
import { InstrumentExtractorScreen } from './screens/InstrumentExtractorScreen';
import { MembersScreen } from './screens/MembersScreen';
import { PracticeScreen } from './screens/PracticeScreen';
import { RecommendationDetailScreen } from './screens/RecommendationDetailScreen';
import { RecommendationsScreen } from './screens/RecommendationsScreen';
import { RehearsalsScreen } from './screens/RehearsalsScreen';
import { ScoreEditorScreen } from './screens/ScoreEditorScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { SongsScreen } from './screens/SongsScreen';
import { SongWorkspaceScreen } from './screens/SongWorkspaceScreen';

interface AppScreenProps {
  route: AppRoute;
  navigate: (route: AppRoute, options?: { id?: string }) => void;
  entityId?: string;
}

export function AppScreen({ route, navigate, entityId }: AppScreenProps) {
  switch (route) {
    case 'recommendations':
      return <RecommendationsScreen navigate={navigate} />;
    case 'recommendation':
      return <RecommendationDetailScreen navigate={navigate} entityId={entityId} />;
    case 'songs':
      return <SongsScreen navigate={navigate} />;
    case 'song':
      return <SongWorkspaceScreen navigate={navigate} />;
    case 'practice':
      return <PracticeScreen navigate={navigate} />;
    case 'rehearsals':
      return <RehearsalsScreen navigate={navigate} />;
    case 'members':
      return <MembersScreen navigate={navigate} />;
    case 'instrument':
      return <InstrumentExtractorScreen navigate={navigate} />;
    case 'score-editor':
      return <ScoreEditorScreen navigate={navigate} />;
    case 'settings':
      return <SettingsScreen navigate={navigate} />;
    case 'help':
      return <HelpScreen navigate={navigate} />;
    default:
      return <HomeScreen navigate={navigate} />;
  }
}

export function MoajamApp() {
  const [route, setRoute] = useState<AppRoute>('home');
  return <AppScreen route={route} navigate={setRoute} />;
}
