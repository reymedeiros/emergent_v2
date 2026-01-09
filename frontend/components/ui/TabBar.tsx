'use client';

import React from 'react';
import { LayoutGrid } from 'lucide-react';
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
      <div 
        className="flex items-center cursor-pointer ml-1 mb-1"
        data-testid="new-tab-button"
      >
        <button
          onClick={handleAddTab}
          className="ml-1 flex items-center justify-center w-9 h-9 rounded-md transition-all duration-200 hover:bg-white/10 text-[#7B7B80] hover:text-white"
          title="New tab"
          data-testid="add-tab-button"
        >
          <svg fill="none" height="13" viewBox="0 0 13 13" width="13" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.59375 0.254883C7.05596 0.301849 7.41699 0.692389 7.41699 1.16699V5.58301H11.833C12.3393 5.58306 12.7499 5.99373 12.75 6.5L12.7451 6.59375C12.6981 7.05595 12.3076 7.41698 11.833 7.41699H7.41699V11.833C7.41693 12.3076 7.05597 12.6981 6.59375 12.7451L6.5 12.75C5.99374 12.7499 5.58307 12.3393 5.58301 11.833V7.41699H1.16699C0.660749 7.41697 0.250019 7.00624 0.25 6.5L0.254883 6.40625C0.301867 5.94402 0.692365 5.58306 1.16699 5.58301H5.58301V1.16699C5.58301 0.660735 5.99374 0.250006 6.5 0.25L6.59375 0.254883Z"
              fill="currentColor" 
              opacity="0.8" 
              stroke="currentColor" 
              strokeWidth="0.5"
            />
          </svg>
        </button>
      </div>
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
  
  // Get status from tab (default to 'running' for demo)
  const status = (tab as any).status || 'running';
  const isRunning = status === 'running';

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
          flex justify-between items-center pr-0.5 pl-0.5 pt-[7px] pb-[5px] mx-1 mb-1
          cursor-pointer transition-all duration-200 font-brockmann text-[14px] leading-[20px] font-medium
          relative z-20
          ${isActive ? 'rounded-t-xl' : 'rounded-lg hover:bg-white/5'}
        `}
        style={{
          backgroundColor: isActive ? emergentColors.secondary : 'transparent',
          minWidth: '80px',
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
            className="hover:bg-white/10 rounded-full p-0.5 flex-shrink-0 transition-opacity duration-200 text-[#7B7B80] hover:text-white"
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
