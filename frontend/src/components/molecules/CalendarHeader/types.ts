export interface CalendarHeaderProps {
  currentDate: string
  currentView: string
  onViewChange: (view: string) => void
  onPrevious: () => void
  onNext: () => void
} 