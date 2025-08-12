import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import StudyDetailTemplate from '../components/templates/StudyDetailTemplate'
import CategoryAddModal from '../components/organisms/CategoryAddModal'
import type { StudyItem } from '../components/organisms/DashboardSidebar/types'
import type { Category, ContentItem } from '../types/content'
import type { UploadData } from '../components/organisms/UploadDataModal/types'
import { getSidebarStudies, updateStudyNotice, joinStudy } from '../services/studyService'
import { useStudyDetail, useStudyMembers, useJoinRequests, useAcceptJoinRequest, useRejectJoinRequest  } from '../hooks/useStudies'
import { useQueryClient } from '@tanstack/react-query'
import type { Member } from '../types/study'

const StudyDetailPage: React.FC = () => {
  const navigate = useNavigate()
  const { hashId } = useParams<{ hashId: string }>()
  const queryClient = useQueryClient()

  const [expandedStudy, setExpandedStudy] = useState(true)
  const [activeStudyId, setActiveStudyId] = useState<string | null>(hashId || null)
  const [studies, setStudies] = useState<StudyItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ✅ React Query 훅 사용 - studyDetail만 필요
  const {
    data: studyDetail,
    isLoading: isStudyLoading,
    error: studyError
  } = useStudyDetail(activeStudyId || '')

  // ✅ 멤버 정보는 필요할 때만 로드 (예: 멤버 관리 모달)
  const {
    data: participants = [],
    error: membersError
  } = useStudyMembers(studyDetail?.studyId)

  const {
  data: joinRequests = []
} = useJoinRequests(studyDetail?.studyId || 0)

  // Mutation 훅들
  const acceptJoinRequestMutation = useAcceptJoinRequest(studyDetail?.studyId || 0)
  const rejectJoinRequestMutation = useRejectJoinRequest(studyDetail?.studyId || 0)
  // Content Management 관련 상태
  const [categories, setCategories] = useState<Category[]>([])
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  // Upload Modal 관련 상태
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const [contents, setContents] = useState<ContentItem[]>([])

  // 공지사항 관련 상태
  const [notice, setNotice] = useState<string>('')
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false)
  const [noticeTitle, setNoticeTitle] = useState<string>('공지사항')
  const [noticeContent, setNoticeContent] = useState<string>('공지사항이 없습니다.')

  // 스터디 목록 로드
  useEffect(() => {
    const loadStudies = async () => {
      try {
        setError(null)
        const studiesData = await getSidebarStudies()
        // StudyListItem을 StudyItem으로 변환
        const convertedStudies: StudyItem[] = studiesData.map(study => ({
          id: study.hashId,               // ← hashId로!
          name: study.name,
          description: study.description,
          image: study.imageUrl,
          memberCount: 0 // 기본값 설정
        }))
        setStudies(convertedStudies)
      } catch {
        setError('스터디 목록을 불러오는데 실패했습니다.')
        setStudies([]) // 에러 시 빈 배열로 설정
      }
    }
    loadStudies()
  }, [])

  // ✅ useMemo를 사용한 더 간단한 방법 - userCount 직접 사용
  const currentStudy = useMemo(() => {
    if (!studyDetail || !activeStudyId) return null

    return {
      id: activeStudyId,
      name: studyDetail.name,
      description: studyDetail.description || '',
      image: studyDetail.imageUrl,
      memberCount: studyDetail.userCount || 0  // ✅ userCount 직접 사용
    }
  }, [studyDetail, activeStudyId])  // ✅ participants 의존성 제거

  // ✅ 로딩 상태만 별도로 관리 - 더 간단해짐
  useEffect(() => {
    if (studyDetail) {
      console.log('Study detail loaded:', studyDetail)
      setLoading(false)
    }
  }, [studyDetail])  // ✅ participants 의존성 제거

  // ✅ 에러 처리
  useEffect(() => {
    if (studyError) {
      console.error('Study detail error:', studyError)
      setError('스터디 정보를 불러오는데 실패했습니다.')
      setLoading(false)
    }
    if (membersError) {
      console.error('Members error:', membersError)
      // 멤버 로드 실패는 전체 에러로 처리하지 않음
    }
  }, [studyError, membersError])

  // ✅ 로딩 상태 관리 - studyDetail만 체크
  useEffect(() => {
    setLoading(isStudyLoading)
  }, [isStudyLoading])  // ✅ isMembersLoading 제거

  // 선택된 카테고리와 검색어에 따라 콘텐츠 필터링
  const filteredContents = contents.filter(content => {
    // 카테고리 필터링 (AND 조건)
    const categoryFilter = selectedCategories.length === 0 ||
      selectedCategories.every(categoryId => {
        const category = categories.find(c => c.id === categoryId)
        return category && content.tags.some(tag => tag.includes(category.name))
      })

    // 검색어 필터링
    const searchFilter = !searchTerm.trim() ||
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    return categoryFilter && searchFilter
  })



  const handleItemClick = (itemId: string) => {
    // 스터디 클릭 시 토글
    if (itemId === 'study') {
      setExpandedStudy(!expandedStudy)
    }

    // AI 요약본 클릭 시 새 탭에서 AI 요약본 페이지 열기
    if (itemId === 'ai-summary') {
      window.open('/ai-summary', '_blank')
    }

    // 마이페이지 클릭 시 새 탭에서 대시보드 열기
    if (itemId === 'mypage') {
      window.open('/dashboard', '_blank')
    }
  }

  const handleStudyClick = (studyId: string) => {
    // 현재 페이지의 스터디와 다른 스터디를 클릭한 경우에만 페이지 이동
    if (activeStudyId !== studyId) {
      setActiveStudyId(studyId)
      setLoading(true) // 로딩 상태 활성화

      // currentStudy는 이제 useMemo로 계산되므로 별도 처리 불필요

      // 선택된 스터디로 페이지 이동
      navigate(`/study/${studyId}`)
    }
  }

  const handleSearch = () => {
  }

  const handleUploadData = () => {
    setIsUploadModalOpen(true)
  }

  const handleCreateRoom = () => {
  }

  const handleEditNotice = () => {
    setIsNoticeModalOpen(true)
    setNoticeTitle('공지사항')
    setNoticeContent(notice)
  }

  const handleNoticeSubmit = async () => {
    if (!currentStudy || !noticeContent.trim() || !studyDetail?.studyId) return

    try {
      // 공지사항 업데이트 API 호출
      await updateStudyNotice({
        studyId: studyDetail.studyId,
        notice: noticeContent
      })

      // 로컬 상태 업데이트
      setNotice(noticeContent)
      setIsNoticeModalOpen(false)

      // 성공 메시지 (실제로는 toast 등을 사용)
      console.log('공지사항이 업데이트되었습니다.')
      } catch (error: unknown) {
        console.error('공지사항 업데이트 실패:', error)
      // 에러 메시지 (실제로는 toast 등을 사용)
    }
  }

  const handleNoticeModalClose = () => {
    setIsNoticeModalOpen(false)
  }

  const handleSettingsClick = () => {
  }
  const handleJoinStudy = async () => {
    if (!studyDetail?.studyId || !hashId) return
    try {
      // 가입 요청 API 호출
      await joinStudy({ studyId: studyDetail.studyId })

      // 성공 시 스터디 상세 정보 React Query 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['studyDetail', hashId] })
      queryClient.invalidateQueries({ queryKey: ['joinRequests', studyDetail.studyId] })

      console.log('가입 요청이 전송되었습니다.')
    } catch (error) {
      console.error('가입 요청 실패:', error)
      // 에러 처리
    }
  }

  const handleAcceptJoinRequest = async (userId: number, role: 'ADMIN' | 'DELEGATE' | 'MEMBER' = 'MEMBER') => {
    if (!studyDetail?.studyId) return
    try {
      await acceptJoinRequestMutation.mutateAsync({
        studyId: studyDetail.studyId,
        userId,
        role
      })
      console.log('가입 요청 승인 완료')
    } catch (error) {
      console.error('가입 요청 승인 실패:', error)
    }
  }

  const handleRejectJoinRequest = async (userId: number) => {
    if (!studyDetail?.studyId) return
    try {
      await rejectJoinRequestMutation.mutateAsync({
        studyId: studyDetail.studyId,
        userId
      })
      console.log('가입 요청 거절 완료')
    } catch (error) {
      console.error('가입 요청 거절 실패:', error)
    }
  }
  // 스터디 관리 모달 관련 핸들러들
  const handleStudyNameChange = (name: string) => {
    // currentStudy는 이제 useMemo로 계산되므로 직접 수정 불가
    console.log('Study name change:', name)
  }

  const handleStudyDescriptionChange = (description: string) => {
    // currentStudy는 이제 useMemo로 계산되므로 직접 수정 불가
    console.log('Study description change:', description)
  }

  const handleCategoryRemove = (categoryName: string) => {
    setCategories(prev => prev.filter(cat => cat.name !== categoryName))
  }

  const handleCategoryAdd = (categoryName: string) => {
    const newCategory: Category = {
      id: `category-${Date.now()}`,
      name: categoryName,
      isActive: false,
    }
    setCategories(prev => [...prev, newCategory])
  }

  const handleMemberRemove = (memberName: string) => {
    // ✅ 로컬 상태 업데이트는 하지만, React Query가 자동으로 다시 불러올 것
    console.log('Remove member:', memberName)
  }

  const handleStudyImageChange = (image: File | null) => {
    if (image) {
      // 이미지 업로드 API 호출 (실제 구현 필요)
      console.log('Image upload:', image)
    } else {
      // 이미지 제거 API 호출 (실제 구현 필요)
      console.log('Image remove')
    }
  }

  const handleMaxMembersChange = (maxMembers: number) => {
    // 최대 멤버 수 변경 API 호출 (실제 구현 필요)
    console.log('Max members change:', maxMembers)
  }

  // Content Management 관련 핸들러들
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  const handleAddCategory = () => {
    setShowCategoryModal(true)
  }

  const handleAddNewCategory = (categoryName: string) => {
    const newCategory: Category = {
      id: `category-${Date.now()}`,
      name: categoryName,
      isActive: false,
    }
    setCategories(prev => [...prev, newCategory])
  }

  const handleContentSelect = (contentId: string) => {
    setContents(prevContents =>
      prevContents.map(content =>
        content.id === contentId
          ? { ...content, isSelected: !content.isSelected }
          : content
      )
    )
  }

  const handleContentPreview = () => {
    //contentId: string
  }

  // Upload Modal 관련 핸들러들
  const handleUploadModalClose = () => {
    setIsUploadModalOpen(false)
  }

  const handleUploadSubmit = (data: UploadData) => {
    // 새로운 콘텐츠 아이템 생성
    const newContent: ContentItem = {
      id: `content-${Date.now()}`,
      title: data.title,
      description: data.description,
      tags: data.selectedCategories.map(categoryId => {
        const category = categories.find(c => c.id === categoryId)
        return category?.name || categoryId
      }),
      author: {
        name: 'Current User', // 실제로는 현재 로그인한 사용자 정보
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
      },
      date: new Date().toLocaleDateString('ko-KR', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\. /g, '.').replace(/\.$/, ''),
      isSelected: false,
    }

    // 콘텐츠 목록에 추가 (최신순이므로 맨 앞에 추가)
    setContents(prev => [newContent, ...prev])

    // 모달 닫기
    setIsUploadModalOpen(false)

    // 성공 메시지 표시 (실제로는 toast 등을 사용)
  }

  // 에러가 있으면 에러 메시지 표시
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }


