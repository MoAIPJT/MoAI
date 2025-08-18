import type { Calendar } from '../../molecules/CalendarList/types'

export interface CalendarSidebarProps {
  currentMonth: string
  miniCalendarDays: (number | null)[]
  calendars: Calendar[]
  currentDate: Date
  onPreviousMonth: () => void
  onNextMonth: () => void
  onDateClick?: (date: Date) => void
  onCreateEvent?: () => void
  onCreateSchedule?: (data: {
    studyId: number
    startDatetime: string
    endDatetime: string
    title: string
    memo?: string
  }) => Promise<void>
  onEditSchedule?: (data: {
    scheduleId: number
    studyId: number
    startDatetime: string
    endDatetime: string
    title: string
    memo?: string
  }) => Promise<void>
  studyId?: number
  currentUserRole?: 'ADMIN' | 'DELEGATE' | 'MEMBER'
}
