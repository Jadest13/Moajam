import { theme } from '@moajam/ui';
import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { AppShell } from '../components/AppShell';
import {
  ActionButton,
  Copy,
  FlexBetween,
  FlexRow,
  Heading,
  Meta,
  PageDescription,
  PageHeading,
  PageTop,
  ResponsiveGrid,
  Stack,
  Surface,
  Toggle,
} from '../components/ProductUI';
import type { ScreenProps } from '../navigation';
import { Avatar, AvatarText, Input } from '../styles/layout';

export function SettingsScreen({ navigate }: ScreenProps) {
  const { width } = useWindowDimensions();
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(false);
  const [reminder, setReminder] = useState(true);
  const [saved, setSaved] = useState(false);

  return (
    <AppShell activeRoute="settings" onNavigate={navigate}>
      <PageTop>
        <PageHeading>설정</PageHeading>
        <PageDescription>프로필, 알림, 오디오와 워크스페이스 환경을 관리합니다.</PageDescription>
      </PageTop>
      <ResponsiveGrid stacked={width < 900}>
        <Stack gap={16} style={width < 900 ? undefined : { flex: 1.2 }}>
          <Surface>
            <Heading>내 프로필</Heading>
            <FlexRow>
              <Avatar color="#ffd8c8" size={64}>
                <AvatarText>민수</AvatarText>
              </Avatar>
              <View style={{ flex: 1, gap: 4 }}>
                <Copy style={{ fontWeight: '900' }}>김민수</Copy>
                <Meta>Sunset Riders · Guitar</Meta>
              </View>
              <ActionButton secondary>사진 변경</ActionButton>
            </FlexRow>
            <Meta>이름</Meta>
            <Input defaultValue="김민수" />
            <Meta>소개</Meta>
            <Input defaultValue="기타와 좋은 합주를 좋아합니다." />
            <View style={{ alignSelf: 'flex-start' }}>
              <ActionButton onPress={() => setSaved(true)}>
                {saved ? '저장됨 ✓' : '변경사항 저장'}
              </ActionButton>
            </View>
          </Surface>
          <Surface>
            <Heading>오디오 기본 설정</Heading>
            <FlexBetween>
              <View>
                <Copy style={{ fontWeight: '800' }}>재생 음질</Copy>
                <Meta>Wi-Fi에서는 고음질로 재생합니다.</Meta>
              </View>
              <Copy>고음질 ▾</Copy>
            </FlexBetween>
            <FlexBetween>
              <View>
                <Copy style={{ fontWeight: '800' }}>녹음 카운트인</Copy>
                <Meta>녹음 시작 전 2마디를 들려줍니다.</Meta>
              </View>
              <Copy>2마디 ▾</Copy>
            </FlexBetween>
            <FlexBetween>
              <View>
                <Copy style={{ fontWeight: '800' }}>기본 내보내기</Copy>
                <Meta>스템과 내 녹음에 사용할 형식입니다.</Meta>
              </View>
              <Copy>WAV · 48kHz ▾</Copy>
            </FlexBetween>
          </Surface>
        </Stack>
        <Stack gap={16} style={width < 900 ? undefined : { flex: 1 }}>
          <Surface>
            <Heading>알림</Heading>
            <SettingToggle
              label="푸시 알림"
              detail="댓글, 합주 변경, 멤버 초대를 알려드려요."
              value={push}
              onPress={() => setPush(!push)}
            />
            <SettingToggle
              label="이메일 요약"
              detail="매주 월요일에 활동을 요약해요."
              value={email}
              onPress={() => setEmail(!email)}
            />
            <SettingToggle
              label="합주 1일 전 알림"
              detail="준비 상태와 체크리스트를 함께 알려드려요."
              value={reminder}
              onPress={() => setReminder(!reminder)}
            />
          </Surface>
          <Surface>
            <Heading>워크스페이스</Heading>
            <FlexBetween>
              <View>
                <Copy style={{ fontWeight: '800' }}>Sunset Riders</Copy>
                <Meta>Owner · 멤버 5명</Meta>
              </View>
              <ActionButton secondary onPress={() => navigate('members')}>
                관리
              </ActionButton>
            </FlexBetween>
            <FlexBetween>
              <Meta>초대 링크</Meta>
              <Copy style={{ color: theme.colors.primary }}>moajam.app/join/abc123</Copy>
            </FlexBetween>
          </Surface>
          <Surface danger>
            <Heading>계정</Heading>
            <Meta>로그아웃하거나 계정과 개인 데이터를 삭제할 수 있습니다.</Meta>
            <FlexRow wrap>
              <ActionButton secondary>로그아웃</ActionButton>
              <ActionButton secondary danger>
                계정 삭제
              </ActionButton>
            </FlexRow>
          </Surface>
          <ActionButton secondary onPress={() => navigate('help')}>
            도움말 센터 열기
          </ActionButton>
        </Stack>
      </ResponsiveGrid>
    </AppShell>
  );
}

function SettingToggle({
  label,
  detail,
  value,
  onPress,
}: {
  label: string;
  detail: string;
  value: boolean;
  onPress: () => void;
}) {
  return (
    <FlexBetween>
      <View style={{ flex: 1 }}>
        <Copy style={{ fontWeight: '800' }}>{label}</Copy>
        <Meta>{detail}</Meta>
      </View>
      <Toggle on={value} onPress={onPress} />
    </FlexBetween>
  );
}