return (
  <>
    {studyDetail?.status === null ? (
      // 가입하지 않은 상태 - 가입하기 버튼
      <div className="flex h-screen">
        {/* 사이드바 */}
        <div className="w-64 bg-white border-r">
          {/* 기존 사이드바 컴포넌트 */}
        </div>

        {/* 메인 콘텐츠 - 가입 요청 화면 */}
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              {currentStudy?.name} 📊
            </h1>
            <p className="text-gray-600 mb-6">스터디에 가입하여 학습을 시작해보세요</p>
            <button
              onClick={handleJoinStudy}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              가입하기
            </button>
          </div>
        </div>
      </div>
    ) : studyDetail?.status === 'PENDING' ? (
      // 가입 요청 대기 중 - 가입 요청 완료
      <div className="flex h-screen">
        {/* 사이드바 */}
        <div className="w-64 bg-white border-r">
          {/* 기존 사이드바 컴포넌트 */}
        </div>

        {/* 메인 콘텐츠 - 가입 요청 대기 화면 */}
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              {currentStudy?.name} 📊
            </h1>
            <p className="text-gray-600 mb-6">가입 요청이 승인 대기 중입니다</p>
            <button
              disabled
              className="px-6 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed"
            >
              가입 요청 완료
            </button>
          </div>
        </div>
      </div>
    ) : (
      <StudyDetailTemplate
        studies={Array.isArray(studies) ? studies : []}
        activeStudyId={activeStudyId}
        expandedStudy={expandedStudy}
        loading={loading}
        currentStudy={currentStudy}
        currentUserRole={studyDetail?.role} // 현재 사용자 역할 전달
        onItemClick={handleItemClick}
        onStudyClick={handleStudyClick}
        onSearch={handleSearch}
        onUploadData={handleUploadData}
        onCreateRoom={handleCreateRoom}
        onEditNotice={handleEditNotice}
        onSettingsClick={handleSettingsClick}
        participants={participants.map((member: Member) => ({
          id: member.email,
          name: member.member,
          avatar: member.imageUrl
        }))}
        studyParticipants={participants}
        // 공지사항 관련 props
        noticeTitle={noticeTitle}
        noticeContent={noticeContent}
        // Content Management 관련 props
        categories={categories}
        selectedCategories={selectedCategories}
        contents={filteredContents}
        searchTerm={searchTerm}
        sortOrder={sortOrder}
        // Upload Modal 관련 props
        isUploadModalOpen={isUploadModalOpen}
        onCategoryToggle={handleCategoryToggle}
        onAddCategory={handleAddCategory}
        onSearchChange={setSearchTerm}
        onSortChange={setSortOrder}
        onContentSelect={handleContentSelect}
        onContentPreview={handleContentPreview}
        // Upload Modal 관련 핸들러들
        onUploadModalClose={handleUploadModalClose}
        onUploadSubmit={handleUploadSubmit}
        // Study Management 관련 핸들러들
        onStudyNameChange={handleStudyNameChange}
        onStudyDescriptionChange={handleStudyDescriptionChange}
        onStudyImageChange={handleStudyImageChange}
        onMaxMembersChange={handleMaxMembersChange}
        onCategoryRemove={handleCategoryRemove}
        onCategoryAdd={handleCategoryAdd}
        onMemberRemove={handleMemberRemove}
        joinRequests={joinRequests}
        onAcceptJoinRequest={handleAcceptJoinRequest}
        onRejectJoinRequest={handleRejectJoinRequest}
      />
    )}

    {/* Category Add Modal */}
    <CategoryAddModal
      isOpen={showCategoryModal}
      onClose={() => setShowCategoryModal(false)}
      onAdd={handleAddNewCategory}
    />

    {/* Notice Edit Modal */}
    {isNoticeModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-md">
          <h3 className="text-lg font-semibold mb-4">공지사항 편집</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="공지사항 제목을 입력하세요"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
            <textarea
              value={noticeContent}
              onChange={(e) => setNoticeContent(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="공지사항 내용을 입력하세요"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleNoticeModalClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={handleNoticeSubmit}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  )}

export default StudyDetailPage
