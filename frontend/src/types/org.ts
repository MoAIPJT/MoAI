export interface JoinRequest {
  id: number
  userId: number
  userEmail: string
  name: string
  imageUrl?: string
  status: '대기 중' | '승인' | '거절' | string
  studyId: number
}

export interface AcceptReq {
  id: number
  studyId: number
  userId: number
  role: 'ADMIN' | 'DELEGATE' | 'MEMBER'
}

export interface RejectReq {
  id: number
  studyId: number
  userId: number
}

export interface DesignateReq {
  id: number
  studyId: number
  userId: number
  role: string
}

export interface DeleteMemberReq {
  id: number
  studyId: number
  userId: number
}

export interface OrgListResponse {
  joinRequests: JoinRequest[]
  members: Array<{
    userId: number
    userEmail: string
    name: string
    imageUrl?: string
    role: string
    status: string
  }>
}
