import api from './api'
import type { StudyItem } from '../components/organisms/DashboardSidebar/types'
import type { StudyParticipantsResponse } from '../types/study'

// 스터디 목록 조회
export const getStudies = async (): Promise<StudyItem[]> => {
  try {
    const response = await api.get('/studies')
    return response.data
  } catch (error) {
    console.error('Failed to fetch studies:', error)
    // 에러 시 더미 데이터 반환 (개발용)
    return [
      {
        id: 'study-1',
        name: '싸피 알고리즘',
        description: '알고리즘 문제 풀이와 코드 리뷰를 통해 실력을 향상시키는 스터디입니다.',
        image: '/api/images/algorithm.jpg',
        image_url: '/api/images/algorithm.jpg',
      },
      {
        id: 'study-2',
        name: 'CS 모여라',
        description: '컴퓨터 과학 기초 지식을 함께 학습하고 토론하는 스터디입니다.',
        image: '/api/images/cs.jpg',
        image_url: '/api/images/cs.jpg',
      },
      {
        id: 'study-3',
        name: '면접 화상 스터디',
        description: '실전 면접 연습과 피드백을 통해 면접 실력을 키우는 스터디입니다.',
        image: '/api/images/interview.jpg',
        image_url: '/api/images/interview.jpg',
      },
      {
        id: 'study-4',
        name: '대전맛집탐방',
        description: '대전 지역 맛집을 함께 탐방하고 리뷰를 공유하는 스터디입니다.',
        image: '/api/images/food.jpg',
        image_url: '/api/images/food.jpg',
      },
    ]
  }
}

// 🆕 getAllStudies 함수 추가 (DashboardPage에서 사용)
export const getAllStudies = async (): Promise<StudyItem[]> => {
  return getStudies()
}

// 🆕 사이드바 스터디 목록 조회 (StudyDetailPage에서 사용)
export const getSidebarStudies = async (): Promise<StudyItem[]> => {
  try {
    const response = await api.get('/studies/sidebar')
    return response.data
  } catch (error) {
    console.error('Failed to fetch sidebar studies:', error)
    // 에러 시 더미 데이터 반환 (개발용)
    return [
      {
        id: 'study-1',
        name: '싸피 알고리즘',
        description: '알고리즘 문제 풀이와 코드 리뷰를 통해 실력을 향상시키는 스터디입니다.',
        image: '/api/images/algorithm.jpg',
        image_url: '/api/images/algorithm.jpg',
      },
      {
        id: 'study-2',
        name: 'CS 모여라',
        description: '컴퓨터 과학 기초 지식을 함께 학습하고 토론하는 스터디입니다.',
        image: '/api/images/cs.jpg',
        image_url: '/api/images/cs.jpg',
      },
    ]
  }
}

// 🆕 스터디 공지사항 업데이트 (StudyDetailPage에서 사용)
export const updateStudyNotice = async (data: { studyId: number; notice: string }): Promise<void> => {
  try {
    await api.put(`/studies/${data.studyId}/notice`, { notice: data.notice })
  } catch (error) {
    console.error('Failed to update study notice:', error)
    throw error
  }
}

export const getStudyDetail = async (hashId: string): Promise<StudyDetail> => {
  try {
    const response = await api.get<any>(`/study/detail?hashId=${hashId}`)
    const data = response.data

    console.log('🔍 Study detail API response:', data)
    console.log('🔍 Response data keys:', Object.keys(data))
    console.log('🔍 Response data values:', Object.values(data))

    // ✅ 다양한 필드명으로 studyId 찾기 시도
    let studyId = data.id || data.studyId || data.study_id || data.studyGroupId || data.study_group_id

    // 만약 여전히 studyId가 없다면, hashId를 디코딩해서 사용
    if (!studyId || studyId === 0) {
      console.log('⚠️ studyId를 찾을 수 없음. hashId 디코딩 시도:', hashId)
      // hashId가 이미 숫자인 경우 그대로 사용
      if (!isNaN(Number(hashId))) {
        studyId = Number(hashId)
        console.log('✅ hashId를 숫자로 변환하여 studyId로 사용:', studyId)
      } else {
        // hashId가 문자열인 경우 기본값 설정
        studyId = 1 // 임시 기본값
        console.log('⚠️ studyId를 찾을 수 없어 기본값 사용:', studyId)
      }
    }

    console.log('🎯 최종 studyId:', studyId)

    const result: StudyDetail = {
      studyId: studyId,
      name: data.name || '',
      imageUrl: data.imageUrl || data.image_url || '',
      status: data.status,
      role: data.role,
      description: data.description,
      userCount: data.userCount || data.user_count
    }

    console.log('✅ Converted StudyDetail:', result)
    return result

  } catch (error) {
    console.error('❌ getStudyDetail API error:', error)
    throw normalizeError(error)
  }
}

