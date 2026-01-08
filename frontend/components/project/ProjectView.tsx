'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useProjectStore } from '@/lib/store/projects';
import { useTabStore } from '@/lib/store/tabs';
import { AgentPanel } from './AgentPanel';
import { PreviewPanel } from './PreviewPanel';
import { TopBarProject } from './TopBarProject';

interface Message {
  id: string;
  type: 'agent' | 'user' | 'system' | 'command';
  content: string;
  timestamp: Date;
  status?: 'running' | 'success' | 'error';
  isExpanded?: boolean;
}

export function ProjectView() {
  const { currentProject } = useProjectStore();
  const { activeTabId } = useTabStore();
  const [showPreview, setShowPreview] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAgentWorking, setIsAgentWorking] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Initialize with welcome message when project loads
  useEffect(() => {
    if (currentProject) {
      setMessages([{
        id: 'welcome',
        type: 'agent',
        content: `Starting work on: ${currentProject.name}`,
        timestamp: new Date(),
      }]);
    }
  }, [currentProject?._id]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!currentProject) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const wsProtocol = apiUrl.startsWith('https') ? 'wss' : 'ws';
    const wsHost = apiUrl.replace(/^https?:\/\//, '') || window.location.host;
    const wsUrl = `${wsProtocol}://${wsHost}/api/build/${currentProject._id}?token=${encodeURIComponent(token)}`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsAgentWorking(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        setIsAgentWorking(false);
      };

      return () => {
        ws.close();
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
    }
  }, [currentProject?._id]);

  const handleWebSocketMessage = (data: any) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      type: data.type === 'command' ? 'command' : data.type === 'error' ? 'system' : 'agent',
      content: data.message || data.content || JSON.stringify(data),
      timestamp: new Date(),
      status: data.status || (data.type === 'error' ? 'error' : 'success'),
    };

    setMessages(prev => [...prev, newMessage]);

    // Auto-open preview when agent starts working
    if (data.type === 'preview' && data.url) {
      setPreviewUrl(data.url);
      setShowPreview(true);
    }

    if (data.type === 'complete') {
      setIsAgentWorking(false);
    }
  };

  const handleSendMessage = useCallback((content: string) => {
    if (!content.trim() || !wsRef.current) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    if (wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'message', content }));
    }
  }, []);

  const togglePreview = () => {
    setShowPreview(!showPreview);
    if (!showPreview) {
      setShowCode(false);
    }
  };

  const toggleCode = () => {
    setShowCode(!showCode);
    if (!showCode) {
      setShowPreview(false);
    }
  };

  const closePreview = () => {
    setShowPreview(false);
  };

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <p className="text-muted-foreground">Select a project to view</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Bar with Code/Preview/Deploy buttons */}
      <TopBarProject 
        onToggleCode={toggleCode}
        onTogglePreview={togglePreview}
        showCode={showCode}
        showPreview={showPreview}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Agent Interaction Panel */}
        <div className={`flex flex-col transition-all duration-300 ${
          showPreview || showCode ? 'w-1/2' : 'w-full'
        }`}>
          <AgentPanel 
            messages={messages}
            isAgentWorking={isAgentWorking}
            onSendMessage={handleSendMessage}
          />
        </div>

        {/* Preview/Code Panel */}
        {(showPreview || showCode) && (
          <div className="w-1/2 border-l border-border">
            <PreviewPanel 
              previewUrl={previewUrl}
              showCode={showCode}
              onClose={closePreview}
              projectId={currentProject._id}
            />
          </div>
        )}
      </div>
    </div>
  );
}
