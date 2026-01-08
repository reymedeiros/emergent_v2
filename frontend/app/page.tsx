'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { LoginForm } from '@/components/LoginForm';
import { MainLayout } from '@/components/home/MainLayout';
import { colors } from '@/lib/design-tokens';

export default function Home() {
  const { token, isLoading, isInitialized, verifyToken } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Verify token on mount if it exists
  useEffect(() => {
    if (mounted && isInitialized && token) {
      // Verify the token is still valid
      verifyToken().then((isValid) => {
        if (!isValid) {
          console.log('Token invalid, redirecting to login');
          router.push('/');
        }
      });
    }
  }, [mounted, isInitialized, token, verifyToken, router]);

  // Show loading state while mounting or initializing
  if (!mounted || !isInitialized || isLoading) {
    return (
      <div 
        className="flex items-center justify-center h-screen"
        style={{ backgroundColor: colors.background }}
      >
        <div className="flex flex-col items-center gap-3">
          <div 
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: `${colors.cyanAccent} transparent transparent transparent` }}
          />
          <span className="text-sm" style={{ color: colors.mutedForeground }}>
            Loading...
          </span>
        </div>
      </div>
    );
  }

  // Show login form if no token
  if (!token) {
    return <LoginForm />;
  }

  // Show main layout with tab-based navigation
  return <MainLayout />;
}