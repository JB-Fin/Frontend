import { useState } from 'react'
import { dummyNotifications } from '../data/dummyNotifications'

const TYPE_ICON = {
  done:       '✅',
  error:      '❌',
  regulation: '📋',
  schedule:   '📅',
}
const TYPE_LABEL = {
  done:       '검토 완료',
  error:      '검토 오류',
  regulation: '규정 업데이트',
  schedule:   '일정 리마인더',
}
const TYPE_COLOR = {
  done:       'var(--risk-low)',
  error:      'var(--risk-high)',
  regulation: 'var(--blue)',
  schedule:   'var(--navy)',
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(dummyNotifications)
  const [filter, setFilter] = useState('전체')

  const filters = ['전체', '읽지 않음', '검토 완료', '검토 오류', '규정 업데이트', '일정 리마인더']

  const filtered = notifications.filter(n => {
    if (filter === '전체') return true
    if (filter === '읽지 않음') return !n.read
    return TYPE_LABEL[n.type] === filter
  })

  const handleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const handleReadAll = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div style={{ padding: 32, maxWidth: 720, width: '100%' }}>

      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--navy)' }}>알림</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            읽지 않은 알림 {unreadCount}개
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleReadAll}
            style={{ padding: '8px 16px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, color: 'var(--sky)', fontWeight: 600, cursor: 'pointer' }}
          >
            전체 읽음
          </button>
        )}
      </div>

      {/* 필터 탭 */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: '1.5px solid',
              borderColor: filter === f ? 'var(--navy)' : 'var(--border)',
              background: filter === f ? 'var(--navy)' : 'var(--white)',
              color: filter === f ? 'var(--white)' : 'var(--text-muted)',
              fontSize: 12,
              fontWeight: filter === f ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* 알림 목록 */}
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
            알림이 없습니다
          </div>
        ) : (
          filtered.map((n, i) => (
            <div
              key={n.id}
              onClick={() => handleRead(n.id)}
              style={{
                display: 'flex', gap: 14, alignItems: 'flex-start',
                padding: '16px 20px',
                background: n.read ? 'var(--white)' : 'var(--light-bg)',
                borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
            >
              {/* 타입 아이콘 */}
              <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>{TYPE_ICON[n.type]}</span>

              {/* 내용 */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: n.read ? 500 : 700, color: 'var(--text-dark)' }}>
                    {n.title}
                  </span>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: TYPE_COLOR[n.type],
                    background: TYPE_COLOR[n.type] + '15',
                    borderRadius: 20, padding: '1px 8px',
                  }}>
                    {TYPE_LABEL[n.type]}
                  </span>
                  {!n.read && (
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--sky)', flexShrink: 0 }} />
                  )}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{n.desc}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{n.time}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}