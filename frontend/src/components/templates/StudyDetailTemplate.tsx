import React, { useState } from 'react'
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
  hashId?: string
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
  studyParticipants,
  userName,
  currentUserRole,
  // 공지사항 관련 props
  noticeTitle = '공지사항',
  noticeContent = '공지사항이 없습니다.',
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
  hashId,
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
  joinRequests = [],
  onAcceptJoinRequest,
  onRejectJoinRequest,
}) => {
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
                  onCreateRoom={onCreateRoom}
                  participants={participants}
                  currentUserRole={currentUserRole}
                  hashId={hashId}
                />
              </div>
            </div>

            {/* 오른쪽: 일정 (4/10) */}
            <div className="col-span-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-fit">
                {/* <div className="flex items-center mb-6">
                  <div className="w-2 h-8 rounded-full mr-3" style={{ backgroundColor: '#F8BB50' }}></div>
                  <h2 className="text-2xl font-bold text-gray-900">일정</h2>
                </div> */}
                <StudyCalendar
                  schedules={studySchedules || []}
                  isLoading={isSchedulesLoading}
                  studyId={studyId}
                  currentUserRole={currentUserRole}
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
