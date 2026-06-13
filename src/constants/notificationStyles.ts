import { BookOpen, CheckCircle, Info, Library, ShieldCheck, type LucideIcon } from 'lucide-react';
import type { NotificationItem } from '../context/NotificationContext';

export type NotificationVisualStyle = {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  accentBg: string;
  accentBorder: string;
  accentDot: string;
};

export const notificationStyles: Record<NotificationItem['type'], NotificationVisualStyle> = {
  update: {
    icon: Info,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-700',
    accentBg: 'bg-blue-500',
    accentBorder: 'border-blue-200',
    accentDot: 'bg-blue-600',
  },
  review: {
    icon: ShieldCheck,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-700',
    accentBg: 'bg-blue-500',
    accentBorder: 'border-blue-200',
    accentDot: 'bg-blue-600',
  },
  approval: {
    icon: CheckCircle,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-700',
    accentBg: 'bg-blue-500',
    accentBorder: 'border-blue-200',
    accentDot: 'bg-blue-600',
  },
  education: {
    icon: BookOpen,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-700',
    accentBg: 'bg-blue-500',
    accentBorder: 'border-blue-200',
    accentDot: 'bg-blue-600',
  },
  library: {
    icon: Library,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-700',
    accentBg: 'bg-blue-500',
    accentBorder: 'border-blue-200',
    accentDot: 'bg-blue-600',
  },
};

export function getNotificationStyle(type: NotificationItem['type']) {
  return notificationStyles[type] ?? notificationStyles.update;
}
