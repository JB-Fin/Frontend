import { fileApi } from '../services/fileApi';
import { useEffect, useMemo, useRef, useState } from 'react';
import { reviewApi } from '../services/reviewApi';
import type { ChangeEvent, DragEvent, MouseEvent } from 'react';
import { AlertCircle, CheckCircle2, Clock, Download, FileText, Search, Upload, X,} from 'lucide-react';

type ReviewStatus = 'completed' | 'in-progress' | 'needs-review';

type ReviewWork = {
  id: number;
  title: string;
  requester: string;
  status: ReviewStatus;
  issues: number;
  createdAt: string;
  fileName: string;
  originalDocument: string;
  revisedDocument: string;
  riskSentence: string;
  suggestion: string;
};

const supportedExtensions = ['pdf', 'docx', 'txt'];

const initialWorks: ReviewWork[] = [
  {
    id: 1,
    title: '신규 대출상품 설명서 검토',
    requester: '김준또',
    status: 'completed',
    issues: 2,
    createdAt: '2026-06-08T15:20:00',
    fileName: '신규_대출상품_설명서.pdf',
    originalDocument:
      '본 상품은 안정적인 수익을 기대할 수 있으며 원금 손실 가능성이 매우 낮습니다. 중도 해지 시 일부 수수료가 발생할 수 있습니다.',
    revisedDocument:
      '본 상품은 시장 상황에 따라 원금 손실이 발생할 수 있으며, 수익률은 보장되지 않습니다. 중도 해지 시 수수료와 불이익이 발생할 수 있습니다.',
    riskSentence: '원금 손실 가능성이 매우 낮습니다.',
    suggestion: '원금 손실 가능성을 축소해 표현하지 말고 투자 위험과 수익률 비보장 문구를 명확히 병기하세요.',
  },
  {
    id: 2,
    title: 'AML 정책 업데이트 검토',
    requester: '박정민',
    status: 'in-progress',
    issues: 0,
    createdAt: '2026-06-08T13:10:00',
    fileName: 'AML_정책_업데이트.docx',
    originalDocument:
      '고위험 고객에 대한 모니터링 기준을 개정하고 이상거래 탐지 시 내부 보고 절차를 강화합니다.',
    revisedDocument:
      '고위험 고객에 대한 모니터링 기준을 개정하고 이상거래 탐지 시 내부 보고 절차를 강화합니다.',
    riskSentence: '검토가 진행 중입니다.',
    suggestion: 'AI 검토가 완료되면 위험 문장과 수정 제안이 표시됩니다.',
  },
  {
    id: 3,
    title: '내부통제 점검표 검토',
    requester: '이서연',
    status: 'needs-review',
    issues: 3,
    createdAt: '2026-06-07T17:45:00',
    fileName: '내부통제_점검표.txt',
    originalDocument:
      '담당자는 월 1회 자체 점검을 실시할 수 있습니다. 필요 시 점검 결과를 보고합니다.',
    revisedDocument:
      '담당자는 월 1회 자체 점검을 실시해야 합니다. 점검 결과는 정해진 기한 내 책임자에게 보고해야 합니다.',
    riskSentence: '자체 점검을 실시할 수 있습니다.',
    suggestion: '필수 내부통제 절차는 선택 표현 대신 의무 표현으로 수정하는 것이 적절합니다.',
  },
];

const statusConfig = {
  completed: {
    label: '완료',
    icon: CheckCircle2,
    className: 'bg-green-100 text-green-700',
  },
  'in-progress': {
    label: '검토 중',
    icon: Clock,
    className: 'bg-blue-100 text-blue-700',
  },
  'needs-review': {
    label: '확인 필요',
    icon: AlertCircle,
    className: 'bg-yellow-100 text-yellow-700',
  },
} satisfies Record<ReviewStatus, { label: string; icon: typeof CheckCircle2; className: string }>;

