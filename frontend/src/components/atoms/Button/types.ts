export type ButtonVariant = 'primary' | 'secondary' | 'gray' | 'outline'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps {
  children: React.ReactNode // 텍스트 아이콘 등 요소
  variant?: ButtonVariant // 버튼 색상
  size?: ButtonSize // 크기
  fullWidth?: boolean // 가로 너비
  onClick?: () => void // 이벤트 핸들러
  type?: 'button' | 'submit' | 'reset' // 버튼 타입
  disabled?: boolean // 비활성화 상태
  className?: string // 추가 CSS 클래스
}
