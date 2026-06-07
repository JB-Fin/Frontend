import { useMemo, useState } from 'react'
import '../styles/pages.css'

const TASKS = [
  { id: 1, title: '신규 대출 상품 검토', type: 'AI 검토', status: 'completed', priority: 'high', assignee: '김준또', date: '2026.06.05', completedDate: '2026.06.05', description: '개인 신용대출 상품의 컴플라이언스 검토' },
  { id: 2, title: 'AML 정책 업데이트', type: '정책 검토', status: 'in-progress', priority: 'high', assignee: '박정민', date: '2026.06.06', completedDate: null, description: '자금세탁방지 정책 개정안 검토' },
  { id: 3, title: '리스크 평가 보고서', type: '보고서', status: 'pending', priority: 'medium', assignee: '이규현', date: '2026.06.07', completedDate: null, description: '2분기 리스크 평가 보고서 작성' },
  { id: 4, title: '고객정보 보안 점검', type: '감사', status: 'completed', priority: 'high', assignee: '최보라', date: '2026.06.04', completedDate: '2026.06.04', description: '개인정보 보호 시스템 정기 점검' },
  { id: 5, title: '내부통제 절차 개선', type: '프로세스', status: 'in-progress', priority: 'medium', assignee: '김준또', date: '2026.06.03', completedDate: null, description: '내부통제 프로세스 효율화 방안 수립' },
]

const STATUS = {
  completed: { label: '완료', tone: 'green', icon: '✓' },
  'in-progress': { label: '진행중', tone: '', icon: '⟳' },
  pending: { label: '대기', tone: 'yellow', icon: '!' },
}

export default function HistoryPage() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const filteredTasks = useMemo(
    () => selectedFilter === 'all' ? TASKS : TASKS.filter(task => task.status === selectedFilter),
    [selectedFilter],
  )

  const stats = [
    { label: '전체 작업', value: TASKS.length, tone: '' },
    { label: '완료', value: TASKS.filter(t => t.status === 'completed').length, tone: 'green' },
    { label: '진행중', value: TASKS.filter(t => t.status === 'in-progress').length, tone: '' },
    { label: '대기', value: TASKS.filter(t => t.status === 'pending').length, tone: 'yellow' },
  ]

  return (
    <main className="workspace-page page-stack">
      <section className="stats-grid">
        {stats.map(stat => (
          <div className="glass-card stat-card" key={stat.label}>
            <small>{stat.label}</small>
            <strong className={stat.tone ? `text-${stat.tone}` : ''}>{stat.value}</strong>
          </div>
        ))}
      </section>

      <section className="glass-card panel-pad toolbar-row">
        <div className="toolbar-row__left">
          {[
            ['all', '전체'],
            ['completed', '완료'],
            ['in-progress', '진행중'],
            ['pending', '대기'],
          ].map(([id, label]) => (
            <button key={id} type="button" className={`filter-pill${selectedFilter === id ? ' active' : ''}`} onClick={() => setSelectedFilter(id)}>
              {label}
            </button>
          ))}
        </div>
        <div className="toolbar-row__right">
          <input className="search-field" placeholder="작업 검색..." />
          <button type="button" className="secondary-action">기간 선택</button>
        </div>
      </section>

      <section className="glass-card panel-pad page-stack">
        <h3>작업 목록</h3>
        <div className="item-list">
          {filteredTasks.map(task => {
            const status = STATUS[task.status]
            return (
              <article className="work-item" key={task.id}>
                <div className="work-item__icon">{status.icon}</div>
                <div>
                  <div className="work-item__top">
                    <div>
                      <h4>{task.title}</h4>
                      <p>{task.description}</p>
                    </div>
                    <div>
                      <span className={`badge-soft ${task.priority === 'high' ? 'red' : 'yellow'}`}>{task.priority === 'high' ? '높음' : '보통'}</span>{' '}
                      <span className={`badge-soft ${status.tone}`}>{status.label}</span>
                    </div>
                  </div>
                  <div className="meta-row">
                    <span>유형: {task.type}</span>
                    <span>담당자: {task.assignee}</span>
                    <span>시작일: {task.date}</span>
                    {task.completedDate && <span>완료일: {task.completedDate}</span>}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
