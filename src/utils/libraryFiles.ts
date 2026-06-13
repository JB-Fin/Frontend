export type LibraryFileType = 'review' | 'original' | 'report' | 'education';

export type LibraryFileItem = {
  id: string;
  name: string;
  type: LibraryFileType;
  ext: string;
  size: string;
  updatedAt: string;
  source?: string;
  thumbnailTitle?: string;
  thumbnailSubtitle?: string;
};

const libraryFilesStorageKey = 'jb_library_mock_files';
const reviewWorksStorageKey = 'jb_ai_review_recent_works';

export function getFileBaseName(filename: string) {
  return filename.replace(/\.[^/.]+$/, '');
}

export function getFileExtension(filename: string) {
  return filename.includes('.') ? filename.split('.').pop()?.toUpperCase() ?? 'FILE' : 'FILE';
}

export function isImageExtension(ext: string) {
  return ['PNG', 'JPG', 'JPEG'].includes(ext.toUpperCase());
}

function normalizeFileType(type?: string): LibraryFileType {
  if (type === 'review' || type === 'original' || type === 'report' || type === 'education') {
    return type;
  }

  return 'original';
}

function getDisplayExtension(filename: string, fallbackExt?: string) {
  const nameExt = getFileExtension(filename);

  return nameExt === 'FILE' ? fallbackExt ?? nameExt : nameExt;
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

function buildReportFileName(filename: string) {
  return `${getFileBaseName(filename)}_검토보고서.txt`;
}

function getLibraryFileKey(file: Pick<LibraryFileItem, 'name' | 'type' | 'ext'>) {
  return [file.type, file.name.trim().toLowerCase(), file.ext.toUpperCase()].join('|');
}

function uniqueLibraryFiles<T extends Pick<LibraryFileItem, 'name' | 'type' | 'ext'>>(files: T[]) {
  const seen = new Set<string>();

  return files.filter((file) => {
    const key = getLibraryFileKey(file);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function readLibraryFiles(): LibraryFileItem[] {
  try {
    const savedFiles = localStorage.getItem(libraryFilesStorageKey);
    const savedWorks = localStorage.getItem(reviewWorksStorageKey);

    const parsedFiles = savedFiles ? JSON.parse(savedFiles) : [];
    const parsedWorks = savedWorks ? JSON.parse(savedWorks) : [];
    const storedSource = Array.isArray(parsedFiles) ? parsedFiles : [];
    const reviewWorks = Array.isArray(parsedWorks) ? parsedWorks : [];

    const storedFiles: LibraryFileItem[] = storedSource.map((file: any, index: number) => {
      const fileName = sanitizeDisplayFileName(file.fileName ?? file.name ?? '이름 없는 파일');
      const ext = getDisplayExtension(fileName, file.ext);

      return {
        id: String(file.id ?? `library-${index}`),
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

    const uniqueStoredFiles = uniqueLibraryFiles(storedFiles);

    if (uniqueStoredFiles.length !== storedFiles.length) {
      localStorage.setItem(libraryFilesStorageKey, JSON.stringify(uniqueStoredFiles));
    }

    const reviewReportFiles: LibraryFileItem[] = reviewWorks.map((work: any, index: number) => {
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

    const fallbackFiles: LibraryFileItem[] =
      uniqueStoredFiles.length === 0 && reviewReportFiles.length === 0
        ? [
            {
              id: 'sample-review-report-ad-v2',
              name: '광고시안_Ver2_검토보고서.txt',
              type: 'report',
              ext: 'TXT',
              size: '32 KB',
              updatedAt: '오늘',
            },
          ]
        : [];

    const mergedFiles = [...uniqueStoredFiles, ...reviewReportFiles, ...fallbackFiles].filter(
      (file) => !(file.type === 'education' && file.ext === 'PPTX')
    );

    return uniqueLibraryFiles(mergedFiles);
  } catch (error) {
    console.warn('라이브러리 임시 파일을 불러오지 못했습니다.', error);
    return [
      {
        id: 'sample-review-report-ad-v2',
        name: '광고시안_Ver2_검토보고서.txt',
        type: 'report',
        ext: 'TXT',
        size: '32 KB',
        updatedAt: '오늘',
      },
    ];
  }
}
