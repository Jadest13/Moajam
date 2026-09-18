import { AppProviders, MoajamApp } from '@moajam/app';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <AppProviders>
      <StatusBar style="dark" />
      <MoajamApp />
    </AppProviders>
  );
}
