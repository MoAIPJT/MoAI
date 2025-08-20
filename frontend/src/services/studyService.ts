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
  JoinRequest,
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
    const formData = new FormData()
    formData.append('name', data.name)
    if (data.description) {
      formData.append('description', data.description)
    }
    if (data.image) {
      formData.append('image', data.image)
    }
    formData.append('maxCapacity', data.maxCapacity.toString())

    const response = await api.post<CreateStudyRes>('/study/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

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
    const response = await api.get<StudyAllItem[]>('/study/all')
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

export const getStudyDetail = async (hashId: string): Promise<StudyDetail> => {
  try {
    const response = await api.get<{
      id: number
      name: string
      imageUrl: string
      status: string | null
      role?: string
      description?: string
      userCount?: number
    }>(`/study/detail?hashId=${hashId}`)
    const data = response.data

    // ✅ 백엔드 응답 구조에 맞게 studyId 매핑
    // StudyResponseDto의 id 필드를 studyId로 사용
    const studyId = data.id

    // id가 0인 경우는 백엔드에서 해당 스터디를 찾지 못한 것
    if (!studyId || studyId === 0) {
      throw new Error('해당 스터디를 찾을 수 없습니다. 스터디가 존재하지 않거나 삭제되었을 수 있습니다.')
    }

    const result: StudyDetail = {
      studyId: studyId,
      name: data.name || '',
      imageUrl: data.imageUrl || '',
      status: data.status as 'PENDING' | 'APPROVED' | 'LEFT' | 'REJECTED' | null,
      role: data.role as 'ADMIN' | 'DELEGATE' | 'MEMBER' | undefined,
      description: data.description,
      userCount: data.userCount
    }

    return result

  } catch (error) {
    throw normalizeError(error)
  }
}

export const getStudyMembers = async (studyId: string): Promise<Member[]> => {
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
    await api.patch('/study/delete', payload)
  } catch (error) {
    throw normalizeError(error)
  }
}

export const changeMemberRole = async (payload: ChangeMemberRoleReq): Promise<void> => {
  try {

    await api.patch('/study/designate', payload)
  } catch (error) {
    throw normalizeError(error)
  }
}

export const acceptJoinRequest = async (payload: AcceptJoinRequestReq): Promise<void> => {
  try {
    await api.patch('/study/accept', payload)
  } catch (error) {
    throw normalizeError(error)
  }
}

export const rejectJoinRequest = async (payload: RejectJoinRequestReq): Promise<void> => {
  try {
    await api.patch('/study/reject', payload)
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

// 스터디 수정 API 추가
export const updateStudy = async (studyId: number, data: {
  name: string
  description: string
  image?: File
  maxCapacity: number
}): Promise<void> => {
  try {

    if (data.image) {
      // 이미지가 있는 경우 FormData 사용
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('description', data.description)
      formData.append('image', data.image)


      formData.append('maxCapacity', data.maxCapacity.toString())




      await api.patch(`/study/${studyId}/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    } else {
      // 이미지가 없는 경우 JSON 형식으로 전송
      // 백엔드 스펙에 맞춰 다양한 형식 시도
      const requestBody = {
        name: data.name,
        description: data.description,
        maxCapacity: data.maxCapacity,
        maxMembers: data.maxCapacity, // 대안 1
        maxMemberCount: data.maxCapacity, // 대안 2
        // 추가로 필요한 필드들
        studyId: studyId
      }



      await api.patch(`/study/${studyId}/update`, requestBody)
    }

  } catch (error) {
    throw normalizeError(error)
  }
}

// 공지사항 조회 API 추가
export const getStudyNotice = async (studyId: number): Promise<{ notice: string }> => {
  try {
    const response = await api.get<{ notice: string }>(`/study/notice?studyId=${studyId}`)
    return response.data
  } catch (error) {
    // 공지사항이 없는 경우 빈 문자열 반환
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } }
      if (axiosError.response?.status === 404) {
        return { notice: '' }
      }
    }
    throw normalizeError(error)
  }
}




// 가입 요청 목록 조회 API 추가
export const getJoinRequests = async (studyId: number): Promise<JoinRequest[]> => {
  try {
    const response = await api.get<JoinRequest[]>(`/study/list/management?studyId=${studyId}`)
    return response.data
  } catch (error) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } }
      if (axiosError.response?.status === 404) {
        return []
      }
    }
    throw normalizeError(error)
  }
}


export interface JoinStudyReq {
  studyId: number
}

export const joinStudy = async (payload: JoinStudyReq): Promise<void> => {
  try {
    await api.get(`/study/join?study_id=${payload.studyId}`)
  } catch (error) {
    throw normalizeError(error)
  }
}
