'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
import { Paperclip, Github, Mic, ArrowUp, Sparkles } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  isDisabled?: boolean;
  placeholder?: string;
}

export function MessageInput({ onSendMessage, isDisabled, placeholder = 'Message Agent' }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isUltraMode, setIsUltraMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!message.trim() || isDisabled) return;
    onSendMessage(message);
    setMessage('');
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  return (
    <div className="px-4 py-3">
      {/* Agent Status */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-[#2EBBE5]" />
        <span className="text-sm text-[#2EBBE5]">Agent is waiting...</span>
      </div>

      {/* Input Container */}
      <div className="bg-secondary/50 rounded-xl border border-border/50 p-1">
        {/* Textarea */}
        <div className="px-3 py-2">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isDisabled}
            rows={1}
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground
              text-sm resize-none outline-none min-h-[24px] max-h-[150px]
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between px-2 pb-2">
          {/* Left Actions */}
          <div className="flex items-center gap-1">
            {/* Attachment */}
            <button 
              className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
              title="Attach file"
            >
              <Paperclip className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Save to GitHub */}
            <button 
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                hover:bg-muted/50 transition-colors text-sm text-muted-foreground"
            >
              <Github className="w-4 h-4" />
              <span>Save to GitHub</span>
            </button>

            {/* Summarize */}
            <button 
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                hover:bg-muted/50 transition-colors text-sm text-muted-foreground"
            >
              <Sparkles className="w-4 h-4" />
              <span>Summarize</span>
            </button>

            {/* Ultra Toggle */}
            <button 
              onClick={() => setIsUltraMode(!isUltraMode)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                transition-colors text-sm
                ${isUltraMode 
                  ? 'bg-[#2EBBE5]/20 text-[#2EBBE5]' 
                  : 'hover:bg-muted/50 text-muted-foreground'
                }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
              <span>Ultra</span>
              <div className={`w-6 h-3.5 rounded-full transition-colors relative
                ${isUltraMode ? 'bg-[#2EBBE5]' : 'bg-muted-foreground/30'}`}
              >
                <div className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-all
                  ${isUltraMode ? 'left-3' : 'left-0.5'}`}
                />
              </div>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Mic Button */}
            <button 
              className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
              title="Voice input"
            >
              <Mic className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Send Button */}
            <button
              onClick={handleSubmit}
              disabled={!message.trim() || isDisabled}
              className="w-8 h-8 rounded-full bg-foreground/10 border border-border
                flex items-center justify-center
                hover:bg-foreground/20 transition-all
                disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowUp className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
