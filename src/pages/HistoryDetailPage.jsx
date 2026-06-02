// 히스토리 상세 화면: 특정 검토 이력의 상세 결과 + 다운로드 구현

import { useParams, useNavigate } from 'react-router-dom'
import { dummyReviewDetail as detail } from '../data/dummyReviewDetail'
import { DocumentMeta } from '../components/document/DocumentMeta'
import DocumentCompare from '../components/document/DocumentCompare'
import DownloadButton from '../components/document/DownloadButton'
import AICommentPanel from '../components/document/AICommentPanel'
import Button from '../components/common/Button'
import '../styles/review.css'

// 히스토리에서 특정 문서를 클릭했을 때 보여주는 상세 화면
// tab: 'result' | 'diff' | 'report' 세 가지 뷰를 탭으로 전환
export default function HistoryDetailPage() {
  const { docId, tab = 'result' } = useParams()
  const navigate = useNavigate()

  const tabs = [
    { id: 'result', label: '검토 결과' },
    { id: 'diff',   label: '수정 전후 비교' },
    { id: 'report', label: '보고서 다운로드' },
  ]

  return (
    <div className="page-inner" style={{ maxWidth: 860 }}>
      {/* 뒤로가기 + 제목 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
        <button
          onClick={() => navigate('/history')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}
        >
          ← 목록
        </button>
        <h2 className="page-title">문서 상세</h2>
      </div>
      <DocumentMeta fileName={detail.fileName} reviewedAt={detail.reviewedAt} docId={docId} />

      {/* 탭 */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => navigate(`/history/${docId}/${t.id}`)}
            style={{
              padding: '10px 18px',
              border: 'none',
              borderBottom: tab === t.id ? '2px solid var(--navy)' : '2px solid transparent',
              background: 'none',
              fontSize: 13,
              fontWeight: tab === t.id ? 700 : 400,
              color: tab === t.id ? 'var(--navy)' : 'var(--text-muted)',
              cursor: 'pointer',
              marginBottom: '-1px',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      {tab === 'result' && <AICommentPanel risks={detail.risks} />}
      {tab === 'diff'   && <DocumentCompare risks={detail.risks} />}
      {tab === 'report' && <DownloadButton docId={docId} />}
    </div>
  )
}
