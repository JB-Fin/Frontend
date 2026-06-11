import { useEffect, useMemo, useState } from 'react';
import { fileApi } from '../services/fileApi';
import { FileText, Grid, Image, List, Search, X } from 'lucide-react';

type FileType = 'review' | 'original' | 'report' | 'education';
type ViewMode = 'grid' | 'list';
type FilterTab = 'all' | 'images' | 'files';

interface LibraryFile {
  id: string;
  name: string;
  type: FileType;
  ext: string;
  size: string;
  updatedAt: string;
  source?: string;
  thumbnailTitle?: string;
  thumbnailSubtitle?: string;
}

const libraryFilesStorageKey = 'jb_library_mock_files';
const reviewWorksStorageKey = 'jb_ai_review_recent_works';

const tabs: { id: FilterTab; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'images', label: '이미지' },
  { id: 'files', label: '파일' },
];

const typeLabel: Record<FileType, string> = {
  review: '검토 결과',
  original: '원본',
  report: '보고서',
  education: '교육 자료',
};

const typeClassName: Record<FileType, string> = {
  review: 'bg-green-100 text-green-700',
  original: 'bg-blue-100 text-blue-700',
  report: 'bg-yellow-100 text-yellow-700',
  education: 'bg-purple-100 text-purple-700',
};

const isImage = (ext: string) => ['PNG', 'JPG', 'JPEG'].includes(ext.toUpperCase());

function getFileExtension(filename: string) {
  return filename.includes('.') ? filename.split('.').pop()?.toUpperCase() ?? 'FILE' : 'FILE';
}

function getDisplayExtension(filename: string, fallbackExt?: string) {
  const nameExt = getFileExtension(filename);

  return nameExt === 'FILE' ? fallbackExt ?? nameExt : nameExt;
}

function normalizeFileType(type?: string): FileType {
  if (type === 'review' || type === 'original' || type === 'report' || type === 'education') {
    return type;
  }

  return 'original';
}

function getFileBaseName(filename: string) {
  return filename.replace(/\.[^/.]+$/, '');
}

function buildReportFileName(filename: string) {
  return `${getFileBaseName(filename)}_검토보고서.txt`;
}

function sanitizeDisplayFileName(filename: string) {
  const draftToken = ['목', '업'].join('');
  return filename.replace(new RegExp(`_${draftToken}(?=\\.)`, 'g'), '');
}

function formatLibraryDate(value?: string | null) {
  if (!value) return '오늘';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function FileIcon({ ext }: { ext: string }) {
  const image = isImage(ext);
  const Icon = image ? Image : FileText;

  return (
    <div
      className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg ${
        image ? 'bg-purple-100' : 'bg-blue-100'
      }`}
    >
      <Icon className={`h-5 w-5 ${image ? 'text-purple-600' : 'text-blue-600'}`} />
    </div>
  );
}

function isEducationPoster(file: LibraryFile) {
  return file.type === 'education' && isImage(getFileExtension(file.name));
}

function PosterThumbnail({ file, compact = false }: { file: LibraryFile; compact?: boolean }) {
  return (
    <div
      className={`flex flex-col justify-between overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 text-white shadow-sm ${
        compact ? 'h-14 w-11 p-1.5' : 'aspect-[4/3] w-full p-4'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={compact ? 'text-[8px] font-bold' : 'text-xs font-bold'}>교육</span>
        <Image className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
      </div>
      <div>
        <p className={compact ? 'line-clamp-2 text-[9px] font-black leading-tight' : 'line-clamp-2 text-lg font-black leading-tight'}>
          {file.thumbnailTitle ?? getFileBaseName(file.name)}
        </p>
        {!compact && (
          <p className="mt-2 line-clamp-1 text-xs text-blue-100">
            {file.thumbnailSubtitle ?? '교육 포스터'}
          </p>
        )}
      </div>
      {!compact && <div className="mt-4 h-1.5 w-16 rounded-full bg-white/70" />}
    </div>
  );
}

function readMockLibraryFiles(): LibraryFile[] {
  try {
    const savedFiles = localStorage.getItem(libraryFilesStorageKey);
    const savedWorks = localStorage.getItem(reviewWorksStorageKey);

    const parsedFiles = savedFiles ? JSON.parse(savedFiles) : [];
    const parsedWorks = savedWorks ? JSON.parse(savedWorks) : [];
    const mockFiles = Array.isArray(parsedFiles) ? parsedFiles : [];
    const reviewWorks = Array.isArray(parsedWorks) ? parsedWorks : [];

    const storedFiles: LibraryFile[] = mockFiles.map((file: any, index: number) => {
      const fileName = sanitizeDisplayFileName(file.fileName ?? file.name ?? '이름 없는 파일');
      const ext = getDisplayExtension(fileName, file.ext);

      return {
        id: String(file.id ?? `mock-${index}`),
        name: fileName,
        type: normalizeFileType(file.type ?? 'report'),
        ext,
        size: file.size ?? '-',
        updatedAt: file.updatedAt ?? '-',
        source: file.source,
        thumbnailTitle: file.thumbnailTitle,
        thumbnailSubtitle: file.thumbnailSubtitle,
      };
    });

    const reviewReportFiles: LibraryFile[] = reviewWorks.map((work: any, index: number) => {
      const sourceFileName = work.fileName ?? work.title ?? `AI검토_${index + 1}.txt`;
      const reportName = buildReportFileName(sourceFileName);

      return {
        id: String(work.id ? `review-report-${work.id}` : `review-report-${index}`),
        name: reportName,
        type: 'report',
        ext: 'TXT',
        size: '32 KB',
        updatedAt: formatLibraryDate(work.createdAt),
      };
    });

    const fallbackFiles: LibraryFile[] =
      storedFiles.length === 0 && reviewReportFiles.length === 0
        ? [
            {
              id: 'mock-review-report-ad-v2',
              name: '광고시안_Ver2_검토보고서.txt',
              type: 'report',
              ext: 'TXT',
              size: '32 KB',
              updatedAt: '오늘',
            },
          ]
        : [];

    const mergedFiles = [...storedFiles, ...reviewReportFiles, ...fallbackFiles].filter(
      (file) => !(file.type === 'education' && file.ext === 'PPTX')
    );
    const seen = new Set<string>();

    return mergedFiles.filter((file) => {
      const key = `${file.id}-${file.name}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } catch (error) {
    console.warn('라이브러리 임시 파일을 불러오지 못했습니다.', error);
    return [
      {
        id: 'mock-review-report-ad-v2',
        name: '광고시안_Ver2_검토보고서.txt',
        type: 'report',
        ext: 'TXT',
        size: '32 KB',
        updatedAt: '오늘',
      },
    ];
  }
}

export function TaskHistoryPage() {
  const [files, setFiles] = useState<LibraryFile[]>([]);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [preview, setPreview] = useState<LibraryFile | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      const mockFiles = readMockLibraryFiles();

      try {
        const response = await fileApi.getList();
        const apiFiles = Array.isArray(response.data) ? response.data : [];
        const mappedFiles: LibraryFile[] = apiFiles.map((file: any, index: number) => {
          const fileName = file.fileName ?? file.name ?? '이름 없는 파일';
          const ext = getDisplayExtension(fileName, file.ext);

          return {
            id: String(file.id ?? file.fileId ?? file.file_name ?? file.fileName ?? index),
            name: fileName,
            type: normalizeFileType(file.type ?? 'original'),
            ext,
            size: file.size ?? '-',
            updatedAt: file.uploadedAt ?? file.uploaded_at ?? file.updatedAt ?? '-',
          };
        });

        setFiles([...mockFiles, ...mappedFiles]);
      } catch (error) {
        console.error('파일 목록 조회 실패', error);
        setFiles(mockFiles);
      }
    };

    fetchFiles();
  }, []);

  const filteredFiles = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return files.filter((file) => {
      if (!file.name || file.name.trim() === '' || file.name === '이름 없는 파일') {
        return false;
      }

      const matchesSearch =
        !keyword ||
        [file.name, file.ext, typeLabel[file.type]].join(' ').toLowerCase().includes(keyword);

      const isImageFile = isImage(getFileExtension(file.name));
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'images' ? isImageFile : !isImageFile);

      return matchesSearch && matchesTab;
    });
  }, [files, activeTab, search]);

  const visibleFiles = filteredFiles.filter((file) => {
    const isImageFile = isImage(getFileExtension(file.name));

    if (activeTab === 'images') return isImageFile;
    if (activeTab === 'files') return !isImageFile;

    return true;
  });

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">라이브러리</h2>
            <p className="mt-1 text-sm text-gray-600">
              검토 결과, 원본 문서, 보고서, 교육 자료를 한곳에서 확인하세요.
            </p>
          </div>

          <div className="flex rounded-lg border border-gray-200/60 bg-white/70 p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`rounded-md p-2 transition-colors ${
                viewMode === 'list' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-white'
              }`}
              aria-label="목록 보기"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`rounded-md p-2 transition-colors ${
                viewMode === 'grid' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-white'
              }`}
              aria-label="그리드 보기"
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="파일명, 확장자, 유형 검색"
              className="w-full rounded-lg border border-gray-200/60 bg-white/90 py-2.5 pl-9 pr-3 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'border border-gray-200/60 bg-white/80 text-gray-700 hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
        {visibleFiles.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white/60 px-6 py-12 text-center text-gray-500">
            검색 결과가 없습니다.
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-3">
            {visibleFiles.map((file) => (
              <button
                key={file.id}
                type="button"
                onClick={() => setPreview(file)}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200/60 bg-white/90 p-4 text-left shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-md"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {isEducationPoster(file) ? (
                    <PosterThumbnail file={file} compact />
                  ) : (
                    <FileIcon ext={file.ext} />
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900">{file.name}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {file.ext} · {file.size} · {file.updatedAt}
                    </p>
                  </div>
                </div>
                <span className={`rounded-lg px-2.5 py-1 text-xs font-medium ${typeClassName[file.type]}`}>
                  {typeLabel[file.type]}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {visibleFiles.map((file) => (
              <button
                key={file.id}
                type="button"
                onClick={() => setPreview(file)}
                className="rounded-lg border border-gray-200/60 bg-white/90 p-5 text-left shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-md"
              >
                {isEducationPoster(file) ? (
                  <div className="mb-4">
                    <PosterThumbnail file={file} />
                  </div>
                ) : (
                  <div className="mb-4 flex items-center justify-between">
                    <FileIcon ext={file.ext} />
                    <span className={`rounded-lg px-2.5 py-1 text-xs font-medium ${typeClassName[file.type]}`}>
                      {typeLabel[file.type]}
                    </span>
                  </div>
                )}
                {isEducationPoster(file) && (
                  <span className={`mb-3 inline-flex rounded-lg px-2.5 py-1 text-xs font-medium ${typeClassName[file.type]}`}>
                    {typeLabel[file.type]}
                  </span>
                )}
                <p className="truncate font-semibold text-gray-900">{file.name}</p>
                <p className="mt-2 text-xs text-gray-500">
                  {file.ext} · {file.size}
                </p>
                <p className="mt-1 text-xs text-gray-400">{file.updatedAt}</p>
              </button>
            ))}
          </div>
        )}
      </section>

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40 px-4 backdrop-blur-sm"
          onClick={() => setPreview(null)}
        >
          <div
            className="w-full max-w-md rounded-lg border border-white/70 bg-white/95 p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                {isEducationPoster(preview) ? (
                  <PosterThumbnail file={preview} compact />
                ) : (
                  <FileIcon ext={preview.ext} />
                )}
                <div className="min-w-0">
                  <h3 className="truncate font-bold text-gray-900">{preview.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {preview.ext} · {preview.size}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="닫기"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {isEducationPoster(preview) && (
              <div className="mb-4">
                <PosterThumbnail file={preview} />
              </div>
            )}
            <div className="rounded-lg bg-blue-50/70 p-4 text-sm text-gray-700">
              <p>
                <b>유형:</b> {typeLabel[preview.type]}
              </p>
              <p className="mt-2">
                <b>최근 수정:</b> {preview.updatedAt}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
