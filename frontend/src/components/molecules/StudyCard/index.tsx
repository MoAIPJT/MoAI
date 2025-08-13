import React from 'react'
import type { StudyCardProps } from './types'

const StudyCard: React.FC<StudyCardProps> = ({
  study,
  onClick
}) => {
  const handleClick = () => {
    onClick?.(study.id)
  }

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={handleClick}
    >
      <div className="flex items-center space-x-4">
        {/* 스터디 아이콘 */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            {study.imageUrl ? (
              <img
                src={study.imageUrl}
                alt={study.name}
                className="w-12 h-12 object-contain"
              />
            ) : (
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {study.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* 스터디 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {study.name}
            </h3>
            {/* 승인 대기중 상태 표시 */}
            {study.status === 'PENDING' && (
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">
                승인 대기중
              </span>
            )}
          </div>
          {study.description && (
            <p className="text-sm text-gray-500 mb-2 truncate">
              {study.description}
            </p>
          )}
          <div
            className="text-sm text-gray-600"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: '1.2em',
              maxHeight: '3.6em'
            }}
          >
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudyCard
