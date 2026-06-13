import { createContext, useContext, useMemo, useState, ReactNode } from 'react'
import { getKoreaToday } from '../utils/dateTime'

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
  '계약검토': 'bg-blue-500',
  '법령검토': 'bg-purple-500',
  '자문': 'bg-emerald-500',
  '회의': 'bg-yellow-500',
  '마감': 'bg-red-500',
  '교육': 'bg-green-500',
  '기타': 'bg-gray-400',
}

const INITIAL_EVENTS: EventType[] = [
  { id: 1, title: '전자금융 약관 개정안 법무 검토', date: '2026-06-13', endDate: '2026-06-13', time: '10:00 - 11:30', location: '본사 12층 법무팀 회의실', department: '법무팀', category: '법령검토', memo: '전자금융거래법 개정사항 반영 여부 확인', color: 'bg-purple-500' },
  { id: 2, title: '대출상품 광고 문구 법률 자문', date: '2026-06-16', endDate: '2026-06-16', time: '14:00 - 15:30', location: '온라인', department: '법무팀', category: '자문', memo: '금융소비자보호법상 오인 가능 표현 검토', color: 'bg-emerald-500' },
  { id: 3, title: '위탁계약서 표준조항 검토', date: '2026-06-18', endDate: '2026-06-18', time: '09:30 - 11:00', location: '본사 12층 법무팀 회의실', department: '법무팀', category: '계약검토', memo: '개인정보 처리 위탁 조항 및 손해배상 조항 확인', color: 'bg-blue-500' },
  { id: 4, title: '준법감시부 법무 이슈 주간회의', date: '2026-06-20', endDate: '2026-06-20', time: '16:00 - 17:00', location: '회의실 B', department: '법무팀', category: '회의', memo: '소송, 민원, 계약 검토 진행 현황 공유', color: 'bg-yellow-500' },
  { id: 5, title: '내부통제위원회 안건 법률 검토', date: '2026-06-23', endDate: '2026-06-24', time: '13:00 - 17:00', location: '본사 12층 법무팀 회의실', department: '법무팀', category: '법령검토', memo: '위원회 상정 전 법적 리스크 및 근거 조항 정리', color: 'bg-purple-500' },
  { id: 6, title: '금융당국 자료제출 법무 검토 마감', date: '2026-06-26', endDate: '2026-06-26', time: '18:00', location: '전자문서 제출', department: '법무팀', category: '마감', memo: '제출자료 문구, 개인정보 포함 여부 최종 확인', color: 'bg-red-500' },
  { id: 7, title: '민원 대응 법률 검토 교육', date: '2026-06-30', endDate: '2026-06-30', time: '10:00 - 12:00', location: '본사 2층 교육장', department: '법무팀', category: '교육', memo: '반복 민원 사례와 답변 문구 작성 기준 공유', color: 'bg-green-500' },
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
  const today = useMemo(() => getKoreaToday(), [])

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
    .filter(e => e.date > today)
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
      today,
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
