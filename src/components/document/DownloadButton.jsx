// 다운로드 버튼: 문서를 다운로드하는 버튼 컴포넌트
import { fileApi } from '../../services/fileApi'
import '../../styles/review.css'

const FILES = [
  { type: 'PDF',  color: '#E53E3E', name: '검토보고서', desc: '전체 리스크 분석 보고서', size: '245 KB' },
  { type: 'DOCX', color: '#1D5A9A', name: '수정본',      desc: '수정 제안이 반영된 문서', size: '128 KB' },
  { type: 'XLSX', color: '#2F855A', name: '비교결과',    desc: '수정 전후 항목별 비교표', size: '82 KB'  },
]

export default function DownloadButton({ docId }) {
  return (
    <div>
      {FILES.map(f => (
        <div key={f.type} className="download-item">
          <div className="download-icon" style={{ background: f.color + '18', color: f.color }}>{f.type}</div>
          <div className="download-info">
            <div className="download-name">{f.name}_{docId}.{f.type.toLowerCase()}</div>
            <div className="download-desc">{f.desc} · {f.size}</div>
          </div>
          <button className="download-btn" onClick={() => fileApi.download(docId, f.type.toLowerCase())}>다운로드</button>
        </div>
      ))}
    </div>
  )
}
