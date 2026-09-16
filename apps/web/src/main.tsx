import { AppProviders, AppScreen, type AppRoute } from '@moajam/app';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import './styles.css';

const routePaths: Record<AppRoute, string> = {
  home: '/workspaces/ws-demo',
  recommendations: '/workspaces/ws-demo/recommendations',
  recommendation: '/workspaces/ws-demo/recommendations/creep',
  songs: '/workspaces/ws-demo/songs',
  song: '/workspaces/ws-demo/songs/creep',
  practice: '/workspaces/ws-demo/songs/creep/practice',
  rehearsals: '/workspaces/ws-demo/rehearsals',
  members: '/workspaces/ws-demo/members',
  instrument: '/me/instrument-extractor',
  'score-editor': '/me/score-editor',
  settings: '/settings',
  help: '/help',
};

function RoutedScreen({ route }: { route: AppRoute }) {
  const navigate = useNavigate();
  const params = useParams();
  const entityId = params.recommendationId ?? params.songId;
  return (
    <AppScreen
      route={route}
      entityId={entityId}
      navigate={(nextRoute, options) => {
        const basePath = routePaths[nextRoute];
        const nextPath = options?.id
          ? nextRoute === 'recommendation'
            ? `/workspaces/ws-demo/recommendations/${options.id}`
            : nextRoute === 'song'
              ? `/workspaces/ws-demo/songs/${options.id}`
              : basePath
          : basePath;
        navigate(nextPath);
      }}
    />
  );
}

function WebApp() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/workspaces/:workspaceId" element={<RoutedScreen route="home" />} />
          <Route
            path="/workspaces/:workspaceId/recommendations"
            element={<RoutedScreen route="recommendations" />}
          />
          <Route
            path="/workspaces/:workspaceId/recommendations/:recommendationId"
            element={<RoutedScreen route="recommendation" />}
          />
          <Route path="/workspaces/:workspaceId/songs" element={<RoutedScreen route="songs" />} />
          <Route
            path="/workspaces/:workspaceId/songs/:songId"
            element={<RoutedScreen route="song" />}
          />
          <Route
            path="/workspaces/:workspaceId/songs/:songId/practice"
            element={<RoutedScreen route="practice" />}
          />
          <Route
            path="/workspaces/:workspaceId/rehearsals"
            element={<RoutedScreen route="rehearsals" />}
          />
          <Route
            path="/workspaces/:workspaceId/members"
            element={<RoutedScreen route="members" />}
          />
          <Route path="/me/instrument-extractor" element={<RoutedScreen route="instrument" />} />
          <Route path="/me/score-editor" element={<RoutedScreen route="score-editor" />} />
          <Route path="/settings" element={<RoutedScreen route="settings" />} />
          <Route path="/help" element={<RoutedScreen route="help" />} />
          <Route path="*" element={<Navigate to="/workspaces/ws-demo" replace />} />
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
