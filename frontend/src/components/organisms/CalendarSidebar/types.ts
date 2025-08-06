import type { Calendar } from '../../molecules/CalendarList/types'

export interface CalendarSidebarProps {
  currentMonth: string
  miniCalendarDays: (number | null)[]
  calendars: Calendar[]
  onPreviousMonth: () => void
  onNextMonth: () => void
} 