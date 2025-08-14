import React, { useState, useEffect } from 'react'
import DashboardSidebar from '../organisms/DashboardSidebar'
import StudyHeader from '../molecules/StudyHeader'
import StudyNoticeBox from '../molecules/StudyNoticeBox'
import StudyVideoConference from '../molecules/StudyVideoConference'
import StudyCalendar from '../molecules/StudyCalendar'
import ContentManagementTemplate from './ContentManagementTemplate'
import UploadDataModal from '../organisms/UploadDataModal'
import type { StudyItem } from '../organisms/DashboardSidebar/types'
import type { Category, ContentItem } from '../../types/content'
import type { UploadData } from '../organisms/UploadDataModal/types'
import type { Member } from '../../types/study'
import StudyMembersModal from '../molecules/StudyMembersModal'
import StudyManagementModal from '../molecules/StudyManagementModal'

// 🆕 화상회의 관련 타입 정의
interface VideoSession {
  id: string
  studyGroupHashId: string
  roomName: string
  created: boolean
}

interface JoinSessionResponse {
  roomName: string
  wsUrl: string
  displayName: string
  token: string
}

interface ParticipantsResponse {
  sessionOpen: boolean
  count: number
  participants: Array<{
    name: string
    profileImageUrl: string
  }>
}

interface CloseSessionResponse {
  id: string
  studyGroupHashId: string
  roomName: string
  closed: boolean
  closedAt: string
}

interface StudyDetailTemplateProps {
  studies: StudyItem[]
  activeStudyId: string | null
  expandedStudy: boolean
  loading: boolean
  currentStudy: StudyItem | null
  participants?: Array<{ id: string; name: string; avatar: string }>
  studyParticipants?: Member[]
  userName?: string
  currentUserRole?: string
  // 공지사항 관련 props
  noticeTitle?: string
  noticeContent?: string
  // Content Management 관련 props
  categories: Category[]
  selectedCategories: number[]
  contents: ContentItem[]
  searchTerm: string
  sortOrder: 'newest' | 'oldest'
  // Upload Modal 관련 props
  isUploadModalOpen: boolean
  // 일정 관련 props
  studySchedules?: Array<{
    id: number
    title: string
    startDatetime: string
    endDatetime: string
    memo?: string
  }>
  isSchedulesLoading?: boolean
  // 스터디 ID
  studyId?: number
  // 🆕 화상회의 관련 props - API 연결할 자리
  hasActiveMeeting?: boolean
  onlineParticipants?: Array<{ id: string; name: string; avatar: string; isOnline: boolean }>
  meetingSessionId?: string
  onItemClick: (itemId: string) => void
  onStudyClick: (studyId: string) => void
  onSearch: () => void
  onUploadData: () => void
  onCreateRoom: () => void
  onEditNotice: () => void
  onSettingsClick: () => void
  onLogout?: () => void
  onLogoClick?: () => void
  onLeaveStudy?: () => void
  // Content Management 관련 핸들러들
  onCategoryToggle: (categoryId: number) => void
  onAddCategory: () => void
  onSearchChange: (term: string) => void
  onSortChange: (order: 'newest' | 'oldest') => void
  onContentSelect: (contentId: string) => void
  onContentPreview: (contentId: string) => void
  onContentEdit: (contentId: string) => void
  onContentDelete: (contentId: string) => void
  onContentDownload: (contentId: string) => void
  // Upload Modal 관련 핸들러들
  onUploadModalClose: () => void
  onUploadSubmit: (data: UploadData) => void
  // Study Management 관련 핸들러들
  onStudyNameChange?: (name: string) => void
  onStudyDescriptionChange?: (description: string) => void
  onStudyImageChange?: (image: File | null) => void
  onMaxMembersChange?: (maxMembers: number) => void
  onCategoryRemove?: (categoryId: number) => void
  onCategoryAdd?: (category: string) => void
  onMemberRemove?: (userId: number) => void
  onMemberRoleChange?: (userId: number, newRole: 'ADMIN' | 'DELEGATE' | 'MEMBER') => void
  onStudyUpdate?: (data: {
    name: string
    description: string
    image?: File
    maxCapacity: number
  }) => void
  joinRequests?: Array<{
    userID: number
    userEmail: string
    name: string
    imageUrl: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
  }>
  onAcceptJoinRequest?: (userId: number, role: 'ADMIN' | 'DELEGATE' | 'MEMBER') => void
  onRejectJoinRequest?: (userId: number) => void
}

