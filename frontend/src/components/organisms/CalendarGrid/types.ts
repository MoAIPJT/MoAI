// StudyEvent 타입 정의 (StudyCalendar와 동일)
export interface StudyEvent {
  id: number
  title: string
  startTime: string
  endTime: string
  color: string
  day: number
  description: string
  location: string
  attendees: string[]
  organizer: string
  date?: Date // 선택적 date 속성
}

// Event 타입 정의
export interface Event {
  id: number
  title: string
  startTime: string
  endTime: string
  color: string
  day: number
  description: string
  location: string
  attendees: string[]
  organizer: string
}

// Event와 StudyEvent를 모두 포함할 수 있는 유니온 타입
export type CalendarEvent = Event | StudyEvent

export interface CalendarGridProps {
  weekDays: string[]
  weekDates: number[]
  timeSlots: number[]
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
  onDateClick?: (date: Date) => void
  currentWeekStart?: Date // 현재 표시 중인 주의 시작 날짜 (일요일)
  selectedDate?: Date // 사용자가 선택한 날짜
  weekDateObjects?: Date[] // 현재 주의 전체 Date 객체들 (일요일부터 토요일까지)
  onEditEvent?: (event: CalendarEvent) => void
  onDeleteEvent?: (event: CalendarEvent) => void
}
