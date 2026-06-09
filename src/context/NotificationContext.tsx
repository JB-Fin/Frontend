import React, {createContext, useContext, useState, ReactNode, useEffect,} from 'react';

import { alarmApi } from '../services/alarmApi';

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  isRead: boolean;
  type: 'update' | 'review' | 'approval';
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {

  /*
  // 프론트 목업용 데이터
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: '새로운 규정 업데이트',
      time: '5분 전',
      isRead: false,
      type: 'update',
    },
    {
      id: '2',
      title: 'AI 검토 완료',
      time: '1시간 전',
      isRead: false,
      type: 'review',
    },
    {
      id: '3',
      title: '승인 요청',
      time: '2시간 전',
      isRead: false,
      type: 'approval',
    },
  ]);
  */

  // 백엔드 연동 데이터
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await alarmApi.getList();

        console.log('알림 API 응답', data);

        setNotifications(data);
      } catch (error) {
        console.error('알림 조회 실패', error);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
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