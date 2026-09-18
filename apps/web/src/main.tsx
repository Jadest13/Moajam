import {
  AppProviders,
  AppScreen,
  buildAppPath,
  type AppRoute,
  type NavigationOptions,
} from '@moajam/app';
import { useMockAppState } from '@moajam/app';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import './styles.css';

function RoutedScreen({ route }: { route: AppRoute }) {
  const navigate = useNavigate();
  const params = useParams();
  const [search] = useSearchParams();
  const { selectedWorkspaceId } = useMockAppState();
  const workspaceId = params.workspaceId ?? search.get('workspaceId') ?? undefined;
  const entityId =
    params.recommendationId ??
    params.songId ??
    search.get('songId') ??
    search.get('sessionId') ??
    undefined;
  const go = (next: AppRoute, options?: NavigationOptions) =>
    navigate(
      buildAppPath(next, options, {
        route,
        workspaceId: workspaceId ?? selectedWorkspaceId,
        entityId,
      }),
    );
  return <AppScreen route={route} workspaceId={workspaceId} entityId={entityId} navigate={go} />;
}
const routes: Array<[string, AppRoute]> = [
  ['/me', 'personal-home'],
  ['/me/rehearsals', 'personal-rehearsals'],
  ['/me/songs', 'personal-songs'],
  ['/me/practice', 'personal-practice'],
  ['/workspaces/:workspaceId', 'home'],
  ['/workspaces/:workspaceId/recommendations', 'recommendations'],
  ['/workspaces/:workspaceId/recommendations/:recommendationId', 'recommendation'],
  ['/workspaces/:workspaceId/songs', 'songs'],
  ['/workspaces/:workspaceId/songs/:songId', 'song'],
  ['/workspaces/:workspaceId/songs/:songId/practice', 'practice'],
  ['/workspaces/:workspaceId/rehearsals', 'rehearsals'],
  ['/workspaces/:workspaceId/members', 'members'],
  ['/me/instrument-extractor', 'instrument'],
  ['/me/score-editor', 'score-editor'],
  ['/settings', 'settings'],
  ['/help', 'help'],
];
function WebApp() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          {routes.map(([path, route]) => (
            <Route key={path} path={path} element={<RoutedScreen route={route} />} />
          ))}
          <Route path="*" element={<Navigate to="/me" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WebApp />
  </React.StrictMode>,
);
