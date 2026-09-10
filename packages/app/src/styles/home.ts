import styled from '@emotion/native';
import { theme } from '@moajam/ui';

export const HomeTitle = styled.Text`
  color: ${theme.colors.text};
  font-size: 24px;
  font-weight: 900;
  letter-spacing: -0.5px;
`;

export const HeaderActions = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const IconButton = styled.Pressable`
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border: 1px solid ${theme.colors.border};
  border-radius: 999px;
  background-color: white;
`;

export const HomeCard = styled.View`
  padding: 18px;
  gap: 15px;
  border: 1px solid ${theme.colors.border};
  border-radius: 14px;
  background-color: white;
  elevation: 1;
`;

export const RehearsalSurface = styled.Pressable`
  padding: 2px 0 0;
  gap: 14px;
  flex-direction: row;
  align-items: center;
`;

export const CalendarTile = styled.View`
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background-color: #fff0ee;
`;

export const RehearsalImage = styled.Image`
  width: 232px;
  height: 112px;
  flex-shrink: 0;
  border-radius: 10px;
`;

export const SongRow = styled.Pressable`
  padding: 11px 0;
  gap: 12px;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

export const SongName = styled.Text`
  color: ${theme.colors.text};
  font-size: 14px;
  font-weight: 800;
`;

export const StatusDots = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export const StatusDot = styled.View<{ color: string; muted?: boolean }>`
  width: 8px;
  height: 8px;
  opacity: ${({ muted }) => (muted ? 0.35 : 1)};
  border-radius: 999px;
  background-color: ${({ color }) => color};
`;

export const PracticeButton = styled.Pressable`
  padding: 8px 13px;
  border-radius: 8px;
  background-color: ${theme.colors.primary};
`;

export const PracticeButtonText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: 800;
`;

export const BottomGrid = styled.View<{ stacked?: boolean }>`
  gap: 18px;
  flex-direction: ${({ stacked }) => (stacked ? 'column' : 'row')};
  align-items: stretch;
`;

export const ActivityRow = styled.View`
  padding: 8px 0;
  gap: 10px;
  flex-direction: row;
  align-items: center;
`;

export const CandidateSurface = styled.Pressable`
  gap: 14px;
  flex-direction: row;
  align-items: center;
`;

export const CountText = styled.Text`
  color: ${theme.colors.danger};
  font-size: 13px;
  font-weight: 700;
`;
