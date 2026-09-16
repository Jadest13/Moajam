import styled from '@emotion/native';
import { Stack, theme } from '@moajam/ui';
import type { PropsWithChildren } from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
import moajamLogo from '../../assets/logo.png';
import type { AppRoute } from '../navigation';
import { Avatar, AvatarText, Main, PageScroll, Shell } from '../styles/layout';
import { ComingSoonOverlay } from './ProductUI';
import { AppIcon, type AppIconName } from './icons';

const brandLogoSource = typeof moajamLogo === 'string' ? { uri: moajamLogo } : moajamLogo;

const Sidebar = styled.View`
  width: 232px;
  min-height: 100%;
  padding: 22px 16px;
  justify-content: space-between;
  background-color: #101d35;
`;

const BrandMark = styled.Image`
  width: 44px;
  height: 44px;
`;

const BrandButton = styled.Pressable`
  align-self: flex-start;
  gap: 14px;
  flex-direction: row;
  align-items: center;
`;

const BrandName = styled.Text<{ dark?: boolean }>`
  color: ${({ dark }) => (dark ? theme.colors.text : 'white')};
  font-size: 20px;
  font-weight: 900;
`;

const WorkspaceSwitcher = styled.View`
  margin: 24px 0 18px;
  padding: 12px;
  gap: 10px;
  flex-direction: row;
  align-items: center;
  border: 1px solid #2c3b55;
  border-radius: 12px;
  background-color: #192943;
`;

const WorkspaceThumb = styled.View`
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background-color: #f3a45b;
`;

const WhiteText = styled.Text<{ small?: boolean }>`
  color: white;
  font-size: ${({ small }) => (small ? 11 : 14)}px;
  font-weight: ${({ small }) => (small ? 500 : 700)};
`;

const NavItem = styled.Pressable<{ active?: boolean }>`
  padding: 11px 12px;
  gap: 12px;
  flex-direction: row;
  align-items: center;
  border-radius: 10px;
  background-color: ${({ active }) => (active ? '#253653' : 'transparent')};
`;

const NavIcon = styled.View`
  width: 20px;
  align-items: center;
  justify-content: center;
`;

const NavLabel = styled.Text<{ active?: boolean }>`
  color: ${({ active }) => (active ? 'white' : '#aab6ca')};
  font-size: 14px;
  font-weight: ${({ active }) => (active ? 700 : 500)};
`;

const NavGroupLabel = styled.Text`
  margin: 22px 12px 8px;
  color: #72819a;
  font-size: 11px;
  font-weight: 800;
`;

const Profile = styled.View`
  padding: 12px 8px 0;
  gap: 10px;
  flex-direction: row;
  align-items: center;
  border-top-width: 1px;
  border-top-color: #2b3951;
`;

const MobileHeader = styled.View`
  padding: 14px 18px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
  background-color: white;
`;

const BottomNav = styled.View`
  padding: 9px 8px 12px;
  flex-direction: row;
  justify-content: space-around;
  border-top-width: 1px;
  border-top-color: ${theme.colors.border};
  background-color: white;
`;

const BottomItem = styled.Pressable`
  min-width: 56px;
  gap: 3px;
  align-items: center;
`;

const BottomLabel = styled.Text<{ active?: boolean }>`
  color: ${({ active }) => (active ? theme.colors.primary : theme.colors.textMuted)};
  font-size: 10px;
  font-weight: 700;
`;

const navItems: Array<{ icon: AppIconName; label: string; route: AppRoute }> = [
  { icon: 'home', label: '홈', route: 'home' },
  { icon: 'sparkles', label: '곡 추천', route: 'recommendations' },
  { icon: 'songs', label: '채택곡', route: 'songs' },
  { icon: 'rehearsal', label: '합주', route: 'rehearsals' },
  { icon: 'users', label: '멤버', route: 'members' },
];

const personalItems: Array<{ icon: AppIconName; label: string; route: AppRoute }> = [
  { icon: 'sparkles', label: '내 악기 추출', route: 'instrument' },
  { icon: 'songs', label: '악보 편집', route: 'score-editor' },
];

const activeGroup = (current: AppRoute, target: AppRoute) => {
  if (target === 'recommendations')
    return current === 'recommendations' || current === 'recommendation';
  if (target === 'songs')
    return current === 'songs' || current === 'song' || current === 'practice';
  return current === target;
};

interface AppShellProps {
  activeRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  comingSoon?: string;
  onComingSoonBack?: () => void;
}

