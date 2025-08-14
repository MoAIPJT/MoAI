export interface Participant {
  id: string
  name: string
  avatar: string
}

export interface OnlineParticipant extends Participant {
  isOnline: boolean
}

export interface StudyVideoConferenceProps {
  hasActiveMeeting?: boolean
  onCreateRoom?: () => void
  participants?: Participant[]
  currentUserRole?: string
  // 🆕 API 연결 완료 - 새로운 props들
  onlineParticipants?: OnlineParticipant[]
  meetingSessionId?: string
  // 🆕 추가 props
  isLoading?: boolean
  canManageSession?: boolean
  onCloseSession?: () => void
}
