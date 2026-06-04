// 헤더 레이아웃 선언
// 헤더 레이아웃 선언
import { useState, useRef, useEffect } from 'react'
import { dummyUser } from '../../data/dummyUser'
import { dummyNotifications } from '../../data/dummyNotifications'
import '../../styles/layout.css'

const TYPE_ICON = {
  done:       '✅',
  error:      '❌',
  regulation: '📋',
  schedule:   '📅',
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(dummyNotifications)
  const dropdownRef = useRef(null)

  const unreadCount = notifications.filter(n => !n.read).length

  // 드롭다운 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const handleReadAll = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <div className="header">
      <span className="header__title">준또배기</span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

        {/* 🔔 알림 버튼 */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setOpen(v => !v)}
            style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 4, fontSize: 20, lineHeight: 1 }}
          >
            🔔
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: 0, right: 0,
                width: 16, height: 16, borderRadius: '50%',
                background: '#E53E3E', color: 'white',
                fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* 드롭다운 */}
          {open && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 10px)', right: 0,
              width: 320, background: 'var(--white)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md)', zIndex: 100, overflow: 'hidden',
            }}>
              {/* 드롭다운 헤더 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>
                  알림 {unreadCount > 0 && <span style={{ color: '#E53E3E' }}>({unreadCount})</span>}
                </span>
                {unreadCount > 0 && (
                  <button onClick={handleReadAll} style={{ fontSize: 12, color: 'var(--sky)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    전체 읽음
                  </button>
                )}
              </div>

              {/* 알림 목록 */}
              <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '32px 16px', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
                    알림이 없습니다
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => handleRead(n.id)}
                      style={{
                        display: 'flex', gap: 12, alignItems: 'flex-start',
                        padding: '12px 16px',
                        background: n.read ? 'var(--white)' : 'var(--light-bg)',
                        borderBottom: '1px solid var(--border)',
                        cursor: 'pointer', transition: 'background 0.15s',
                      }}
                    >
                      <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{TYPE_ICON[n.type]}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                          <span style={{ fontSize: 13, fontWeight: n.read ? 400 : 700, color: 'var(--text-dark)' }}>{n.title}</span>
                          {!n.read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--sky)', flexShrink: 0 }} />}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{n.desc}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{n.time}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* 기존 유저 정보 — 그대로 유지 */}
        <div className="header__user">
          <div className="header__user-info">
            <div className="header__user-name">{dummyUser.name}</div>
            <div className="header__user-team">{dummyUser.team}</div>
          </div>
          <div className="header__avatar">{dummyUser.name[0]}</div>
        </div>

      </div>
    </div>
  )
}