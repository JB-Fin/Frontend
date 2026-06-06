import '../styles/pages.css'

const COURSES = [
  { id: 1, title: 'AML 기초 과정', category: '자금세탁방지', duration: '2시간 30분', modules: 8, progress: 75, enrolled: 124, rating: 4.8, thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400' },
  { id: 2, title: 'KYC 가이드라인', category: '고객확인', duration: '1시간 45분', modules: 5, progress: 100, enrolled: 98, rating: 4.9, thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400' },
  { id: 3, title: '내부통제 절차', category: '내부통제', duration: '3시간 15분', modules: 12, progress: 30, enrolled: 156, rating: 4.7, thumbnail: 'https://images.unsplash.com/photo-1551135049-8a33b5883817?w=400' },
  { id: 4, title: '금융소비자보호법', category: '법규', duration: '2시간', modules: 6, progress: 0, enrolled: 87, rating: 4.6, thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400' },
]

const ACTIVITY = [
  { title: 'AML 기초과정 - 모듈 6 완료', time: '1시간 전' },
  { title: 'KYC 가이드라인 수료', time: '2일 전' },
  { title: '내부통제 절차 - 모듈 3 진행중', time: '3일 전' },
]

export default function EducationContentPage() {
  return (
    <main className="workspace-page page-stack">
      <header className="page-head">
        <div>
          <h2>교육 자료 제작</h2>
          <p>AI 생성 컴플라이언스 교육 콘텐츠와 학습 현황을 관리합니다.</p>
        </div>
        <button type="button" className="primary-action">새 교육 콘텐츠 생성</button>
      </header>

      <section className="stats-grid">
        <Stat label="수강중인 과정" value="3개" />
        <Stat label="완료한 과정" value="12개" />
        <Stat label="총 학습 시간" value="48시간" />
        <Stat label="평균 진도율" value="68%" />
      </section>

      <section className="split-grid">
        <div className="glass-card panel-pad page-stack">
          <div className="toolbar-row">
            <h3>교육 과정</h3>
            <div className="toolbar-row__right">
              <button type="button" className="filter-pill active">전체</button>
              <button type="button" className="filter-pill">진행중</button>
              <button type="button" className="filter-pill">완료</button>
            </div>
          </div>
          {COURSES.map(course => (
            <article className="course-card" key={course.id}>
              <img src={course.thumbnail} alt={course.title} />
              <div>
                <div className="work-item__top">
                  <div>
                    <h4>{course.title}</h4>
                    <p>{course.category}</p>
                  </div>
                  <span className="badge-soft yellow">★ {course.rating}</span>
                </div>
                <div className="meta-row">
                  <span>{course.duration}</span>
                  <span>{course.modules}개 모듈</span>
                  <span>{course.enrolled}명 수강중</span>
                </div>
                <div className="progress-track" style={{ marginTop: 12 }}>
                  <span className="progress-fill" style={{ width: `${course.progress}%` }} />
                </div>
                <div className="meta-row"><span>진도율 {course.progress}%</span></div>
              </div>
            </article>
          ))}
        </div>

        <aside className="page-stack">
          <section className="glass-card panel-pad">
            <h3>최근 활동</h3>
            <div className="item-list">
              {ACTIVITY.map(item => (
                <div className="calendar-event" key={item.title}>
                  <h4>{item.title}</h4>
                  <p>{item.time}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="glass-card panel-pad">
            <h3>빠른 실행</h3>
            <div className="item-list">
              <button type="button" className="primary-action">AI 교육 자료 생성</button>
              <button type="button" className="secondary-action">학습 통계 보기</button>
              <button type="button" className="secondary-action">수료증 관리</button>
            </div>
          </section>
        </aside>
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
