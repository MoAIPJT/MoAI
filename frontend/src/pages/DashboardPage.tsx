import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardSidebar from '../components/organisms/DashboardSidebar'
import type { StudyItem } from '../components/organisms/DashboardSidebar/types'
import { getStudies } from '../services/studyService'

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const [studies, setStudies] = useState<StudyItem[]>([])

  // 스터디 목록 로드
  useEffect(() => {
    const loadStudies = async () => {
      try {
        const studiesData = await getStudies()
        setStudies(studiesData)
      } catch (error) {
        console.error('Failed to load studies:', error)
      }
    }
    loadStudies()
  }, [])

  const handleItemClick = (itemId: string) => {
    console.log('Navigation clicked:', itemId)

    // AI 요약본 클릭 시 새 탭에서 AI 요약본 페이지 열기
    if (itemId === 'ai-summary') {
      window.open('/ai-summary', '_blank')
    }

    // Study 클릭 시 Study 상세페이지로 이동 (기본 스터디)
    if (itemId === 'study') {
      navigate('/study/study-1')
    }


  }

  const handleLogout = () => {
    console.log('Logout clicked')
    // TODO: 로그아웃 로직 구현
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar
        activeItem="mypage"
        onItemClick={handleItemClick}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">MoAI 대시보드</h1>
          <p className="text-gray-600 mb-8">왼쪽 사이드바에서 원하는 기능을 선택하세요.</p>
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h2 className="text-lg font-semibold mb-4">빠른 가이드</h2>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <span className="text-blue-500">🏠</span>
                <span>마이페이지: 프로필 및 활동 정보</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-500">📄</span>
                <span>AI 요약본: 새 탭에서 요약본 관리</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-purple-500">📚</span>
                <span>스터디: 학습 그룹 관리</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
