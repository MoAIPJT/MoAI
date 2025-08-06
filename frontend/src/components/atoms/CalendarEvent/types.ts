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

export interface CalendarEventProps {
  event: Event
  style: React.CSSProperties
  onClick: (event: Event) => void
} 