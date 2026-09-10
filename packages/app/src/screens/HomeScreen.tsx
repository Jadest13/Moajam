import { AppShell } from '../components/AppShell';
import { HomeActivityGrid } from '../components/home/HomeActivityGrid';
import { HomeHeader } from '../components/home/HomeHeader';
import { NextRehearsalCard } from '../components/home/NextRehearsalCard';
import { ReadySongsCard } from '../components/home/ReadySongsCard';
import type { ScreenProps } from '../navigation';

export function HomeScreen({ navigate }: ScreenProps) {
  return (
    <AppShell activeRoute="home" onNavigate={navigate}>
      <HomeHeader navigate={navigate} />
      <NextRehearsalCard navigate={navigate} />
      <ReadySongsCard navigate={navigate} />
      <HomeActivityGrid navigate={navigate} />
    </AppShell>
  );
}
