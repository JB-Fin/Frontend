import '../../styles/home.css'

export default function SuggestionChips({ suggestions, onSelect }) {
  return (
    <div className="suggestions">
      <span className="suggestions__label">추천 질문</span>
      {suggestions.map((suggestion, index) => (
        <button
          type="button"
          key={`${suggestion}-${index}`}
          className="suggestion-chip"
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </button>
      ))}
    </div>
  )
}
