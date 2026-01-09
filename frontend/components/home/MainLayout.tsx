'use client';

import React from 'react';
import { useTabStore } from '@/lib/store/tabs';
import { Header } from '../ui/Header';
import { HomeView } from './HomeView';
import { ProjectExecutionView } from '../project/ProjectExecutionView';
import { emergentColors } from '@/lib/design-tokens';

export function MainLayout() {
  const { activeTabId, tabs } = useTabStore();
  
  // Get the active tab
  const activeTab = tabs.find(tab => tab.id === activeTabId);
  const isHomeView = !activeTab || activeTab.type === 'home';

  return (
    <div 
      className="flex flex-col h-dvh overflow-hidden"
      style={{ backgroundColor: emergentColors.background }}
      data-testid="main-layout"
    >
      {/* Header with Tab Bar */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative mt-0">
        {isHomeView ? (
          <HomeView />
        ) : (
          <ProjectExecutionView 
            projectId={activeTab?.projectId || activeTab?.id || ''} 
            projectName={activeTab?.title || 'Untitled'}
          />
        )}
      </main>
    </div>
  );
}
