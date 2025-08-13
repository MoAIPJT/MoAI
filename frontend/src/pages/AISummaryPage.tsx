import React, { useState, useEffect } from 'react'
import AISummaryTemplate from '../components/templates/AISummaryTemplate'
import AITestViewer from '../components/organisms/AITestViewer'
import ProfileSettingsModal from '../components/organisms/ProfileSettingsModal'
import ChangePasswordModal from '../components/organisms/ChangePasswordModal'
import { fetchSummaryList, fetchSummaryDetail, type StudyWithSummaries } from '../services/summaryService'
import { editAiSummary, deleteAiSummary } from '../services/aiSummaryService'
import type { ProfileData } from '../components/organisms/ProfileSettingsModal/types'
import { useAppStore } from '../store/appStore'
import { useNavigate } from 'react-router-dom'

// 타입 정의 (AITestViewer에서 사용)
interface PDFItem {
  id: string
  url: string
  title?: string
}

interface SummaryItem {
  docsId: number
  pageNumber: number
  originalQuote: string
  summarySentence: string
}



const AISummaryPage: React.FC = () => {
  // 사이드바 관련 state들
  const [activeItem, setActiveItem] = useState<string>('')
  const [expandedStudies, setExpandedStudies] = useState<string[]>([])
  const [studiesWithSummaries, setStudiesWithSummaries] = useState<StudyWithSummaries[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 모달 관련 state들
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)
  const [isEditSummaryModalOpen, setIsEditSummaryModalOpen] = useState(false)
  const [editingSummary, setEditingSummary] = useState<{
    id: string;
    title: string;
    description: string;
  } | null>(null)
  const [profileData, setProfileData] = useState<ProfileData>({
    nickname: '안덕현',
    email: 'dksejrqus2@gmail.com',
    profileImage: ''
  })

  // AITestViewer 관련 state들
  const [pdfList, setPdfList] = useState<PDFItem[]>([])
  const [selectedPdf, setSelectedPdf] = useState<PDFItem | null>(null)
  const [summaryList, setSummaryList] = useState<SummaryItem[]>([])

  const clearAuth = useAppStore((state) => state.auth.clearAuth)
  const navigate = useNavigate()

  // AI 요약본 목록 조회
  const fetchSummaries = async () => {
    try {
      setIsLoading(true)
      const userId = localStorage.getItem('userId') || '1'
      const response = await fetchSummaryList(userId)
      console.log('API 응답:', response)

      const studies = response.studies || []
      console.log('Studies 데이터:', studies)

      if (studies.length > 0) {
        setStudiesWithSummaries(studies)
        // 첫 번째 study를 자동으로 확장
        setExpandedStudies([studies[0].studyId])
        // 첫 번째 요약본을 자동으로 선택
        if (studies[0].summaries.length > 0) {
          setActiveItem(studies[0].summaries[0].summaryId)
        }
      } else {
        // API 응답이 없으면 빈 배열로 설정
        setStudiesWithSummaries([])
        setExpandedStudies([])
        setActiveItem('')
      }
    } catch (error) {
      console.error('AI 요약본 목록을 불러오는데 실패했습니다:', error)
      // 에러 시에도 빈 상태로 설정
      setStudiesWithSummaries([])
      setExpandedStudies([])
      setActiveItem('')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // 기존 요약본 목록 조회
    fetchSummaries()

    // 초기 상태 설정 - 빈 배열로 시작
    setPdfList([])
    setSelectedPdf(null)
    setSummaryList([])
  }, [])

    // 요약본 상세 정보 가져오기 (사이드바 클릭 시)
  const fetchSummaryDetailData = async (summaryId: string) => {
    console.log('요약본 선택:', summaryId)

    try {
      const detailResponse = await fetchSummaryDetail(summaryId)
      console.log('요약본 상세 응답:', detailResponse)

      // summaryJson 데이터 처리 (이미 파싱된 객체)
      if (detailResponse?.summaryJson) {
        console.log('받은 요약 데이터:', detailResponse.summaryJson)

        // summaryJson이 배열인 경우 직접 사용
        if (Array.isArray(detailResponse.summaryJson)) {
          const convertedData: SummaryItem[] = detailResponse.summaryJson.map((item: {
            docsId: number;
            pageNumber: number;
            originalQuote: string;
            summarySentence: string;
          }) => ({
            docsId: item.docsId,
            pageNumber: item.pageNumber,
            originalQuote: item.originalQuote,
            summarySentence: item.summarySentence
          }))
          setSummaryList(convertedData)
          console.log('변환된 요약 데이터:', convertedData)
        }
      }

      // 연결된 문서들을 PDF 목록에 업데이트
      if (detailResponse?.docses && detailResponse.docses.length > 0) {
        const newPdfs: PDFItem[] = detailResponse.docses.map((doc: {
          docsId: number;
          url: string;
        }) => ({
          id: `doc${doc.docsId}`,
          url: doc.url,
          title: `문서 ${doc.docsId}`
        }))

        setPdfList(newPdfs)
        if (newPdfs.length > 0) {
          setSelectedPdf(newPdfs[0])
        }
      }
    } catch (error) {
      console.error('요약본 상세 정보를 가져오는데 실패했습니다:', error)
      // 에러 발생 시 기본 데이터 유지
      console.log('기본 데이터를 유지합니다.')
    }
  }

  // 사이드바 아이템 클릭 핸들러
  const handleItemClick = async (itemId: string) => {
    console.log('요약본 클릭:', itemId)
    setActiveItem(itemId)

    // 요약본 상세 정보 가져오기
    await fetchSummaryDetailData(itemId)
  }

  const handleStudyToggle = (studyId: string) => {
    setExpandedStudies(prev =>
      prev.includes(studyId)
        ? prev.filter(id => id !== studyId)
        : [...prev, studyId]
    )
  }

  // AITestViewer 핸들러들
  const handlePdfChange = (pdf: PDFItem) => {
    setSelectedPdf(pdf)
  }

  const handleSummaryClick = (item: SummaryItem) => {
    console.log('요약 클릭:', item)
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
    alert('비밀번호가 성공적으로 변경되었습니다.')
  }

  const handleWithdrawMembership = () => {
    if (confirm('정말로 회원탈퇴를 하시겠습니까?')) {
      // 회원탈퇴 처리
    }
  }

  // 요약본 수정 관련 함수들
  const handleEditSummary = (summary: { summaryId: string; title: string; description: string }) => {
    console.log('수정할 요약본 데이터:', summary)
    setEditingSummary({
      id: summary.summaryId,
      title: summary.title,
      description: summary.description || ''
    })
    setIsEditSummaryModalOpen(true)
  }

  const handleEditSummaryChange = (field: 'title' | 'description', value: string) => {
    if (editingSummary) {
      setEditingSummary({
        ...editingSummary,
        [field]: value
      })
    }
  }

  const handleEditSummarySubmit = async (data: { title: string; description: string }) => {
    if (!editingSummary) return

    try {
      console.log('수정 요청 데이터:', {
        title: data.title,
        description: data.description
      })

      await editAiSummary(parseInt(editingSummary.id), {
        title: data.title,
        description: data.description
      })

      alert('요약본이 성공적으로 수정되었습니다.')
      setIsEditSummaryModalOpen(false)
      setEditingSummary(null)

      // 요약본 목록 새로고침
      fetchSummaries()
    } catch (error) {
      console.error('요약본 수정 실패:', error)
      alert('요약본 수정에 실패했습니다.')
    }
  }

  const handleEditSummaryCancel = () => {
    setIsEditSummaryModalOpen(false)
    setEditingSummary(null)
  }

  // 요약본 삭제 관련 함수들
  const handleDeleteSummary = async (summaryId: string) => {
    if (confirm('정말로 이 요약본을 삭제하시겠습니까?')) {
      try {
        await deleteAiSummary(parseInt(summaryId))
        alert('요약본이 성공적으로 삭제되었습니다.')

        // 요약본 목록 새로고침
        fetchSummaries()

        // 삭제된 요약본이 현재 선택된 요약본이었다면 선택 해제
        if (activeItem === summaryId) {
          setActiveItem('')
        }
      } catch (error) {
        console.error('요약본 삭제 실패:', error)
        alert('요약본 삭제에 실패했습니다.')
      }
    }
  }

  // 메인 컨텐츠 렌더링
  const renderMainContent = () => {
    if (!activeItem) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="mb-6">
              <img
                src="/src/assets/MoAI/file.png"
                alt="File Icon"
                className="w-72 h-72 mx-auto mb-4"
              />
              <p className="text-gray-600 text-xl">요약본을 선택해주세요...</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <AITestViewer
        pdfList={pdfList}
        summaryList={summaryList}
        selectedPdf={selectedPdf}
        onPdfChange={handlePdfChange}
        onSummaryClick={handleSummaryClick}
      />
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
      onEditSummary={handleEditSummary}
      onDeleteSummary={handleDeleteSummary}
    >
      {renderMainContent()}

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

      {/* 요약본 수정 모달 */}
      {isEditSummaryModalOpen && editingSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md">
            <h2 className="text-xl font-bold mb-4">요약본 수정</h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              handleEditSummarySubmit({
                title: formData.get('title') as string,
                description: formData.get('description') as string
              })
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목
                </label>
                <input
                  type="text"
                  name="title"
                  value={editingSummary.title}
                  onChange={(e) => handleEditSummaryChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설명
                </label>
                <textarea
                  name="description"
                  value={editingSummary.description}
                  onChange={(e) => handleEditSummaryChange('description', e.target.value)}
                  placeholder="설명이 없습니다. 여기에 설명을 입력하세요."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleEditSummaryCancel}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  수정
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AISummaryTemplate>
  )
}

export default AISummaryPage
