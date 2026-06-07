import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { dummyNotifications } from '../../data/dummyNotifications'
import { dummyUser } from '../../data/dummyUser'
import '../../styles/layout.css'

const PAGE_TITLES = {
  '/home': '대시보드',
  '/review': 'AI 검토',
  '/history': '작업 이력',
  '/question': 'AI 채팅',
  '/internal-investigation': '내부 조사 지원',
  '/education-content': '교육 자료 제작',
  '/calendar': '캘린더',
  '/settings': '설정',
  '/notifications': '알림',
}

const TYPE_ICON = {
  done: '✓',
  error: '!',
  regulation: '§',
  schedule: '•',
}

export default function Header() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(dummyNotifications)
  const dropdownRef = useRef(null)

  const currentPath = Object.keys(PAGE_TITLES).find(path => pathname.startsWith(path))
  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handleClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleRead = (id) => {
    setNotifications(prev => prev.map(item => item.id === id ? { ...item, read: true } : item))
  }

  const handleReadAll = () => {
    setNotifications(prev => prev.map(item => ({ ...item, read: true })))
  }

  return (
    <header className="header">
      <div>
        <div className="header__eyebrow">JB 금융그룹 컴플라이언스 AI</div>
        <h1 className="header__title">{PAGE_TITLES[currentPath] ?? '업무 공간'}</h1>
      </div>

      <div className="header__actions">
        <div ref={dropdownRef} className="notification-menu">
          <button
            type="button"
            className="header__icon-btn"
            onClick={() => setOpen(value => !value)}
            aria-label="알림 열기"
          >
            <BellIcon />
            {unreadCount > 0 && <span className="header__badge">{unreadCount}</span>}
          </button>

          {open && (
            <div className="notification-menu__panel">
              <div className="notification-menu__head">
                <strong>최근 알림</strong>
                {unreadCount > 0 && (
                  <button type="button" onClick={handleReadAll}>모두 읽음</button>
                )}
              </div>

              <div className="notification-menu__list">
                {notifications.map(item => (
                  <button
                    type="button"
                    key={item.id}
                    className={`notification-menu__item${item.read ? '' : ' unread'}`}
                    onClick={() => handleRead(item.id)}
                  >
                    <span className="notification-menu__icon">{TYPE_ICON[item.type]}</span>
                    <span>
                      <span className="notification-menu__title">{item.title}</span>
                      <span className="notification-menu__desc">{item.desc}</span>
                      <span className="notification-menu__time">{item.time}</span>
                    </span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="notification-menu__more"
                onClick={() => {
                  setOpen(false)
                  navigate('/notifications')
                }}
              >
                전체 알림 보기
              </button>
            </div>
          )}
        </div>

        <div className="header__user">
          <div className="header__user-info">
            <div className="header__user-name">{dummyUser.name}</div>
            <div className="header__user-team">{dummyUser.team}</div>
          </div>
          <div className="header__avatar">{dummyUser.name[0]}</div>
        </div>
      </div>
    </header>
  )
}

function BellIcon() {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
}
