import { useNavigate } from 'react-router-dom'
import { Upload } from 'lucide-react'

export function AIReviewWidget() {
  const navigate = useNavigate()

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-hidden text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
          <Upload className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="mb-1 text-base font-semibold text-gray-900">문서 AI 검토</h3>
        <p className="mb-3 text-sm leading-5 text-gray-600">규정 준수 검토를 위한 문서 업로드</p>

        {/* 파일 선택 → AI 검토 페이지로 이동 */}
        <button
          onClick={() => navigate('/review')}
          className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-medium text-white transition-all hover:shadow-lg"
        >
          파일 선택
        </button>

      </div>

      {/* 전체 검토 내역 보기 */}
      <button
        onClick={() => navigate('/review')}
        className="mt-3 w-full py-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
      >
        전체 검토 보기 →
      </button>
    </div>
  )
}
