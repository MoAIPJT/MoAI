export type LogoVariant = 'default' | 'compact' | 'minimal'

export interface LogoProps {
  variant?: LogoVariant // 로고 스타일 변형
  onClick?: () => void // 커스텀 클릭 핸들러 (선택사항)
} 