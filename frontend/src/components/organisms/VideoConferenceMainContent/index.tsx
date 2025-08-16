import React, { useEffect, useRef } from 'react';
import VideoGrid from '../../molecules/VideoGrid';
import PDFViewer from '../../atoms/PDFViewer';

interface VideoConferenceMainContentProps {
  isConnected: boolean;
  isDemoMode: boolean;
  isPdfViewerMode: boolean;
  isScreenSharing: boolean;
  screenShareParticipant: string;
  screenShareStream: MediaStream | null;
  demoParticipants: Array<{id: string, name: string, hasAudio: boolean, hasVideo: boolean}>;
  remoteParticipants: Map<string, any>;
  localVideoTrack: any;
  isVideoEnabled: boolean;
  participantName: string;
  remoteParticipantStates: Map<string, {audio: boolean, video: boolean}>;
  currentPdfUrl: string;
  currentPdfName: string;
  cols: number;
  rows: number;
  pdfViewerRef: React.RefObject<HTMLIFrameElement | null>;
  speakingParticipantId?: string;
}

const VideoConferenceMainContent: React.FC<VideoConferenceMainContentProps> = ({
  isConnected,
  isDemoMode,
  isPdfViewerMode,
  isScreenSharing,
  screenShareParticipant,
  screenShareStream,
  demoParticipants,
  remoteParticipants,
  localVideoTrack,
  isVideoEnabled,
  participantName,
  remoteParticipantStates,
  currentPdfUrl,
  currentPdfName,
  cols,
  rows,
  pdfViewerRef: _pdfViewerRef,
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
          {/* 좌측: 참가자 화면들 */}
          <div className="w-1/4 flex flex-col gap-2">
            <div className="text-center text-white text-xs mb-2">
              <span className="bg-gray-700 px-2 py-1 rounded">
                참가자 화면
                <span className="ml-1 text-blue-400">(화면 공유 모드)</span>
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

          {/* 중앙: 화면 공유 영역 */}
          <div className="flex-1">
            <div className="bg-gray-800 rounded-lg h-full flex items-center justify-center relative overflow-hidden">
              {/* LiveKit 화면 공유 트랙을 렌더링할 div */}
              <div 
                id="screen-share-container"
                className="w-full h-full flex items-center justify-center bg-gray-900"
                style={{ minHeight: '400px' }}
              >
                <div className="text-gray-400 text-center">
                  <div className="text-2xl mb-2">🖥️</div>
                  <div className="text-sm">화면 공유 중...</div>
                  <div className="text-xs mt-1">{screenShareParticipant}의 화면</div>
                  <div className="text-xs mt-2 text-gray-500">
                    화면 공유 트랙이 연결되면 여기에 표시됩니다
                  </div>
                </div>
              </div>
              
              {/* 화면 공유 정보 오버레이 */}
              <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded">
                <div className="text-sm font-semibold">
                  {screenShareParticipant}의 화면 공유
                </div>
              </div>
              
              {/* 화면 공유 중지 버튼 (자신이 공유 중일 때만) */}
              {screenShareParticipant === participantName && (
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => {
                      // 화면 공유 중지 이벤트 발생
                      const event = new CustomEvent('stop-screen-share');
                      window.dispatchEvent(event);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                  >
                    공유 중지
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PDF 뷰어 모드일 때
  if (isPdfViewerMode) {
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

          {/* 중앙: PDF 뷰어 */}
          <div className="flex-1">
            <PDFViewer
              pdfUrl={currentPdfUrl}
              title={currentPdfName}
              onLoad={() => {}}
              onError={() => {}}
            />
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
