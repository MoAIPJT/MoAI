import React from 'react'
import type { AISummaryListProps } from './types'
import AISummaryCard from '../../molecules/AISummaryCard'
import thinkingImage from '@/assets/MoAI/thinking.png'

const AISummaryList: React.FC<AISummaryListProps> = ({
  summaries = [],
  isLoading = false,
  onSummaryClick
}) => {
  const displaySummaries = summaries

  if (isLoading) {
    return (
      <div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
              <div className="flex justify-between items-start mb-2">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* AI 요약본 리스트 */}
      <div className="space-y-4">
        {displaySummaries.map((summary) => (
          <AISummaryCard
            key={summary.id}
            summary={summary}
            onClick={onSummaryClick}
          />
        ))}
      </div>

      {/* 요약본이 없을 때 */}
      {displaySummaries.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-center" style={{ minHeight: '200px' }}>
          <div className="text-center">
            <div className="text-gray-500 mb-4">
                             <img src={thinkingImage} alt="AI 요약본 비어있음" className="mx-auto w-48 h-50" />
            </div>
            <h3 className="text-lg font-medium mb-2" style={{ color: '#61857b' }}>
              현재 요약본이 없어요.
            </h3>
          </div>
        </div>
      )}
    </div>
  )
}

export default AISummaryList 