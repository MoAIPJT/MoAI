export interface StudyParticipant {
  member: string
  role: string
  email?: string
  avatar?: string
}

export interface StudyParticipantsResponse {
  id: string
  study_id: string
  participants: StudyParticipant[]
} 