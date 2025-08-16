import React from 'react';
import { RemoteParticipant } from 'livekit-client';
import ParticipantList from '../../molecules/ParticipantList';
import ChatBox from '../../molecules/ChatBox';

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
}

interface StudyMaterial {
  id: string;
  name: string;
  type: string;
  url: string;
}

interface VideoConferenceSidebarProps {
  sidebarOpen: boolean;
  activeSidebarTab: 'participants' | 'chat' | 'materials' | null;
  isDemoMode: boolean;
  demoParticipants: Array<{id: string, name: string, hasAudio: boolean, hasVideo: boolean}>;
  remoteParticipants: Map<string, RemoteParticipant>;
  remoteParticipantStates: Map<string, {audio: boolean, video: boolean}>;
  participantName: string;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  chatMessages: ChatMessage[];
  newChatMessage: string;
  studyMaterials: StudyMaterial[];
  hasUnreadChatMessages: boolean;
  onCloseSidebar: () => void;
  onTabChange: (tab: 'participants' | 'chat' | 'materials') => void;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleDemoParticipantAudio: (participantId: string) => void;
  onToggleDemoParticipantVideo: (participantId: string) => void;
  onNewChatMessageChange: (message: string) => void;
  onSendChatMessage: () => void;
  onMaterialClick: (material: StudyMaterial) => void;
}

const VideoConferenceSidebar: React.FC<VideoConferenceSidebarProps> = ({
  sidebarOpen,
  activeSidebarTab,
  isDemoMode,
  demoParticipants,
  remoteParticipants,
  remoteParticipantStates,
  participantName,
  isAudioEnabled,
  isVideoEnabled,
  chatMessages,
  newChatMessage,
  studyMaterials,
  hasUnreadChatMessages,
  onCloseSidebar,
  onTabChange,
  onToggleAudio,
  onToggleVideo,
  onToggleDemoParticipantAudio,
  onToggleDemoParticipantVideo,
  onNewChatMessageChange,
  onSendChatMessage,
  onMaterialClick
}) => {
  if (!sidebarOpen || !activeSidebarTab) return null;

  return (
    <div className="w-1/4 bg-gray-800 border-l border-gray-700 flex flex-col">
      {/* 사이드바 헤더 */}
      <div className="p-3 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-white font-semibold">
          {activeSidebarTab === 'participants' && '참가자 목록'}
          {activeSidebarTab === 'chat' && '채팅'}
          {activeSidebarTab === 'materials' && '공부자료'}
        </h3>
        <button
          onClick={onCloseSidebar}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex border-b border-gray-700 bg-gray-800">
        <button
          onClick={() => onTabChange('participants')}
          className={`flex-1 py-3 px-3 text-sm font-medium transition-all duration-200 ${
            activeSidebarTab === 'participants'
              ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700 shadow-inner'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-1.7 2.26V16h-1.5v6h5z"/>
              <path d="M12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6h1.5v7h4z"/>
            </svg>
            참가자
          </div>
        </button>
        <button
          onClick={() => onTabChange('chat')}
          className={`flex-1 py-3 px-3 text-sm font-medium transition-all duration-200 relative ${
            activeSidebarTab === 'chat'
              ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700 shadow-inner'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
            </svg>
            채팅
            {hasUnreadChatMessages && activeSidebarTab !== 'chat' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            )}
          </div>
        </button>
        <button
          onClick={() => onTabChange('materials')}
          className={`flex-1 py-3 px-3 text-sm font-medium transition-all duration-200 ${
            activeSidebarTab === 'materials'
              ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700 shadow-inner'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
            </svg>
            자료
          </div>
        </button>
      </div>

      {/* 사이드바 내용 */}
      <div className="flex-1 overflow-hidden">
        {activeSidebarTab === 'participants' && (
          <ParticipantList
            isDemoMode={isDemoMode}
            demoParticipants={demoParticipants}
            remoteParticipants={remoteParticipants}
            remoteParticipantStates={remoteParticipantStates}
            participantName={participantName}
            isAudioEnabled={isAudioEnabled}
            isVideoEnabled={isVideoEnabled}
            onToggleAudio={onToggleAudio}
            onToggleVideo={onToggleVideo}
            onToggleDemoParticipantAudio={onToggleDemoParticipantAudio}
            onToggleDemoParticipantVideo={onToggleDemoParticipantVideo}
          />
        )}

        {activeSidebarTab === 'chat' && (
          <ChatBox
            chatMessages={chatMessages}
            newChatMessage={newChatMessage}
            onNewChatMessageChange={onNewChatMessageChange}
            onSendChatMessage={onSendChatMessage}
          />
        )}

        {activeSidebarTab === 'materials' && (
          <div className="p-3">
            <div className="space-y-2">
              {studyMaterials.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">📄</div>
                  <p className="text-gray-400 text-sm">
                    {isDemoMode ? '데모 모드에서는 기본 자료가 표시됩니다.' : '이 스터디에 등록된 자료가 없습니다.'}
                  </p>
                </div>
              ) : (
                studyMaterials.map((material) => (
                  <div 
                    key={material.id} 
                    className="flex items-center space-x-2 p-2 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer transition-colors"
                    onClick={() => onMaterialClick(material)}
                  >
                    <span className="text-blue-400">
                      {material.type === 'pdf' && '📄'}
                    </span>
                    <span className="text-white text-sm flex-1">{material.name}</span>
                    {material.type === 'pdf' && (
                      <span className="text-xs text-gray-400">PDF</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoConferenceSidebar;
