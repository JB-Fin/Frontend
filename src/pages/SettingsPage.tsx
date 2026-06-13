import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, Globe, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { languageApi } from '../services/languageApi';


type SettingsTab = 'profile' | 'language';

const tabs = [
  { id: 'profile', label: '프로필', icon: User },
  { id: 'language', label: '언어 및 지역', icon: Globe },
] satisfies { id: SettingsTab; label: string; icon: typeof User }[];

const isSettingsTab = (value: string | null): value is SettingsTab => tabs.some((tab) => tab.id === value);

export function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<SettingsTab>(() => {
    const tab = searchParams.get('tab');
    return isSettingsTab(tab) ? tab : 'profile';
  });

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (isSettingsTab(tab)) setActiveTab(tab);
  }, [searchParams]);

  const handleSelectTab = (tab: SettingsTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="min-h-[calc(100vh-128px)]">
      <div className="grid min-h-0 grid-cols-[220px_minmax(0,1fr)] gap-4 max-xl:grid-cols-1">
        <aside className="self-start rounded-lg border border-white/60 bg-white/85 p-3 shadow-lg backdrop-blur-xl">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-white/80'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="min-h-0">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'language' && <LanguageSettings />}
        </section>
      </div>
    </div>
  );
}

function ProfileSettings() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_280px] gap-4 max-xl:grid-cols-1">
      <div className="rounded-lg border border-white/60 bg-white/85 p-5 shadow-lg backdrop-blur-xl">
        <h3 className="mb-5 text-xl font-bold text-gray-900">프로필</h3>
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600">
            <User className="h-10 w-10 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">김준법</p>
            <p className="mt-1 text-sm text-gray-500">법무팀 · 책임매니저</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
          {[
            ['이름', '김준법', 'text'],
            ['이메일', 'junbeop@jbgroup.com', 'email'],
            ['부서', '법무팀', 'text'],
            ['직책', '책임매니저', 'text'],
          ].map(([label, value, type]) => (
            <label key={label} className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">{label}</span>
              <input type={type} defaultValue={value} className="w-full rounded-lg border border-gray-200/50 bg-white/90 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            </label>
          ))}
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" className="rounded-lg border border-gray-200/50 bg-white px-5 py-2.5 font-medium text-gray-700 transition-all hover:bg-gray-50">
            취소
          </button>
          <button type="button" className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 font-medium text-white transition-all hover:shadow-lg">
            저장
          </button>
        </div>
      </div>

      <aside className="self-start rounded-lg border border-blue-100 bg-white/85 p-5 shadow-lg backdrop-blur-xl">
        <div className="mb-4 flex items-center gap-2 text-blue-700">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-semibold">계정 요약</span>
        </div>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-gray-500">소속</dt>
            <dd className="mt-1 font-semibold text-gray-900">준법감시부 법무팀</dd>
          </div>
          <div>
            <dt className="text-gray-500">권한</dt>
            <dd className="mt-1 font-semibold text-gray-900">법무 검토 권한</dd>
          </div>
          <div>
            <dt className="text-gray-500">상태</dt>
            <dd className="mt-1 font-semibold text-gray-900">활성</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}

function LanguageSettings() {
  const { currentLanguage, languages, setLanguage } = useLanguage();
  const currentLanguageLabel = languages.find((language) => language.code === currentLanguage)?.label ?? '한국어';

  const handleLanguageChange = async (lang: string) => {
    try {
      await languageApi.updateSettings(lang);

      console.log('언어 변경 성공');

      setLanguage(lang as typeof currentLanguage);
    } catch (error) {
      console.error('언어 변경 실패', error);
    }
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_280px] gap-4 max-xl:grid-cols-1">
      <div className="rounded-lg border border-white/60 bg-white/85 p-5 shadow-lg backdrop-blur-xl">
        <h3 className="mb-5 text-xl font-bold text-gray-900">언어 및 지역</h3>
        <div className="grid gap-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">언어</span>
            <select
              value={currentLanguage}
              onChange={(event) => handleLanguageChange(event.target.value)}
              className="w-full rounded-lg border border-gray-200/50 bg-white/90 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {languages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.label}
                </option>
              ))}
            </select>
          </label>

          {[
            ['시간대', ['(GMT+9:00) 서울, 도쿄', '(GMT+7:00) 하노이, 프놈펜', '(GMT+6:30) 양곤']],
            ['날짜 형식', ['YYYY.MM.DD', 'MM/DD/YYYY', 'DD/MM/YYYY']],
          ].map(([label, options]) => (
            <label key={label as string} className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">{label as string}</span>
              <select className="w-full rounded-lg border border-gray-200/50 bg-white/90 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                {(options as string[]).map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          ))}
        </div>
      </div>

      <aside className="self-start rounded-lg border border-blue-100 bg-white/85 p-5 shadow-lg backdrop-blur-xl">
        <div className="mb-4 flex items-center gap-2 text-blue-700">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-semibold">현재 설정</span>
        </div>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-gray-500">언어</dt>
            <dd className="mt-1 font-semibold text-gray-900">{currentLanguageLabel}</dd>
          </div>
          <div>
            <dt className="text-gray-500">시간대</dt>
            <dd className="mt-1 font-semibold text-gray-900">Asia/Seoul</dd>
          </div>
          <div>
            <dt className="text-gray-500">날짜 형식</dt>
            <dd className="mt-1 font-semibold text-gray-900">YYYY.MM.DD</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}

