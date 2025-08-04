import React, { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import type { StudyCalendarProps } from './types'
import { customLocale } from '@/lib/locales/en-custom'
import { X } from 'lucide-react'
import FullCalendarTemplate from '../../templates/FullCalendarTemplate'
import EventModal from '../EventModal'
import type { Event } from '../../atoms/CalendarEvent/types'
import type { Calendar as CalendarType } from '../../molecules/CalendarList/types'

const getMonthName = (month: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return months[month]
}

const StudyCalendar: React.FC<StudyCalendarProps> = ({
  onAddEvent,
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [showEventModal, setShowEventModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Modal specific states
  const [modalCurrentView, setModalCurrentView] = useState("week")
  const [modalCurrentDate, setModalCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [modalCreateModal, setModalCreateModal] = useState(false)

  const handleCreateEvent = () => {
    setShowEventModal(true)
  }

  const handleModalCreateEvent = () => {
    setModalCreateModal(true)
  }

  const handleCloseModal = () => {
    setShowEventModal(false)
  }

  const handleCloseCreateModal = () => {
    setShowCreateModal(false)
  }

  const handleCloseModalCreateModal = () => {
    setModalCreateModal(false)
  }

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
  }

  const handleSaveEvent = (newEvent: any) => {
    if (selectedEvent) {
      // Edit existing event
      setEvents(events.map(e => e.id === selectedEvent.id ? newEvent : e))
      setSelectedEvent(null)
    } else {
      // Create new event
      setEvents([...events, newEvent])
    }
  }

  const handleDeleteEvent = (eventId: number) => {
    setEvents(events.filter(e => e.id !== eventId))
    setSelectedEvent(null)
  }

  // Get current date info for modal
  const getModalCurrentMonth = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    return `${months[modalCurrentDate.getMonth()]} ${modalCurrentDate.getFullYear()}`
  }

  const getModalCurrentDateString = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    return `${months[modalCurrentDate.getMonth()]} ${modalCurrentDate.getDate()}`
  }

  // Get week dates based on modal current date
  const getModalWeekDates = () => {
    const startOfWeek = new Date(modalCurrentDate)
    const day = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - day)
    
    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      weekDates.push(date.getDate())
    }
    return weekDates
  }

  // Get mini calendar days for modal
  const getModalMiniCalendarDays = () => {
    const year = modalCurrentDate.getFullYear()
    const month = modalCurrentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const firstDayOffset = firstDay.getDay()
    
    const days = []
    for (let i = 0; i < firstDayOffset; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  // Modal navigation handlers
  const handleModalPrevious = () => {
    const newDate = new Date(modalCurrentDate)
    if (modalCurrentView === "day") {
      newDate.setDate(newDate.getDate() - 1)
    } else if (modalCurrentView === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else if (modalCurrentView === "month") {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setModalCurrentDate(newDate)
  }

  const handleModalNext = () => {
    const newDate = new Date(modalCurrentDate)
    if (modalCurrentView === "day") {
      newDate.setDate(newDate.getDate() + 1)
    } else if (modalCurrentView === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else if (modalCurrentView === "month") {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setModalCurrentDate(newDate)
  }

  const handleModalPreviousMonth = () => {
    const newDate = new Date(modalCurrentDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setModalCurrentDate(newDate)
  }

  const handleModalNextMonth = () => {
    const newDate = new Date(modalCurrentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setModalCurrentDate(newDate)
  }

  const handleModalViewChange = (view: string) => {
    setModalCurrentView(view)
  }

  const handleModalToday = () => {
    setModalCurrentDate(new Date())
  }

  const handleModalDateClick = (date: Date) => {
    setModalCurrentDate(date)
  }

  // Calendar data for modal
  const modalWeekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  const modalWeekDates = getModalWeekDates()
  const modalTimeSlots = Array.from({ length: 9 }, (_, i) => i + 8) // 8 AM to 4 PM
  const modalMiniCalendarDays = getModalMiniCalendarDays()

  // Sample my calendars
  const calendars: CalendarType[] = [
    { name: "My Calendar", color: "bg-blue-500" },
    { name: "Work", color: "bg-green-500" },
    { name: "Personal", color: "bg-purple-500" },
    { name: "Family", color: "bg-orange-500" },
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const newDate = new Date(date || new Date())
              newDate.setMonth(newDate.getMonth() - 1)
              setDate(newDate)
            }}
            className="text-gray-400 -mt-3 hover:bg-transparent hover:text-gray-400"
          >
            <span className="text-5xl">‹</span>
          </Button>
          <h3 className="text-2xl font-bold">
            {date ? `${getMonthName(date.getMonth())} ${date.getFullYear()}` : `${getMonthName(new Date().getMonth())} ${new Date().getFullYear()}`}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const newDate = new Date(date || new Date())
              newDate.setMonth(newDate.getMonth() + 1)
              setDate(newDate)
            }}
            className="text-gray-400 -mt-2 hover:bg-transparent hover:text-gray-400"
          >
            <span className="text-5xl">›</span>
          </Button>
        </div>
        <Button
          onClick={handleCreateEvent}
          className="w-8 h-8 p-0 rounded-full"
          variant="ghost"
        >
          <span className="text-xl">+</span>
        </Button>
      </div>

      {/* 달력 */}
      <div className="flex-1 px-4 pb-4 pt-0 flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          month={date}
          locale={customLocale}
          required={true}
          className="w-fit"

          classNames={{
            months: "w-full",
            month: "w-full",
            caption: "hidden m-0 p-0 h-0",
            caption_label: "hidden",
            nav: "hidden m-0 p-0",
            nav_button: "hidden",
            nav_button_previous: "hidden",
            nav_button_next: "hidden",
            table: "w-full border-collapse",
            head_row: "flex m-0 p-0",
            weekday: "size-14 p-0 text-xs font-medium text-muted-foreground/80 [&:nth-child(1)]:text-red-500 [&:nth-child(7)]:text-blue-500 [&:nth-child(1)]:before:content-['Sun'] [&:nth-child(2)]:before:content-['Mon'] [&:nth-child(3)]:before:content-['Tue'] [&:nth-child(4)]:before:content-['Wed'] [&:nth-child(5)]:before:content-['Thu'] [&:nth-child(6)]:before:content-['Fri'] [&:nth-child(7)]:before:content-['Sat'] [&:nth-child(1)]:before:text-red-500 [&:nth-child(7)]:before:text-blue-500 [&>*]:hidden [&:before]:block [&:before]:text-center [&>*]:opacity-0 [&>*]:text-transparent [&>*]:font-size-0 [&>*]:text-[0px]",
            head_cell: "text-muted-foreground rounded-md w-14 font-normal text-[0.8rem] [&:nth-child(1)]:text-red-500 [&:nth-child(7)]:text-blue-500",
            row: "flex w-full mt-2",
            cell: "h-9 w-14 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: "h-9 w-14 p-0 font-normal aria-selected:opacity-100",
            day_range_end: "day-range-end",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}

        />
      </div>

      {/* Full Calendar Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">일정 관리</h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Content - Full Calendar */}
            <div className="flex-1 overflow-hidden">
              <FullCalendarTemplate
                currentMonth={getModalCurrentMonth()}
                currentDate={getModalCurrentDateString()}
                currentView={modalCurrentView}
                weekDays={modalWeekDays}
                weekDates={modalWeekDates}
                timeSlots={modalTimeSlots}
                events={events}
                miniCalendarDays={modalMiniCalendarDays}
                calendars={calendars}
                onViewChange={handleModalViewChange}
                onPrevious={handleModalPrevious}
                onNext={handleModalNext}
                onPreviousMonth={handleModalPreviousMonth}
                onNextMonth={handleModalNextMonth}
                onEventClick={handleEventClick}
                onToday={handleModalToday}
                onDateClick={handleModalDateClick}
                onCreateEvent={handleModalCreateEvent}
              />
            </div>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showCreateModal && (
        <EventModal
          isOpen={showCreateModal}
          onClose={handleCloseCreateModal}
          onSave={handleSaveEvent}
          selectedDate={date}
          event={selectedEvent}
        />
      )}

      {/* Modal Event Modal */}
      {modalCreateModal && (
        <EventModal
          isOpen={modalCreateModal}
          onClose={handleCloseModalCreateModal}
          onSave={handleSaveEvent}
          selectedDate={modalCurrentDate}
          event={selectedEvent}
        />
      )}
    </div>
  )
}

export default StudyCalendar
