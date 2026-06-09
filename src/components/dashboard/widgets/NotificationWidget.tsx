import { AlertCircle, Bell, CheckCircle, Info } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../../../context/NotificationContext'

export function NotificationWidget() {
  const navigate = useNavigate()
  const { notifications, markAsRead, unreadCount } = useNotifications()

  const getIconConfig = (type: string) => {
    switch (type) {
      case 'update':   return { icon: Info,          color: 'text-blue-600',   bg: 'bg-blue-100'   }
      case 'review':   return { icon: CheckCircle,   color: 'text-green-600',  bg: 'bg-green-100'  }
      default:         return { icon: AlertCircle,   color: 'text-yellow-600', bg: 'bg-yellow-100' }
    }
  }

  // 최근 3개만 표시
  const recent = notifications.slice(0, 3)

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-gradient-to-br from-red-100 to-pink-100 p-3">
          <Bell className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">최근 알림</h3>
          <p className="text-xs text-gray-600">
            {unreadCount > 0 ? `새 알림 ${unreadCount}건` : '새 알림 없음'}
          </p>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-2">
        {recent.length === 0 ? (
          <p className="py-4 text-center text-xs text-gray-400">알림이 없습니다.</p>
        ) : (
          recent.map((n) => {
            const { icon: Icon, color, bg } = getIconConfig(n.type)
            return (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`group cursor-pointer rounded-lg border p-3 transition-all hover:shadow-md ${
                  n.isRead
                    ? 'border-gray-200/50 bg-white/90'
                    : 'border-blue-200 bg-blue-50/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 rounded-lg p-2 ${bg}`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm transition-colors group-hover:text-blue-600 ${
                      n.isRead ? 'font-medium text-gray-900' : 'font-semibold text-gray-900'
                    }`}>
                      {n.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-600">{n.time}</p>
                  </div>
                  {/* 읽지 않음 표시 */}
                  {!n.isRead && (
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      <button
        onClick={() => navigate('/notifications')}
        className="mt-3 w-full py-2 text-sm font-medium text-red-600 transition-colors hover:text-red-700"
      >
        모든 알림 보기 →
      </button>
    </div>
  )
}
