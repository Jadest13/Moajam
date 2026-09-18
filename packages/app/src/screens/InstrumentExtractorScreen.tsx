import { AppShell } from '../components/AppShell';
import { ActionButton, Heading, Meta, Surface } from '../components/ProductUI';
import { PracticeStudio } from '../components/PracticeStudio';
import type { ScreenProps } from '../navigation';
export function InstrumentExtractorScreen({ navigate }: ScreenProps) {
  return (
    <AppShell activeRoute="instrument" onNavigate={navigate}>
      <Heading>내 악기 추출</Heading>
      <Surface>
        <Meta>
          현재 모바일 앱은 기기 내 녹음과 파일 보관을 지원합니다. 서버 음원 분리 요청과 결과 비교는
          웹의 내 악기 추출 화면에서 이용해주세요.
        </Meta>
        <ActionButton secondary onPress={() => navigate('personal-practice')}>
          개인 연습실로 이동
        </ActionButton>
      </Surface>
      <PracticeStudio scopeKey="extraction-source" />
    </AppShell>
  );
}
