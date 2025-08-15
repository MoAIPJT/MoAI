"use client";

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export interface CalendarEvent {
  date: Date;
  color: string;
  title?: string;
  startTime?: string;
  endTime?: string;
  studyId?: number;
  studyName?: string;
  studyDescription?: string;
  studyImage?: string;
}

export interface CustomCalendarProps {
  className?: string;
  events?: CalendarEvent[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onAddEvent?: () => void;
  onMonthChange?: (date: Date) => void;
}

function CustomCalendar({
  className,
  events = [],
  selectedDate,
  onDateSelect,
  onAddEvent,
  onMonthChange,
}: CustomCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [selected, setSelected] = useState<Date | undefined>(selectedDate);
  const [showEvents, setShowEvents] = useState(false); // 일정 팝업 표시 여부

  useEffect(() => {
    if (selectedDate) {
      setSelected(selectedDate);
      setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    }
  }, [selectedDate]);

  const handleDateSelect = (date: Date) => {
    // 같은 날짜를 클릭한 경우 토글
    if (selected && isSameDay(date, selected)) {
      setShowEvents(!showEvents);
    } else {
      // 다른 날짜를 클릭한 경우 선택하고 일정 표시
      setSelected(date);
      setShowEvents(true);
    }
    onDateSelect?.(date);
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
    // 월이 변경되면 일정 팝업 닫기
    setShowEvents(false);
    onMonthChange?.(newMonth);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    while (currentDate <= lastDay || currentDate.getDay() !== 0) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className={cn("w-fit bg-white rounded-lg shadow-sm border", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleMonthChange('prev')}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "size-8 p-0 text-muted-foreground/80 hover:text-foreground"
            )}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-base font-bold">
            {currentMonth.toLocaleDateString('ko-KR', {
              month: 'numeric',
              year: 'numeric'
            })}
          </span>
          <button
            onClick={() => handleMonthChange('next')}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "size-8 p-0 text-muted-foreground/80 hover:text-foreground"
            )}
          >
            <ChevronRight size={16} />
          </button>
        </div>
        {onAddEvent && (
          <button
            onClick={onAddEvent}
            className="size-8 p-0 text-muted-foreground/80 hover:text-foreground"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b">
        <div className="h-9 w-14 p-0 text-xs font-medium text-red-500 text-center flex items-center justify-center">일</div>
        <div className="h-9 w-14 p-0 text-xs font-medium text-black text-center flex items-center justify-center">월</div>
        <div className="h-9 w-14 p-0 text-xs font-medium text-black text-center flex items-center justify-center">화</div>
        <div className="h-9 w-14 p-0 text-xs font-medium text-black text-center flex items-center justify-center">수</div>
        <div className="h-9 w-14 p-0 text-xs font-medium text-black text-center flex items-center justify-center">목</div>
        <div className="h-9 w-14 p-0 text-xs font-medium text-black text-center flex items-center justify-center">금</div>
        <div className="h-9 w-14 p-0 text-xs font-medium text-blue-500 text-center flex items-center justify-center">토</div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const isSelected = selected && isSameDay(day, selected);
          const isOutsideMonth = !isCurrentMonth(day);
          const isTodayDate = isToday(day);
          const dayEvents = getEventsForDate(day);
          const hasEvents = dayEvents.length > 0;

          return (
            <div key={index} className="relative">
              <button
                onClick={() => handleDateSelect(day)}
                className={cn(
                  "relative h-9 w-14 flex items-center justify-center text-sm rounded-lg transition-colors",
                  isOutsideMonth && "text-muted-foreground/30",
                  !isOutsideMonth && "text-foreground",
                  isSelected && "bg-[#AA64FF] text-white",
                  !isSelected && !isOutsideMonth && "hover:bg-[#AA64FF]/20 hover:text-[#AA64FF]",
                  isTodayDate && !isSelected && "font-bold"
                )}
              >
                <span>{day.getDate()}</span>
                {hasEvents && (
                  <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: isSelected ? '#ffffff' : '#AA64FF'
                      }}
                    />
                  </div>
                )}
              </button>

              {/* Event Popup below the selected date - 토글 방식으로 표시 */}
              {isSelected && hasEvents && showEvents && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-10">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-48 max-w-64">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      {day.toLocaleDateString('ko-KR', {
                        month: 'long',
                        day: 'numeric',
                        weekday: 'long'
                      })} 일정
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {dayEvents.map((event, eventIndex) => (
                        <div key={eventIndex} className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: event.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {event.title || '제목 없음'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {event.startTime} - {event.endTime}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Arrow pointing up to the date */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white"></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

CustomCalendar.displayName = "CustomCalendar";

export { CustomCalendar as Calendar };
