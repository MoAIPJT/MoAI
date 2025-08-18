export interface VideoConferencePageProps {
  studyId?: number;
  studyName?: string;
}

export interface DemoParticipant {
  id: string;
  name: string;
  hasAudio: boolean;
  hasVideo: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
}

export interface StudyMaterial {
  id: string;
  name: string;
  type: string;
  url: string;
}

export interface SharedPdfState {
  pdfUrl: string;
  pdfName: string;
  pageNumber?: number;
  scale?: number;
  owner?: string;
}

export interface PdfAnnotation {
  id: string;
  type: 'highlight' | 'underline' | 'note' | 'drawing';
  pageNumber: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  color: string;
  content?: string;
  author: string;
  timestamp: number;
}

export interface SharedPdfAnnotationState {
  annotations: PdfAnnotation[];
  lastUpdated: number;
}

export interface RemoteParticipantState {
  audio: boolean;
  video: boolean;
}

export type SidebarTab = 'participants' | 'chat' | 'materials' | null;

// 스터디 화상회의 상태
export interface StudyVideoConferenceState {
  isActive: boolean;
  roomName: string;
  participants: VideoConferenceParticipant[];
  startedAt: string;
  maxParticipants: number;
}

// 화상회의 참가자 정보
export interface VideoConferenceParticipant {
  id: string;
  name: string;
  joinedAt: string;
  isHost: boolean;
  isScreenSharing: boolean;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
}
