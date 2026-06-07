import { useState } from 'react';
import { CheckCircle, Clock, Download, Eye, FileText, Upload } from 'lucide-react';

const recentReviews = [
  { id: 1, name: '신규_대출상품_검토.pdf', status: 'completed', result: '적합', issues: 0, date: '2026.06.06 14:30', score: 98 },
  { id: 2, name: 'AML_정책_업데이트.docx', status: 'in-progress', result: '-', issues: null, date: '2026.06.06 15:10', score: null },
  { id: 3, name: '내부통제_절차서.pdf', status: 'completed', result: '검토 필요', issues: 3, date: '2026.06.05 11:20', score: 85 },
  { id: 4, name: '고객정보보호_가이드.pdf', status: 'completed', result: '적합', issues: 0, date: '2026.06.05 09:45', score: 100 },
];

function StatusBadge({ status }: { status: string }) {
  if (status === 'completed') {
    return (
      <span className="flex items-center gap-1 rounded-lg bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
        <CheckCircle className="h-3 w-3" />
        완료
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 rounded-lg bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
      <Clock className="h-3 w-3" />
      진행중
    </span>
  );
}

export function AIReviewPage() {
  const [dragActive, setDragActive] = useState(false);
  const handleDrag = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(event.type === 'dragenter' || event.type === 'dragover');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-white/60 bg-white/85 p-8 shadow-lg backdrop-blur-xl">
        <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={(event) => { event.preventDefault(); setDragActive(false); }} className={`rounded-lg border-2 border-dashed p-12 text-center transition-all ${dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'}`}>
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
            <Upload className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">문서 AI 검토</h3>
          <p className="mb-6 text-gray-600">규정 준수 검토가 필요한 문서를 업로드하세요.</p>
          <button className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-medium text-white transition-all hover:shadow-lg">파일 선택</button>
          <p className="mt-4 text-sm text-gray-500">또는 파일을 여기로 드래그하세요.</p>
          <p className="mt-2 text-xs text-gray-400">지원 형식: PDF, DOCX, XLSX (최대 50MB)</p>
        </div>
        <div className="mt-6 grid grid-cols-4 gap-4">
          {[
            ['오늘 검토', '8건', 'text-blue-600', 'from-blue-50 to-indigo-50'],
            ['적합 판정', '24건', 'text-green-600', 'from-green-50 to-emerald-50'],
            ['검토 필요', '3건', 'text-yellow-600', 'from-yellow-50 to-orange-50'],
            ['평균 점수', '94점', 'text-purple-600', 'from-purple-50 to-pink-50'],
          ].map(([label, value, color, gradient]) => (
            <div key={label} className={`rounded-lg bg-gradient-to-br ${gradient} p-4`}>
              <p className="mb-1 text-sm text-gray-600">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">최근 검토 내역</h3>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">전체 보기 →</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200/50">
              {['문서명', '상태', '검토 결과', '이슈', '점수', '일시', '작업'].map((head) => (
                <th key={head} className={`px-4 py-3 text-sm font-medium text-gray-600 ${head === '작업' ? 'text-right' : 'text-left'}`}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentReviews.map((review) => (
              <tr key={review.id} className="border-b border-gray-100/50 transition-colors hover:bg-blue-50/30">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2"><FileText className="h-4 w-4 text-blue-600" /></div>
                    <span className="text-sm font-medium text-gray-900">{review.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4"><StatusBadge status={review.status} /></td>
                <td className={`px-4 py-4 text-sm font-medium ${review.result === '적합' ? 'text-green-600' : review.result === '검토 필요' ? 'text-yellow-600' : 'text-gray-400'}`}>{review.result}</td>
                <td className="px-4 py-4 text-sm">{review.issues === null ? '-' : `${review.issues}건`}</td>
                <td className="px-4 py-4 text-sm font-bold text-gray-900">{review.score === null ? '-' : `${review.score}점`}</td>
                <td className="px-4 py-4 text-xs text-gray-600">{review.date}</td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <button className="rounded-lg p-2 transition-colors hover:bg-blue-100"><Eye className="h-4 w-4 text-gray-600" /></button>
                    <button className="rounded-lg p-2 transition-colors hover:bg-blue-100"><Download className="h-4 w-4 text-gray-600" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
