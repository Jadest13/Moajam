export type WorkspaceRole = 'OWNER' | 'MEMBER';
export type MemberPart = 'VOCAL' | 'GUITAR' | 'BASS' | 'DRUMS' | 'KEYBOARD' | 'OTHER';
export type PreparationStatus = 'NOT_READY' | 'PRACTICING' | 'READY';
export type RecommendationStatus = 'RECOMMENDED' | 'CANDIDATE' | 'ADOPTED' | 'HOLD';
export type OpinionType = 'IDEA' | 'FIX' | 'DISCUSSION' | 'DECISION_CANDIDATE';
export type AudioProcessingStatus =
  'UPLOADING' | 'UPLOADED' | 'QUEUED' | 'PROCESSING' | 'PREPARING_AUDIO' | 'COMPLETED' | 'FAILED';

export interface WorkspaceSummary {
  id: string;
  name: string;
  memberCount: number;
  role: WorkspaceRole;
}

export interface PartPreparation {
  id: string;
  part: MemberPart;
  displayName: string;
  memberName: string;
  status: PreparationStatus;
}

export interface SongSummary {
  id: string;
  title: string;
  artist: string;
  key: string;
  bpm: number;
  preparations: PartPreparation[];
}

export interface WorkspaceOverview {
  workspace: WorkspaceSummary;
  activeSong: SongSummary;
  decisions: Array<{ id: string; content: string }>;
  checklist: Array<{ id: string; content: string; completed: boolean }>;
}

export const getReadyCount = (preparations: PartPreparation[]) =>
  preparations.filter(({ status }) => status === 'READY').length;
