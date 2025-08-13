import React, { useState, useEffect } from 'react'
import AISummaryTemplate from '../components/templates/AISummaryTemplate'
import SummaryViewer from '../components/atoms/SummaryViewer'
import PDFViewer from '../components/atoms/PDFViewer'
import SplitResizer from '../components/atoms/SplitResizer'
import ProfileSettingsModal from '../components/organisms/ProfileSettingsModal'
import ChangePasswordModal from '../components/organisms/ChangePasswordModal'
import ProfileSettingsModal from '../components/organisms/ProfileSettingsModal'
import ChangePasswordModal from '../components/organisms/ChangePasswordModal'
import { fetchSummaryList, type StudyWithSummaries } from '../services/summaryService'
import { dummySummaryData } from '../types/summary'
import type { ProfileData } from '../components/organisms/ProfileSettingsModal/types'
// import type { ChangePasswordData } from '../components/organisms/ChangePasswordModal/types'
import { useAppStore } from '../store/appStore'
import { useNavigate } from 'react-router-dom'

const AISummaryPage: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('')
  const [expandedStudies, setExpandedStudies] = useState<string[]>([])
  const [showOriginal, setShowOriginal] = useState(false)
  const [leftPanelWidth, setLeftPanelWidth] = useState(500)
  const [studiesWithSummaries, setStudiesWithSummaries] = useState<StudyWithSummaries[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    nickname: '안덕현',
    email: 'dksejrqus2@gmail.com',
    profileImage: ''
  })

  const clearAuth = useAppStore((state) => state.auth.clearAuth)
  const navigate = useNavigate()
  // const [error, setError] = useState<string | null>(null)

  // AI 요약본 목록 조회
  const fetchSummaries = async () => {
    try {
      setIsLoading(true)
      // setError(null)


      // 실제 API 호출
      const userId = localStorage.getItem('userId') || '1' // 실제로는 로그인된 유저 ID를 사용
      const response = await fetchSummaryList(userId)
      setStudiesWithSummaries(response.studies || [])
    } catch {
    } catch {
      // setError('AI 요약본 목록을 불러오는데 실패했습니다.')


      // 에러 시 더미 데이터 사용 (개발용)
      const dummyStudiesWithSummaries: StudyWithSummaries[] = [
        {
          study_id: 'ssafy-algorithm',
          study_name: '싸피 알고리즘',
          study_image_url: '/src/assets/MoAI/thinking.png',
          summaries: [
            {
              summary_id: 'cats-dogs',
              title: 'Cats and Dogs',
              description: 'Fine-grained categorization of pet breeds (37 breeds of cats and dogs).',
              model_type: 'Gemini',
              prompt_type: '요약'
            },
            {
              summary_id: 'i-love-duck',
              title: 'I Love Duck',
              description: 'Duck Duck Duck',
              model_type: 'Gemini',
              prompt_type: '요약'
            }
          ]
        },
        {
          study_id: 'daejeon-restaurants',
          study_name: '대전 맛집 탐방',
          study_image_url: '/src/assets/MoAI/traveling.png',
          summaries: [
            {
              summary_id: 'hamburger',
              title: '햄버거 맛있겠다',
              description: '햄버거에 대한 상세한 분석과 레시피',
              model_type: 'Gemini',
              prompt_type: '요약'
            }
          ]
        }
      ]
      setStudiesWithSummaries(dummyStudiesWithSummaries)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSummaries()
  }, [])

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId)
    setShowOriginal(false) // 새로운 요약본 선택 시 원본 숨김
  }

  const handleStudyToggle = (studyId: string) => {
    setExpandedStudies(prev =>
      prev.includes(studyId)
        ? prev.filter(id => id !== studyId)
        : [...prev, studyId]
    )
  }

  const handleViewOriginal = () => {
    setShowOriginal(true)
  }

  const handleResize = (width: number) => {
    setLeftPanelWidth(width)
  }

  const handleSettingsClick = () => {
    setIsProfileModalOpen(true)
  }

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  const handleUpdateProfile = (data: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...data }))
  }

  const handleOpenChangePasswordModal = () => {
    setIsChangePasswordModalOpen(true)
  }

  const handleChangePasswordSubmit = () => {
    // TODO: API 호출로 비밀번호 변경
    // data.currentPassword, data.newPassword, data.confirmPassword 사용
    alert('비밀번호가 성공적으로 변경되었습니다.')
  }

  const handleWithdrawMembership = () => {
    if (confirm('정말로 회원탈퇴를 하시겠습니까?')) {
      // 회원탈퇴 처리
    }
  }

  // 선택된 요약본 데이터
  const selectedSummary = activeItem ? dummySummaryData[activeItem] : null

  // 요약본이 선택되지 않았을 때 표시할 UI
  const renderEmptyState = () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="mb-6">
          <img
            src="/src/assets/MoAI/file.png"
            alt="File Icon"
            className="w-72 h-72 mx-auto mb-4"
          />
          <p className="text-gray-600 text-xl">파일을 선택해주세요...</p>
        </div>
      </div>
    </div>
  )

  // 요약본이 선택되었을 때 표시할 UI
  const renderSummaryContent = () => {
    if (!selectedSummary) {
      return (
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">선택된 요약본: {activeItem}</h2>
          <p className="text-gray-600">요약본을 찾을 수 없습니다.</p>
        </div>
      )
    }

    // 원본 PDF가 표시되는 경우 분할 레이아웃
    if (showOriginal && selectedSummary.originalPdfPath) {
      return (
        <div className="flex h-full">
          {/* 왼쪽 패널 - 요약본 */}
          <div
            className="bg-white border-r border-gray-200"
            style={{ width: `${leftPanelWidth}px` }}
          >
            <SummaryViewer
              summaryData={selectedSummary}
              onViewOriginal={handleViewOriginal}
            />
          </div>

          {/* 리사이저 */}
          <SplitResizer
            onResize={handleResize}
            minLeftWidth={300}
            maxLeftWidth={800}
          />

          {/* 오른쪽 패널 - 원본 PDF */}
          <div className="flex-1">
            <PDFViewer
              pdfUrl={selectedSummary.originalPdfPath}
              title={selectedSummary.title}
              onLoad={() => { }}
              onError={() => { }}
            />
          </div>
        </div>
      )
    }

    // 요약본만 표시되는 경우
    return (
      <div className="h-full">
        <SummaryViewer
          summaryData={selectedSummary}
          onViewOriginal={handleViewOriginal}
        />
      </div>
    )
  }

  return (
    <AISummaryTemplate
      activeItem={activeItem}
      expandedStudies={expandedStudies}
      studiesWithSummaries={studiesWithSummaries}
      isLoading={isLoading}
      onItemClick={handleItemClick}
      onStudyToggle={handleStudyToggle}
      onSettingsClick={handleSettingsClick}
      onLogout={handleLogout}
    >
      {activeItem ? renderSummaryContent() : renderEmptyState()}

      {/* 프로필 설정 모달 */}
      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profileData={profileData}
        onUpdateProfile={handleUpdateProfile}
        onChangePassword={handleOpenChangePasswordModal}
        onWithdrawMembership={handleWithdrawMembership}
        onOpenChangePasswordModal={handleOpenChangePasswordModal}
      />

      {/* 비밀번호 변경 모달 */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSubmit={handleChangePasswordSubmit}
      />
    </AISummaryTemplate>
  )
}

export default AISummaryPage
