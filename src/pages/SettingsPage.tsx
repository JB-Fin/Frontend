import { useState } from 'react';
import { Bell, Database, Globe, HelpCircle, Key, Palette, Shield, User } from 'lucide-react';

type SettingsTab = 'profile' | 'notifications' | 'security' | 'language' | 'appearance' | 'privacy' | 'data' | 'help';

const tabs = [
  { id: 'profile', label: '프로필', icon: User },
  { id: 'notifications', label: '알림 설정', icon: Bell },
  { id: 'security', label: '보안', icon: Shield },
  { id: 'language', label: '언어 및 지역', icon: Globe },
  { id: 'appearance', label: '화면 설정', icon: Palette },
  { id: 'privacy', label: '개인정보', icon: Key },
  { id: 'data', label: '데이터 관리', icon: Database },
  { id: 'help', label: '도움말', icon: HelpCircle },
] satisfies { id: SettingsTab; label: string; icon: typeof User }[];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">설정</h2>
        <p className="text-gray-600">계정 및 시스템 설정 관리</p>
      </div>
      <div className="grid grid-cols-4 gap-6">
        <div className="rounded-lg border border-white/60 bg-white/85 p-4 shadow-lg backdrop-blur-xl">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-white/80'}`}>
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <div className="col-span-3 rounded-lg border border-white/60 bg-white/85 p-8 shadow-lg backdrop-blur-xl">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'language' && <LanguageSettings />}
          {activeTab === 'appearance' && <AppearanceSettings />}
          {!['profile', 'notifications', 'security', 'language', 'appearance'].includes(activeTab) && (
            <div className="flex min-h-[360px] items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white/60 text-gray-500">
              준비 중인 설정 영역입니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">프로필 설정</h3>
      <div className="flex items-center gap-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600"><User className="h-12 w-12 text-white" /></div>
        <div><button className="mb-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 font-medium text-white transition-all hover:shadow-lg">사진 변경</button><p className="text-sm text-gray-600">JPG, PNG (최대 5MB)</p></div>
      </div>
      <div className="space-y-4">
        {[
          ['이름', '김준또', 'text'],
          ['이메일', 'juntto@jbgroup.com', 'email'],
          ['부서', '컴플라이언스팀', 'text'],
          ['직책', '선임 컴플라이언스 매니저', 'text'],
        ].map(([label, value, type]) => (
          <label key={label} className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">{label}</span>
            <input type={type} defaultValue={value} className="w-full rounded-lg border border-gray-200/50 bg-white/90 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
          </label>
        ))}
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button className="rounded-lg border border-gray-200/50 bg-white px-6 py-3 font-medium text-gray-700 transition-all hover:bg-gray-50">취소</button>
        <button className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-medium text-white transition-all hover:shadow-lg">저장</button>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const items = [
    ['이메일 알림', '중요한 업데이트를 이메일로 받습니다.'],
    ['브라우저 알림', '데스크톱 푸시 알림을 받습니다.'],
    ['일정 알림', '예정된 일정 전에 알림을 받습니다.'],
    ['AI 검토 완료 알림', '문서 검토가 완료되면 알림을 받습니다.'],
    ['규정 업데이트 알림', '새로운 규정 변경사항을 받습니다.'],
  ];
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">알림 설정</h3>
      <div className="space-y-4">{items.map(([label, desc]) => <SettingToggle key={label} label={label} desc={desc} defaultChecked />)}</div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">보안 설정</h3>
      <div className="space-y-4">
        <div className="rounded-lg border border-gray-200/50 bg-white/90 p-4">
          <div className="flex items-center justify-between">
            <div><p className="font-medium text-gray-900">비밀번호 변경</p><p className="text-sm text-gray-600">정기적인 비밀번호 변경을 권장합니다.</p></div>
            <button className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 font-medium text-white transition-all hover:shadow-lg">변경</button>
          </div>
        </div>
        <SettingToggle label="2단계 인증 (2FA)" desc="계정 보안을 강화합니다." />
        <div className="rounded-lg border border-gray-200/50 bg-white/90 p-4">
          <p className="font-medium text-gray-900">활성 세션</p>
          <p className="mb-3 text-sm text-gray-600">현재 로그인된 기기 목록</p>
          <div className="flex items-center justify-between rounded-lg bg-blue-50/50 p-3"><div><p className="text-sm font-medium text-gray-900">Chrome - Windows</p><p className="text-xs text-gray-600">현재 세션</p></div><span className="text-xs font-medium text-green-600">활성</span></div>
        </div>
      </div>
    </div>
  );
}

function LanguageSettings() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">언어 및 지역</h3>
      {[
        ['언어', ['한국어', 'English', '日本語']],
        ['시간대', ['(GMT+9:00) 서울, 도쿄', '(GMT+0:00) 런던', '(GMT-5:00) 뉴욕']],
        ['날짜 형식', ['YYYY.MM.DD', 'MM/DD/YYYY', 'DD/MM/YYYY']],
      ].map(([label, options]) => (
        <label key={label as string} className="block">
          <span className="mb-2 block text-sm font-medium text-gray-700">{label as string}</span>
          <select className="w-full rounded-lg border border-gray-200/50 bg-white/90 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50">{(options as string[]).map((option) => <option key={option}>{option}</option>)}</select>
        </label>
      ))}
    </div>
  );
}

function AppearanceSettings() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">화면 설정</h3>
      <div>
        <p className="mb-3 block text-sm font-medium text-gray-700">테마</p>
        <div className="grid grid-cols-3 gap-4">{['라이트', '다크', '시스템'].map((theme, index) => <button key={theme} className={`rounded-lg border-2 p-4 transition-all ${index === 0 ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200/50 bg-white/90 hover:border-blue-300'}`}><span className="font-medium text-gray-900">{theme}</span></button>)}</div>
      </div>
      <SettingToggle label="컴팩트 모드" desc="UI 요소 간격을 줄입니다." />
    </div>
  );
}

function SettingToggle({ label, desc, defaultChecked = false }: { label: string; desc: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200/50 bg-white/90 p-4">
      <div><p className="font-medium text-gray-900">{label}</p><p className="text-sm text-gray-600">{desc}</p></div>
      <label className="relative inline-flex cursor-pointer items-center">
        <input type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300" />
      </label>
    </div>
  );
}
