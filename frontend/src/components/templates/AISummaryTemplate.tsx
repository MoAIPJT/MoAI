import React, { useState } from 'react'
import Sidebar from '../organisms/Sidebar'
import Logo from '../atoms/Logo'
import Resizer from '../atoms/Resizer'
import type { StudyWithSummaries } from '../../services/summaryService'

interface AISummaryTemplateProps {
  activeItem?: string
  expandedStudies: string[]
  studiesWithSummaries?: StudyWithSummaries[]
  isLoading?: boolean
  onItemClick: (itemId: string) => void
  onStudyToggle: (studyId: string) => void
  onSettingsClick?: () => void
  onLogout?: () => void
  onEditSummary?: (summary: { summaryId: string; title: string; description: string }) => void
  onDeleteSummary?: (summaryId: string) => void
  children: React.ReactNode
}

const AISummaryTemplate: React.FC<AISummaryTemplateProps> = ({
  activeItem,
  expandedStudies,
  studiesWithSummaries = [],
  isLoading = false,
  onItemClick,
  onStudyToggle,
  onSettingsClick,
  onLogout,
  onEditSummary,
  onDeleteSummary,
  children,
}) => {
  const [sidebarWidth, setSidebarWidth] = useState(256)

  const handleResize = (width: number) => {
    setSidebarWidth(width)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className="bg-white border-r border-gray-200 h-screen flex flex-col"
        style={{ width: `${sidebarWidth}px` }}
      >
        {/* 로고 섹션 */}
        <Logo variant="default" />

        {/* 네비게이션 섹션 */}
        <Sidebar
          activeItem={activeItem}
          expandedStudies={expandedStudies}
          studiesWithSummaries={studiesWithSummaries}
          isLoading={isLoading}
          onItemClick={onItemClick}
          onStudyToggle={onStudyToggle}
          onSettingsClick={onSettingsClick}
          onLogout={onLogout}
          onEditSummary={onEditSummary}
          onDeleteSummary={onDeleteSummary}
        />
      </div>

      {/* 리사이저 */}
      <Resizer
        onResize={handleResize}
        minWidth={200}
        maxWidth={500}
        initialWidth={256}
      />

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

export default AISummaryTemplate
