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
      className={`fixed bottom-0 left-0 top-0 z-40 flex flex-col border-r border-white/15 bg-gradient-to-b from-[#082064] via-[#0b3f9e] to-[#071452] shadow-2xl shadow-blue-950/25 backdrop-blur-xl transition-[width] duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
        title={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
        className={`absolute right-3 top-4 z-10 rounded-lg border border-white/20 bg-white/12 p-2 text-white shadow-sm backdrop-blur transition-colors hover:bg-white/20 ${
          collapsed ? 'hidden' : ''
        }`}
      >
        {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
      </button>

      <div className={`border-b border-white/15 py-5 ${collapsed ? 'px-4' : 'px-6'}`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 pr-10'}`}>
          <img
            src="/jb-symbol-mark.jpg"
            alt="JB금융그룹"
            className="h-10 w-10 shrink-0 rounded-xl object-cover shadow-md shadow-cyan-950/30"
          />
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="truncate font-bold text-white">JB금융그룹</h1>
              <p className="truncate text-xs text-sky-100/80">Compliance AI</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navigationItems.map((item) => {
          if ('type' in item) {
            return <div key={item.id} className="my-3 border-t border-white/15" />;
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
                  ? 'bg-gradient-to-r from-[#22c7f3] to-[#2f74ff] text-white shadow-md shadow-blue-950/25'
                  : 'text-sky-100/85 hover:bg-white/12 hover:text-white hover:shadow-sm'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-white/15 px-3 py-4">
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
              ? 'bg-gradient-to-r from-[#22c7f3] to-[#2f74ff] text-white shadow-md shadow-blue-950/25'
              : 'text-sky-100/85 hover:bg-white/12 hover:text-white hover:shadow-sm'
          }`}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="font-medium">설정</span>}
        </button>
      </div>
    </aside>
  );
}
