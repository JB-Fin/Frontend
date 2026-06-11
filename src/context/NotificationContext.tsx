import { createContext, useContext, useState, type ReactNode } from 'react';

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  isRead: boolean;
  type: 'update' | 'review' | 'approval' | 'education' | 'library';
  desc?: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const defaultNotifications: NotificationItem[] = [
  {
    id: 'education-poster-created',
    title: '교육 포스터 생성 완료',
    desc: '금융소비자보호법_교육포스터.png가 라이브러리에 저장되었습니다.',
    time: '방금',
    isRead: false,
    type: 'education',
  },
  {
    id: 'education-ppt-created',
    title: '교육 자료 생성 완료',
    desc: '금융소비자보호법_교육자료.pptx가 라이브러리에 저장되었습니다.',
    time: '5분 전',
    isRead: false,
    type: 'library',
  },
  {
    id: 'review-report-created',
    title: 'AI 검토 보고서 생성',
    desc: '광고시안_Ver2_검토보고서.txt가 라이브러리에 저장되었습니다.',
    time: '1시간 전',
    isRead: false,
    type: 'review',
  },
  {
    id: 'policy-update',
    title: '신규 규정 업데이트',
    desc: '금융소비자보호법 교육 자료 제작에 반영할 항목이 있습니다.',
    time: '오늘 09:20',
    isRead: false,
    type: 'update',
  },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

function createInitialNotifications() {
  return defaultNotifications.map((notification) => ({
    ...notification,
    isRead: false,
  }));
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(createInitialNotifications);

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
