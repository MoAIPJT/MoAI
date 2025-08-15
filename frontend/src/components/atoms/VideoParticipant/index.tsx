import React, { forwardRef, useEffect } from 'react'
import type { VideoParticipantProps } from './types'
import { Track } from 'livekit-client'

const VideoParticipant = forwardRef<HTMLVideoElement, VideoParticipantProps>(({
  participantId,
  participantName,
  hasVideo,
  isVideoEnabled,
  isSpeaking,
  videoTrack,
  isLocal = false,
  isDemo = false,
  isMuted = false
}, ref) => {
  // 비디오 트랙 연결 (원격 참가자인 경우)
  useEffect(() => {
    if (videoTrack && ref && typeof ref === 'object' && ref.current && !isLocal) {
      videoTrack.attach(ref.current)
    }
  }, [videoTrack, ref, isLocal])

  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden">
      {hasVideo && isVideoEnabled ? (
        <video
          ref={ref}
          autoPlay
          muted={isLocal || isMuted}
          playsInline
          className={`w-full h-full object-cover ${isSpeaking ? 'ring-2 ring-blue-400' : ''}`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-700">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <p className="text-white text-sm font-medium">{participantName}</p>
          </div>
        </div>
      )}

      {/* 참가자 이름 표시 */}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
        {participantName}
      </div>

      {/* 로컬 참가자 음소거 표시 */}
      {isLocal && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          🔇
        </div>
      )}

      {/* 데모 표시 */}
      {isDemo && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          DEMO
        </div>
      )}

      {/* 참가자 ID 표시 (원격 참가자인 경우) */}
      {!isLocal && !isDemo && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          {participantId}
        </div>
      )}
    </div>
  )
})

VideoParticipant.displayName = 'VideoParticipant'

export default VideoParticipant
