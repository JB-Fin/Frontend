import '../../styles/review.css'

export default function DocumentCompare({ risks }) {
  return (
    <div className="diff-grid">
      <div>
        <div className="diff-col-label before">수정 전 (원본)</div>
        <div className="diff-box">
          {risks.map((r, i) => (
            <div key={i} className={`diff-line${r.before !== r.after ? ' changed-before' : ''}`}>{r.before}</div>
          ))}
        </div>
      </div>
      <div>
        <div className="diff-col-label after">수정 후 (권고안)</div>
        <div className="diff-box">
          {risks.map((r, i) => (
            <div key={i} className={`diff-line${r.before !== r.after ? ' changed-after' : ''}`}>{r.after}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
