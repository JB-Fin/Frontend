import {
  Calendar,
  FileCheck,
  GraduationCap,
  History,
  Home,
  MessageSquare,
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
  { id: 'education-content', label: '교육 자료 제작', icon: GraduationCap },
  { id: 'task-history', label: '라이브러리', icon: History },
  { id: 'divider2', type: 'divider' },
  { id: 'calendar', label: '캘린더', icon: Calendar },
];
