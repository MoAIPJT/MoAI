import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    LocalVideoTrack,
    LocalAudioTrack,
    RemoteAudioTrack,
    RemoteParticipant,
    RemoteTrack,
    RemoteTrackPublication,
    Room,
    RoomEvent,
    RemoteVideoTrack
} from 'livekit-client';
import VideoConferenceMainContent from '../components/organisms/VideoConferenceMainContent';
import VideoConferenceBar from '@/components/organisms/VideoConferenceBar';
import VideoConferenceSidebar from '@/components/organisms/VideoConferenceSidebar';

// TrackInfo 타입 정의
interface TrackInfo {
    trackPublication: RemoteTrackPublication;
    participantIdentity: string;
}



const VideoConferencePage: React.FC = () => {
    const location = useLocation();
    // state 우선, 없으면 쿼리스트링에서 파싱
    let sessionInfo = location.state as {
        wsUrl: string;
        token: string;
        roomName: string;
        sessionId: string;
    } | null;
    if (!sessionInfo) {
        const params = new URLSearchParams(location.search);
        const wsUrl = params.get('wsUrl');
        const token = params.get('token');
        const roomName = params.get('roomName');
        const sessionId = params.get('sessionId');
        if (wsUrl && token && roomName && sessionId) {
            sessionInfo = { wsUrl, token, roomName, sessionId };
        } else {
            sessionInfo = null;
        }
    }

    // LiveKit URL/token은 sessionInfo에서 받아옴
    const LIVEKIT_URL = sessionInfo?.wsUrl || '';
    const TOKEN = sessionInfo?.token || '';
    const PARTICIPANT_NAME = sessionInfo?.sessionId || ('Participant' + Math.floor(Math.random() * 100));

    const [room, setRoom] = useState<Room | undefined>(undefined);
    const [localTrack, setLocalTrack] = useState<LocalVideoTrack | undefined>(undefined);
    const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]);

    // Add state for video conference controls
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    async function joinRoom() {
        if (!LIVEKIT_URL || !TOKEN) return;
        const room = new Room();
        setRoom(room);

        room.on(
            RoomEvent.TrackSubscribed,
            (_track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
                setRemoteTracks((prev) => [
                    ...prev,
                    { trackPublication: publication, participantIdentity: participant.identity }
                ]);
            }
        );
        room.on(RoomEvent.TrackUnsubscribed, (_track: RemoteTrack, publication: RemoteTrackPublication) => {
            setRemoteTracks((prev) => prev.filter((track) => track.trackPublication.trackSid !== publication.trackSid));
        });

        try {
            await room.connect(LIVEKIT_URL, TOKEN);
            await room.localParticipant.enableCameraAndMicrophone();
            setLocalTrack(room.localParticipant.videoTrackPublications.values().next().value?.videoTrack);
        } catch (error) {
            console.log('There was an error connecting to the room:', (error as Error).message);
            await leaveRoom();
        }
    }

    async function leaveRoom() {
        await room?.disconnect();
        setRoom(undefined);
        setLocalTrack(undefined);
        setRemoteTracks([]);
    }

    // 자동 입장
    React.useEffect(() => {
        if (!room && LIVEKIT_URL && TOKEN) {
            joinRoom();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [LIVEKIT_URL, TOKEN]);

    // participants 배열에 video/audio 모두 포함
    type ParticipantMedia = {
        id: string;
        identity: string;
        isLocal: boolean;
        videoTrack?: LocalVideoTrack | RemoteVideoTrack;
        audioTrack?: LocalAudioTrack | RemoteAudioTrack;
    };

    const participantMap = new Map<string, ParticipantMedia>();

    // remote 참가자 트랙 그룹핑
    remoteTracks.forEach((t) => {
        const id = t.participantIdentity;
        if (!participantMap.has(id)) {
            participantMap.set(id, {
                id: t.trackPublication.trackSid,
                identity: id,
                isLocal: false,
            });
        }
        const obj = participantMap.get(id)!;
        if (t.trackPublication.kind === 'video' && t.trackPublication.videoTrack) {
            obj.videoTrack = t.trackPublication.videoTrack;
        }
        if (t.trackPublication.kind === 'audio' && t.trackPublication.audioTrack) {
            obj.audioTrack = t.trackPublication.audioTrack as RemoteAudioTrack;
        }
    });

    // local 참가자 추가 
    if (localTrack) {
        participantMap.set(PARTICIPANT_NAME, {
            id: PARTICIPANT_NAME,
            identity: PARTICIPANT_NAME,
            isLocal: true,
            videoTrack: localTrack,
        });
    }

    const participants: ParticipantMedia[] = Array.from(participantMap.values());

    // 사용자 마이크 ON/OFF
    const toggleAudio = () => {
        setIsAudioEnabled(!isAudioEnabled);
        room?.localParticipant.setMicrophoneEnabled(!isAudioEnabled);
    };

    // 사용자 카메라 ON/OFF
    const toggleVideo = () => {
        setIsVideoEnabled(!isVideoEnabled);
        room?.localParticipant.setCameraEnabled(!isVideoEnabled);
    };

    // 사이드바 토글
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);

    };

    // 화면 공유 토글
    const toggleScreenShare = () => {
        setIsScreenSharing(!isScreenSharing);
    };

    // 세션 종료
    const closeSession = () => {
        leaveRoom();
        window.close();
    }

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#222' }}>
            <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                <div style={{ flex: isSidebarOpen ? '1 1 0%' : '1 1 100%', height: '100%', position: 'relative' }}>
                    <VideoConferenceMainContent participants={participants} />
                    <div
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: isSidebarOpen ? 320 : 0,
                            bottom: 0,
                            zIndex: 50,
                            transition: 'right 0.3s',
                        }}
                    >
                        <VideoConferenceBar
                            isAudioEnabled={isAudioEnabled}
                            isVideoEnabled={isVideoEnabled}
                            isSidebarOpen={isSidebarOpen}
                            isScreenSharing={isScreenSharing}
                            onToggleAudio={toggleAudio}
                            onToggleVideo={toggleVideo}
                            onToggleSidebar={toggleSidebar}
                            onToggleScreenShare={toggleScreenShare}
                            onExitSession={closeSession}
                        />
                    </div>
                </div>
                {isSidebarOpen && (
                    <div style={{ width: 320, height: '100%', background: '#2d2d2d', zIndex: 100 }}>
                        <VideoConferenceSidebar
                            participants={participants}
                            onCloseSidebar={toggleSidebar}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
export default VideoConferencePage;


