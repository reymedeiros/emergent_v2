'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ArrowUp, Square } from 'lucide-react';
import { emergentColors } from '@/lib/design-tokens';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (!isUserScrolling) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isUserScrolling]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '72px';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  // Detect user scrolling
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
    setIsUserScrolling(!isAtBottom);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || agentStatus === 'running') return;
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
  const isWaiting = agentStatus === 'waiting';

  // Gradient background based on status
  const inputGradient = isAgentBusy 
    ? 'linear-gradient(rgba(255,255,255,0.02) 0%, rgba(103,203,101,0.2) 100%)'
    : isWaiting
    ? 'linear-gradient(rgba(255,255,255,0.02) 0%, rgba(95,211,243,0.2) 100%)'
    : 'none';

  return (
    <div className="flex flex-col h-full relative" data-testid="agent-chat-panel">
      {/* Messages Area */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
          {/* Bottom spacer for input area */}
          <div className="h-[14rem]" />
        </div>
      </div>

      {/* Fixed Bottom Input Area */}
      <div 
        className="absolute z-[40] bottom-0 left-0 right-0 px-0 md:px-4 flex flex-col justify-center bg-transparent"
      >
        {/* Scroll to bottom button */}
        {isUserScrolling && (
          <div className="flex justify-center mb-2">
            <button
              onClick={() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                setIsUserScrolling(false);
              }}
              className="z-[9999] p-2 w-[36px] h-[36px] flex items-center justify-center text-black transition-colors bg-white rounded-full shadow-lg hover:bg-white/80"
              data-testid="scroll-to-bottom-button"
              aria-label="Scroll to bottom"
            >
              <ArrowUp className="w-6 h-6 rotate-180" />
            </button>
          </div>
        )}

        {/* Input Container */}
        <div className="relative flex items-center justify-center w-full md:pb-2 pb-0 md:backdrop-blur-md backdrop-blur-md">
          <div 
            className="flex flex-col md:p-1 p-0 max-w-full sm:max-w-4xl md:pt-1 pt-0 w-full md:rounded-[14px] md:backdrop-blur-[40px] shadow-sm md:bg-[#1A1A1C] rounded-t-[14px]"
            style={{ background: inputGradient }}
          >
            {/* Status Bar */}
            <div className="flex items-center justify-between w-full px-2 md:px-3 md:py-2">
              <div className="flex items-center gap-2">
                <AgentStatus status={agentStatus} />
              </div>
            </div>

            {/* Form */}
            <form 
              onSubmit={handleSubmit}
              className="flex flex-1 flex-col md:bg-[#0F0F10] bg-[#1A1A1C] rounded-none rounded-tl-[14px] rounded-tr-[14px] border relative md:rounded-xl"
              style={{ borderColor: emergentColors.border }}
            >
              {/* Border Beam Animation for Waiting State */}
              {isWaiting && (
                <div 
                  className="pointer-events-none absolute inset-0 rounded-[inherit]"
                  style={{
                    '--duration': '8',
                    '--delay': '0s',
                    '--size': '100',
                    '--anchor': '90',
                    '--color-from': emergentColors.agentWaitingPrimary,
                    '--color-to': 'transparent',
                    '--border-width': '1',
                  } as React.CSSProperties}
                >
                  <div 
                    className="absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent] ![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)] after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-border-beam after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--anchor)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]"
                    style={{
                      '--duration': '8',
                      '--delay': '0s',
                      '--size': '100',
                      '--anchor': '90',
                      '--color-from': emergentColors.agentWaitingPrimary,
                      '--color-to': 'transparent',
                      '--border-width': '1',
                    } as React.CSSProperties}
                  />
                </div>
              )}

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Agent"
                rows={2}
                className="w-full resize-none md:bg-[#0F0F10] bg-[#1A1A1C] outline-none text-[16px] px-4 py-3 min-h-[64px] overflow-y-auto placeholder:text-white/50 max-h-[200px] rounded-xl"
                style={{ lineHeight: 1.5, color: emergentColors.foreground }}
                disabled={isAgentBusy}
                data-testid="chat-input"
              />

              {/* Bottom Row */}
              <div 
                className="flex items-center justify-between p-2.5 md:bg-[#0F0F10] bg-[#1A1A1C] rounded-xl"
              >
                {/* Left Actions */}
                <div className="relative flex items-center gap-2">
                  {/* Attach Button */}
                  <button
                    type="button"
                    className="p-2 transition-colors duration-200 rounded-[30px] bg-[#FFFFFF14] hover:bg-gray-100/10 group/paperclip"
                    data-testid="chat-input-attach-button"
                  >
                    <svg className="size-5 transition-transform duration-200 transform group-hover/paperclip:rotate-45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* GitHub Button */}
                  <button
                    type="button"
                    className="p-2 pr-2.5 h-9 transition-colors duration-200 rounded-full flex items-center gap-1 bg-[#FFFFFF14] hover:bg-gray-100/10 opacity-50 cursor-not-allowed"
                    data-testid="chat-input-github-button"
                    disabled
                  >
                    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span className="text-sm font-medium text-[#E6E6E6]">Save to GitHub</span>
                  </button>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                  {/* Submit/Stop Button */}
                  {isAgentBusy ? (
                    <button
                      type="button"
                      onClick={onStop}
                      className="w-[48px] px-[12px] flex py-[6px] justify-center items-center gap-[10px] rounded-[38px] bg-[#ECECEC] transition-all duration-300 hover:bg-primary/90 cursor-pointer"
                      data-testid="chat-input-stop"
                    >
                      <Square className="w-6 h-6" style={{ color: emergentColors.background }} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      className="w-[48px] px-[12px] flex py-[6px] justify-center items-center gap-[10px] rounded-[38px] bg-[#ECECEC] transition-all duration-300 hover:bg-primary/90 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      data-testid="chat-input-submit"
                    >
                      <ArrowUp className="w-6 h-6" style={{ color: emergentColors.background }} />
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
