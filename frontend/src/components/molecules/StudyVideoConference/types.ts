export interface Participant {
  id: string
  name: string
  avatar: string
}

export interface StudyVideoConferenceProps {
  hasActiveMeeting?: boolean
  onCreateRoom?: () => void
  participants?: Participant[]
}
