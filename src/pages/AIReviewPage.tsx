import { fileApi } from '../services/fileApi';
import { useEffect, useMemo, useRef, useState } from 'react';
import { reviewApi } from '../services/reviewApi';
import { useNotifications } from '../context/NotificationContext';
import type { ChangeEvent, DragEvent, MouseEvent } from 'react';
import { AlertCircle, CheckCircle2, Clock, Download, FileText, Loader2, Search, Upload, X } from 'lucide-react';

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
  riskSentences?: string[];
  suggestion: string;
  reportUrl?: string | null; // 보고서 다운로드 URL (백에서 내려줄 경우)
};

const supportedExtensions = ['pdf', 'docx', 'txt'];
const reviewWorksStorageKey = 'jb_ai_review_recent_works';
const libraryFilesStorageKey = 'jb_library_mock_files';

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
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
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

function getFileBaseName(filename: string) {
  return filename.replace(/\.[^/.]+$/, '');
}

function buildDerivedFileName(filename: string, suffix: string, extension = 'txt') {
  return `${getFileBaseName(filename)}_${suffix}.${extension}`;
}

function getTodayLabel() {
  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

function getReviewWorkKey(work: ReviewWork, index: number) {
  return [
    work.id,
    work.createdAt,
    work.fileName,
    work.title,
    index,
  ].join('|');
}

function saveReportMockFile(work: ReviewWork) {
  try {
    const savedFiles = localStorage.getItem(libraryFilesStorageKey);
    const files = savedFiles ? JSON.parse(savedFiles) : [];
    const currentFiles = Array.isArray(files) ? files : [];
    const reportName = buildDerivedFileName(work.fileName, '검토보고서');
    const nextFile = {
      id: `review-report-${work.id}`,
      name: reportName,
      fileName: reportName,
      type: 'report',
      ext: 'TXT',
      size: '32 KB',
      updatedAt: getTodayLabel(),
      source: 'ai-review',
    };

    localStorage.setItem(
      libraryFilesStorageKey,
      JSON.stringify([
        nextFile,
        ...currentFiles.filter((file: any) => file.id !== nextFile.id),
      ])
    );
  } catch (error) {
    console.warn('라이브러리 임시 보고서 파일을 저장하지 못했습니다.', error);
  }
}

/**
 * 보고서 다운로드
 * - reportUrl이 있으면 fetch → blob → 다운로드
 * - 없으면 원본/수정/제안 텍스트로 자체 보고서 생성
 */
async function downloadReport(work: ReviewWork) {
  if (work.reportUrl) {
    try {
      const res = await fetch(work.reportUrl);
      const contentType = res.headers.get('content-type') ?? '';
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      // Content-Type에 따라 확장자 결정
      const ext = contentType.includes('pdf')
        ? 'pdf'
        : contentType.includes('word') || contentType.includes('openxml')
        ? 'docx'
        : 'txt';
      anchor.download = buildDerivedFileName(work.fileName, '검토보고서', ext);
      anchor.click();
      URL.revokeObjectURL(url);
      return;
    } catch (error) {
      console.error('보고서 URL 다운로드 실패, 텍스트 보고서로 대체합니다.', error);
    }
  }

  // fallback: 텍스트 보고서 자동 생성
  const lines = [
    `■ AI 검토 보고서`,
    ``,
    `제목: ${work.title}`,
    `파일명: ${work.fileName}`,
    `요청자: ${work.requester}`,
    `검토 일시: ${formatDate(work.createdAt)}`,
    `이슈 건수: ${work.issues}건`,
    ``,
    `─────────────────────────────────────`,
    `[위험 문장]`,
    work.riskSentence,
    ``,
    `[수정 제안 근거]`,
    work.suggestion,
    ``,
    `─────────────────────────────────────`,
    `[원본 문서]`,
    work.originalDocument,
    ``,
    `─────────────────────────────────────`,
    `[수정본]`,
    work.revisedDocument,
  ];

  downloadTextFile(buildDerivedFileName(work.fileName, '검토보고서'), lines.join('\n'));
}

function formatNumberedSentences(text: string) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]*\n+[ \t]*/g, '\n')
    .replace(/(?!^)\s+(\d+\.\s+)/g, '\n$1')
    .trim();
}

