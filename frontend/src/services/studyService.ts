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
    const response = await api.get<any>(`/study/detail?hashId=${hashId}`)
    const data = response.data

    console.log('Study detail API response:', data)

    // ✅ DB 구조에 맞게 수정: 'id' 필드가 실제 studyId
    const studyId = data.id  // Study 테이블의 Primary Key

    console.log('Found studyId from id field:', studyId)

    const result: StudyDetail = {
      studyId: studyId,  // data.id를 studyId로 사용
      name: data.name || '',
      imageUrl: data.imageUrl || data.image_url || '',
      status: data.status,
      role: data.role,
      description: data.description,
      userCount: data.userCount || data.user_count
    }

    console.log('Converted StudyDetail:', result)
    return result

  } catch (error) {
    console.error('getStudyDetail API error:', error)
    throw normalizeError(error)
  }
}

export const getStudyMembers = async (studyId: string): Promise<Member[]> => {
  try {
    console.log('getStudyMembers API call with studyId:', studyId)
    const response = await api.get<Member[]>(`/study/${studyId}/members`)
    console.log('getStudyMembers API response:', response.data)
    return response.data
  } catch (error) {
    console.error('getStudyMembers API error:', error)
    // 404 lists -> [] (empty array)
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } }
      if (axiosError.response?.status === 404) {
        console.log('getStudyMembers: 404 error, returning empty array')
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
