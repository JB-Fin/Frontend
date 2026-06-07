import React, { useState } from 'react';
import { Filter, Search, Calendar, X, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

// ==========================================
// 1. 필수 타입 정의
// ==========================================
export type TaskStatus = 'completed' | 'in-progress' | 'pending';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskFilter = 'all' | TaskStatus;

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: string;
  assignee: string;
  date: string;
  completedDate?: string;
}

// ==========================================
// 2. 설정값 정의
// ==========================================
const filters = [
  { value: 'all' as const, label: '전체' },
  { value: 'completed' as const, label: '완료' },
  { value: 'in-progress' as const, label: '진행중' },
  { value: 'pending' as const, label: '대기' },
];

const statusConfig = {
  'completed': { label: '완료', color: 'text-green-600', bg: 'bg-green-50', badge: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  'in-progress': { label: '진행중', color: 'text-blue-600', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-800', icon: Clock },
  'pending': { label: '대기', color: 'text-yellow-600', bg: 'bg-yellow-50', badge: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
} as const;

const priorityLabels = {
  'high': { label: '높음', className: 'bg-red-100 text-red-800' },
  'medium': { label: '보통', className: 'bg-gray-100 text-gray-800' },
  'low': { label: '낮음', className: 'bg-gray-100 text-gray-600' },
} as const;

// ==========================================
// 3. 테스트용 샘플 데이터
// ==========================================
const tasks: Task[] = [
  {
    id: '1',
    title: '데이터 분석 대시보드 UI 개발',
    description: '사용자 통계 및 차트 시각화를 위한 메인 대시보드 화면을 마크업하고 컴포넌트를 분리합니다.',
    status: 'in-progress',
    priority: 'high',
    type: '프론트엔드',
    assignee: '홍길동',
    date: '2026.06.01',
  },
  {
    id: '2',
    title: '로그인 및 회원가입 인증 로직 연동',
    description: 'JWT 토큰 기반의 인증 프로세스를 구축하고 세션 만료 예외 처리를 진행합니다.',
    status: 'completed',
    priority: 'high',
    type: '보안/인증',
    assignee: '이순신',
    date: '2026.05.28',
    completedDate: '2026.06.05',
  },
  {
    id: '3',
    title: '설정 페이지 다크모드 버그 수정',
    description: '테마 변경 시 일부 컴포넌트의 배경색이 즉시 반영되지 않는 캐싱 문제를 해결합니다.',
    status: 'pending',
    priority: 'medium',
    type: '버그 수정',
    assignee: '김철수',
    date: '2026.06.06',
  }
];

// ==========================================
// 4. 메인 컴포넌트
// ==========================================
export function TaskHistoryPage() {
  const [selectedFilter, setSelectedFilter] = useState<TaskFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = selectedFilter === 'all' || task.status === selectedFilter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    
    const taskDateStr = task.date.replace(/\./g, '-');
    const matchesStartDate = !startDate || taskDateStr >= startDate;
    const matchesEndDate = !endDate || taskDateStr <= endDate;

    return matchesFilter && matchesSearch && matchesStartDate && matchesEndDate;
  });

  const stats = [
    { label: '전체 작업', value: tasks.length, color: 'text-gray-900' },
    { label: '완료', value: tasks.filter((task) => task.status === 'completed').length, color: 'text-green-600' },
    { label: '진행중', value: tasks.filter((task) => task.status === 'in-progress').length, color: 'text-blue-600' },
    { label: '대기', value: tasks.filter((task) => task.status === 'pending').length, color: 'text-yellow-600' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. 상단 대시보드 카드 */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <p className="mb-2 text-sm text-gray-600">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 2. 필터 및 검색 바 */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <div className="flex gap-2">
              {filters.map((filter) => (
                <button 
                  key={filter.value} 
                  onClick={() => setSelectedFilter(filter.value)} 
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    selectedFilter === filter.value 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input 
                placeholder="작업명, 담당자 검색..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500" 
              />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowDatePicker(!showDatePicker)}
                className={`flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 ${
                  startDate || endDate ? 'border-blue-500 text-blue-600 font-bold bg-blue-50' : ''
                }`}
              >
                <Calendar className="h-4 w-4" />
                {startDate || endDate ? `${startDate || '...'} ~ ${endDate || '...'}` : '기간 선택'}
              </button>
              
              {showDatePicker && (
                <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700">조회 기간 설정</span>
                    {(startDate || endDate) && (
                      <button 
                        onClick={() => { setStartDate(''); setEndDate(''); }} 
                        className="text-xs text-red-500 hover:underline"
                      >
                        초기화
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">시작일</label>
                      <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                        className="w-full rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:border-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">종료일</label>
                      <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                        className="w-full rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:border-blue-500" 
                      />
                    </div>
                    <button 
                      onClick={() => setShowDatePicker(false)}
                      className="w-full rounded-lg bg-blue-600 py-2 text-center text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                    >
                      적용 완료
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. 작업 목록 리스트 */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-lg font-bold text-gray-900">작업 목록</h3>
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <p className="text-center py-8 text-sm text-gray-500">조건에 맞는 작업 내역이 없습니다.</p>
          ) : (
            filteredTasks.map((task) => {
              const config = statusConfig[task.status];
              const StatusIcon = config.icon;
              const priority = priorityLabels[task.priority];
              
              return (
                <div 
                  key={task.id} 
                  onClick={() => setSelectedTask(task)}
                  className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-5 transition-all hover:shadow-sm hover:border-blue-300"
                >
                  {/* ✨ 부모 레이아웃 정상 복구 완료 */}
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 rounded-lg p-3 ${config.bg}`}>
                      <StatusIcon className={`h-6 w-6 ${config.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600">{task.title}</h4>
                          <p className="mt-1 text-sm text-gray-600 truncate max-w-xl">{task.description}</p>
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
            })
          )}
        </div>
      </div>

      {/* 4. 작업 내역 상세 모달 팝업 */}
      {selectedTask && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black bg-opacity-40 transition-opacity">
          <div className="absolute inset-0" onClick={() => setSelectedTask(null)} />
          
          <div className="relative h-full w-[450px] bg-white p-8 shadow-2xl flex flex-col justify-between z-10 border-l border-gray-100">
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className={`rounded px-2 py-1 text-xs font-medium ${priorityLabels[selectedTask.priority].className}`}>
                    {priorityLabels[selectedTask.priority].label} 우선순위
                  </span>
                  <span className={`rounded px-2 py-1 text-xs font-medium ${statusConfig[selectedTask.status].badge}`}>
                    {statusConfig[selectedTask.status].label}
                  </span>
                </div>
                <button onClick={() => setSelectedTask(null)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-xs font-semibold text-blue-600">{selectedTask.type}</span>
                  <h2 className="text-2xl font-bold text-gray-900 mt-1">{selectedTask.title}</h2>
                </div>

                <div className="rounded-xl bg-gray-50 p-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">담당자</span>
                    <span className="font-semibold text-gray-900">{selectedTask.assignee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">작업 등록일</span>
                    <span className="text-gray-900">{selectedTask.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">최종 완료일</span>
                    <span className="text-gray-900">{selectedTask.completedDate || '-'}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">상세 내역 설명</h4>
                  <p className="text-sm text-gray-600 leading-relaxed bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                    {selectedTask.description}
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedTask(null)}
              className="w-full rounded-xl bg-gray-900 py-3 text-center text-sm font-medium text-white hover:bg-gray-800 transition-colors mt-auto"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}