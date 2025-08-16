import React from 'react';

interface VideoConferenceHeaderProps {
  studyNameDisplay: string;
  isDemoMode: boolean;
  isScreenSharing: boolean;
  screenShareParticipant: string;
  isConnected: boolean;
  onInitializeDemoMode: () => void;
}

const VideoConferenceHeader: React.FC<VideoConferenceHeaderProps> = ({
  studyNameDisplay,
  isDemoMode,
  isScreenSharing,
  screenShareParticipant,
  isConnected,
  onInitializeDemoMode,
}) => {
  return (
    <div className="bg-gray-800 text-white p-3 border-b border-gray-700 flex-shrink-0">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold">
            {studyNameDisplay}
            {isDemoMode && <span className="ml-2 text-yellow-400 text-sm">(데모 모드)</span>}
            {isScreenSharing && (
              <span className="ml-2 text-green-400 text-sm">
                (화면 공유 모드 - {screenShareParticipant})
              </span>
            )}
          </h1>
          {isScreenSharing && (
            <p className="text-sm text-gray-400">
              {screenShareParticipant}이(가) 화면을 공유하고 있습니다
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {
            <button
              onClick={onInitializeDemoMode}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs"
            >
              데모 모드로 보기
            </button>
          }
        </div>
      </div>
    </div>
  );
};

export default VideoConferenceHeader;
