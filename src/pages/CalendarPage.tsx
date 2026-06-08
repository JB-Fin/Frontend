import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Plus, X, Building2 } from 'lucide-react';

type EventType = {
  id: number;
  title: string;
  date: string;
  endDate: string;
  time: string;
  location: string;
  department: string;
  category: string;
  memo: string;
  color: string;
};

const CATEGORY_COLOR_MAP: Record<string, string> = {
  '세미나':  'bg-blue-500',
  '감사':    'bg-red-500',
  '워크샵':  'bg-purple-500',
  '교육':    'bg-green-500',
  '회의':    'bg-yellow-500',
  '점검':    'bg-orange-500',
  '기타':    'bg-gray-400',
};

const CATEGORIES = Object.keys(CATEGORY_COLOR_MAP);

const initialEvents: EventType[] = [
  { id: 1, title: '금융소비자보호법 세미나', date: '2026-06-08', endDate: '2026-06-08', time: '14:00 - 16:00', location: '본사 대회의실', department: '준법감시팀', category: '세미나', memo: '', color: 'bg-blue-500' },
  { id: 2, title: 'AML 정기 점검',           date: '2026-06-10', endDate: '2026-06-10', time: '10:00 - 12:00', location: '온라인',         department: 'AML팀',      category: '점검',  memo: '', color: 'bg-orange-500' },
  { id: 3, title: '내부통제 워크샵',          date: '2026-06-15', endDate: '2026-06-17', time: '09:00 - 17:00', location: '교육센터',       department: '내부통제팀', category: '워크샵', memo: '', color: 'bg-purple-500' },
  { id: 4, title: 'KYC 절차 교육',           date: '2026-06-12', endDate: '2026-06-12', time: '13:00 - 15:00', location: '본사 2층 교육장', department: '리스크관리팀', category: '교육', memo: '', color: 'bg-green-500' },
  { id: 5, title: '리스크 평가 회의',         date: '2026-06-08', endDate: '2026-06-08', time: '15:00 - 16:30', location: '회의실 A',       department: '리스크관리팀', category: '회의', memo: '', color: 'bg-yellow-500' },
];

const monthNames = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
const dayNames   = ['일','월','화','수','목','금','토'];
const TODAY      = '2026-06-08';

const emptyForm = {
  title: '',
  date: TODAY,
  endDate: TODAY,
  timeStart: '',
  timeEnd: '',
  location: '',
  department: '',
  category: '세미나',
  memo: '',
};

