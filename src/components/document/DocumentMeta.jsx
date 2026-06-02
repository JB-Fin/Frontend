// 문서의 메타 정보를 표시하는 컴포넌트
export function DocumentMeta({ fileName, reviewedAt, docId }) {
  return (
    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, marginBottom: 24 }}>
      {fileName} · 문서 ID: {docId} · 검토 완료 {reviewedAt}
    </p>
  )
}
