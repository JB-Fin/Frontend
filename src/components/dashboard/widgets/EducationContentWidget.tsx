import { Award, FileText, GraduationCap, Video } from 'lucide-react';

const courses = [
  { title: 'AML 기초과정', progress: 75, icon: Video },
  { title: 'KYC 가이드라인', progress: 100, icon: FileText },
  { title: '내부통제 절차', progress: 30, icon: Video },
];

export function EducationContentWidget() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 p-3">
          <GraduationCap className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">교육 자료</h3>
          <p className="text-xs text-gray-600">AI 생성 학습 콘텐츠</p>
        </div>
      </div>
      <div className="flex-1 space-y-2">
        {courses.map((course) => {
          const Icon = course.icon;
          return (
            <div key={course.title} className="cursor-pointer rounded-lg border border-gray-200/50 bg-white/90 p-3 transition-all hover:shadow-md">
              <div className="mb-2 flex items-center gap-3">
                <Icon className="h-4 w-4 text-gray-600" />
                <span className="flex-1 text-sm font-medium text-gray-900">{course.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200/50">
                  <div className="h-full bg-gradient-to-r from-green-600 to-emerald-600" style={{ width: `${course.progress}%` }} />
                </div>
                <span className="text-xs text-gray-600">{course.progress}%</span>
              </div>
            </div>
          );
        })}
      </div>
      <button className="mt-3 flex w-full items-center justify-center gap-2 py-2 text-sm font-medium text-green-600 transition-colors hover:text-green-700">
        <Award className="h-4 w-4" />
        전체 교육 과정 보기
      </button>
    </div>
  );
}
