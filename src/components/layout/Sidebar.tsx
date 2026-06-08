import { PanelLeftClose, PanelLeftOpen, Settings } from 'lucide-react';
import { navigationItems } from '../../constants/navigation';
import type { PageId } from '../../types/page';

interface SidebarProps {
  collapsed: boolean;
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onToggle: () => void;
}

export function Sidebar({ collapsed, currentPage, onNavigate, onToggle }: SidebarProps) {
  return (
    <aside
      className={`fixed bottom-0 left-0 top-0 z-40 flex flex-col border-r border-white/60 bg-white/85 shadow-lg backdrop-blur-xl transition-[width] duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
        title={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
        className={`absolute right-3 top-4 z-10 rounded-lg border border-gray-200/70 bg-white p-2 text-gray-600 shadow-sm transition-colors hover:bg-blue-50 hover:text-blue-700 ${
          collapsed ? 'hidden' : ''
        }`}
      >
        {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
      </button>

      <div className={`border-b border-gray-200/50 py-5 ${collapsed ? 'px-4' : 'px-6'}`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 pr-10'}`}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
            <span className="text-sm font-bold text-white">JB</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="truncate font-bold text-gray-900">JB금융그룹</h1>
              <p className="truncate text-xs text-gray-600">컴플라이언스 AI</p>
            </div>
          )}
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
              type="button"
              onClick={() => {
                if (collapsed) onToggle();
                onNavigate(item.id);
              }}
              title={collapsed ? item.label : undefined}
              className={`mb-1 flex w-full items-center rounded-lg py-3 transition-all ${
                collapsed ? 'justify-center px-0' : 'gap-3 px-4'
              } ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-white/80 hover:shadow-sm'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-gray-200/50 px-3 py-4">
        <button
          type="button"
          onClick={() => {
            if (collapsed) onToggle();
            onNavigate('settings');
          }}
          title={collapsed ? '설정' : undefined}
          className={`flex w-full items-center rounded-lg py-3 transition-all ${
            collapsed ? 'justify-center px-0' : 'gap-3 px-4'
          } ${
            currentPage === 'settings'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-white/80 hover:shadow-sm'
          }`}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="font-medium">설정</span>}
        </button>
      </div>
    </aside>
  );
}
