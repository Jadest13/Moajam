import { Body, Button, Muted } from '@moajam/ui';
import { type ImageSourcePropType, useWindowDimensions, View } from 'react-native';
import nirvanaCover from '../../assets/nirvana-cover.png';
import type { AppRoute } from '../../navigation';
import {
  ArtworkImage,
  Avatar,
  AvatarText,
  Between,
  Inline,
  Label,
  LinkText,
  SectionTitle,
} from '../../styles/layout';
import { ActivityRow, BottomGrid, CandidateSurface, CountText, HomeCard } from '../../styles/home';
import { AppIcon } from '../icons';

const activities = [
  {
    name: '이영희',
    initial: '영희',
    message: '새 의견을 남겼습니다.',
    meta: '방금 전',
    color: '#fde4bc',
  },
  {
    name: '김민수',
    initial: '민수',
    message: 'Guitar 녹음을 올렸습니다.',
    meta: '12분 전',
    color: '#ffd8c8',
  },
  {
    name: '박지수',
    initial: '지수',
    message: 'Ending 체크 항목을 완료했습니다.',
    meta: '54분 전',
    color: '#d7e8ff',
  },
];

export function HomeActivityGrid({ navigate }: { navigate: (route: AppRoute) => void }) {
  const { width } = useWindowDimensions();
  const stacked = width < 760;

  return (
    <BottomGrid stacked={stacked}>
      <HomeCard style={stacked ? undefined : { flex: 1.25 }}>
        <Between>
          <SectionTitle>최근 활동</SectionTitle>
          <LinkText onPress={() => navigate('rehearsals')}>전체 활동</LinkText>
        </Between>
        <View>
          {activities.map((activity) => (
            <ActivityRow key={activity.message}>
              <Avatar color={activity.color} size={36}>
                <AvatarText>{activity.initial}</AvatarText>
              </Avatar>
              <View style={{ flex: 1 }}>
                <Body>
                  <Label>{activity.name}</Label>님이 {activity.message}
                </Body>
                <Muted>{activity.meta}</Muted>
              </View>
            </ActivityRow>
          ))}
        </View>
      </HomeCard>

      <HomeCard style={stacked ? undefined : { flex: 1 }}>
        <Between>
          <SectionTitle>채택 후보</SectionTitle>
          <Muted>추천 급상승</Muted>
        </Between>
        <CandidateSurface onPress={() => navigate('recommendation')}>
          <ArtworkImage
            source={nirvanaCover as ImageSourcePropType}
            resizeMode="cover"
            style={{ width: 72, height: 72 }}
          />
          <View style={{ flex: 1, gap: 4 }}>
            <Label>Smells Like Teen Spirit</Label>
            <Muted>Nirvana</Muted>
            <Inline>
              <Inline gap={4}>
                <AppIcon name="heart" color="#ef5a5a" size={15} />
                <CountText>12</CountText>
              </Inline>
              <Inline gap={4}>
                <AppIcon name="message" color="#66738a" size={15} />
                <Muted>7</Muted>
              </Inline>
            </Inline>
          </View>
        </CandidateSurface>
        <Button secondary onPress={() => navigate('recommendation')}>
          후보 상세 보기
        </Button>
      </HomeCard>
    </BottomGrid>
  );
}
