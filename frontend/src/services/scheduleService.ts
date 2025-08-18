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
      console.log('일정 조회 요청:', { studyId, from, to })

      const response = await api.get(`/schedules/${studyId}/list`, {
        params: { from, to }
      })

      console.log('일정 조회 성공 응답:', response.data)
      return response.data
    } catch (error: unknown) {
      console.error('일정 조회 API 에러:', error)

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown; status?: number } }
        console.error('에러 응답 상태:', axiosError.response?.status)
        console.error('에러 응답 데이터:', axiosError.response?.data)

        // 404 에러 시 빈 배열 반환
        if (axiosError.response?.status === 404) {
          console.log('404 에러: 해당 기간에 일정이 없습니다.')
          return []
        }
      }

      throw error
    }
  },

  // 내 스케줄 조회 (마이페이지용) - API 문서에 맞게 수정
  async getMySchedules(from: string, to: string): Promise<ScheduleListResponse[]> {
    try {
      console.log('내 일정 조회 요청:', { from, to })

      const response = await api.get('/schedules/list', {
        params: { from, to }
      })

      console.log('내 일정 조회 성공 응답:', response.data)
      return response.data
    } catch (error: unknown) {
      console.error('내 일정 조회 API 에러:', error)

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown; status?: number } }
        console.error('에러 응답 상태:', axiosError.response?.status)
        console.error('에러 응답 데이터:', axiosError.response?.data)

        // 404 에러 시 빈 배열 반환
        if (axiosError.response?.status === 404) {
          console.log('404 에러: 해당 기간에 일정이 없습니다.')
          return []
        }
      }

      throw error
    }
  },

  // 일정 생성
  async createSchedule(request: CreateScheduleRequest): Promise<CreateScheduleResponse> {
    try {
      console.log('일정 생성 요청 데이터:', request)
      const response = await api.post('/schedules/register', request)
      console.log('일정 생성 성공 응답:', response.data)
      return response.data
    } catch (error: unknown) {
      console.error('일정 생성 API 에러:', error)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown; status?: number } }
        console.error('에러 응답 상태:', axiosError.response?.status)
        console.error('에러 응답 데이터:', axiosError.response?.data)
      }
      throw error
    }
  },

  // 일정 수정
  async editSchedule(scheduleId: number, request: EditScheduleRequest): Promise<CreateScheduleResponse> {
    try {
      console.log('일정 수정 요청 데이터:', { scheduleId, request })
      const response = await api.patch(`/schedules/edit/${scheduleId}`, request)
      console.log('일정 수정 성공 응답:', response.data)
      return response.data
    } catch (error: unknown) {
      console.error('일정 수정 API 에러:', error)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown; status?: number } }
        console.error('에러 응답 상태:', axiosError.response?.status)
        console.error('에러 응답 데이터:', axiosError.response?.data)
      }
      throw error
    }
  },

  // 일정 삭제
  async deleteSchedule(scheduleId: number): Promise<void> {
    try {
      console.log('일정 삭제 요청:', scheduleId)
      await api.delete(`/schedules/delete/${scheduleId}`)
      console.log('일정 삭제 성공')
    } catch (error: unknown) {
      console.error('일정 삭제 API 에러:', error)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown; status?: number } }
        console.error('에러 응답 상태:', axiosError.response?.status)
        console.error('에러 응답 데이터:', axiosError.response?.data)
      }
      throw error
    }
  }
}
