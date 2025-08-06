import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardSidebar from '../components/organisms/DashboardSidebar'
import TopBar from '../components/molecules/TopBar'
import StudyList from '../components/organisms/StudyList'
import AISummaryList from '../components/organisms/AISummaryList'
import type { Study } from '../components/organisms/StudyList/types'
import type { AISummary } from '../components/molecules/AISummaryCard/types'
import type { CreateStudyData } from '../components/organisms/CreateStudyModal/types'
import InviteLinkModal from '../components/organisms/InviteLinkModal'
import { fetchSummaryList, type SummaryItem } from '../services/summaryService'
import { getStudies } from '../services/studyService'

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const [studies, setStudies] = useState<Study[]>([])
  const [summaries, setSummaries] = useState<AISummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSummaryLoading, setIsSummaryLoading] = useState(true)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [currentInviteUrl, setCurrentInviteUrl] = useState('')

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
      
      // 실제 API 호출
      const userId = localStorage.getItem('userId') || '1' // 실제로는 로그인된 유저 ID를 사용
      const response = await fetchSummaryList(userId)
      
      // API 응답을 기존 AISummary 타입에 맞게 변환
      const convertedSummaries: AISummary[] = response.summaries.map(summary => ({
        id: parseInt(summary.summary_id) || Date.now(), // summary_id를 숫자로 변환
        title: summary.title,
        description: summary.description,
        createdAt: new Date().toISOString().split('T')[0], // 임시 날짜
        pdfUrl: `/pdfs/${summary.summary_id}.pdf` // 임시 PDF 경로
      }))
      
      setSummaries(convertedSummaries)
    } catch (error) {
      console.error('AI 요약본 목록 조회 실패:', error)
      
      // 에러 시 더미 데이터 사용 (개발용)
      const dummySummaries: AISummary[] = [
        {
          id: 1,
          title: 'Cats and Dogs',
          description: 'Fine-grained categorization of pet breeds (37 breeds of cats and dogs).',
          createdAt: '2025-07-24',
          pdfUrl: '/pdfs/cats-and-dogs.pdf'
        },
        {
          id: 2,
          title: 'I Love Duck',
          description: 'Duck Duck Duck',
          createdAt: '2025-07-24',
          pdfUrl: '/pdfs/i-love-duck.pdf'
        },
        {
          id: 3,
          title: '햄버거 마이게다',
          description: '햄버거에 대한 상세한 분석과 레시피',
          createdAt: '2025-07-23',
          pdfUrl: '/pdfs/hamburger.pdf'
        }
      ]
      
      setSummaries(dummySummaries)
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

    // Study 클릭 시 Study 상세페이지로 이동 (기본 스터디)
    if (itemId === 'study') {
      navigate('/study/study-1')
    }
  }

  const handleLogout = () => {
    // TODO: 로그아웃 로직 구현
  }

  const handleCreateStudy = async (data: CreateStudyData) => {
    try {
      // 스터디 생성 로직
      console.log('새 스터디 생성:', data)
      
      // API 스펙에 맞는 Request Body 구성
      const requestBody = {
        id: 1, // 실제로는 현재 로그인한 유저의 ID를 사용해야 함
        name: data.name,
        description: data.description,
        image_url: data.image ? await convertImageToBase64(data.image) : null
      }
      
      // 실제 API 호출 (현재는 주석 처리)
      // const response = await fetch('/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${accessToken}` // 실제 access token 사용
      //   },
      //   body: JSON.stringify(requestBody)
      // })
      
      // if (response.status === 201) {
      //   const responseData = await response.json()
      //   const newStudy: Study = {
      //     id: responseData.study_id,
      //     name: responseData.name,
      //     description: responseData.description,
      //     imageUrl: responseData.image_url || '',
      //     createdBy: responseData.created_by,
      //     createdAt: responseData.created_at,
      //     inviteUrl: responseData.invite_url || `https://duckfac.com/B201-nice-team`
      //   }
      //   setStudies(prevStudies => [newStudy, ...prevStudies])
      //   
      //   // 초대 링크 모달 표시
      //   setCurrentInviteUrl(newStudy.inviteUrl)
      //   setIsInviteModalOpen(true)
      // } else {
      //   throw new Error('스터디 생성에 실패했습니다.')
      // }
      
      // 임시로 프론트엔드에서 즉시 스터디 목록에 추가
      const newStudy: Study = {
        id: Date.now(), // 임시 ID 생성
        name: data.name,
        description: data.description,
        imageUrl: data.image ? URL.createObjectURL(data.image) : '',
        createdBy: 1, // 임시 사용자 ID
        createdAt: new Date().toISOString().split('T')[0],
        inviteUrl: `https://duckfac.com/B201-nice-team` // 임시 초대 링크
      }
      
      setStudies(prevStudies => [newStudy, ...prevStudies])
      
      // 초대 링크 모달 표시
      setCurrentInviteUrl(newStudy.inviteUrl || '')
      setIsInviteModalOpen(true)
    } catch (error) {
      console.error('스터디 생성 오류:', error)
      alert('스터디 생성에 실패했습니다.')
    }
  }

  // 이미지를 Base64로 변환하는 헬퍼 함수
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        // Base64 문자열에서 data:image/...;base64, 부분 제거
        const base64 = result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
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

      {/* 초대 링크 모달 */}
      <InviteLinkModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        inviteUrl={currentInviteUrl}
      />
    </div>
  )
}

export default DashboardPage
