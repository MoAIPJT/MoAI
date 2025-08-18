import React from 'react';
import type { ControlBarProps } from './types';
import CircleButton from '../../atoms/CircleButton';

const ControlBar: React.FC<ControlBarProps> = ({
  isAudioEnabled,
  isVideoEnabled,
  isScreenSharing,
  isDemoMode,
  hasUnreadChatMessages,
  sidebarOpen,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onToggleSidebar,
  onLeaveSession
}) => {
  return (
    <div className="bg-gray-800 border-t border-gray-700 p-3 flex-shrink-0">
      <div className="flex justify-center items-center gap-3">
        <CircleButton
          variant={isDemoMode ? 'lightPurple' : (isAudioEnabled ? 'lightPurple' : 'red')}
          size="sm"
          onClick={isDemoMode ? () => {} : onToggleAudio}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        </CircleButton>

        <CircleButton
          variant={isDemoMode ? 'lightPurple' : (isVideoEnabled ? 'lightPurple' : 'red')}
          size="sm"
          onClick={isDemoMode ? () => {} : onToggleVideo}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
          </svg>
        </CircleButton>

        <CircleButton
          variant={isScreenSharing ? 'red' : 'purple'}
          size="sm"
          onClick={onToggleScreenShare}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
          </svg>
        </CircleButton>

        <CircleButton
          variant="gray"
          size="sm"
          onClick={() => onToggleSidebar('participants')}
          className="relative"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
          {hasUnreadChatMessages && !sidebarOpen && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          )}
        </CircleButton>

        <CircleButton
          variant="red"
          size="sm"
          onClick={onLeaveSession}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </CircleButton>
      </div>
    </div>
  );
};

export default ControlBar;
