import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, GraduationCap, Loader2 } from 'lucide-react';

export function EducationContentWidget() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) setSelectedFile(file);
  };

  const handleGenerate = async () => {
    if (!selectedFile || isGenerating) return;

    setIsGenerating(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    navigate('/education-content', {
      state: {
        source: 'home-widget',
        fileName: selectedFile.name,
      },
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
          <GraduationCap className="h-6 w-6 text-blue-600" />
        </div>

        <p className="mb-3 text-sm leading-5 text-gray-600">홈에서 업로드하고 바로 제작 요청</p>

        {selectedFile ? (
          <div className="mb-3 w-full rounded-lg border border-blue-100 bg-blue-50/70 p-3 text-left">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 shrink-0 text-blue-600" />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900">
                {selectedFile.name}
              </span>
            </div>
          </div>
        ) : null}

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
            onClick={handleGenerate}
            disabled={!selectedFile || isGenerating}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
            제작 요청
          </button>
        </div>
      </div>

      <button
        onClick={() => navigate('/education-content')}
        className="mt-3 w-full py-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
      >
        교육 자료 제작 열기 →
      </button>
    </div>
  );
}
