'use client';

import React, { useState, useEffect } from 'react';
import { Code, Eye } from 'lucide-react';
import { colors } from '@/lib/design-tokens';
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
  const [agentStatus, setAgentStatus] = useState<'running' | 'waiting' | 'idle'>('waiting');
  const [messages, setMessages] = useState<Message[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();

  // Initialize with welcome message
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
      },
      {
        id: '3',
        role: 'agent',
        content: `$ ls -la /app/sample_assets/`,
        timestamp: new Date(),
        type: 'step',
        status: 'completed',
        fileName: '$ ls -la /app/sample_assets/',
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
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        type: 'step',
        status: 'completed',
        fileName: 'Created 7 files',
      },
    ];
    setMessages(initialMessages);
  }, []);

  // Auto-open preview when agent starts processing
  useEffect(() => {
    if (agentStatus === 'running' && !showPreview) {
      // Give a slight delay before opening preview
      const timer = setTimeout(() => {
        setShowPreview(true);
        setPreviewUrl('http://localhost:3000'); // Default preview URL
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [agentStatus, showPreview]);

  const handleSendMessage = (content: string) => {
    // Add human message
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

  return (
    <div className="flex flex-col h-full" data-testid="project-execution-view">
      {/* Action Buttons - Top Right */}
      <div 
        className="absolute top-2 right-4 z-20 flex items-center gap-2"
        data-testid="project-actions"
      >
        <button
          onClick={handleToggleCode}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            showCode ? 'opacity-100' : 'opacity-80 hover:opacity-100'
          }`}
          style={{
            backgroundColor: showCode ? colors.secondary : colors.secondary,
            border: `1px solid ${colors.border}`,
            color: colors.foreground,
          }}
          data-testid="code-button"
        >
          <Code className="w-4 h-4" />
          Code
        </button>
        <button
          onClick={handleTogglePreview}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            showPreview ? 'opacity-100' : 'opacity-80 hover:opacity-100'
          }`}
          style={{
            backgroundColor: showPreview ? colors.secondary : colors.secondary,
            border: `1px solid ${colors.border}`,
            color: colors.foreground,
          }}
          data-testid="preview-button"
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Agent Chat Panel - Full width or left side */}
        <div className={`flex-1 ${showPreview || showCode ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
          <AgentChatPanel
            messages={messages}
            agentStatus={agentStatus}
            onSendMessage={handleSendMessage}
            onStop={handleStop}
          />
        </div>

        {/* Preview Panel - Right side */}
        {showPreview && (
          <div className="w-1/2 flex-shrink-0 transition-all duration-300">
            <PreviewPanel
              previewUrl={previewUrl}
              onClose={handleClosePreview}
            />
          </div>
        )}

        {/* Code Panel - Right side */}
        {showCode && !showPreview && (
          <div 
            className="w-1/2 flex-shrink-0 transition-all duration-300"
            style={{ 
              backgroundColor: colors.background,
              borderLeft: `1px solid ${colors.border}`,
            }}
          >
            <div className="flex items-center justify-between px-4 h-14" style={{ borderBottom: `1px solid ${colors.border}` }}>
              <span className="text-sm font-medium" style={{ color: colors.foreground }}>
                Code
              </span>
              <button
                onClick={() => setShowCode(false)}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <span style={{ color: colors.mutedForeground }}>✕</span>
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm" style={{ color: colors.mutedForeground }}>
                Code editor will appear here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
