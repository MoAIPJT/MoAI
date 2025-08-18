import ParticipantMedia from "../ParticipantMedia";
import { LocalVideoTrack, RemoteVideoTrack, LocalAudioTrack, RemoteAudioTrack } from "livekit-client";

interface Participant {
    id: string;
    identity: string;
    videoTrack?: LocalVideoTrack | RemoteVideoTrack;
    audioTrack?: LocalAudioTrack | RemoteAudioTrack;
    isLocal?: boolean;
    isScreenShare?: boolean;
}

interface VideoGridProps {
    participants: Participant[];
}

function VideoGrid({ participants }: VideoGridProps) {

    // Separate screen share and regular participants
    // When ANY participant is screen sharing, hide ALL camera tracks and show only screen shares
    const screenShareParticipants = participants.filter(p => p.isScreenShare);
    const regularParticipants = participants.filter(p => !p.isScreenShare);

    // If there's ANY screen sharing, show ONLY the screen shares (full screen)
    if (screenShareParticipants.length > 0) {
        // For now, show the first screen share participant
        // In the future, you could implement a grid for multiple screen shares
        const primaryScreenShare = screenShareParticipants[0];

        return (
            <div className="w-full h-full flex items-center justify-center p-4">
                <div
                    className="bg-black rounded overflow-hidden"
                    style={{
                        width: '100%',
                        height: '100%',
                        maxWidth: 'calc(100vh * 16 / 9)', // 16:9 aspect ratio
                        maxHeight: 'calc(100vh - 2rem)', // Full height minus padding
                    }}
                >
                    <ParticipantMedia
                        videoTrack={primaryScreenShare.videoTrack}
                        audioTrack={primaryScreenShare.audioTrack}
                        participantIdentity={primaryScreenShare.identity}
                        local={primaryScreenShare.isLocal}
                        isScreenShare={primaryScreenShare.isScreenShare}
                    />
                </div>
            </div>
        );
    } else {
        // Original grid layout for when there's no screen sharing (show cameras)
        const count = Math.min(regularParticipants.length, 9);

        // 그리드 레이아웃 계산
        let cols: number;
        let rows: number;

        switch (count) {
            case 1:
                cols = 1;
                rows = 1;
                break;
            case 2:
                cols = 2;
                rows = 1;
                break;
            case 3:
            case 4:
                cols = 2;
                rows = 2;
                break;
            case 5:
            case 6:
                cols = 3;
                rows = 2;
                break;
            case 7:
            case 8:
            case 9:
                cols = 3;
                rows = 3;
                break;
            default:
                cols = Math.ceil(Math.sqrt(count));
                rows = Math.ceil(count / cols);
        }

        return (
            <div
                className="grid gap-2 w-full h-full p-4"
                style={{
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                }}
            >
                {regularParticipants.slice(0, 9).map((p) => (
                    <div key={p.id} className="w-full h-full flex items-center justify-center bg-black rounded overflow-hidden">
                        <ParticipantMedia
                            key={p.id}
                            videoTrack={p.videoTrack}
                            audioTrack={p.audioTrack}
                            participantIdentity={p.identity}
                            local={p.isLocal}
                        />
                    </div>
                ))}
            </div>
        );
    }
}
export default VideoGrid;
