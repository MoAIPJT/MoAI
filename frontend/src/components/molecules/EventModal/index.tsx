import React, { useState } from 'react'
import { X, Calendar, Clock, MapPin, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: any) => void
  selectedDate?: Date
  event?: any
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
    color: event?.color || 'bg-blue-500'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const eventDate = selectedDate || new Date()
    const newEvent = {
      id: event?.id || Date.now(),
      ...formData,
      attendees: formData.attendees ? formData.attendees.split(',').map(a => a.trim()) : [],
      date: eventDate,
      day: eventDate.getDay() + 1, // 1-7 (Sunday=1, Monday=2, etc.)
      color: formData.color
    }
    onSave(newEvent)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {event ? '일정 편집' : '새 일정 만들기'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="일정 제목을 입력하세요"
              required
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                날짜
              </label>
              <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-md">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {selectedDate?.toLocaleDateString('ko-KR')}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시간
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="text-sm"
                />
                <span className="text-gray-500">~</span>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              장소
            </label>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="장소를 입력하세요"
              />
            </div>
          </div>

          {/* Attendees */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              참석자
            </label>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <Input
                value={formData.attendees}
                onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                placeholder="참석자 이름을 쉼표로 구분하여 입력하세요"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="일정에 대한 설명을 입력하세요"
              rows={3}
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              색상
            </label>
            <div className="flex gap-2">
              {[
                { name: '파란색', value: 'bg-blue-500' },
                { name: '초록색', value: 'bg-green-500' },
                { name: '보라색', value: 'bg-purple-500' },
                { name: '주황색', value: 'bg-orange-500' },
                { name: '빨간색', value: 'bg-red-500' }
              ].map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`w-8 h-8 rounded-full ${color.value} ${
                    formData.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1"
            >
              {event ? '수정' : '생성'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventModal 