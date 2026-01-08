'use client';

import React, { useEffect } from 'react';
import { RefreshCw, MoreHorizontal, FileText, Globe } from 'lucide-react';
import { useProjectStore } from '@/lib/store/projects';
import { useTabStore } from '@/lib/store/tabs';
import { useAuthStore } from '@/lib/store/auth';

interface Task {
  id: string;
  name: string;
  description: string;
  lastModified: string;
}

export function RecentTasks() {
  const { projects, loadProjects, selectProject } = useProjectStore();
  const { addTab } = useTabStore();
  const { token } = useAuthStore();

  useEffect(() => {
    if (token) {
      loadProjects();
    }
  }, [token, loadProjects]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  const handleTaskClick = async (project: any) => {
    await selectProject(project._id);
    addTab({
      id: `project-${project._id}`,
      title: project.name.slice(0, 20) + (project.name.length > 20 ? '...' : ''),
      type: 'project',
      projectId: project._id,
    });
  };

  return (
    <div 
      className="w-full max-w-5xl mx-auto mt-16 animate-fade-in" 
      style={{ animationDelay: '0.2s' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-foreground font-medium">
            <FileText className="w-4 h-4" />
            Recent Tasks
          </button>
          <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Globe className="w-4 h-4" />
            Deployed Apps
          </button>
        </div>
        <button 
          onClick={() => loadProjects()}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Table */}
      <div className="bg-secondary/30 border border-border rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-border text-sm text-muted-foreground">
          <div className="col-span-2">ID</div>
          <div className="col-span-7">TASK</div>
          <div className="col-span-3">LAST MODIFIED</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border">
          {projects.length === 0 ? (
            <div className="px-6 py-12 text-center text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recent tasks</p>
              <p className="text-sm mt-1">Start a new project by entering a prompt above</p>
            </div>
          ) : (
            projects.slice(0, 10).map((project) => (
              <div
                key={project._id}
                onClick={() => handleTaskClick(project)}
                className="
                  grid grid-cols-12 gap-4 px-6 py-4
                  hover:bg-secondary/50 cursor-pointer transition-colors
                  group
                "
              >
                <div className="col-span-2 text-sm text-muted-foreground font-mono">
                  EMT - {project._id.slice(-6)}
                </div>
                <div className="col-span-7">
                  <p className="text-sm font-medium mb-1">{project.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {project.description || project.prompt}
                  </p>
                </div>
                <div className="col-span-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {formatTimeAgo(project.createdAt)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Show options menu
                    }}
                    className="
                      p-1.5 rounded hover:bg-muted transition-colors
                      opacity-0 group-hover:opacity-100
                    "
                  >
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
