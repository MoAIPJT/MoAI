import React from 'react'
import type { SummaryViewerProps } from './types'

const SummaryViewer: React.FC<SummaryViewerProps> = ({
  summaryData,
  onViewOriginal,
}) => {
  if (!summaryData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <p className="text-gray-600">요약본을 선택해주세요</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {summaryData.title}
        </h1>
        {summaryData.originalPdfPath && (
          <button
            onClick={onViewOriginal}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
          >
            <span>📖</span>
            원본 문서 보기
          </button>
        )}
      </div>

      {/* 요약본 내용 */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {summaryData.sections.map((section, index) => (
            <div key={index} className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">
                {section.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SummaryViewer 