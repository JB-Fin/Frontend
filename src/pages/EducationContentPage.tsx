import { useMemo, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import {
  ClipboardList,
  Download,
  FileText,
  Image,
  Megaphone,
  Presentation,
  Sparkles,
  Upload,
} from 'lucide-react';

type LawChange = {
  id: number;
  title: string;
  before: string;
  after: string;
  reason: string;
  audience: string;
};

type PosterDraft = {
  id: number;
  title: string;
  subtitle: string;
  tag: string;
  bullets: string[];
  footer: string;
  theme: string;
};

type PageTab = 'create' | 'gallery';
type OutputMode = 'ppt' | 'copy';

const defaultChanges: LawChange[] = [
  {
    id: 1,
    title: '원금 보장 오인 표현 금지',
    before: '안정적인 수익과 원금 보호를 기대할 수 있습니다.',
    after: '시장 상황에 따라 원금 손실이 발생할 수 있으며 수익률은 보장되지 않습니다.',
    reason: '상품 안내에서 원금 보장으로 오인될 수 있는 표현을 명확히 제한합니다.',
    audience: '상품기획, 영업점, 마케팅 담당자',
  },
  {
    id: 2,
    title: '고위험 고객 기록 보존 강화',
    before: '필요 시 모니터링 결과를 내부 시스템에 기록합니다.',
    after: '고위험 고객 모니터링 결과는 필수 항목으로 기록하고 5년간 보존해야 합니다.',
    reason: 'AML 점검 시 사후 증빙 가능성을 높이기 위한 기록 관리 기준입니다.',
    audience: '준법감시, AML, 고객확인 담당자',
  },
  {
    id: 3,
    title: '민원 보고 기한 명확화',
    before: '민원 발생 시 관련 부서에 신속히 공유합니다.',
    after: '불완전판매 관련 민원은 접수 후 1영업일 이내 준법감시부서에 보고해야 합니다.',
    reason: '초기 대응 지연으로 인한 소비자 피해 확대를 방지하기 위한 절차입니다.',
    audience: '영업점, 고객상담, 민원 담당자',
  },
];

const posterThemes = [
  'from-blue-600 via-indigo-600 to-slate-900 text-white',
  'from-emerald-500 via-teal-600 to-slate-900 text-white',
  'from-amber-300 via-orange-500 to-rose-600 text-white',
  'from-sky-100 via-white to-indigo-100 text-gray-950',
];

function buildPosterGallery(selected: LawChange[]): PosterDraft[] {
  const targets = selected.length > 0 ? selected : defaultChanges.slice(0, 2);

  return targets.map((change, index) => ({
    id: change.id,
    title: change.title,
    subtitle: '개정 법안 핵심 교육 포스터',
    tag: index % 2 === 0 ? '필수 안내' : '현장 체크',
    bullets: [
      change.after,
      `${change.audience} 대상 즉시 공유`,
      '고객 안내 문구와 내부 절차를 함께 점검',
    ],
    footer: 'JB금융그룹 준법자문',
    theme: posterThemes[index % posterThemes.length],
  }));
}

function makePptOutline(selected: LawChange[], request: string) {
  const topics = selected.length > 0 ? selected : defaultChanges.slice(0, 2);

  return [
    '1. 교육 목적',
    request || '새 법안의 주요 변경사항과 현장 적용 기준을 빠르게 공유합니다.',
    '',
    '2. 핵심 변경사항',
    ...topics.map((topic, index) => `${index + 1}) ${topic.title} - ${topic.reason}`),
    '',
    '3. 현장 적용 체크포인트',
    ...topics.map((topic) => `- ${topic.audience}: ${topic.after}`),
    '',
    '4. 교육 진행 제안',
    '- 포스터로 핵심 문구 우선 공지',
    '- 담당 부서별 질의 취합',
    '- 교육 이수 여부와 관련 문서 최신화 확인',
  ].join('\n');
}

function makeEducationCopy(selected: LawChange[]) {
  const topics = selected.length > 0 ? selected : defaultChanges.slice(0, 2);
  const primary = topics[0];

  return [
    `이번 교육은 "${primary.title}" 내용을 중심으로 진행하면 좋겠습니다.`,
    '',
    '주요 안내 문구',
    ...topics.map((topic) => `- ${topic.title}: ${topic.after}`),
    '',
    `교육 대상: ${topics.map((topic) => topic.audience).join(', ')}`,
  ].join('\n');
}

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function PosterCard({ poster, compact = false }: { poster: PosterDraft; compact?: boolean }) {
  return (
    <article
      className={`flex aspect-[4/5] flex-col rounded-lg bg-gradient-to-br p-4 shadow-sm ${
        compact ? 'min-h-[220px]' : 'min-h-[360px]'
      } ${poster.theme}`}
    >
      <div className="flex items-center justify-between gap-2 text-xs font-bold">
        <span>{poster.tag}</span>
        <Megaphone className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
      </div>
      <h4 className={`${compact ? 'mt-5 text-xl' : 'mt-8 text-3xl'} font-black leading-tight`}>{poster.title}</h4>
      <p className={`${compact ? 'mt-2 text-xs' : 'mt-3 text-sm'} opacity-80`}>{poster.subtitle}</p>
      <div className={`${compact ? 'mt-4' : 'mt-7'} space-y-2`}>
        {poster.bullets.slice(0, compact ? 2 : 3).map((bullet) => (
          <p key={bullet} className={`${compact ? 'p-2 text-xs' : 'p-3 text-sm'} rounded bg-white/18 font-medium leading-5 backdrop-blur`}>
            {bullet}
          </p>
        ))}
      </div>
      <p className={`${compact ? 'pt-3 text-xs' : 'pt-4 text-sm'} mt-auto border-t border-white/25 font-semibold opacity-85`}>
        {poster.footer}
      </p>
    </article>
  );
}

export function EducationContentPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeTab, setActiveTab] = useState<PageTab>('create');
  const [dragActive, setDragActive] = useState(false);
  const [lawFileName, setLawFileName] = useState('금융소비자보호법_개정안_요약.pdf');
  const [changes, setChanges] = useState<LawChange[]>(defaultChanges);
  const [selectedIds, setSelectedIds] = useState<number[]>([1, 2]);
  const [requestText, setRequestText] = useState('이번 개정안에서 영업점 직원에게 꼭 교육하면 좋을 내용을 정리해 주세요.');
  const [outputMode, setOutputMode] = useState<OutputMode>('ppt');

  const selectedChanges = useMemo(
    () => changes.filter((change) => selectedIds.includes(change.id)),
    [changes, selectedIds],
  );
  const posterGallery = useMemo(() => buildPosterGallery(selectedChanges), [selectedChanges]);
  const pptOutline = useMemo(() => makePptOutline(selectedChanges, requestText), [requestText, selectedChanges]);
  const educationCopy = useMemo(() => makeEducationCopy(selectedChanges), [selectedChanges]);

  const addLawFile = (files: FileList | File[]) => {
    const file = Array.from(files)[0];
    if (!file) return;

    setLawFileName(file.name);
    const newChange: LawChange = {
      id: Date.now(),
      title: '신규 법안 안내 의무 추가',
      before: '고객 안내 사항은 상품 설명 단계에서 안내합니다.',
      after: '고객 안내 사항은 가입 전 핵심설명서와 상담 기록에 모두 남겨야 합니다.',
      reason: `${file.name}에서 확인된 고객 고지 및 증빙 강화 항목입니다.`,
      audience: '영업점, 상품 담당자, 준법자문가',
    };
    setChanges((current) => [newChange, ...current]);
    setSelectedIds((current) => [newChange.id, ...current]);
    setActiveTab('create');
  };

  const handleDrag = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(event.type === 'dragenter' || event.type === 'dragover');
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    addLawFile(event.dataTransfer.files);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) addLawFile(event.target.files);
    event.target.value = '';
  };

  const toggleChange = (id: number) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const posterDownloadText = posterGallery
    .map((poster) => [
      `[${poster.tag}] ${poster.title}`,
      poster.subtitle,
      ...poster.bullets.map((bullet) => `- ${bullet}`),
      poster.footer,
    ].join('\n'))
    .join('\n\n');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-lg border border-white/70 bg-white/80 p-1 shadow-sm backdrop-blur">
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            제작하기
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === 'gallery'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            <Image className="h-4 w-4" />
            포스터 갤러리
          </button>
        </div>
        <button
          type="button"
          onClick={() => downloadText('교육_포스터_갤러리_문구.txt', posterDownloadText)}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <Download className="h-4 w-4" />
          포스터 문구 다운로드
        </button>
      </div>

      {activeTab === 'create' ? (
        <>
          <section className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">교육 자료 제작</h2>
                <p className="mt-1 text-sm text-gray-600">
                  새 법안을 업로드하고, 준법자문가가 교육하면 좋겠다고 판단한 내용을 포스터와 요청 자료로 정리합니다.
                </p>
              </div>
              <span className="rounded-lg bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700">
                준법자문가 시나리오
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={handleFileChange}
            />
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`rounded-lg border-2 border-dashed p-8 transition-all ${
                dragActive
                  ? 'border-blue-500 bg-blue-50/80'
                  : 'border-gray-300 bg-white/60 hover:border-blue-400 hover:bg-blue-50/40'
              }`}
            >
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-gray-900">새로운 법안 또는 개정안 업로드</p>
                  <p className="mt-1 text-sm text-gray-600">현재 분석 문서: {lawFileName}</p>
                  <p className="mt-1 text-xs text-gray-500">PDF, DOCX, TXT 형식의 법안/개정안 요약 문서를 넣어주세요.</p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-medium text-white hover:shadow-lg"
                >
                  파일 선택
                </button>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-5 gap-6">
            <section className="col-span-3 rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">준법자문가 검토 포인트</h3>
              </div>
              <div className="space-y-3">
                {changes.map((change) => {
                  const checked = selectedIds.includes(change.id);

                  return (
                    <button
                      key={change.id}
                      type="button"
                      onClick={() => toggleChange(change.id)}
                      className={`w-full rounded-lg border p-4 text-left transition-all ${
                        checked
                          ? 'border-blue-300 bg-blue-50/80 shadow-sm'
                          : 'border-gray-200/70 bg-white/80 hover:border-blue-200 hover:bg-blue-50/40'
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="font-semibold text-gray-900">{change.title}</p>
                        <span className={`rounded px-2 py-1 text-xs font-medium ${checked ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                          {checked ? '포스터 반영' : '선택'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-lg bg-white/80 p-3">
                          <p className="mb-1 text-xs font-medium text-gray-500">기존</p>
                          <p className="text-gray-700">{change.before}</p>
                        </div>
                        <div className="rounded-lg bg-white/80 p-3">
                          <p className="mb-1 text-xs font-medium text-blue-600">변경</p>
                          <p className="font-medium text-gray-900">{change.after}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-gray-600">{change.reason}</p>
                      <p className="mt-2 text-xs text-gray-500">권장 교육 대상: {change.audience}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            <aside className="col-span-2 space-y-6">
              <section className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900">요청하기</h3>
                </div>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">요청 내용</span>
                  <textarea
                    value={requestText}
                    onChange={(event) => setRequestText(event.target.value)}
                    className="min-h-24 w-full rounded-lg border border-gray-200/70 bg-white/90 p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </label>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOutputMode('ppt')}
                    className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium ${
                      outputMode === 'ppt'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : 'border border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    <Presentation className="h-4 w-4" />
                    PPT 개요
                  </button>
                  <button
                    type="button"
                    onClick={() => setOutputMode('copy')}
                    className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium ${
                      outputMode === 'copy'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : 'border border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    교육 문구
                  </button>
                </div>

                <div className="mt-4 rounded-lg border border-gray-200/70 bg-white/90 p-4">
                  <p className="mb-2 text-sm font-semibold text-gray-900">
                    {outputMode === 'ppt' ? '교육 담당자 제공용 PPT 개요' : '교육 안내 문구'}
                  </p>
                  <pre className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                    {outputMode === 'copy' ? educationCopy : pptOutline}
                  </pre>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    downloadText(
                      outputMode === 'copy' ? '교육_안내_문구.txt' : '교육_PPT_개요.txt',
                      outputMode === 'copy' ? educationCopy : pptOutline,
                    )
                  }
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Download className="h-4 w-4" />
                  결과 다운로드
                </button>
              </section>
            </aside>
          </div>
        </>
      ) : (
        <section className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">포스터 갤러리</h2>
              <p className="mt-1 text-sm text-gray-600">
                선택된 교육 포인트를 기반으로 만들어진 포스터를 갤러리 형태로 확인합니다.
              </p>
            </div>
            <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">
              {posterGallery.length}개 포스터
            </span>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {posterGallery.map((poster) => (
              <div key={poster.id} className="rounded-lg border border-gray-200/70 bg-white p-3 shadow-sm">
                <PosterCard poster={poster} />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">{poster.title}</p>
                    <p className="text-xs text-gray-500">{poster.tag}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      downloadText(
                        `${poster.title}_포스터_문구.txt`,
                        [`[${poster.tag}] ${poster.title}`, poster.subtitle, ...poster.bullets, poster.footer].join('\n'),
                      )
                    }
                    className="flex shrink-0 items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Download className="h-3.5 w-3.5" />
                    다운로드
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
