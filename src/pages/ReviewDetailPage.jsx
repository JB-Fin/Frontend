// AI 검토 상세 화면: 특정 문서 선택 시 검토 결과 보여주는 화면 구현
import { useParams, useNavigate } from 'react-router-dom'
import { dummyReviewDetail as detail } from '../data/dummyReviewDetail'
import { DocumentMeta } from '../components/document/DocumentMeta'
import AICommentPanel from '../components/document/AICommentPanel'
import Button from '../components/common/Button'
import '../styles/review.css'

export default function ReviewDetailPage() {
  const { docId } = useParams()
  const navigate = useNavigate()
  const high   = detail.risks.filter(r => r.level === '높음').length
  const medium = detail.risks.filter(r => r.level === '중간').length

  return (
    <div className="page-inner">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h2 className="page-title">검토 결과</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" onClick={() => navigate(`/history/${docId}/diff`)}>수정 전후 비교</Button>
          <Button onClick={() => navigate(`/history/${docId}/report`)}>보고서 다운로드</Button>
        </div>
      </div>
      <DocumentMeta fileName={detail.fileName} reviewedAt={detail.reviewedAt} docId={docId} />

      {/* 요약 카드 */}
      <div className="stat-cards">
        {[
          { label: '전체 검토 항목', value: detail.risks.length, color: 'var(--navy)'      },
          { label: '높음 리스크',    value: high,                 color: 'var(--risk-high)' },
          { label: '중간 리스크',    value: medium,               color: 'var(--risk-medium)'},
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-card__label">{s.label}</div>
            <div className="stat-card__value" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <AICommentPanel risks={detail.risks} />
    </div>
  )
}
