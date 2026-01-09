'use client';

import React from 'react';
import { X, LayoutGrid, Plus } from 'lucide-react';
import { useTabStore, Tab } from '@/lib/store/tabs';
import { emergentColors } from '@/lib/design-tokens';

export function TabBar() {
  const { tabs, activeTabId, setActiveTab, removeTab } = useTabStore();

  const handleAddTab = () => {
    setActiveTab('home');
  };

  return (
    <div className="flex items-center gap-0.5 h-full" data-testid="tab-bar">
      {tabs.map((tab, index) => (
        <React.Fragment key={tab.id}>
          <TabItem
            tab={tab}
            isActive={tab.id === activeTabId}
            onActivate={() => setActiveTab(tab.id)}
            onClose={() => removeTab(tab.id)}
          />
          {/* Divider between tabs */}
          {index < tabs.length - 1 && (
            <div 
              className="h-5 w-[1px] flex-shrink-0 self-center transition-opacity duration-200"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                opacity: tab.id === activeTabId || tabs[index + 1]?.id === activeTabId ? 0 : 1 
              }}
            />
          )}
        </React.Fragment>
      ))}
      
      {/* Add Tab Button */}
      <button
        onClick={handleAddTab}
        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/10 transition-colors ml-1 mb-1"
        title="New tab"
        data-testid="add-tab-button"
      >
        <Plus className="w-4 h-4" style={{ color: emergentColors.mutedForeground }} />
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
  
  // Get status from tab (default to 'running' for demo)
  const status = (tab as any).status || 'running';
  const isRunning = status === 'running';
  const isWaiting = status === 'waiting';

  // Status colors
  const statusColor = isRunning ? emergentColors.agentRunningPrimary : emergentColors.agentWaitingPrimary;
  const statusBg = isRunning ? emergentColors.agentRunningBackground : emergentColors.agentWaitingBackground;
  const statusPulse = isRunning ? emergentColors.agentRunningPulse : emergentColors.agentWaitingPulse;
  const statusPulseTransparent = isRunning ? emergentColors.agentRunningPulseTransparent : emergentColors.agentWaitingPulseTransparent;

  return (
    <div className="relative flex items-end">
      {/* Active tab curved corners */}
      {isActive && (
        <>
          <div 
            className="absolute bottom-0 -left-[20px] w-[20px] h-[20px] z-10"
            style={{
              borderBottomRightRadius: '12px',
              boxShadow: `${emergentColors.background} 6px 6px 0px 6px`,
              clipPath: 'inset(0px -10px 0px 0px)'
            }}
          />
          <div 
            className="absolute bottom-0 -right-[20px] w-[20px] h-[20px] z-10"
            style={{
              borderBottomLeftRadius: '12px',
              boxShadow: `${emergentColors.background} -6px 6px 0px 6px`,
              clipPath: 'inset(0px 0px 0px -10px)'
            }}
          />
        </>
      )}
      
      <div
        onClick={onActivate}
        className={`
          group relative flex justify-between items-center cursor-pointer
          transition-all duration-200 font-brockmann text-[14px] leading-[20px] font-medium
          z-20 pr-0.5 pl-0.5 pt-[7px] pb-[5px] mx-1 mb-1
          ${isActive ? 'rounded-t-xl' : 'rounded-lg hover:bg-white/5'}
        `}
        style={{
          backgroundColor: isActive ? emergentColors.secondary : 'transparent',
          minWidth: '40px',
          maxWidth: '170px',
          color: emergentColors.foreground,
        }}
        data-testid={`tab-${tab.id}`}
      >
        <div className="flex items-center space-x-2 overflow-hidden pl-1.5 py-1">
          {/* Tab Icon */}
          {isHome ? (
            <LayoutGrid className="w-4 h-4 flex-shrink-0" style={{ color: emergentColors.foreground }} />
          ) : (
            /* Animated Status Dot for Project Tabs */
            <div 
              className="rounded-lg flex justify-center items-center w-3 h-3 animate-status-pulse flex-shrink-0"
              style={{
                backgroundColor: statusBg,
                '--status-pulse-color': statusPulse,
                '--status-pulse-transparent': statusPulseTransparent,
              } as React.CSSProperties}
            >
              <div 
                className="rounded w-1.5 h-1.5"
                style={{ backgroundColor: statusColor }}
              />
            </div>
          )}
          
          {/* Tab Title */}
          <span 
            className="text-sm font-medium cursor-default truncate"
            style={{ color: emergentColors.foreground }}
          >
            {tab.title}
          </span>
        </div>

        {/* Close Button (not for home tab) */}
        {!isHome && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="hover:bg-white/10 rounded-full p-0.5 flex-shrink-0 transition-opacity duration-200 hover:text-white"
            style={{ color: '#7B7B80' }}
            data-testid={`close-tab-${tab.id}`}
            title="Close Tab"
          >
            <svg fill="none" height="14" viewBox="0 0 24 24" width="14" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
