import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, GraduationCap, Image } from 'lucide-react';
import { readLibraryFiles, type LibraryFileItem } from '../../../utils/libraryFiles';

function getIcon(file: LibraryFileItem) {
  if (file.ext === 'PNG' || file.ext === 'JPG' || file.ext === 'JPEG') return Image;
  return FileText;
}

export function EducationContentWidget() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<LibraryFileItem[]>([]);

  useEffect(() => {
    setFiles(readLibraryFiles().filter((file) => file.type === 'education').slice(0, 3));
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 p-3">
          <GraduationCap className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">교육 자료 제작</h3>
          <p className="text-xs text-gray-600">라이브러리에 저장된 교육 자료</p>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-2">
        {files.length === 0 ? (
          <button
            type="button"
            onClick={() => navigate('/education-content')}
            className="w-full rounded-lg border border-dashed border-gray-300 bg-white/70 px-4 py-8 text-center text-sm text-gray-500 hover:border-green-300 hover:bg-green-50/60"
          >
            교육 자료를 생성하면 여기에 표시됩니다.
          </button>
        ) : (
          files.map((file) => {
            const Icon = getIcon(file);

            return (
              <button
                key={file.id}
                type="button"
                onClick={() => navigate('/library')}
                className="w-full rounded-lg border border-gray-200/50 bg-white/90 p-3 text-left transition-all hover:border-green-200 hover:shadow-md"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Icon className="h-4 w-4 text-green-600" />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900">
                    {file.name}
                  </span>
                </div>
                <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                  {file.ext} · {file.size}
                </span>
              </button>
            );
          })
        )}
      </div>

      <button
        onClick={() => navigate('/education-content')}
        className="mt-3 flex w-full items-center justify-center gap-2 py-2 text-sm font-medium text-green-600 transition-colors hover:text-green-700"
      >
        <GraduationCap className="h-4 w-4" />
        교육 자료 제작 열기
      </button>
    </div>
  );
}
