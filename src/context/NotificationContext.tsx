import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { alarmApi } from '../services/alarmApi';

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

const notificationStorageKey = 'jb_mock_notifications';

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
    isRead: true,
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

function loadSavedNotifications() {
  try {
    const saved = localStorage.getItem(notificationStorageKey);
    if (!saved) return null;

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function normalizeNotifications(data: any): NotificationItem[] {
  if (!Array.isArray(data)) return [];

  return data.map((item, index) => ({
    id: String(item.id ?? `notification-${index}`),
    title: item.title ?? '알림',
    desc: item.desc ?? item.description,
    time: item.time ?? item.createdAt ?? item.created_at ?? '방금',
    isRead: Boolean(item.isRead ?? item.is_read ?? false),
    type: item.type ?? 'update',
  }));
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    () => loadSavedNotifications() ?? defaultNotifications
  );

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await alarmApi.getList();
        const normalized = normalizeNotifications(data);

        if (normalized.length > 0) {
          setNotifications(normalized);
        }
      } catch (error) {
        console.warn('알림 API 조회 실패, 임시 알림을 사용합니다.', error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    localStorage.setItem(notificationStorageKey, JSON.stringify(notifications));
  }, [notifications]);

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
