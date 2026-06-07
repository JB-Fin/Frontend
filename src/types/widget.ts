export type WidgetType =
  | 'ai-chat'
  | 'ai-review'
  | 'task-history'
  | 'internal-investigation'
  | 'education-content'
  | 'calendar'
  | 'notification';

export interface WidgetItem {
  id: string;
  type: WidgetType;
  title: string;
  colSpan: number;
  rowSpan: number;
  order: number;
}
