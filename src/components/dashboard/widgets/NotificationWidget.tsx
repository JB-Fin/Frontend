import { Bell, BookOpen, CheckCircle, FileText, Info, Library, ShieldCheck, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../../context/NotificationContext';

const notificationStyle = {
  update: {
    icon: Info,
    color: 'text-blue-700',
    bg: 'bg-blue-100',
    border: 'border-blue-200',
  },
  review: {
    icon: ShieldCheck,
    color: 'text-emerald-700',
    bg: 'bg-emerald-100',
    border: 'border-emerald-200',
  },
  approval: {
    icon: CheckCircle,
    color: 'text-purple-700',
    bg: 'bg-purple-100',
    border: 'border-purple-200',
  },
  education: {
    icon: BookOpen,
    color: 'text-orange-700',
    bg: 'bg-orange-100',
    border: 'border-orange-200',
  },
  library: {
    icon: Library,
    color: 'text-pink-700',
    bg: 'bg-pink-100',
    border: 'border-pink-200',
  },
};

export function NotificationWidget() {
  const navigate = useNavigate();
  const { notifications, deleteNotification, markAsRead, unreadCount } = useNotifications();
  const recent = notifications.slice(0, 4);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gradient-to-br from-red-100 to-pink-100 p-3">
            <Bell className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">최근 알림</h3>
            <p className="text-xs text-gray-600">
              {unreadCount > 0 ? `안읽음 ${unreadCount}건` : '모두 읽음'}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
          {unreadCount}
        </span>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-2">
        {recent.map((notification) => {
          const style = notificationStyle[notification.type] ?? notificationStyle.update;
          const Icon = style.icon ?? FileText;

          return (
            <div
              key={notification.id}
              role="button"
              tabIndex={0}
              onClick={() => markAsRead(notification.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  markAsRead(notification.id);
                }
              }}
              className={`group flex min-h-[76px] w-full items-center rounded-lg border p-3 text-left transition-all hover:shadow-md ${
                notification.isRead
                  ? 'border-gray-200/70 bg-white/90'
                  : `${style.border} bg-gradient-to-r from-white to-blue-50/80`
              }`}
            >
              <div className="flex w-full items-center gap-3">
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${style.bg}`}>
                  <Icon className={`h-4 w-4 ${style.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <p
                      className={`min-w-0 flex-1 truncate text-sm group-hover:text-blue-700 ${
                        notification.isRead ? 'font-medium text-gray-700' : 'font-bold text-gray-950'
                      }`}
                    >
                      {notification.title}
                    </p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        notification.isRead
                          ? 'bg-gray-100 text-gray-500'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {notification.isRead ? '읽음' : '안읽음'}
                    </span>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="shrink-0 rounded-md p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label={`${notification.title} 삭제`}
                      title="삭제"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">{notification.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => navigate('/notifications')}
        className="mt-3 w-full py-2 text-sm font-medium text-red-600 transition-colors hover:text-red-700"
      >
        모든 알림 보기 →
      </button>
    </div>
  );
}
