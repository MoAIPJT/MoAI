import { RemoteParticipant } from 'livekit-client'

export interface ParticipantListProps {
  remoteParticipants: Map<string, RemoteParticipant>
  remoteParticipantStates: Map<string, { audio: boolean; video: boolean }>
  participantName: string
  isAudioEnabled: boolean
  isVideoEnabled: boolean
  onToggleAudio: () => void
  onToggleVideo: () => void
}
