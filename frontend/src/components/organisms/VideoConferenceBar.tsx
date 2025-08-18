import React from 'react';
import CircleButton from '@/components/atoms/CircleButton';

interface VideoConferenceBarProps {
    isAudioEnabled: boolean;
    isVideoEnabled: boolean;
    isSidebarOpen: boolean;
    isScreenSharing: boolean;
    onToggleAudio: () => void;
    onToggleVideo: () => void;
    onToggleSidebar: () => void;
    onToggleScreenShare: () => void;
    onExitSession: () => void;
}

const VideoConferenceBar: React.FC<VideoConferenceBarProps> = ({
    isAudioEnabled,
    isVideoEnabled,
    isSidebarOpen,
    isScreenSharing,
    onToggleAudio,
    onToggleVideo,
    onToggleSidebar,
    onToggleScreenShare,
    onExitSession,
}) => {
    return (
        <div className="w-full bg-gray-900 border-t border-gray-700 p-4 z-50">
            <div className="flex justify-center items-center gap-4">
                {/* Mute/Unmute Button */}
                <CircleButton
                    variant={isAudioEnabled ? 'lightPurple' : 'red'}
                    size="md"
                    onClick={onToggleAudio}
                    className="relative"
                >
                    {isAudioEnabled ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                        </svg>
                    )}
                </CircleButton>

                {/* Camera On/Off Button */}
                <CircleButton
                    variant={isVideoEnabled ? 'lightPurple' : 'red'}
                    size="md"
                    onClick={onToggleVideo}
                >
                    {isVideoEnabled ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M4.27 3L3 4.27l5.73 5.73L9 12l3 3 1.73-1.73L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                        </svg>
                    )}
                </CircleButton>

                {/* Sidebar Toggle Button */}
                <CircleButton
                    variant={isSidebarOpen ? 'purple' : 'gray'}
                    size="md"
                    onClick={onToggleSidebar}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                    </svg>
                </CircleButton>

                {/* Screen Share Button */}
                <CircleButton
                    variant={isScreenSharing ? 'red' : 'purple'}
                    size="md"
                    onClick={onToggleScreenShare}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
                    </svg>
                </CircleButton>

                {/* Exit Session Button */}
                <CircleButton
                    variant="red"
                    size="md"
                    onClick={onExitSession}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </CircleButton>
            </div>
        </div>
    );
};

export default VideoConferenceBar;