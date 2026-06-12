import { createContext, useContext, useState, ReactNode } from 'react'

export type EventType = {
  id: number
  title: string
  date: string
  endDate: string
  time: string
  location: string
  department: string
  category: string
  memo: string
  color: string
}

const CATEGORY_COLOR_MAP: Record<string, string> = {
  '세미나': 'bg-blue-500',
  '감사':   'bg-red-500',
  '워크샵': 'bg-purple-500',
  '교육':   'bg-green-500',
  '회의':   'bg-yellow-500',
  '점검':   'bg-orange-500',
  '기타':   'bg-gray-400',
}

const TODAY = '2026-06-08'

const INITIAL_EVENTS: EventType[] = [
  { id: 1, title: '금융소비자보호법 세미나', date: '2026-06-08', endDate: '2026-06-08', time: '14:00 - 16:00', location: '본사 대회의실',   department: '준법감시팀',   category: '세미나', memo: '', color: 'bg-blue-500'   },
  { id: 2, title: 'AML 정기 점검',          date: '2026-06-10', endDate: '2026-06-10', time: '10:00 - 12:00', location: '온라인',          department: 'AML팀',        category: '점검',   memo: '', color: 'bg-orange-500' },
  { id: 3, title: '내부통제 워크샵',         date: '2026-06-15', endDate: '2026-06-17', time: '09:00 - 17:00', location: '교육센터',        department: '내부통제팀',   category: '워크샵', memo: '', color: 'bg-purple-500' },
  { id: 4, title: 'KYC 절차 교육',          date: '2026-06-12', endDate: '2026-06-12', time: '13:00 - 15:00', location: '본사 2층 교육장', department: '리스크관리팀', category: '교육',   memo: '', color: 'bg-green-500'  },
  { id: 5, title: '리스크 평가 회의',        date: '2026-06-08', endDate: '2026-06-08', time: '15:00 - 16:30', location: '회의실 A',        department: '리스크관리팀', category: '회의',   memo: '', color: 'bg-yellow-500' },
]

interface CalendarContextType {
  events: EventType[]
  addEvent: (event: Omit<EventType, 'id'>) => void
  updateEvent: (id: number, event: Partial<Omit<EventType, 'id'>>) => void
  deleteEvent: (id: number) => void
  upcomingEvents: EventType[]
  categoryColorMap: Record<string, string>
  today: string
}

const CalendarContext = createContext<CalendarContextType | null>(null)

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventType[]>(INITIAL_EVENTS)

  const addEvent = (event: Omit<EventType, 'id'>) => {
    setEvents(prev => [...prev, { ...event, id: Date.now() }])
  }
  const updateEvent = (
    id: number,
    updatedEvent: Partial<Omit<EventType, 'id'>>
  ) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === id
        ? { ...event, ...updatedEvent }
        : event
      )
    )
  }
  
  const deleteEvent = (id: number) => {
    setEvents(prev =>
      prev.filter(event => event.id !== id)
    )
  }

  const upcomingEvents = events
    .filter(e => e.date > TODAY)
    .sort((a, b) => a.date.localeCompare(b.date))
    
    return (
    <CalendarContext.Provider
    value={{
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      upcomingEvents,
      categoryColorMap: CATEGORY_COLOR_MAP,
      today: TODAY,
    }}
  >
    {children}
    </CalendarContext.Provider>
  )
}

export function useCalendar() {
  const ctx = useContext(CalendarContext)

  if (!ctx) {
    throw new Error('useCalendar must be used within CalendarProvider')
  }

  return ctx
}