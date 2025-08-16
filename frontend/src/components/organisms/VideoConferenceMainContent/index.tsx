import React, { useEffect, useRef, useState } from 'react';
import { RemoteParticipant } from 'livekit-client';

// minimal track shape used for attach/detach
type MediaTrackWithAttach = {
  attach: (el: HTMLMediaElement) => void;
  detach?: (el?: HTMLMediaElement) => void;
}
import VideoGrid from '../../molecules/VideoGrid';

interface VideoConferenceMainContentProps {
  isConnected: boolean;
  isDemoMode: boolean;
  isScreenSharing: boolean;
  screenShareParticipant: string;
  screenShareStream: MediaStream | null;
  demoParticipants: Array<{id: string, name: string, hasAudio: boolean, hasVideo: boolean}>;
  remoteParticipants: Map<string, RemoteParticipant>;
  // LiveKit/Track types are not imported here; use unknown for safety
  // minimal shape for tracks provided by the RTC client (attach/detach)
  remoteVideoTracks?: Map<string, MediaTrackWithAttach | null>;
  remoteAudioTracks?: Map<string, MediaTrackWithAttach | null>;
  localVideoTrack: MediaTrackWithAttach | null;
  isVideoEnabled: boolean;
  participantName: string;
  remoteParticipantStates: Map<string, {audio: boolean, video: boolean}>;
  cols: number;
  rows: number;
  speakingParticipantId?: string;
}

