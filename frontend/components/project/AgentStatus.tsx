'use client';

import React from 'react';
import { emergentColors } from '@/lib/design-tokens';

interface AgentStatusProps {
  status: 'running' | 'waiting' | 'idle';
}

export function AgentStatus({ status }: AgentStatusProps) {
  const isRunning = status === 'running';
  const isWaiting = status === 'waiting';
  const isActive = isRunning || isWaiting;

  if (!isActive) return null;

  // Status-specific colors
  const statusColor = isRunning ? emergentColors.agentRunningPrimary : emergentColors.agentWaitingPrimary;
  const statusBg = isRunning ? emergentColors.agentRunningBackground : emergentColors.agentWaitingBackground;
  const statusPulse = isRunning ? emergentColors.agentRunningPulse : emergentColors.agentWaitingPulse;
  const statusPulseTransparent = isRunning ? emergentColors.agentRunningPulseTransparent : emergentColors.agentWaitingPulseTransparent;
  const statusText = isRunning ? 'Agent is running...' : 'Agent is waiting...';

  return (
    <div className="flex items-center gap-2 md:gap-4" data-testid="agent-status">
      <div className="flex items-center gap-2 min-w-[58vw] md:min-w-fit md:gap-4">
        {/* Animated Status Indicator */}
        <div 
          className="w-4 h-4 rounded-lg flex justify-center items-center animate-status-pulse"
          style={{
            backgroundColor: statusBg,
            '--status-pulse-color': statusPulse,
            '--status-pulse-transparent': statusPulseTransparent,
          } as React.CSSProperties}
        >
          <div 
            className="w-2 h-2 rounded"
            style={{ backgroundColor: statusColor }}
          />
        </div>
        
        {/* Status Text */}
        <span
          className="text-[15px] md:text-[16px] font-medium md:text-nowrap"
          style={{ color: statusColor, whiteSpace: 'normal' }}
          data-testid="agent-status-text"
        >
          {statusText}
        </span>
      </div>
    </div>
  );
}
