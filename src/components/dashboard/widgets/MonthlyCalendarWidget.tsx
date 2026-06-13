import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendar } from '../../../context/CalendarContext';

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

function parseDateParts(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return { year, month, day };
}

function getMonthLabel(year: number, month: number) {
  return `${year}.${String(month).padStart(2, '0')}`;
}

function getDateString(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function MonthlyCalendarWidget() {
  const navigate = useNavigate();
  const { events, today } = useCalendar();
  const todayParts = parseDateParts(today);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(todayParts.year, todayParts.month - 1, 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(today);

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth() + 1;
  const isCurrentMonth = year === todayParts.year && month === todayParts.month;

  const monthDays = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1).getDay();
    const lastDate = new Date(year, month, 0).getDate();
    const days = [
      ...Array.from({ length: firstDay }, () => null),
      ...Array.from({ length: lastDate }, (_, index) => index + 1),
    ];

    return [...days, ...Array.from({ length: Math.max(0, 42 - days.length) }, () => null)];
  }, [month, year]);

  const eventsByDay = useMemo(() => {
    return events.reduce<Record<number, typeof events>>((acc, event) => {
      for (let date = 1; date <= new Date(year, month, 0).getDate(); date += 1) {
        const dateString = getDateString(year, month, date);
        if (event.date <= dateString && dateString <= event.endDate) {
          acc[date] = [...(acc[date] ?? []), event];
        }
      }
      return acc;
    }, {});
  }, [events, month, year]);

  const moveMonth = (offset: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
    setSelectedDate(null);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-2 flex items-center justify-end gap-2">
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => moveMonth(-1)}
            className="rounded p-1 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-700"
            aria-label="이전 달"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="rounded bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
            {getMonthLabel(year, month)}
          </span>
          <button
            type="button"
            onClick={() => moveMonth(1)}
            className="rounded p-1 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-700"
            aria-label="다음 달"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-gray-500">
        {weekDays.map((weekDay) => (
          <span key={weekDay}>{weekDay}</span>
        ))}
      </div>

      <div className="mt-2 grid min-h-0 flex-1 grid-cols-7 grid-rows-6 gap-1 overflow-hidden">
        {monthDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="min-w-0 rounded-md bg-gray-50/60" />;
          }

          const dayEvents = eventsByDay[date] ?? [];
          const dateString = getDateString(year, month, date);
          const isToday = isCurrentMonth && date === todayParts.day;
          const isSelected = selectedDate === dateString;
          const hasEvents = dayEvents.length > 0;
          const eventTitles = dayEvents.map((event) => event.title).join(', ');

          return (
            <button
              key={`${year}-${month}-${date}`}
              type="button"
              onClick={() => setSelectedDate(dateString)}
              className={`flex min-h-0 min-w-0 items-center justify-center overflow-hidden rounded-md border px-0.5 py-0.5 text-center transition-all hover:border-blue-300 hover:bg-blue-50 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-400'
                  : isToday
                    ? 'border-blue-300 bg-blue-50'
                    : hasEvents
                      ? 'border-blue-100 bg-white'
                      : 'border-gray-200/70 bg-white/90'
              }`}
            >
              <span
                className={`flex h-5 min-w-5 items-center justify-center rounded px-1 text-[11px] font-semibold leading-5 ${
                  hasEvents ? 'bg-blue-100 text-blue-700' : isToday ? 'text-blue-700' : 'text-gray-700'
                }`}
                title={hasEvents ? eventTitles : undefined}
              >
                {date}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => navigate('/calendar')}
        className="mt-3 w-full py-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
      >
        전체 일정 보기 →
      </button>
    </div>
  );
}
