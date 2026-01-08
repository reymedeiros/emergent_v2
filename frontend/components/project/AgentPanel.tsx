'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Check, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { MessageInput } from './MessageInput';

interface Message {
  id: string;
  type: 'agent' | 'user' | 'system' | 'command';
  content: string;
  timestamp: Date;
  status?: 'running' | 'success' | 'error';
  isExpanded?: boolean;
}

interface AgentPanelProps {
  messages: Message[];
  isAgentWorking: boolean;
  onSendMessage: (content: string) => void;
}

export function AgentPanel({ messages, isAgentWorking, onSendMessage }: AgentPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);

  // Detect manual scroll to pause auto-scroll
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setAutoScroll(isAtBottom);
  };

  const toggleExpand = (id: string) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages Area */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
      >
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            isExpanded={expandedMessages.has(message.id)}
            onToggleExpand={() => toggleExpand(message.id)}
            formatTime={formatTime}
          />
        ))}

        {/* Scroll to bottom indicator */}
        {!autoScroll && (
          <button
            onClick={() => {
              setAutoScroll(true);
              scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
            }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-10
              bg-secondary/90 backdrop-blur-sm px-4 py-2 rounded-full
              border border-border shadow-lg
              flex items-center gap-2 text-sm text-muted-foreground
              hover:text-foreground transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-90" />
            <span>New messages</span>
          </button>
        )}
      </div>

      {/* Agent Status Indicator */}
      {isAgentWorking && (
        <div className="px-6 py-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#2EBBE5] animate-pulse" />
            <span className="text-sm text-[#2EBBE5]">Agent is working...</span>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-border">
        <MessageInput 
          onSendMessage={onSendMessage}
          isDisabled={false}
          placeholder="Message Agent"
        />
      </div>
    </div>
  );
}

interface MessageItemProps {
  message: Message;
  isExpanded: boolean;
  onToggleExpand: () => void;
  formatTime: (date: Date) => string;
}

function MessageItem({ message, isExpanded, onToggleExpand, formatTime }: MessageItemProps) {
  const isCommand = message.type === 'command';

  if (isCommand) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-start gap-3">
          {/* Agent Icon */}
          <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="9" cy="9" r="1.5" />
              <circle cx="15" cy="9" r="1.5" />
              <path d="M9 15h6" />
            </svg>
          </div>

          <div className="flex-1 space-y-2">
            {/* Command Block */}
            <div 
              onClick={onToggleExpand}
              className="group bg-secondary/60 rounded-lg px-4 py-3 cursor-pointer
                hover:bg-secondary/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Status Icon */}
                {message.status === 'running' ? (
                  <Loader2 className="w-4 h-4 text-[#2EBBE5] animate-spin flex-shrink-0" />
                ) : message.status === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                ) : (
                  <Check className="w-4 h-4 text-[#29CC83] flex-shrink-0" />
                )}

                {/* Command Text */}
                <code className="flex-1 text-sm font-mono text-foreground/90">
                  $ {message.content}
                </code>

                {/* Expand Arrow */}
                <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${
                  isExpanded ? 'rotate-90' : ''
                }`} />
              </div>
            </div>

            {/* Expanded Output */}
            {isExpanded && (
              <div className="bg-secondary/30 rounded-lg px-4 py-3 ml-6">
                <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                  Command output would appear here...
                </pre>
              </div>
            )}

            {/* Timestamp & Actions */}
            <div className="flex items-center justify-between ml-1">
              <span className="text-xs text-muted-foreground">
                {formatTime(message.timestamp)}
              </span>
              <div className="flex items-center gap-2">
                <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                  Rollback
                </button>
                <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular agent/user message
  return (
    <div className="animate-fade-in">
      <div className="flex items-start gap-3">
        {/* Agent Icon */}
        <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="1.5" />
            <circle cx="15" cy="9" r="1.5" />
            <path d="M9 15h6" />
          </svg>
        </div>

        <div className="flex-1">
          <p className="text-sm text-foreground leading-relaxed">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
}
