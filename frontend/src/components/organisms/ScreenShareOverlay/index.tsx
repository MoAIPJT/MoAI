import { forwardRef } from 'react';

interface ScreenShareOverlayProps {
  onStopScreenShare: () => void;
}

const ScreenShareOverlay = forwardRef<HTMLVideoElement, ScreenShareOverlayProps>(
  ({ onStopScreenShare }, ref) => {
    return (
      <div className="absolute inset-0 bg-black z-10 flex items-center justify-center">
        <div className="relative w-full h-full">
          <video
            ref={ref}
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />
          <button
            onClick={onStopScreenShare}
            className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            화면 공유 중지
          </button>
        </div>
      </div>
    );
  }
);

ScreenShareOverlay.displayName = 'ScreenShareOverlay';

export default ScreenShareOverlay;
