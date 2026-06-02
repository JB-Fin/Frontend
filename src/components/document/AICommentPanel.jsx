// AI 코멘트 패널 -> 준법성 검토 결과에 대한 AI 의견, 개선 제안을 보여주는 컴포넌트
import '../../styles/review.css'

export default function AICommentPanel({ risks }) {
  return (
    <div>
      {risks.map(risk => (
        <div key={risk.id} className="risk-item" style={{ borderLeftColor: risk.levelColor }}>
          <span className="risk-badge" style={{ color: risk.levelColor, background: risk.levelBg }}>{risk.level} 리스크</span>
          <div className="risk-sentence" style={{ background: risk.levelBg }}>"{risk.sentence}"</div>
          <div>
            <div className="risk-section-label">검토 근거</div>
            <p className="risk-text">{risk.reason}</p>
          </div>
          <div className="risk-suggestion">
            <div className="risk-section-label" style={{ color: 'var(--blue)' }}>수정 제안</div>
            <p className="risk-text">{risk.suggestion}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
