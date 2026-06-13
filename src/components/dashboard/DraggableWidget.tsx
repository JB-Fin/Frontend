import { useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical, Info, MoreVertical, RefreshCw, X } from 'lucide-react';

interface DraggableWidgetProps {
  id: string;
  index: number;
  title: string;
  colSpan: number;
  rowSpan: number;
  children: ReactNode;
  moveWidget: (dragIndex: number, hoverIndex: number) => void;
  onRemove: () => void;
  onResize: (newColSpan: number, newRowSpan: number) => void;
  onRefresh?: () => void;
}

const ITEM_TYPE = 'WIDGET';
const GRID_COLUMN_WIDTH = 370;
const GRID_ROW_HEIGHT = 92;

export function DraggableWidget({
  id,
  index,
  title,
  colSpan,
  rowSpan,
  children,
  moveWidget,
  onRemove,
  onResize,
  onRefresh,
}: DraggableWidgetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState(false);

  const [{ isDragging }, drag, preview] = useDrag({
    type: ITEM_TYPE,
    item: { id, index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: { id: string; index: number }) => {
      if (!ref.current || item.index === index) return;
      moveWidget(item.index, index);
      item.index = index;
    },
  });

  preview(drop(ref));

  const handleMouseDown = (event: ReactMouseEvent, direction: 'right' | 'bottom' | 'corner') => {
    event.preventDefault();

    const startX = event.clientX;
    const startY = event.clientY;
    const startColSpan = colSpan;
    const startRowSpan = rowSpan;

    const handleMouseMove = (moveEvent: globalThis.MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      let newColSpan = startColSpan;
      let newRowSpan = startRowSpan;

      if (direction === 'right' || direction === 'corner') {
        newColSpan = Math.max(1, Math.min(4, Math.round(startColSpan + deltaX / GRID_COLUMN_WIDTH)));
      }
      if (direction === 'bottom' || direction === 'corner') {
        newRowSpan = Math.max(1, Math.round(startRowSpan + deltaY / GRID_ROW_HEIGHT));
      }

      onResize(newColSpan, newRowSpan);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={ref}
      style={{ gridColumn: `span ${colSpan}`, gridRow: `span ${rowSpan}`, opacity: isDragging ? 0.5 : 1 }}
      className="group relative"
    >
      <div className="h-full w-full overflow-hidden rounded-lg border border-white/60 bg-white/85 shadow-lg ring-2 ring-blue-400/0 backdrop-blur-xl transition-all hover:shadow-xl hover:ring-blue-400/30">
        <div className="flex items-center justify-between border-b border-gray-200/50 bg-white/60 px-4 py-3 backdrop-blur-sm">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div
              ref={(node) => {
                drag(node);
              }}
              className="flex-shrink-0 cursor-move rounded p-1 transition-colors hover:bg-white/80"
              title="드래그해서 이동"
            >
              <GripVertical className="h-4 w-4 text-gray-700" />
            </div>
            <h3 className="flex-1 truncate text-base font-semibold text-gray-900">{title}</h3>
            <button className="flex-shrink-0 rounded p-1 transition-colors hover:bg-white/80" title="정보">
              <Info className="h-4 w-4 text-gray-700" />
            </button>
          </div>
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="rounded p-1 transition-colors hover:bg-white/80">
              <MoreVertical className="h-4 w-4 text-gray-700" />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 z-20 mt-1 w-48 rounded-lg border border-white/60 bg-white/95 shadow-2xl backdrop-blur-md">
                  {onRefresh && (
                    <button
                      onClick={() => {
                        onRefresh();
                        setShowMenu(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-t-lg px-4 py-2 text-left text-gray-800 hover:bg-white/80"
                    >
                      <RefreshCw className="h-4 w-4" />
                      새로고침
                    </button>
                  )}
                  {onRefresh && <hr className="my-1 border-gray-200/50" />}
                  <button
                    onClick={() => {
                      onRemove();
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-b-lg px-4 py-2 text-left text-red-600 hover:bg-red-50/80"
                  >
                    <X className="h-4 w-4" />
                    위젯 제거
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="min-h-0 overflow-auto p-4" style={{ height: 'calc(100% - 53px)' }}>
          {children}
        </div>
      </div>

      <div className="absolute bottom-0 right-0 top-0 z-10 w-2 cursor-ew-resize opacity-0 transition-all hover:bg-blue-500/50 group-hover:opacity-100" onMouseDown={(event) => handleMouseDown(event, 'right')} />
      <div className="absolute bottom-0 left-0 right-0 z-10 h-2 cursor-ns-resize opacity-0 transition-all hover:bg-blue-500/50 group-hover:opacity-100" onMouseDown={(event) => handleMouseDown(event, 'bottom')} />
      <div className="absolute bottom-0 right-0 z-20 h-6 w-6 cursor-nwse-resize" onMouseDown={(event) => handleMouseDown(event, 'corner')}>
        <div className="flex h-full w-full items-end justify-end p-1 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="h-4 w-4 rounded-br border-b-2 border-r-2 border-blue-500 bg-white/50 backdrop-blur-sm" />
        </div>
      </div>
    </div>
  );
}
