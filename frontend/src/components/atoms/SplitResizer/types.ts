export interface SplitResizerProps {
  onResize: (leftWidth: number) => void // 왼쪽 패널 너비 변경 시 호출되는 콜백
  minLeftWidth?: number // 왼쪽 패널 최소 너비 (기본값: 300px)
  maxLeftWidth?: number // 왼쪽 패널 최대 너비 (기본값: 800px)
  initialLeftWidth?: number // 왼쪽 패널 초기 너비 (기본값: 500px)
} 