const StudyDetailTemplate: React.FC<StudyDetailTemplateProps> = ({
  studies,
  activeStudyId,
  expandedStudy,
  loading,
  currentStudy,
  participants = [],
  studyParticipants = [],
  userName = '',
  currentUserRole,
  // 공지사항 관련 props
  noticeTitle,
  noticeContent,
  // Content Management 관련 props
  categories,
  selectedCategories,
  contents,
  searchTerm,
  sortOrder,
  // Upload Modal 관련 props
  isUploadModalOpen,
  // 일정 관련 props
  studySchedules,
  isSchedulesLoading,
  // 스터디 ID
  studyId,
  // 🆕 화상회의 관련 props - API 연결할 자리
  hasActiveMeeting,
  onlineParticipants,
  meetingSessionId,
  onItemClick,
  onStudyClick,
  onSearch,
  onUploadData,
  onCreateRoom,
  onEditNotice,
  onSettingsClick,
  onLogout,
  onLogoClick,
  onLeaveStudy,
  // Content Management 관련 핸들러들
  onCategoryToggle,
  onAddCategory,
  onSearchChange,
  onSortChange,
  onContentSelect,
  onContentPreview,
  onContentEdit,
  onContentDelete,
  onContentDownload,
  // Upload Modal 관련 핸들러들
  onUploadModalClose,
  onUploadSubmit,
  // Study Management 관련 핸들러들
  onStudyNameChange,
  onStudyDescriptionChange,
  onStudyImageChange,
  onMaxMembersChange,
  onCategoryRemove,
  onCategoryAdd,
  onMemberRemove,
  onMemberRoleChange,
  onStudyUpdate,
  joinRequests,
  onAcceptJoinRequest,
  onRejectJoinRequest,
}) => {
  // 🆕 화상회의 관련 상태
  const [videoSession, setVideoSession] = useState<VideoSession | null>(null)
  const [isSessionOpen, setIsSessionOpen] = useState(false)
  const [sessionParticipants, setSessionParticipants] = useState<Array<{ name: string; profileImageUrl: string }>>([])
  const [isLoadingSession, setIsLoadingSession] = useState(false)

  // 🆕 화상회의 API 호출 함수들
  const openVideoSession = async () => {
    if (!activeStudyId || !userName) return

    try {
      setIsLoadingSession(true)
      const response = await fetch('/api/open', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          studyGroupHashId: activeStudyId
        })
      })

      if (!response.ok) throw new Error('세션 생성 실패')

      const sessionData: VideoSession = await response.json()
      setVideoSession(sessionData)
      setIsSessionOpen(true)
      
      // 참가자 목록 새로고침
      await fetchSessionParticipants()
    } catch (error) {
      console.error('화상회의 세션 생성 실패:', error)
    } finally {
      setIsLoadingSession(false)
    }
  }

  const joinVideoSession = async () => {
    if (!videoSession || !userName) return

    try {
      const response = await fetch('/api/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          roomName: videoSession.roomName,
          displayName: userName
        })
      })

      if (!response.ok) throw new Error('세션 참가 실패')

      const joinData: JoinSessionResponse = await response.json()
      
      // VideoConferencePage로 이동하면서 토큰 전달
      const params = new URLSearchParams({
        roomName: joinData.roomName,
        wsUrl: joinData.wsUrl,
        token: joinData.token,
        displayName: joinData.displayName
      })
      
      window.open(`/video-conference/${activeStudyId}?${params.toString()}`, '_blank')
    } catch (error) {
      console.error('화상회의 세션 참가 실패:', error)
    }
  }

  const fetchSessionParticipants = async () => {
    if (!activeStudyId) return

    try {
      const response = await fetch(`/api/participants?studyGroupHashId=${activeStudyId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (!response.ok) throw new Error('참가자 목록 조회 실패')

      const participantsData: ParticipantsResponse = await response.json()
      setIsSessionOpen(participantsData.sessionOpen)
      setSessionParticipants(participantsData.participants)
    } catch (error) {
      console.error('참가자 목록 조회 실패:', error)
    }
  }

  const closeVideoSession = async () => {
    if (!videoSession) return

    try {
      const response = await fetch('/api/close', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          id: videoSession.id,
          studyGroupHashId: videoSession.studyGroupHashId
        })
      })

      if (!response.ok) throw new Error('세션 종료 실패')

      const closeData: CloseSessionResponse = await response.json()
      setVideoSession(null)
      setIsSessionOpen(false)
      setSessionParticipants([])
    } catch (error) {
      console.error('화상회의 세션 종료 실패:', error)
    }
  }

  // 🆕 화상회의 상태 주기적 확인
  useEffect(() => {
    if (activeStudyId) {
      fetchSessionParticipants()
      
      // 30초마다 참가자 목록 새로고침
      const interval = setInterval(fetchSessionParticipants, 30000)
      return () => clearInterval(interval)
    }
  }, [activeStudyId])

  // 🆕 화상회의 방 생성/참가 핸들러
  const handleVideoConference = async () => {
    if (isSessionOpen) {
      // 기존 세션이 있으면 참가
      await joinVideoSession()
    } else {
      // 세션이 없으면 새로 생성
      await openVideoSession()
    }
  }

  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false)
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false)

  const handleOpenMembersModal = () => setIsMembersModalOpen(true)
  const handleCloseMembersModal = () => setIsMembersModalOpen(false)
  const handleOpenManagementModal = () => setIsManagementModalOpen(true)
  const handleCloseManagementModal = () => setIsManagementModalOpen(false)

  // 권한 변경 후 모달 닫기
  const handleMemberRoleChange = (userId: number, newRole: 'ADMIN' | 'DELEGATE' | 'MEMBER') => {
    if (onMemberRoleChange) {
      onMemberRoleChange(userId, newRole)
      // ADMIN으로 변경된 경우 모달 닫기
      if (newRole === 'ADMIN') {
        handleCloseMembersModal()
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar
        activeItem="study"
        expandedStudy={expandedStudy}
        studies={studies}
        activeStudyId={activeStudyId}
        onItemClick={onItemClick}
        onStudyClick={onStudyClick}
        onLogoClick={onLogoClick}
        onLogout={onLogout}
        onSettingsClick={onSettingsClick}
      />

      <div className="ml-64 flex flex-col">
        {/* 상단 헤더 */}
        <StudyHeader
          studyName={currentStudy?.name}
          studyDescription={currentStudy?.description}
          studyImageUrl={currentStudy?.image}
          loading={loading}
          currentUserRole={currentUserRole}
          onSettingsClick={handleOpenManagementModal}
          onUserCountClick={handleOpenMembersModal}
        />

        {/* 메인 콘텐츠 */}
        <div className="flex-1 p-6 space-y-6">
          {/* 상단 섹션: 공지사항/화상회의 (6) + 캘린더 (4) */}
          <div className="grid grid-cols-10 gap-6">
            {/* 왼쪽: 공지사항과 화상회의 (6/10) */}
            <div className="col-span-6 flex flex-col h-full">
              <div className="mb-6">
                <StudyNoticeBox
                  title={noticeTitle}
                  content={noticeContent}
                  onEdit={onEditNotice}
                  userName={userName}
                  studyName={currentStudy?.name}
                  isAdmin={currentUserRole === 'ADMIN'}
                />
              </div>
              <div className="flex-1">
                <StudyVideoConference
                  onCreateRoom={handleVideoConference}
                  participants={sessionParticipants.map(p => ({
                    id: p.name,
                    name: p.name,
                    avatar: p.profileImageUrl || '👤'
                  }))}
                  currentUserRole={currentUserRole}
                  // 🆕 API 연결 완료 - 실제 상태 사용
                  hasActiveMeeting={isSessionOpen}
                  onlineParticipants={sessionParticipants.map(p => ({
                    id: p.name,
                    name: p.name,
                    avatar: p.profileImageUrl || '👤',
                    isOnline: true
                  }))}
                  meetingSessionId={videoSession?.id}
                  // 🆕 추가 props
                  isLoading={isLoadingSession}
                  canManageSession={currentUserRole === 'ADMIN' || currentUserRole === 'DELEGATE'}
                  onCloseSession={closeVideoSession}
                />
              </div>
            </div>

            {/* 오른쪽: 일정 (4/10) */}
            <div className="col-span-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-fit">
                <div className="flex items-center mb-6">
                  <div className="w-2 h-8 rounded-full mr-3" style={{ backgroundColor: '#F8BB50' }}></div>
                  <h2 className="text-2xl font-bold text-gray-900">일정</h2>
                </div>
                <StudyCalendar
                  schedules={studySchedules || []}
                  isLoading={isSchedulesLoading}
                  studyId={studyId}
                />
              </div>
            </div>
          </div>

          {/* Content Management 섹션 */}
          <ContentManagementTemplate
            categories={categories}
            selectedCategories={selectedCategories}
            contents={contents}
            searchTerm={searchTerm}
            sortOrder={sortOrder}
            onCategoryToggle={onCategoryToggle}
            onAddCategory={onAddCategory}
            onSearchChange={onSearchChange}
            onSearch={onSearch}
            onSortChange={onSortChange}
            onContentSelect={onContentSelect}
            onContentPreview={onContentPreview}
            onContentEdit={onContentEdit}
            onContentDelete={onContentDelete}
            onContentDownload={onContentDownload}
            onUploadData={onUploadData}
            currentUserRole={currentUserRole}
          />
        </div>
      </div>

      {/* Upload Data Modal */}
      <UploadDataModal
        isOpen={isUploadModalOpen}
        onClose={onUploadModalClose}
        onUpload={onUploadSubmit}
        categories={categories}
      />

      {/* Members Modal */}
      <StudyMembersModal
        isOpen={isMembersModalOpen}
        onClose={handleCloseMembersModal}
        members={studyParticipants || []}
        studyName={currentStudy?.name || 'Study'}
        currentUserRole={currentUserRole}
        currentUserName={userName}
        hashId={activeStudyId || undefined} // activeStudyId는 hashId입니다
        joinRequests={joinRequests}
        onAcceptJoinRequest={onAcceptJoinRequest}
        onRejectJoinRequest={onRejectJoinRequest}
        onMemberRoleChange={handleMemberRoleChange}
        onLeaveStudy={onLeaveStudy}
      />

      {/* Study Management Modal */}
      {onStudyUpdate && (
        <StudyManagementModal
          isOpen={isManagementModalOpen}
          onClose={handleCloseManagementModal}
          studyName={currentStudy?.name || ''}
          studyDescription={currentStudy?.description || ''}
          studyImage={currentStudy?.image}
          maxMembers={currentStudy?.memberCount || 10}
          members={studyParticipants || []}
          categories={categories}
          currentUserRole={currentUserRole}
          currentUserName={userName}
          onStudyNameChange={onStudyNameChange || (() => {})}
          onStudyDescriptionChange={onStudyDescriptionChange || (() => {})}
          onStudyImageChange={onStudyImageChange || (() => {})}
          onMaxMembersChange={onMaxMembersChange || (() => {})}
          onCategoryRemove={onCategoryRemove || (() => {})}
          onCategoryAdd={onCategoryAdd || (() => {})}
          onMemberRemove={onMemberRemove || (() => {})}
          onStudyUpdate={onStudyUpdate}
          onSave={() => {
            handleCloseManagementModal()
          }}
        />
      )}
    </div>
  )
}

export default StudyDetailTemplate
