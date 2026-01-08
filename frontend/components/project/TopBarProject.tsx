'use client';

import React from 'react';
import { Code, Eye, Rocket, Info } from 'lucide-react';

interface TopBarProjectProps {
  onToggleCode: () => void;
  onTogglePreview: () => void;
  showCode: boolean;
  showPreview: boolean;
}

export function TopBarProject({ onToggleCode, onTogglePreview, showCode, showPreview }: TopBarProjectProps) {
  return (
    <div className="flex items-center justify-end gap-2 px-4 py-2 bg-background/80 backdrop-blur-md border-b border-border">
      {/* Info Button */}
      <button
        className="p-2 rounded-lg hover:bg-secondary transition-colors"
        title="Info"
      >
        <Info className="w-4 h-4 text-muted-foreground" />
      </button>

      {/* Code Button */}
      <button
        onClick={onToggleCode}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
          transition-all duration-200
          ${showCode 
            ? 'bg-secondary text-foreground border border-border' 
            : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground border border-transparent'
          }`}
      >
        <Code className="w-4 h-4" />
        <span>Code</span>
      </button>

      {/* Preview Button */}
      <button
        onClick={onTogglePreview}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
          transition-all duration-200
          ${showPreview 
            ? 'bg-secondary text-foreground border border-border' 
            : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground border border-transparent'
          }`}
      >
        <Eye className="w-4 h-4" />
        <span>Preview</span>
      </button>
    </div>
  );
}
