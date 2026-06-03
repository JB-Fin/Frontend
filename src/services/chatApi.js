// 채팅 API: AI 질문 응답, 추천 질문, 대화 기록 추천 API 함수들 정의
const MOCK_REPLIES = [
  {
    keyword: '광고',
    reply: '광고 문구 검토 시에는 과장 표현, 수익 보장처럼 보이는 문장, 투자 위험 고지 누락 여부를 우선 확인해야 합니다. 특히 "확실한 수익", "원금 보장"처럼 오해를 줄 수 있는 표현은 수정이 필요합니다.',
  },
  {
    keyword: '금융상품',
    reply: '금융상품 설명서에서는 상품 구조, 원금 손실 가능성, 수수료, 중도 해지 조건, 투자자 유의사항이 명확히 들어가야 합니다. 위험 고지가 본문과 별도 안내 영역에 모두 보이는지도 확인해 주세요.',
  },
  {
    keyword: '내부 규정',
    reply: '최근 내부 규정 기준으로 보려면 문구의 승인 절차, 필수 고지 문안, 금지 표현, 보관 의무를 함께 대조해야 합니다. 현재 문장 중 고지 문구가 약한 부분은 더 명시적으로 바꾸는 편이 좋습니다.',
  },
]

function createMockReply(message) {
  const found = MOCK_REPLIES.find(({ keyword }) => message.includes(keyword))
  if (found) return found.reply

  return '질문 내용을 기준으로 준법 리스크를 검토해보면, 표현의 명확성, 필수 고지 포함 여부, 소비자가 오해할 수 있는 단정적 문구가 핵심 확인 항목입니다. 관련 문서나 문구를 주시면 더 구체적으로 짚어드릴 수 있습니다.'
}

export const chatApi = {
  send: async (message) => {
    await new Promise(resolve => setTimeout(resolve, 250))
    return { reply: createMockReply(message) }
  },
}
