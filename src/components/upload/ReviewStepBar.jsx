// 검토 단계 바: 문서 업로드부터 AI 검토 완료까지의 진행 단계 보여주는 컴포넌트
import '../../styles/review.css'

const STEPS = ['파일 업로드', '언어 선택', '검토 요청', '결과 확인']

export default function ReviewStepBar({ current = 0 }) {
  return (
    <div className="step-bar">
      {STEPS.map((label, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
          <div className="step-item">
            <div className={`step-dot${i < current ? ' done' : i === current ? ' current' : ''}`}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className={`step-label${i === current ? ' current' : ''}`}>{label}</span>
          </div>
          {i < STEPS.length - 1 && <div className={`step-line${i < current ? ' done' : ''}`} style={{ flex: 1 }} />}
        </div>
      ))}
    </div>
  )
}
