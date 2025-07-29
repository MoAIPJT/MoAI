import React, { useState } from 'react'
import AISummaryTemplate from '../components/templates/AISummaryTemplate'
import SummaryViewer from '../components/atoms/SummaryViewer'
import PDFViewer from '../components/atoms/PDFViewer'
import SplitResizer from '../components/atoms/SplitResizer'
import { dummySummaryData } from '../types/summary'

const AISummaryPage: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('')
  const [expandedStudies, setExpandedStudies] = useState<string[]>([])
  const [showOriginal, setShowOriginal] = useState(false)
  const [leftPanelWidth, setLeftPanelWidth] = useState(500)

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
            initialLeftWidth={500}
          />

          {/* 오른쪽 패널 - 원본 PDF */}
          <div className="flex-1">
            <PDFViewer
              pdfUrl={selectedSummary.originalPdfPath}
              title={selectedSummary.title}
              onLoad={() => console.log('PDF 로드 완료')}
              onError={(error) => console.error('PDF 로드 실패:', error)}
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
      onItemClick={handleItemClick}
      onStudyToggle={handleStudyToggle}
    >
      {activeItem ? renderSummaryContent() : renderEmptyState()}
    </AISummaryTemplate>
  )
}

export default AISummaryPage 