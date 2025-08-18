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
    RemoteVideoTrack,
    LocalTrack,
    Track
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
        studyId?: string;
    } | null;
    if (!sessionInfo) {
        const params = new URLSearchParams(location.search);
        const wsUrl = params.get('wsUrl');
        const token = params.get('token');
        const roomName = params.get('roomName');
        const sessionId = params.get('sessionId');
        const studyId = params.get('studyId');
        if (wsUrl && token && roomName && sessionId) {
            sessionInfo = { wsUrl, token, roomName, sessionId, studyId: studyId || undefined };
        } else {
            sessionInfo = null;
        }
    }

    // LiveKit URL/token은 sessionInfo에서 받아옴
    const LIVEKIT_URL = sessionInfo?.wsUrl || '';
    const TOKEN = sessionInfo?.token || '';
    const PARTICIPANT_NAME = sessionInfo?.sessionId || ('Participant' + Math.floor(Math.random() * 100));
    const STUDY_ID = sessionInfo?.studyId || '';

    const [room, setRoom] = useState<Room | undefined>(undefined);
    const [localTrack, setLocalTrack] = useState<LocalVideoTrack | undefined>(undefined);
    const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]);

    // Add state for video conference controls
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Screen Sharing Section
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [screenShareTrack, setScreenShareTrack] = useState<LocalVideoTrack | undefined>(undefined);

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

        // Listen for track published events to detect screen sharing
        room.on(RoomEvent.TrackPublished, (publication: RemoteTrackPublication, participant: RemoteParticipant) => {
            // If this is a screen share track from another participant, add it to remote tracks
            if (publication.source === Track.Source.ScreenShare) {
                setRemoteTracks((prev) => [
                    ...prev,
                    { trackPublication: publication, participantIdentity: participant.identity }
                ]);
            }
        });

        // Listen for track unpublished events
        room.on(RoomEvent.TrackUnpublished, (publication: RemoteTrackPublication) => {
            // Remove screen share tracks when they're unpublished
            if (publication.source === Track.Source.ScreenShare) {
                setRemoteTracks((prev) => prev.filter((track: TrackInfo) => track.trackPublication.trackSid !== publication.trackSid));
            }
        });

        try {
            await room.connect(LIVEKIT_URL, TOKEN);
            await room.localParticipant.enableCameraAndMicrophone();

            // Get the camera track specifically (not screen share)
            const cameraTrack = room.localParticipant.videoTrackPublications.values().next().value?.videoTrack;
            if (cameraTrack && cameraTrack.source === Track.Source.Camera) {
                setLocalTrack(cameraTrack);
            }
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

    // Screen sharing state synchronization
    React.useEffect(() => {
        const handleScreenShareChange = () => {
            // Check if screen sharing is still active
            if (isScreenSharing && screenShareTrack) {
                // If the track is no longer active, update the state
                if (screenShareTrack.mediaStreamTrack?.readyState === 'ended') {
                    setIsScreenSharing(false);
                    setScreenShareTrack(undefined);
                }
            }
        };

        // Listen for screen sharing changes
        const checkScreenShare = setInterval(handleScreenShareChange, 1000);

        // Also listen for the MediaStreamTrack ended event
        if (screenShareTrack?.mediaStreamTrack) {
            const mediaStreamTrack = screenShareTrack.mediaStreamTrack;
            const handleTrackEnded = () => {
                setIsScreenSharing(false);
                setScreenShareTrack(undefined);
            };

            mediaStreamTrack.addEventListener('ended', handleTrackEnded);
            return () => {
                clearInterval(checkScreenShare);
                mediaStreamTrack.removeEventListener('ended', handleTrackEnded);
            };
        }

        return () => {
            clearInterval(checkScreenShare);
        };
    }, [isScreenSharing, screenShareTrack]);

    // Monitor local participant tracks to ensure camera track is always available
    React.useEffect(() => {
        if (!room) return;

        const handleTrackPublished = (publication: any) => {
            if (publication.source === Track.Source.Camera && publication.kind === 'video') {
                const videoTrack = publication.videoTrack;
                if (videoTrack) {
                    setLocalTrack(videoTrack);
                }
            }
        };

        const handleTrackUnpublished = (publication: any) => {
            if (publication.source === Track.Source.Camera && publication.kind === 'video') {
                setLocalTrack(undefined);
            }
        };

        room.on(RoomEvent.TrackPublished, handleTrackPublished);
        room.on(RoomEvent.TrackUnpublished, handleTrackUnpublished);

        return () => {
            room.off(RoomEvent.TrackPublished, handleTrackPublished);
            room.off(RoomEvent.TrackUnpublished, handleTrackUnpublished);
        };
    }, [room]);

    // Monitor local screen share tracks
    React.useEffect(() => {
        if (!room) return;

        const handleLocalTrackPublished = (publication: any) => {
            if (publication.source === Track.Source.ScreenShare && publication.kind === 'video') {
                const videoTrack = publication.videoTrack;
                if (videoTrack) {
                    setScreenShareTrack(videoTrack);
                    setIsScreenSharing(true);
                }
            }
        };

        const handleLocalTrackUnpublished = (publication: any) => {
            if (publication.source === Track.Source.ScreenShare && publication.kind === 'video') {
                setScreenShareTrack(undefined);
                setIsScreenSharing(false);
            }
        };

        room.localParticipant.on(RoomEvent.TrackPublished, handleLocalTrackPublished);
        room.localParticipant.on(RoomEvent.TrackUnpublished, handleLocalTrackUnpublished);

        return () => {
            room.localParticipant.off(RoomEvent.TrackPublished, handleLocalTrackPublished);
            room.localParticipant.off(RoomEvent.TrackUnpublished, handleLocalTrackUnpublished);
        };
    }, [room]);

    // participants 배열에 video/audio 모두 포함
    type ParticipantMedia = {
        id: string;
        identity: string;
        isLocal: boolean;
        videoTrack?: LocalVideoTrack | RemoteVideoTrack;
        audioTrack?: LocalAudioTrack | RemoteAudioTrack;
        // Screen Share
        isScreenShare?: boolean;
    };

    const participantMap = new Map<string, ParticipantMedia>();

    // remote 참가자 트랙 그룹핑
    remoteTracks.forEach((t) => {
        const id = t.participantIdentity;
        const isScreenShare = t.trackPublication.source === Track.Source.ScreenShare;

        if (!participantMap.has(id)) {
            participantMap.set(id, {
                id: t.trackPublication.trackSid,
                identity: id,
                isLocal: false,
                isScreenShare: isScreenShare,
            });
        }
        const obj = participantMap.get(id)!;

        // Update isScreenShare flag if this track is a screen share
        if (isScreenShare) {
            obj.isScreenShare = true;
        }

        if (t.trackPublication.kind === 'video' && t.trackPublication.videoTrack) {
            obj.videoTrack = t.trackPublication.videoTrack;
        }
        if (t.trackPublication.kind === 'audio' && t.trackPublication.audioTrack) {
            obj.audioTrack = t.trackPublication.audioTrack as RemoteAudioTrack;
        }
    });

    // local 참가자 추가 - only when not screen sharing
    if (localTrack && !isScreenSharing) {
        participantMap.set(PARTICIPANT_NAME, {
            id: PARTICIPANT_NAME,
            identity: PARTICIPANT_NAME,
            isLocal: true,
            videoTrack: localTrack,
        });
    }

    // Screen Share 참여자 추가 - only when screen sharing is active
    if (screenShareTrack && isScreenSharing) {
        participantMap.set(`${PARTICIPANT_NAME}_screen`, {
            id: `${PARTICIPANT_NAME}_screen`,
            identity: PARTICIPANT_NAME, // Use the actual publisher's identity
            isLocal: true,
            videoTrack: screenShareTrack,
            isScreenShare: true,
        });
    }

    const participants: ParticipantMedia[] = Array.from(participantMap.values());

    // 사용자 마이크 ON/OFF
    const toggleAudio = () => {
        setIsAudioEnabled(!isAudioEnabled);
        room?.localParticipant.setMicrophoneEnabled(!isAudioEnabled);
    };

    // 사용자 카메라 ON/OFF
    const toggleVideo = async () => {
        const newVideoState = !isVideoEnabled;
        setIsVideoEnabled(newVideoState);

        if (newVideoState) {
            // Enable camera and update local track
            await room?.localParticipant.setCameraEnabled(true);
            // Get the updated camera track
            const cameraTrack = room?.localParticipant.videoTrackPublications.values().next().value?.videoTrack;
            if (cameraTrack && cameraTrack.source === Track.Source.Camera) {
                setLocalTrack(cameraTrack);
            }
        } else {
            await room?.localParticipant.setCameraEnabled(false);
            setLocalTrack(undefined);
        }
    };

    // 사이드바 토글
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);

    };

    // 화면 공유 토글
    const toggleScreenShare = async () => {
        try {
            if (isScreenSharing) { // case : 화면 공유 중지
                await room?.localParticipant.setScreenShareEnabled(false);
                setScreenShareTrack(undefined);
                setIsScreenSharing(false);
            } else { // case : 화면 공유 시작
                // Ensure camera is enabled before starting screen share
                if (!isVideoEnabled) {
                    await room?.localParticipant.setCameraEnabled(true);
                    setIsVideoEnabled(true);
                }

                const screenTracks = await room?.localParticipant.createScreenTracks({
                    audio: true,
                });

                if (!screenTracks || screenTracks.length === 0) {
                    throw new Error('Failed to create screen tracks');
                }

                screenTracks.forEach((screenTrack: LocalTrack) => {
                    room?.localParticipant.publishTrack(screenTrack);

                    if (screenTrack.kind === 'video') {
                        setScreenShareTrack(screenTrack as LocalVideoTrack);
                    }
                });

                setIsScreenSharing(true);
            }
        } catch (error) {
            console.error('Error toggling screen share:', error);
            setIsScreenSharing(false);
            setScreenShareTrack(undefined);
        }
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
                    <div style={{ height: '100%', paddingBottom: '88px' }}>
                        <VideoConferenceMainContent participants={participants} />
                    </div>
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
                            studyId={STUDY_ID}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
export default VideoConferencePage;



