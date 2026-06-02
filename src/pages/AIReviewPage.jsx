// AI 검토 화면 구현
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UploadBox from '../components/upload/UploadBox'
import ReviewStepBar from '../components/upload/ReviewStepBar'
import Button from '../components/common/Button'
import { fileApi } from '../services/fileApi'
import '../styles/review.css'

export default function AIReviewPage() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [language, setLanguage] = useState('한국어')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)

  const handleSubmit = async () => {
    if (!file) return
    setLoading(true)
    setStep(2)
    const { docId } = await fileApi.upload(file, language)
    setStep(3)
    setTimeout(() => navigate(`/review/${docId}`), 800)
  }

  return (
    <div className="page-inner">
      <h2 className="page-title">AI 문서 검토</h2>
      <ReviewStepBar current={step} />
      <UploadBox onFileSelect={f => { setFile(f); setStep(1) }} />
      <div style={{ marginTop: 20, marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>검토 언어 선택</div>
        <div className="lang-chips">
          {['한국어', 'English', '日本語', '中文'].map(l => (
            <button key={l} className={`lang-chip${language === l ? ' active' : ''}`} onClick={() => setLanguage(l)}>{l}</button>
          ))}
        </div>
      </div>
      <Button onClick={handleSubmit} disabled={!file || loading} style={{ width: '100%', padding: 14, fontSize: 15 }}>
        {loading ? '검토 요청 중...' : '검토 요청하기'}
      </Button>
    </div>
  )
}
