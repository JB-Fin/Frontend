// 상태 배지: 상태를 나타낼 라벨 컴포넌트 구현
export default function Badge({ label, color = '#1D5A9A' }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700,
      color: color,
      background: color + '18',
      borderRadius: 20,
      padding: '2px 10px',
      display: 'inline-block',
    }}>
      {label}
    </span>
  )
}
