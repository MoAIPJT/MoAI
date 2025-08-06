import React, { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import DateIcon from '@/assets/icons/date.svg'
import ClockIcon from '@/assets/icons/clock.svg'
import NoteIcon from '@/assets/icons/note.svg'
import CameraVideoIcon from '@/assets/icons/camera-video.svg'

interface Event {
  id?: string | number
  title: string
  description: string
  location: string
  startTime: string
  endTime: string
  attendees?: string[]
  color: string
}

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: Event) => void
  selectedDate?: Date
  event?: Event
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  event
}) => {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    location: event?.location || '',
    startTime: event?.startTime || '09:00',
    endTime: event?.endTime || '10:00',
    attendees: event?.attendees?.join(', ') || '',
    color: event?.color || 'bg-purple-500'
  })

  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState<'start' | 'end' | false>(false)
  const [currentSelectedDate, setCurrentSelectedDate] = useState(selectedDate || new Date())
  const [isStudyChatEnabled, setIsStudyChatEnabled] = useState(false)
  const dateInputRef = useRef<HTMLInputElement>(null)

  // selectedDate가 변경되면 currentSelectedDate 업데이트
  useEffect(() => {
    if (selectedDate) {
      setCurrentSelectedDate(selectedDate)
    }
  }, [selectedDate])

  // 날짜 선택이 열리면 자동으로 달력 열기
  useEffect(() => {
    if (showDatePicker && dateInputRef.current) {
      setTimeout(() => {
        dateInputRef.current?.showPicker?.()
      }, 100)
    }
  }, [showDatePicker])

  // Time picker helpers
  const hours = Array.from({ length: 24 }, (_, i: number) => i.toString().padStart(2, '0'))
  const minutes = Array.from({ length: 60 }, (_, i: number) => i.toString().padStart(2, '0'))

  const getTimeComponents = (timeString: string) => {
    const [hour, minute] = timeString.split(':')
    return { hour, minute }
  }

    const setTimeComponent = (timeType: 'startTime' | 'endTime', component: 'hour' | 'minute', value: string) => {
    const currentTime = getTimeComponents(formData[timeType])
    const newTime = component === 'hour'
      ? `${value}:${currentTime.minute}`
      : `${currentTime.hour}:${value}`
    setFormData({ ...formData, [timeType]: newTime })
  }



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 모달에서 변경된 날짜를 사용 (currentSelectedDate)
    const eventDate = currentSelectedDate
    const newEvent = {
      id: event?.id || Date.now(),
      ...formData,
      attendees: formData.attendees ? formData.attendees.split(',').map(a => a.trim()) : [],
      date: eventDate,
      day: eventDate.getDate(), // 날짜의 일(1-31)
      color: formData.color,
      organizer: "현재 사용자" // 기본 주최자 설정
    }
    onSave(newEvent)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex-1 text-center">
            <span className="text-lg font-medium text-gray-800">일정 추가</span>
          </div>
          <button
            type="submit"
            form="event-form"
            className="text-[#AA64FF] font-medium hover:text-[#9954E6] transition-colors"
          >
            저장
          </button>
        </div>

        {/* Form */}
        <form id="event-form" onSubmit={handleSubmit} className="p-6 space-y-6">
                              {/* Title */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className={`w-6 h-6 rounded-full ${formData.color} hover:scale-110 transition-transform shadow-md`}
              />

              {/* Color Picker Dropdown */}
              {showColorPicker && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowColorPicker(false)}
                  />
                  <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 min-w-[120px]">
                  <div className="flex flex-col gap-1">
                  {[
                    { name: "My", color: "bg-blue-500" },
                    { name: "Work", color: "bg-green-500" },
                    { name: "Personal", color: "bg-purple-500" },
                    { name: "Family", color: "bg-orange-500" },
                    { name: "Study", color: "bg-red-500" },
                    { name: "Meeting", color: "bg-yellow-500" },
                  ].map((colorOption) => (
                    <button
                      key={colorOption.color}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, color: colorOption.color })
                        setShowColorPicker(false)
                      }}
                      className={`flex items-center gap-2 w-full p-2 rounded hover:bg-gray-50 transition-colors ${
                        formData.color === colorOption.color ? 'bg-gray-100' : ''
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full ${colorOption.color} flex-shrink-0`}></div>
                      <span className="text-sm text-gray-700">{colorOption.name}</span>
                    </button>
                  ))}
                </div>
                </div>
              </>
            )}
            </div>
            <div className="flex-1">
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="일정 제목"
                className="border-none bg-transparent text-lg font-medium p-0 focus:ring-0 focus:outline-none"
              required
            />
          </div>
          </div>

          {/* Date */}
          <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <img src={DateIcon} alt="Date" className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="text-gray-600 text-sm mb-2">날짜</div>
              <div className="relative">
                                <button
                  type="button"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="text-lg hover:text-[#AA64FF] transition-colors font-medium"
                >
                  {currentSelectedDate?.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    weekday: 'short'
                  })}
                </button>

                {/* Date Picker Dropdown */}
                {showDatePicker && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowDatePicker(false)}
                    />
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 min-w-[200px]">
                      <input
                        ref={dateInputRef}
                        type="date"
                        value={currentSelectedDate?.toISOString().split('T')[0]}
                        onChange={(e) => {
                          setCurrentSelectedDate(new Date(e.target.value))
                          setShowDatePicker(false)
                        }}
                        className="w-full p-2 border border-gray-300 rounded"
                        autoFocus
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <img src={ClockIcon} alt="Clock" className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="text-gray-600 text-sm mb-2">시간</div>
              <div className="flex items-center gap-4">
                {/* Start Time */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowTimePicker(showTimePicker === 'start' ? false : 'start')}
                    className="text-lg hover:text-[#AA64FF] transition-colors font-medium"
                  >
                    {formData.startTime}
                  </button>

                  {/* Start Time Picker Dropdown */}
                  {showTimePicker === 'start' && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowTimePicker(false)}
                      />
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
                        <div className="flex items-center gap-2">
                          {/* Hour Picker */}
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">시</div>
                            <div className="h-20 overflow-y-auto border border-gray-200 rounded w-10 bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                              {hours.map((hour) => {
                                const currentTime = getTimeComponents(formData.startTime)
                                return (
                                  <button
                                    key={hour}
                                    type="button"
                                    onClick={() => setTimeComponent('startTime', 'hour', hour)}
                                    className={`w-full p-1 text-xs hover:bg-gray-100 ${
                                      currentTime.hour === hour ? 'bg-[#AA64FF] text-white' : ''
                                    }`}
                                  >
                                    {hour}
                                  </button>
                                )
                              })}
                            </div>
                          </div>

                          <div className="text-sm font-medium mt-4">:</div>

                          {/* Minute Picker */}
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">분</div>
                            <div className="h-20 overflow-y-auto border border-gray-200 rounded w-10 bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                              {minutes.filter((_, i) => i % 5 === 0).map((minute) => {
                                const currentTime = getTimeComponents(formData.startTime)
                                return (
                                  <button
                                    key={minute}
                                    type="button"
                                    onClick={() => setTimeComponent('startTime', 'minute', minute)}
                                    className={`w-full p-1 text-xs hover:bg-gray-100 ${
                                      currentTime.minute === minute ? 'bg-[#AA64FF] text-white' : ''
                                    }`}
                                  >
                                    {minute}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <span className="text-gray-400 text-lg">~</span>

                {/* End Time */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowTimePicker(showTimePicker === 'end' ? false : 'end')}
                    className="text-lg hover:text-[#AA64FF] transition-colors font-medium"
                  >
                    {formData.endTime}
                  </button>

                  {/* End Time Picker Dropdown */}
                  {showTimePicker === 'end' && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowTimePicker(false)}
                      />
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
                        <div className="flex items-center gap-2">
                          {/* Hour Picker */}
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">시</div>
                            <div className="h-20 overflow-y-auto border border-gray-200 rounded w-10 bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                              {hours.map((hour) => {
                                const currentTime = getTimeComponents(formData.endTime)
                                return (
                                  <button
                                    key={hour}
                                    type="button"
                                    onClick={() => setTimeComponent('endTime', 'hour', hour)}
                                    className={`w-full p-1 text-xs hover:bg-gray-100 ${
                                      currentTime.hour === hour ? 'bg-[#AA64FF] text-white' : ''
                                    }`}
                                  >
                                    {hour}
                                  </button>
                                )
                              })}
                            </div>
                          </div>

                          <div className="text-sm font-medium mt-4">:</div>

                          {/* Minute Picker */}
                          <div className="text-center">
                            <div className="text-xs text-gray-500 mb-1">분</div>
                            <div className="h-20 overflow-y-auto border border-gray-200 rounded w-10 bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                              {minutes.filter((_, i) => i % 5 === 0).map((minute) => {
                                const currentTime = getTimeComponents(formData.endTime)
                                return (
                                  <button
                                    key={minute}
                                    type="button"
                                    onClick={() => setTimeComponent('endTime', 'minute', minute)}
                                    className={`w-full p-1 text-xs hover:bg-gray-100 ${
                                      currentTime.minute === minute ? 'bg-[#AA64FF] text-white' : ''
                                    }`}
                                  >
                                    {minute}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Memo */}
          <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <img src={NoteIcon} alt="Note" className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="text-gray-600 text-sm mb-2">메모</div>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder=""
                className="border border-[#D9D9D9] bg-transparent p-2 resize-none focus:ring-0 focus:outline-none focus:border-[#D9D9D9] min-h-[120px] rounded-md"
                rows={5}
              />
            </div>
          </div>

          {/* Study Schedule Toggle */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <img src={CameraVideoIcon} alt="Camera Video" className="w-6 h-6" />
            </div>
            <span className="text-gray-600 text-sm">학습 채팅 예약 여부</span>
            <button
              type="button"
              onClick={() => setIsStudyChatEnabled(!isStudyChatEnabled)}
              className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${
                isStudyChatEnabled ? 'bg-[#AA64FF]' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform duration-200 ${
                isStudyChatEnabled ? 'right-0.5' : 'left-0.5'
              }`}></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventModal
