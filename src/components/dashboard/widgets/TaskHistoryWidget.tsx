import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Image } from 'lucide-react';
import {
  isImageExtension,
  readLibraryFiles,
  type LibraryFileItem,
} from '../../../utils/libraryFiles';

function getIcon(file: LibraryFileItem) {
  if (isImageExtension(file.ext)) return Image;
  return FileText;
}

const typeStyle = {
  review: 'bg-green-100 text-green-700',
  original: 'bg-blue-100 text-blue-700',
  report: 'bg-yellow-100 text-yellow-700',
  education: 'bg-purple-100 text-purple-700',
};

const typeLabel = {
  review: '검토 결과',
  original: '원본',
  report: '보고서',
  education: '교육 자료',
};

export function TaskHistoryWidget() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<LibraryFileItem[]>([]);

  useEffect(() => {
    setFiles(readLibraryFiles().slice(0, 4));
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-2">
        {files.map((file) => {
          const Icon = getIcon(file);

          return (
            <button
              key={file.id}
              type="button"
              onClick={() => navigate('/library')}
              className="group w-full rounded-lg border border-gray-200/50 bg-white/90 p-3 text-left transition-all hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 rounded-lg bg-blue-100 p-2">
                  <Icon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 transition-colors group-hover:text-blue-600">
                    {file.name}
                  </p>
                  <p className="mt-1 text-xs text-gray-600">
                    {file.ext} · {file.size} · {file.updatedAt}
                  </p>
                </div>
                <span className={`rounded px-2 py-1 text-xs font-medium ${typeStyle[file.type]}`}>
                  {typeLabel[file.type]}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      <button
        onClick={() => navigate('/library')}
        className="mt-4 w-full py-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
      >
        전체 보기 →
      </button>
    </div>
  );
}
