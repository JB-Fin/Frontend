// 공통 카드 -> 문서를 카드 형태로 감싸서 보여주는 컴포넌트 구현
export default function Card({ children, style }) {
  return (
    <div style={{
      background: 'var(--white)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: '14px 16px',
      boxShadow: 'var(--shadow-sm)',
      ...style,
    }}>
      {children}
    </div>
  )
}
