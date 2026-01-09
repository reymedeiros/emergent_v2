'use client';

import React, { useState, useRef } from 'react';
import { emergentColors } from '@/lib/design-tokens';

// SVG Icons
const RefreshIcon = () => (
  <svg aria-label="Refresh icon" fill="none" focusable="false" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10.0418 16.6667C8.18072 16.6667 6.59738 16.0209 5.29183 14.7292C3.98627 13.4375 3.3335 11.8612 3.3335 10V9.85421L2.00016 11.1875L0.833496 10.0209L4.16683 6.68754L7.50016 10.0209L6.3335 11.1875L5.00016 9.85421V10C5.00016 11.3889 5.48975 12.5695 6.46891 13.5417C7.44808 14.5139 8.63905 15 10.0418 15C10.4029 15 10.7571 14.9584 11.1043 14.875C11.4516 14.7917 11.7918 14.6667 12.1252 14.5L13.3752 15.75C12.8474 16.0556 12.3057 16.2848 11.7502 16.4375C11.1946 16.5903 10.6252 16.6667 10.0418 16.6667ZM15.8335 13.3125L12.5002 9.97921L13.6668 8.81254L15.0002 10.1459V10C15.0002 8.61115 14.5106 7.4306 13.5314 6.45837C12.5522 5.48615 11.3613 5.00004 9.9585 5.00004C9.59738 5.00004 9.24322 5.04171 8.896 5.12504C8.54877 5.20837 8.2085 5.33337 7.87516 5.50004L6.62516 4.25004C7.15294 3.94449 7.69461 3.71532 8.25016 3.56254C8.80572 3.40976 9.37516 3.33337 9.9585 3.33337C11.8196 3.33337 13.4029 3.97921 14.7085 5.27087C16.014 6.56254 16.6668 8.13893 16.6668 10V10.1459L18.0002 8.81254L19.1668 9.97921L15.8335 13.3125Z"
      fill="#737380" 
      style={{ transition: 'fill 0.2s' }}
    />
  </svg>
);

const NewTabIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.43188 5.13649C6.43193 4.83302 6.5525 4.54199 6.76709 4.3274C6.98168 4.11281 7.27271 3.99223 7.57619 3.99219L14.8596 3.99219C15.1631 3.99223 15.4541 4.11281 15.6687 4.3274C15.8833 4.54199 16.0039 4.83302 16.0039 5.13649V12.4199C15.9987 12.72 15.8758 13.0059 15.6618 13.2163C15.4478 13.4266 15.1597 13.5445 14.8596 13.5445C14.5595 13.5445 14.2714 13.4266 14.0574 13.2163C13.8434 13.0059 13.7205 12.72 13.7153 12.4199L13.6457 7.96893L5.95765 15.657C5.74302 15.8716 5.45192 15.9922 5.14838 15.9922C4.84485 15.9922 4.55375 15.8716 4.33912 15.657C4.12448 15.4423 4.00391 15.1512 4.00391 14.8477C4.00391 14.5442 4.12448 14.2531 4.33912 14.0384L12.0272 6.35039L7.57619 6.2808C7.27271 6.28075 6.98168 6.16018 6.76709 5.94559C6.5525 5.731 6.43193 5.43997 6.43188 5.13649Z" fill="#737380"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M4.26008 4.26399C4.61208 3.912 5.18276 3.912 5.53475 4.26399L9.99609 8.72533L14.4574 4.26399C14.8094 3.912 15.3801 3.912 15.7321 4.26399C16.0841 4.61598 16.0841 5.18667 15.7321 5.53865L11.2707 9.99998L15.7321 14.4613C16.0841 14.8133 16.0841 15.384 15.7321 15.736C15.3801 16.088 14.8094 16.088 14.4574 15.736L9.99609 11.2746L5.53475 15.736C5.18276 16.088 4.61208 16.088 4.26008 15.736C3.9081 15.384 3.9081 14.8133 4.26008 14.4613L8.72143 9.99998L4.26008 5.53865C3.9081 5.18667 3.9081 4.61598 4.26008 4.26399Z" fill="#737380"/>
  </svg>
);

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
      className="w-full h-full bg-[#111112] max-md:absolute max-md:inset-0 relative block"
      data-testid="preview-panel"
    >
      <div className="flex flex-col h-full">
        {/* Header - exact match from HTML */}
        <div className="pointer-events-auto">
          <div 
            className="p-4 px-0 md:p-4 bg-[#111112] z-[2] flex items-center justify-between border-b border-[#242424]/60"
          >
            <div className="text-[#939399] font-['Brockmann'] text-[15px] md:text-[18px] font-medium leading-[24px]">
              App Preview
            </div>
            
            <div className="flex items-center gap-2">
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                className="w-8 h-8 bg-[#FFFFFF0A] hover:bg-[#FFFFFF14] flex items-center justify-center rounded-[6px]"
                title="Refresh"
                data-testid="preview-panel-refresh-button"
              >
                <RefreshIcon />
              </button>
              
              {/* Open in New Tab Button */}
              <button
                onClick={handleOpenNewTab}
                className="w-8 h-8 bg-[#FFFFFF0A] hover:bg-[#FFFFFF14] flex items-center justify-center rounded-[6px]"
                title="Open in new tab"
                data-testid="preview-panel-open-new-tab-button"
              >
                <NewTabIcon />
              </button>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-8 h-8 bg-[#FFFFFF0A] hover:bg-[#FFFFFF14] flex items-center justify-center rounded-[6px]"
                title="Close"
                data-testid="preview-panel-close-button"
              >
                <CloseIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="relative flex-1 p-0 overflow-hidden pointer-events-auto">
          <div className="w-full h-full flex items-center justify-center">
            <div className="h-full w-full">
              {/* Loading state */}
              {isLoading && previewUrl && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-[#111112]">
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
                <div className="relative w-full h-full">
                  <iframe
                    ref={iframeRef}
                    src={previewUrl}
                    className="flex-1 w-full h-full overflow-y-auto border-0 rounded-sm"
                    onLoad={() => setIsLoading(false)}
                    title="URL Preview"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation"
                    style={{ pointerEvents: 'auto', transformOrigin: 'left top', zIndex: 10 }}
                  />
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <iframe
                    className="flex-1 w-full h-full overflow-y-auto border-0 rounded-sm"
                    srcDoc="<html><meta charset=utf-8><meta name=color-scheme content='light dark'><body style='display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#111112;color:#939399;font-family:Brockmann,sans-serif'><pre style='word-wrap:break-word;white-space:pre-wrap'>PLACEHOLDER APP PREVIEW</pre>"
                    title="URL Preview"
                    style={{ pointerEvents: 'auto', transformOrigin: 'left top', zIndex: 10 }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
