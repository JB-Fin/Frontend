export type WidgetType =
  | 'ai-chat'
  | 'ai-review'
  | 'task-history'
  | 'education-content'
  | 'calendar'
  | 'monthly-calendar'
  | 'notification';

export interface WidgetItem {
  id: string;
  type: WidgetType;
  title: string;
  colSpan: number;
  rowSpan: number;
  order: number;
}
