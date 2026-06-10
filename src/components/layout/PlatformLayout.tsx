import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { pageTitles } from '../../app/pageTitles';

type PageKey = 'home' | 'ai-chat' | 'ai-review' | 'education-content' | 'library' | 'calendar' | 'settings';

const pathToPage: Record<string, PageKey> = {
  '/home': 'home',
  '/question': 'ai-chat',
  '/review': 'ai-review',
  '/library': 'library',
  '/education-content': 'education-content',
  '/calendar': 'calendar',
  '/settings': 'settings',
};

const pageToPath: Record<PageKey, string> = {
  home: '/home',
  'ai-chat': '/question',
  'ai-review': '/review',
  'library': '/library',
  'education-content': '/education-content',
  calendar: '/calendar',
  settings: '/settings',
};

function getCurrentPage(pathname: string): PageKey {
  const matched = Object.entries(pathToPage).find(([path]) => pathname === path || pathname.startsWith(`${path}/`));
  return matched ? matched[1] : 'home';
}

export default function PlatformLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = getCurrentPage(location.pathname);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  const handleNavigate = (page: PageKey) => {
    navigate(pageToPath[page] || '/home');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100">
        <Sidebar
          collapsed={sidebarCollapsed}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onToggle={() => setSidebarCollapsed((current) => !current)}
        />

        <main className={`transition-[margin] duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <header className="sticky top-0 z-30 h-[104px] border-b border-white/20 bg-white/75 shadow-sm backdrop-blur-md">
            <div className="grid h-full grid-cols-[minmax(0,1fr)_auto] items-center gap-6 px-8">
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-bold text-gray-900">{pageTitles[currentPage] || '플랫폼'}</h1>
                <p className="mt-1 truncate text-sm text-gray-700">
                  준또배기 컴플라이언스 AI 플랫폼에 오신 것을 환영합니다.
                </p>
              </div>
              <div className="flex w-[400px] shrink-0 justify-end">
                <TopBar />
              </div>
            </div>
          </header>

          <div className="px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </DndProvider>
  );
}
