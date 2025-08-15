import { RemoteParticipant } from 'livekit-client'

export interface ParticipantListProps {
  isDemoMode: boolean
  demoParticipants: Array<{
    id: string
    name: string
    hasAudio: boolean
    hasVideo: boolean
  }>
  remoteParticipants: Map<string, RemoteParticipant>
  remoteParticipantStates: Map<string, { audio: boolean; video: boolean }>
  participantName: string
  isAudioEnabled: boolean
  isVideoEnabled: boolean
  onToggleAudio: () => void
  onToggleVideo: () => void
  onToggleDemoParticipantAudio: (participantId: string) => void
  onToggleDemoParticipantVideo: (participantId: string) => void
}
