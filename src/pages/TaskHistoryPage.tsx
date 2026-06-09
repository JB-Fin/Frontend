import { useEffect, useMemo, useState } from 'react';
import { fileApi } from '../services/fileApi';
import { FileText, Grid, Image, List, Search, X } from 'lucide-react';

type FileType = 'review' | 'original' | 'report';
type ViewMode = 'grid' | 'list';
type FilterTab = 'all' | 'images' | 'files';

interface LibraryFile {
  id: string;
  name: string;
  type: FileType;
  ext: string;
  size: string;
  updatedAt: string;
}
/*
const initialFiles: LibraryFile[] = [
  { id: '1', name: '금융소비자보호법_광고심의_결과.pdf', type: 'review', ext: 'PDF', size: '2.4 MB', updatedAt: '오늘 16:20' },
  { id: '2', name: 'AML_이상징후_분석_보고서.pdf', type: 'report', ext: 'PDF', size: '1.8 MB', updatedAt: '오늘 14:05' },
  { id: '3', name: '투자설명서_원본_v2.docx', type: 'original', ext: 'DOCX', size: '890 KB', updatedAt: '어제 18:10' },
  { id: '4', name: '사내교육_현장사진.png', type: 'original', ext: 'PNG', size: '3.2 MB', updatedAt: '어제 11:35' },
  { id: '5', name: '리스크_분석_차트.jpg', type: 'report', ext: 'JPG', size: '1.1 MB', updatedAt: '06.06 09:12' },
  { id: '6', name: '내부통제_점검표.txt', type: 'review', ext: 'TXT', size: '120 KB', updatedAt: '06.05 17:42' },
];
*/
const tabs: { id: FilterTab; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'images', label: '이미지' },
  { id: 'files', label: '파일' },
];

const typeLabel: Record<FileType, string> = {
  review: '검토 결과',
  original: '원본',
  report: '보고서',
};

const typeClassName: Record<FileType, string> = {
  review: 'bg-green-100 text-green-700',
  original: 'bg-blue-100 text-blue-700',
  report: 'bg-yellow-100 text-yellow-700',
};

const isImage = (ext: string) => ['PNG', 'JPG', 'JPEG'].includes(ext.toUpperCase());

function FileIcon({ ext }: { ext: string }) {
  const image = isImage(ext);
  const Icon = image ? Image : FileText;

  return (
    <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg ${image ? 'bg-purple-100' : 'bg-blue-100'}`}>
      <Icon className={`h-5 w-5 ${image ? 'text-purple-600' : 'text-blue-600'}`} />
    </div>
  );
}

export function TaskHistoryPage() {
  const [files, setFiles] = useState<LibraryFile[]>([]);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [preview, setPreview] = useState<LibraryFile | null>(null);

useEffect(() => {
  const fetchFiles = async () => {
    try {
      const response = await fileApi.getList();

      const files = Array.isArray(response.data)
      ? response.data
      : []


      const mappedFiles = files.map((file: any, index: number) => {
        const fileName = file.fileName ?? file.name ?? '이름 없는 파일';
        const ext = fileName.split('.').pop()?.toUpperCase() ?? 'FILE';

        return {
          id: String(
            file.id ??
            file.fileId ??
            file.file_name ??
            file.fileName ??
            index
          ),
          name: fileName,
          type: file.type ?? 'original',
          ext,
          size: file.size ?? '-',
          updatedAt:
          file.uploadedAt ??
          file.uploaded_at ??
          file.updatedAt ??
          '-',
        };
      });

      setFiles(mappedFiles);
    } catch (error) {
      console.error('파일 목록 조회 실패', error);
    }
  };

  fetchFiles();
}, []);

  const filteredFiles = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return files.filter((file) => {
      const matchesSearch = !keyword || [file.name, file.ext, typeLabel[file.type]].join(' ').toLowerCase().includes(keyword);
      const matchesTab = activeTab === 'all' || (activeTab === 'images' ? isImage(file.ext) : !isImage(file.ext));
      return matchesSearch && matchesTab;
    });
  }, [activeTab, search]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">라이브러리</h2>
            <p className="mt-1 text-sm text-gray-600">검토 결과, 원본 문서, 보고서를 한곳에서 확인하세요.</p>
          </div>

          <div className="flex rounded-lg border border-gray-200/60 bg-white/70 p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`rounded-md p-2 transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-white'}`}
              aria-label="목록 보기"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`rounded-md p-2 transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-white'}`}
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
        {filteredFiles.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white/60 px-6 py-12 text-center text-gray-500">
            검색 결과가 없습니다.
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-3">
            {filteredFiles.map((file) => (
              <button
                key={file.id}
                type="button"
                onClick={() => setPreview(file)}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200/60 bg-white/90 p-4 text-left shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-md"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <FileIcon ext={file.ext} />
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
            {filteredFiles.map((file) => (
              <button
                key={file.id}
                type="button"
                onClick={() => setPreview(file)}
                className="rounded-lg border border-gray-200/60 bg-white/90 p-5 text-left shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-md"
              >
                <div className="mb-4 flex items-center justify-between">
                  <FileIcon ext={file.ext} />
                  <span className={`rounded-lg px-2.5 py-1 text-xs font-medium ${typeClassName[file.type]}`}>
                    {typeLabel[file.type]}
                  </span>
                </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40 px-4 backdrop-blur-sm" onClick={() => setPreview(null)}>
          <div className="w-full max-w-md rounded-lg border border-white/70 bg-white/95 p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <FileIcon ext={preview.ext} />
                <div className="min-w-0">
                  <h3 className="truncate font-bold text-gray-900">{preview.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {preview.ext} · {preview.size}
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setPreview(null)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" aria-label="닫기">
                <X className="h-5 w-5" />
              </button>
            </div>
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
