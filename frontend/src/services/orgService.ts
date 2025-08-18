import api from './api'
import type { AcceptReq, RejectReq, DesignateReq, DeleteMemberReq, OrgListResponse } from '../types/org'

export const orgService = {
  // 스터디별 가입 요청 및 멤버 목록 조회
  getJoinRequests: async (studyId: number): Promise<OrgListResponse> => {
    const response = await api.get(`/org/list/management`, {
      params: { studyId }
    })
    return response.data
  },

  // 가입 요청 승인
  acceptJoin: async (req: AcceptReq): Promise<void> => {
    await api.patch('/org/accept', req)
  },

  // 가입 요청 거절
  rejectJoin: async (req: RejectReq): Promise<void> => {
    await api.patch('/org/reject', req)
  },

  // 멤버 역할 지정
  designateRole: async (req: DesignateReq): Promise<void> => {
    await api.patch('/org/designate', req)
  },

  // 멤버 삭제
  deleteMember: async (req: DeleteMemberReq): Promise<void> => {
    await api.patch('/org/delete', req)
  }
}
