import React, { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import type { StudyCalendarProps, StudyEvent, Event } from './types'
import { X } from 'lucide-react'
import FullCalendarTemplate from '../../templates/FullCalendarTemplate'
import EventModal from '../EventModal'
import type { CalendarEvent as GridCalendarEvent } from '../../organisms/CalendarGrid/types'
import type { CalendarEvent as UICalendarEvent } from '@/components/ui/calendar'
import type { Calendar as CalendarType } from '../../molecules/CalendarList/types'
import { useEditSchedule, useDeleteSchedule } from '../../../hooks/useSchedules'

const StudyCalendar: React.FC<StudyCalendarProps> = ({
  schedules = [],
  isLoading = false,
  studyId,
  currentUserRole
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [showEventModal, setShowEventModal] = useState(false)
  const [showFullCalendarModal, setShowFullCalendarModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<StudyEvent | null>(null)

  // Modal specific states
  const [modalCurrentView, setModalCurrentView] = useState("week")
  const [modalCurrentDate, setModalCurrentDate] = useState(() => {
    // 현재 날짜 설정
    const now = new Date()
    const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    return currentDate
  })
  // CalendarSidebar 모달 제어를 위한 상태
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [eventToEdit, setEventToEdit] = useState<GridCalendarEvent | null>(null)
  const [eventToDelete, setEventToDelete] = useState<GridCalendarEvent | null>(null)

  // API에서 가져온 일정 데이터를 StudyEvent 형식으로 변환
  const apiEvents: StudyEvent[] = schedules.map(schedule => {
    const startDate = new Date(schedule.startDatetime)
    const endDate = new Date(schedule.endDatetime)

    return {
      id: schedule.id,
      title: schedule.title,
      date: startDate,
      startTime: startDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      endTime: endDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      color: "#AA64FF", // 모든 이벤트를 보라색으로 통일
      day: startDate.getDate(),
      description: schedule.memo || '',
      location: '스터디룸',
      attendees: ['스터디원들'],
      organizer: '스터디장'
    }
  })

  // 공유 이벤트 데이터 - API 데이터가 있으면 사용, 없으면 기본 데이터 사용
  const [events, setEvents] = useState<StudyEvent[]>(apiEvents.length > 0 ? apiEvents : [
    // 테스트용 샘플 이벤트 데이터 (현재 연도 기준)
    {
      id: 1,
      title: "팀 미팅",
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 9), // 현재 월 9일
      startTime: "14:00",
      endTime: "15:00",
      color: "#AA64FF", // 보라색으로 통일
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
      color: "#AA64FF", // 보라색으로 통일
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
      color: "#AA64FF", // 보라색으로 통일
      day: 25,
      description: "알고리즘 스터디",
      location: "온라인",
      attendees: ["스터디원들"],
      organizer: "스터디장"
    }
  ])

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

    if (selectedEvent) {
      // Edit existing event
      setEvents(events.map(e => e.id === selectedEvent.id ? eventWithDate : e))
      setSelectedEvent(null)
    } else {
      // Create new event
      setEvents(prevEvents => {
        const updatedEvents = [...prevEvents, eventWithDate]
        return updatedEvents
      })
    }

    // Full Calendar 모달 닫기
    setShowEventModal(false)
  }

  // Get current date info for modal
  const getModalCurrentMonth = () => {
    const result = `${modalCurrentDate.getFullYear()}.${modalCurrentDate.getMonth() + 1}`
    return result
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
  const modalWeekDays = ["일", "월", "화", "수", "목", "금", "토"]
  const modalWeekDates = getModalWeekDates()
  const modalWeekDateObjects = getModalWeekDateObjects()
  // 8시부터 23시까지 (16개 슬롯)
  const modalTimeSlots = Array.from({ length: 16 }, (_, i) => i + 8) // 8 AM to 11 PM
  const modalMiniCalendarDays = getModalMiniCalendarDays()

  // Sample my calendars
  const calendars: CalendarType[] = [
    // { name: "내 일정", color: "bg-purple-500" },
    { name: "업무", color: "bg-purple-500" },
    { name: "개인", color: "bg-purple-500" },
    // { name: "가족", color: "bg-purple-500" },
    { name: "스터디", color: "bg-purple-500" },
    { name: "회의", color: "bg-purple-500" },
  ]

  // Calendar 컴포넌트용 이벤트 데이터 변환 (dot 표시용)
  const getColorValue = (colorClass: string) => {
    // 모든 색상을 보라색으로 통일
    return '#AA64FF';
  };

  // 일정이 있는 날짜만 필터링하여 동그라미 표시
  const calendarEventsForDot = apiEvents
    .filter(event => event.date) // date가 있는 이벤트만 필터링
    .map(event => ({
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
    // Full Calendar 모달 열기
    setShowFullCalendarModal(true)
  }

  const handleCreateEventInFullCalendar = () => {
    // Full Calendar 내에서 일정 생성 버튼을 눌렀을 때 EventModal 열기
    setShowEventModal(true)
  }

  const handleCloseModal = () => {
    setShowFullCalendarModal(false)
  }

  const handleCloseCreateModal = () => {
    setShowEventModal(false)
    setSelectedEvent(null)
  }

  // 일정 생성 핸들러 (API 호출)
  const handleCreateSchedule = async (data: {
    studyId: number
    startDatetime: string
    endDatetime: string
    title: string
    memo?: string
  }) => {
    console.log('🎯 handleCreateSchedule 호출됨:', data)
    try {
      // 백엔드 API 형식에 맞게 데이터 변환
      const scheduleData = {
        studyId: data.studyId,
        startDatetime: data.startDatetime,
        endDatetime: data.endDatetime,
        title: data.title,
        memo: data.memo || ''
      }

      console.log('📝 백엔드로 전송할 스케줄 데이터:', scheduleData)

      // scheduleService를 사용하여 API 호출
      const { scheduleService } = await import('../../../services/scheduleService')
      await scheduleService.createSchedule(scheduleData)

      // 성공 메시지
      alert('일정이 성공적으로 생성되었습니다.')

      // 페이지 새로고침하여 최신 데이터 반영
      window.location.reload()
    } catch (error) {
      console.error('❌ 일정 생성 실패:', error)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown; status?: number } }
        const status = axiosError.response?.status

        if (status === 400) {
          alert('잘못된 요청입니다. 입력 정보를 확인해주세요.')
        } else if (status === 401) {
          alert('권한이 없습니다. 로그인 상태를 확인해주세요.')
        } else if (status === 403) {
          alert('일정을 생성할 권한이 없습니다.')
        } else if (status && status >= 500) {
          alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
        } else {
          alert('일정 생성에 실패했습니다. 다시 시도해주세요.')
        }
      } else {
        alert('일정 생성에 실패했습니다. 다시 시도해주세요.')
      }
    }
  }

  // 일정 수정 및 삭제 훅
  const editScheduleMutation = useEditSchedule(Number(studyId), new Date().getFullYear(), new Date().getMonth() + 1)
  const deleteScheduleMutation = useDeleteSchedule(Number(studyId), new Date().getFullYear(), new Date().getMonth() + 1)

  // 이벤트 수정 모달 열기
  const handleEditEvent = (event: GridCalendarEvent) => {
    setEventToEdit(event)
    setShowEditModal(true)
  }

  // 이벤트 삭제 모달 열기
  const handleDeleteEvent = (event: GridCalendarEvent) => {
    setEventToDelete(event)
    setShowDeleteModal(true)
  }

  // 일정 수정 핸들러
  const handleEditSchedule = async (data: {
    scheduleId: number
    studyId: number
    startDatetime: string
    endDatetime: string
    title: string
    memo?: string
  }) => {
    try {
      await editScheduleMutation.mutateAsync({
        scheduleId: data.scheduleId,
        request: {
          studyId: data.studyId,
          startDatetime: data.startDatetime,
          endDatetime: data.endDatetime,
          title: data.title,
          memo: data.memo
        }
      })
      alert('일정이 수정되었습니다.')
      setShowEditModal(false)
      setEventToEdit(null)
    } catch (error) {
      alert('일정 수정에 실패했습니다. 다시 시도해주세요.')
    }
  }

  // 일정 삭제 핸들러
  const handleDeleteSchedule = async (scheduleId: number) => {
    try {
      await deleteScheduleMutation.mutateAsync(scheduleId)
      alert('일정이 삭제되었습니다.')
      setShowDeleteModal(false)
      setEventToDelete(null)
    } catch (error) {
      alert('일정 삭제에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      {/* 달력 헤더 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-2 h-8 rounded-full mr-3" style={{ backgroundColor: '#F8BB50' }}></div>
          <h3 className="text-lg font-semibold text-gray-900">일정</h3>
        </div>
      </div>

      {/* 달력 */}
      <div className="flex-1 p-4 flex justify-center">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-500">일정을 불러오는 중...</span>
          </div>
        ) : (
          <Calendar
            events={calendarEventsForDot as UICalendarEvent[]}
            selectedDate={date}
            onDateSelect={handleDateSelect}
            onAddEvent={currentUserRole === 'ADMIN' || currentUserRole === 'DELEGATE' ? handleAddEvent : undefined}
            className="w-fit"
          />
        )}
      </div>

      {/* Full Calendar Modal */}
      {showFullCalendarModal && (
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
                currentDate={modalCurrentDate}
                currentView={modalCurrentView}
                weekDays={modalWeekDays}
                weekDates={modalWeekDates}
                timeSlots={modalTimeSlots}
                events={apiEvents as GridCalendarEvent[]} // CalendarEvent 타입으로 캐스팅
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
                onCreateEvent={handleCreateEventInFullCalendar}
                selectedDate={modalCurrentDate}
                weekDateObjects={modalWeekDateObjects}
                onCreateSchedule={handleCreateSchedule}
                onEditSchedule={handleEditSchedule}
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEvent}
                studyId={studyId}
                currentUserRole={currentUserRole}
              />
            </div>
          </div>
        </div>
      )}

      {/* Event Modal - FullCalendar 내에서 일정 생성 시에만 사용 */}
      {showEventModal && (
        <EventModal
          isOpen={showEventModal}
          onClose={handleCloseCreateModal}
          onSave={(event) => handleSaveEvent(event as any)}
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
          onCreateSchedule={handleCreateSchedule}
          studyId={studyId}
        />
      )}

      {/* 수정 모달 */}
      {showEditModal && eventToEdit && (
        <EventModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setEventToEdit(null)
          }}
          onSave={() => {}} // 수정 모드에서는 사용하지 않음
          selectedDate={modalCurrentDate}
          event={{
            id: eventToEdit.id,
            title: eventToEdit.title,
            startTime: eventToEdit.startTime,
            endTime: eventToEdit.endTime,
            color: eventToEdit.color || 'bg-purple-500', // 보라색으로 통일
            description: eventToEdit.description,
            location: eventToEdit.location,
            attendees: eventToEdit.attendees
          }}
          onEditSchedule={handleEditSchedule}
          studyId={studyId}
          isEditMode={true}
        />
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteModal && eventToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">일정 삭제</h3>
              <p className="text-gray-600 mb-6">
                "{eventToDelete.title}" 일정을 삭제하시겠습니까?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setEventToDelete(null)
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={() => handleDeleteSchedule(eventToDelete.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudyCalendar
