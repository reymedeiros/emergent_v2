'use client';

import React from 'react';
import { ParticleBackground } from '../ui/ParticleBackground';
import { HeroSection } from './HeroSection';
import { PromptInput } from './PromptInput';
import { RecentTasks } from './RecentTasks';

export function HomeView() {
  return (
    <div className="relative min-h-[calc(100vh-56px)] overflow-y-auto">
      {/* Animated Background */}
      <ParticleBackground />

      {/* Content */}
      <div className="relative z-10 px-8 py-16">
        <HeroSection />
        <PromptInput />
        <RecentTasks />
      </div>
    </div>
  );
}
