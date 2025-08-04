export interface ResizerProps {
  onResize: (width: number) => void // 너비 변경 시 호출되는 콜백
  minWidth?: number // 최소 너비 (기본값: 200px)
  maxWidth?: number // 최대 너비 (기본값: 500px)
  initialWidth?: number // 초기 너비 (기본값: 256px)
} 