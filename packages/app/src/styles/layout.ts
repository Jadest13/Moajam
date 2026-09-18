import styled from '@emotion/native';
import { theme } from '@moajam/ui';
import { createElement } from 'react';
import { View, type ViewProps } from 'react-native';

export const Shell = styled.SafeAreaView`
  flex: 1;
  flex-direction: row;
  background-color: ${theme.colors.background};
`;

export const Main = styled.View`
  flex: 1;
`;

export const PageScroll = styled.ScrollView`
  flex: 1;
`;

export const PageHeader = styled.View`
  gap: 6px;
`;

export const PageTitle = styled.Text`
  color: ${theme.colors.text};
  font-size: 26px;
  font-weight: 600;
`;

export const SectionTitle = styled.Text`
  color: ${theme.colors.text};
  font-size: 18px;
  font-weight: 500;
`;

export const Label = styled.Text`
  color: ${theme.colors.text};
  font-size: 14px;
  font-weight: 500;
`;

export const Caption = styled.Text`
  font-weight: 400;
  color: ${theme.colors.textMuted};
  font-size: 13px;
  line-height: 19px;
`;

export function Grid({ stacked, style, ...props }: ViewProps & { stacked?: boolean }) {
  return createElement(View, {
    ...props,
    style: [
      { gap: 20, flexDirection: stacked ? 'column' : 'row', alignItems: 'flex-start' },
      style,
    ],
  });
}

export function Column({ style, ...props }: ViewProps) {
  return createElement(View, { ...props, style: [{ width: '100%', gap: 20 }, style] });
}

export function Between({ style, ...props }: ViewProps) {
  return createElement(View, {
    ...props,
    style: [
      {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      },
      style,
    ],
  });
}

export function Inline({
  wrap,
  gap = 8,
  style,
  ...props
}: ViewProps & { wrap?: boolean; gap?: number }) {
  return createElement(View, {
    ...props,
    style: [
      { flexDirection: 'row', alignItems: 'center', flexWrap: wrap ? 'wrap' : 'nowrap', gap },
      style,
    ],
  });
}

export const Divider = styled.View`
  height: 1px;
  background-color: ${theme.colors.border};
`;

export const Input = styled.TextInput`
  font-weight: 400;
  min-height: 44px;
  padding: 10px 13px;
  color: ${theme.colors.text};
  border: 1px solid ${theme.colors.border};
  border-radius: 10px;
  background-color: white;
`;

export const SearchInput = styled.TextInput`
  font-weight: 400;
  flex: 1;
  min-height: 42px;
  padding: 10px 14px;
  color: ${theme.colors.text};
  border: 1px solid ${theme.colors.border};
  border-radius: 999px;
  background-color: white;
`;

export const Chip = styled.Pressable<{ active?: boolean }>`
  padding: 7px 12px;
  border-radius: 999px;
  background-color: ${({ active }) => (active ? theme.colors.primary : '#eef3fb')};
`;

export const ChipText = styled.Text<{ active?: boolean }>`
  color: ${({ active }) => (active ? 'white' : theme.colors.textMuted)};
  font-size: 13px;
  font-weight: 500;
`;

export const LinkText = styled.Text`
  color: ${theme.colors.primary};
  font-size: 13px;
  font-weight: 500;
`;

const ArtworkBase = styled.View`
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
`;

export function Artwork({
  tint = '#e86545',
  size = 58,
  style,
  ...props
}: ViewProps & { tint?: string; size?: number }) {
  return createElement(ArtworkBase, {
    ...props,
    style: [{ width: size, height: size, backgroundColor: tint }, style],
  });
}

export const ArtworkText = styled.Text`
  color: white;
  font-size: 25px;
  font-weight: 600;
`;

export const ArtworkImage = styled.Image`
  width: 58px;
  height: 58px;
  flex-shrink: 0;
  border-radius: 10px;
`;

export const ProgressTrack = styled.View`
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background-color: #edf1f6;
`;

export const ProgressFill = styled.View<{ value: number }>`
  width: ${({ value }) => Math.max(0, Math.min(100, value))}%;
  height: 100%;
  border-radius: 999px;
  background-color: ${theme.colors.primary};
`;

const AvatarBase = styled.View`
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
`;

export function Avatar({
  color = '#d7e8ff',
  size = 34,
  style,
  ...props
}: ViewProps & { color?: string; size?: number }) {
  return createElement(AvatarBase, {
    ...props,
    style: [{ width: size, height: size, backgroundColor: color }, style],
  });
}

export const AvatarText = styled.Text`
  color: #23324d;
  font-size: 11px;
  font-weight: 500;
`;

export const EmptyState = styled.View`
  padding: 42px 20px;
  gap: 8px;
  align-items: center;
  border: 1px dashed #cad4e3;
  border-radius: 14px;
  background-color: #f8faff;
`;

export const PressableRow = styled.Pressable`
  padding: 13px 0;
  gap: 12px;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;
