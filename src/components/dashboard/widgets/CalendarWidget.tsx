import { Calendar, Clock, MapPin } from 'lucide-react';

const events = [
  { id: 1, title: '금융소비자보호법 세미나', date: '06.08', time: '14:00', location: '본사 대회의실' },
  { id: 2, title: 'AML 정기 점검', date: '06.10', time: '10:00', location: '온라인' },
  { id: 3, title: '내부통제 워크샵', date: '06.15', time: '09:00', location: '교육센터' },
];

export function CalendarWidget() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 p-3">
          <Calendar className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">다가오는 일정</h3>
          <p className="text-xs text-gray-600">이번 주 예정</p>
        </div>
      </div>
      <div className="flex-1 space-y-3">
        {events.map((event) => (
          <div key={event.id} className="group cursor-pointer rounded-lg border border-gray-200/50 bg-white/90 p-3 transition-all hover:shadow-md">
            <div className="flex gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                <span className="text-sm font-bold">{event.date}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-1 text-sm font-medium text-gray-900 transition-colors group-hover:text-indigo-600">{event.title}</p>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-3 w-full py-2 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700">전체 일정 보기 →</button>
    </div>
  );
}
