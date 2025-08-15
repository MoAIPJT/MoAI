export interface Participant {
  id: string
  name: string
  avatar: string
}

export interface OnlineParticipant extends Participant {
  isOnline: boolean
}

export interface StudyVideoConferenceProps {
  onCreateRoom?: () => void
  participants?: Array<{
    id: string
    name: string
    avatar: string
  }>
  currentUserRole?: string
  hashId?: string
}
