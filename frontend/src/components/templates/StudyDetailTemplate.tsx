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
  selectedCategories: string[]
  contents: ContentItem[]
  searchTerm: string
  sortOrder: 'newest' | 'oldest'
  // Upload Modal 관련 props
  isUploadModalOpen: boolean
  onItemClick: (itemId: string) => void
  onStudyClick: (studyId: string) => void
  onSearch: () => void
  onUploadData: () => void
  onCreateRoom: () => void
  onEditNotice: () => void
  onSettingsClick: () => void
  // Content Management 관련 핸들러들
  onCategoryToggle: (categoryId: string) => void
  onAddCategory: () => void
  onSearchChange: (term: string) => void
  onSortChange: (order: 'newest' | 'oldest') => void
  onContentSelect: (contentId: string) => void
  onContentPreview: (contentId: string) => void
  // Upload Modal 관련 핸들러들
  onUploadModalClose: () => void
  onUploadSubmit: (data: UploadData) => void
  // Study Management 관련 핸들러들
  onStudyNameChange?: (name: string) => void
  onStudyDescriptionChange?: (description: string) => void
  onStudyImageChange?: (image: File | null) => void
  onMaxMembersChange?: (maxMembers: number) => void
  onCategoryRemove?: (category: string) => void
  onCategoryAdd?: (category: string) => void
  onMemberRemove?: (memberId: string) => void
  onMemberRoleChange?: (userId: number, newRole: 'ADMIN' | 'DELEGATE' | 'MEMBER', userEmail: string) => void
  joinRequests?: Array<{
    userID: number
    userEmail: string
    name: string
    imageUrl: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
  }>
  onAcceptJoinRequest?: (userId: number, role: string) => void
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
  onItemClick,
  onStudyClick,
  onSearch,
  onUploadData,
  onCreateRoom,
  onEditNotice,
  onSettingsClick,
  // Content Management 관련 핸들러들
  onCategoryToggle,
  onAddCategory,
  onSearchChange,
  onSortChange,
  onContentSelect,
  onContentPreview,
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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar
        activeItem="study"
        expandedStudy={expandedStudy}
        studies={studies}
        activeStudyId={activeStudyId}
        onItemClick={onItemClick}
        onStudyClick={onStudyClick}
      />

      <div className="ml-64 flex flex-col">
        {/* 상단 헤더 */}
        <StudyHeader
          studyName={currentStudy?.name}
          studyDescription={currentStudy?.description}
          studyImageUrl={currentStudy?.image}
          loading={loading}
          userCount={studyParticipants?.length || 0}
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
                />
              </div>
              <div className="flex-1">
                <StudyVideoConference
                  onCreateRoom={onCreateRoom}
                  participants={participants} // 화상채팅은 별도 참여자 목록 사용
                />
              </div>
            </div>

            {/* 오른쪽: 캘린더 (4/10) */}
            <div className="col-span-4">
              <StudyCalendar />
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
            onUploadData={onUploadData}
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
        joinRequests={joinRequests}
        onAcceptJoinRequest={onAcceptJoinRequest}
        onRejectJoinRequest={onRejectJoinRequest}
        onMemberRoleChange={onMemberRoleChange}
      />

      {/* Study Management Modal */}
      <StudyManagementModal
        isOpen={isManagementModalOpen}
        onClose={handleCloseManagementModal}
        studyName={currentStudy?.name || ''}
        studyDescription={currentStudy?.description || ''}
        studyImage={currentStudy?.image}
        maxMembers={currentStudy?.memberCount || 10}
        members={studyParticipants || []}
        categories={categories.map(c => c.name)}
        onStudyNameChange={onStudyNameChange || (() => {})}
        onStudyDescriptionChange={onStudyDescriptionChange || (() => {})}
        onStudyImageChange={onStudyImageChange || (() => {})}
        onMaxMembersChange={onMaxMembersChange || (() => {})}
        onCategoryRemove={onCategoryRemove || (() => {})}
        onCategoryAdd={onCategoryAdd || (() => {})}
        onMemberRemove={onMemberRemove || (() => {})}
        onSave={() => {
          handleCloseManagementModal()
        }}
      />
    </div>
  )
}

export default StudyDetailTemplate
