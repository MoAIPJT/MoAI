import api from './api'
import { ScheduleItem, MyScheduleItem, CreateScheduleReq, EditScheduleReq, DeleteScheduleReq } from '../types/schedule'

export const scheduleService = {
  // 스터디별 스케줄 조회
  async getStudySchedules(studyId: number, userId: number): Promise<ScheduleItem[]> {
    try {
      const response = await api.get(`/schedule/${studyId}/list`, {
        params: { user_id: userId }
      })
      return response.data
    } catch (error: any) {
      if (error.response?.status === 404) {
        return []
      }
      throw error
    }
  },

  // 내 스케줄 조회
  async getMySchedules(userId: number): Promise<MyScheduleItem[]> {
    try {
      const response = await api.get('/schedule/list', {
        params: { user_id: userId }
      })
      return response.data
    } catch (error: any) {
      if (error.response?.status === 404) {
        return []
      }
      throw error
    }
  },

  // 스케줄 생성
  async createSchedule(req: CreateScheduleReq): Promise<ScheduleItem> {
    const response = await api.post('/schedule/register', req)
    return response.data
  },

  // 스케줄 수정
  async editSchedule(id: number, req: EditScheduleReq): Promise<ScheduleItem> {
    const response = await api.patch(`/schedule/edit/${id}`, req)
    return response.data
  },

  // 스케줄 삭제
  async deleteSchedule(id: number, reqUser: DeleteScheduleReq): Promise<void> {
    await api.delete(`/schedule/delete/${id}`, { data: reqUser })
  }
}
