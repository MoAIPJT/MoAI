export type LinkTextVariant = 'default' | 'gray' | 'underline'

export interface LinkTextProps {
  href: string // 이동할 링크
  children: React.ReactNode // 표시할 내용 (텍스트, 아이콘 등)
  variant?: LinkTextVariant // 링크 스타일
  onClick?: () => void // 클릭 이벤트 (선택)
}
