import { create } from 'zustand';

/**
 * UI store - manages sidebar, theme, modals, and toast state
 */
export const useUIStore = create((set) => ({
  // Sidebar
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Theme
  theme: localStorage.getItem('taskflow_theme') || 'system',
  setTheme: (theme) => {
    localStorage.setItem('taskflow_theme', theme);
    set({ theme });
  },

  // Task detail drawer
  selectedTaskId: null,
  drawerOpen: false,
  openDrawer: (taskId) => set({ selectedTaskId: taskId, drawerOpen: true }),
  closeDrawer: () => set({ selectedTaskId: null, drawerOpen: false }),

  // Create task modal
  createModalOpen: false,
  openCreateModal: () => set({ createModalOpen: true }),
  closeCreateModal: () => set({ createModalOpen: false }),

  // View mode (list / kanban)
  viewMode: localStorage.getItem('taskflow_viewMode') || 'kanban',
  setViewMode: (mode) => {
    localStorage.setItem('taskflow_viewMode', mode);
    set({ viewMode: mode });
  },
}));
