import { useState } from 'react';
import { AlertTriangle, Calendar, CheckCircle, Clock, FileText, Filter, Search } from 'lucide-react';

type TaskStatus = 'completed' | 'in-progress' | 'pending';
type TaskPriority = 'high' | 'medium' | 'low';
type TaskFilter = TaskStatus | 'all';

const tasks = [
  { id: 1, title: '신규 대출 상품 검토', type: 'AI 검토', status: 'completed' as const, priority: 'high' as const, assignee: '김준또', date: '2026.06.05', completedDate: '2026.06.05', description: '개인 신용대출 상품의 컴플라이언스 검토' },
  { id: 2, title: 'AML 정책 업데이트', type: '정책 검토', status: 'in-progress' as const, priority: 'high' as const, assignee: '박정우', date: '2026.06.06', completedDate: null, description: '자금세탁방지 정책 개정안 검토' },
  { id: 3, title: '리스크 평가 보고서', type: '보고서', status: 'pending' as const, priority: 'medium' as const, assignee: '이규현', date: '2026.06.07', completedDate: null, description: '2분기 리스크 평가 보고서 작성' },
  { id: 4, title: '고객정보 보안 점검', type: '감사', status: 'completed' as const, priority: 'high' as const, assignee: '최보라', date: '2026.06.04', completedDate: '2026.06.04', description: '개인정보 보호 시스템 정기 점검' },
];

const filters: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'completed', label: '완료' },
  { value: 'in-progress', label: '진행중' },
  { value: 'pending', label: '대기' },
];

const statusConfig = {
  completed: { icon: CheckCircle, label: '완료', color: 'text-green-600', bg: 'bg-green-100', badge: 'bg-green-100 text-green-700' },
  'in-progress': { icon: Clock, label: '진행중', color: 'text-blue-600', bg: 'bg-blue-100', badge: 'bg-blue-100 text-blue-700' },
  pending: { icon: AlertTriangle, label: '대기', color: 'text-yellow-600', bg: 'bg-yellow-100', badge: 'bg-yellow-100 text-yellow-700' },
};

const priorityLabels: Record<TaskPriority, { label: string; className: string }> = {
  high: { label: '높음', className: 'bg-red-100 text-red-700' },
  medium: { label: '보통', className: 'bg-yellow-100 text-yellow-700' },
  low: { label: '낮음', className: 'bg-green-100 text-green-700' },
};

export function TaskHistoryPage() {
  const [selectedFilter, setSelectedFilter] = useState<TaskFilter>('all');
  const filteredTasks = selectedFilter === 'all' ? tasks : tasks.filter((task) => task.status === selectedFilter);
  const stats = [
    { label: '전체 작업', value: tasks.length, color: 'text-gray-900' },
    { label: '완료', value: tasks.filter((task) => task.status === 'completed').length, color: 'text-green-600' },
    { label: '진행중', value: tasks.filter((task) => task.status === 'in-progress').length, color: 'text-blue-600' },
    { label: '대기', value: tasks.filter((task) => task.status === 'pending').length, color: 'text-yellow-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
            <p className="mb-2 text-sm text-gray-600">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <div className="flex gap-2">
              {filters.map((filter) => (
                <button key={filter.value} onClick={() => setSelectedFilter(filter.value)} className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${selectedFilter === filter.value ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'border border-gray-200/50 bg-white/80 text-gray-700 hover:bg-white/90'}`}>
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input placeholder="작업 검색..." className="rounded-lg border border-gray-200/50 bg-white/90 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-gray-200/50 bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-white">
              <Calendar className="h-4 w-4" />
              기간 선택
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
        <h3 className="mb-6 text-lg font-bold text-gray-900">작업 목록</h3>
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const config = statusConfig[task.status];
            const StatusIcon = config.icon;
            const priority = priorityLabels[task.priority];
            return (
              <div key={task.id} className="group cursor-pointer rounded-lg border border-gray-200/50 bg-white/90 p-5 transition-all hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 rounded-lg p-3 ${config.bg}`}><StatusIcon className={`h-6 w-6 ${config.color}`} /></div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600">{task.title}</h4>
                        <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                      </div>
                      <div className="ml-4 flex items-center gap-2">
                        <span className={`rounded px-2 py-1 text-xs font-medium ${priority.className}`}>{priority.label}</span>
                        <span className={`rounded-lg px-3 py-1 text-xs font-medium ${config.badge}`}>{config.label}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-6 text-sm">
                      <span><span className="text-xs text-gray-500">유형:</span> <b>{task.type}</b></span>
                      <span><span className="text-xs text-gray-500">담당자:</span> <b>{task.assignee}</b></span>
                      <span><span className="text-xs text-gray-500">시작일:</span> {task.date}</span>
                      {task.completedDate && <span className="font-medium text-green-600">완료일: {task.completedDate}</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
