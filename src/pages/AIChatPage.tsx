import { useState } from 'react';
import { Bot, MessageSquare, Send, TrendingUp, User } from 'lucide-react';

type ChatMessage = {
  id: number;
  type: 'ai' | 'user';
  text: string;
  timestamp: string;
};

const suggestedQuestions = [
  '최근 금융소비자보호법 개정 내용은?',
  '신규 대출 상품 출시 전 컴플라이언스 체크리스트',
  'AML 정기 평가 필수 항목',
  '내부통제 시스템 운영 가이드라인',
];

const recentTopics = [
  { title: 'AML 규정', count: 12 },
  { title: 'KYC 절차', count: 8 },
  { title: '내부통제', count: 6 },
];

export function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'ai',
      text: '안녕하세요. JB금융그룹 컴플라이언스 AI 어시스턴트입니다. 규정, 법령, 내부 정책에 대해 무엇이든 물어보세요.',
      timestamp: '14:30',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const timestamp = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { id: Date.now(), type: 'user', text: input, timestamp }]);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'ai',
          text: '관련 규정과 내부 문서를 검색하고 있습니다.\n\n검토 결과 예시는 다음과 같습니다.\n\n1. 금융상품 판매 전 적합성 원칙 준수\n2. 고객 정보 보호 의무 확인\n3. 불완전판매 방지 조치 점검\n\n자세한 내용은 관련 규정 문서를 확인해 주세요.',
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1000);
  };

  return (
    <div className="flex h-[calc(100vh-150px)] gap-6">
      <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-white/60 bg-white/85 shadow-lg backdrop-blur-xl">
        <div className="border-b border-gray-200/50 bg-white/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">AI 어시스턴트</h2>
              <p className="text-xs text-gray-600">컴플라이언스 전문 AI</p>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-4 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${message.type === 'ai' ? 'bg-gradient-to-br from-blue-600 to-indigo-600' : 'bg-gradient-to-br from-gray-600 to-gray-700'}`}>
                {message.type === 'ai' ? <Bot className="h-5 w-5 text-white" /> : <User className="h-5 w-5 text-white" />}
              </div>
              <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                <div className="mb-1 flex items-center gap-2">
                  <span className={`text-sm font-medium text-gray-900 ${message.type === 'user' ? 'ml-auto' : ''}`}>{message.type === 'ai' ? 'AI 어시스턴트' : '김준또'}</span>
                  <span className="text-xs text-gray-500">{message.timestamp}</span>
                </div>
                <div className={`inline-block max-w-2xl rounded-lg px-5 py-3 ${message.type === 'ai' ? 'border border-gray-200/50 bg-white/90 text-gray-800' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'}`}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {messages.length === 1 && (
          <div className="px-6 pb-4">
            <p className="mb-3 text-sm font-medium text-gray-600">추천 질문</p>
            <div className="grid grid-cols-2 gap-2">
              {suggestedQuestions.map((question) => (
                <button key={question} onClick={() => setInput(question)} className="rounded-lg border border-blue-200/50 bg-blue-50/80 px-4 py-3 text-left text-sm text-blue-700 transition-colors hover:bg-blue-100/80">
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="border-t border-gray-200/50 bg-white/60 px-6 py-4">
          <div className="flex gap-3">
            <input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && handleSend()} placeholder="컴플라이언스 관련 질문을 입력하세요..." className="flex-1 rounded-lg border border-gray-200/50 bg-white/90 px-5 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            <button onClick={handleSend} disabled={!input.trim()} className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50">
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="w-80 space-y-4">
        <div className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            오늘의 활동
          </h3>
          <div className="space-y-3">
            {[
              ['총 질문 수', '24', 'text-gray-900'],
              ['평균 응답 시간', '1.2초', 'text-blue-600'],
              ['만족도', '95%', 'text-green-600'],
            ].map(([label, value, color]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{label}</span>
                <span className={`text-lg font-bold ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
            <MessageSquare className="h-5 w-5 text-indigo-600" />
            자주 묻는 주제
          </h3>
          <div className="space-y-2">
            {recentTopics.map((topic) => (
              <div key={topic.title} className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200/50 bg-white/90 p-3 transition-all hover:shadow-md">
                <span className="text-sm text-gray-900">{topic.title}</span>
                <span className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">{topic.count}건</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
