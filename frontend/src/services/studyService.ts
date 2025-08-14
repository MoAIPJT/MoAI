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
