import type { Event as GridEvent } from '../../organisms/CalendarGrid/types'

export interface Event extends GridEvent {
  // 기존 속성들은 GridEvent에서 상속
}

export interface CalendarEventProps {
  event: Event
  style: React.CSSProperties
  onClick: (event: Event) => void
  onEditEvent?: (event: Event) => void
  onDeleteEvent?: (event: Event) => void
}
