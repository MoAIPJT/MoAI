export type CircleButtonVariant = 'purple' | 'lightPurple' | 'red' | 'gray'
export type CircleButtonSize = 'sm' | 'md' | 'lg'

export interface CircleButtonProps {
  children: React.ReactNode // 아이콘 또는 텍스트
  variant?: CircleButtonVariant // 버튼 색상
  size?: CircleButtonSize // 크기
  onClick?: () => void // 이벤트 핸들러
  disabled?: boolean // 비활성화 상태
  className?: string // 추가 스타일링
} 