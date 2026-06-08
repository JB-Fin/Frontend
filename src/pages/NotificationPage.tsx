import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, CheckSquare, AlertCircle, FileText } from 'lucide-react';

type Filter = '전체' | '읽지 않음' | '읽음'

export function NotificationPage() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState<Filter>('전체')

  const filtered = notifications.filter(n => {
    if (filter === '읽지 않음') return !n.isRead
    if (filter === '읽음') return n.isRead
    return true
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  const getIcon = (type: string) => {
    switch (type) {
      case 'update': return <AlertCircle className="h-5 w-5 text-blue-600" />;
      case 'review': return <FileText className="h-5 w-5 text-green-600" />;
      default: return <CheckSquare className="h-5 w-5 text-purple-600" />;
    }
  };

  const FILTERS: Filter[] = ['전체', '읽지 않음', '읽음']

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">

      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-900">전체 알림 내역</h1>
          {unreadCount > 0 && (
            <span
              className="ml-1 rounded-full px-2 py-0.5 text-xs font-bold text-white"
              style={{ background: '#1B3A6B' }}
            >
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm font-medium hover:underline"
            style={{ color: '#1B3A6B' }}
          >
            모두 읽음 처리
          </button>
        )}
      </div>

      {/* 필터 탭 */}
      <div className="flex gap-2">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="rounded-full px-4 py-1.5 text-sm font-medium border transition-all"
            style={filter === f
              ? { background: '#1B3A6B', color: '#fff', borderColor: '#1B3A6B' }
              : { background: '#fff', color: '#5A7A9A', borderColor: '#C8DDF0' }
            }
          >
            {f}
            {f === '읽지 않음' && unreadCount > 0 && (
              <span className="ml-1.5 rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 알림 목록 */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-gray-500">
            {filter === '읽지 않음' ? '읽지 않은 알림이 없습니다.' : '알림이 없습니다.'}
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((notification, index) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`flex cursor-pointer items-center justify-between p-5 transition-colors ${
                  notification.isRead
                    ? 'bg-white hover:bg-gray-50'
                    : 'bg-blue-50/40 hover:bg-blue-50/80'
                } ${index === 0 ? 'rounded-t-2xl' : ''} ${index === filtered.length - 1 ? 'rounded-b-2xl' : ''}`}
              >
                <div className="flex items-center gap-4">
                  {/* 아이콘 — 더 둥글게 */}
                  <div className={`rounded-2xl p-2.5 ${notification.isRead ? 'bg-gray-100' : 'bg-blue-50'}`}>
                    {getIcon(notification.type)}
                  </div>

                  <div>
                    <p className={`text-sm ${notification.isRead ? 'text-gray-500' : 'font-semibold text-gray-950'}`}>
                      {notification.title}
                    </p>
                    <span className="mt-1 block text-xs text-gray-400">{notification.time}</span>
                  </div>
                </div>

                {/* 읽지 않음 표시 */}
                {!notification.isRead && (
                  <span className="mr-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}