export function CalendarPage() {
  const [currentDate, setCurrentDate]   = useState(new Date(2026, 5, 8));
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [events, setEvents]             = useState<EventType[]>(initialEvents);
  const [showModal, setShowModal]       = useState(false);
  const [form, setForm]                 = useState(emptyForm);

  const daysInMonth    = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const getDateStr = (day: number) =>
    `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const getEventsForDate = (day: number) => {
    const date = getDateStr(day);
    return events.filter((e) => e.date <= date && date <= e.endDate);
  };

  const selectedEvents = events.filter((e) => e.date <= selectedDate && selectedDate <= e.endDate);
  const upcomingEvents = events
    .filter((e) => e.date > TODAY)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const handleDayClick = (day: number) => setSelectedDate(getDateStr(day));

  const openModal = () => {
    setForm({ ...emptyForm, date: selectedDate, endDate: selectedDate });
    setShowModal(true);
  };

  const handleFormChange = (field: string, value: string) => {
    setForm((f) => {
      const updated = { ...f, [field]: value };
      if (field === 'date'    && updated.endDate < value) updated.endDate = value;
      if (field === 'endDate' && value < updated.date)   updated.date    = value;
      return updated;
    });
  };

  const handleAddEvent = () => {
    if (!form.title || !form.date) return;
    const color = CATEGORY_COLOR_MAP[form.category] ?? 'bg-gray-400';
    const newEvent: EventType = {
      id: Date.now(),
      title:      form.title,
      date:       form.date,
      endDate:    form.endDate || form.date,
      time:       form.timeStart && form.timeEnd
                    ? `${form.timeStart} - ${form.timeEnd}`
                    : form.timeStart || '시간 미정',
      location:   form.location   || '장소 미정',
      department: form.department || '미지정',
      category:   form.category,
      memo:       form.memo,
      color,
    };
    setEvents((prev) => [...prev, newEvent]);
    setSelectedDate(form.date);
    setShowModal(false);
    setForm(emptyForm);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">캘린더</h2>
          <p className="text-gray-600">컴플라이언스 일정 및 이벤트 관리</p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-medium text-white transition-all hover:shadow-lg"
        >
          <Plus className="h-5 w-5" />일정 추가
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 캘린더 본체 */}
        <div className="col-span-2 rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100/80"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={() => { setCurrentDate(new Date(2026, 5, 8)); setSelectedDate(TODAY); }}
                className="rounded-lg bg-blue-50/80 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100/80"
              >
                오늘
              </button>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100/80"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {dayNames.map((day, index) => (
              <div
                key={day}
                className={`py-2 text-center text-sm font-medium ${index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-600'}`}
              >
                {day}
              </div>
            ))}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="aspect-square" />)}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day      = index + 1;
              const dayEvents = getEventsForDate(day);
              const dateStr  = getDateStr(day);
              const isToday    = dateStr === TODAY;
              const isSelected = dateStr === selectedDate && !isToday;

              return (
                <div
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`aspect-square cursor-pointer rounded-lg border p-2 transition-all
                    ${isToday    ? 'border-blue-700 bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md'
                    : isSelected ? 'border-indigo-400 bg-indigo-50 shadow-sm'
                    :              'border-gray-200/50 bg-white/90 hover:border-blue-300/50 hover:bg-blue-50/50'}`}
                >
                  <span className={`text-sm font-medium ${isToday ? 'text-white' : isSelected ? 'text-indigo-700' : 'text-gray-900'}`}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div key={event.id} className={`${event.color} h-1 rounded-full ${isToday ? 'opacity-80' : ''}`} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 범례 — 카테고리 기반으로 자동 생성 */}
          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-gray-200/50 pt-6 text-sm">
            {CATEGORIES.map((cat) => (
              <div key={cat} className="flex items-center gap-2">
                <div className={`${CATEGORY_COLOR_MAP[cat]} h-3 w-3 rounded-full`} />
                <span className="text-gray-600">{cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 사이드바 */}
        <div className="space-y-4">
          <div className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
              <Calendar className="h-5 w-5 text-indigo-600" />
              {selectedDate === TODAY ? '오늘의 일정' : `${selectedDate.replace(/-/g, '.')} 일정`}
            </h3>
            {selectedEvents.length > 0
              ? selectedEvents.map((event) => <EventCard key={event.id} event={event} />)
              : <p className="text-sm text-gray-400">일정이 없습니다.</p>
            }
          </div>

          <div className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
            <h3 className="mb-4 font-bold text-gray-900">다가오는 일정</h3>
            <div className="space-y-3">
              {upcomingEvents.length > 0
                ? upcomingEvents.map((event) => <EventCard key={event.id} event={event} compact />)
                : <p className="text-sm text-gray-400">예정된 일정이 없습니다.</p>
              }
            </div>
          </div>
        </div>
      </div>

      {/* 일정 추가 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">새 일정 추가</h3>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1.5 hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              {/* 제목 */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">제목 *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  placeholder="일정 제목을 입력하세요"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* 카테고리 — 선택 시 색상 자동 배정 */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">카테고리 *</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const active = form.category === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => handleFormChange('category', cat)}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-all
                          ${active
                            ? 'border-transparent text-white shadow-sm ' + CATEGORY_COLOR_MAP[cat]
                            : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100'
                          }`}
                      >
                        {!active && <span className={`inline-block h-2 w-2 rounded-full ${CATEGORY_COLOR_MAP[cat]}`} />}
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 기간 */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">기간 *</label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => handleFormChange('date', e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <span className="flex-shrink-0 text-sm text-gray-400">~</span>
                  <input
                    type="date"
                    value={form.endDate}
                    min={form.date}
                    onChange={(e) => handleFormChange('endDate', e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* 시간 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">시작 시간</label>
                  <input
                    type="time"
                    value={form.timeStart}
                    onChange={(e) => handleFormChange('timeStart', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">종료 시간</label>
                  <input
                    type="time"
                    value={form.timeEnd}
                    onChange={(e) => handleFormChange('timeEnd', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* 장소 */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">장소</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => handleFormChange('location', e.target.value)}
                  placeholder="장소를 입력하세요"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* 관할 부서 */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">관할 부서</label>
                <input
                  type="text"
                  value={form.department}
                  onChange={(e) => handleFormChange('department', e.target.value)}
                  placeholder="예) 준법감시팀, 리스크관리팀"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* 메모 */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">메모</label>
                <textarea
                  value={form.memo}
                  onChange={(e) => handleFormChange('memo', e.target.value)}
                  placeholder="추가 메모를 입력하세요"
                  rows={3}
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleAddEvent}
                disabled={!form.title || !form.date}
                className="flex-1 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-medium text-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EventCard({ event, compact = false }: { event: EventType; compact?: boolean }) {
  const isMultiDay = event.date !== event.endDate;

  return (
    <div className="cursor-pointer rounded-lg border border-gray-200/50 bg-white/90 p-3 transition-all hover:shadow-md">
      <div className="flex gap-3">
        {compact && (
          <div className={`flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-lg text-white ${event.color}`}>
            <span className="text-xs font-medium leading-none opacity-80">{event.date.slice(5, 7)}월</span>
            <span className="text-sm font-bold leading-none">{event.date.slice(8)}</span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          {/* 카테고리 뱃지 */}
          <div className="mb-1 flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white ${event.color}`}>
              {event.category}
            </span>
          </div>
          <h4 className="mb-1 truncate text-sm font-bold text-gray-900">{event.title}</h4>
          {isMultiDay && (
            <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-indigo-500">
              <Calendar className="h-3 w-3" />
              <span>{event.date.slice(5).replace('-', '.')} ~ {event.endDate.slice(5).replace('-', '.')}</span>
            </div>
          )}
          <div className="mb-1 flex items-center gap-1.5 text-xs text-gray-600">
            <Clock className="h-3 w-3" />
            <span>{compact ? event.time.split(' - ')[0] : event.time}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            {compact
              ? <><Building2 className="h-3 w-3" /><span>{event.department}</span></>
              : <><MapPin className="h-3 w-3" /><span>{event.location}</span></>
            }
          </div>
          {!compact && event.memo && (
            <p className="mt-2 rounded-md bg-gray-50 px-2 py-1.5 text-xs text-gray-500 leading-relaxed">{event.memo}</p>
          )}
        </div>
      </div>
    </div>
  );
}
