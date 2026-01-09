'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Code, Eye } from 'lucide-react';
import { emergentColors } from '@/lib/design-tokens';
import { AgentChatPanel } from './AgentChatPanel';
import { PreviewPanel } from './PreviewPanel';
import { Message } from './MessageItem';

interface ProjectExecutionViewProps {
  projectId: string;
  projectName: string;
}

export function ProjectExecutionView({ projectId, projectName }: ProjectExecutionViewProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [agentStatus, setAgentStatus] = useState<'running' | 'waiting' | 'idle'>('running');
  const [messages, setMessages] = useState<Message[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [panelWidth, setPanelWidth] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);

  // Initialize with demo messages
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: '1',
        role: 'agent',
        content: `Now let me check the fonts directory and ensure they're properly set up:`,
        timestamp: new Date(),
        type: 'text',
      },
      {
        id: '2',
        role: 'agent',
        content: `$ ls -la /app/frontend/public/fonts/ 2>/dev/null | ...`,
        timestamp: new Date(),
        type: 'step',
        status: 'completed',
        fileName: '$ ls -la /app/frontend/public/fonts/ 2>/dev/null | ...',
        expandedContent: 'total 200\ndrwxr-xr-x 2 root root  4096 Jan  9 12:08 .\ndrwxr-xr-x 3 root root  4096 Jan  9 12:08 ..\n-rw-r--r-- 1 root root 41108 Jan  9 12:08 Brockmann-Medium-DWnaEPVI.otf\n-rw-r--r-- 1 root root 40164 Jan  9 12:08 Brockmann-Regular-CFBdZhjj.otf',
      },
      {
        id: '3',
        role: 'agent',
        content: `Viewed /app/sample_assets`,
        timestamp: new Date(),
        type: 'step',
        status: 'completed',
        fileName: 'Viewed /app/sample_assets',
      },
      {
        id: '4',
        role: 'agent',
        content: `Let me also check the existing API structure and backend to understand the websocket/message handling:`,
        timestamp: new Date(),
        type: 'text',
      },
      {
        id: '5',
        role: 'agent',
        content: `Viewed /app/frontend/lib/api.ts`,
        timestamp: new Date(),
        type: 'step',
        status: 'completed',
        fileName: 'Viewed /app/frontend/lib/api.ts',
      },
      {
        id: '6',
        role: 'agent',
        content: `Now I have a good understanding of the codebase. Let me create the implementation plan and start building the UI components. I'll create the design tokens and new components to match the Emergent.sh UI.`,
        timestamp: new Date(),
        type: 'text',
      },
      {
        id: '7',
        role: 'agent',
        content: `Created 7 files`,
        timestamp: new Date(),
        type: 'step',
        status: 'completed',
        fileName: 'Created 7 files',
      },
    ];
    setMessages(initialMessages);
  }, []);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'human',
      content,
      timestamp: new Date(),
      type: 'text',
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate agent response
    setAgentStatus('running');
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: 'Processing your request...',
        timestamp: new Date(),
        type: 'text',
      };
      setMessages(prev => [...prev, agentResponse]);
      setAgentStatus('waiting');
    }, 2000);
  };

  const handleStop = () => {
    setAgentStatus('waiting');
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleToggleCode = () => {
    setShowCode(!showCode);
    if (!showCode) {
      setShowPreview(false);
    }
  };

  const handleTogglePreview = () => {
    setShowPreview(!showPreview);
    if (!showPreview) {
      setShowCode(false);
    }
  };

  // Handle resizer drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const container = document.getElementById('split-container');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
      setPanelWidth(Math.min(Math.max(newWidth, 20), 80));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const isSplitView = showPreview || showCode;

  return (
    <div className="flex flex-col h-full" data-testid="project-execution-view">
      {/* Action Buttons - Top Right */}
      <div 
        className="absolute top-[14px] right-4 z-20 flex items-center gap-2"
        data-testid="project-actions"
      >
        <button
          onClick={handleToggleCode}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all`}
          style={{
            backgroundColor: showCode ? emergentColors.secondary : 'transparent',
            border: `1px solid ${emergentColors.border}`,
            color: emergentColors.foreground,
          }}
          data-testid="code-button"
        >
          <Code className="w-4 h-4" />
          Code
        </button>
        <button
          onClick={handleTogglePreview}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all`}
          style={{
            backgroundColor: showPreview ? emergentColors.secondary : 'transparent',
            border: `1px solid ${emergentColors.border}`,
            color: emergentColors.foreground,
          }}
          data-testid="preview-button"
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
      </div>

      {/* Main Content Area */}
      <div id="split-container" className="flex flex-1 overflow-hidden">
        {/* Agent Chat Panel */}
        <div 
          className="transition-all duration-300"
          style={{ width: isSplitView ? `${panelWidth}%` : '100%' }}
        >
          <AgentChatPanel
            messages={messages}
            agentStatus={agentStatus}
            onSendMessage={handleSendMessage}
            onStop={handleStop}
          />
        </div>

        {/* Resizable Divider */}
        {isSplitView && (
          <div
            onMouseDown={handleMouseDown}
            className={`
              h-full relative w-px items-center justify-center
              after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2
              group hover:bg-[#00CCAF]/60 transition-colors duration-200 hidden md:flex
              ${isDragging ? 'bg-[#00CCAF]/60' : 'bg-[#242424]'}
            `}
            style={{ cursor: 'col-resize' }}
          >
            <div 
              className={`
                z-10 min-w-2 min-h-6 border rounded-md transition-all duration-200
                group-hover:bg-[#00CCAF] group-hover:border-[#00CCAF]
                ${isDragging ? 'bg-[#00CCAF] border-[#00CCAF]' : 'bg-[#242424] border-[#242424]'}
              `}
            />
          </div>
        )}

        {/* Preview Panel - Right side */}
        {showPreview && (
          <div 
            className="flex-shrink-0 transition-all duration-300"
            style={{ 
              width: `${100 - panelWidth}%`,
              borderLeft: `1px solid ${emergentColors.divider}`,
            }}
          >
            <PreviewPanel
              previewUrl={previewUrl}
              onClose={handleClosePreview}
            />
          </div>
        )}

        {/* Code Panel - Right side */}
        {showCode && !showPreview && (
          <div 
            className="flex-shrink-0 transition-all duration-300"
            style={{ 
              width: `${100 - panelWidth}%`,
              backgroundColor: emergentColors.background,
              borderLeft: `1px solid ${emergentColors.divider}`,
            }}
          >
            <div 
              className="flex items-center justify-between px-4 h-14" 
              style={{ borderBottom: `1px solid ${emergentColors.border}` }}
            >
              <span className="text-sm font-medium" style={{ color: emergentColors.foreground }}>
                Code
              </span>
              <button
                onClick={() => setShowCode(false)}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <span style={{ color: emergentColors.mutedForeground }}>✕</span>
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm" style={{ color: emergentColors.mutedForeground }}>
                Code editor will appear here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
