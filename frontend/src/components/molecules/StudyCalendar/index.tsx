import React, { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import type { StudyCalendarProps } from './types'
import { X } from 'lucide-react'
import FullCalendarTemplate from '../../templates/FullCalendarTemplate'
import EventModal from '../EventModal'
import type { Event } from '../../atoms/CalendarEvent/types'
import type { Calendar as CalendarType } from '../../molecules/CalendarList/types'

// StudyCalendar용 이벤트 타입 (date 속성 포함)
interface StudyEvent extends Event {
  date: Date
}

const StudyCalendar: React.FC<StudyCalendarProps> = () => {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [showEventModal, setShowEventModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Modal specific states
  const [modalCurrentView, setModalCurrentView] = useState("week")
  const [modalCurrentDate, setModalCurrentDate] = useState(() => {
    // 현재 날짜만 포함하도록 설정 (시간 제거)
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  })
  const [selectedEvent, setSelectedEvent] = useState<StudyEvent | null>(null)

  // 공유 이벤트 데이터 - FullCalendar와 StudyCalendar에서 모두 사용
  const [events, setEvents] = useState<StudyEvent[]>([
    // 테스트용 샘플 이벤트 데이터 (현재 연도 기준)
    {
      id: 1,
      title: "팀 미팅",
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 9), // 현재 월 9일
      startTime: "14:00",
      endTime: "15:00",
      color: "bg-blue-500",
      day: 9,
      description: "주간 팀 미팅",
      location: "회의실 A",
      attendees: ["김철수", "이영희"],
      organizer: "박민수"
    },
    {
      id: 2,
      title: "프로젝트 발표",
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 16), // 현재 월 16일
      startTime: "10:00",
      endTime: "12:00",
      color: "bg-green-500",
      day: 16,
      description: "최종 프로젝트 발표",
      location: "발표실",
      attendees: ["전체 팀원"],
      organizer: "팀장"
    },
    {
      id: 3,
      title: "스터디 세션",
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 25), // 현재 월 25일
      startTime: "19:00",
      endTime: "21:00",
      color: "bg-purple-500",
      day: 25,
      description: "알고리즘 스터디",
      location: "온라인",
      attendees: ["스터디원들"],
      organizer: "스터디장"
    }
  ])

  // 디버깅용: 이벤트 데이터 확인
  console.log('Current events:', events);
  console.log('Current year:', new Date().getFullYear());
  console.log('Current month:', new Date().getMonth());
  const [modalCreateModal, setModalCreateModal] = useState(false)

  // 특정 날짜에 이벤트가 있는지 확인하는 함수는 이제 필요 없음 (직접 렌더링 방식으로 변경)

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

  const handleEventClick = (event: StudyEvent) => {
    setSelectedEvent(event)
  }

  // 공유 이벤트 저장 함수 - FullCalendar와 StudyCalendar에서 모두 사용
  const handleSaveEvent = (newEvent: StudyEvent) => {
    // 날짜를 정확하게 생성하기 위한 함수
    const createExactDate = (year: number, month: number, day: number) => {
      // 로컬 시간대를 고려하여 정확한 날짜 생성
      const date = new Date(year, month, day)
      // 시간을 12시로 설정하여 시간대 문제 방지
      date.setHours(12, 0, 0, 0)
      return date
    }

    // 새 이벤트에 date 속성이 없으면 추가
    let eventWithDate
    if (newEvent.date) {
      // 이미 date가 있으면 시간을 12시로 설정
      const adjustedDate = new Date(newEvent.date)
      adjustedDate.setHours(12, 0, 0, 0)
      eventWithDate = {
        ...newEvent,
        date: adjustedDate
      }
    } else {
      // date가 없으면 modalCurrentDate나 day를 기준으로 생성
      const targetDate = newEvent.day
        ? createExactDate(modalCurrentDate.getFullYear(), modalCurrentDate.getMonth(), newEvent.day)
        : createExactDate(modalCurrentDate.getFullYear(), modalCurrentDate.getMonth(), modalCurrentDate.getDate())

      eventWithDate = {
        ...newEvent,
        date: targetDate
      }
    }

    console.log('Original event:', newEvent)
    console.log('Modal current date:', modalCurrentDate)
    console.log('Target day:', newEvent.day)
    console.log('Saving event with date:', eventWithDate)
    console.log('Date string:', eventWithDate.date.toDateString())

    if (selectedEvent) {
      // Edit existing event
      setEvents(events.map(e => e.id === selectedEvent.id ? eventWithDate : e))
      setSelectedEvent(null)
    } else {
      // Create new event
      setEvents(prevEvents => {
        const updatedEvents = [...prevEvents, eventWithDate]
        console.log('Updated events:', updatedEvents) // 디버깅용
        return updatedEvents
      })
    }
  }

  // const handleDeleteEvent = (eventId: number) => {
  //   setEvents(events.filter(e => e.id !== eventId))
  //   setSelectedEvent(null)
  // }

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

  // Get week date objects for accurate date handling
  const getModalWeekDateObjects = () => {
    const startOfWeek = new Date(modalCurrentDate)
    const day = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - day)

    const weekDateObjects = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      weekDateObjects.push(new Date(date))
    }
    return weekDateObjects
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
    const today = new Date()
    setModalCurrentDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()))
  }

  const handleModalDateClick = (date: Date) => {
    setModalCurrentDate(new Date(date.getFullYear(), date.getMonth(), date.getDate()))
  }

  // Calendar data for modal
  const modalWeekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  const modalWeekDates = getModalWeekDates()
  const modalWeekDateObjects = getModalWeekDateObjects()
  const modalTimeSlots = Array.from({ length: 16 }, (_, i) => i + 8) // 8 AM to 11 PM (24시까지)
  const modalMiniCalendarDays = getModalMiniCalendarDays()

  // Sample my calendars
  const calendars: CalendarType[] = [
    { name: "My Calendar", color: "bg-blue-500" },
    { name: "Work", color: "bg-green-500" },
    { name: "Personal", color: "bg-purple-500" },
    { name: "Family", color: "bg-orange-500" },
  ]

  // 이벤트 데이터를 커스텀 캘린더 형식으로 변환
  const getColorValue = (colorClass: string) => {
    switch (colorClass) {
      case 'bg-blue-500': return '#3b82f6';
      case 'bg-green-500': return '#10b981';
      case 'bg-purple-500': return '#8b5cf6';
      case 'bg-red-500': return '#ef4444';
      case 'bg-yellow-500': return '#eab308';
      case 'bg-pink-500': return '#ec4899';
      case 'bg-orange-500': return '#f97316';
      default: return '#8b5cf6';
    }
  };

  const calendarEvents = events.map(event => ({
    date: event.date,
    color: getColorValue(event.color),
    title: event.title,
    startTime: event.startTime,
    endTime: event.endTime
  }))

  const handleDateSelect = (selectedDate: Date) => {
    setDate(selectedDate)
  }

  const handleAddEvent = () => {
    handleCreateEvent()
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      {/* 달력 */}
      <div className="flex-1 p-4 flex justify-center">
        <Calendar
          events={calendarEvents}
          selectedDate={date}
          onDateSelect={handleDateSelect}
          onAddEvent={handleAddEvent}
          className="w-fit"
        />
      </div>

      {/* Full Calendar Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-2 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <img
                  src="/src/assets/calendar-moai.png"
                  alt="Calendar Moai"
                  className="w-24 h-24 object-contain"
                />
                <h2 className="text-2xl font-bold text-gray-800">일정 관리</h2>
              </div>
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
                events={events} // 공유 이벤트 데이터 전달
                miniCalendarDays={modalMiniCalendarDays}
                calendars={calendars}
                onViewChange={handleModalViewChange}
                onPrevious={handleModalPrevious}
                onNext={handleModalNext}
                onPreviousMonth={handleModalPreviousMonth}
                onNextMonth={handleModalNextMonth}
                onEventClick={(event) => handleEventClick(event as StudyEvent)}
                onToday={handleModalToday}
                onDateClick={handleModalDateClick}
                onCreateEvent={handleModalCreateEvent}
                selectedDate={modalCurrentDate}
                weekDateObjects={modalWeekDateObjects}
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
          onSave={(event) => handleSaveEvent(event as StudyEvent)}
          selectedDate={date}
          event={selectedEvent ? {
            id: selectedEvent.id,
            title: selectedEvent.title,
            startTime: selectedEvent.startTime,
            endTime: selectedEvent.endTime,
            color: selectedEvent.color,
            day: selectedEvent.day,
            description: selectedEvent.description,
            location: selectedEvent.location,
            attendees: selectedEvent.attendees,
            organizer: selectedEvent.organizer
          } as Event : undefined}
        />
      )}

      {/* Modal Event Modal */}
      {modalCreateModal && (
        <EventModal
          isOpen={modalCreateModal}
          onClose={handleCloseModalCreateModal}
          onSave={(event) => handleSaveEvent(event as StudyEvent)}
          selectedDate={modalCurrentDate}
          event={selectedEvent ? {
            id: selectedEvent.id,
            title: selectedEvent.title,
            startTime: selectedEvent.startTime,
            endTime: selectedEvent.endTime,
            color: selectedEvent.color,
            day: selectedEvent.day,
            description: selectedEvent.description,
            location: selectedEvent.location,
            attendees: selectedEvent.attendees,
            organizer: selectedEvent.organizer
          } as Event : undefined}
        />
      )}
    </div>
  )
}

export default StudyCalendar
