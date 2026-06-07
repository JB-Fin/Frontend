import { X } from 'lucide-react';
import { widgetOptions } from '../../constants/dashboardWidgets';
import type { WidgetType } from '../../types/widget';

interface AddWidgetSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (type: WidgetType, title: string, size: { colSpan: number; rowSpan: number }) => void;
}

export function AddWidgetSidePanel({ isOpen, onClose, onAddWidget }: AddWidgetSidePanelProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed bottom-0 right-0 top-0 z-50 flex w-[480px] flex-col border-l border-white/60 bg-white/90 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-gray-200/50 bg-white/60 px-6 py-5">
          <div>
            <h2 className="mb-1 text-xl font-bold text-gray-900">위젯 추가</h2>
            <p className="text-sm text-gray-700">대시보드에 추가할 위젯을 선택하세요.</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 transition-colors hover:bg-white/80">
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {widgetOptions.map((widget) => {
              const Icon = widget.icon;
              return (
                <div
                  key={widget.type}
                  className="group cursor-pointer rounded-lg border border-white/60 bg-white/70 p-4 backdrop-blur-md transition-all hover:border-blue-400/60 hover:bg-white/80 hover:shadow-lg"
                  onClick={() => onAddWidget(widget.type, widget.title, widget.defaultSize)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 rounded-lg p-3 ${widget.bgColor}`}>
                      <Icon className={`h-6 w-6 ${widget.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="text-gray-900 transition-colors group-hover:text-blue-600">{widget.title}</h3>
                        <span className="ml-2 flex-shrink-0 rounded bg-gray-100/80 px-2 py-1 text-xs text-gray-700">
                          {widget.preview}
                        </span>
                      </div>
                      <p className="mb-3 text-sm text-gray-700">{widget.description}</p>
                      <div className="flex items-center gap-2">
                        <div className="grid grid-cols-4 gap-1">
                          {Array.from({ length: 4 }).map((_, colIndex) => (
                            <div
                              key={colIndex}
                              className={`h-3 w-3 rounded-sm ${colIndex < widget.defaultSize.colSpan ? 'bg-blue-300/80' : 'bg-gray-200/80'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">그리드 크기 미리보기</span>
                      </div>
                    </div>
                    <button className="flex-shrink-0 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm text-white opacity-0 shadow-md transition-opacity hover:shadow-lg group-hover:opacity-100">
                      추가
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-gray-200/50 bg-white/60 px-6 py-4 backdrop-blur-sm">
          <p className="text-sm text-gray-700">
            추가한 위젯은 드래그해서 순서를 바꾸거나 크기를 조절할 수 있습니다.
          </p>
        </div>
      </div>
    </>
  );
}
