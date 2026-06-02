// 업로드 박스 컴포넌트(드래그 앤 드롭 또는 선택할 수 있도록 UI 구성)
import { useState } from 'react'
import '../../styles/review.css'

export default function UploadBox({ onFileSelect }) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)

  const pick = (f) => { setFile(f); onFileSelect?.(f) }

  return (
    <div
      className={`dropzone${dragging ? ' dragging' : ''}`}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files[0]) }}
      onClick={() => document.getElementById('upload-input').click()}
    >
      <input id="upload-input" type="file" accept=".pdf,.docx,.pptx" style={{ display: 'none' }} onChange={e => pick(e.target.files[0])} />
      <div className="dropzone__emoji">📄</div>
      {file ? (
        <>
          <div className="dropzone__title">{file.name}</div>
          <div className="dropzone__hint">{(file.size / 1024).toFixed(0)} KB · 다른 파일을 선택하려면 다시 클릭</div>
        </>
      ) : (
        <>
          <div className="dropzone__title">파일을 드래그하거나 클릭해서 선택</div>
          <div className="dropzone__hint">PDF, DOCX, PPTX · 최대 50MB</div>
        </>
      )}
    </div>
  )
}
