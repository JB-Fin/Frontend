import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getNotificationStyle } from '../../../constants/notificationStyles';
import { useNotifications } from '../../../context/NotificationContext';
import { useLanguage } from '../../../context/LanguageContext';

export function NotificationWidget() {
  const navigate = useNavigate();
  const { notifications, deleteNotification, markAsRead } = useNotifications();
  const { t } = useLanguage();
  const recent = notifications.slice(0, 4);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-2">
        {recent.map((notification) => {
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
              className={`group relative flex min-h-[76px] w-full items-center overflow-hidden rounded-lg border bg-white/95 p-3 text-left transition-all hover:shadow-md ${
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
              <div className="flex w-full items-center gap-3">
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${style.iconBg}`}>
                  <Icon className={`h-4 w-4 ${style.iconColor}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <p
                      className={`min-w-0 flex-1 truncate text-sm group-hover:text-blue-700 ${
                        notification.isRead ? 'font-medium text-gray-700' : 'font-bold text-gray-950'
                      }`}
                    >
                      {t(notification.title)}
                    </p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        notification.isRead
                          ? 'bg-green-50/70 text-green-700'
                          : 'bg-red-50/70 text-red-600'
                      }`}
                    >
                      {notification.isRead ? t('읽음') : t('안읽음')}
                    </span>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="shrink-0 rounded-md p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label={`${t(notification.title)} ${t('삭제')}`}
                      title={t('삭제')}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">{t(notification.time)}</p>
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
        {t('모든 알림 보기')} →
      </button>
    </div>
  );
}