function highlightSentence(text: string, sentences: string | string[]) {
  const displayText = formatNumberedSentences(text);
  const targets = (Array.isArray(sentences) ? sentences : [sentences])
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  if (targets.length === 0) return displayText;

  const ranges: Array<{ start: number; end: number; text: string }> = [];

  targets.forEach((target) => {
    let searchFrom = 0;

    while (searchFrom < displayText.length) {
      const start = displayText.indexOf(target, searchFrom);
      if (start === -1) break;

      const end = start + target.length;
      const overlaps = ranges.some((range) => start < range.end && end > range.start);

      if (!overlaps) {
        ranges.push({ start, end, text: target });
      }

      searchFrom = end;
    }
  });

  if (ranges.length === 0) return text;

  ranges.sort((a, b) => a.start - b.start);

  const parts = [];
  let cursor = 0;

  ranges.forEach((range, index) => {
    if (cursor < range.start) {
      parts.push(displayText.slice(cursor, range.start));
    }

    parts.push(
      <mark
        key={`${range.start}-${range.end}-${index}`}
        className="rounded bg-yellow-200 px-1 text-yellow-950"
      >
        {range.text}
      </mark>
    );

    cursor = range.end;
  });

  if (cursor < displayText.length) {
    parts.push(displayText.slice(cursor));
  }

  return (
    <>
      {parts}
    </>
  );
}

