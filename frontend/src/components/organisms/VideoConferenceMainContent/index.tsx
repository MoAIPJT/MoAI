import VideoGrid from "../../molecules/VideoGrid";
import { LocalVideoTrack, RemoteVideoTrack, LocalAudioTrack, RemoteAudioTrack } from "livekit-client";

interface Participant {
    id: string;
    identity: string;
    videoTrack?: LocalVideoTrack | RemoteVideoTrack;
    audioTrack?: LocalAudioTrack | RemoteAudioTrack;
    isLocal?: boolean;
}

interface VideoConferenceMainContentProps {
    participants: Participant[];
}

function VideoConferenceMainContent({ participants }: VideoConferenceMainContentProps) {
    return (
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <VideoGrid participants={participants} />
        </div>
    );
}

export default VideoConferenceMainContent;
