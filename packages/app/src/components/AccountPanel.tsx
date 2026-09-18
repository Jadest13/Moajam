import { useState } from 'react';
import { ActionButton, Heading, Meta, Surface } from './ProductUI';
import { Input } from '../styles/layout';
import { api, serverConfigured, signOut } from '../lib/remote';
import { useMockAppState } from '../state/MockAppState';
export function AccountPanel() {
  const { reloadRemote, workspaceId, canManage, members, currentUserId } = useMockAppState();
  const [token, setToken] = useState(
    typeof location === 'undefined'
      ? ''
      : (new URLSearchParams(location.search).get('invite') ?? ''),
  );
  const [message, setMessage] = useState('');
  const [confirmLeave, setConfirmLeave] = useState(false);
  if (!serverConfigured) return null;
  return (
    <Surface>
      <Heading>계정과 밴드 가입</Heading>
      <Input value={token} onChangeText={setToken} placeholder="초대 코드" />
      <ActionButton
        disabled={!token.trim()}
        onPress={() =>
          void api<{ workspaceId: string }>('/invitations/accept', 'POST', { token: token.trim() })
            .then(() => reloadRemote())
            .then(() => {
              setToken('');
              setMessage('밴드에 가입했습니다. 사이드바에서 선택해주세요.');
            })
            .catch((error: Error) => setMessage(error.message))
        }
      >
        초대 수락
      </ActionButton>
      <ActionButton
        secondary
        onPress={() =>
          void signOut().catch(() => setMessage('로그아웃하지 못했어요. 다시 시도해주세요.'))
        }
      >
        로그아웃
      </ActionButton>
      <ActionButton
        secondary
        danger
        disabled={
          !workspaceId ||
          (canManage && members.filter((member) => member.role === 'OWNER').length <= 1)
        }
        onPress={() => setConfirmLeave(true)}
      >
        현재 밴드 탈퇴
      </ActionButton>
      {canManage && members.filter((member) => member.role === 'OWNER').length <= 1 ? (
        <Meta>탈퇴하려면 다른 멤버를 먼저 Owner로 지정해주세요.</Meta>
      ) : null}
      {confirmLeave ? (
        <>
          <Meta>이 밴드의 공유 자료 접근 권한을 잃게 됩니다. 탈퇴할까요?</Meta>
          <ActionButton
            danger
            onPress={() =>
              void api(`/workspaces/${workspaceId}/members/${currentUserId}`, 'DELETE')
                .then(() => reloadRemote())
                .then(() => {
                  setConfirmLeave(false);
                  setMessage('밴드에서 탈퇴했습니다.');
                })
                .catch((error: Error) => setMessage(error.message))
            }
          >
            탈퇴 확인
          </ActionButton>
          <ActionButton secondary onPress={() => setConfirmLeave(false)}>
            취소
          </ActionButton>
        </>
      ) : null}
      {message ? <Meta>{message}</Meta> : null}
    </Surface>
  );
}
