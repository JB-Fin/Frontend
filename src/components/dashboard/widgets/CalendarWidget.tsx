import { Clock, Building2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCalendar } from '../../../context/CalendarContext'
import { useLanguage } from '../../../context/LanguageContext'

const categoryColorMap: Record<string, string> = {
  계약검토: 'bg-blue-100 text-blue-700',
  법령검토: 'bg-violet-100 text-violet-700',
  자문: 'bg-emerald-100 text-emerald-700',
  회의: 'bg-amber-100 text-amber-700',
  마감: 'bg-rose-100 text-rose-700',
  교육: 'bg-green-100 text-green-700',
  기타: 'bg-slate-100 text-slate-700',
};

function getEventColor(category: string) {
  return categoryColorMap[category] ?? categoryColorMap.기타;
}

export function CalendarWidget() {
  const navigate = useNavigate()
  const { upcomingEvents } = useCalendar()
  const { currentLanguage, t } = useLanguage()

  const recent = upcomingEvents.slice(0, 3)

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-2">
        {recent.length === 0 ? (
          <p className="py-4 text-center text-xs text-gray-400">{t('예정된 일정이 없습니다.')}</p>
        ) : (
          recent.map(event => (
            <div key={event.id} className="group flex min-h-[76px] cursor-pointer items-center rounded-lg border border-gray-200/60 bg-white/90 p-3 transition-all hover:border-blue-200 hover:shadow-md">
              <div className="flex w-full gap-3">
                <div className={`flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-lg ${getEventColor(event.category)}`}>
                  <span className="text-xs font-medium leading-none opacity-80">
                    {event.date.slice(5, 7)}{currentLanguage === 'ko' ? '' : ' '}{t('월')}
                  </span>
                  <span className="text-sm font-bold leading-none">{event.date.slice(8)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="mb-1 truncate text-sm font-medium text-gray-900 transition-colors group-hover:text-blue-600">
                    {t(event.title)}
                  </p>
                  <div className="flex min-w-0 items-center gap-3 text-xs text-gray-600">
                    <div className="flex shrink-0 items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      <span>{event.time.split(' - ')[0]}</span>
                    </div>
                    <div className="flex min-w-0 items-center gap-1.5">
                      <Building2 className="h-3 w-3" />
                      <span className="truncate">{t(event.department)}</span>
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
        className="mt-3 w-full py-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
      >
        {t('전체 일정 보기')} →
      </button>
    </div>
  )
}
