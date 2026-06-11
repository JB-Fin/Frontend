import { useState } from 'react';
import {
  Bell,
  BookOpen,
  CheckCircle,
  FileText,
  Info,
  Library,
  ShieldCheck,
} from 'lucide-react';
import { useNotifications, type NotificationItem } from '../context/NotificationContext';

type Filter = 'all' | 'unread' | 'read';

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'unread', label: '안읽음' },
  { id: 'read', label: '읽음' },
];

const notificationStyle: Record<
  NotificationItem['type'],
  {
    icon: typeof Bell;
    bg: string;
    color: string;
    border: string;
    panel: string;
  }
> = {
  update: {
    icon: Info,
    bg: 'bg-blue-100',
    color: 'text-blue-700',
    border: 'border-blue-200',
    panel: 'from-blue-50 to-white',
  },
  review: {
    icon: ShieldCheck,
    bg: 'bg-emerald-100',
    color: 'text-emerald-700',
    border: 'border-emerald-200',
    panel: 'from-emerald-50 to-white',
  },
  approval: {
    icon: CheckCircle,
    bg: 'bg-purple-100',
    color: 'text-purple-700',
    border: 'border-purple-200',
    panel: 'from-purple-50 to-white',
  },
  education: {
    icon: BookOpen,
    bg: 'bg-orange-100',
    color: 'text-orange-700',
    border: 'border-orange-200',
    panel: 'from-orange-50 to-white',
  },
  library: {
    icon: Library,
    bg: 'bg-pink-100',
    color: 'text-pink-700',
    border: 'border-pink-200',
    panel: 'from-pink-50 to-white',
  },
};

export function NotificationPage() {
  const { notifications, markAllAsRead, markAsRead } = useNotifications();
  const [filter, setFilter] = useState<Filter>('all');
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;
  const readCount = notifications.length - unreadCount;
  const filtered = notifications.filter((notification) => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-lg bg-red-100 p-2.5">
                <Bell className="h-5 w-5 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">알림</h1>
            </div>
            <p className="text-sm text-gray-600">
              생성된 보고서와 교육 자료, 규정 업데이트를 확인하세요.
            </p>
          </div>
          <button
            type="button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            모두 읽음 처리
          </button>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-xs font-medium text-blue-700">전체</p>
            <p className="mt-1 text-2xl font-bold text-blue-950">{notifications.length}</p>
          </div>
          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-xs font-medium text-red-700">안읽음</p>
            <p className="mt-1 text-2xl font-bold text-red-950">{unreadCount}</p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-4">
            <p className="text-xs font-medium text-emerald-700">읽음</p>
            <p className="mt-1 text-2xl font-bold text-emerald-950">{readCount}</p>
          </div>
        </div>
      </section>

      <div className="flex gap-2">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              filter === item.id
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'border border-gray-200 bg-white text-gray-700 hover:bg-blue-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <section className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white/70 px-6 py-12 text-center text-gray-500">
            표시할 알림이 없습니다.
          </div>
        ) : (
          filtered.map((notification) => {
            const style = notificationStyle[notification.type] ?? notificationStyle.update;
            const Icon = style.icon ?? FileText;

            return (
              <button
                key={notification.id}
                type="button"
                onClick={() => markAsRead(notification.id)}
                className={`w-full rounded-lg border p-5 text-left shadow-sm transition-all hover:shadow-md ${
                  notification.isRead
                    ? 'border-gray-200 bg-white'
                    : `${style.border} bg-gradient-to-r ${style.panel}`
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`rounded-lg p-3 ${style.bg}`}>
                    <Icon className={`h-5 w-5 ${style.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          notification.isRead
                            ? 'bg-gray-100 text-gray-500'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {notification.isRead ? '읽음' : '안읽음'}
                      </span>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p
                      className={`font-semibold ${
                        notification.isRead ? 'text-gray-700' : 'text-gray-950'
                      }`}
                    >
                      {notification.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">{notification.desc}</p>
                  </div>
                  {!notification.isRead && (
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-blue-600" />
                  )}
                </div>
              </button>
            );
          })
        )}
      </section>
    </div>
  );
}
