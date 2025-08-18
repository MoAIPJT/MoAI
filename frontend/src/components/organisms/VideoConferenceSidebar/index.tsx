import React, { useState } from 'react';
import { useRefFiles } from '@/hooks/useRefFiles';

interface Participant {
    id: string;
    identity: string;
    isLocal: boolean;
    videoTrack?: any;
    audioTrack?: any;
}

interface VideoConferenceSidebarProps {
    onCloseSidebar?: () => void;
    participants?: Participant[];
    studyId?: string;
}

const VideoConferenceSidebar: React.FC<VideoConferenceSidebarProps> = ({
    onCloseSidebar = () => { },
    participants = [],
    studyId
}) => {
    const [activeTab, setActiveTab] = useState<'participants' | 'chat' | 'materials'>('participants');
    const [showParticipantList, setShowParticipantList] = useState(true);

    // Get the ref files hooks
    const { useRefList } = useRefFiles();

    // Fetch documents when studyId is available and materials tab is active
    const { data: documents, isLoading: isLoadingDocuments, error: documentsError } = useRefList(
        studyId ? parseInt(studyId) : 0,
        undefined // userId is optional
    );

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

            {/* Horizontal Tab Navigation */}
            <div className="p-4 border-b border-gray-700">
                <div className="flex space-x-2">
                    <button
                        onClick={() => setActiveTab('participants')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'participants'
                            ? 'bg-gray-300 text-gray-800'
                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500 hover:text-white'
                            }`}
                    >
                        참가자
                    </button>

                    {/* <button
                        onClick={() => setActiveTab('chat')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'chat'
                            ? 'bg-gray-300 text-gray-800'
                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500 hover:text-white'
                            }`}
                    >
                        채팅
                    </button>

                    <button
                        onClick={() => setActiveTab('materials')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'materials'
                            ? 'bg-gray-300 text-gray-800'
                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500 hover:text-white'
                            }`}
                    >
                        공유 자료
                    </button> */}
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'participants' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">참가자 목록 <span className="bg-gray-400 text-gray-700 text-xs px-2 py-1 rounded-full">
                                {participants.length}
                            </span>
                            </h3>
                            <button
                                onClick={() => setShowParticipantList(!showParticipantList)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                {showParticipantList ? '▼' : '▶'}
                            </button>
                        </div>

                        {showParticipantList && (
                            <div className="space-y-3">
                                {participants.map((participant) => (
                                    <div key={participant.id} className="p-3 bg-gray-700 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${participant.isLocal ? 'bg-blue-500' : 'bg-purple-500'
                                                }`}>
                                                <span className="text-white font-semibold text-sm">
                                                    {participant.isLocal ? '나' : participant.identity.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white text-sm font-medium">
                                                    {participant.isLocal ? '나 (나)' : `참가자 ${participant.identity}`}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {participants.length === 0 && (
                                    <div className="text-center text-gray-400 py-8">
                                        참가자가 없습니다.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'chat' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">채팅</h3>
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
                        <h3 className="text-lg font-semibold">공유 자료</h3>
                        {!studyId ? (
                            <div className="text-center text-gray-400 py-8">
                                스터디 정보를 불러올 수 없습니다.
                            </div>
                        ) : isLoadingDocuments ? (
                            <div className="text-center text-gray-400 py-8">
                                자료를 불러오는 중...
                            </div>
                        ) : documentsError ? (
                            <div className="text-center text-red-400 py-8">
                                자료를 불러오는데 실패했습니다.
                            </div>
                        ) : documents && documents.length > 0 ? (
                            <div className="space-y-3">
                                {documents.map((document) => (
                                    <div
                                        key={document.fileId}
                                        className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors"
                                        onClick={() => { }}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-1">
                                                <p className="text-white text-sm font-medium">{document.title}</p>
                                                <p className="text-gray-400 text-xs">
                                                    {document.categories && document.categories.length > 0
                                                        ? `${document.categories.join(', ')} • `
                                                        : ''}
                                                    {document.uploadDate ? new Date(document.uploadDate).toLocaleDateString('ko-KR') : '날짜 없음'}
                                                </p>
                                                {document.description && (
                                                    <p className="text-gray-300 text-xs mt-1">{document.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 py-8">
                                공유된 자료가 없습니다.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoConferenceSidebar;
