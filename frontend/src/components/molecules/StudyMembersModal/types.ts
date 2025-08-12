import type { Member, JoinRequest } from '../../../types/study'

export interface StudyMembersModalProps {
  isOpen: boolean
  onClose: () => void
  members: Member[]
  studyName: string
  currentUserRole?: string // 현재 사용자의 역할

  // 👇 가입 요청 관련 props 추가
  joinRequests?: JoinRequest[]
  onAcceptJoinRequest?: (userId: number, role: string) => void
  onRejectJoinRequest?: (userId: number) => void

  // 👇 멤버 권한 변경 관련 props 추가
  onMemberRoleChange?: (userId: number, newRole: 'ADMIN' | 'DELEGATE' | 'MEMBER', userEmail: string) => void
}
