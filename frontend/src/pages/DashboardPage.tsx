import React, { useState, useEffect } from 'react'
import DashboardSidebar from '../components/organisms/DashboardSidebar'
import TopBar from '../components/molecules/TopBar'
import StudyList from '../components/organisms/StudyList'
import AISummaryList from '../components/organisms/AISummaryList'
import type { Study } from '../components/organisms/StudyList/types'
import type { AISummary } from '../components/molecules/AISummaryCard/types'

const DashboardPage: React.FC = () => {
  const [studies, setStudies] = useState<Study[]>([])
  const [summaries, setSummaries] = useState<AISummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSummaryLoading, setIsSummaryLoading] = useState(true)

  // 스터디 목록을 가져오는 함수 (실제 API 호출)
  const fetchStudies = async () => {
    try {
      setIsLoading(true)
      
      // 실제 API 호출 (현재는 주석 처리)
      // const response = await fetch('/api/studies')
      // const data = await response.json()
      // setStudies(data)
      
      // 임시로 로딩 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 더미 데이터 설정
      const dummyStudies = [
        {
          id: 1,
          name: '싸피 알고리즘',
          description: '코딩코딩코딩코딩',
          imageUrl: '',
          createdBy: 1,
          createdAt: '2024-01-01',
          inviteUrl: 'https://example.com/invite/1'
        },
        {
          id: 2,
          name: 'CS 모여라',
          description: '취뽀 가보자고',
          imageUrl: '',
          createdBy: 1,
          createdAt: '2024-01-02',
          inviteUrl: 'https://example.com/invite/2'
        },
        {
          id: 3,
          name: '면접 화상 스터디',
          description: '취뽀가자',
          imageUrl: '',
          createdBy: 1,
          createdAt: '2024-01-03',
          inviteUrl: 'https://example.com/invite/3'
        },
        {
          id: 4,
          name: '대전맛집탐방',
          description: '맛있는 것만 취급합니다',
          imageUrl: '',
          createdBy: 1,
          createdAt: '2024-01-04',
          inviteUrl: 'https://example.com/invite/4'
        }
      ]
      
      setStudies(dummyStudies)
    } catch (error) {
      setStudies([]) // 에러 시에는 빈 배열
    } finally {
      setIsLoading(false)
    }
  }

  // AI 요약본 목록을 가져오는 함수
  const fetchSummaries = async () => {
    try {
      setIsSummaryLoading(true)
      
      // 실제 API 호출 (현재는 주석 처리)
      // const response = await fetch('/api/summaries')
      // const data = await response.json()
      // setSummaries(data)
      
      // 임시로 로딩 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 더미 데이터 설정
      // const dummySummaries = [
      //   {
      //     id: 1,
      //     title: 'Cats and Dogs',
      //     description: 'Fine-grained categorization of pet breeds (37 breeds of cats and dogs).',
      //     createdAt: '2025-07-24',
      //     pdfUrl: '/pdfs/cats-and-dogs.pdf'
      //   },
      //   {
      //     id: 2,
      //     title: 'I Love Duck',
      //     description: 'Duck Duck Duck',
      //     createdAt: '2025-07-24',
      //     pdfUrl: '/pdfs/i-love-duck.pdf'
      //   },
      //   {
      //     id: 3,
      //     title: '햄버거 마이게다',
      //     description: '햄버거에 대한 상세한 분석과 레시피',
      //     createdAt: '2025-07-23',
      //     pdfUrl: '/pdfs/hamburger.pdf'
      //   }
      // ]
      
      // setSummaries(dummySummaries)
    } catch (error) {
      setSummaries([]) // 에러 시에는 빈 배열
    } finally {
      setIsSummaryLoading(false)
    }
  }

  useEffect(() => {
    fetchStudies()
    fetchSummaries()
  }, [])

  const handleItemClick = (itemId: string) => {

    // AI 요약본 클릭 시 새 탭에서 AI 요약본 페이지 열기
    if (itemId === 'ai-summary') {
      window.open('/ai-summary', '_blank')
    }
    
  }

  const handleLogout = () => {
    // TODO: 로그아웃 로직 구현
  }

  const handleCreateStudy = () => {
    // 스터디 생성 페이지로 이동
    // navigate('/create-study')
  }

  const handleStudyClick = (studyId: number) => {
    // 스터디 상세 페이지로 이동
   // navigate(`/study/${studyId}`)
  }

  const handleSummaryClick = (summaryId: number) => {
    // AI 요약본 상세 페이지로 이동
    // navigate(`/ai-summary/${summaryId}`)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar
        activeItem="mypage"
        onItemClick={handleItemClick}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col">
        <TopBar userName="user"/>
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* 왼쪽 열 - 스터디 목록과 AI 요약본 */}
            <div className="lg:col-span-2 space-y-6">
              <StudyList
                studies={studies}
                isLoading={isLoading}
                onCreateStudy={handleCreateStudy}
                onStudyClick={handleStudyClick}
              />
              <AISummaryList
                summaries={summaries}
                isLoading={isSummaryLoading}
                onSummaryClick={handleSummaryClick}
              />
            </div>
            
            {/* 오른쪽 열 - 달력 및 예정된 이벤트 (추후 구현) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">달력</h2>
                <p className="text-gray-500">달력 및 예정된 이벤트가 여기에 표시됩니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
