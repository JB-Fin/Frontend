import { useState } from 'react'
import { Building2, Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useCalendar, type EventType } from '../context/CalendarContext'

const CATEGORY_COLOR_MAP: Record<string, string> = {
  '세미나': 'bg-blue-100 text-blue-700',
  '감사': 'bg-rose-100 text-rose-700',
  '워크샵': 'bg-violet-100 text-violet-700',
  '교육': 'bg-emerald-100 text-emerald-700',
  '회의': 'bg-amber-100 text-amber-700',
  '점검': 'bg-orange-100 text-orange-700',
  '기타': 'bg-slate-100 text-slate-700',
}

const CATEGORIES = Object.keys(CATEGORY_COLOR_MAP)
const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
const dayNames = ['일', '월', '화', '수', '목', '금', '토']
const TODAY = '2026-06-08'

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
}

export function CalendarPage() {
  const { events, addEvent, updateEvent, deleteEvent } = useCalendar()

  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 8))
  const [selectedDate, setSelectedDate] = useState(TODAY)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editingEventId, setEditingEventId] = useState<number | null>(null)

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate()

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay()

  const getDateStr = (day: number) =>
    `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const getEventsForDate = (day: number) => {
    const date = getDateStr(day)
    return events.filter(e => e.date <= date && date <= e.endDate)
  }

  const selectedEvents = events.filter(
    e => e.date <= selectedDate && selectedDate <= e.endDate
  )

  const upcomingEvents = events
    .filter(e => e.date > TODAY)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5)

  const handleFormChange = (field: string, value: string) => {
    setForm(f => {
      const updated = { ...f, [field]: value }

      if (field === 'date' && updated.endDate < value) {
        updated.endDate = value
      }

      if (field === 'endDate' && value < updated.date) {
        updated.date = value
      }

      return updated
    })
  }

  const resetModal = () => {
    setShowModal(false)
    setEditingEventId(null)
    setForm(emptyForm)
  }

  const getFormFromEvent = (event: EventType) => {
    const [timeStart = '', timeEnd = ''] =
      event.time === '시간 미정' ? [] : event.time.split(' - ')

    return {
      title: event.title,
      date: event.date,
      endDate: event.endDate,
      timeStart,
      timeEnd,
      location: event.location === '장소 미정' ? '' : event.location,
      department: event.department === '미지정' ? '' : event.department,
      category: event.category,
      memo: event.memo,
    }
  }

  const openAddModal = () => {
    setEditingEventId(null)
    setForm({ ...emptyForm, date: selectedDate, endDate: selectedDate })
    setShowModal(true)
  }

  const openEditModal = (event: EventType) => {
    setEditingEventId(event.id)
    setForm(getFormFromEvent(event))
    setShowModal(true)
  }

  const handleDeleteEvent = (event: EventType) => {
    if (!window.confirm(`'${event.title}' 일정을 삭제할까요?`)) return

    deleteEvent(event.id)
  }

  const handleSaveEvent = () => {
    if (!form.title || !form.date) return

    const eventPayload = {
      title: form.title,
      date: form.date,
      endDate: form.endDate || form.date,
      time:
        form.timeStart && form.timeEnd
          ? `${form.timeStart} - ${form.timeEnd}`
          : form.timeStart || '시간 미정',
      location: form.location || '장소 미정',
      department: form.department || '미지정',
      category: form.category,
      memo: form.memo,
      color: CATEGORY_COLOR_MAP[form.category] ?? CATEGORY_COLOR_MAP['기타'],
    }

    if (editingEventId === null) {
      addEvent(eventPayload)
    } else {
      updateEvent(editingEventId, eventPayload)
    }

    setSelectedDate(form.date)
    resetModal()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">캘린더</h2>
          <p className="text-gray-600">Compliance 일정 및 이벤트 관리</p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-medium text-white transition-all hover:shadow-lg"
        >
          <Plus className="h-5 w-5" />
          일정 추가
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
            </h3>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
                  )
                }
                className="rounded-lg p-2 transition-colors hover:bg-gray-100/80"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>

              <button
                onClick={() => {
                  setCurrentDate(new Date(2026, 5, 8))
                  setSelectedDate(TODAY)
                }}
                className="rounded-lg bg-blue-50/80 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100/80"
              >
                오늘
              </button>

              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
                  )
                }
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
                className={`py-2 text-center text-sm font-medium ${
                  index === 0
                    ? 'text-red-600'
                    : index === 6
                    ? 'text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                {day}
              </div>
            ))}

            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-28" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1
              const dayEvents = getEventsForDate(day)
              const dateStr = getDateStr(day)
              const isToday = dateStr === TODAY
              const isSelected = dateStr === selectedDate && !isToday

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-28 cursor-pointer rounded-lg border p-2 transition-all ${
                    isToday
                      ? 'border-blue-700 bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md'
                      : isSelected
                      ? 'border-indigo-400 bg-indigo-50 shadow-sm'
                      : 'border-gray-200/50 bg-white/90 hover:border-blue-300/50 hover:bg-blue-50/50'
                  }`}
                >
                  <span
                    className={`text-sm font-medium ${
                      isToday
                        ? 'text-white'
                        : isSelected
                        ? 'text-indigo-700'
                        : 'text-gray-900'
                    }`}
                  >
                    {day}
                  </span>

                  <div className="mt-2 space-y-1 overflow-hidden">
                    {dayEvents.slice(0, 3).map(event => {
                      const eventColor =
                        CATEGORY_COLOR_MAP[event.category] ?? CATEGORY_COLOR_MAP['기타']

                      return (
                        <div
                          key={event.id}
                          className={`${eventColor} truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium`}
                        >
                          {event.title}
                        </div>
                      )
                    })}

                    {dayEvents.length > 3 && (
                      <div className={`text-[10px] ${isToday ? 'text-white/80' : 'text-gray-500'}`}>
                        +{dayEvents.length - 3}개
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-gray-200/50 pt-6 text-sm">
            {CATEGORIES.map(cat => (
              <div key={cat} className="flex items-center gap-2">
                <div className={`${CATEGORY_COLOR_MAP[cat]} h-3 w-3 rounded-full`} />
                <span className="text-gray-600">{cat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
              <Calendar className="h-5 w-5 text-indigo-600" />
              {selectedDate === TODAY ? '오늘의 일정' : `${selectedDate.replace(/-/g, '.')} 일정`}
            </h3>

            {selectedEvents.length > 0 ? (
              selectedEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={openEditModal}
                  onDelete={handleDeleteEvent}
                />
              ))
            ) : (
              <p className="text-sm text-gray-400">일정이 없습니다.</p>
            )}
          </div>

          <div className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
            <h3 className="mb-4 font-bold text-gray-900">다가오는 일정</h3>

            <div className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    compact
                    onEdit={openEditModal}
                    onDelete={handleDeleteEvent}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-400">예정된 일정이 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {editingEventId === null ? '새 일정 추가' : '일정 수정'}
              </h3>

              <button
                onClick={resetModal}
                className="rounded-lg p-1.5 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  제목 *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => handleFormChange('title', e.target.value)}
                  placeholder="일정 제목을 입력하세요"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  카테고리 *
                </label>

                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => {
                    const active = form.category === cat

                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleFormChange('category', cat)}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-all ${
                          active
                            ? `border-transparent shadow-sm ${CATEGORY_COLOR_MAP[cat]}`
                            : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {!active && (
                          <span
                            className={`inline-block h-2 w-2 rounded-full ${
                              CATEGORY_COLOR_MAP[cat] ?? CATEGORY_COLOR_MAP['기타']
                            }`}
                          />
                        )}
                        {cat}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  기간 *
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => handleFormChange('date', e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />

                  <span className="flex-shrink-0 text-sm text-gray-400">~</span>

                  <input
                    type="date"
                    value={form.endDate}
                    min={form.date}
                    onChange={e => handleFormChange('endDate', e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    시작 시간
                  </label>
                  <input
                    type="time"
                    value={form.timeStart}
                    onChange={e => handleFormChange('timeStart', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    종료 시간
                  </label>
                  <input
                    type="time"
                    value={form.timeEnd}
                    onChange={e => handleFormChange('timeEnd', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  장소
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={e => handleFormChange('location', e.target.value)}
                  placeholder="장소를 입력하세요"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  관할 부서
                </label>
                <input
                  type="text"
                  value={form.department}
                  onChange={e => handleFormChange('department', e.target.value)}
                  placeholder="예) 준법감시팀, 리스크관리팀"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  메모
                </label>
                <textarea
                  value={form.memo}
                  onChange={e => handleFormChange('memo', e.target.value)}
                  placeholder="추가 메모를 입력하세요"
                  rows={3}
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={resetModal}
                className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>

              <button
                type="button"
                onClick={handleSaveEvent}
                disabled={!form.title || !form.date}
                className="flex-1 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-medium text-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                {editingEventId === null ? '추가' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EventCard({
  event,
  compact = false,
  onEdit,
  onDelete,
}: {
  event: EventType
  compact?: boolean
  onEdit: (event: EventType) => void
  onDelete: (event: EventType) => void
}) {
  const isMultiDay = event.date !== event.endDate
  const eventColor = CATEGORY_COLOR_MAP[event.category] ?? CATEGORY_COLOR_MAP['기타']

  return (
    <div className="cursor-pointer rounded-lg border border-gray-200/50 bg-white/90 p-3 transition-all hover:shadow-md">
      <div className="flex gap-3">
        {compact && (
          <div
            className={`flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-lg ${eventColor}`}
          >
            <span className="text-xs font-medium leading-none opacity-80">
              {event.date.slice(5, 7)}월
            </span>
            <span className="text-sm font-bold leading-none">
              {event.date.slice(8)}
            </span>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-start justify-between gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${eventColor}`}
            >
              {event.category}
            </span>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(event)
                }}
                className="rounded-md p-1 text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                aria-label={`${event.title} 수정`}
                title="수정"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(event)
                }}
                className="rounded-md p-1 text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                aria-label={`${event.title} 삭제`}
                title="삭제"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <h4 className="mb-1 truncate text-sm font-bold text-gray-900">
            {event.title}
          </h4>

          {isMultiDay && (
            <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-indigo-500">
              <Calendar className="h-3 w-3" />
              <span>
                {event.date.slice(5).replace('-', '.')} ~{' '}
                {event.endDate.slice(5).replace('-', '.')}
              </span>
            </div>
          )}

          <div className="mb-1 flex items-center gap-1.5 text-xs text-gray-600">
            <Clock className="h-3 w-3" />
            <span>{compact ? event.time.split(' - ')[0] : event.time}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            {compact ? (
              <>
                <Building2 className="h-3 w-3" />
                <span>{event.department}</span>
              </>
            ) : (
              <>
                <MapPin className="h-3 w-3" />
                <span>{event.location}</span>
              </>
            )}
          </div>

          {!compact && event.memo && (
            <p className="mt-2 rounded-md bg-gray-50 px-2 py-1.5 text-xs leading-relaxed text-gray-500">
              {event.memo}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
