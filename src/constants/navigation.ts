import {
  Calendar,
  FileCheck,
  GraduationCap,
  History,
  Home,
  MessageSquare,
  Search,
} from 'lucide-react';
import type { PageId } from '../types/page';

export type NavigationItem =
  | { id: PageId; label: string; icon: typeof Home }
  | { id: string; type: 'divider' };

export const navigationItems: NavigationItem[] = [
  { id: 'home', label: '홈', icon: Home },
  { id: 'divider1', type: 'divider' },
  { id: 'ai-chat', label: 'AI 채팅', icon: MessageSquare },
  { id: 'ai-review', label: 'AI 검토', icon: FileCheck },
  { id: 'task-history', label: '작업 내역', icon: History },
  { id: 'divider2', type: 'divider' },
  { id: 'internal-investigation', label: '내부 조사 지원', icon: Search },
  { id: 'education-content', label: '교육 자료 제작', icon: GraduationCap },
  { id: 'divider3', type: 'divider' },
  { id: 'calendar', label: '캘린더', icon: Calendar },
];
