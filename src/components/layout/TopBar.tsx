import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, Globe, LogOut, Trash2, User } from 'lucide-react';
import { getNotificationStyle } from '../../constants/notificationStyles';
import { translateLabel, useLanguage, type AppLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { authApi } from '../../services/authApi';
import { languageApi } from '../../services/languageApi';

type TopBarMenu = 'language' | 'notifications' | 'profile' | null;

export function TopBar() {
  const navigate = useNavigate();
  const { currentLanguage, currentLanguageLabel, languages, setLanguage } = useLanguage();
  const { notifications, unreadCount, deleteNotification, markAsRead } = useNotifications();
  const [openMenu, setOpenMenu] = useState<TopBarMenu>(null);
  const t = (text: string) => translateLabel(text, currentLanguage);

  const toggleMenu = (menu: TopBarMenu) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  const goTo = (path: string) => {
    navigate(path);
    setOpenMenu(null);
  };

  const handleLogout = async () => {
    await authApi.logout();
    sessionStorage.removeItem('jb_token');
    setOpenMenu(null);
    navigate('/login', { replace: true });
  };

  const handleLanguageChange = async (langCode: AppLanguage) => {
  try {
    setLanguage(langCode);
    setOpenMenu(null);

    await languageApi.updateSettings(langCode);
  } catch (error) {
    console.error('언어 설정 변경 실패:', error);
  }
};

  return (
    <div className="flex w-full items-center justify-end gap-2.5" data-no-translate="true">
      <div className="relative" data-no-translate="true">
        <button
          type="button"
          onClick={() => toggleMenu('language')}
          className="flex h-11 w-36 items-center justify-between gap-2 rounded-lg border border-blue-200 bg-white px-3 text-[#082064] shadow-sm shadow-blue-900/5 transition-all hover:border-blue-300 hover:bg-blue-50"
        >
          <Globe className="h-4 w-4 text-blue-700" />
          <span className="text-sm font-semibold text-[#082064]">{currentLanguageLabel}</span>
          <ChevronDown className="h-4 w-4 text-blue-600" />
        </button>
        {openMenu === 'language' && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
            <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-lg border border-white/60 bg-white/95 shadow-2xl backdrop-blur-md">
              {languages.map((language) => (
                <button
                key={language.code}
                type="button"
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-blue-50/80 ${
                  currentLanguage === language.code ? 'font-semibold text-blue-700' : 'text-gray-800'
                  }`}
                  >
                    {language.label}
                    </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => toggleMenu('notifications')}
          className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-blue-200 bg-white text-[#082064] shadow-sm shadow-blue-900/5 transition-all hover:border-blue-300 hover:bg-blue-50"
          aria-label={t('알림')}
        >
          <Bell className="h-5 w-5 text-blue-700" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>
        {openMenu === 'notifications' && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
            <div className="absolute right-0 z-20 mt-2 w-80 overflow-hidden rounded-lg border border-white/60 bg-white/95 shadow-2xl backdrop-blur-md">
              <div className="border-b border-gray-200/50 px-4 py-3">
                <h3 className="font-medium text-gray-900">
                  {t('알림')} ({unreadCount})
                </h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => {
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
                      className="relative w-full overflow-hidden border-b border-gray-100/70 bg-white px-4 py-3 text-left transition-colors hover:bg-blue-50/40"
                    >
                      <span
                        className={`absolute inset-y-0 left-0 w-1 ${
                          notification.isRead ? 'bg-green-300' : 'bg-red-300'
                        }`}
                      />
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.iconBg}`}>
                        <Icon className={`h-4 w-4 ${style.iconColor}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">{t(notification.title)}</p>
                        <p className="mt-1 text-xs text-gray-600">{t(notification.time)}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              notification.isRead ? 'bg-green-400' : 'bg-red-400'
                            }`}
                          />
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="rounded-md p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          aria-label={`${notification.title} 삭제`}
                          title="삭제"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
              <div className="border-t border-gray-200/50 px-4 py-2">
                <button
                  type="button"
                  onClick={() => goTo('/notifications')}
                  className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  {t('모두 보기')}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => toggleMenu('profile')}
          className="flex h-11 w-52 items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 text-[#082064] shadow-sm shadow-blue-900/5 transition-all hover:border-blue-300 hover:bg-blue-50"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#082064] to-[#2f74ff] shadow-sm">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="hidden min-w-0 flex-1 items-center justify-center gap-1.5 text-center md:flex">
            <span className="shrink-0 text-xs font-semibold text-blue-700">{t('준법감시부')}</span>
            <span className="truncate text-sm font-semibold text-[#082064]">{t('박준호')}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-blue-600" />
        </button>
        {openMenu === 'profile' && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
            <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-lg border border-white/60 bg-white/95 shadow-2xl backdrop-blur-md">
              <div className="border-b border-gray-200/50 px-4 py-3">
                <p className="font-medium text-gray-900">{t('박준호')}</p>
                <p className="text-xs text-gray-600">junho.park@jbgroup.com</p>
              </div>
              <div className="py-2">
                <button
                  type="button"
                  onClick={() => goTo('/settings?tab=profile')}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-800 hover:bg-blue-50/80"
                >
                  <User className="h-4 w-4" />
                  {t('프로필')}
                </button>
              </div>
              <div className="border-t border-gray-200/50 py-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50/80"
                >
                  <LogOut className="h-4 w-4" />
                  {t('로그아웃')}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
