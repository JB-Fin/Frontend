import { useMemo, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import {
  ClipboardList,
  Download,
  FileText,
  Image,
  Megaphone,
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

const emptyFileLabel = '선택된 파일 없음';
const libraryFilesStorageKey = 'jb_library_mock_files';

const financialConsumerProtectionChanges: LawChange[] = [
  {
    id: 1,
    title: '적합성·적정성 원칙 안내 강화',
    before: '상품 설명 시 고객의 투자성향과 거래 목적 확인 내용을 간략히 기록했습니다.',
    after:
      '금융상품 권유 전 고객의 재산상황, 거래 목적, 손실 감내 수준을 확인하고 설명 근거를 상담 기록에 남겨야 합니다.',
    reason:
      '금융소비자보호법은 소비자에게 부적합한 상품 권유를 막기 위해 사전 확인과 기록 의무를 강화합니다.',
    audience: '영업점, WM, 상품 판매 담당자',
  },
  {
    id: 2,
    title: '광고 문구의 오인 가능성 점검',
    before: '수익률, 혜택, 안전성을 강조하는 표현을 중심으로 광고 시안을 작성했습니다.',
    after:
      '확정 수익처럼 보이는 표현, 원금 보장으로 오인될 수 있는 문구, 과장된 비교 표현은 심의 전 반드시 수정해야 합니다.',
    reason:
      '불완전판매와 소비자 오인을 예방하기 위해 광고물의 중요 정보 표시와 위험 고지가 필요합니다.',
    audience: '마케팅, 상품기획, 준법감시 담당자',
  },
  {
    id: 3,
    title: '민원·분쟁 대응 절차 숙지',
    before: '민원 접수 후 담당 부서가 개별적으로 처리하고 결과를 공유했습니다.',
    after:
      '소비자 불만 접수, 조사, 회신, 재발 방지 조치까지 표준 절차에 따라 관리하고 처리 이력을 보관해야 합니다.',
    reason:
      '금융소비자 피해를 조기에 확인하고 내부통제 개선까지 이어지도록 하기 위한 관리 기준입니다.',
    audience: '고객상담, 민원 담당자, 영업 관리자',
  },
];

const posterThemes = [
  'from-blue-600 via-indigo-600 to-slate-900 text-white',
  'from-emerald-500 via-teal-600 to-slate-900 text-white',
  'from-amber-300 via-orange-500 to-rose-600 text-white',
  'from-sky-100 via-white to-indigo-100 text-gray-950',
];

function getFileBaseName(filename: string) {
  return filename.replace(/\.[^/.]+$/, '');
}

function getTodayLabel() {
  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

function saveEducationMockFiles(sourceFileName: string) {
  try {
    const savedFiles = localStorage.getItem(libraryFilesStorageKey);
    const files = savedFiles ? JSON.parse(savedFiles) : [];
    const currentFiles = Array.isArray(files) ? files : [];
    const baseName = getFileBaseName(sourceFileName || '금융소비자보호법');
    const updatedAt = getTodayLabel();
    const nextFiles = [
      {
        id: `education-poster-${baseName}`,
        name: `${baseName}_교육포스터.png`,
        fileName: `${baseName}_교육포스터.png`,
        type: 'education',
        ext: 'PNG',
        size: '1.6 MB',
        updatedAt,
        source: 'education-content',
        thumbnailTitle: '금융소비자보호법',
        thumbnailSubtitle: '소비자 보호 핵심 체크',
      },
    ];
    const nextIds = new Set([...nextFiles.map((file) => file.id), `education-ppt-${baseName}`]);

    localStorage.setItem(
      libraryFilesStorageKey,
      JSON.stringify([
        ...nextFiles,
        ...currentFiles.filter((file: any) => !nextIds.has(file.id)),
      ])
    );
  } catch (error) {
    console.warn('교육 자료 파일을 라이브러리에 저장하지 못했습니다.', error);
  }
}

function buildPosterGallery(selected: LawChange[]): PosterDraft[] {
  return selected.map((change, index) => ({
    id: change.id,
    title: change.title,
    subtitle: '금융소비자보호법 핵심 교육 포스터',
    tag: index % 2 === 0 ? '필수 안내' : '현장 체크',
    bullets: [
      change.after,
      `${change.audience} 대상 즉시 공유`,
      '상담 기록과 광고 심의 근거를 함께 보관',
    ],
    footer: 'JB금융그룹 컴플라이언스 AI',
    theme: posterThemes[index % posterThemes.length],
  }));
}

function makeEducationCopy(selected: LawChange[]) {
  if (selected.length === 0) return '업로드 후 요청하면 교육 안내 문구가 생성됩니다.';

  return [
    '[교육 안내 문구]',
    '금융소비자보호법 준수를 위해 상품 권유, 광고 심의, 민원 대응 과정에서 반드시 확인해야 할 기준을 안내합니다.',
    '',
    '핵심 메시지',
    ...selected.map((topic) => `- ${topic.title}: ${topic.after}`),
    '',
    `교육 대상: ${selected.map((topic) => topic.audience).join(', ')}`,
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
      <h4 className={`${compact ? 'mt-5 text-xl' : 'mt-8 text-3xl'} font-black leading-tight`}>
        {poster.title}
      </h4>
      <p className={`${compact ? 'mt-2 text-xs' : 'mt-3 text-sm'} opacity-80`}>
        {poster.subtitle}
      </p>
      <div className={`${compact ? 'mt-4' : 'mt-7'} space-y-2`}>
        {poster.bullets.slice(0, compact ? 2 : 3).map((bullet) => (
          <p
            key={bullet}
            className={`${compact ? 'p-2 text-xs' : 'p-3 text-sm'} rounded bg-white/18 font-medium leading-5 backdrop-blur`}
          >
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
  const [lawFileName, setLawFileName] = useState(emptyFileLabel);
  const [changes, setChanges] = useState<LawChange[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [requestText, setRequestText] = useState(
    '금융소비자보호법을 영업점 직원 교육용 안내 문구와 포스터로 정리해 주세요.'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  const selectedChanges = useMemo(
    () => changes.filter((change) => selectedIds.includes(change.id)),
    [changes, selectedIds]
  );
  const posterGallery = useMemo(() => buildPosterGallery(selectedChanges), [selectedChanges]);
  const educationCopy = useMemo(() => makeEducationCopy(selectedChanges), [selectedChanges]);

  const addLawFile = (files: FileList | File[]) => {
    const file = Array.from(files)[0];
    if (!file) return;

    setLawFileName(file.name);
    setGeneratedAt(null);
    setActiveTab('create');
  };

  const handleGenerateEducation = async () => {
    if (lawFileName === emptyFileLabel) {
      alert('먼저 금융소비자보호법 파일을 업로드해 주세요.');
      return;
    }

    try {
      setIsGenerating(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      setChanges(financialConsumerProtectionChanges);
      setSelectedIds(financialConsumerProtectionChanges.map((change) => change.id));
      saveEducationMockFiles(lawFileName);
      setGeneratedAt(getTodayLabel());
    } catch (error) {
      console.error('교육 자료 생성 실패:', error);
      alert('교육 자료 생성에 실패했습니다.');
    } finally {
      setIsGenerating(false);
    }
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
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const posterDownloadText = posterGallery
    .map((poster) =>
      [
        `[${poster.tag}] ${poster.title}`,
        poster.subtitle,
        ...poster.bullets.map((bullet) => `- ${bullet}`),
        poster.footer,
      ].join('\n')
    )
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
          onClick={() => downloadText('금융소비자보호법_교육포스터_문구.txt', posterDownloadText)}
          disabled={posterGallery.length === 0}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                  금융소비자보호법 파일을 업로드하고 요청하면 교육 안내 문구와 포스터 이미지를 생성합니다.
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
                  <p className="font-bold text-gray-900">금융소비자보호법 또는 교육 대상 법령 업로드</p>
                  <p className="mt-1 text-sm text-gray-600">현재 분석 문서: {lawFileName}</p>
                  <p className="mt-1 text-xs text-gray-500">PDF, DOCX, TXT 형식의 법령/개정안/요약 문서를 넣어주세요.</p>
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

              {changes.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 bg-white/60 px-6 py-12 text-center text-gray-500">
                  파일 업로드 후 요청하면 금융소비자보호법 교육 포인트가 표시됩니다.
                </div>
              ) : (
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
                            {checked ? '자료 반영' : '선택'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="rounded-lg bg-white/80 p-3">
                            <p className="mb-1 text-xs font-medium text-gray-500">기존</p>
                            <p className="text-gray-700">{change.before}</p>
                          </div>
                          <div className="rounded-lg bg-white/80 p-3">
                            <p className="mb-1 text-xs font-medium text-blue-600">교육 반영</p>
                            <p className="font-medium text-gray-900">{change.after}</p>
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-gray-600">{change.reason}</p>
                        <p className="mt-2 text-xs text-gray-500">권장 교육 대상: {change.audience}</p>
                      </button>
                    );
                  })}
                </div>
              )}
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
                <button
                  type="button"
                  onClick={handleGenerateEducation}
                  disabled={isGenerating}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:shadow-lg disabled:opacity-60"
                >
                  <Sparkles className="h-4 w-4" />
                  {isGenerating ? 'AI가 교육 자료 생성 중...' : '요청하기'}
                </button>

                {generatedAt && (
                  <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                    {generatedAt}에 포스터 이미지를 생성했고 라이브러리에 저장했습니다.
                  </div>
                )}

                <div className="mt-4 rounded-lg border border-gray-200/70 bg-white/90 p-4">
                  <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <FileText className="h-4 w-4 text-blue-600" />
                    교육 안내 문구
                  </p>
                  <pre className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                    {educationCopy}
                  </pre>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    downloadText(
                      '금융소비자보호법_교육_안내_문구.txt',
                      educationCopy
                    )
                  }
                  disabled={selectedChanges.length === 0}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  결과 다운로드
                </button>
              </section>

              {posterGallery[0] && (
                <section className="rounded-lg border border-white/60 bg-white/85 p-4 shadow-lg backdrop-blur-xl">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">이미지 미리보기</h3>
                    <span className="rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">PNG</span>
                  </div>
                  <PosterCard poster={posterGallery[0]} compact />
                </section>
              )}
            </aside>
          </div>
        </>
      ) : (
        <section className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">포스터 갤러리</h2>
              <p className="mt-1 text-sm text-gray-600">
                선택한 교육 포인트를 기반으로 만들어진 이미지를 갤러리 형태로 확인합니다.
              </p>
            </div>
            <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">
              {posterGallery.length}개 포스터
            </span>
          </div>

          {posterGallery.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white/60 px-6 py-12 text-center text-gray-500">
              제작하기 탭에서 파일 업로드 후 요청하면 포스터 이미지가 표시됩니다.
            </div>
          ) : (
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
                          [`[${poster.tag}] ${poster.title}`, poster.subtitle, ...poster.bullets, poster.footer].join('\n')
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
          )}
        </section>
      )}
    </div>
  );
}
