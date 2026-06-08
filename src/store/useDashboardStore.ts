import { create } from 'zustand';
import { defaultDashboardWidgets } from '../constants/dashboardWidgets';
import type { WidgetItem } from '../types/widget';

interface DashboardState {
  widgets: WidgetItem[];
  setWidgets: (widgets: WidgetItem[]) => void;
  addWidget: (widget: WidgetItem) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, partial: Partial<WidgetItem>) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  widgets: defaultDashboardWidgets,

  setWidgets: (widgets) => set({ widgets }),

  addWidget: (widget) =>
    set((state) => ({ widgets: [...state.widgets, widget] })),

  removeWidget: (id) =>
    set((state) => ({
      widgets: state.widgets.filter((w) => w.id !== id),
    })),

  updateWidget: (id, partial) =>
    set((state) => ({
      widgets: state.widgets.map((w) =>
        w.id === id ? { ...w, ...partial } : w
      ),
    })),
}));