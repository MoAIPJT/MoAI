import type { Event } from '../../atoms/CalendarEvent/types'

export interface CalendarGridProps {
  weekDays: string[]
  weekDates: number[]
  timeSlots: number[]
  events: Event[]
  onEventClick: (event: Event) => void
} 