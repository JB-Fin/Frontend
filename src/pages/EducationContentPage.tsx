import { Award, BookOpen, Clock, FileText, GraduationCap, Play, Plus, TrendingUp, Video } from 'lucide-react';

const courses = [
  { id: 1, title: 'AML 기초 과정', category: '자금세탁방지', type: 'video', duration: '2시간 30분', modules: 8, progress: 75, enrolled: 124, rating: 4.8, thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400' },
  { id: 2, title: 'KYC 가이드라인', category: '고객확인', type: 'document', duration: '1시간 45분', modules: 5, progress: 100, enrolled: 98, rating: 4.9, thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400' },
  { id: 3, title: '내부통제 절차', category: '내부통제', type: 'video', duration: '3시간 15분', modules: 12, progress: 30, enrolled: 156, rating: 4.7, thumbnail: 'https://images.unsplash.com/photo-1551135049-8a33b5883817?w=400' },
];

const stats = [
  { label: '수강중인 과정', value: '3개', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: '완료한 과정', value: '12개', icon: Award, color: 'text-green-600', bg: 'bg-green-50' },
  { label: '총 학습 시간', value: '48시간', icon: Video, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: '평균 진도율', value: '68%', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
];

export function EducationContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">교육 자료 제작</h2>
          <p className="text-gray-600">AI 생성 컴플라이언스 교육 콘텐츠</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 font-medium text-white transition-all hover:shadow-lg">
          <Plus className="h-5 w-5" />새 교육 콘텐츠 생성
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
          <div key={stat.label} className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
            <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-lg ${stat.bg}`}><Icon className={`h-6 w-6 ${stat.color}`} /></div>
            <p className="mb-1 text-sm text-gray-600">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        )})}
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">교육 과정</h3>
            <div className="flex gap-2">
              {['전체', '진행중', '완료'].map((label, index) => (
                <button key={label} className={`rounded-lg px-4 py-2 text-sm font-medium ${index === 0 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'border border-gray-200/50 bg-white/80 text-gray-700 hover:bg-white/90'}`}>{label}</button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="group cursor-pointer rounded-lg border border-gray-200/50 bg-white/90 p-4 transition-all hover:shadow-md">
                <div className="flex gap-4">
                  <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg">
                    <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white"><Play className="ml-0.5 h-5 w-5 text-blue-600" /></div>
                    </div>
                    <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">{course.type === 'video' ? <Video className="mr-1 inline h-3 w-3" /> : <FileText className="mr-1 inline h-3 w-3" />}{course.type === 'video' ? 'Video' : 'Doc'}</div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-start justify-between">
                      <div><h4 className="font-bold text-gray-900 transition-colors group-hover:text-green-600">{course.title}</h4><p className="mt-1 text-sm text-gray-600">{course.category}</p></div>
                      <div className="flex items-center gap-1"><Award className="h-4 w-4 text-yellow-500" /><span className="text-sm font-medium">{course.rating}</span></div>
                    </div>
                    <div className="mb-3 flex items-center gap-3 text-sm text-gray-600"><span>{course.duration}</span><span>{course.modules}개 모듈</span><span>{course.enrolled}명 수강중</span></div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm"><span className="text-gray-600">진도율</span><b>{course.progress}%</b></div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200/50"><div className="h-full bg-gradient-to-r from-green-600 to-emerald-600" style={{ width: `${course.progress}%` }} /></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900"><Clock className="h-5 w-5 text-gray-600" />최근 활동</h3>
            {['AML 기초과정 - 모듈 6 완료', 'KYC 가이드라인 수료', '내부통제 절차 - 모듈 3 진행중'].map((item, index) => (
              <div key={item} className="border-b border-gray-200/50 py-3 last:border-0"><p className="text-sm font-medium text-gray-900">{item}</p><p className="text-xs text-gray-500">{index + 1}시간 전</p></div>
            ))}
          </div>
          <div className="rounded-lg border border-white/60 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
            <h3 className="mb-4 font-bold text-gray-900">빠른 실행</h3>
            <button className="mb-2 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2.5 text-sm font-medium text-white"><GraduationCap className="h-4 w-4" />AI 교육 자료 생성</button>
            <button className="mb-2 w-full rounded-lg border border-gray-200/50 bg-white/90 px-4 py-2.5 text-sm font-medium text-gray-800">학습 통계 보기</button>
            <button className="w-full rounded-lg border border-gray-200/50 bg-white/90 px-4 py-2.5 text-sm font-medium text-gray-800">수료증 관리</button>
          </div>
        </div>
      </div>
    </div>
  );
}
