'use client';

import React from 'react';

export function HeroSection() {
  return (
    <div className="text-center mb-12 animate-fade-in">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4 tracking-tight">
        <span className="gradient-text">Where ideas become reality</span>
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Build fully functional applications and websites through simple conversations
      </p>
    </div>
  );
}
