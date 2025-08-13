import React from 'react'
import type { StudyNoticeBoxProps } from './types'
import { EditIcon } from '../../atoms/Icons'

const StudyNoticeBox: React.FC<StudyNoticeBoxProps> = ({
  title = '공지 제목1',
  content = 'Lorem ipsum dolor sit amet consectetur. Nascetur fringilla vel lorem bibendum amet cursus urna.',
  onEdit,
  userName,
  studyName = '스터디',
  isAdmin = false,
}) => {
  return (
    <div className="bg-purple-100 rounded-lg p-4 relative">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-gray-800">{title}</h2>
          {userName && (
            <span className="text-sm text-purple-600 font-medium">
              ({userName}님이 작성)
            </span>
          )}
        </div>
        {onEdit && isAdmin && (
          <button
            onClick={onEdit}
            className="p-1 hover:bg-purple-200 rounded transition-colors"
            title="공지사항 편집"
          >
            <EditIcon />
          </button>
        )}
      </div>
      <p className="text-sm text-gray-600">
        {content || `안녕하세요! ${studyName} 입니다 :)`}
      </p>
    </div>
  )
}

export default StudyNoticeBox
