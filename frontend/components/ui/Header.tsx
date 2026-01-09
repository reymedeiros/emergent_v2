'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Settings, ChevronDown, LogOut, Users, User, HelpCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';
import { useTabStore } from '@/lib/store/tabs';
import { TabBar } from './TabBar';
import { ProviderSettings } from '../ProviderSettings';
import { UserManagement } from '../UserManagement';
import { emergentColors } from '@/lib/design-tokens';

export function Header() {
  const { user, logout } = useAuthStore();
  const { activeTabId } = useTabStore();
  const [showProviders, setShowProviders] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const providersRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setShowAvatarMenu(false);
      }
      if (providersRef.current && !providersRef.current.contains(e.target as Node)) {
        setShowProviders(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getUserInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <>
      <header 
        className="h-[56px] flex items-center justify-between px-4 z-50 relative"
        style={{ 
          backgroundColor: emergentColors.background,
          borderBottom: `1px solid ${emergentColors.border}`,
        }}
        data-testid="header"
      >
        {/* Left: Tab Bar */}
        <div className="flex items-center h-full">
          <TabBar />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Providers Button */}
          <div ref={providersRef} className="relative">
            <button
              onClick={() => setShowProviders(!showProviders)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: emergentColors.yellowPrimary,
                color: emergentColors.background,
              }}
              data-testid="providers-button"
            >
              <Settings className="w-4 h-4" />
              <span>Providers</span>
            </button>

            {showProviders && (
              <div 
                className="absolute right-0 top-full mt-2 w-64 rounded-lg shadow-xl z-50"
                style={{
                  backgroundColor: emergentColors.secondary,
                  border: `1px solid ${emergentColors.border}`,
                }}
              >
                <div className="p-4">
                  <h3 className="text-sm font-semibold mb-3" style={{ color: emergentColors.foreground }}>
                    LLM Providers
                  </h3>
                  <p className="text-xs mb-4" style={{ color: emergentColors.mutedForeground }}>
                    Configure your AI providers and API keys
                  </p>
                  <button
                    onClick={() => {
                      setShowProviders(false);
                      setShowProviderModal(true);
                    }}
                    className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: emergentColors.foreground,
                      color: emergentColors.background,
                    }}
                  >
                    Manage Providers
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Avatar Menu */}
          <div ref={avatarRef} className="relative">
            <button
              onClick={() => setShowAvatarMenu(!showAvatarMenu)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors"
              style={{
                backgroundColor: emergentColors.secondary,
                color: emergentColors.foreground,
                border: `1px solid ${emergentColors.border}`,
              }}
              data-testid="avatar-button"
            >
              {getUserInitial()}
            </button>

            {showAvatarMenu && (
              <div 
                className="absolute right-0 top-full mt-2 w-56 rounded-lg shadow-xl z-50 overflow-hidden"
                style={{
                  backgroundColor: emergentColors.secondary,
                  border: `1px solid ${emergentColors.border}`,
                }}
              >
                {/* User Info */}
                <div className="p-4" style={{ borderBottom: `1px solid ${emergentColors.border}` }}>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: emergentColors.background }}
                    >
                      {getUserInitial()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: emergentColors.foreground }}>
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs truncate" style={{ color: emergentColors.mutedForeground }}>
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button 
                    className="w-full px-4 py-2 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
                  >
                    <User className="w-4 h-4" style={{ color: emergentColors.mutedForeground }} />
                    <span className="text-sm" style={{ color: emergentColors.foreground }}>Profile</span>
                  </button>

                  {user?.isAdmin && (
                    <button 
                      onClick={() => {
                        setShowAvatarMenu(false);
                        setShowUserManagement(true);
                      }}
                      className="w-full px-4 py-2 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
                    >
                      <Users className="w-4 h-4" style={{ color: emergentColors.mutedForeground }} />
                      <span className="text-sm" style={{ color: emergentColors.foreground }}>User Management</span>
                    </button>
                  )}

                  <button 
                    className="w-full px-4 py-2 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
                  >
                    <HelpCircle className="w-4 h-4" style={{ color: emergentColors.mutedForeground }} />
                    <span className="text-sm" style={{ color: emergentColors.foreground }}>Help & Support</span>
                  </button>

                  <div className="my-2" style={{ borderTop: `1px solid ${emergentColors.border}` }} />

                  <button
                    onClick={logout}
                    className="w-full px-4 py-2 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-red-400">Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Provider Settings Modal */}
      {showProviderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div 
            className="w-full max-w-4xl h-[85vh] flex flex-col rounded-lg"
            style={{
              backgroundColor: emergentColors.background,
              border: `1px solid ${emergentColors.border}`,
            }}
          >
            <div 
              className="flex items-center justify-between p-4"
              style={{ borderBottom: `1px solid ${emergentColors.border}` }}
            >
              <h2 className="text-xl font-semibold" style={{ color: emergentColors.foreground }}>
                Provider Settings
              </h2>
              <button
                onClick={() => setShowProviderModal(false)}
                className="px-4 py-2 rounded-md transition"
                style={{
                  backgroundColor: emergentColors.secondary,
                  color: emergentColors.foreground,
                }}
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ProviderSettings />
            </div>
          </div>
        </div>
      )}

      {/* User Management Modal */}
      {showUserManagement && user?.isAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div 
            className="w-full max-w-3xl h-[80vh] flex flex-col rounded-lg"
            style={{
              backgroundColor: emergentColors.background,
              border: `1px solid ${emergentColors.border}`,
            }}
          >
            <div 
              className="flex items-center justify-between p-4"
              style={{ borderBottom: `1px solid ${emergentColors.border}` }}
            >
              <h2 className="text-xl font-semibold" style={{ color: emergentColors.foreground }}>
                User Management
              </h2>
              <button
                onClick={() => setShowUserManagement(false)}
                className="px-4 py-2 rounded-md transition"
                style={{
                  backgroundColor: emergentColors.secondary,
                  color: emergentColors.foreground,
                }}
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <UserManagement />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
