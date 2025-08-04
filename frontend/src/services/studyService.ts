import api from './api'
import type { StudyItem } from '../components/organisms/DashboardSidebar/types'

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
        image_url: '/api/images/algorithm.jpg',
      },
      {
        id: 'study-2',
        name: 'CS 모여라',
        description: '컴퓨터 과학 기초 지식을 함께 학습하고 토론하는 스터디입니다.',
        image_url: '/api/images/cs.jpg',
      },
      {
        id: 'study-3',
        name: '면접 화상 스터디',
        description: '실전 면접 연습과 피드백을 통해 면접 실력을 키우는 스터디입니다.',
        image_url: '/api/images/interview.jpg',
      },
      {
        id: 'study-4',
        name: '대전맛집탐방',
        description: '대전 지역 맛집을 함께 탐방하고 리뷰를 공유하는 스터디입니다.',
        image_url: '/api/images/food.jpg',
      },
    ]
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