function formatDate(value?: string | null) {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function isSupportedFile(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return extension ? supportedExtensions.includes(extension) : false;
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function highlightSentence(text: string, sentence: string) {
  if (!sentence || !text.includes(sentence)) return text;
  const [before, after] = text.split(sentence);
  return (
    <>
      {before}
      <mark className="rounded bg-yellow-200 px-1 text-yellow-950">{sentence}</mark>
      {after}
    </>
  );
}

export function AIReviewPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [works, setWorks] = useState<ReviewWork[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [selectedWork, setSelectedWork] = useState<ReviewWork | null>(null);

  useEffect(() => {
  const fetchReviews = async () => {
    try {
      const data = await reviewApi.getList();

      console.log('리뷰 목록 응답', data);

      setWorks(data.items ?? []);
    } catch (error) {
      console.error(error);
    }
  };

  fetchReviews();
}, []);

  const sortedWorks = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return works
      .filter((work) => {
        if (!keyword) return true;
        return [work.title, work.requester, work.fileName, statusConfig[work.status].label]
          .join(' ')
          .toLowerCase()
          .includes(keyword);
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [searchTerm, works]);

  const addFiles = async (files: FileList | File[]) => {
  const selectedFiles = Array.from(files);
  if (selectedFiles.length === 0) return;

  const validFiles = selectedFiles.filter(isSupportedFile);
  if (validFiles.length === 0) {
    setUploadError('PDF, DOCX, TXT 파일만 업로드할 수 있습니다.');
    return;
  }

  setUploadError('');

  /*
  // 프론트 Mock 업로드 처리
  const now = Date.now();
  const newWorks = validFiles.map((file, index) => ({
    id: now + index,
    title: file.name.replace(/\.[^/.]+$/, ''),

    requester: '김준또',
    status: 'in-progress' as const,
    issues: 0,
    createdAt: new Date(now + index).toISOString(),
    fileName: file.name,
    originalDocument: `${file.name} 원본 문서 내용 미리보기입니다. 업로드된 문서의 본문이 이 영역에 표시됩니다.`,
    revisedDocument: 'AI 검토가 완료되면 수정본 문서가 이 영역에 표시됩니다.',
    riskSentence: '검토가 진행 중입니다.',
    suggestion: 'AI 검토가 완료되면 수정 제안이 표시됩니다.',
  }));

  setWorks((current) => [...newWorks, ...current]);
  */

  // 실제 백엔드 업로드 연동
  try {
    const uploadedWorks = await Promise.all(
      validFiles.map(async (file, index) => {
        const response = await fileApi.upload(file);
        const uploadedFile = response.file ?? response.data ?? response;

        const reviewResponse = await reviewApi.postReview({
          file_id: uploadedFile.file_id ?? uploadedFile.id,
          language: 'ko',
          regulation_scope: 'internal_external',
        });

        console.log('심의 실행 응답', reviewResponse);
        console.log('파일 업로드 응답', response);

        return {
          id: Number(uploadedFile.id ?? Date.now() + index),
          title: file.name.replace(/\.[^/.]+$/, ''),
          requester: '김준또',
          status: 'in-progress' as const,
          issues: 0,
          createdAt: uploadedFile.uploadedAt ?? new Date().toISOString(),
          fileName: uploadedFile.fileName ?? file.name,
          originalDocument: `${file.name} 업로드가 완료되었습니다.`,
          revisedDocument: 'AI 검토가 완료되면 수정본 문서가 이 영역에 표시됩니다.',
          riskSentence: '검토가 진행 중입니다.',
          suggestion: 'AI 검토가 완료되면 수정 제안이 표시됩니다.',
        };
      })
    );

    setWorks((current) => [...uploadedWorks, ...current]);
  } catch (error) {
    console.error('파일 업로드 실패', error);
    setUploadError('파일 업로드 중 오류가 발생했습니다.');
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
    addFiles(event.dataTransfer.files);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) addFiles(event.target.files);
    event.target.value = '';
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/60 bg-white/85 p-8 shadow-lg backdrop-blur-xl">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`rounded-lg border-2 border-dashed p-12 text-center transition-all ${
            dragActive ? 'border-blue-500 bg-blue-50/70' : 'border-gray-300 bg-white/50 hover:border-blue-400 hover:bg-blue-50/30'
          }`}
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
            <Upload className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">문서 AI 검토</h3>
          <p className="mb-6 text-gray-600">검토할 문서를 끌어다 놓거나 파일을 선택해 업로드하세요.</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-medium text-white transition-all hover:shadow-lg"
          >
            파일 선택
          </button>
          <p className="mt-4 text-sm text-gray-500">지원 형식: PDF, DOCX, TXT</p>
          {uploadError && <p className="mt-3 text-sm font-medium text-red-600">{uploadError}</p>}
        </div>
      </section>

      <section className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">최근 검토</h3>
            <p className="mt-1 text-sm text-gray-600">카드를 클릭하면 작업 상세를 확인할 수 있습니다.</p>
          </div>
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="제목, 요청자, 파일명 검색"
              className="w-full rounded-lg border border-gray-200/60 bg-white/90 py-2.5 pl-9 pr-3 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        {sortedWorks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white/60 px-6 py-12 text-center text-gray-500">
            검색 결과가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {sortedWorks.map((work) => (
              <ReviewWorkCard key={work.id} work={work} onSelect={setSelectedWork} />
            ))}
          </div>
        )}
      </section>

      {selectedWork && <ReviewDetailModal work={selectedWork} onClose={() => setSelectedWork(null)} />}
    </div>
  );
}

function ReviewWorkCard({ work, onSelect }: { work: ReviewWork; onSelect: (work: ReviewWork) => void }) {
  const status = statusConfig[work.status];
  const StatusIcon = status.icon;

  const downloadOriginal = (event: MouseEvent) => {
    event.stopPropagation();
    downloadTextFile(`${work.fileName}-원본.txt`, work.originalDocument);
  };

  const downloadRevised = (event: MouseEvent) => {
    event.stopPropagation();
    downloadTextFile(`${work.fileName}-수정본.txt`, work.revisedDocument);
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onSelect(work)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onSelect(work);
      }}
      className="rounded-lg border border-gray-200/60 bg-white/90 p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
    >
      <div className="mb-4 flex items-start gap-3">
        <div className="rounded-lg bg-blue-100 p-3">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-bold text-gray-900">{work.title}</h4>
          <p className="mt-1 text-xs text-gray-500">{work.fileName}</p>
        </div>
        <span className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium ${status.className}`}>
          <StatusIcon className="h-3.5 w-3.5" />
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">요청자</p>
          <p className="mt-1 font-semibold text-gray-900">{work.requester}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">일시</p>
          <p className="mt-1 font-semibold text-gray-900">{formatDate(work.createdAt)}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">이슈</p>
          <p className="mt-1 font-semibold text-gray-900">{work.issues}건</p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={downloadOriginal}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200/70 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Download className="h-4 w-4" />
          원본 다운로드
        </button>
        <button
          type="button"
          onClick={downloadRevised}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-sm font-medium text-white hover:shadow-md"
        >
          <Download className="h-4 w-4" />
          수정본 다운로드
        </button>
      </div>
    </article>
  );
}

function ReviewDetailModal({ work, onClose }: { work: ReviewWork; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40 px-6 py-8 backdrop-blur-sm" onClick={onClose}>
      <div className="max-h-full w-full max-w-6xl overflow-y-auto rounded-lg border border-white/70 bg-white/95 p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{work.title}</h3>
            <p className="mt-1 text-sm text-gray-600">
              {work.requester} · {formatDate(work.createdAt)} · 이슈 {work.issues}건
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" aria-label="닫기">
            <X className="h-5 w-5" />
          </button>
        </div>

        <section className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50/80 p-5">
          <h4 className="mb-3 flex items-center gap-2 font-bold text-yellow-900">
            <AlertCircle className="h-5 w-5" />
            AI 검토 결과
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-white/80 p-4">
              <p className="mb-2 text-sm font-semibold text-gray-900">위험문장 하이라이트</p>
              <p className="text-sm leading-7 text-gray-700">{highlightSentence(work.originalDocument, work.riskSentence)}</p>
            </div>
            <div className="rounded-lg bg-white/80 p-4">
              <p className="mb-2 text-sm font-semibold text-gray-900">수정 제안</p>
              <p className="text-sm leading-7 text-gray-700">{work.suggestion}</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-5">
          <DocumentPanel
            title="원본 문서"
            content={work.originalDocument}
            onDownload={() => downloadTextFile(`${work.fileName}-원본.txt`, work.originalDocument)}
          />
          <DocumentPanel
            title="수정본"
            content={work.revisedDocument}
            onDownload={() => downloadTextFile(`${work.fileName}-수정본.txt`, work.revisedDocument)}
            revised
          />
        </div>
      </div>
    </div>
  );
}

function DocumentPanel({ title, content, onDownload, revised = false }: { title: string; content: string; onDownload: () => void; revised?: boolean }) {
  return (
    <section className="rounded-lg border border-gray-200/70 bg-white/90 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-bold text-gray-900">{title}</h4>
        <button
          type="button"
          onClick={onDownload}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
            revised ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Download className="h-4 w-4" />
          다운로드
        </button>
      </div>
      <div className="min-h-72 rounded-lg bg-gray-50 p-4 text-sm leading-7 text-gray-700">{content}</div>
    </section>
  );
}
