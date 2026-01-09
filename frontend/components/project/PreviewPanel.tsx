'use client';

import React, { useState, useRef } from 'react';
import { RefreshCw, ExternalLink, X } from 'lucide-react';
import { emergentColors } from '@/lib/design-tokens';

interface PreviewPanelProps {
  previewUrl?: string;
  onClose: () => void;
  onRefresh?: () => void;
}

export function PreviewPanel({ previewUrl, onClose, onRefresh }: PreviewPanelProps) {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      iframeRef.current.src = iframeRef.current.src;
    }
    onRefresh?.();
  };

  const handleOpenNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };

  return (
    <div 
      className="flex flex-col h-full"
      style={{ 
        backgroundColor: emergentColors.background,
      }}
      data-testid="preview-panel"
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 h-14 flex-shrink-0"
        style={{ borderBottom: `1px solid ${emergentColors.border}` }}
      >
        <span className="text-sm font-medium" style={{ color: emergentColors.foreground }}>
          App Preview
        </span>
        
        <div className="flex items-center gap-1">
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            title="Refresh preview"
          >
            <RefreshCw className="w-4 h-4" style={{ color: emergentColors.mutedForeground }} />
          </button>
          <button
            onClick={handleOpenNewTab}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" style={{ color: emergentColors.mutedForeground }} />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            title="Close preview"
            data-testid="close-preview"
          >
            <X className="w-4 h-4" style={{ color: emergentColors.mutedForeground }} />
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-hidden relative">
        {/* Loading state */}
        {isLoading && previewUrl && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="flex flex-col items-center gap-3">
              <div 
                className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: `${emergentColors.cyan} transparent transparent transparent` }}
              />
              <span className="text-sm" style={{ color: emergentColors.mutedForeground }}>
                Loading preview...
              </span>
            </div>
          </div>
        )}

        {/* Iframe */}
        {previewUrl ? (
          <iframe
            ref={iframeRef}
            src={previewUrl}
            className="w-full h-full border-0"
            onLoad={() => setIsLoading(false)}
            title="App Preview"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        ) : (
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="text-center">
              <h3 
                className="text-xl font-semibold mb-2"
                style={{ color: emergentColors.foreground }}
              >
                PLACEHOLDER PREVIEW
              </h3>
              <p className="text-sm" style={{ color: emergentColors.mutedForeground }}>
                Preview will appear here when the agent starts building
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
