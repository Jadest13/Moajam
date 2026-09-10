import { AppProviders, AppScreen, type AppRoute } from '@moajam/app';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
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
};

function RoutedScreen({ route }: { route: AppRoute }) {
  const navigate = useNavigate();
  return <AppScreen route={route} navigate={(nextRoute) => navigate(routePaths[nextRoute])} />;
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
