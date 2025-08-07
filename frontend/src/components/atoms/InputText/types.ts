export type InputVariant = 'default' | 'underline' | 'filled'
export type InputSize = 'sm' | 'md' | 'lg'

export interface InputTextProps {
  id?: string // id label연결용
  type?: string // 타입
  value: string // 값
  placeholder?: string // 빈칸일 때
  variant?: InputVariant // 스타일
  size?: InputSize // 사이즈
  fullWidth?: boolean // 전체화면
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  className?: string // 추가 CSS 클래스
}
