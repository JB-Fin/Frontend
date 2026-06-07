import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const tasks = [
  { id: 1, title: '신규 대출 상품 검토', date: '2026.06.05', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  { id: 2, title: 'AML 정책 업데이트', date: '2026.06.06', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 3, title: '리스크 평가 보고서', date: '2026.06.07', icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100' },
];

export function TaskHistoryWidget() {
  return (
    <div className="flex h-full flex-col">
      <div className="space-y-2">
        {tasks.map((task) => {
          const Icon = task.icon;
          return (
            <div key={task.id} className="group cursor-pointer rounded-lg border border-gray-200/50 bg-white/90 p-3 transition-all hover:shadow-md">
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 rounded-lg p-2 ${task.bg}`}>
                  <Icon className={`h-4 w-4 ${task.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 transition-colors group-hover:text-blue-600">{task.title}</p>
                  <p className="mt-1 text-xs text-gray-600">{task.date}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button className="mt-4 w-full py-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700">전체 보기 →</button>
    </div>
  );
}