export function AIReviewPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { addNotification } = useNotifications();

  const [dragActive, setDragActive] = useState(false);
  const [works, setWorks] = useState<ReviewWork[]>(() => {
    try {
      const savedWorks = localStorage.getItem(reviewWorksStorageKey);
      if (!savedWorks) return [];

      const parsedWorks = JSON.parse(savedWorks);
      return Array.isArray(parsedWorks) ? parsedWorks : [];
    } catch (error) {
      console.warn('최근 검토 내역을 불러오지 못했습니다.', error);
      return [];
    }
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [selectedWork, setSelectedWork] = useState<ReviewWork | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    fileId: number;
    fileName: string;
  } | null>(null);

  const sortedWorks = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return works
      .filter((work) => {
        if (!keyword) return true;
        return [
          work.title ?? '',
          work.requester ?? '',
          work.fileName ?? '',
          statusConfig[work.status]?.label ?? '검토 중',
        ]
          .join(' ')
          .toLowerCase()
          .includes(keyword);
      })
      .sort((a, b) => {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
      });
  }, [searchTerm, works]);

  useEffect(() => {
    try {
      localStorage.setItem(reviewWorksStorageKey, JSON.stringify(works));
    } catch (error) {
      console.warn('최근 검토 내역을 저장하지 못했습니다.', error);
    }
  }, [works]);

  const handleDeleteReview = (reviewId: number) => {
  const confirmed = window.confirm('이 검토 내역을 삭제하시겠습니까?');

  if (!confirmed) return;

  setWorks((current) => current.filter((work) => work.id !== reviewId));

  if (selectedWork?.id === reviewId) {
    setSelectedWork(null);
  }
};

  const addFiles = async (files: FileList | File[]) => {
    const selectedFiles = Array.from(files);
    if (selectedFiles.length === 0) return;

    const file = selectedFiles[0];

    if (!isSupportedFile(file)) {
      setUploadError('PDF, DOCX, TXT 파일만 업로드할 수 있습니다.');
      return;
    }

    setUploadError('');

    try {
      const response = await fileApi.upload(file);
      const uploadedFileData = response.file ?? response.data ?? response;
      const fileId =
        uploadedFileData.file_id ?? uploadedFileData.id ?? uploadedFileData.fileId;

      if (!fileId) {
        setUploadError('파일 업로드는 완료됐지만 file_id를 받지 못했습니다.');
        return;
      }

      setUploadedFile({ fileId: Number(fileId), fileName: file.name });
      console.log('파일 업로드 완료', uploadedFileData);
    } catch (error) {
      console.error('파일 업로드 실패', error);
      setUploadError('파일 업로드 중 오류가 발생했습니다.');
    }
  };

  const handleRequestReview = async () => {
    if (isReviewing) return;

    if (!uploadedFile) {
      setUploadError('먼저 파일을 업로드해 주세요.');
      return;
    }

    setUploadError('');
    setIsReviewing(true);

    try {
      // 1. 검토 요청
      const analyzeResponse = await reviewApi.postReview({
        file_id: uploadedFile.fileId,
        language: 'ko',
        regulation_scope: 'internal_external',
      });

      console.log('검토 요청 응답', analyzeResponse);

      const reviewId = analyzeResponse.review_id;
      if (!reviewId) throw new Error('review_id를 받지 못했습니다.');

      // 2. 검토 완료 폴링
      let reviewResponse = analyzeResponse;
      for (let i = 0; i < 10; i += 1) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        reviewResponse = await reviewApi.getReview(reviewId);
        console.log(`검토 결과 조회 ${i + 1}회차`, reviewResponse);
        if (reviewResponse.status === 'completed') break;
      }

      for (let i = 0; i < 10; i += 1) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        reviewResponse = await reviewApi.getReview(reviewId);
        console.log(`검토 결과 조회 ${i + 1}회차`, reviewResponse);
        if (reviewResponse.status === 'completed') break;
        
        // 추가: 실패 상태면 즉시 중단
      if (reviewResponse.status === 'failed') {
        setUploadError('문서 분석에 실패했습니다. 파일을 확인하거나 다시 시도해 주세요.');
        return;
      }
    }
    if (reviewResponse.status === 'failed') {
      setUploadError('서버에서 문서 분석에 실패했습니다. 파일 형식이나 내용을 확인해 주세요.');
      return;
    }
    if (reviewResponse.status !== 'completed') {
      setUploadError('분석 시간이 초과됐습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }



      // 3. 보고서 URL 조회 (백에서 지원하는 경우)
      let reportUrl: string | null = null;
      try {
        // reviewApi.getReport가 구현돼 있으면 호출, 없으면 무시
        if (typeof (reviewApi as any).getReport === 'function') {
          const reportResponse = await (reviewApi as any).getReport(reviewId);
          reportUrl =
            reportResponse?.report_url ??
            reportResponse?.file_url ??
            reportResponse?.url ??
            null;
          console.log('보고서 URL', reportUrl);
        }
      } catch (reportError) {
        // 보고서 API 미구현 또는 오류 시 텍스트 fallback 사용
        console.warn('보고서 URL 조회 실패 (텍스트 보고서로 대체됩니다)', reportError);
      }

      const highlights = reviewResponse.highlights ?? [];
      const firstHighlight = highlights[0] ?? {};
      const riskSentences = highlights
        .map((item: any) => item.original_text ?? item.highlight_text ?? '')
        .filter((sentence: string) => sentence.trim().length > 0);

      const originalText = highlights
        .map((item: any, index: number) => `${index + 1}. ${item.original_text ?? item.highlight_text ?? ''}`)
        .join('\n\n');

      const revisedText = highlights
        .map((item: any, index: number) => `${index + 1}. ${item.suggested_text ?? '수정 제안 없음'}`)
        .join('\n\n');

      const suggestionText = highlights
        .map(
          (item: any, index: number) =>
            `${index + 1}. ${item.reason ?? item.revision_reason ?? item.issue_summary ?? '검토 사유 없음'}`
        )
        .join('\n\n');

      const newWork: ReviewWork = {
        id: Number(reviewResponse.review_id ?? Date.now()),
        title: getFileBaseName(uploadedFile.fileName),
        requester: '김준또',
        status: 'completed',
        issues: Number(reviewResponse.summary?.total_issues ?? highlights.length ?? 0),
        createdAt: reviewResponse.created_at ?? new Date().toISOString(),
        fileName: uploadedFile.fileName,
        originalDocument: originalText || '원본 문서 내용이 없습니다.',
        revisedDocument: revisedText || '수정본 문서 내용이 없습니다.',
        riskSentence:
          riskSentences.join('\n\n') ||
          (firstHighlight.original_text ?? firstHighlight.highlight_text ?? '위험 문장이 없습니다.'),
        riskSentences,
        suggestion: suggestionText || '수정 제안이 없습니다.',
        reportUrl, // 보고서 URL (없으면 null → 텍스트 보고서 fallback)
      };

      setWorks((current) => [newWork, ...current]);
      saveReportMockFile(newWork);
      addNotification({
        title: 'AI 검토 보고서 생성',
        desc: `${buildDerivedFileName(uploadedFile.fileName, '검토보고서')}가 라이브러리에 저장되었습니다.`,
        type: 'review',
      });
      setUploadedFile(null);
    } catch (error) {
      console.error('검토 요청 실패', error);
      setUploadError('검토 요청 중 오류가 발생했습니다.');
    } finally {
      setIsReviewing(false);
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
            dragActive
              ? 'border-blue-500 bg-blue-50/70'
              : 'border-gray-300 bg-white/50 hover:border-blue-400 hover:bg-blue-50/30'
          }`}
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
            <Upload className="h-10 w-10 text-blue-600" />
          </div>

          <h3 className="mb-2 text-xl font-bold text-gray-900">문서 AI 검토</h3>
          <p className="mb-6 text-gray-600">
            검토할 문서를 끌어다 놓거나 파일을 선택해 업로드하세요.
          </p>

          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-medium text-white transition-all hover:shadow-lg"
            >
              파일 선택
            </button>

            {uploadedFile && (
              <div className="mt-6 w-full max-w-md rounded-xl border border-green-200 bg-green-50 p-4 text-left shadow-sm">
                <p className="text-sm font-semibold text-green-800">업로드 완료</p>
                <p className="mt-1 truncate text-sm text-green-700">📄 {uploadedFile.fileName}</p>
                <button
                  type="button"
                  onClick={handleRequestReview}
                  disabled={isReviewing}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 font-medium text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isReviewing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      검토가 진행 중입니다...
                    </>
                  ) : (
                    '검토 요청'
                  )}
                </button>
              </div>
            )}
          </div>

          <p className="mt-4 text-sm text-gray-500">지원 형식: PDF, DOCX, TXT</p>
          {uploadError && (
            <p className="mt-3 text-sm font-medium text-red-600">{uploadError}</p>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">최근 검토</h3>
            <p className="mt-1 text-sm text-gray-600">
              카드를 클릭하면 작업 상세를 확인할 수 있습니다.
            </p>
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
            {sortedWorks.map((work, index) => (
              <ReviewWorkCard
              key={getReviewWorkKey(work, index)}
              work={work}
              onSelect={setSelectedWork}
              onDelete={handleDeleteReview}
              />
            ))}
          </div>
        )}
      </section>

      {selectedWork && (
        <ReviewDetailModal work={selectedWork} onClose={() => setSelectedWork(null)} />
      )}
    </div>
  );
}

function ReviewWorkCard({
  work,
  onSelect,
  onDelete,
}: {
  work: ReviewWork;
  onSelect: (work: ReviewWork) => void;
  onDelete: (id: number) => void;
}) {
  const status = statusConfig[work.status] ?? statusConfig['in-progress'];
  const StatusIcon = status.icon;

  const handleDownloadOriginal = (event: MouseEvent) => {
    event.stopPropagation();
    downloadTextFile(buildDerivedFileName(work.fileName, '원본'), work.originalDocument);
  };

  const handleDownloadRevised = (event: MouseEvent) => {
    event.stopPropagation();
    downloadTextFile(buildDerivedFileName(work.fileName, '수정본'), work.revisedDocument);
  };

  const handleDownloadReport = (event: MouseEvent) => {
    event.stopPropagation();
    downloadReport(work);
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
        <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(work.id);
        }}
        className="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
        >
          삭제
          </button>
        <span
          className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium ${status.className}`}
        >
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

      {/* 다운로드 버튼 행 */}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={handleDownloadOriginal}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200/70 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Download className="h-4 w-4" />
          원본
        </button>
        <button
          type="button"
          onClick={handleDownloadRevised}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-sm font-medium text-white hover:shadow-md"
        >
          <Download className="h-4 w-4" />
          수정본
        </button>
        {/* 보고서 다운로드 — 항상 표시, reportUrl 없으면 텍스트 보고서로 대체 */}
        <button
          type="button"
          onClick={handleDownloadReport}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-2 text-sm font-medium text-white hover:shadow-md"
        >
          <Download className="h-4 w-4" />
          보고서
        </button>
      </div>
    </article>
  );
}

