import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, Globe, LogOut, Settings, User } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { authApi } from '../../services/authApi';

type TopBarMenu = 'language' | 'notifications' | 'profile' | null;

const languages = [
  { code: 'ko', name: '한국어' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
];

export function TopBar() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [openMenu, setOpenMenu] = useState<TopBarMenu>(null);
  const [currentLang, setCurrentLang] = useState('한국어');

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

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <button
          type="button"
          onClick={() => toggleMenu('language')}
          className="flex items-center gap-2 rounded-lg border border-white/60 bg-white/80 px-3 py-2 shadow-sm backdrop-blur-sm transition-all hover:bg-white/90"
        >
          <Globe className="h-4 w-4 text-gray-700" />
          <span className="text-sm text-gray-700">{currentLang}</span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>
        {openMenu === 'language' && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
            <div className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-lg border border-white/60 bg-white/95 shadow-2xl backdrop-blur-md">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setCurrentLang(lang.name);
                    setOpenMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-800 transition-colors hover:bg-blue-50/80"
                >
                  {lang.name}
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
          className="relative rounded-lg border border-white/60 bg-white/80 p-2 shadow-sm backdrop-blur-sm transition-all hover:bg-white/90"
          aria-label="알림"
        >
          <Bell className="h-5 w-5 text-gray-700" />
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
                <h3 className="font-medium text-gray-900">알림 ({unreadCount})</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => markAsRead(notification.id)}
                    className={`w-full border-b border-gray-100/50 px-4 py-3 text-left transition-colors hover:bg-blue-50/50 ${
                      notification.isRead ? 'opacity-55' : 'bg-blue-50/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-900">{notification.title}</p>
                        <p className="mt-1 text-xs text-gray-600">{notification.time}</p>
                      </div>
                      {!notification.isRead && <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />}
                    </div>
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-200/50 px-4 py-2">
                <button
                  type="button"
                  onClick={() => goTo('/notifications')}
                  className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  모두 보기
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
          className="flex items-center gap-2 rounded-lg border border-white/60 bg-white/80 px-3 py-2 shadow-sm backdrop-blur-sm transition-all hover:bg-white/90"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="hidden text-left md:block">
            <p className="text-sm font-medium text-gray-900">김준또</p>
            <p className="text-xs text-gray-600">컴플라이언스팀</p>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>
        {openMenu === 'profile' && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
            <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-lg border border-white/60 bg-white/95 shadow-2xl backdrop-blur-md">
              <div className="border-b border-gray-200/50 px-4 py-3">
                <p className="font-medium text-gray-900">김준또</p>
                <p className="text-xs text-gray-600">juntto@jbgroup.com</p>
              </div>
              <div className="py-2">
                <button
                  type="button"
                  onClick={() => goTo('/settings?tab=profile')}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-800 hover:bg-blue-50/80"
                >
                  <User className="h-4 w-4" />
                  프로필
                </button>
                <button
                  type="button"
                  onClick={() => goTo('/settings?tab=security')}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-800 hover:bg-blue-50/80"
                >
                  <Settings className="h-4 w-4" />
                  계정 설정
                </button>
              </div>
              <div className="border-t border-gray-200/50 py-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50/80"
                >
                  <LogOut className="h-4 w-4" />
                  로그아웃
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
