import React from 'react'
import DashboardSidebar from '../organisms/DashboardSidebar'
import StudyHeader from '../molecules/StudyHeader'
import StudyFilters from '../molecules/StudyFilters'
import StudyNoticeBox from '../molecules/StudyNoticeBox'
import StudyVideoConference from '../molecules/StudyVideoConference'
import StudyCalendar from '../molecules/StudyCalendar'
import StudySearch from '../molecules/StudySearch'
import UploadButton from '../atoms/UploadButton'
import type { StudyItem } from '../organisms/DashboardSidebar/types'

interface StudyDetailTemplateProps {
  studies: StudyItem[]
  activeStudyId: string | null
  expandedStudy: boolean
  loading: boolean
  currentStudy: StudyItem | null
  selectedFilters: string[]
  searchQuery: string
  participants?: any[]
  onItemClick: (itemId: string) => void
  onStudyClick: (studyId: string) => void
  onFilterClick: (filter: string) => void
  onSearch: () => void
  onUploadData: () => void
  onCreateRoom: () => void
  onAddEvent: () => void
  onEditNotice: () => void
  onSearchQueryChange: (query: string) => void
  onAddFilter: () => void
  onSettingsClick: () => void
}

const StudyDetailTemplate: React.FC<StudyDetailTemplateProps> = ({
  studies,
  activeStudyId,
  expandedStudy,
  loading,
  currentStudy,
  selectedFilters,
  searchQuery,
  participants = [],
  onItemClick,
  onStudyClick,
  onFilterClick,
  onSearch,
  onUploadData,
  onCreateRoom,
  onAddEvent,
  onEditNotice,
  onSearchQueryChange,
  onAddFilter,
  onSettingsClick,
}) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar
        activeItem="study"
        expandedStudy={expandedStudy}
        studies={studies}
        activeStudyId={activeStudyId}
        onItemClick={onItemClick}
        onStudyClick={onStudyClick}
      />

      <div className="flex-1 flex flex-col">
        {/* 상단 헤더 */}
        <StudyHeader
          studyName={currentStudy?.name}
          studyDescription={currentStudy?.description}
          studyImageUrl={currentStudy?.image_url}
          loading={loading}
          userCount={7}
          onSettingsClick={onSettingsClick}
        />

        {/* 메인 콘텐츠 */}
        <div className="flex-1 p-6 space-y-6">
                    {/* 상단 섹션: 공지사항/화상회의 (6) + 캘린더 (4) */}
          <div className="grid grid-cols-10 gap-6">
            {/* 왼쪽: 공지사항과 화상회의 (6/10) */}
            <div className="col-span-6 flex flex-col h-full">
              <div className="mb-6">
                <StudyNoticeBox onEdit={onEditNotice} />
              </div>
              <div className="flex-1">
                <StudyVideoConference onCreateRoom={onCreateRoom} participants={participants} />
              </div>
            </div>

            {/* 오른쪽: 캘린더 (4/10) */}
            <div className="col-span-4">
              <StudyCalendar onAddEvent={onAddEvent} />
            </div>
          </div>

          {/* 필터 및 검색 섹션 */}
          <div className="flex items-center gap-4">
            {/* 필터 버튼들 */}
            <StudyFilters
              selectedFilters={selectedFilters}
              onFilterClick={onFilterClick}
              onAddFilter={onAddFilter}
            />

            {/* 검색바 */}
            <StudySearch
              searchQuery={searchQuery}
              onSearch={onSearch}
              onSearchQueryChange={onSearchQueryChange}
            />

            {/* 자료 올리기 버튼 */}
            <UploadButton onClick={onUploadData} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudyDetailTemplate
