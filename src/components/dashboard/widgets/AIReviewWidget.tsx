import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, FileText, Loader2, Upload } from 'lucide-react';
import { useNotifications } from '../../../context/NotificationContext';
import { getFileBaseName } from '../../../utils/libraryFiles';

const reviewWorksStorageKey = 'jb_ai_review_recent_works';
const libraryFilesStorageKey = 'jb_library_mock_files';
const supportedExtensions = ['pdf', 'docx', 'txt'];

function getFileExtension(filename: string) {
  return filename.split('.').pop()?.toLowerCase() ?? '';
}

function getTodayLabel() {
  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

function readStoredArray(key: string) {
  try {
    const value = localStorage.getItem(key);
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveReviewResult(file: File) {
  const id = Date.now();
  const title = getFileBaseName(file.name);
  const newWork = {
    id,
    title,
    requester: '김준법',
    status: 'completed',
    issues: 1,
    createdAt: new Date().toISOString(),
    fileName: file.name,
    originalDocument: `${file.name} 원본 문서 내용입니다.`,
    revisedDocument: `${file.name} 수정 제안 문서입니다.`,
    riskSentence: 'AI 검토가 필요한 문장이 감지되었습니다.',
    riskSentences: ['AI 검토가 필요한 문장이 감지되었습니다.'],
    suggestion: '규정 문구와 고지 내용을 한 번 더 확인하세요.',
    reportUrl: null,
  };

  const works = readStoredArray(reviewWorksStorageKey);
  localStorage.setItem(reviewWorksStorageKey, JSON.stringify([newWork, ...works]));

  const files = readStoredArray(libraryFilesStorageKey);
  const reportName = `${title}_검토보고서.txt`;
  const reportFile = {
    id: `review-report-${id}`,
    name: reportName,
    fileName: reportName,
    type: 'report',
    ext: 'TXT',
    size: '32 KB',
    updatedAt: getTodayLabel(),
    source: 'ai-review',
  };
  localStorage.setItem(libraryFilesStorageKey, JSON.stringify([reportFile, ...files]));

  return newWork;
}

export function AIReviewWidget() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    setMessage('');

    if (!file) return;

    if (!supportedExtensions.includes(getFileExtension(file.name))) {
      setSelectedFile(null);
      setMessage('PDF, DOCX, TXT 파일만 업로드할 수 있습니다.');
      return;
    }

    setSelectedFile(file);
  };

  const handleRequestReview = async () => {
    if (!selectedFile || isReviewing) return;

    setIsReviewing(true);
    setMessage('');
    await new Promise((resolve) => setTimeout(resolve, 500));
    const reviewWork = saveReviewResult(selectedFile);
    addNotification({
      title: 'AI 검토 보고서 생성',
      desc: `${reviewWork.title}_검토보고서.txt가 라이브러리에 저장되었습니다.`,
      type: 'review',
    });
    setSelectedFile(null);
    setIsReviewing(false);
    setMessage('검토 요청이 완료되었습니다.');
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
          {message ? <CheckCircle2 className="h-6 w-6 text-green-600" /> : <Upload className="h-6 w-6 text-green-600" />}
        </div>

        <p className="mb-3 text-sm leading-5 text-gray-600">홈에서 업로드하고 바로 검토 요청</p>

        {selectedFile ? (
          <div className="mb-3 w-full rounded-lg border border-blue-100 bg-blue-50/70 p-3 text-left">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 shrink-0 text-blue-600" />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900">{selectedFile.name}</span>
            </div>
          </div>
        ) : null}

        {message ? <p className="mb-3 text-sm font-medium text-green-700">{message}</p> : null}

        <div className="flex w-full gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex-1 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 hover:border-blue-300 hover:bg-blue-50"
          >
            파일 선택
          </button>
          <button
            type="button"
            onClick={handleRequestReview}
            disabled={!selectedFile || isReviewing}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isReviewing && <Loader2 className="h-4 w-4 animate-spin" />}
            검토 요청
          </button>
        </div>
      </div>

      <button
        onClick={() => navigate('/review')}
        className="mt-3 w-full py-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
      >
        전체 검토 보기 →
      </button>
    </div>
  );
}
