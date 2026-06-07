import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, CheckSquare, AlertCircle, FileText } from 'lucide-react';

export function NotificationPage() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'update': return <AlertCircle className="h-5 w-5 text-blue-600" />;
      case 'review': return <FileText className="h-5 w-5 text-green-600" />;
      default: return <CheckSquare className="h-5 w-5 text-purple-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-900">전체 알림 내역</h1>
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          모두 읽음 처리
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
        {notifications.length === 0 ? (
          <p className="text-center py-12 text-gray-500">수신된 알림이 없습니다.</p>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={`flex items-center justify-between p-5 transition-colors cursor-pointer ${
                notification.isRead ? 'bg-white' : 'bg-blue-50/40 hover:bg-blue-50/80'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-lg ${notification.isRead ? 'bg-gray-100' : 'bg-blue-50'}`}>
                  {getIcon(notification.type)}
                </div>
                <div>
                  <p className={`text-sm ${notification.isRead ? 'text-gray-600' : 'text-gray-950 font-semibold'}`}>
                    {notification.title}
                  </p>
                  <span className="text-xs text-gray-400 block mt-1">{notification.time}</span>
                </div>
              </div>
              
              {!notification.isRead && (
                <span className="h-2 w-2 rounded-full bg-blue-600 mr-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}