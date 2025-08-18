export interface MiniCalendarProps {
  currentMonth: string
  miniCalendarDays: (number | null)[]
  currentDate?: Date
  onPreviousMonth: () => void
  onNextMonth: () => void
  onDateClick?: (date: Date) => void
} 