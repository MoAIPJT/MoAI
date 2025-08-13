export interface TimeSlotEvent {
  id: number
  title: string
  startMinute: number
  duration: number
}

export interface TimeSlotProps {
  time: number
  events?: TimeSlotEvent[]
  onEditEvent?: (event: TimeSlotEvent) => void
  onDeleteEvent?: (event: TimeSlotEvent) => void
}
