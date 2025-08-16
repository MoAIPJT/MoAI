import React, { useEffect, useRef } from 'react';
import VideoGrid from '../../molecules/VideoGrid';

interface VideoConferenceMainContentProps {
  isConnected: boolean;
  isDemoMode: boolean;
  isScreenSharing: boolean;
  screenShareParticipant: string;
  screenShareStream: MediaStream | null;
  demoParticipants: Array<{id: string, name: string, hasAudio: boolean, hasVideo: boolean}>;
  remoteParticipants: Map<string, any>;
  localVideoTrack: any;
  isVideoEnabled: boolean;
  participantName: string;
  remoteParticipantStates: Map<string, {audio: boolean, video: boolean}>;
  cols: number;
  rows: number;
  speakingParticipantId?: string;
}

const VideoConferenceMainContent: React.FC<VideoConferenceMainContentProps> = ({
  isConnected,
  isDemoMode,
  isScreenSharing,
  screenShareParticipant,
  screenShareStream,
  demoParticipants,
  remoteParticipants,
  localVideoTrack,
  isVideoEnabled,
  participantName,
  remoteParticipantStates,
  cols,
  rows,
  speakingParticipantId,
}) => {
  const allParticipants = isDemoMode ? demoParticipants : Array.from(remoteParticipants.values());
  const hasParticipants = isDemoMode ? demoParticipants.length > 0 : allParticipants.length > 0;
  const screenShareVideoRef = useRef<HTMLVideoElement>(null);

  // 화면 공유 스트림 연결
  useEffect(() => {
    if (screenShareStream && screenShareVideoRef.current) {
      screenShareVideoRef.current.srcObject = screenShareStream;
    }
  }, [screenShareStream]);

  if (!isDemoMode && !isConnected) {
    return null;
  }

  // 데모 모드가 아닌 경우 참가자가 있어야 함
  if (!isDemoMode && !hasParticipants) {
    return null;
  }

  // 화면 공유 모드일 때
  if (isScreenSharing) {
    return (
      <div className="flex-1 flex items-center justify-center p-2 min-h-0 overflow-hidden">
        <div className="flex w-full h-full gap-4">
          {/* 좌측: 사용자 화면들 */}
          <div className="w-1/4 flex flex-col gap-2">
            <div className="text-center text-white text-xs mb-2">
              <span className="bg-gray-700 px-2 py-1 rounded">
                참가자 화면
              </span>
            </div>
            <VideoGrid
              isDemoMode={isDemoMode}
              demoParticipants={demoParticipants}
              remoteParticipants={remoteParticipants}
              localVideoTrack={localVideoTrack}
              isVideoEnabled={isVideoEnabled}
              participantName={participantName}
              remoteParticipantStates={remoteParticipantStates}
              cols={1}
              rows={4}
              speakingParticipantId={speakingParticipantId}
            />
          </div>

          {/* 중앙: 화면 공유 */}
          <div className="flex-1">
            <div className="bg-gray-800 rounded-lg p-4 h-full flex flex-col">
              <div className="text-center text-white text-sm mb-2">
                <span className="bg-green-600 px-2 py-1 rounded">
                  {screenShareParticipant}의 화면 공유
                </span>
              </div>
              <div className="flex-1 bg-black rounded overflow-hidden">
                <video
                  ref={screenShareVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 일반 화상회의 모드
  return (
    <div className="flex-1 flex items-center justify-center p-2 min-h-0 overflow-hidden">
      <VideoGrid
        isDemoMode={isDemoMode}
        demoParticipants={demoParticipants}
        remoteParticipants={remoteParticipants}
        localVideoTrack={localVideoTrack}
        isVideoEnabled={isVideoEnabled}
        participantName={participantName}
        remoteParticipantStates={remoteParticipantStates}
        cols={cols}
        rows={rows}
        speakingParticipantId={speakingParticipantId}
      />
    </div>
  );
};

export default VideoConferenceMainContent;
