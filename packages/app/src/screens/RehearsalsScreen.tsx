import { Body, Button, Card, Muted } from '@moajam/ui';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { AppShell } from '../components/AppShell';
import { initialChecklist, members } from '../mocks/data';
import type { ScreenProps } from '../navigation';
import {
  Avatar,
  AvatarText,
  Between,
  Inline,
  PageHeader,
  PageTitle,
  SectionTitle,
} from '../styles/layout';

export function RehearsalsScreen({ navigate }: ScreenProps) {
  const [checklist, setChecklist] = useState(initialChecklist);
  const completed = checklist.filter((item) => item.done).length;
  return (
    <AppShell activeRoute="rehearsals" onNavigate={navigate}>
      <PageHeader>
        <Between>
          <View>
            <PageTitle>합주 기록</PageTitle>
            <Muted>합주에서 나온 결정과 다음 할 일을 남겨요.</Muted>
          </View>
          <Button>+ 합주 기록</Button>
        </Between>
      </PageHeader>
      <Card>
        <SectionTitle>2026년 9월 12일 (토)</SectionTitle>
        <Body>18:00–21:00 · 홍대 합주실 A룸</Body>
        <Inline>
          {members.slice(0, 4).map((member) => (
            <Avatar key={member.id} color={member.color}>
              <AvatarText>{member.initials}</AvatarText>
            </Avatar>
          ))}
          <Muted>+1 참석</Muted>
        </Inline>
      </Card>
      <Card>
        <Under>
          <SectionTitle>오늘 확인할 내용</SectionTitle>
          <Muted>
            {completed} / {checklist.length} 완료
          </Muted>
        </Under>
        {checklist.map((item) => (
          <Text
            key={item.id}
            onPress={() =>
              setChecklist((items) =>
                items.map((value) =>
                  value.id === item.id ? { ...value, done: !value.done } : value,
                ),
              )
            }
            style={{ fontSize: 15, paddingVertical: 8 }}
          >
            {item.done ? '☑' : '☐'} {item.label}
          </Text>
        ))}
      </Card>
      <Card>
        <SectionTitle>주요 메모</SectionTitle>
        <Body>• 2절 기타 레이어가 조금 큼</Body>
        <Body>• 마지막 Chorus 2회 반복</Body>
        <Body>• 드럼 필인 아이디어 좋음</Body>
      </Card>
      <Card>
        <SectionTitle>다음 합주까지</SectionTitle>
        <Body>✓ Guitar Solo 수정</Body>
        <Body>✓ Vocal 1키 연습</Body>
        <Body>✓ 전체 다이내믹 맞춰보기</Body>
      </Card>
    </AppShell>
  );
}

const Under = Between;
