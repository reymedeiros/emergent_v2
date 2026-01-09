'use client';

import { create } from 'zustand';

export interface Tab {
  id: string;
  title: string;
  type: 'home' | 'project';
  projectId?: string;
  isActive: boolean;
  status?: 'running' | 'waiting' | 'idle'; // Agent status for the tab
}

interface TabState {
  tabs: Tab[];
  activeTabId: string;
  addTab: (tab: Omit<Tab, 'isActive'>) => void;
  removeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTabTitle: (id: string, title: string) => void;
  updateTabStatus: (id: string, status: 'running' | 'waiting' | 'idle') => void;
}

export const useTabStore = create<TabState>((set, get) => ({
  tabs: [
    { id: 'home', title: 'Home', type: 'home', isActive: true }
  ],
  activeTabId: 'home',

  addTab: (tab) => {
    const { tabs } = get();
    const existingTab = tabs.find(t => t.id === tab.id);
    
    if (existingTab) {
      // If tab exists, just activate it
      set({
        tabs: tabs.map(t => ({ ...t, isActive: t.id === tab.id })),
        activeTabId: tab.id,
      });
    } else {
      // Add new tab with default 'running' status and activate it
      set({
        tabs: [
          ...tabs.map(t => ({ ...t, isActive: false })),
          { ...tab, isActive: true, status: tab.status || 'running' }
        ],
        activeTabId: tab.id,
      });
    }
  },

  removeTab: (id) => {
    const { tabs, activeTabId } = get();
    
    // Don't remove the home tab
    if (id === 'home') return;
    
    const newTabs = tabs.filter(t => t.id !== id);
    
    // If we're removing the active tab, activate the previous one or home
    if (activeTabId === id) {
      const removedIndex = tabs.findIndex(t => t.id === id);
      const newActiveIndex = Math.max(0, removedIndex - 1);
      const newActiveId = newTabs[newActiveIndex]?.id || 'home';
      
      set({
        tabs: newTabs.map(t => ({ ...t, isActive: t.id === newActiveId })),
        activeTabId: newActiveId,
      });
    } else {
      set({ tabs: newTabs });
    }
  },

  setActiveTab: (id) => {
    set(state => ({
      tabs: state.tabs.map(t => ({ ...t, isActive: t.id === id })),
      activeTabId: id,
    }));
  },

  updateTabTitle: (id, title) => {
    set(state => ({
      tabs: state.tabs.map(t => t.id === id ? { ...t, title } : t),
    }));
  },

  updateTabStatus: (id, status) => {
    set(state => ({
      tabs: state.tabs.map(t => t.id === id ? { ...t, status } : t),
    }));
  },
}));
