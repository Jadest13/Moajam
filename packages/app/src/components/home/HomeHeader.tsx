import { Muted } from '@moajam/ui';
import { useWindowDimensions } from 'react-native';
import type { AppRoute } from '../../navigation';
import { Avatar, AvatarText, Between, PageHeader } from '../../styles/layout';
import { HeaderActions, HomeTitle, IconButton } from '../../styles/home';
import { AppIcon } from '../icons';

export function HomeHeader({ navigate }: { navigate: (route: AppRoute) => void }) {
  const { width } = useWindowDimensions();

  return (
    <Between>
      <PageHeader>
        <HomeTitle>좋은 오후예요, 김민수님! 👋</HomeTitle>
        <Muted>좋은 음악은, 함께할 때 더 특별합니다.</Muted>
      </PageHeader>
      {width >= 620 && (
        <HeaderActions>
          <IconButton accessibilityLabel="멤버 초대" onPress={() => navigate('members')}>
            <AppIcon name="user-plus" color="#66738a" size={18} />
          </IconButton>
          <IconButton accessibilityLabel="알림">
            <AppIcon name="bell" color="#66738a" size={18} />
          </IconButton>
          <Avatar color="#ffd8c8" size={36}>
            <AvatarText>민수</AvatarText>
          </Avatar>
          <IconButton accessibilityLabel="더보기">
            <AppIcon name="more" color="#66738a" size={18} />
          </IconButton>
        </HeaderActions>
      )}
    </Between>
  );
}
