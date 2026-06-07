import { AlertCircle, CheckCircle, Upload } from 'lucide-react';

export function AIReviewWidget() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
          <Upload className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="mb-2 font-medium text-gray-900">문서 AI 검토</h3>
        <p className="mb-4 text-sm text-gray-600">규정 준수 검토를 위한 문서 업로드</p>
        <button className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 font-medium text-white transition-all hover:shadow-lg">
          파일 선택
        </button>
        <div className="mt-6 border-t border-gray-200/50 pt-6">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>검토 완료: 24건</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span>대기중: 3건</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
