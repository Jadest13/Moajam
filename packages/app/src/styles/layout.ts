import styled from '@emotion/native';
import { theme } from '@moajam/ui';

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
  font-weight: 900;
`;

export const SectionTitle = styled.Text`
  color: ${theme.colors.text};
  font-size: 18px;
  font-weight: 800;
`;

export const Label = styled.Text`
  color: ${theme.colors.text};
  font-size: 14px;
  font-weight: 700;
`;

export const Caption = styled.Text`
  color: ${theme.colors.textMuted};
  font-size: 13px;
  line-height: 19px;
`;

export const Grid = styled.View<{ stacked?: boolean }>`
  gap: 20px;
  flex-direction: ${({ stacked }) => (stacked ? 'column' : 'row')};
  align-items: flex-start;
`;

export const Column = styled.View`
  width: 100%;
  gap: 20px;
`;

export const Between = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const Inline = styled.View<{ wrap?: boolean; gap?: number }>`
  flex-direction: row;
  align-items: center;
  flex-wrap: ${({ wrap }) => (wrap ? 'wrap' : 'nowrap')};
  gap: ${({ gap = 8 }) => gap}px;
`;

export const Divider = styled.View`
  height: 1px;
  background-color: ${theme.colors.border};
`;

export const Input = styled.TextInput`
  min-height: 44px;
  padding: 10px 13px;
  color: ${theme.colors.text};
  border: 1px solid ${theme.colors.border};
  border-radius: 10px;
  background-color: white;
`;

export const SearchInput = styled.TextInput`
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
  font-weight: 700;
`;

export const LinkText = styled.Text`
  color: ${theme.colors.primary};
  font-size: 13px;
  font-weight: 700;
`;

export const Artwork = styled.View<{ tint?: string; size?: number }>`
  width: ${({ size = 58 }) => size}px;
  height: ${({ size = 58 }) => size}px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: ${({ tint = '#e86545' }) => tint};
`;

export const ArtworkText = styled.Text`
  color: white;
  font-size: 25px;
  font-weight: 900;
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

export const Avatar = styled.View<{ color?: string; size?: number }>`
  width: ${({ size = 34 }) => size}px;
  height: ${({ size = 34 }) => size}px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background-color: ${({ color = '#d7e8ff' }) => color};
`;

export const AvatarText = styled.Text`
  color: #23324d;
  font-size: 11px;
  font-weight: 800;
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
