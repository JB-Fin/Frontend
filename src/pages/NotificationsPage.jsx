import { useState } from 'react'
import { useNotifications } from '../context/NotificationContext'

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

const FILTERS = ['전체', '읽지 않음', '검토 완료', '검토 오류', '규정 업데이트', '일정 리마인더']

export default function NotificationsPage() {
  const { notifications, markRead, markAllRead, unreadCount } = useNotifications()
  const [filter, setFilter] = useState('전체')

  const filtered = notifications.filter(n => {
    if (filter === '전체') return true
    if (filter === '읽지 않음') return !n.read
    return TYPE_LABEL[n.type] === filter
  })

  return (
    <div style={{
      width: '100%',
      height: '100%',
      padding: '28px 32px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
    }}>

      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--navy)', margin: 0 }}>알림</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            읽지 않은 알림 {unreadCount}개
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            style={{
              padding: '8px 18px',
              background: 'var(--white)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 13,
              color: 'var(--sky)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            전체 읽음
          </button>
        )}
      </div>

      {/* 필터 탭 */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px',
              borderRadius: 20,
              border: '1.5px solid',
              borderColor: filter === f ? 'var(--navy)' : 'var(--border)',
              background: filter === f ? 'var(--navy)' : 'var(--white)',
              color: filter === f ? 'var(--white)' : 'var(--text-muted)',
              fontSize: 13,
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
      <div style={{
        flex: 1,
        background: 'var(--white)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {filtered.length === 0 ? (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            color: 'var(--text-muted)',
          }}>
            알림이 없습니다
          </div>
        ) : (
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.map((n, i) => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                style={{
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start',
                  padding: '18px 24px',
                  background: n.read ? 'var(--white)' : 'var(--light-bg)',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                <span style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{TYPE_ICON[n.type]}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 15, fontWeight: n.read ? 500 : 700, color: 'var(--text-dark)' }}>
                      {n.title}
                    </span>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color: TYPE_COLOR[n.type],
                      background: TYPE_COLOR[n.type] + '15',
                      borderRadius: 20,
                      padding: '2px 10px',
                    }}>
                      {TYPE_LABEL[n.type]}
                    </span>
                    {!n.read && (
                      <span style={{
                        width: 7, height: 7,
                        borderRadius: '50%',
                        background: 'var(--sky)',
                        flexShrink: 0,
                        display: 'inline-block',
                      }} />
                    )}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{n.desc}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}