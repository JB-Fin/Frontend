// 추천 질문 컴포넌트
import '../../styles/home.css'

export default function SuggestionChips({ suggestions, onSelect }) {
  return (
    <div className="suggestions">
      <span className="suggestions__label">추천 질문</span>
      {suggestions.map((s, i) => (
        <button key={i} className="suggestion-chip" onClick={() => onSelect(s)}>{s}</button>
      ))}
    </div>
  )
}
