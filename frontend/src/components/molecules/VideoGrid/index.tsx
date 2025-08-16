import ParticipantMedia from "../ParticipantMedia";
import { LocalVideoTrack, RemoteVideoTrack, LocalAudioTrack, RemoteAudioTrack } from "livekit-client";

interface Participant {
    id: string;
    identity: string;
    videoTrack?: LocalVideoTrack | RemoteVideoTrack;
    audioTrack?: LocalAudioTrack | RemoteAudioTrack;
    isLocal?: boolean;
}

interface VideoGridProps {
    participants: Participant[];
}

function VideoGrid({ participants }: VideoGridProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            {participants.map((p) => (
                <ParticipantMedia
                    key={p.id}
                    videoTrack={p.videoTrack}
                    audioTrack={p.audioTrack}
                    participantIdentity={p.identity}
                    local={p.isLocal}
                />
            ))}
        </div>
    );
}

export default VideoGrid;
