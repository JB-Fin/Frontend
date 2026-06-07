import { Settings } from 'lucide-react';
import { navigationItems } from '../../constants/navigation';
import type { PageId } from '../../types/page';

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 flex w-64 flex-col border-r border-white/60 bg-white/85 shadow-lg backdrop-blur-xl">
      <div className="border-b border-gray-200/50 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
            <span className="text-lg font-bold text-white">준</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-900">준또배기</h1>
            <p className="text-xs text-gray-600">JB금융그룹</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navigationItems.map((item) => {
          if ('type' in item) {
            return <div key={item.id} className="my-3 border-t border-gray-200/50" />;
          }

          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`mb-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-white/80 hover:shadow-sm'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-gray-200/50 px-3 py-4">
        <button
          onClick={() => onNavigate('settings')}
          className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-all ${
            currentPage === 'settings'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-white/80 hover:shadow-sm'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span className="font-medium">설정</span>
        </button>
      </div>
    </aside>
  );
}
