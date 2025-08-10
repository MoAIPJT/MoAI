export type CheckboxSize = 'sm' | 'md' | 'lg'

export interface CheckboxProps {
  id?: string   // htmlFor 연동용
  label?: string // 체크박스 text라벨 감싸는 용도
  checked: boolean // 체크상태
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void // 변화 했을 때 실행하는 함수
  size?: CheckboxSize // 사이즈
  disabled?: boolean // 체크박스 선택못하게 하는거
}
