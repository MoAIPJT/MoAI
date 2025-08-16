import React from 'react'
import type { AISummaryCardProps } from './types'

const AISummaryCard: React.FC<AISummaryCardProps> = ({
  summary,
  onClick
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(summary.id)
    } else {
      // onClick이 없으면 기본적으로 새창으로 열기
      window.open(`/ai-summary`, '_blank')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\./g, '.').replace(/\s/g, '')
  }

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900 truncate flex-1 mr-4">
          {summary.title}
        </h3>
        <span className="text-sm text-gray-500 whitespace-nowrap">
          {formatDate(summary.createdAt)}
        </span>
      </div>
      <p
        className="text-sm text-gray-600"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: '1.2em',
          maxHeight: '2.4em'
        }}
      >
        {summary.description}
      </p>
    </div>
  )
}

export default AISummaryCard
