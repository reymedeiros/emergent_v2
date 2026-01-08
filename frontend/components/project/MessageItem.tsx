'use client';

import React, { useState } from 'react';
import { Check, ChevronRight, Copy, RotateCcw, Bot, User } from 'lucide-react';
import { colors } from '@/lib/design-tokens';

export interface Message {
  id: string;
  role: 'agent' | 'human' | 'system';
  content: string;
  timestamp: Date;
  type?: 'text' | 'code' | 'step' | 'file';
  status?: 'pending' | 'completed' | 'error';
  fileName?: string;
}

interface MessageItemProps {
  message: Message;
  onRollback?: () => void;
  onCopy?: () => void;
}

export function MessageItem({ message, onRollback, onCopy }: MessageItemProps) {
  const [copied, setCopied] = useState(false);
  const isAgent = message.role === 'agent';
  const isSystem = message.role === 'system';
  const isStep = message.type === 'step';
  const isCode = message.type === 'code';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  // Step message (command execution)
  if (isStep || isCode) {
    return (
      <div className="message-fade-in" data-testid="message-step">
        <div className="flex items-start gap-3 py-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-1">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.secondary }}
            >
              <Bot className="w-3.5 h-3.5" style={{ color: colors.mutedForeground }} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {message.fileName && (
              <p className="text-sm mb-2" style={{ color: colors.subtleText }}>
                {message.content}
              </p>
            )}
            
            <div 
              className="rounded-lg overflow-hidden"
              style={{ 
                backgroundColor: colors.codeBackground,
                border: `1px solid ${colors.codeBorder}`,
              }}
            >
              <div className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-2">
                  {message.status === 'completed' ? (
                    <Check className="w-4 h-4" style={{ color: colors.stepSuccess }} />
                  ) : (
                    <span 
                      className="w-4 h-4 rounded-full animate-pulse"
                      style={{ backgroundColor: colors.taskRunning }}
                    />
                  )}
                  <code 
                    className="text-sm font-mono"
                    style={{ color: colors.subtleText }}
                  >
                    {message.fileName || message.content}
                  </code>
                </div>
                <ChevronRight className="w-4 h-4" style={{ color: colors.mutedForeground }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Agent message
  if (isAgent) {
    return (
      <div className="message-fade-in py-3" data-testid="message-agent">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-1">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.secondary }}
            >
              <Bot className="w-3.5 h-3.5" style={{ color: colors.mutedForeground }} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p 
              className="text-sm leading-relaxed whitespace-pre-wrap"
              style={{ color: colors.foreground }}
            >
              {message.content}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Human message
  return (
    <div className="message-fade-in py-3" data-testid="message-human">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.yellowPrimary }}
          >
            <User className="w-3.5 h-3.5" style={{ color: colors.background }} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p 
            className="text-sm leading-relaxed whitespace-pre-wrap"
            style={{ color: colors.foreground }}
          >
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
}