export const getStudyMembers = async (studyId: string): Promise<Member[]> => {
  try {
    console.log('getStudyMembers API call with studyId:', studyId)
    const response = await api.get<Member[]>(`/study/${studyId}/members`)
    console.log('getStudyMembers API response:', response.data)
    // 디버깅을 위해 멤버 데이터 자세히 로깅
    response.data.forEach(member => {
      console.log('Member details:', {
        id: member.userId,
        name: member.member,
        role: member.role,
        email: member.email
      })
    })
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


      console.log('FormData 사용 - maxCapacity:', data.maxCapacity.toString())
      console.log('FormData 내용:')
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value)
      }

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

      console.log('JSON 사용 - requestBody:', requestBody)

      await api.patch(`/study/${studyId}/update`, requestBody)
    }

    console.log('=== updateStudy API 성공 ===')
  } catch (error) {
    console.error('=== updateStudy API 에러 ===')
    console.error('에러 상세:', error)
    throw normalizeError(error)
  }
}

// 공지사항 조회 API 추가
// 🆕 스터디 공지사항 조회 (StudyDetailPage에서 사용)
export const getStudyNotice = async (studyId: number): Promise<{ notice: string }> => {
  try {
    const response = await api.get(`/studies/${studyId}/notice`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch study notice:', error)
    // 에러 시 기본 공지사항 반환
    return { notice: '안녕하세요! 스터디 입니다 :)' }
  }
}

// 🆕 스터디 가입 (StudyDetailPage에서 사용)
export const joinStudy = async (data: { studyId: number }): Promise<void> => {
  try {
    await api.post(`/studies/${data.studyId}/join`)
  } catch (error) {
    console.error('Failed to join study:', error)
    throw error
  }
}

// 🆕 스터디 탈퇴 (StudyDetailPage에서 사용)
export const leaveStudy = async (data: { studyGroupId: number }): Promise<void> => {
  try {
    await api.post(`/studies/${data.studyGroupId}/leave`)
  } catch (error) {
    console.error('Failed to leave study:', error)
    throw error
  }
}

// 🆕 스터디 멤버 삭제 (StudyDetailPage에서 사용)
export const deleteStudyMember = async (data: { studyId: number; userId: number }): Promise<void> => {
  try {
    await api.delete(`/studies/${data.studyId}/members/${data.userId}`)
  } catch (error) {
    console.error('Failed to delete study member:', error)
    throw error
  }
}

// 특정 스터디 조회
export const getStudyById = async (studyId: string): Promise<StudyItem> => {
  try {
    const response = await api.get(`/studies/${studyId}`)
    return response.data
  } catch (error) {
    console.error(`Failed to fetch study ${studyId}:`, error)
    // 에러 시 studyId에 따라 다른 스터디 정보 반환
    const studyData = {
      'study-1': {
        name: '싸피 알고리즘',
        description: '알고리즘 문제 풀이와 코드 리뷰를 통해 실력을 향상시키는 스터디입니다.',
        image_url: '/api/images/algorithm.jpg',
      },
      'study-2': {
        name: 'CS 모여라',
        description: '컴퓨터 과학 기초 지식을 함께 학습하고 토론하는 스터디입니다.',
        image_url: '/api/images/cs.jpg',
      },
      'study-3': {
        name: '면접 화상 스터디',
        description: '실전 면접 연습과 피드백을 통해 면접 실력을 키우는 스터디입니다.',
        image_url: '/api/images/interview.jpg',
      },
      'study-4': {
        name: '대전맛집탐방',
        description: '대전 지역 맛집을 함께 탐방하고 리뷰를 공유하는 스터디입니다.',
        image_url: '/api/images/food.jpg',
      },
    }
    const defaultStudy = studyData[studyId as keyof typeof studyData]
    return {
      id: studyId,
      name: defaultStudy?.name || '알 수 없는 스터디',
      description: defaultStudy?.description || '스터디 설명이 없습니다.',
      image: defaultStudy?.image_url || '/api/images/default.jpg',
      image_url: defaultStudy?.image_url || '/api/images/default.jpg',
    }
  }
}

// 스터디 생성
export const createStudy = async (studyData: Omit<StudyItem, 'id'>): Promise<StudyItem> => {
  const response = await api.post('/studies', studyData)
  return response.data
}

// 스터디 수정
export const updateStudy = async (studyId: string, studyData: Partial<StudyItem>): Promise<StudyItem> => {
  const response = await api.put(`/studies/${studyId}`, studyData)
  return response.data
}

// 스터디 삭제
export const deleteStudy = async (studyId: string): Promise<void> => {
  await api.delete(`/studies/${studyId}`)
}

// 스터디 참여자 조회
export const getStudyParticipants = async (studyId: string): Promise<StudyParticipantsResponse> => {
  try {
    const response = await api.get(`/studies/${studyId}/participants`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch study participants:', error)
    // 에러 시 더미 데이터 반환 (개발용)
    return {
      id: studyId,
      study_id: studyId,
      participants: [
        { member: 'Kuromi', role: 'Owner', email: 'dksejrgus2@naver.com', avatar: '👻' },
        { member: 'Heo', role: 'Member', email: 'Timmy@naver.com', avatar: '👨' },
        { member: 'Hazel', role: 'Developer', email: 'lhy2829@naver.com', avatar: '👩' },
      ]
    }
  }
}

// 스터디 자료 조회
export const getStudyMaterials = async (studyId: string): Promise<Array<{id: string, name: string, type: string, url: string}>> => {
  // 개발용으로 항상 더미 데이터 반환
  const materialsData = {
    'study-1': [
      { id: '1', name: '알고리즘 기초.pdf', type: 'pdf', url: '/pdfs/cats-and-dogs.pdf' },
      { id: '2', name: '자료구조 강의.pdf', type: 'pdf', url: '/pdfs/hamburger.pdf' },
      { id: '3', name: '코딩 테스트 문제집.pdf', type: 'pdf', url: '/pdfs/i-love-duck.pdf' },
      { id: '4', name: '알고리즘 실전 문제.pdf', type: 'pdf', url: '/pdfs/omori-kalguksu.pdf' },
    ],
    'study-2': [
      { id: '1', name: '컴퓨터 구조론.pdf', type: 'pdf', url: '/pdfs/cats-and-dogs.pdf' },
      { id: '2', name: '운영체제 강의.pdf', type: 'pdf', url: '/pdfs/hamburger.pdf' },
      { id: '3', name: '네트워크 기초.pdf', type: 'pdf', url: '/pdfs/i-love-duck.pdf' },
    ],
    'study-3': [
      { id: '1', name: '면접 준비 가이드.pdf', type: 'pdf', url: '/pdfs/cats-and-dogs.pdf' },
      { id: '2', name: '자기소개서 작성법.pdf', type: 'pdf', url: '/pdfs/hamburger.pdf' },
      { id: '3', name: '면접 질문 모음.pdf', type: 'pdf', url: '/pdfs/i-love-duck.pdf' },
    ],
    'study-4': [
      { id: '1', name: '대전 맛집 리스트.pdf', type: 'pdf', url: '/pdfs/cats-and-dogs.pdf' },
      { id: '2', name: '맛집 리뷰 가이드.pdf', type: 'pdf', url: '/pdfs/hamburger.pdf' },
      { id: '3', name: '맛집 탐방 계획.pdf', type: 'pdf', url: '/pdfs/i-love-duck.pdf' },
    ],
  }

  return materialsData[studyId as keyof typeof materialsData] || [
    { id: '1', name: '기본 자료.pdf', type: 'pdf', url: '/pdfs/cats-and-dogs.pdf' },
    { id: '2', name: '스터디 가이드.pdf', type: 'pdf', url: '/pdfs/hamburger.pdf' },
  ]
}
