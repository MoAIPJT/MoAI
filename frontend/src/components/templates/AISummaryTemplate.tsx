import React, { useState } from 'react'
import Sidebar from '../organisms/Sidebar'
import Logo from '../atoms/Logo'
import Resizer from '../atoms/Resizer'

interface AISummaryTemplateProps {
  activeItem?: string
  expandedStudies: string[]
  onItemClick: (itemId: string) => void
  onStudyToggle: (studyId: string) => void
  children: React.ReactNode
}

const AISummaryTemplate: React.FC<AISummaryTemplateProps> = ({
  activeItem,
  expandedStudies,
  onItemClick,
  onStudyToggle,
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
          onItemClick={onItemClick} 
          onStudyToggle={onStudyToggle}
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

// TODO: 백엔드 API 연결 시 사용할 코드들
/*
import React from 'react'
import Sidebar from '../organisms/Sidebar'
import Logo from '../atoms/Logo'
import Resizer from '../atoms/Resizer'
import type { Study, Summary } from '../../types/api'

interface AISummaryTemplateProps {
  activeItem?: string
  expandedStudies: string[]
  studies?: Study[]
  summaries?: Summary[]
  isLoading?: boolean
  onItemClick: (itemId: string) => void
  onStudyToggle: (studyId: string) => void
  children: React.ReactNode
}

const AISummaryTemplate: React.FC<AISummaryTemplateProps> = ({
  activeItem,
  expandedStudies,
  studies,
  summaries,
  isLoading,
  onItemClick,
  onStudyToggle,
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
        <Logo variant="default" />
        
        <Sidebar 
          activeItem={activeItem} 
          expandedStudies={expandedStudies}
          studies={studies}
          summaries={summaries}
          isLoading={isLoading}
          onItemClick={onItemClick} 
          onStudyToggle={onStudyToggle}
        />
      </div>
      
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
*/ 