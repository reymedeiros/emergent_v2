'use client';

import React from 'react';
import { X, LayoutGrid, Plus, Circle } from 'lucide-react';
import { useTabStore, Tab } from '@/lib/store/tabs';
import { colors } from '@/lib/design-tokens';

export function TabBar() {
  const { tabs, activeTabId, setActiveTab, removeTab, addTab } = useTabStore();

  const handleAddTab = () => {
    // Navigate to home to create new project
    setActiveTab('home');
  };

  return (
    <div className="flex items-center gap-0.5 h-full" data-testid="tab-bar">
      {tabs.map((tab) => (
        <TabItem
          key={tab.id}
          tab={tab}
          isActive={tab.id === activeTabId}
          onActivate={() => setActiveTab(tab.id)}
          onClose={() => removeTab(tab.id)}
        />
      ))}
      
      {/* Add Tab Button */}
      <button
        onClick={handleAddTab}
        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/5 transition-colors ml-1"
        title="New tab"
        data-testid="add-tab-button"
      >
        <Plus className="w-4 h-4" style={{ color: colors.mutedForeground }} />
      </button>
    </div>
  );
}

interface TabItemProps {
  tab: Tab;
  isActive: boolean;
  onActivate: () => void;
  onClose: () => void;
}

function TabItem({ tab, isActive, onActivate, onClose }: TabItemProps) {
  const isHome = tab.type === 'home';
  const isProject = tab.type === 'project';

  return (
    <div
      onClick={onActivate}
      className={`
        group relative flex items-center gap-2 px-3 h-9 rounded-t-lg cursor-pointer
        transition-all duration-200 min-w-[100px] max-w-[180px]
      `}
      style={{
        backgroundColor: isActive ? colors.secondary : 'transparent',
        borderBottom: isActive ? `2px solid ${colors.foreground}` : '2px solid transparent',
      }}
      data-testid={`tab-${tab.id}`}
    >
      {/* Tab Icon */}
      {isHome ? (
        <LayoutGrid className="w-4 h-4 flex-shrink-0" style={{ color: colors.foreground }} />
      ) : (
        <Circle 
          className="w-2 h-2 flex-shrink-0 fill-current"
          style={{ color: colors.taskRunning }}
        />
      )}
      
      {/* Tab Title */}
      <span 
        className="text-sm truncate"
        style={{ color: colors.foreground }}
      >
        {tab.title}
      </span>

      {/* Close Button (not for home tab) */}
      {!isHome && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="
            ml-auto opacity-0 group-hover:opacity-100
            p-1 rounded hover:bg-white/10 transition-all
            flex-shrink-0
          "
          data-testid={`close-tab-${tab.id}`}
        >
          <X className="w-3 h-3" style={{ color: colors.mutedForeground }} />
        </button>
      )}
    </div>
  );
}
