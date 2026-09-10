import { Muted } from '@moajam/ui';
import { type ImageSourcePropType, useWindowDimensions, View } from 'react-native';
import creepCover from '../../assets/creep-cover.png';
import nirvanaCover from '../../assets/nirvana-cover.png';
import oasisCover from '../../assets/oasis-cover.png';
import { adoptedSongs } from '../../mocks/data';
import type { AppRoute } from '../../navigation';
import { ArtworkImage, Between, LinkText, SectionTitle } from '../../styles/layout';
import {
  HomeCard,
  PracticeButton,
  PracticeButtonText,
  SongName,
  SongRow,
  StatusDot,
  StatusDots,
} from '../../styles/home';
import { AppIcon } from '../icons';

const readiness = [
  ['#ef5a5a', '#f5a623', '#20b26b', '#246bfd'],
  ['#20b26b', '#f5a623', '#246bfd', '#d4dbe7'],
  ['#ef5a5a', '#ef5a5a', '#d4dbe7', '#d4dbe7'],
];

const homeSongs = [adoptedSongs[1], adoptedSongs[0], adoptedSongs[2]];
const covers = [oasisCover, creepCover, nirvanaCover] as ImageSourcePropType[];

export function ReadySongsCard({ navigate }: { navigate: (route: AppRoute) => void }) {
  const { width } = useWindowDimensions();

  return (
    <HomeCard>
      <Between>
        <SectionTitle>준비가 필요한 곡</SectionTitle>
        <LinkText onPress={() => navigate('songs')}>전체 보기 →</LinkText>
      </Between>
      <View>
        {homeSongs.map((song, index) => (
          <SongRow key={song.id} onPress={() => navigate('song')}>
            <ArtworkImage
              source={covers[index]}
              resizeMode="cover"
              style={{ width: 48, height: 48 }}
            />
            <View style={{ flex: 1, gap: 3 }}>
              <SongName numberOfLines={1}>{song.title}</SongName>
              <Muted>{song.artist}</Muted>
            </View>
            {width >= 430 && (
              <StatusDots>
                {readiness[index].map((color, dotIndex) => (
                  <StatusDot key={`${song.id}-${dotIndex}`} color={color} />
                ))}
              </StatusDots>
            )}
            <Muted>
              {song.ready} / {song.total}
            </Muted>
            {width >= 700 ? (
              <PracticeButton
                onPress={(event) => {
                  event.stopPropagation();
                  navigate('practice');
                }}
              >
                <PracticeButtonText>연습하기</PracticeButtonText>
              </PracticeButton>
            ) : (
              <AppIcon name="chevron-right" color="#66738a" size={18} />
            )}
          </SongRow>
        ))}
      </View>
    </HomeCard>
  );
}
