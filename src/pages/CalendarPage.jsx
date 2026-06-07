import { useState } from 'react'
import '../styles/pages.css'

const EVENTS = [
  { id: 1, title: '금융소비자보호법 세미나', date: '2026-06-08', time: '14:00 - 16:00', location: '본사 대회의실', attendees: 24, color: 'blue', type: '세미나' },
  { id: 2, title: 'AML 정기 점검', date: '2026-06-10', time: '10:00 - 12:00', location: '온라인', attendees: 12, color: 'red', type: '감사' },
  { id: 3, title: '내부통제 워크샵', date: '2026-06-15', time: '09:00 - 17:00', location: '교육센터', attendees: 45, color: 'purple', type: '워크샵' },
  { id: 4, title: 'KYC 절차 교육', date: '2026-06-12', time: '13:00 - 15:00', location: '본사 2층 교육장', attendees: 18, color: 'green', type: '교육' },
  { id: 5, title: '리스크 평가 회의', date: '2026-06-06', time: '15:00 - 16:30', location: '회의실 A', attendees: 8, color: 'yellow', type: '회의' },
]

const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
const DAYS = ['일', '월', '화', '수', '목', '금', '토']

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 6))
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const todayEvents = EVENTS.filter(event => event.date === '2026-06-06')
  const upcomingEvents = EVENTS.filter(event => event.date > '2026-06-06')

  const eventsForDay = (day) => {
    const date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return EVENTS.filter(event => event.date === date)
  }

  return (
    <main className="workspace-page page-stack">
      <header className="page-head">
        <div>
          <h2>캘린더</h2>
          <p>컴플라이언스 일정과 이벤트를 관리합니다.</p>
        </div>
        <button type="button" className="primary-action">일정 추가</button>
      </header>

      <section className="calendar-layout">
        <div className="glass-card panel-pad">
          <div className="calendar-head">
            <h3>{currentDate.getFullYear()}년 {MONTHS[currentDate.getMonth()]}</h3>
            <div className="calendar-nav">
              <button type="button" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>‹</button>
              <button type="button" onClick={() => setCurrentDate(new Date(2026, 5, 6))}>오늘</button>
              <button type="button" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>›</button>
            </div>
          </div>
          <div className="calendar-grid">
            {DAYS.map(day => <div className="calendar-weekday" key={day}>{day}</div>)}
            {Array.from({ length: firstDay }).map((_, index) => <div key={`empty-${index}`} />)}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1
              const dayEvents = eventsForDay(day)
              const isToday = currentDate.getFullYear() === 2026 && currentDate.getMonth() === 5 && day === 6
              return (
                <div className={`calendar-day${isToday ? ' today' : ''}`} key={day}>
                  <span className="calendar-day__num">{day}</span>
                  {dayEvents.slice(0, 2).map(event => <span key={event.id} className={`event-dot ${event.color}`} />)}
                </div>
              )
            })}
          </div>
        </div>

        <aside className="page-stack">
          <EventSection title="오늘의 일정" events={todayEvents} />
          <EventSection title="다가오는 일정" events={upcomingEvents} />
        </aside>
      </section>
    </main>
  )
}

function EventSection({ title, events }) {
  return (
    <section className="glass-card panel-pad">
      <h3>{title}</h3>
      <div className="item-list">
        {events.length === 0 ? <p className="muted-text">예정된 일정이 없습니다.</p> : events.map(event => (
          <article className="calendar-event" key={event.id}>
            <span className={`event-dot ${event.color}`} />
            <h4>{event.title}</h4>
            <p>{event.time} · {event.location}</p>
            <p>{event.attendees}명 참석 · {event.type}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
