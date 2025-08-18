import React from 'react';

interface VideoConferenceHeaderProps {
  // We'll keep these props for compatibility
  isDemoMode: boolean;
  isPdfViewerMode: boolean;
  isScreenSharing: boolean;
  screenShareParticipant: string;
  currentPdfName: string;
  isConnected: boolean;
  onInitializeDemoMode: () => void;
  onExitPdfViewerMode: () => void;
  // New props for control buttons
  onToggleMute?: () => void;
  onToggleCamera?: () => void;
  onToggleSidebar?: () => void;
  onToggleScreenShare?: () => void;
  onExitSession?: () => void;
  isMuted?: boolean;
  isCameraOff?: boolean;
  isSidebarVisible?: boolean;
}

const VideoConferenceHeader: React.FC<VideoConferenceHeaderProps> = ({
  onToggleMute = () => { },
  onToggleCamera = () => { },
  onToggleSidebar = () => { },
  onToggleScreenShare = () => { },
  onExitSession = () => { },
  isMuted = false,
  isCameraOff = false,
  isSidebarVisible = false,
  isScreenSharing = false,
}) => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-90 text-white px-6 py-3 rounded-full shadow-lg z-40 flex items-center space-x-8">
      {/* Mute button */}
      <button
        onClick={onToggleMute}
        className={`p-3 rounded-full ${isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'} transition-colors duration-200`}
        title={isMuted ? "음소거 해제" : "음소거"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isMuted ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          )}
        </svg>
      </button>

      {/* Camera button */}
      <button
        onClick={onToggleCamera}
        className={`p-3 rounded-full ${isCameraOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'} transition-colors duration-200`}
        title={isCameraOff ? "카메라 켜기" : "카메라 끄기"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isCameraOff ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          )}
        </svg>
      </button>

      {/* Sidebar button */}
      <button
        onClick={onToggleSidebar}
        className={`p-3 rounded-full ${isSidebarVisible ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'} transition-colors duration-200`}
        title={isSidebarVisible ? "사이드바 숨기기" : "사이드바 표시"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      {/* Screen share button */}
      <button
        onClick={onToggleScreenShare}
        className={`p-3 rounded-full ${isScreenSharing ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'} transition-colors duration-200`}
        title={isScreenSharing ? "화면 공유 중지" : "화면 공유"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </button>

      {/* Exit session button */}
      <button
        onClick={onExitSession}
        className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors duration-200"
        title="세션 나가기"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>
  );
};

export default VideoConferenceHeader;
