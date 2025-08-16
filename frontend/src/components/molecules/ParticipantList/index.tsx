import React from 'react'
import type { ParticipantListProps } from './types'

const ParticipantList: React.FC<ParticipantListProps> = ({
  isDemoMode,
  demoParticipants,
  remoteParticipants,
  remoteParticipantStates,
  participantName,
  isAudioEnabled,
  isVideoEnabled,
  onToggleAudio,
  onToggleVideo,
}: ParticipantListProps) => {
  const allParticipants = isDemoMode ? demoParticipants : Array.from(remoteParticipants.values())

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {/* 내 정보 */}
      <div className="mb-6 p-4 bg-gray-700 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {participantName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h4 className="text-white font-medium">{participantName}</h4>
              <p className="text-gray-300 text-xs">나</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onToggleAudio}
              className={`p-2 rounded-lg transition-colors ${
                isAudioEnabled
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isAudioEnabled ? '🔊' : '🔇'}
            </button>
            <button
              onClick={onToggleVideo}
              className={`p-2 rounded-lg transition-colors ${
                isVideoEnabled
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isVideoEnabled ? '📹' : '🚫'}
            </button>
          </div>
        </div>
      </div>

      {/* 다른 참가자들 */}
      <div className="space-y-3">
        <h5 className="text-gray-300 text-sm font-medium mb-3">다른 참가자 ({allParticipants.length}명)</h5>

        {allParticipants.map((participant) => {
          const isDemoParticipant = 'id' in participant
          const participantId = isDemoParticipant ? participant.id : participant.sid
          const participantName = isDemoParticipant ? participant.name : participant.identity
          const hasAudio = isDemoParticipant ? participant.hasAudio : (remoteParticipantStates.get(participantId)?.audio ?? true)
          const hasVideo = isDemoParticipant ? participant.hasVideo : (remoteParticipantStates.get(participantId)?.video ?? true)

          return (
            <div key={participantId} className="p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">
                      {participantName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h6 className="text-white text-sm font-medium">{participantName}</h6>
                    <p className="text-gray-400 text-xs">
                      {isDemoMode ? '데모 참가자' : '원격 참가자'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <span className={`text-xs px-2 py-1 rounded ${
                    hasAudio ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                    {hasAudio ? '🔊' : '🔇'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    hasVideo ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                    {hasVideo ? '📹' : '🚫'}
                  </span>
                </div>
              </div>
            </div>
          )
        })}

        {allParticipants.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>다른 참가자가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ParticipantList
