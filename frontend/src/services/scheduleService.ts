import api from './api'

// API 문서에 맞는 일정 목록 조회 응답 타입
export interface ScheduleListResponse {
  id: number
  studyId: number
  name: string
  description: string
  image: string
  startDatetime: string
  endDatetime: string
  title: string
  memo: string
}

// API 문서에 맞는 일정 생성 요청 타입
export interface CreateScheduleRequest {
  studyId: number
  startDatetime: string
  endDatetime: string
  title: string
  memo?: string
}

// API 문서에 맞는 일정 생성 응답 타입
export interface CreateScheduleResponse {
  id: number
  studyId: number
  userId: number
  startDatetime: string
  endDatetime: string
  title: string
  memo: string
}

// API 문서에 맞는 일정 수정 요청 타입
export interface EditScheduleRequest {
  studyId: number
  startDatetime: string
  endDatetime: string
  title: string
  memo?: string
}

export const scheduleService = {
  // 스터디별 스케줄 조회 (API 문서에 맞게 수정)
  async getStudySchedules(studyId: number, from: string, to: string): Promise<ScheduleListResponse[]> {
    try {
      const response = await api.get(`/schedules/${studyId}/list`, {
        params: { from, to }
      })

      return response.data
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown; status?: number } }

        // 404 에러 시 빈 배열 반환
        if (axiosError.response?.status === 404) {
          return []
        }
      }

      throw error
    }
  },

  // 내 스케줄 조회 (마이페이지용) - API 문서에 맞게 수정
  async getMySchedules(from: string, to: string): Promise<ScheduleListResponse[]> {
    try {
      const response = await api.get('/schedules/list', {
        params: { from, to }
      })

      return response.data
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown; status?: number } }

        // 404 에러 시 빈 배열 반환
        if (axiosError.response?.status === 404) {
          return []
        }
      }

      throw error
    }
  },

  // 일정 생성
  async createSchedule(request: CreateScheduleRequest): Promise<CreateScheduleResponse> {
    try {
      const response = await api.post('/schedules/register', request)
      return response.data
    } catch (error: unknown) {
      throw error
    }
  },

  // 일정 수정
  async editSchedule(scheduleId: number, request: EditScheduleRequest): Promise<CreateScheduleResponse> {
    try {
      const response = await api.patch(`/schedules/edit/${scheduleId}`, request)
      return response.data
    } catch (error: unknown) {
      throw error
    }
  },

  // 일정 삭제
  async deleteSchedule(scheduleId: number): Promise<void> {
    try {
      await api.delete(`/schedules/delete/${scheduleId}`)
    } catch (error: unknown) {
      throw error
    }
  }
}
