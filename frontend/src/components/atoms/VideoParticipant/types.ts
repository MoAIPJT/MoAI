import { Track } from 'livekit-client'

export interface VideoParticipantProps {
  participantId: string
  participantName: string
  hasVideo: boolean
  isVideoEnabled: boolean
  isSpeaking?: boolean
  videoTrack?: Track
  isLocal?: boolean
  isDemo?: boolean
  isMuted?: boolean
}
