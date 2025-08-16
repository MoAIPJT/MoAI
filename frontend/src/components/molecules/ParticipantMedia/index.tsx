import { LocalVideoTrack, RemoteVideoTrack, LocalAudioTrack, RemoteAudioTrack } from "livekit-client";
import VideoComponent from "../../atoms/VideoComponent";
import AudioComponent from "../../atoms/AudioComponent";

interface ParticipantMediaProps {
    videoTrack?: LocalVideoTrack | RemoteVideoTrack;
    audioTrack?: LocalAudioTrack | RemoteAudioTrack;
    participantIdentity: string;
    local?: boolean;
}

function ParticipantMedia({
    videoTrack,
    audioTrack,
    participantIdentity,
    local = false,
}: ParticipantMediaProps) {
    return (
        <div>
            {videoTrack && <VideoComponent track={videoTrack} participantIdentity={participantIdentity} local={local} />}
            {audioTrack && <AudioComponent track={audioTrack} />}
        </div>
    );
}

export default ParticipantMedia;