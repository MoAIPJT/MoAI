import React from 'react'
import type { StudyHeaderProps } from './types'

const StudyHeader: React.FC<StudyHeaderProps> = ({
  studyName,
  studyDescription,
  studyImageUrl,
  loading = false,
  userCount = 7,
  onSettingsClick,
  onUserCountClick,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold text-gray-800">
              {loading ? '로딩 중...' : studyName || '스터디'}
            </h1>
            {studyImageUrl && studyImageUrl.trim() !== '' && (
              <img
                src={studyImageUrl}
                alt="스터디 이미지"
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  // 이미지 로드 실패 시 기본 이미지로 대체
                  e.currentTarget.src = '/api/images/default.jpg'
                }}
              />
            )}
          </div>
          <div className="text-sm text-gray-600 overflow-hidden">
            {studyDescription || '스터디 설명이 없습니다.'}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onUserCountClick}
            className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
            <span className="text-sm font-medium">{userCount}</span>
          </button>
          <button
            onClick={onSettingsClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <span className="text-lg">⚙️</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default StudyHeader
