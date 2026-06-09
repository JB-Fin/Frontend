import { Calendar, Clock, Building2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCalendar } from '../../../context/CalendarContext'

export function CalendarWidget() {
  const navigate = useNavigate()
  const { upcomingEvents } = useCalendar()

  const recent = upcomingEvents.slice(0, 3)

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 p-3">
          <Calendar className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">다가오는 일정</h3>
          <p className="text-xs text-gray-600">
            {recent.length > 0 ? `${recent.length}건 예정` : '예정된 일정 없음'}
          </p>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-2">
        {recent.length === 0 ? (
          <p className="py-4 text-center text-xs text-gray-400">예정된 일정이 없습니다.</p>
        ) : (
          recent.map(event => (
            <div key={event.id} className="group cursor-pointer rounded-lg border border-gray-200/50 bg-white/90 p-3 transition-all hover:shadow-md">
              <div className="flex gap-3">
                <div className={`flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-lg text-white ${event.color}`}>
                  <span className="text-xs font-medium leading-none opacity-80">{event.date.slice(5, 7)}월</span>
                  <span className="text-sm font-bold leading-none">{event.date.slice(8)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="mb-1 truncate text-sm font-medium text-gray-900 transition-colors group-hover:text-indigo-600">
                    {event.title}
                  </p>
                  <div className="space-y-0.5 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      <span>{event.time.split(' - ')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3 w-3" />
                      <span>{event.department}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => navigate('/calendar')}
        className="mt-3 w-full py-2 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
      >
        전체 일정 보기 →
      </button>
    </div>
  )
}