const VideoConferenceMainContent: React.FC<VideoConferenceMainContentProps> = ({
  isConnected,
  isDemoMode,
  isScreenSharing,
  screenShareParticipant,
  screenShareStream,
  demoParticipants,
  remoteParticipants,
  remoteVideoTracks,
  remoteAudioTracks,
  localVideoTrack,
  isVideoEnabled,
  participantName,
  remoteParticipantStates,
  cols,
  rows,
<<<<<<< HEAD
=======
  // pdfViewerRef removed (not used here)
>>>>>>> 3a556c39ca138d861f31567486d7496ea57c9eb3
  speakingParticipantId,
}) => {
  const screenShareVideoRef = useRef<HTMLVideoElement>(null);

  // 원격 참가자 비디오/오디오 트랙 attach/detach
  useEffect(() => {
    if (!remoteVideoTracks && !remoteAudioTracks) return;

    remoteVideoTracks?.forEach((track, id: string) => {
      const videoEl = document.getElementById(`remote-video-${id}`) as HTMLVideoElement | null;
      if (videoEl && track && typeof track.attach === 'function') {
        try {
          track.attach(videoEl);
          // try to play in case autoplay is allowed
          if (videoEl.play) {
            const p = videoEl.play();
            if (p && typeof (p as Promise<unknown>).catch === 'function') {
              (p as Promise<unknown>).catch(() => { /* ignore autoplay rejection */ })
            }
          }
          console.log('Attached remote video track for', id);
        } catch (e) { console.warn('attach video failed', e); }
      }
    });

  remoteAudioTracks?.forEach((track, id: string) => {
      const audioEl = document.getElementById(`remote-audio-${id}`) as HTMLAudioElement | null;
      if (audioEl && track && typeof track.attach === 'function') {
        try {
          track.attach(audioEl);
          // ensure audio element is able to play
          try {
      // keep element muted for autoplay safety; user action will unmute
      audioEl.volume = 1;
      const p = audioEl.play && audioEl.play();
      if (p && typeof p.catch === 'function') p.catch(() => console.warn('Audio play blocked by browser autoplay policy'))
          } catch (err) {
            console.warn('audio play attempt failed', err)
          }
          console.log('Attached remote audio track for', id);
        } catch (e) { console.warn('attach audio failed', e); }
      }
    });

    return () => {
      remoteVideoTracks?.forEach((track, id: string) => {
        const videoEl = document.getElementById(`remote-video-${id}`) as HTMLVideoElement | null;
        if (videoEl && track && typeof track.detach === 'function') {
          try { track.detach(videoEl); } catch { /* ignore */ }
        }
      });
      remoteAudioTracks?.forEach((track, id: string) => {
        const audioEl = document.getElementById(`remote-audio-${id}`) as HTMLAudioElement | null;
        if (audioEl && track && typeof track.detach === 'function') {
          try { track.detach(audioEl); } catch { /* ignore */ }
        }
      });
    };
  }, [remoteVideoTracks, remoteAudioTracks, remoteParticipants]);

  // Helper to render hidden media elements for attach
  const renderHiddenMediaElements = () => {
    // collect ids from participants and any remote track maps so we don't miss elements during races
    const idSet = new Set<string>();
    if (remoteParticipants) for (const k of remoteParticipants.keys()) idSet.add(k);
    if (remoteVideoTracks) for (const k of Array.from(remoteVideoTracks.keys())) idSet.add(k);
    if (remoteAudioTracks) for (const k of Array.from(remoteAudioTracks.keys())) idSet.add(k);
    const keys = Array.from(idSet);
    if (keys.length === 0) return null;
    console.log('Rendering hidden media elements for', keys);
    
    // Use visually-hidden container instead of display:none so audio can play
    return (
      <div style={{ position: 'absolute', left: -9999, top: -9999, width: 1, height: 1, overflow: 'hidden' }}>
        {keys.map(id => {
          const hasVideo = remoteVideoTracks?.has(id);
          const hasAudio = remoteAudioTracks?.has(id);
          
          return (
            <div key={`media-${id}`}>
              {hasVideo && (
                <video 
                  id={`remote-video-${id}`} 
                  autoPlay 
                  playsInline 
                  muted={false}
                  style={{ width: '1px', height: '1px' }}
                />
              )}
              {hasAudio && (
                <audio 
                  id={`remote-audio-${id}`} 
                  autoPlay 
                  muted
                  style={{ width: '1px', height: '1px' }}
                />
              )}
            </div>
          );
        })}

        {renderAudioActivationButton(keys)}
      </div>
    );
  }

  const [audioActivated, setAudioActivated] = useState(false);

  const renderAudioActivationButton = (ids: string[]) => {
    // show button only when there are remote audio tracks and audio hasn't been activated
    const hasRemoteAudio = !!(remoteAudioTracks && remoteAudioTracks.size > 0);
    if (!hasRemoteAudio || audioActivated) return null;

    return (
      <div style={{ position: 'absolute', right: 12, bottom: 12 }}>
        <button
            onClick={() => {
              // unmute and play all audio elements; this must be triggered by user gesture
              ids.forEach(id => {
                const audioEl = document.getElementById(`remote-audio-${id}`) as HTMLAudioElement | null;
                if (audioEl) {
                  try {
                    audioEl.muted = false;
                    audioEl.volume = 1;
                    const p = audioEl.play && audioEl.play();
                    if (p && typeof p.catch === 'function') p.catch(() => console.warn('Audio play blocked after activation'));
                  } catch (err) { console.warn('activate audio failed for', id, err); }
                }
              });
              setAudioActivated(true);
            }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium"
        >
          소리 켜기
        </button>
      </div>
    );
  }

  // 화면 공유 스트림 연결
  useEffect(() => {
    if (screenShareStream && screenShareVideoRef.current) {
      screenShareVideoRef.current.srcObject = screenShareStream;
    }
  }, [screenShareStream]);

  if (!isDemoMode && !isConnected) {
    return (
      <div className="flex-1 flex items-center justify-center p-2 min-h-0 overflow-hidden">
        <div className="text-center text-white">
          <p className="text-lg mb-4">화상회의에 연결 중...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  // 연결된 경우 항상 화면 표시 (로컬 참가자는 항상 있음)
  // 원격 참가자가 없어도 본인 화면은 보여줘야 함

  // 화면 공유 모드일 때
  if (isScreenSharing) {
    return (
      <div className="flex-1 flex items-center justify-center p-2 min-h-0 overflow-hidden">
        <div className="flex w-full h-full gap-4">
<<<<<<< HEAD
=======
          {/* 좌측: 참가자 화면들 */}
          <div className="w-1/4 flex flex-col gap-2">
            <div className="text-center text-white text-xs mb-2">
              <span className="bg-gray-700 px-2 py-1 rounded">
                참가자 화면
                <span className="ml-1 text-blue-400">(화면 공유 모드)</span>
              </span>
            </div>
            <VideoGrid
              isDemoMode={isDemoMode}
              demoParticipants={demoParticipants}
              remoteParticipants={remoteParticipants}
              localVideoTrack={localVideoTrack}
              isVideoEnabled={isVideoEnabled}
              participantName={participantName}
              remoteParticipantStates={remoteParticipantStates}
              cols={1}
              rows={4}
              speakingParticipantId={speakingParticipantId}
            />
          </div>

          {/* 중앙: 화면 공유 영역 */}
          <div className="flex-1">
            <div className="bg-gray-800 rounded-lg h-full flex items-center justify-center relative overflow-hidden">
              {/* LiveKit 화면 공유 트랙을 렌더링할 div */}
              <div 
                id="screen-share-container"
                className="w-full h-full flex items-center justify-center bg-gray-900"
                style={{ minHeight: '400px' }}
              >
                <div className="text-gray-400 text-center">
                  <div className="text-2xl mb-2">🖥️</div>
                  <div className="text-sm">화면 공유 중...</div>
                  <div className="text-xs mt-1">{screenShareParticipant}의 화면</div>
                  <div className="text-xs mt-2 text-gray-500">
                    화면 공유 트랙이 연결되면 여기에 표시됩니다
                  </div>
                </div>
              </div>
              
              {/* 화면 공유 정보 오버레이 */}
              <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded">
                <div className="text-sm font-semibold">
                  {screenShareParticipant}의 화면 공유
                </div>
              </div>
              
              {/* 화면 공유 중지 버튼 (자신이 공유 중일 때만) */}
              {screenShareParticipant === participantName && (
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => {
                      // 화면 공유 중지 이벤트 발생
                      const event = new CustomEvent('stop-screen-share');
                      window.dispatchEvent(event);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                  >
                    공유 중지
                  </button>
                </div>
              )}
            </div>
            {renderHiddenMediaElements()}
          </div>
        </div>
      </div>
    );
  }

  // PDF 뷰어 모드일 때
  if (isPdfViewerMode) {
    return (
      <div className="flex-1 flex items-center justify-center p-2 min-h-0 overflow-hidden">
        <div className="flex w-full h-full gap-4">
>>>>>>> 3a556c39ca138d861f31567486d7496ea57c9eb3
          {/* 좌측: 사용자 화면들 */}
          <div className="w-1/4 flex flex-col gap-2">
            <div className="text-center text-white text-xs mb-2">
              <span className="bg-gray-700 px-2 py-1 rounded">
                참가자 화면
              </span>
            </div>
            <VideoGrid
              isDemoMode={isDemoMode}
              demoParticipants={demoParticipants}
              remoteParticipants={remoteParticipants}
              localVideoTrack={localVideoTrack}
              isVideoEnabled={isVideoEnabled}
              participantName={participantName}
              remoteParticipantStates={remoteParticipantStates}
              cols={1}
              rows={4}
              speakingParticipantId={speakingParticipantId}
            />
          </div>

          {/* 중앙: 화면 공유 */}
          <div className="flex-1">
            <div className="bg-gray-800 rounded-lg p-4 h-full flex flex-col">
              <div className="text-center text-white text-sm mb-2">
                <span className="bg-green-600 px-2 py-1 rounded">
                  {screenShareParticipant}의 화면 공유
                </span>
              </div>
              <div className="flex-1 bg-black rounded overflow-hidden">
                <video
                  ref={screenShareVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
          {renderHiddenMediaElements()}
        </div>
      </div>
    );
  }

  // 일반 화상회의 모드
  return (
    <div className="flex-1 flex items-center justify-center p-2 min-h-0 overflow-hidden">
  <>
  <VideoGrid
        isDemoMode={isDemoMode}
        demoParticipants={demoParticipants}
        remoteParticipants={remoteParticipants}
        localVideoTrack={localVideoTrack}
        isVideoEnabled={isVideoEnabled}
        participantName={participantName}
        remoteParticipantStates={remoteParticipantStates}
        cols={cols}
        rows={rows}
        speakingParticipantId={speakingParticipantId}
      />
  {renderHiddenMediaElements()}
  </>
    </div>
  );
};

export default VideoConferenceMainContent;
