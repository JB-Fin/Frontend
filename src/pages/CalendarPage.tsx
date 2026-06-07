import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Plus, Users } from 'lucide-react';

const events = [
  { id: 1, title: '금융소비자보호법 세미나', date: '2026-06-08', time: '14:00 - 16:00', location: '본사 대회의실', attendees: 24, color: 'bg-blue-500' },
  { id: 2, title: 'AML 정기 점검', date: '2026-06-10', time: '10:00 - 12:00', location: '온라인', attendees: 12, color: 'bg-red-500' },
  { id: 3, title: '내부통제 워크샵', date: '2026-06-15', time: '09:00 - 17:00', location: '교육센터', attendees: 45, color: 'bg-purple-500' },
  { id: 4, title: 'KYC 절차 교육', date: '2026-06-12', time: '13:00 - 15:00', location: '본사 2층 교육장', attendees: 18, color: 'bg-green-500' },
  { id: 5, title: '리스크 평가 회의', date: '2026-06-06', time: '15:00 - 16:30', location: '회의실 A', attendees: 8, color: 'bg-yellow-500' },
];

const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 6));
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const getEventsForDate = (day: number) => {
    const date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((event) => event.date === date);
  };
  const todayEvents = events.filter((event) => event.date === '2026-06-06');
  const upcomingEvents = events.filter((event) => new Date(event.date) > new Date('2026-06-06')).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="mb-2 text-2xl font-bold text-gray-900">캘린더</h2><p className="text-gray-600">컴플라이언스 일정 및 이벤트 관리</p></div>
        <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-medium text-white transition-all hover:shadow-lg"><Plus className="h-5 w-5" />일정 추가</button>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">{currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}</h3>
            <div className="flex gap-2">
              <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="rounded-lg p-2 transition-colors hover:bg-gray-100/80"><ChevronLeft className="h-5 w-5 text-gray-600" /></button>
              <button onClick={() => setCurrentDate(new Date(2026, 5, 6))} className="rounded-lg bg-blue-50/80 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100/80">오늘</button>
              <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="rounded-lg p-2 transition-colors hover:bg-gray-100/80"><ChevronRight className="h-5 w-5 text-gray-600" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {dayNames.map((day, index) => <div key={day} className={`py-2 text-center text-sm font-medium ${index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-600'}`}>{day}</div>)}
            {Array.from({ length: firstDayOfMonth }).map((_, index) => <div key={`empty-${index}`} className="aspect-square" />)}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dayEvents = getEventsForDate(day);
              const isToday = day === 6 && currentDate.getMonth() === 5;
              return (
                <div key={day} className={`aspect-square cursor-pointer rounded-lg border p-2 transition-all ${isToday ? 'border-blue-700 bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md' : 'border-gray-200/50 bg-white/90 hover:border-blue-300/50 hover:bg-blue-50/50'}`}>
                  <span className={`mb-1 text-sm font-medium ${isToday ? 'text-white' : 'text-gray-900'}`}>{day}</span>
                  <div className="mt-1 space-y-1">{dayEvents.slice(0, 2).map((event) => <div key={event.id} className={`${event.color} h-1 rounded-full ${isToday ? 'opacity-80' : ''}`} />)}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex items-center gap-6 border-t border-gray-200/50 pt-6 text-sm">
            {['세미나', '감사', '워크샵', '교육', '회의'].map((label, index) => <div key={label} className="flex items-center gap-2"><div className={['bg-blue-500', 'bg-red-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500'][index] + ' h-3 w-3 rounded-full'} /><span className="text-gray-600">{label}</span></div>)}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900"><Calendar className="h-5 w-5 text-indigo-600" />오늘의 일정</h3>
            {todayEvents.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
          <div className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
            <h3 className="mb-4 font-bold text-gray-900">다가오는 일정</h3>
            <div className="space-y-3">{upcomingEvents.map((event) => <EventCard key={event.id} event={event} compact />)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event, compact = false }: { event: (typeof events)[number]; compact?: boolean }) {
  return (
    <div className="cursor-pointer rounded-lg border border-gray-200/50 bg-white/90 p-3 transition-all hover:shadow-md">
      <div className="flex gap-3">
        {compact && <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${event.color}`}>{event.date.split('-')[2]}</div>}
        <div className="min-w-0 flex-1">
          <h4 className="mb-1 truncate text-sm font-bold text-gray-900">{event.title}</h4>
          <div className="mb-1 flex items-center gap-1.5 text-xs text-gray-600"><Clock className="h-3 w-3" /><span>{compact ? event.time.split(' - ')[0] : event.time}</span></div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">{compact ? <Users className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}<span>{compact ? `${event.attendees}명` : event.location}</span></div>
        </div>
      </div>
    </div>
  );
}
