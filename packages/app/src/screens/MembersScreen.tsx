import { Badge, Body, Button, Card, Muted } from '@moajam/ui';
import { useState } from 'react';
import { View } from 'react-native';
import { AppShell } from '../components/AppShell';
import { members } from '../mocks/data';
import type { ScreenProps } from '../navigation';
import {
  Avatar,
  AvatarText,
  Between,
  Input,
  Label,
  PageHeader,
  PageTitle,
  PressableRow,
  SectionTitle,
} from '../styles/layout';

export function MembersScreen({ navigate }: ScreenProps) {
  const [inviteVisible, setInviteVisible] = useState(false);
  return (
    <AppShell activeRoute="members" onNavigate={navigate}>
      <PageHeader>
        <Between>
          <View>
            <PageTitle>멤버 관리</PageTitle>
            <Muted>파트와 Workspace 권한을 관리하세요.</Muted>
          </View>
          <Button onPress={() => setInviteVisible((value) => !value)}>+ 멤버 초대</Button>
        </Between>
      </PageHeader>
      {inviteVisible && (
        <Card>
          <SectionTitle>초대 링크</SectionTitle>
          <Input editable={false} value="https://moajam.app/invite/ kalah-2026" />
          <Muted>링크를 가진 사람은 Member로 참여할 수 있습니다.</Muted>
        </Card>
      )}
      <Card>
        <Between>
          <SectionTitle>멤버 {members.length}</SectionTitle>
          <Muted>파트 설정</Muted>
        </Between>
        {members.map((member) => (
          <PressableRow key={member.id}>
            <Avatar color={member.color}>
              <AvatarText>{member.initials}</AvatarText>
            </Avatar>
            <View style={{ flex: 1 }}>
              <Label>
                {member.name}
                {member.id === 'm1' ? ' (나)' : ''}
              </Label>
              <Muted>{member.part}</Muted>
            </View>
            <Badge>{member.part}</Badge>
            {member.role === 'OWNER' && <Badge tone="warning">Owner</Badge>}
            <Body>⋮</Body>
          </PressableRow>
        ))}
      </Card>
    </AppShell>
  );
}
