// 홈 화면 구현
import ChatBox from '../components/chat/ChatBox'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import { dummyWorks } from '../data/dummyWorks'
import { dummySchedules } from '../data/dummySchedules'
import '../styles/home.css'

export default function HomePage() {
  return (
    <div className="home-page">
      <ChatBox />

      {/* 우측 패널 */}
      <div className="right-panel">

        {/* 언어 선택 */}
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>언어 선택</div>
          <select style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, color: 'var(--text-dark)', background: 'var(--white)', outline: 'none' }}>
            {['한국어', 'English', '日本語', '中文'].map(l => <option key={l}>{l}</option>)}
          </select>
        </Card>

        {/* 최근 작업 */}
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>최근 작업</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {dummyWorks.map(w => (
              <div key={w.id}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-dark)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Badge label={w.status} color={w.statusColor} />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{w.date}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 다가오는 일정 */}
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>다가오는 일정</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {dummySchedules.map(s => (
              <div key={s.id} style={{ display: 'flex', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--light-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  📅
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-dark)' }}>{s.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                    <Badge label={s.tag} color={s.tagColor} />
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
