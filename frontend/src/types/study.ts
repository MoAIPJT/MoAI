export const userKeys = {
  all: ['users'] as const,
  me: () => ['users', 'me'] as const
}

export const studyKeys = {
  all: ['studies'] as const,
  sidebar: (userId: number) => ['studies', 'sidebar', userId] as const,
  allMine: () => ['studies', 'all'] as const,
  detail: (hashId: string) => ['studies', 'detail', hashId] as const,
  members: (studyId: string) => ['studies', 'members', studyId] as const,
  joinRequests: (studyId: number) => ['studies', 'joinRequests', studyId] as const,
}

export const orgKeys = {
  all: ['org'] as const,
  requests: (studyId: number) => ['org', 'requests', studyId] as const
}

export const refKeys = {
  all: ['ref'] as const,
  list: (studyId: number) => ['ref', 'list', studyId] as const,
  categories: (studyId: number) => ['ref', 'categories', studyId] as const,
}

export const aiKeys = {
  all: ['ai'] as const,
  list: (userId: number) => ['ai', 'list', userId] as const,
  sidebar: (userId: number) => ['ai', 'sidebar', userId] as const,
  detail: (id: number) => ['ai', 'detail', id] as const
}

export const scheduleKeys = {
  all: ['schedule'] as const,
  byStudyMonth: (studyId: number, y: number, m: number) => ['schedule', 'byStudyMonth', { studyId, y, m }] as const,
  myMonthly: (userId: number, y: number, m: number) => ['schedule', 'myMonthly', { userId, y, m }] as const,
}

// 백엔드 DTO 기반 프론트엔드 타입 정의

// 스터디 생성 요청
export interface CreateStudyReq {
  name: string
  description?: string
  image?: File
  maxCapacity: number
}

// 스터디 생성 응답 (StudyResponseDto)
export interface CreateStudyRes {
  id: number
  name: string
  description: string
  imageUrl: string
  createdBy: number
  createdAt: string
  hashId: string
}

// 스터디 목록 아이템 (StudyListResponseDto 기반)
export interface StudyListItem {
  studyId: number
  hashId: string
  name: string
  description: string
  imageUrl: string
  creatorName: string
  status: 'PENDING' | 'APPROVED'
}

// 전체 스터디 아이템 (사용자별)
export interface StudyAllItem {
  studyId: number
  hashId: string
  name: string
  description: string
  imageUrl: string
  creatorName: string
  status: 'PENDING' | 'APPROVED' | 'LEFT' | 'REJECTED'
  role?: 'ADMIN' | 'DELEGATE' | 'MEMBER'
}

// 스터디 상세 정보 (StudyDetailResponseDto 기반)
export interface StudyDetail {
  studyId: number // 필수 필드로 변경
  name: string
  imageUrl: string
  status: 'PENDING' | 'APPROVED' | 'LEFT' | 'REJECTED' | null
  role?: 'ADMIN' | 'DELEGATE' | 'MEMBER'
  description?: string
  userCount?: number
  notice?: string
}

// 스터디 멤버 (StudyMemberListResponseDto 기반)
export interface Member {
  userId: number // 사용자 ID (백엔드 응답과 일치)
  member: string // 사용자 이름
  role: string // 권한
  imageUrl: string // 프로필 이미지
  email: string // 이메일
}

// 스터디 탈퇴 요청
export interface LeaveStudyReq {
  studyGroupId: number
}

// 스터디 멤버 삭제 요청
export interface DeleteMemberReq {
  studyId: number
  userId: number
}

// 스터디 멤버 역할 변경 요청
export interface ChangeMemberRoleReq {
  studyId: number
  userId: number  // 사용자 ID로 식별 (백엔드에서 기대하는 필드명)
  role: 'ADMIN' | 'DELEGATE' | 'MEMBER'
}

// 🆕 스터디 참여자 응답 타입 추가
export interface StudyParticipantsResponse {
  id: string
  study_id: string
  participants: Array<{
    member: string
    role: string
    email: string
    avatar: string
  }>
}

// 스터디 가입 요청
export interface JoinRequest {
  userID: number
  userEmail: string
  name: string
  imageUrl: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

// 스터디 가입 요청 수락
export interface AcceptJoinRequestReq {
  studyId: number
  userId: number  // memberEmail 대신 userId 사용
  role: 'ADMIN' | 'DELEGATE' | 'MEMBER'
}

// 스터디 가입 요청 거절
export interface RejectJoinRequestReq {
  studyId: number
  userId: number  // memberEmail 대신 userId 사용
}
// 스터디 공지사항 업데이트
export interface UpdateStudyNoticeReq {
  studyId: number
  notice: string
}

// API 에러 타입
export interface ApiError {
  code: string
  message: string
}

// 기존 타입들 (하위 호환성을 위해 유지)
export interface Study {
  id: number
  name: string
  description: string
  imageUrl: string
  createdBy: number
  createdAt: string
  inviteUrl: string
}

export interface CreateStudyData {
  name: string
  description: string
  image?: File
  maxCapacity: number
}
