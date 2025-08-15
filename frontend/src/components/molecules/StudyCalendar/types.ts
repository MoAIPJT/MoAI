import type { CalendarEvent } from '../../organisms/CalendarGrid/types'

// EventModal에서 사용하는 Event 타입
export interface Event {
  id?: string | number
  title: string
  description: string
  location: string
  startTime: string
  endTime: string
  attendees?: string[]
  color: string
}

// StudyCalendar에서 사용하는 StudyEvent 타입
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

export interface StudyCalendarProps {
  // 일정 데이터
  schedules?: Array<{
    id: number
    title: string
    startDatetime: string
    endDatetime: string
    memo?: string
  }>
  // 로딩 상태
  isLoading?: boolean
  // 스터디 ID
  studyId?: number
  // 캘린더에 표시할 이벤트들
  events?: CalendarEvent[]
  // 현재 사용자 권한
  currentUserRole?: 'ADMIN' | 'DELEGATE' | 'MEMBER'
}
