// 히스토리 화면 구현: 이전에 검토한 문서 목록 보여줌
import { useNavigate } from 'react-router-dom'
import { dummyWorks } from '../data/dummyWorks'
import Badge from '../components/common/Badge'
import SearchBar from '../components/common/SearchBar'
import EmptyState from '../components/common/EmptyState'
import '../styles/history.css'

export default function HistoryPage() {
  const navigate = useNavigate()

  return (
    <div className="history-page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--navy)' }}>작업 내역</h2>
        <SearchBar placeholder="문서명 검색" />
      </div>

      {dummyWorks.length === 0 ? (
        <EmptyState emoji="📂" title="검토 내역이 없습니다" desc="AI 검토 탭에서 문서를 업로드해 보세요." />
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>문서명</th>
              <th>상태</th>
              <th>리스크 수</th>
              <th>검토 일시</th>
            </tr>
          </thead>
          <tbody>
            {dummyWorks.map(w => (
              <tr key={w.id} onClick={() => navigate(`/history/${w.id}`)}>
                <td style={{ fontWeight: 500 }}>{w.name}</td>
                <td><Badge label={w.status} color={w.statusColor} /></td>
                <td style={{ color: w.riskCount > 0 ? 'var(--risk-high)' : 'var(--text-muted)', fontWeight: w.riskCount > 0 ? 700 : 400 }}>
                  {w.riskCount > 0 ? `${w.riskCount}건` : '-'}
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{w.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
