import type { Event } from '../../atoms/CalendarEvent/types'

export interface CalendarGridProps {
  weekDays: string[]
  weekDates: number[]
  timeSlots: number[]
  events: Event[]
  onEventClick: (event: Event) => void
  onDateClick?: (date: Date) => void
  currentWeekStart?: Date // 현재 표시 중인 주의 시작 날짜 (일요일)
  selectedDate?: Date // 사용자가 선택한 날짜
  weekDateObjects?: Date[] // 현재 주의 전체 Date 객체들 (일요일부터 토요일까지)
}
