import styled from '@emotion/native';
import type { PropsWithChildren, ReactNode } from 'react';
import { Pressable, type PressableProps, View, type ViewProps } from 'react-native';
import { theme } from './theme';

export const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${theme.colors.background};
`;

export const ScrollContent = styled.ScrollView`
  flex: 1;
`;

export function Row({
  gap = 8,
  wrap,
  style,
  ...props
}: ViewProps & { gap?: number; wrap?: boolean }) {
  return (
    <View
      {...props}
      style={[
        { flexDirection: 'row', alignItems: 'center', gap, flexWrap: wrap ? 'wrap' : 'nowrap' },
        style,
      ]}
    />
  );
}

export function Stack({ gap = 8, style, ...props }: ViewProps & { gap?: number }) {
  return <View {...props} style={[{ gap }, style]} />;
}

const CardBase = styled.View`
  padding: 18px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md}px;
  background-color: ${theme.colors.surface};
`;

export function Card({ style, ...props }: ViewProps) {
  return <CardBase {...props} style={[{ gap: 14 }, style]} />;
}

export const Title = styled.Text`
  color: ${theme.colors.text};
  font-size: 28px;
  font-weight: 500;
`;

export const Heading = styled.Text`
  color: ${theme.colors.text};
  font-size: 18px;
  font-weight: 500;
`;

export const Body = styled.Text`
  font-weight: 400;
  color: ${theme.colors.text};
  font-size: 15px;
  line-height: 22px;
`;

export const Muted = styled.Text`
  font-weight: 400;
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
  opacity: ${({ disabled }) => (disabled ? 0.45 : 1)};
`;

const ButtonLabel = styled.Text<{ secondary?: boolean }>`
  color: ${({ secondary }) => (secondary ? theme.colors.text : theme.colors.primaryInk)};
  font-size: 14px;
  font-weight: 500;
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
  font-weight: 500;
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
