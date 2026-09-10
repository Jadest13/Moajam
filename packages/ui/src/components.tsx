import styled from '@emotion/native';
import type { PropsWithChildren, ReactNode } from 'react';
import { Pressable, type PressableProps } from 'react-native';
import { theme } from './theme';

export const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${theme.colors.background};
`;

export const ScrollContent = styled.ScrollView`
  flex: 1;
`;

export const Row = styled.View<{ gap?: number; wrap?: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ gap = 8 }) => gap}px;
  flex-wrap: ${({ wrap }) => (wrap ? 'wrap' : 'nowrap')};
`;

export const Stack = styled.View<{ gap?: number }>`
  gap: ${({ gap = 8 }) => gap}px;
`;

export const Card = styled.View`
  padding: 18px;
  gap: 14px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md}px;
  background-color: ${theme.colors.surface};
`;

export const Title = styled.Text`
  color: ${theme.colors.text};
  font-size: 28px;
  font-weight: 800;
`;

export const Heading = styled.Text`
  color: ${theme.colors.text};
  font-size: 18px;
  font-weight: 700;
`;

export const Body = styled.Text`
  color: ${theme.colors.text};
  font-size: 15px;
  line-height: 22px;
`;

export const Muted = styled.Text`
  color: ${theme.colors.textMuted};
  font-size: 14px;
`;

const ButtonSurface = styled(Pressable)<{ secondary?: boolean }>`
  align-items: center;
  justify-content: center;
  padding: 11px 16px;
  border-radius: ${theme.radius.pill}px;
  background-color: ${({ secondary }) =>
    secondary ? theme.colors.surfaceRaised : theme.colors.primary};
`;

const ButtonLabel = styled.Text<{ secondary?: boolean }>`
  color: ${({ secondary }) => (secondary ? theme.colors.text : theme.colors.primaryInk)};
  font-size: 14px;
  font-weight: 700;
`;

export function Button({
  children,
  secondary,
  ...props
}: PropsWithChildren<PressableProps & { secondary?: boolean }>) {
  return (
    <ButtonSurface secondary={secondary} {...props}>
      <ButtonLabel secondary={secondary}>{children}</ButtonLabel>
    </ButtonSurface>
  );
}

const BadgeSurface = styled.View<{ tone: 'success' | 'warning' | 'danger' | 'neutral' }>`
  align-self: flex-start;
  padding: 5px 9px;
  border-radius: ${theme.radius.pill}px;
  background-color: ${({ tone }) =>
    tone === 'success'
      ? '#dcf8e9'
      : tone === 'warning'
        ? '#fff3d6'
        : tone === 'danger'
          ? '#fee7e7'
          : theme.colors.surfaceRaised};
`;

const BadgeLabel = styled.Text`
  color: ${theme.colors.text};
  font-size: 12px;
  font-weight: 700;
`;

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'success' | 'warning' | 'danger' | 'neutral';
}) {
  return (
    <BadgeSurface tone={tone}>
      <BadgeLabel>{children}</BadgeLabel>
    </BadgeSurface>
  );
}
