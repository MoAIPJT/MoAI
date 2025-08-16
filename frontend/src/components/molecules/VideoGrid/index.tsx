import { useRef, useEffect, forwardRef } from 'react';
import { Track } from 'livekit-client';
import type { VideoGridProps } from './types';
import VideoParticipant from '../../atoms/VideoParticipant';

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

  // 비디오 트랙 연결을 위한 useEffect - 제거됨 (VideoParticipant에서 직접 처리)

  // 로컬 비디오 트랙 연결
  useEffect(() => {
    const videoElement = videoRef.current;
    if (localVideoTrack && videoElement) {
      console.log('로컬 비디오 트랙 연결:', localVideoTrack);
      localVideoTrack.attach(videoElement);
    }
    
    return () => {
      if (localVideoTrack && videoElement) {
        console.log('로컬 비디오 트랙 해제');
        localVideoTrack.detach(videoElement);
      }
    };
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
           <VideoParticipant
             ref={videoRef}
             participantId="local"
             participantName="나 (데모)"
             hasVideo={isVideoEnabled}
             isVideoEnabled={isVideoEnabled}
             isSpeaking={speakingParticipantId === 'local'}
             isLocal={true}
             isDemo={true}
           />

                     {/* 데모 참가자들 */}
           {demoParticipants.map((participant) => (
             <VideoParticipant
               key={participant.id}
               ref={(el: HTMLVideoElement | null) => { demoVideoRefs.current[participant.id] = el; }}
               participantId={participant.id}
               participantName={participant.name}
               hasVideo={participant.hasVideo}
               isVideoEnabled={participant.hasVideo}
               isSpeaking={speakingParticipantId === participant.id}
               isDemo={true}
             />
           ))}
        </>
      ) : (
        <>
                     {/* 로컬 비디오 - 항상 첫 번째 위치에 표시 */}
           <VideoParticipant
             ref={videoRef}
             participantId="local"
             participantName={participantName || '나'}
             hasVideo={isVideoEnabled}
             isVideoEnabled={isVideoEnabled}
             isSpeaking={speakingParticipantId === 'local'}
             isLocal={true}
           />

                     {/* 원격 참가자들 */}
           {(() => {
             const participants = Array.from(remoteParticipants.values());
             console.log('VideoGrid 렌더링:', {
               remoteParticipantsCount: remoteParticipants.size,
               participantIds: Array.from(remoteParticipants.keys()),
               participants: participants.map(p => ({ sid: p.sid, identity: p.identity }))
             });
             
             return participants.map((participant, index) => {
               const participantState = remoteParticipantStates.get(participant.sid);
               const isVideoEnabled = participantState ? participantState.video : true;
               
               // 카메라 트랙 가져오기 (화면 공유 트랙 제외)
               const videoTrack = participant.getTrackPublication(Track.Source.Camera)?.track;

               console.log('렌더링 중인 원격 참가자:', {
                 participantId: participant.sid,
                 participantName: participant.identity,
                 hasVideoTrack: !!videoTrack,
                 isVideoEnabled,
                 participantState
               });

               return (
                 <VideoParticipant
                   key={participant.sid}
                   participantId={participant.sid}
                   participantName={participant.identity || `참가자 ${index + 1}`}
                   hasVideo={isVideoEnabled && !!videoTrack}
                   isVideoEnabled={isVideoEnabled && !!videoTrack}
                   isSpeaking={speakingParticipantId === participant.sid}
                   videoTrack={videoTrack}
                 />
               );
             });
           })()}
        </>
      )}
    </div>
  );
});

VideoGrid.displayName = 'VideoGrid';

export default VideoGrid;
