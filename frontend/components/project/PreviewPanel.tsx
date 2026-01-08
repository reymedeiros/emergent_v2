'use client';

import React, { useState } from 'react';
import { RefreshCw, ExternalLink, X, Share2 } from 'lucide-react';
import { useProjectStore } from '@/lib/store/projects';
import { Editor } from '../Editor';

interface PreviewPanelProps {
  previewUrl: string | null;
  showCode: boolean;
  onClose: () => void;
  projectId: string;
}

export function PreviewPanel({ previewUrl, showCode, onClose, projectId }: PreviewPanelProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const { files, selectedFile, selectFile } = useProjectStore();

  const handleRefresh = () => {
    setIsLoading(true);
    setRefreshKey(prev => prev + 1);
  };

  const handleOpenInNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  if (showCode) {
    return (
      <div className="flex flex-col h-full bg-background">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
          <span className="text-sm font-medium text-foreground">Code Editor</span>
          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-muted/50 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 overflow-hidden">
          <Editor />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
        <span className="text-sm font-medium text-foreground">App Preview</span>
        
        <div className="flex items-center gap-1">
          {/* Refresh */}
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-md hover:bg-muted/50 transition-colors"
            title="Refresh preview"
          >
            <RefreshCw className={`w-4 h-4 text-muted-foreground ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Open in new tab */}
          <button
            onClick={handleOpenInNewTab}
            className="p-1.5 rounded-md hover:bg-muted/50 transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-muted/50 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-[#0a1628] relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-[#2EBBE5] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-muted-foreground">Loading preview...</span>
            </div>
          </div>
        )}

        {previewUrl ? (
          <iframe
            key={refreshKey}
            src={previewUrl}
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            title="App Preview"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold text-foreground mb-8 tracking-wide">PLACEHOLDER PREVIEW</h2>
            
            {/* Demo Login Form */}
            <div className="w-full max-w-sm px-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-foreground mb-2">Email or Username</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg
                      text-foreground placeholder:text-muted-foreground
                      focus:outline-none focus:ring-2 focus:ring-[#2EBBE5]/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-foreground mb-2">Password</label>
                  <input 
                    type="password" 
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg
                      text-foreground placeholder:text-muted-foreground
                      focus:outline-none focus:ring-2 focus:ring-[#2EBBE5]/50"
                  />
                </div>
                <button className="w-full py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium
                  rounded-lg transition-colors">
                  Login
                </button>
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Contact your administrator for account access
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
