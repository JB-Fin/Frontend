import '../styles/pages.css'

const INVESTIGATIONS = [
  { id: 1, title: '내부 거래 의심 건', status: '진행중', priority: '높음', investigator: '김준또', startDate: '2026.06.01', progress: 65, findings: 3, documents: 12 },
  { id: 2, title: '고객 정보 유출 사건', status: '진행중', priority: '긴급', investigator: '박정민', startDate: '2026.05.28', progress: 85, findings: 5, documents: 24 },
  { id: 3, title: '이해충돌 검토', status: '완료', priority: '보통', investigator: '이규현', startDate: '2026.05.20', progress: 100, findings: 1, documents: 8 },
]

const TOOLS = [
  { name: '문서 분석', description: 'AI 기반 대량 문서 분석 및 패턴 인식', tone: '' },
  { name: '이상거래 탐지', description: '거래 패턴 분석을 통한 이상 행위 탐지', tone: 'red' },
  { name: '증거 연결', description: '관련 증거 자동 연결 및 시각화', tone: 'green' },
]

export default function InternalInvestigationPage() {
  return (
    <main className="workspace-page page-stack">
      <header className="page-head">
        <div>
          <h2>내부 조사 지원</h2>
          <p>AI 기반 증거 분석과 조사 진행 현황을 관리합니다.</p>
        </div>
        <button type="button" className="primary-action">새 조사 시작</button>
      </header>

      <section className="stats-grid">
        <Stat label="진행중인 조사" value="3건" note="+1 이번 주" />
        <Stat label="완료된 조사" value="18건" note="+5 이번 달" tone="green" />
        <Stat label="분석한 문서" value="248개" note="누적" tone="purple" />
        <Stat label="평균 처리 시간" value="7일" note="-2일 개선" tone="red" />
      </section>

      <section className="glass-card panel-pad">
        <h3>AI 조사 도구</h3>
        <div className="content-grid-3">
          {TOOLS.map(tool => (
            <article className="tool-card" key={tool.name}>
              <span className={`badge-soft ${tool.tone}`}>{tool.name}</span>
              <h4>{tool.name}</h4>
              <p>{tool.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="glass-card panel-pad page-stack">
        <h3>진행중인 조사</h3>
        {INVESTIGATIONS.map(item => (
          <article className="work-item" key={item.id}>
            <div className="work-item__icon">🔎</div>
            <div>
              <div className="work-item__top">
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.investigator} 담당, {item.documents}개 문서 분석</p>
                </div>
                <div>
                  <span className={`badge-soft ${item.priority === '긴급' ? 'red' : item.priority === '높음' ? 'yellow' : ''}`}>{item.priority}</span>{' '}
                  <span className={`badge-soft ${item.status === '완료' ? 'green' : ''}`}>{item.status}</span>
                </div>
              </div>
              <div className="meta-row">
                <span>시작일: {item.startDate}</span>
                <span>발견사항: {item.findings}건</span>
                <span>진행률: {item.progress}%</span>
              </div>
              <div className="progress-track" style={{ marginTop: 12 }}>
                <span className="progress-fill" style={{ width: `${item.progress}%` }} />
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}

function Stat({ label, value, note, tone = '' }) {
  return (
    <div className="glass-card stat-card">
      <small>{label}</small>
      <strong>{value}</strong>
      <span className={tone ? `badge-soft ${tone}` : ''}>{note}</span>
    </div>
  )
}
