import { Button, Muted } from '@moajam/ui';
import { type ImageSourcePropType, useWindowDimensions, View } from 'react-native';
import rehearsalRoom from '../../../assets/images/mock/rehearsal-room.png';
import type { AppRoute } from '../../navigation';
import { Between, Label, SectionTitle } from '../../styles/layout';
import { CalendarTile, HomeCard, RehearsalImage, RehearsalSurface } from '../../styles/home';
import { AppIcon } from '../icons';

export function NextRehearsalCard({ navigate }: { navigate: (route: AppRoute) => void }) {
  const { width } = useWindowDimensions();

  return (
    <HomeCard>
      <Between>
        <SectionTitle>다음 합주</SectionTitle>
        <Muted>이번 주</Muted>
      </Between>
      <RehearsalSurface onPress={() => navigate('rehearsals')}>
        <View style={{ flex: 1, gap: 13 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <CalendarTile>
              <AppIcon name="calendar" color="#ef4d5e" size={23} strokeWidth={2} />
            </CalendarTile>
            <View style={{ flex: 1, gap: 4 }}>
              <Label>2026년 9월 12일 (토) · 18:00–21:00</Label>
              <Muted>홍대 합주실 A룸</Muted>
            </View>
          </View>
          <View style={{ alignSelf: 'flex-start' }}>
            <Button secondary onPress={() => navigate('rehearsals')}>
              일정 보기 →
            </Button>
          </View>
        </View>
        {width >= 700 && (
          <RehearsalImage source={rehearsalRoom as ImageSourcePropType} resizeMode="cover" />
        )}
      </RehearsalSurface>
    </HomeCard>
  );
}
