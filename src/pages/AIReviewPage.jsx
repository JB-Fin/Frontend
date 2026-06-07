import { useState } from 'react'
import '../styles/pages.css'

const REVIEWS = [
  { id: 1, name: '신규_대출상품_검토.pdf', status: 'completed', result: '적합', issues: 0, date: '2026.06.06 14:30', score: 98 },
  { id: 2, name: 'AML_정책_업데이트.docx', status: 'in-progress', result: '-', issues: null, date: '2026.06.06 15:10', score: null },
  { id: 3, name: '내부통제_절차.pdf', status: 'completed', result: '검토 필요', issues: 3, date: '2026.06.05 11:20', score: 85 },
  { id: 4, name: '고객정보보호_가이드.pdf', status: 'completed', result: '적합', issues: 0, date: '2026.06.05 09:45', score: 100 },
]

export default function AIReviewPage() {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(event.type === 'dragenter' || event.type === 'dragover')
  }

  const handleDrop = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(false)
  }

  return (
    <main className="workspace-page page-stack">
      <section className="glass-card panel-pad">
        <div
          className={`review-dropzone${dragActive ? ' active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="review-dropzone__icon">⇧</div>
          <h2>문서 AI 검토</h2>
          <p>규정 준수 검토가 필요한 문서를 업로드하세요.</p>
          <button type="button" className="primary-action">파일 선택</button>
          <small>또는 파일을 여기로 드래그하세요. PDF, DOCX, XLSX 최대 50MB</small>
        </div>

        <div className="stats-grid" style={{ marginTop: 18 }}>
          <Stat label="오늘 검토" value="8건" />
          <Stat label="적합 판정" value="24건" />
          <Stat label="검토 필요" value="3건" />
          <Stat label="평균 점수" value="94점" />
        </div>
      </section>

      <section className="glass-card panel-pad">
        <div className="toolbar-row" style={{ marginBottom: 16 }}>
          <h3>최근 검토 내역</h3>
          <button type="button" className="secondary-action">전체 보기</button>
        </div>
        <div className="item-list">
          {REVIEWS.map(review => (
            <article className="work-item" key={review.id}>
              <div className="work-item__icon">📄</div>
              <div>
                <div className="work-item__top">
                  <div>
                    <h4>{review.name}</h4>
                    <p>{review.date}</p>
                  </div>
                  <div>
                    <span className={`badge-soft ${review.status === 'completed' ? 'green' : ''}`}>
                      {review.status === 'completed' ? '완료' : '진행중'}
                    </span>{' '}
                    <span className={`badge-soft ${review.result === '적합' ? 'green' : review.result === '검토 필요' ? 'yellow' : ''}`}>
                      {review.result}
                    </span>
                  </div>
                </div>
                <div className="meta-row">
                  <span>이슈: {review.issues === null ? '-' : `${review.issues}건`}</span>
                  <span>점수: {review.score === null ? '-' : `${review.score}점`}</span>
                  <span>작업: 미리보기 · 다운로드</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

function Stat({ label, value }) {
  return (
    <div className="glass-card stat-card">
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  )
}
