import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

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
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-slate-100">
        <Sidebar
          collapsed={sidebarCollapsed}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onToggle={() => setSidebarCollapsed((current) => !current)}
        />

        <main className={`transition-[margin] duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <header className="sticky top-0 z-30 h-20 border-b border-slate-200/80 bg-gradient-to-r from-white via-sky-50 to-blue-50 shadow-sm shadow-blue-900/5">
            <div className="flex h-full items-center justify-end px-8">
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
