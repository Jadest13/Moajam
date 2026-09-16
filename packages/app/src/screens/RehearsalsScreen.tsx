import { theme } from '@moajam/ui';
import { useState, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import { AppShell } from '../components/AppShell';
import {
  ActionButton,
  CheckItem,
  ComingSoonOverlay,
  Copy,
  Divider,
  FlexBetween,
  FlexRow,
  Heading,
  Meta,
  PageDescription,
  PageHeading,
  PageTop,
  Pill,
  PillText,
  Progress,
  ProgressValue,
  ResponsiveGrid,
  Stack,
  Surface,
  Waveform,
} from '../components/ProductUI';
import { AppIcon } from '../components/icons';
import { initialChecklist } from '../mocks/data';
import type { ScreenProps } from '../navigation';
import { useMockAppState } from '../state/MockAppState';
import { Avatar, AvatarText, Input, Label } from '../styles/layout';

type SessionDraft = {
  title: string;
  date: string;
  start: string;
  end: string;
  place: string;
  goal: string;
};
type HistorySession = {
  date: string;
  fullDate: string;
  place: string;
  info: string;
  memo: string;
  decisions: string[];
};

const initialSchedule: SessionDraft = {
  title: '정기 합주',
  date: '2024년 9월 12일 (토)',
  start: '18:00',
  end: '21:00',
  place: '홍대 합주실 A룸',
  goal: 'Creep 전체 합주와 엔딩 구간 맞추기',
};
const pastSessions: HistorySession[] = [
  {
    date: '9월 5일',
    fullDate: '2024년 9월 5일 (목)',
    place: '합정 합주실 B룸',
    info: '3곡 · 녹음 52:10',
    memo: 'Creep 템포를 낮춰 전체 구성을 맞췄어요. 2절 기타 진입을 다음 합주에서 다시 확인합니다.',
    decisions: ['Key D 유지', 'Ending 2회 반복', '기타 솔로 톤 수정'],
  },
  {
    date: '8월 29일',
    fullDate: '2024년 8월 29일 (목)',
    place: '홍대 합주실 A룸',
    info: '4곡 · 녹음 01:08:24',
    memo: '셋리스트 순서와 곡 사이 전환 시간을 점검했어요.',
    decisions: ['Creep 오프닝 확정', '보컬 코러스 파트 추가', '다음 합주 18시 시작'],
  },
];

function ModalFrame({
  visible,
  title,
  description,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const { width } = useWindowDimensions();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, justifyContent: 'center', padding: width < 620 ? 14 : 28 }}
      >
        <Pressable
          accessibilityLabel="모달 닫기"
          onPress={onClose}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
          }}
        />
        <View
          style={{
            width: '100%',
            maxWidth: 620,
            maxHeight: '90%',
            alignSelf: 'center',
            overflow: 'hidden',
            borderRadius: 22,
            borderWidth: 1,
            borderColor: '#dce4f0',
            backgroundColor: 'white',
            shadowColor: '#0f172a',
            shadowOpacity: 0.2,
            shadowRadius: 28,
            shadowOffset: { width: 0, height: 14 },
            elevation: 12,
          }}
        >
          <FlexBetween style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#e8edf5' }}>
            <View style={{ flex: 1, gap: 3 }}>
              <Heading>{title}</Heading>
              <Meta>{description}</Meta>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="닫기"
              onPress={onClose}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f1f5f9',
              }}
            >
              <Copy style={{ fontSize: 20, lineHeight: 22 }}>×</Copy>
            </Pressable>
          </FlexBetween>
          <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>{children}</ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <View style={{ gap: 7, flex: 1 }}>
      <Label>{label}</Label>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        style={multiline ? { minHeight: 82, textAlignVertical: 'top' } : undefined}
      />
    </View>
  );
}

