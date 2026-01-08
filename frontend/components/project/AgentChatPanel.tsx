'use client';

import React, { useRef, useEffect, useState } from 'react';
import { 
  Paperclip, 
  Github, 
  GitFork, 
  Mic, 
  ArrowUp,
  Square,
  Zap
} from 'lucide-react';
import { colors, borderRadius } from '@/lib/design-tokens';
import { MessageItem, Message } from './MessageItem';
import { AgentStatus } from './AgentStatus';

interface AgentChatPanelProps {
  messages: Message[];
  agentStatus: 'running' | 'waiting' | 'idle';
  onSendMessage: (message: string) => void;
  onStop?: () => void;
}

export function AgentChatPanel({ 
  messages, 
  agentStatus, 
  onSendMessage,
  onStop 
}: AgentChatPanelProps) {
  const [input, setInput] = useState('');
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (!isUserScrolling) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isUserScrolling]);

  // Detect user scrolling
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
    setIsUserScrolling(!isAtBottom);
  };

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isAgentBusy = agentStatus === 'running';

  return (
    <div className="flex flex-col h-full" data-testid="agent-chat-panel">
      {/* Messages Area */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 py-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="max-w-3xl mx-auto">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to bottom indicator */}
      {isUserScrolling && (
        <button
          onClick={() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            setIsUserScrolling(false);
          }}
          className="absolute bottom-32 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-opacity hover:opacity-90"
          style={{
            backgroundColor: colors.secondary,
            border: `1px solid ${colors.border}`,
            color: colors.foreground,
          }}
        >
          <ArrowUp className="w-4 h-4 rotate-180" />
          Scroll to bottom
        </button>
      )}

      {/* Input Area */}
      <div 
        className="px-6 pb-4 pt-2"
        style={{ borderTop: `1px solid ${colors.borderSubtle}` }}
      >
        <div className="max-w-3xl mx-auto">
          {/* Agent Status */}
          <div className="flex items-center justify-between mb-3">
            <AgentStatus status={agentStatus} />
          </div>

          {/* Input Container */}
          <div 
            className="rounded-2xl overflow-hidden"
            style={{ 
              backgroundColor: colors.secondary,
              border: `1px solid ${colors.border}`,
            }}
          >
            {/* Text Input */}
            <div className="px-4 pt-3 pb-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Agent"
                rows={1}
                className="w-full bg-transparent text-sm resize-none outline-none placeholder:text-muted-foreground"
                style={{ color: colors.foreground, minHeight: '24px', maxHeight: '120px' }}
                disabled={isAgentBusy}
              />
            </div>

            {/* Bottom Row */}
            <div 
              className="flex items-center justify-between px-4 py-2.5"
              style={{ borderTop: `1px solid ${colors.borderSubtle}` }}
            >
              {/* Left Actions */}
              <div className="flex items-center gap-1">
                <button 
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4" style={{ color: colors.mutedForeground }} />
                </button>
                <button 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  title="Save to GitHub"
                >
                  <Github className="w-4 h-4" style={{ color: colors.mutedForeground }} />
                  <span className="text-xs" style={{ color: colors.mutedForeground }}>Save to GitHub</span>
                </button>
                <button 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  title="Summarize"
                >
                  <GitFork className="w-4 h-4" style={{ color: colors.mutedForeground }} />
                  <span className="text-xs" style={{ color: colors.mutedForeground }}>Summarize</span>
                </button>
                <button 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  title="Ultra mode"
                >
                  <Zap className="w-4 h-4" style={{ color: colors.mutedForeground }} />
                  <span className="text-xs" style={{ color: colors.mutedForeground }}>Ultra</span>
                  <span 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: colors.mutedForeground }}
                  />
                </button>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-2">
                <button 
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                  title="Voice input"
                >
                  <Mic className="w-4 h-4" style={{ color: colors.mutedForeground }} />
                </button>
                
                {isAgentBusy ? (
                  <button
                    onClick={onStop}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-90"
                    style={{ backgroundColor: colors.foreground }}
                    data-testid="stop-button"
                  >
                    <Square className="w-4 h-4" style={{ color: colors.background }} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!input.trim()}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
                    style={{ backgroundColor: colors.foreground }}
                    data-testid="send-button"
                  >
                    <ArrowUp className="w-4 h-4" style={{ color: colors.background }} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
