import { useState } from 'react'
import '../styles/calendar.css'

const EVENTS = [
  { id: 1, title: '금융소비자보호법 세미나', date: '2026-06-08', time: '14:00 - 16:00', location: '본사 대회의실', attendees: 24, color: '#4A9FD4', type: '세미나' },
  { id: 2, title: 'AML 정기 점검',          date: '2026-06-10', time: '10:00 - 12:00', location: '온라인',       attendees: 12, color: '#E53E3E', type: '감사'   },
  { id: 3, title: '내부통제 워크샵',         date: '2026-06-15', time: '09:00 - 17:00', location: '교육센터',     attendees: 45, color: '#9F7AEA', type: '워크샵' },
  { id: 4, title: 'KYC 절차 교육',          date: '2026-06-12', time: '13:00 - 15:00', location: '본사 2층 교육장', attendees: 18, color: '#2F855A', type: '교육' },
  { id: 5, title: '리스크 평가 회의',        date: '2026-06-07', time: '15:00 - 16:30', location: '회의실 A',     attendees: 8,  color: '#D97706', type: '회의'  },
]

const MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
const DAYS   = ['일','월','화','수','목','금','토']
const TODAY  = '2026-06-07'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 7))
  const [showModal, setShowModal] = useState(false)
  const [events, setEvents] = useState(EVENTS)
  const [selectedDate, setSelectedDate] = useState(TODAY)
  const [form, setForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    type: '회의',
    color: '#1B3A6B'
  })
  const selectedEvents = events.filter(
    e => e.date === selectedDate
  )
  const year  = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay    = new Date(year, month, 1).getDay()

  const dateStr = (day) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const eventsForDay = (day) => events.filter(e => e.date === dateStr(day))
  const todayEvents    = events.filter(e => e.date === TODAY)
  const upcomingEvents = events.filter(e => e.date > TODAY).sort((a, b) => a.date.localeCompare(b.date))

  const handleAdd = () => {
    if (!form.title || !form.date) return
    setEvents(prev => [...prev, { ...form, id: Date.now(), attendees: 0 }])
    setForm({ title: '', date: '', time: '', location: '', type: '회의', color: '#1B3A6B' })
    setShowModal(false)
  }

  return (
    <div className="cal-page">

      {/* 상단 헤더 */}
      <div className="cal-page__header">
        <div>
          <h2 className="cal-page__title">캘린더</h2>
          <p className="cal-page__sub">컴플라이언스 일정과 이벤트를 관리합니다.</p>
        </div>
        <button className="cal-add-btn" onClick={() => setShowModal(true)}>
          + 일정 추가
        </button>
      </div>

      {/* 메인 레이아웃 */}
      <div className="cal-layout">

        {/* 캘린더 그리드 */}
        <div className="cal-card">
          {/* 월 네비게이션 */}
          <div className="cal-nav">
            <button onClick={() => setCurrentDate(new Date(year, month - 1))}>‹</button>
            <h3>{year}년 {MONTHS[month]}</h3>
            <button onClick={() => setCurrentDate(new Date(year, month + 1))}>›</button>
            <button className="cal-today-btn" onClick={() => setCurrentDate(new Date(2026, 5, 7))}>오늘</button>
          </div>

          {/* 요일 헤더 */}
          <div className="cal-grid">
            {DAYS.map(d => (
              <div key={d} className="cal-weekday">{d}</div>
            ))}

            {/* 빈 칸 */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="cal-cell cal-cell--empty" />
            ))}

            {/* 날짜 */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dayEvents = eventsForDay(day)
              const isToday = dateStr(day) === TODAY
              return (
                <div
                key={day}
                className={`
                  cal-cell
                  ${isToday ? ' cal-cell--today' : ''}
                  ${selectedDate === dateStr(day) ? ' cal-cell--selected' : ''}
                  `}
                  onClick={() => setSelectedDate(dateStr(day))}
                  >
                  <span className="cal-cell__num">{day}</span>
                  <div className="cal-cell__dots">
                    {dayEvents.slice(0, 3).map(e => (
                      <span key={e.id} className="cal-dot" style={{ background: e.color }} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* 색상 범례 */}
          <div className="cal-legend">
            {[
              { label: '세미나', color: '#4A9FD4' },
              { label: '감사',   color: '#E53E3E' },
              { label: '워크샵', color: '#9F7AEA' },
              { label: '교육',   color: '#2F855A' },
              { label: '회의',   color: '#D97706' },
            ].map(item => (
              <div key={item.label} className="cal-legend__item">
                <span className="cal-dot" style={{ background: item.color }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
          <div className="cal-selected-events">
            <h3>
              📅 {selectedDate} 일정
              </h3>
              
              {selectedEvents.length === 0 ? (
                <p className="cal-empty">
                  등록된 일정이 없습니다.
                  </p>
                  ) : (
                  <div className="cal-event-list">
                    {selectedEvents.map(event => (
                      <EventCard
                      key={event.id}
                      event={event}
                      />
                      ))}
                      </div>
                    )}
                    </div>
      {/* 선택한 날짜 일정 */}
<div className="cal-card cal-selected-events">
  <h3 className="cal-section__title">
    📅 {selectedDate} 일정
  </h3>

  {selectedEvents.length === 0 ? (
    <p className="cal-empty">
      등록된 일정이 없습니다.
    </p>
  ) : (
    <div className="cal-event-list">
      {selectedEvents.map(event => (
        <EventCard
          key={event.id}
          event={event}
        />
      ))}
    </div>
  )}
</div>

{/* 우측 사이드 */}
<div className="cal-side">
  <div className="cal-card cal-card--scroll">
    <h3 className="cal-section__title">
      다가오는 일정
    </h3>

    {upcomingEvents.length === 0 ? (
      <p className="cal-empty">
        예정된 일정이 없습니다.
      </p>
    ) : (
      <div className="cal-event-list">
        {upcomingEvents.map(e => (
          <EventCard
            key={e.id}
            event={e}
          />
        ))}
      </div>
    )}
  </div>
</div>

</div>            

      {/* 일정 추가 모달 */}
      {showModal && (
        <div className="cal-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="cal-modal" onClick={e => e.stopPropagation()}>
            <div className="cal-modal__header">
              <h3>일정 추가</h3>
              <button className="cal-modal__close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="cal-modal__body">
              <label className="cal-label">제목 *</label>
              <input
                className="cal-input"
                placeholder="일정 제목"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              />

              <label className="cal-label">날짜 *</label>
              <input
                className="cal-input"
                type="date"
                value={form.date}
                onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
              />

              <label className="cal-label">시간</label>
              <input
                className="cal-input"
                placeholder="예: 14:00 - 16:00"
                value={form.time}
                onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
              />

              <label className="cal-label">장소</label>
              <input
                className="cal-input"
                placeholder="장소"
                value={form.location}
                onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
              />

              <label className="cal-label">유형</label>
              <select
                className="cal-input"
                value={form.type}
                onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
              >
                {['회의', '세미나', '교육', '감사', '워크샵'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <label className="cal-label">색상</label>
              <div className="cal-color-row">
                {['#1B3A6B','#4A9FD4','#E53E3E','#9F7AEA','#2F855A','#D97706'].map(c => (
                  <button
                    key={c}
                    className={`cal-color-btn${form.color === c ? ' selected' : ''}`}
                    style={{ background: c }}
                    onClick={() => setForm(p => ({ ...p, color: c }))}
                  />
                ))}
              </div>
            </div>

            <div className="cal-modal__footer">
              <button className="cal-cancel-btn" onClick={() => setShowModal(false)}>취소</button>
              <button className="cal-submit-btn" onClick={handleAdd}>추가</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EventCard({ event }) {
  return (
    <div className="cal-event-card" style={{ borderLeftColor: event.color }}>
      <div className="cal-event-card__top">
        <span className="cal-event-card__title">{event.title}</span>
        <span className="cal-event-card__type" style={{ color: event.color, background: event.color + '18' }}>
          {event.type}
        </span>
      </div>
      {event.time     && <p className="cal-event-card__info">🕐 {event.time}</p>}
      {event.location && <p className="cal-event-card__info">📍 {event.location}</p>}
      {event.attendees > 0 && <p className="cal-event-card__info">👥 {event.attendees}명 참석</p>}
    </div>
  )
}