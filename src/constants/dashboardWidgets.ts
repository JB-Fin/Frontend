import {
  Bell,
  Calendar,
  FileCheck,
  GraduationCap,
  History,
  MessageSquare,
} from 'lucide-react';
import type { WidgetItem, WidgetType } from '../types/widget';

export const defaultDashboardWidgets: WidgetItem[] = [
  { id: 'ai-chat', type: 'ai-chat', title: 'AI 채팅', colSpan: 2, rowSpan: 4, order: 1 },
  { id: 'ai-review', type: 'ai-review', title: 'AI 검토', colSpan: 1, rowSpan: 4, order: 2 },
  { id: 'task-history', type: 'task-history', title: '라이브러리', colSpan: 1, rowSpan: 4, order: 3 },
  { id: 'calendar', type: 'calendar', title: '캘린더', colSpan: 2, rowSpan: 4, order: 4 },
  { id: 'education', type: 'education-content', title: '교육 자료 제작', colSpan: 1, rowSpan: 4, order: 5 },
  { id: 'notification', type: 'notification', title: '알림', colSpan: 1, rowSpan: 4, order: 6 },
];

export interface WidgetOption {
  type: WidgetType;
  title: string;
  description: string;
  icon: typeof MessageSquare;
  color: string;
  bgColor: string;
  defaultSize: { colSpan: number; rowSpan: number };
  preview: string;
}

export const widgetOptions: WidgetOption[] = [
  {
    type: 'ai-chat',
    title: 'AI 채팅',
    description: '규정 및 법령에 대한 실시간 AI 질의응답',
    icon: MessageSquare,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    defaultSize: { colSpan: 2, rowSpan: 4 },
    preview: '대형 (2x4)',
  },
  {
    type: 'ai-review',
    title: 'AI 검토',
    description: '문서의 규정 준수 여부를 AI가 자동 검토',
    icon: FileCheck,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    defaultSize: { colSpan: 1, rowSpan: 4 },
    preview: '세로형 (1x4)',
  },
  {
    type: 'education-content',
    title: '교육 자료 제작',
    description: '법안 변경사항 기반 교육 초안 생성',
    icon: GraduationCap,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    defaultSize: { colSpan: 1, rowSpan: 4 },
    preview: '세로형 (1x4)',
  },
  {
    type: 'task-history',
    title: '라이브러리',
    description: '검토 결과, 원본 문서, 보고서 보관함',
    icon: History,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    defaultSize: { colSpan: 1, rowSpan: 4 },
    preview: '세로형 (1x4)',
  },
  {
    type: 'calendar',
    title: '캘린더',
    description: '컴플라이언스 관련 일정 및 마감일',
    icon: Calendar,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
    defaultSize: { colSpan: 2, rowSpan: 4 },
    preview: '대형 (2x4)',
  },
  {
    type: 'notification',
    title: '알림',
    description: '중요 업데이트 및 알림',
    icon: Bell,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    defaultSize: { colSpan: 1, rowSpan: 4 },
    preview: '세로형 (1x4)',
  },
];