function ReviewDetailModal({ work, onClose }: { work: ReviewWork; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40 px-6 py-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-full w-full max-w-6xl overflow-y-auto rounded-lg border border-white/70 bg-white/95 p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{work.title}</h3>
            <p className="mt-1 text-sm text-gray-600">
              {work.requester} · {formatDate(work.createdAt)} · 이슈 {work.issues}건
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* 보고서 다운로드 버튼 — 모달 우상단 */}
            <button
              type="button"
              onClick={() => downloadReport(work)}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-medium text-white hover:shadow-md"
            >
              <Download className="h-4 w-4" />
              보고서 다운로드
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              aria-label="닫기"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* AI 검토 결과 */}
        <section className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50/80 p-5">
          <h4 className="mb-3 flex items-center gap-2 font-bold text-yellow-900">
            <AlertCircle className="h-5 w-5" />
            AI 검토 결과
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-white/80 p-4">
              <p className="mb-2 text-sm font-semibold text-gray-900">위험문장 하이라이트</p>
              <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                {highlightSentence(
                  work.originalDocument,
                  work.riskSentences?.length ? work.riskSentences : work.riskSentence
                )}
              </p>
            </div>
            <div className="rounded-lg bg-white/80 p-4">
              <p className="mb-2 text-sm font-semibold text-gray-900">수정 제안 근거</p>
              <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                {formatNumberedSentences(work.suggestion)}
              </p>
            </div>
          </div>
        </section>

        {/* 원본 / 수정본 패널 */}
        <div className="grid grid-cols-2 gap-5">
          <DocumentPanel
            title="원본 문서"
            content={work.originalDocument}
            onDownload={() => downloadTextFile(buildDerivedFileName(work.fileName, '원본'), work.originalDocument)}
          />
          <DocumentPanel
            title="수정본"
            content={work.revisedDocument}
            onDownload={() => downloadTextFile(buildDerivedFileName(work.fileName, '수정본'), work.revisedDocument)}
            revised
          />
        </div>
      </div>
    </div>
  );
}

function DocumentPanel({
  title,
  content,
  onDownload,
  revised = false,
}: {
  title: string;
  content: string;
  onDownload: () => void;
  revised?: boolean;
}) {
  return (
    <section className="rounded-lg border border-gray-200/70 bg-white/90 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-bold text-gray-900">{title}</h4>
        <button
          type="button"
          onClick={onDownload}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
            revised
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
              : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Download className="h-4 w-4" />
          다운로드
        </button>
      </div>
      <div className="min-h-72 whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm leading-7 text-gray-700">
        {formatNumberedSentences(content)}
      </div>
    </section>
  );
}
