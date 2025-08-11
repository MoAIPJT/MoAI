import api from './api'
import type {
  StudyListItem,
  StudyAllItem,
  StudyDetail,
  Member,
  CreateStudyReq,
  CreateStudyRes,
  LeaveStudyReq,
  DeleteMemberReq,
  ChangeMemberRoleReq,
  AcceptJoinRequestReq,
  RejectJoinRequestReq,
  UpdateStudyNoticeReq,
  ApiError
} from '@/types/study'

// Error normalization helper
const normalizeError = (error: unknown): ApiError => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { code?: string; message?: string }; status?: number; statusText?: string } }
    if (axiosError.response?.data) {
      return {
        code: axiosError.response.data.code || axiosError.response.status?.toString() || 'UNKNOWN_ERROR',
        message: axiosError.response.data.message || axiosError.response.statusText || 'An error occurred'
      }
    }
    if (axiosError.response?.status) {
      return {
        code: axiosError.response.status.toString(),
        message: axiosError.response.statusText || 'An error occurred'
      }
    }
  }

  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred'
    }
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred'
  }
}

// Study endpoints
export const createStudy = async (data: CreateStudyReq): Promise<CreateStudyRes> => {
  try {
    let response;

    if (data.image) {
      // 이미지가 있는 경우 FormData 사용
      const formData = new FormData()
      formData.append('name', data.name)
      if (data.description) {
        formData.append('description', data.description)
      }
      formData.append('image', data.image)
      formData.append('maxCapacity', data.maxCapacity.toString())

      response = await api.post<CreateStudyRes>('/study/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    } else {
      // 이미지가 없는 경우 JSON 형식으로 전송
      const requestBody = {
        name: data.name,
        description: data.description || '',
        maxCapacity: data.maxCapacity
      }

      response = await api.post<CreateStudyRes>('/study/register', requestBody)
    }

    return response.data
  } catch (error) {
    console.error('createStudy API error:', error)
    throw normalizeError(error)
  }
}

export const getSidebarStudies = async (): Promise<StudyListItem[]> => {
  try {
    const response = await api.get<StudyListItem[]>('/study/list')
    return response.data
  } catch (error) {
    // 404 lists -> [] (empty array)
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } }
      if (axiosError.response?.status === 404) {
        return []
      }
    }
    throw normalizeError(error)
  }
}

export const getAllStudies = async (): Promise<StudyAllItem[]> => {
  try {
    console.log('getAllStudies API call')
    const response = await api.get<StudyAllItem[]>('/study/all')
    console.log('getAllStudies API response:', response.data)
    return response.data
  } catch (error) {
    console.error('getAllStudies API error:', error)
    // 404 lists -> [] (empty array)
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } }
      if (axiosError.response?.status === 404) {
        console.log('getAllStudies: 404 error, returning empty array')
        return []
      }
    }
    throw normalizeError(error)
  }
}

export const getStudyDetail = async (hashId: string): Promise<StudyDetail> => {
  try {
    const response = await api.get<StudyDetail>(`/study/detail?hashId=${hashId}`)
    return response.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export const getStudyMembers = async (studyId: number): Promise<Member[]> => {
  try {
    const response = await api.get<Member[]>(`/study/${studyId}/members`)
    return response.data
  } catch (error) {
    // 404 lists -> [] (empty array)
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } }
      if (axiosError.response?.status === 404) {
        return []
      }
    }
    throw normalizeError(error)
  }
}

export const leaveStudy = async (payload: LeaveStudyReq): Promise<void> => {
  try {
    await api.patch('/study/leave', payload)
  } catch (error) {
    throw normalizeError(error)
  }
}

// 새로운 API 엔드포인트들
export const deleteStudyMember = async (payload: DeleteMemberReq): Promise<void> => {
  try {
    await api.delete('/study/member/delete', { data: payload })
  } catch (error) {
    throw normalizeError(error)
  }
}

export const changeMemberRole = async (payload: ChangeMemberRoleReq): Promise<void> => {
  try {
    await api.patch('/study/member/role', payload)
  } catch (error) {
    throw normalizeError(error)
  }
}

export const acceptJoinRequest = async (payload: AcceptJoinRequestReq): Promise<void> => {
  try {
    await api.patch('/study/join/accept', payload)
  } catch (error) {
    throw normalizeError(error)
  }
}

export const rejectJoinRequest = async (payload: RejectJoinRequestReq): Promise<void> => {
  try {
    await api.patch('/study/join/reject', payload)
  } catch (error) {
    throw normalizeError(error)
  }
}

export const updateStudyNotice = async (payload: UpdateStudyNoticeReq): Promise<void> => {
  try {
    await api.patch('/study/notice', payload)
  } catch (error) {
    throw normalizeError(error)
  }
}
