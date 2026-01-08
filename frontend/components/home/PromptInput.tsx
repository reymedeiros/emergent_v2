'use client';

import React, { useState } from 'react';
import { 
  Paperclip, 
  Github, 
  Globe, 
  Lock, 
  Mic, 
  ArrowRight,
  ChevronDown,
  Sparkles,
  Search
} from 'lucide-react';
import { useTabStore } from '@/lib/store/tabs';
import { useProjectStore } from '@/lib/store/projects';

const AI_MODELS = [
  { id: 'claude-4.5', name: 'Claude 4.5 Sonnet', icon: '✨' },
  { id: 'gpt-4', name: 'GPT-4 Turbo', icon: '🤖' },
  { id: 'gemini-pro', name: 'Gemini Pro', icon: '💎' },
  { id: 'llama-3', name: 'Llama 3', icon: '🦙' },
];

export function PromptInput() {
  const [prompt, setPrompt] = useState('');
  const [repoType, setRepoType] = useState<'private' | 'public'>('public');
  const [repoUrl, setRepoUrl] = useState('');
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  const { addTab } = useTabStore();
  const { createProject } = useProjectStore();

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    try {
      // Create project and add tab
      const projectName = prompt.slice(0, 30) + (prompt.length > 30 ? '...' : '');
      await createProject(projectName, prompt, prompt);
      
      // Add a new tab for this project
      const tabId = `project-${Date.now()}`;
      addTab({
        id: tabId,
        title: projectName,
        type: 'project',
        projectId: tabId,
      });

      setPrompt('');
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
      {/* Main Input Card */}
      <div className="bg-secondary/50 border border-border rounded-2xl p-4 backdrop-blur-sm">
        {/* Textarea */}
        <div className="mb-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Build me a SaaS application for..."
            className="
              w-full bg-transparent text-foreground placeholder:text-muted-foreground
              text-lg resize-none outline-none min-h-[80px]
            "
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) {
                handleSubmit();
              }
            }}
          />
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between">
          {/* Left Actions */}
          <div className="flex items-center gap-2">
            <button 
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Attach file"
            >
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </button>
            <button 
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Import from GitHub"
            >
              <Github className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Model Selector */}
            <div className="relative">
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="
                  flex items-center gap-2 px-3 py-1.5 rounded-lg
                  hover:bg-muted transition-colors text-sm
                "
              >
                <Sparkles className="w-4 h-4 text-cyan" />
                <span>{selectedModel.name}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showModelDropdown && (
                <div className="
                  absolute left-0 top-full mt-2 w-56
                  bg-popover border border-border rounded-lg shadow-xl
                  dropdown-enter z-50 py-2
                ">
                  {AI_MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model);
                        setShowModelDropdown(false);
                      }}
                      className={`
                        w-full px-4 py-2 flex items-center gap-3 text-left
                        hover:bg-secondary transition-colors text-sm
                        ${selectedModel.id === model.id ? 'bg-secondary' : ''}
                      `}
                    >
                      <span>{model.icon}</span>
                      <span>{model.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Public/Private Toggle */}
            <button 
              onClick={() => setIsPublic(!isPublic)}
              className="
                flex items-center gap-2 px-3 py-1.5 rounded-lg
                hover:bg-muted transition-colors text-sm
              "
            >
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span>{isPublic ? 'Public' : 'Private'}</span>
            </button>

            {/* Additional Options */}
            <button className="p-2 rounded-lg hover:bg-muted transition-colors">
              <svg className="w-5 h-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>

            {/* Mic Button */}
            <button className="p-2 rounded-lg hover:bg-muted transition-colors">
              <Mic className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!prompt.trim()}
              className="
                w-10 h-10 rounded-full bg-foreground text-background
                flex items-center justify-center
                hover:bg-foreground/90 transition-all
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:scale-105 active:scale-95
              "
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Repository Options */}
      <div className="mt-4 bg-secondary/30 border border-border rounded-xl p-4 backdrop-blur-sm">
        {/* Repo Type Toggle */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setRepoType('private')}
            className={`
              flex-1 flex items-center justify-center gap-2 py-3 rounded-lg
              transition-all duration-200
              ${repoType === 'private' 
                ? 'bg-secondary text-foreground' 
                : 'hover:bg-secondary/50 text-muted-foreground'
              }
            `}
          >
            <Lock className="w-4 h-4" />
            <span>Private repository</span>
          </button>
          <button
            onClick={() => setRepoType('public')}
            className={`
              flex-1 flex items-center justify-center gap-2 py-3 rounded-lg
              transition-all duration-200
              ${repoType === 'public' 
                ? 'bg-secondary text-foreground' 
                : 'hover:bg-secondary/50 text-muted-foreground'
              }
            `}
          >
            <Globe className="w-4 h-4" />
            <span>Public repository</span>
          </button>
        </div>

        {/* Repo URL Input */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Globe className="w-4 h-4" />
              Repository URL
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="Enter a GitHub repository URL"
                className="
                  w-full bg-background border border-border rounded-lg
                  pl-10 pr-4 py-3 text-sm
                  placeholder:text-muted-foreground
                  focus:outline-none focus:ring-2 focus:ring-ring
                "
              />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 3v12" />
                <circle cx="18" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <path d="M18 9a9 9 0 0 1-9 9" />
              </svg>
              Branch
            </label>
            <select
              className="
                w-full bg-background border border-border rounded-lg
                px-4 py-3 text-sm appearance-none cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-ring
              "
            >
              <option value="">Select a branch</option>
              <option value="main">main</option>
              <option value="master">master</option>
              <option value="develop">develop</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
