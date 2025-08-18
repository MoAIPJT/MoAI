import { enUS } from 'date-fns/locale'

export const customLocale = {
  ...enUS,
  localize: {
    ...enUS.localize,
    day: (_n: number, _options: any) => '', // ← 기본 요일 텍스트 제거
  },
}
