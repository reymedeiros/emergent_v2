'use client';

import React from 'react';
import { ParticleBackground } from '../ui/ParticleBackground';
import { HeroSection } from './HeroSection';
import { PromptInput } from './PromptInput';
import { RecentTasks } from './RecentTasks';
import { colors } from '@/lib/design-tokens';

export function HomeView() {
  return (
    <div 
      className="relative min-h-full overflow-y-auto"
      style={{ backgroundColor: colors.background }}
      data-testid="home-view"
    >
      {/* Animated Background - Only visible on home */}
      <ParticleBackground />

      {/* Main Content */}
      <div className="relative z-10 pt-8 pb-16">
        <div className="px-8">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="pt-12 pb-8">
              <HeroSection />
            </div>

            {/* Prompt Input */}
            <div className="pb-8">
              <PromptInput />
            </div>

            {/* Recent Tasks */}
            <div className="pb-16">
              <RecentTasks />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
