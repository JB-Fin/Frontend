import { FileSearch, Search } from 'lucide-react';

const stats = [
  { label: '진행중인 조사', value: '3건', trend: '+1', color: 'text-blue-600' },
  { label: '완료된 조사', value: '18건', trend: '+5', color: 'text-green-600' },
];

export function InternalInvestigationWidget() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 p-3">
          <Search className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">내부 조사 지원</h3>
          <p className="text-xs text-gray-600">AI 기반 증거 분석</p>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-gray-200/50 bg-white/90 p-3">
            <p className="mb-1 text-xs text-gray-600">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-900">{stat.value}</span>
              <span className={`text-xs ${stat.color}`}>{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>
      <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 py-2.5 font-medium text-white transition-all hover:shadow-lg">
        <FileSearch className="h-4 w-4" />
        새 조사 시작
      </button>
    </div>
  );
}
