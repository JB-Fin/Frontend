import {
  Bell,
  Calendar,
  FileCheck,
  GraduationCap,
  History,
  MessageSquare,
  Search,
} from 'lucide-react';
import type { WidgetItem, WidgetType } from '../types/widget';

export const defaultDashboardWidgets: WidgetItem[] = [
  { id: 'ai-chat', type: 'ai-chat', title: 'AI 채팅', colSpan: 2, rowSpan: 4, order: 1 },
  { id: 'ai-review', type: 'ai-review', title: 'AI 검토', colSpan: 1, rowSpan: 2, order: 2 },
  { id: 'task-history', type: 'task-history', title: '작업 내역', colSpan: 1, rowSpan: 2, order: 3 },
  { id: 'calendar', type: 'calendar', title: '캘린더', colSpan: 2, rowSpan: 2, order: 4 },
  { id: 'education', type: 'education-content', title: '교육 자료 제작', colSpan: 1, rowSpan: 2, order: 5 },
  { id: 'notification', type: 'notification', title: '알림', colSpan: 1, rowSpan: 2, order: 6 },
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
    defaultSize: { colSpan: 1, rowSpan: 2 },
    preview: '소형 (1x2)',
  },
  {
    type: 'task-history',
    title: '작업 내역',
    description: '최근 수행한 컴플라이언스 작업 현황',
    icon: History,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    defaultSize: { colSpan: 1, rowSpan: 2 },
    preview: '소형 (1x2)',
  },
  {
    type: 'internal-investigation',
    title: '내부 조사 지원',
    description: 'AI 기반 내부 조사 및 증거 분석',
    icon: Search,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    defaultSize: { colSpan: 2, rowSpan: 2 },
    preview: '중형 (2x2)',
  },
  {
    type: 'education-content',
    title: '교육 자료 제작',
    description: 'AI 생성 컴플라이언스 교육 콘텐츠',
    icon: GraduationCap,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    defaultSize: { colSpan: 1, rowSpan: 2 },
    preview: '소형 (1x2)',
  },
  {
    type: 'calendar',
    title: '캘린더',
    description: '컴플라이언스 관련 일정 및 마감일',
    icon: Calendar,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
    defaultSize: { colSpan: 2, rowSpan: 2 },
    preview: '중형 (2x2)',
  },
  {
    type: 'notification',
    title: '알림',
    description: '중요 업데이트 및 알림',
    icon: Bell,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    defaultSize: { colSpan: 1, rowSpan: 2 },
    preview: '소형 (1x2)',
  },
];
