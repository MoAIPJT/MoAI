"use client";

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export interface CalendarEvent {
  date: Date;
  color: string;
  title?: string;
  startTime?: string;
  endTime?: string;
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
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [selected, setSelected] = React.useState<Date | undefined>(selectedDate);

  React.useEffect(() => {
    if (selectedDate) {
      setSelected(selectedDate);
      setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    }
  }, [selectedDate]);

  const handleDateSelect = (date: Date) => {
    setSelected(date);
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

  // 선택된 날짜의 이벤트들
  const selectedDateEvents = selected ? getEventsForDate(selected) : [];

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
            <button
              key={index}
              onClick={() => handleDateSelect(day)}
              className={cn(
                "relative h-9 w-14 flex items-center justify-center text-sm rounded-lg transition-colors",
                isOutsideMonth && "text-muted-foreground/30",
                !isOutsideMonth && "text-foreground",
                isSelected && "bg-[#AA64FF] text-white",
                !isSelected && !isOutsideMonth && "hover:bg-[#9861FD]/20 hover:text-[#9861FD]",
                isTodayDate && !isSelected && "font-bold"
              )}
            >
              <span>{day.getDate()}</span>
              {hasEvents && (
                <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 flex gap-0.1">
                  {dayEvents.slice(0, 3).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: isSelected ? '#ffffff' : event.color
                      }}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: isSelected ? '#ffffff' : '#9ca3af'
                      }}
                    />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Date Events */}
      {selected && selectedDateEvents.length > 0 && (
        <div className="border-t p-3 bg-gray-50">
          <div className="text-sm font-medium text-gray-700 mb-2">
            {selected.toLocaleDateString('ko-KR', {
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })} 일정
          </div>
          <div className="space-y-2">
            {selectedDateEvents.map((event, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
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
        </div>
      )}
    </div>
  );
}

CustomCalendar.displayName = "CustomCalendar";

export { CustomCalendar as Calendar };
