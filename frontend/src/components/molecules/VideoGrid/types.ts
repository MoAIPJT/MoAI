import { RemoteParticipant } from 'livekit-client';

export interface VideoGridProps {
  isDemoMode: boolean;
  demoParticipants: Array<{id: string, name: string, hasAudio: boolean, hasVideo: boolean}>;
  remoteParticipants: Map<string, RemoteParticipant>;
  localVideoTrack: any;
  isVideoEnabled: boolean;
  participantName: string;
  remoteParticipantStates: Map<string, {audio: boolean, video: boolean}>;
  cols: number;
  rows: number;
  speakingParticipantId?: string;
}
