export type LabelVariant = 'default' | 'light' | 'strong'

export interface LabelProps {
  htmlFor?: string // 연결
  children: React.ReactNode // 내용
  variant?: LabelVariant // style
}
