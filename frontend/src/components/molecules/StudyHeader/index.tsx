import React from 'react'
import { StudyMembersIcon, SettingsIcon } from '../../atoms/Icons'
import type { StudyHeaderProps } from './types'

const StudyHeader: React.FC<StudyHeaderProps> = ({
  studyName,
  studyDescription,
  studyImageUrl,
  loading = false,
  currentUserRole,
  onSettingsClick,
  onUserCountClick,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            {/* 스터디 사진을 왼쪽에 중간 정렬 */}
            {studyImageUrl && studyImageUrl.trim() !== '' && (
              <div className="flex-shrink-0 mt-1">
                <img
                  src={studyImageUrl}
                  alt="스터디 이미지"
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => {
                    // 이미지 로드 실패 시 기본 이미지로 대체
                    e.currentTarget.src = '/api/images/default.jpg'
                  }}
                />
              </div>
            )}

            {/* 스터디 이름과 설명을 같은 시작 위치에 배치 */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {loading ? '로딩 중...' : studyName || '스터디'}
              </h1>
              <div className="text-sm text-gray-600 overflow-hidden">
                {studyDescription || '스터디 설명이 없습니다.'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onUserCountClick}
            className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors cursor-pointer group"
          >
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <StudyMembersIcon className="w-4 h-4 text-gray-600" />
            </div>
          </button>
          {/* 설정 아이콘은 admin일 때만 표시 */}
          {currentUserRole === 'ADMIN' && (
            <button
              onClick={onSettingsClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
            >
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <SettingsIcon className="w-4 h-4 text-gray-600" />
              </div>
            </button>
          )}

        </div>
      </div>
    </div>
  )
}

export default StudyHeader
