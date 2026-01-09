'use client';

import React, { useState } from 'react';
import { Check, ChevronRight, ChevronDown, Copy, Bot, User } from 'lucide-react';
import { emergentColors } from '@/lib/design-tokens';

export interface Message {
  id: string;
  role: 'agent' | 'human' | 'system';
  content: string;
  timestamp: Date;
  type?: 'text' | 'code' | 'step' | 'file';
  status?: 'pending' | 'completed' | 'error';
  fileName?: string;
  expandedContent?: string;
}

interface MessageItemProps {
  message: Message;
  onRollback?: () => void;
  onCopy?: () => void;
}

export function MessageItem({ message, onRollback, onCopy }: MessageItemProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const isAgent = message.role === 'agent';
  const isStep = message.type === 'step';
  const isCode = message.type === 'code';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  };

  // Parse file paths in content for highlighting
  const renderContentWithPaths = (content: string) => {
    // Match file paths like /app/path/file.ext
    const pathRegex = /(\/[\w\-\/\.]+)/g;
    const parts = content.split(pathRegex);
    
    return parts.map((part, index) => {
      if (pathRegex.test(part)) {
        return (
          <span key={index} className="text-[#FF99FD] font-brockmann">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // Step/Tool message (command execution)
  if (isStep || isCode) {
    const isCompleted = message.status === 'completed';
    
    return (
      <div className="message-fade-in my-1" data-testid="message-step">
        <div 
          className="rounded-lg overflow-hidden"
          style={{ 
            border: `1px solid ${emergentColors.border}`,
          }}
        >
          <div 
            className="flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {/* Status Icon */}
              {isCompleted ? (
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: emergentColors.stepSuccess }} />
              ) : (
                <div 
                  className="w-4 h-4 rounded-full animate-pulse flex-shrink-0"
                  style={{ backgroundColor: emergentColors.taskRunning }}
                />
              )}
              
              {/* Code/Command Text */}
              <code 
                className="text-[#CCEDFF99] font-mono text-sm w-full overflow-hidden"
              >
                <span className="flex items-center gap-2 font-mono text-wrap">
                  {renderContentWithPaths(message.fileName || message.content)}
                </span>
              </code>
            </div>
            
            {/* Expand/Collapse Chevron */}
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: emergentColors.mutedForeground }} />
            ) : (
              <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: emergentColors.mutedForeground }} />
            )}
          </div>
          
          {/* Expanded Content */}
          {isExpanded && message.expandedContent && (
            <div 
              className="px-4 py-3 font-mono text-sm overflow-x-auto"
              style={{ 
                backgroundColor: emergentColors.codeBackground,
                borderTop: `1px solid ${emergentColors.border}`,
                color: emergentColors.subtleText,
              }}
            >
              <pre className="whitespace-pre-wrap">{message.expandedContent}</pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Agent text message
  if (isAgent) {
    return (
      <div className="message-fade-in my-3" data-testid="message-agent">
        <p 
          className="text-sm leading-relaxed whitespace-pre-wrap"
          style={{ color: emergentColors.foreground }}
        >
          {message.content}
        </p>
      </div>
    );
  }

  // Human message
  return (
    <div className="message-fade-in my-3" data-testid="message-human">
      <div 
        className="rounded-xl px-4 py-3 inline-block max-w-full"
        style={{ backgroundColor: emergentColors.secondary }}
      >
        <p 
          className="text-sm leading-relaxed whitespace-pre-wrap"
          style={{ color: emergentColors.foreground }}
        >
          {message.content}
        </p>
      </div>
    </div>
  );
}
