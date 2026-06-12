import { useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import { AddWidgetSidePanel } from '../components/dashboard/AddWidgetSidePanel';
import { DraggableWidget } from '../components/dashboard/DraggableWidget';
import { AIChatWidget } from '../components/dashboard/widgets/AIChatWidget';
import { AIReviewWidget } from '../components/dashboard/widgets/AIReviewWidget';
import { CalendarWidget } from '../components/dashboard/widgets/CalendarWidget';
import { EducationContentWidget } from '../components/dashboard/widgets/EducationContentWidget';
import { MonthlyCalendarWidget } from '../components/dashboard/widgets/MonthlyCalendarWidget';
import { NotificationWidget } from '../components/dashboard/widgets/NotificationWidget';
import { TaskHistoryWidget } from '../components/dashboard/widgets/TaskHistoryWidget';
import { defaultDashboardWidgets } from '../constants/dashboardWidgets';
import { useNotifications } from '../context/NotificationContext';
import { useChatStore } from '../store/chatStore';
import { useDashboardStore } from '../store/useDashboardStore';
import type { WidgetType } from '../types/widget';

function renderWidgetContent(type: WidgetType, title: string) {
  switch (type) {
    case 'ai-chat':
      return <AIChatWidget />;
    case 'ai-review':
      return <AIReviewWidget />;
    case 'task-history':
      return <TaskHistoryWidget />;
    case 'education-content':
      return <EducationContentWidget />;
    case 'calendar':
      return <CalendarWidget />;
    case 'monthly-calendar':
      return <MonthlyCalendarWidget />;
    case 'notification':
      return <NotificationWidget />;
    default:
      return (
        <div className="flex h-full items-center justify-center text-gray-500">
          {title}
        </div>
      );
  }
}

export function DashboardPage() {
  const [showAddPanel, setShowAddPanel] = useState(false);

  // ✅ 전역 상태로 변경
  const widgets = useDashboardStore((state) => state.widgets);
  const setWidgets = useDashboardStore((state) => state.setWidgets);
  const removeWidget = useDashboardStore((state) => state.removeWidget);
  const updateWidget = useDashboardStore((state) => state.updateWidget);
  const resetChatMessages = useChatStore((state) => state.resetMessages);

  const { notifications } = useNotifications();

  const handleAddWidget = (
    type: WidgetType,
    title: string,
    size: { colSpan: number; rowSpan: number }
  ) => {
    const newWidget = {
      id: `${type}-${Date.now()}`,
      type,
      title,
      colSpan: size.colSpan,
      rowSpan: size.rowSpan,
      order: widgets.length + 1,
    };

    setWidgets([...widgets, newWidget]);
    setShowAddPanel(false);
  };

  const moveWidget = (dragIndex: number, hoverIndex: number) => {
    const sorted = [...widgets].sort((a, b) => a.order - b.order);

    const [dragged] = sorted.splice(dragIndex, 1);
    sorted.splice(hoverIndex, 0, dragged);

    const reordered = sorted.map((w, index) => ({
      ...w,
      order: index + 1,
    }));

    setWidgets(reordered);
  };

  const handleRemove = (id: string) => {
    removeWidget(id);
  };

  const handleResize = (id: string, colSpan: number, rowSpan: number) => {
    updateWidget(id, { colSpan, rowSpan });
  };

  return (
    <>
      {/* 1. 상단 안내 및 제어 바 */}
      <div className="mb-5 flex min-h-[72px] items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <p className="text-sm text-gray-600">
          위젯을 드래그해서 홈 레이아웃을 자유롭게 구성하세요.
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => setShowAddPanel(true)}
            className="flex h-11 items-center gap-2 rounded-lg border border-blue-200 bg-gradient-to-r from-white to-sky-50 px-4 text-sm font-semibold text-[#082064] shadow-sm shadow-blue-900/5 transition-all hover:border-blue-300 hover:from-sky-50 hover:to-blue-50"
          >
            <Plus className="h-4 w-4 text-blue-700" />
            위젯 추가
          </button>

          <button
            onClick={() => setWidgets(defaultDashboardWidgets)}
            className="flex h-11 items-center gap-2 rounded-lg border border-blue-200 bg-gradient-to-r from-white to-sky-50 px-4 text-sm font-semibold text-[#082064] shadow-sm shadow-blue-900/5 transition-all hover:border-blue-300 hover:from-sky-50 hover:to-blue-50"
          >
            <RotateCcw className="h-4 w-4 text-blue-700" />
            초기화
          </button>
        </div>
      </div>

      {/* 2. 위젯 그리드 */}
      <div className="grid grid-cols-4 gap-3 auto-rows-[80px]">
        {[...widgets]
          .sort((a, b) => a.order - b.order)
          .map((widget, index) => (
            <DraggableWidget
              key={widget.id}
              id={widget.id}
              index={index}
              title={widget.title}
              colSpan={widget.colSpan}
              rowSpan={widget.rowSpan}
              moveWidget={moveWidget}
              onRemove={() => handleRemove(widget.id)}
              onResize={(colSpan, rowSpan) =>
                handleResize(widget.id, colSpan, rowSpan)
              }
              onRefresh={
                widget.type === 'ai-chat' ? resetChatMessages : undefined
              }
            >
              {renderWidgetContent(widget.type, widget.title)}
            </DraggableWidget>
          ))}
      </div>

      {/* 3. 빈 상태 */}
      {widgets.length === 0 && (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center text-gray-600 shadow-md">
            <Plus className="mx-auto mb-4 h-16 w-16 opacity-40 text-gray-400" />
            <p className="mb-4 text-lg font-medium text-gray-700">
              위젯을 추가하여 홈을 구성하세요.
            </p>

            <button
              onClick={() => setShowAddPanel(true)}
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              위젯 추가
            </button>
          </div>
        </div>
      )}

      {/* 4. 사이드 패널 */}
      <AddWidgetSidePanel
        isOpen={showAddPanel}
        onClose={() => setShowAddPanel(false)}
        onAddWidget={handleAddWidget}
      />
    </>
  );
}
