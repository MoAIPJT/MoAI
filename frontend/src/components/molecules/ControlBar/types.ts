export interface ControlBarProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  isDemoMode: boolean;
  hasUnreadChatMessages: boolean;
  sidebarOpen: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleSidebar: (tab: 'participants' | 'chat' | 'materials') => void;
  onLeaveSession: () => void;
}