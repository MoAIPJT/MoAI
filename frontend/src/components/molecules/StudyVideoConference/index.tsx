import React from 'react'
import type { StudyVideoConferenceProps } from './types'

const StudyVideoConference: React.FC<StudyVideoConferenceProps> = ({
  hasActiveMeeting = false,
  onCreateRoom,
}) => {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex justify-between items-center h-full">
        <div className="text-center flex-1">
          <p className="text-gray-600 mb-4">
            {hasActiveMeeting
              ? "현재 진행중인 화상회의가 있습니다"
              : "현재 진행중인 화상회의가 없어욤"
            }
          </p>
          <button
            onClick={onCreateRoom}
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto hover:bg-green-600 transition-colors"
          >
            <span>➕</span>
            <span>방 생성 +</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default StudyVideoConference
