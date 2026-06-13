import { useState } from 'react';
import { Bell, Trash2 } from 'lucide-react';
import { getNotificationStyle } from '../constants/notificationStyles';
import { useNotifications } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';

type Filter = 'all' | 'unread' | 'read';

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'unread', label: '안읽음' },
  { id: 'read', label: '읽음' },
];

export function NotificationPage() {
  const { notifications, deleteNotification, markAllAsRead, markAsRead } = useNotifications();
  const { t } = useLanguage();
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
              <h1 className="text-2xl font-bold text-gray-900">{t('알림')}</h1>
            </div>
            <p className="text-sm text-gray-600">
              {t('생성된 보고서와 교육 자료, 규정 업데이트를 확인하세요.')}
            </p>
          </div>
          <button
            type="button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('모두 읽음 처리')}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-blue-100 bg-blue-50/70 p-4">
            <p className="text-xs font-medium text-blue-700">{t('전체')}</p>
            <p className="mt-1 text-2xl font-bold text-blue-950">{notifications.length}</p>
          </div>
          <div className="rounded-lg border border-red-100 bg-red-50/40 p-4">
            <p className="text-xs font-medium text-red-600">{t('안읽음')}</p>
            <p className="mt-1 text-2xl font-bold text-red-950">{unreadCount}</p>
          </div>
          <div className="rounded-lg border border-green-100 bg-green-50/40 p-4">
            <p className="text-xs font-medium text-green-700">{t('읽음')}</p>
            <p className="mt-1 text-2xl font-bold text-green-950">{readCount}</p>
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
                ? 'bg-blue-600 text-white shadow-md'
                : 'border border-gray-200 bg-white text-gray-700 hover:bg-blue-50'
            }`}
          >
            {t(item.label)}
          </button>
        ))}
      </div>

      <section className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white/70 px-6 py-12 text-center text-gray-500">
            {t('표시할 알림이 없습니다.')}
          </div>
        ) : (
          filtered.map((notification) => {
            const style = getNotificationStyle(notification.type);
            const Icon = style.icon;

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
                className={`relative w-full overflow-hidden rounded-lg border bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                  notification.isRead
                    ? 'border-green-100 ring-1 ring-green-50/70'
                    : 'border-red-100 ring-1 ring-red-50/70'
                }`}
              >
                <span
                  className={`absolute inset-y-0 left-0 w-1 ${
                    notification.isRead ? 'bg-green-300' : 'bg-red-300'
                  }`}
                />
                <div className="flex items-start gap-4">
                  <div className={`rounded-lg p-3 ${style.iconBg}`}>
                    <Icon className={`h-5 w-5 ${style.iconColor}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        notification.isRead
                            ? 'bg-green-50/70 text-green-700'
                            : 'bg-red-50/70 text-red-600'
                        }`}
                      >
                        {notification.isRead ? t('읽음') : t('안읽음')}
                      </span>
                      <span className="text-xs text-gray-500">{t(notification.time)}</span>
                    </div>
                    <p
                      className={`font-semibold ${
                        notification.isRead ? 'text-gray-700' : 'text-gray-950'
                      }`}
                    >
                      {t(notification.title)}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">{notification.desc ? t(notification.desc) : null}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        notification.isRead ? 'bg-green-400' : 'bg-red-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="rounded-md p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label={`${t(notification.title)} ${t('삭제')}`}
                      title={t('삭제')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
