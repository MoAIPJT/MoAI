import { useRef, useEffect, forwardRef } from 'react';
import { Track } from 'livekit-client';
import type { VideoGridProps } from './types';
import LocalVideo from '../../atoms/LocalVideo';
import RemoteVideo from '../../atoms/RemoteVideo';
import DemoParticipantVideo from '../../atoms/DemoParticipantVideo';

const VideoGrid = forwardRef<HTMLDivElement, VideoGridProps>(({
  isDemoMode,
  demoParticipants,
  remoteParticipants,
  localVideoTrack,
  isVideoEnabled,
  participantName,
  remoteParticipantStates,
  cols,
  rows,
  speakingParticipantId
}, ref) => {
  const subscribersRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const demoVideoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  // 비디오 트랙 연결을 위한 useEffect
  useEffect(() => {
    if (subscribersRef.current && remoteParticipants.size > 0) {
      const videoElements = subscribersRef.current.querySelectorAll('video');
      remoteParticipants.forEach((participant, participantId) => {
        const videoTracks = Array.from(participant.videoTrackPublications.values());
        videoTracks.forEach(trackPublication => {
          const track = trackPublication.track;
          if (track) {
            // 화면 공유 트랙은 제외 (여러 방법으로 감지)
            const isScreenShare = (trackPublication as any).source === 'screen-share' ||
                                 (trackPublication as any).source === 'screen' ||
                                 (trackPublication as any).source === Track.Source.ScreenShare ||
                                 (trackPublication as any).name === 'screen' ||
                                 (trackPublication as any).kind === 'screen-share';
            if (isScreenShare) {
              console.log('화면 공유 트랙 제외됨:', participantId);
              return;
            }
            
            const videoElement = Array.from(videoElements).find(el => 
              el.id === participantId || el.dataset.participantId === participantId
            );
            if (videoElement) {
              track.detach();
              track.attach(videoElement);
            }
          }
        });
      });
    }
  }, [remoteParticipants]);

  // 로컬 비디오 트랙 연결
  useEffect(() => {
    if (localVideoTrack && videoRef.current) {
      localVideoTrack.attach(videoRef.current);
    }
  }, [localVideoTrack]);

  const getGridStyle = () => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gap: '0.5rem',
    height: '100%',
    width: '100%'
  });

  return (
    <div 
      ref={ref || subscribersRef}
      className="w-full h-full max-w-6xl"
      style={getGridStyle()}
    >
      {isDemoMode ? (
        <>
          {/* 내 비디오 (데모) */}
          <LocalVideo
            ref={videoRef}
            isVideoEnabled={isVideoEnabled}
            participantName="나 (데모)"
            isSpeaking={speakingParticipantId === 'local'}
          />
          
          {/* 데모 참가자들 */}
          {demoParticipants.map((participant) => (
            <DemoParticipantVideo
              key={participant.id}
              ref={(el: HTMLVideoElement | null) => { demoVideoRefs.current[participant.id] = el; }}
              participantId={participant.id}
              participantName={participant.name}
              hasVideo={participant.hasVideo}
              isSpeaking={speakingParticipantId === participant.id}
            />
          ))}
        </>
      ) : (
        <>
          {/* 로컬 비디오 - 항상 첫 번째 위치에 표시 */}
          <LocalVideo
            ref={videoRef}
            isVideoEnabled={isVideoEnabled}
            participantName={participantName || '나'}
            isSpeaking={speakingParticipantId === 'local'}
          />
          
          {/* 원격 참가자들 */}
          {Array.from(remoteParticipants.values()).map((participant, index) => {
            const participantState = remoteParticipantStates.get(participant.sid);
            const isVideoEnabled = participantState ? participantState.video : true;
            
            return (
              <RemoteVideo
                key={participant.sid}
                participantId={participant.sid}
                participantName={participant.identity || `참가자 ${index + 1}`}
                isVideoEnabled={isVideoEnabled}
                isSpeaking={speakingParticipantId === participant.sid}
              />
            );
          })}
        </>
      )}
    </div>
  );
});

VideoGrid.displayName = 'VideoGrid';

export default VideoGrid;
