'use client';

import React from 'react';
import { colors } from '@/lib/design-tokens';

interface AgentStatusProps {
  status: 'running' | 'waiting' | 'idle';
}

export function AgentStatus({ status }: AgentStatusProps) {
  const isRunning = status === 'running';
  const isWaiting = status === 'waiting';
  const isActive = isRunning || isWaiting;

  const statusColor = isRunning ? colors.agentRunning : colors.agentWaiting;
  const statusText = isRunning ? 'Agent is running...' : isWaiting ? 'Agent is waiting...' : '';

  if (!isActive) return null;

  return (
    <div className="flex items-center gap-2" data-testid="agent-status">
      <span
        className="w-2 h-2 rounded-full animate-pulse"
        style={{ backgroundColor: statusColor }}
      />
      <span
        className="text-sm font-medium"
        style={{ color: statusColor }}
      >
        {statusText}
      </span>
    </div>
  );
}