export function RehearsalsScreen({ navigate }: ScreenProps) {
  const { width } = useWindowDimensions();
  const { members } = useMockAppState();
  const [checks, setChecks] = useState(initialChecklist);
  const [checkDraft, setCheckDraft] = useState('');
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
  const [memo, setMemo] = useState(
    '전체적으로 느린 템포로 시작.\n- Key D로 변경\n- Ending은 다 같이 맞춰보기',
  );
  const [saved, setSaved] = useState(false);
  const [schedule, setSchedule] = useState(initialSchedule);
  const [draft, setDraft] = useState(initialSchedule);
  const [modalMode, setModalMode] = useState<'new' | 'edit' | null>(null);
  const [selectedMembers, setSelectedMembers] = useState(members.map((member) => member.id));
  const [draftMembers, setDraftMembers] = useState(members.map((member) => member.id));
  const [selectedHistory, setSelectedHistory] = useState<HistorySession | null>(null);
  const [isAssignmentOpen, setIsAssignmentOpen] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 'task-1', label: 'Guitar Solo 수정', done: true, assigneeId: 'm1' },
    { id: 'task-2', label: 'Vocal −1키 연습', done: false, assigneeId: 'm2' },
    { id: 'task-3', label: '코러스 하모니 연습', done: false, assigneeId: '' },
  ]);
  const completed = checks.filter((item) => item.done).length;

  const openNewSession = () => {
    setDraft({
      title: '정기 합주',
      date: '2024년 9월 19일 (목)',
      start: '19:00',
      end: '22:00',
      place: '',
      goal: '',
    });
    setDraftMembers(members.map((member) => member.id));
    setModalMode('new');
  };
  const openEditSchedule = () => {
    setDraft(schedule);
    setDraftMembers(selectedMembers);
    setModalMode('edit');
  };
  const updateDraft = (key: keyof SessionDraft, value: string) =>
    setDraft((current) => ({ ...current, [key]: value }));
  const saveSchedule = () => {
    if (!draft.date.trim() || !draft.place.trim()) return;
    setSchedule(draft);
    setSelectedMembers(draftMembers);
    setModalMode(null);
  };
  const addChecklistItem = () => {
    if (!checkDraft.trim()) return;
    setChecks((current) => [
      ...current,
      { id: `check-${Date.now()}`, label: checkDraft.trim(), done: false },
    ]);
    setCheckDraft('');
    setIsCheckModalOpen(false);
  };

  return (
    <AppShell activeRoute="rehearsals" onNavigate={navigate}>
      <FlexBetween
        style={width < 650 ? { flexDirection: 'column', alignItems: 'stretch' } : undefined}
      >
        <PageTop>
          <PageHeading>합주 세션</PageHeading>
          <PageDescription>
            일정, 현장 체크리스트, 녹음과 다음 액션을 하나의 기록으로 남겨요.
          </PageDescription>
        </PageTop>
        <ActionButton onPress={openNewSession}>+ 새 합주 세션</ActionButton>
      </FlexBetween>

      <Surface>
        <FlexBetween style={width < 620 ? { alignItems: 'flex-start' } : undefined}>
          <FlexRow style={{ flex: 1, alignItems: 'flex-start' }}>
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                backgroundColor: '#edf3ff',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AppIcon name="calendar" color={theme.colors.primary} size={25} />
            </View>
            <View style={{ flex: 1 }}>
              <Heading>{schedule.date}</Heading>
              <Copy>
                {schedule.start}–{schedule.end} · {schedule.place}
              </Copy>
              <Meta>
                {schedule.title} · {schedule.goal || '합주 목표를 정해보세요'}
              </Meta>
            </View>
          </FlexRow>
          <ActionButton secondary compact={width < 620} onPress={openEditSchedule}>
            일정 편집
          </ActionButton>
        </FlexBetween>
        <Divider />
        <FlexBetween>
          <FlexRow>
            {members
              .filter((member) => selectedMembers.includes(member.id))
              .map((member) => (
                <Avatar key={member.id} color={member.color}>
                  <AvatarText>{member.initials}</AvatarText>
                </Avatar>
              ))}
          </FlexRow>
          <Pill tone="green">
            <PillText tone="green">{selectedMembers.length}명 참석</PillText>
          </Pill>
        </FlexBetween>
      </Surface>

      <ResponsiveGrid stacked={width < 940}>
        <Stack gap={16} style={width < 940 ? undefined : { flex: 1 }}>
          <Surface>
            <FlexBetween>
              <Heading>오늘 확인할 것</Heading>
              <Meta>
                {completed} / {checks.length} 완료
              </Meta>
            </FlexBetween>
            <Progress>
              <ProgressValue value={(completed / checks.length) * 100} />
            </Progress>
            {checks.map((item) => (
              <CheckItem
                key={item.id}
                checked={item.done}
                label={item.label}
                onPress={() =>
                  setChecks((all) =>
                    all.map((value) =>
                      value.id === item.id ? { ...value, done: !value.done } : value,
                    ),
                  )
                }
              />
            ))}
            <ActionButton secondary onPress={() => setIsCheckModalOpen(true)}>
              + 항목 추가
            </ActionButton>
          </Surface>
          <View style={{ position: 'relative' }}>
            <Surface>
              <FlexBetween>
                <Heading>합주 녹음</Heading>
                <ActionButton compact>● 녹음 시작</ActionButton>
              </FlexBetween>
              <FlexRow>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: '#eef3ff',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Copy>▶</Copy>
                </View>
                <View>
                  <Copy style={{ fontWeight: '900' }}>rehearsal_20240912.wav</Copy>
                  <Meta>48:32 · 45MB</Meta>
                </View>
                <Waveform height={36} />
              </FlexRow>
            </Surface>
            <ComingSoonOverlay compact label="합주 녹음은 추후 개발됩니다" />
          </View>
        </Stack>
        <Stack gap={16} style={width < 940 ? undefined : { flex: 1 }}>
          <Surface>
            <FlexBetween>
              <Heading>합주 메모</Heading>
              <Meta>{saved ? '저장됨 ✓' : '자동 저장'}</Meta>
            </FlexBetween>
            <Input
              value={memo}
              onChangeText={(value) => {
                setMemo(value);
                setSaved(false);
              }}
              multiline
              style={{ minHeight: 160, textAlignVertical: 'top' }}
            />
            <ActionButton onPress={() => setSaved(true)}>메모 저장</ActionButton>
          </Surface>
          <Surface>
            <View style={{ gap: 3 }}>
              <Heading>다음 합주까지</Heading>
              <Meta>담당자는 각 할 일을 책임지고 준비하며, 변경 알림을 받는 멤버예요.</Meta>
            </View>
            {tasks.map((task) => {
              const assignee = members.find((member) => member.id === task.assigneeId);
              return (
                <CheckItem
                  key={task.id}
                  checked={task.done}
                  label={task.label}
                  onPress={() =>
                    setTasks((current) =>
                      current.map((item) =>
                        item.id === task.id ? { ...item, done: !item.done } : item,
                      ),
                    )
                  }
                  meta={
                    <Pill tone={assignee ? undefined : 'amber'}>
                      <PillText tone={assignee ? undefined : 'amber'}>
                        {assignee?.name ?? '미지정'}
                      </PillText>
                    </Pill>
                  }
                />
              );
            })}
            <ActionButton secondary onPress={() => setIsAssignmentOpen(true)}>
              할 일 담당자 지정
            </ActionButton>
          </Surface>
        </Stack>
      </ResponsiveGrid>

      <Heading>지난 합주</Heading>
      {pastSessions.map((session) => (
        <Surface key={session.fullDate}>
          <FlexBetween>
            <FlexRow>
              <Pill>
                <PillText>{session.date}</PillText>
              </Pill>
              <View>
                <Copy style={{ fontWeight: '900' }}>{session.place}</Copy>
                <Meta>{session.info}</Meta>
              </View>
            </FlexRow>
            <ActionButton secondary compact onPress={() => setSelectedHistory(session)}>
              기록 보기
            </ActionButton>
          </FlexBetween>
        </Surface>
      ))}

      <ModalFrame
        visible={modalMode !== null}
        title={modalMode === 'new' ? '새 합주 세션 추가' : '합주 일정 편집'}
        description={
          modalMode === 'new'
            ? '날짜와 장소, 참석 멤버를 정해 새 합주를 만들어요.'
            : '변경한 내용은 참석 멤버에게 공유됩니다.'
        }
        onClose={() => setModalMode(null)}
      >
        <FormField
          label="세션 이름"
          value={draft.title}
          onChangeText={(value) => updateDraft('title', value)}
          placeholder="예: 정기 합주"
        />
        <FormField
          label="날짜"
          value={draft.date}
          onChangeText={(value) => updateDraft('date', value)}
          placeholder="예: 2024년 9월 19일 (목)"
        />
        <FlexRow style={{ alignItems: 'stretch' }}>
          <FormField
            label="시작 시간"
            value={draft.start}
            onChangeText={(value) => updateDraft('start', value)}
            placeholder="19:00"
          />
          <FormField
            label="종료 시간"
            value={draft.end}
            onChangeText={(value) => updateDraft('end', value)}
            placeholder="22:00"
          />
        </FlexRow>
        <FormField
          label="장소"
          value={draft.place}
          onChangeText={(value) => updateDraft('place', value)}
          placeholder="합주실 이름 또는 주소"
        />
        <FormField
          label="이번 합주 목표"
          value={draft.goal}
          onChangeText={(value) => updateDraft('goal', value)}
          placeholder="이번 합주에서 꼭 맞춰볼 내용을 적어주세요."
          multiline
        />
        <View style={{ gap: 9 }}>
          <Label>참석 멤버</Label>
          <FlexRow wrap gap={8}>
            {members.map((member) => {
              const active = draftMembers.includes(member.id);
              return (
                <Pressable
                  key={member.id}
                  onPress={() =>
                    setDraftMembers((current) =>
                      active ? current.filter((id) => id !== member.id) : [...current, member.id],
                    )
                  }
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 7,
                    paddingVertical: 8,
                    paddingHorizontal: 10,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: active ? theme.colors.primary : '#dce4f0',
                    backgroundColor: active ? '#eef3ff' : 'white',
                  }}
                >
                  <Avatar color={member.color} style={{ width: 28, height: 28 }}>
                    <AvatarText>{member.initials}</AvatarText>
                  </Avatar>
                  <Copy style={{ fontWeight: '800' }}>{member.name}</Copy>
                </Pressable>
              );
            })}
          </FlexRow>
        </View>
        <Divider />
        <FlexBetween>
          <ActionButton secondary onPress={() => setModalMode(null)}>
            취소
          </ActionButton>
          <ActionButton disabled={!draft.date.trim() || !draft.place.trim()} onPress={saveSchedule}>
            {modalMode === 'new' ? '합주 세션 만들기' : '변경사항 저장'}
          </ActionButton>
        </FlexBetween>
      </ModalFrame>

      <ModalFrame
        visible={isCheckModalOpen}
        title="확인 항목 추가"
        description="이번 합주에서 꼭 확인할 내용을 추가해요."
        onClose={() => setIsCheckModalOpen(false)}
      >
        <FormField
          label="항목 내용"
          value={checkDraft}
          onChangeText={setCheckDraft}
          placeholder="예: 2절 기타 톤 다시 확인"
        />
        <FlexBetween>
          <ActionButton secondary onPress={() => setIsCheckModalOpen(false)}>
            취소
          </ActionButton>
          <ActionButton disabled={!checkDraft.trim()} onPress={addChecklistItem}>
            항목 추가
          </ActionButton>
        </FlexBetween>
      </ModalFrame>

      <ModalFrame
        visible={isAssignmentOpen}
        title="할 일 담당자 지정"
        description="각 할 일을 담당할 멤버를 선택해요."
        onClose={() => setIsAssignmentOpen(false)}
      >
        {tasks.map((task) => (
          <Surface key={task.id} tint="#f8faff">
            <Copy style={{ fontWeight: '900' }}>{task.label}</Copy>
            <FlexRow wrap>
              {members.map((member) => {
                const active = task.assigneeId === member.id;
                return (
                  <Pill
                    key={member.id}
                    active={active}
                    onPress={() =>
                      setTasks((current) =>
                        current.map((item) =>
                          item.id === task.id ? { ...item, assigneeId: member.id } : item,
                        ),
                      )
                    }
                  >
                    <PillText active={active}>{member.name}</PillText>
                  </Pill>
                );
              })}
              <Pill
                active={!task.assigneeId}
                onPress={() =>
                  setTasks((current) =>
                    current.map((item) =>
                      item.id === task.id ? { ...item, assigneeId: '' } : item,
                    ),
                  )
                }
              >
                <PillText active={!task.assigneeId}>미지정</PillText>
              </Pill>
            </FlexRow>
          </Surface>
        ))}
        <ActionButton onPress={() => setIsAssignmentOpen(false)}>지정 완료</ActionButton>
      </ModalFrame>

      <ModalFrame
        visible={selectedHistory !== null}
        title="지난 합주 기록"
        description="그날의 결정과 다음 액션을 다시 확인할 수 있어요."
        onClose={() => setSelectedHistory(null)}
      >
        {selectedHistory ? (
          <>
            <Surface tint="#f7f9ff">
              <FlexRow>
                <AppIcon name="calendar" color={theme.colors.primary} size={22} />
                <View>
                  <Heading>{selectedHistory.fullDate}</Heading>
                  <Meta>
                    {selectedHistory.place} · {selectedHistory.info}
                  </Meta>
                </View>
              </FlexRow>
            </Surface>
            <View style={{ gap: 7 }}>
              <Label>합주 요약</Label>
              <Copy>{selectedHistory.memo}</Copy>
            </View>
            <View style={{ gap: 7 }}>
              <Label>그날 정한 내용</Label>
              {selectedHistory.decisions.map((decision) => (
                <FlexRow key={decision}>
                  <Copy style={{ color: '#16a36a', fontWeight: '900' }}>✓</Copy>
                  <Copy>{decision}</Copy>
                </FlexRow>
              ))}
            </View>
            <Surface>
              <FlexBetween>
                <View>
                  <Copy style={{ fontWeight: '900' }}>합주 녹음</Copy>
                  <Meta>당일 전체 녹음</Meta>
                </View>
                <Pill>
                  <PillText>{selectedHistory.info.split('· ')[1]}</PillText>
                </Pill>
              </FlexBetween>
            </Surface>
            <ActionButton onPress={() => setSelectedHistory(null)}>확인</ActionButton>
          </>
        ) : null}
      </ModalFrame>
    </AppShell>
  );
}
