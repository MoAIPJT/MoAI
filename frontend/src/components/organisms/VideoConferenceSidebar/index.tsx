import React, { useState } from 'react';

interface VideoConferenceSidebarProps {
  onCloseSidebar?: () => void;
}

const VideoConferenceSidebar: React.FC<VideoConferenceSidebarProps> = ({
  onCloseSidebar = () => { }
}) => {
  const [activeTab, setActiveTab] = useState<'participants' | 'chat' | 'materials'>('participants');

  return (
    <div className="w-80 h-full bg-gray-800 text-white flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold">회의 사이드바</h2>
        {onCloseSidebar && (
          <button
            onClick={onCloseSidebar}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 bg-gray-800">
        <button
          onClick={() => setActiveTab('participants')}
          className={`flex-1 py-3 px-3 text-sm font-medium transition-all duration-200 ${activeTab === 'participants'
            ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700 shadow-inner'
            : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-1.7 2.26V16h-1.5v6h5z" />
              <path d="M12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6h1.5v7h4z" />
            </svg>
            참가자
          </div>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 px-3 text-sm font-medium transition-all duration-200 relative ${activeTab === 'chat'
            ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700 shadow-inner'
            : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
            </svg>
            채팅
          </div>
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          className={`flex-1 py-3 px-3 text-sm font-medium transition-all duration-200 ${activeTab === 'materials'
            ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700 shadow-inner'
            : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
            </svg>
            자료
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'participants' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">참가자 목록</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">나</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">나 (나)</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">A</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">참가자 A</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">채팅</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-700 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">A</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  전송
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">공유 자료</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-blue-400 text-xl">📄</span>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">회의 자료.pdf</p>
                    <p className="text-gray-400 text-xs">PDF • 2.3MB</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-green-400 text-xl">📊</span>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">프로젝트 계획서.xlsx</p>
                    <p className="text-gray-400 text-xs">Excel • 1.8MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoConferenceSidebar;
