export type NavItemVariant = 'default' | 'gray' | 'primary' | 'study' | 'summary'

export interface NavItemProps {
  children: React.ReactNode // 네비게이션 아이템 텍스트
  icon?: React.ReactNode // 아이콘 (선택사항)
  variant?: NavItemVariant // 스타일 변형
  isActive?: boolean // 활성 상태 여부
  isExpanded?: boolean // 스터디가 펼쳐진 상태인지 여부
  isStudy?: boolean // 스터디인지 요약본인지 구분
  onClick?: () => void // 클릭 이벤트 핸들러
}
