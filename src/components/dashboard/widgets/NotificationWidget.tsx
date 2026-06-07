import { AlertCircle, Bell, CheckCircle, Info } from 'lucide-react';

const notifications = [
  { id: 1, title: '새로운 규정 업데이트', time: '5분 전', icon: Info, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 2, title: 'AI 검토 완료', time: '1시간 전', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  { id: 3, title: '승인 필요', time: '2시간 전', icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-100' },
];

export function NotificationWidget() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-gradient-to-br from-red-100 to-pink-100 p-3">
          <Bell className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">최근 알림</h3>
          <p className="text-xs text-gray-600">새 알림 2건</p>
        </div>
      </div>
      <div className="flex-1 space-y-2">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <div key={notification.id} className="group cursor-pointer rounded-lg border border-gray-200/50 bg-white/90 p-3 transition-all hover:shadow-md">
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 rounded-lg p-2 ${notification.bg}`}>
                  <Icon className={`h-4 w-4 ${notification.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 transition-colors group-hover:text-blue-600">{notification.title}</p>
                  <p className="mt-1 text-xs text-gray-600">{notification.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button className="mt-3 w-full py-2 text-sm font-medium text-red-600 transition-colors hover:text-red-700">모든 알림 보기 →</button>
    </div>
  );
}
