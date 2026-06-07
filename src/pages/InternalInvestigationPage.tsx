import { AlertCircle, CheckCircle, Clock, FileSearch, Plus, TrendingUp } from 'lucide-react';

const investigations = [
  { id: 1, title: '내부 거래 의심 건', status: 'in-progress', priority: 'high', investigator: '김준또', startDate: '2026.06.01', progress: 65, findings: 3, documents: 12 },
  { id: 2, title: '고객 정보 유출 사건', status: 'in-progress', priority: 'critical', investigator: '박정우', startDate: '2026.05.28', progress: 85, findings: 5, documents: 24 },
  { id: 3, title: '이해충돌 검토', status: 'completed', priority: 'medium', investigator: '이규현', startDate: '2026.05.20', progress: 100, findings: 1, documents: 8 },
];

const aiTools = [
  { name: '문서 분석', description: 'AI 기반 대량 문서 분석 및 패턴 인식', icon: FileSearch, color: 'text-blue-600', bg: 'bg-blue-100' },
  { name: '이상거래 탐지', description: '거래 패턴 분석을 통한 이상 행위 탐지', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
  { name: '증거 연결', description: '관련 증거 자동 연결 및 시각화', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
];

export function InternalInvestigationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">내부 조사 지원</h2>
          <p className="text-gray-600">AI 기반 증거 분석 및 조사 지원 시스템</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 font-medium text-white transition-all hover:shadow-lg">
          <Plus className="h-5 w-5" />새 조사 시작
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          ['진행중인 조사', '3건', 'text-blue-600', '+1 이번 주'],
          ['완료된 조사', '18건', 'text-green-600', '+5 이번 달'],
          ['분석한 문서', '248개', 'text-purple-600', '누적'],
          ['평균 처리 시간', '7일', 'text-indigo-600', '-2일 개선'],
        ].map(([label, value, color, trend]) => (
          <div key={label} className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
            <p className="mb-2 text-sm text-gray-600">{label}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            <p className="mt-2 text-xs text-gray-500">{trend}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
        <h3 className="mb-4 text-lg font-bold text-gray-900">AI 조사 도구</h3>
        <div className="grid grid-cols-3 gap-4">
          {aiTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div key={tool.name} className="group cursor-pointer rounded-lg border border-gray-200/50 bg-white/90 p-5 transition-all hover:shadow-md">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${tool.bg}`}><Icon className={`h-6 w-6 ${tool.color}`} /></div>
                <h4 className="mb-2 font-bold text-gray-900 transition-colors group-hover:text-purple-600">{tool.name}</h4>
                <p className="text-sm text-gray-600">{tool.description}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
        <h3 className="mb-6 text-lg font-bold text-gray-900">진행중인 조사</h3>
        <div className="space-y-4">
          {investigations.map((item) => (
            <div key={item.id} className="group cursor-pointer rounded-lg border border-gray-200/50 bg-white/90 p-5 transition-all hover:shadow-md">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <h4 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-purple-600">{item.title}</h4>
                    <span className={`rounded px-2 py-1 text-xs font-medium ${item.priority === 'critical' ? 'bg-red-600 text-white' : item.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.priority === 'critical' ? '긴급' : item.priority === 'high' ? '높음' : '보통'}</span>
                    <span className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium ${item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{item.status === 'completed' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}{item.status === 'completed' ? '완료' : '진행중'}</span>
                  </div>
                  <div className="flex gap-6 text-sm text-gray-600">
                    <span>조사관: {item.investigator}</span><span>시작일: {item.startDate}</span><span>문서: {item.documents}개</span><span>발견사항: {item.findings}건</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-600">진행률</span><b>{item.progress}%</b></div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200/50"><div className="h-full bg-gradient-to-r from-purple-600 to-indigo-600" style={{ width: `${item.progress}%` }} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
