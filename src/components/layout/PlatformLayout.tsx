import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { pageTitles } from '../../app/pageTitles';

// 1. 페이지 타입 정의 (타입 안전성 확보)
type PageKey = 'home' | 'ai-chat' | 'ai-review' | 'education-content' | 'task-history' | 'calendar' | 'settings';

const pathToPage: Record<string, PageKey> = {
  '/home': 'home',
  '/question': 'ai-chat',
  '/review': 'ai-review',
  '/history': 'task-history',
  '/education-content': 'education-content',
  '/calendar': 'calendar',
  '/settings': 'settings',
};

const pageToPath: Record<PageKey, string> = {
  home: '/home',
  'ai-chat': '/question',
  'ai-review': '/review',
  'task-history': '/history',
  'education-content': '/education-content',
  calendar: '/calendar',
  settings: '/settings',
};

// 2. getCurrentPage 함수에 타입 적용
function getCurrentPage(pathname: string): PageKey {
  const matched = Object.entries(pathToPage).find(([path]) => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  return matched ? matched[1] : 'home';
}

export default function PlatformLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = getCurrentPage(location.pathname);

  const handleNavigate = (page: PageKey) => {
    navigate(pageToPath[page] || '/home');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100">
        <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
        
        <main className="ml-64">
          <header className="sticky top-0 z-30 border-b border-white/20 bg-white/75 shadow-sm backdrop-blur-md">
            <div className="px-8 py-4">
              <div className="flex items-center justify-between">
                <div>
                  {/* 3. 타입 안정성 확보 후 안전하게 접근 */}
                  <h1 className="mb-1 text-2xl font-bold text-gray-900">
                    {pageTitles[currentPage] || '플랫폼'}
                  </h1>
                  <p className="text-sm text-gray-700">준또배기 컴플라이언스 AI 플랫폼에 오신 것을 환영합니다.</p>
                </div>
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
