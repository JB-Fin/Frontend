import { FileText, GraduationCap, Megaphone } from 'lucide-react';

const drafts = [
  { title: '원금 보장 오인 표현 금지', status: '포스터 초안' },
  { title: '고위험 고객 기록 보존 강화', status: 'PPT 개요' },
  { title: '민원 보고 기한 명확화', status: '교육 문구' },
];

export function EducationContentWidget() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 p-3">
          <GraduationCap className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">교육 자료 제작</h3>
          <p className="text-xs text-gray-600">법안 변경사항 기반 교육 초안</p>
        </div>
      </div>

      <div className="flex-1 space-y-2">
        {drafts.map((draft) => (
          <div key={draft.title} className="rounded-lg border border-gray-200/50 bg-white/90 p-3 transition-all hover:shadow-md">
            <div className="mb-2 flex items-center gap-2">
              {draft.status === '포스터 초안' ? <Megaphone className="h-4 w-4 text-blue-600" /> : <FileText className="h-4 w-4 text-gray-600" />}
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900">{draft.title}</span>
            </div>
            <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">{draft.status}</span>
          </div>
        ))}
      </div>

      <button className="mt-3 flex w-full items-center justify-center gap-2 py-2 text-sm font-medium text-green-600 transition-colors hover:text-green-700">
        <GraduationCap className="h-4 w-4" />
        교육 자료 제작 열기
      </button>
    </div>
  );
}