export function AppShell({
  children,
  activeRoute,
  onNavigate,
  comingSoon,
  onComingSoonBack,
}: PropsWithChildren<AppShellProps>) {
  const { width } = useWindowDimensions();
  const desktop = width >= 900;
  const compact = width < 620;

  return (
    <Shell>
      {desktop && (
        <Sidebar>
          <View>
            <BrandButton
              accessibilityRole="button"
              accessibilityLabel="Moajam 홈으로 이동"
              onPress={() => onNavigate('home')}
              style={{ gap: 14 }}
            >
              <BrandMark source={brandLogoSource} resizeMode="contain" />
              <BrandName>Moajam</BrandName>
            </BrandButton>
            <WorkspaceSwitcher style={{ gap: 10 }}>
              <WorkspaceThumb>
                <AppIcon name="guitar" color="#713411" size={20} strokeWidth={2} />
              </WorkspaceThumb>
              <View style={{ flex: 1 }}>
                <WhiteText>주말 합주단</WhiteText>
                <WhiteText small style={{ fontSize: 11, fontWeight: '500' }}>
                  5명의 멤버
                </WhiteText>
              </View>
              <AppIcon name="chevron-down" color="#aab6ca" size={16} />
            </WorkspaceSwitcher>
            <Stack gap={4}>
              {navItems.map((item) => {
                const active = activeGroup(activeRoute, item.route);
                return (
                  <NavItem
                    key={item.route}
                    active={active}
                    onPress={() => onNavigate(item.route)}
                    style={{ gap: 12 }}
                  >
                    <NavIcon>
                      <AppIcon name={item.icon} color={active ? 'white' : '#aab6ca'} size={18} />
                    </NavIcon>
                    <NavLabel active={active}>{item.label}</NavLabel>
                  </NavItem>
                );
              })}
            </Stack>
            <NavGroupLabel>내 작업실</NavGroupLabel>
            <Stack gap={4}>
              {personalItems.map((item) => {
                const active = activeGroup(activeRoute, item.route);
                return (
                  <NavItem
                    key={item.route}
                    active={active}
                    onPress={() => onNavigate(item.route)}
                    style={{ gap: 12 }}
                  >
                    <NavIcon>
                      <AppIcon name={item.icon} color={active ? 'white' : '#aab6ca'} size={18} />
                    </NavIcon>
                    <NavLabel active={active}>{item.label}</NavLabel>
                  </NavItem>
                );
              })}
            </Stack>
          </View>
          <View>
            <Stack gap={4} style={{ marginBottom: 18 }}>
              <NavItem
                active={activeRoute === 'settings'}
                onPress={() => onNavigate('settings')}
                style={{ gap: 12 }}
              >
                <NavIcon>
                  <AppIcon
                    name="settings"
                    color={activeRoute === 'settings' ? 'white' : '#aab6ca'}
                    size={18}
                  />
                </NavIcon>
                <NavLabel active={activeRoute === 'settings'}>설정</NavLabel>
              </NavItem>
              <NavItem
                active={activeRoute === 'help'}
                onPress={() => onNavigate('help')}
                style={{ gap: 12 }}
              >
                <NavIcon>
                  <AppIcon
                    name="help"
                    color={activeRoute === 'help' ? 'white' : '#aab6ca'}
                    size={18}
                  />
                </NavIcon>
                <NavLabel active={activeRoute === 'help'}>도움말</NavLabel>
              </NavItem>
            </Stack>
            <Profile style={{ gap: 10 }}>
              <Avatar color="#ffd8c8">
                <AvatarText>민수</AvatarText>
              </Avatar>
              <View>
                <WhiteText>김민수</WhiteText>
                <WhiteText small style={{ fontSize: 11, fontWeight: '500' }}>
                  Guitar · Owner
                </WhiteText>
              </View>
            </Profile>
          </View>
        </Sidebar>
      )}
      <Main>
        {!desktop && (
          <MobileHeader>
            <BrandButton
              accessibilityRole="button"
              accessibilityLabel="Moajam 홈으로 이동"
              onPress={() => onNavigate('home')}
              style={{ gap: 14 }}
            >
              <BrandMark source={brandLogoSource} resizeMode="contain" />
              <BrandName dark>Moajam</BrandName>
            </BrandButton>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="설정 열기"
              onPress={() => onNavigate('settings')}
            >
              <Avatar color="#ffd8c8">
                <AvatarText>민수</AvatarText>
              </Avatar>
            </Pressable>
          </MobileHeader>
        )}
        <PageScroll
          contentContainerStyle={{
            padding: compact ? 16 : 28,
            gap: 20,
            width: '100%',
            maxWidth: 1260,
            alignSelf: 'center',
          }}
        >
          {children}
        </PageScroll>
        {comingSoon ? (
          <ComingSoonOverlay
            label={comingSoon}
            onBack={onComingSoonBack}
            style={{ top: desktop ? 0 : 73, bottom: desktop ? 0 : 67 }}
          />
        ) : null}
        {!desktop && (
          <BottomNav>
            {navItems.map((item) => {
              const active = activeGroup(activeRoute, item.route);
              return (
                <BottomItem
                  key={item.route}
                  onPress={() => onNavigate(item.route)}
                  style={{ gap: 3 }}
                >
                  <AppIcon
                    name={item.icon}
                    color={active ? theme.colors.primary : theme.colors.textMuted}
                    size={19}
                  />
                  <BottomLabel active={active}>{item.label}</BottomLabel>
                </BottomItem>
              );
            })}
          </BottomNav>
        )}
      </Main>
    </Shell>
  );
}
