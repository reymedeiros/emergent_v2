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

  // Status-specific colors - exact match from HTML reference
  const statusColor = isRunning ? 'rgb(103,203,101)' : 'rgb(95,211,243)';
  const statusBg = isRunning ? 'rgba(103,203,101,0.125)' : 'rgba(95,211,243,0.125)';
  const statusPulse = isRunning ? '#67CB6570' : '#5FD3F370';
  const statusPulseTransparent = isRunning ? '#67CB6500' : '#5FD3F300';
  const statusText = isRunning ? 'Agent is running...' : 'Agent is waiting...';

  return (
    <div className="flex items-center gap-2 md:gap-4" data-testid="agent-status">
      <div className="flex items-center gap-2 min-w-[58vw] md:min-w-fit md:gap-4">
        {/* Animated Status Indicator - exact match from HTML */}
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
