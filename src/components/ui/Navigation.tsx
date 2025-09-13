'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '../../contexts/ThemeContext';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, isAdminUser } from '../../lib/auth';

interface NavItem {
  href: string;
  label: string;
  icon?: string;
}

const navigationItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { href: '/ai-tools', label: 'AI Tools', icon: '🤖' },
  { href: '/stats', label: 'Stats', icon: '📊' },
  { href: '/admin', label: 'Admin', icon: '⚙️' },
  { href: '/settings', label: 'Settings', icon: '🛠️' }
];

interface NavigationProps {
  title?: string;
  showBackButton?: boolean;
  backUrl?: string;
  children?: React.ReactNode;
}

export default function Navigation({ 
  title = 'T&P Ambassador Tool', 
  showBackButton = false, 
  backUrl,
  children 
}: NavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, loading] = useAuthState(auth);

  // Filter navigation items based on admin status
  const filteredNavItems = navigationItems.filter(item => {
    if (item.href === '/admin') {
      return user && isAdminUser(user.email || '');
    }
    return true;
  });

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {showBackButton && (
                <button
                  onClick={handleBack}
                  className="mr-4 p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Go back"
                >
                  ← Back
                </button>
              )}
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {title}
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <nav className="flex items-center space-x-1">
                {filteredNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="mr-1">{item.icon}</span>
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              
              {/* Theme Toggle */}
              <ThemeToggle />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <button
                className="p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  // Toggle mobile menu (implement if needed)
                }}
              >
                <span className="sr-only">Open main menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Additional content */}
      {children}
    </>
  );
}

// Quick navigation component for floating back button
export function QuickNav({ showHome = true }: { showHome?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === '/dashboard' && !showHome) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {pathname !== '/dashboard' && (
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all hover:shadow-xl"
          title="Go to Dashboard"
        >
          🏠
        </button>
      )}
      
      {pathname !== '/dashboard' && (
        <button
          onClick={() => router.back()}
          className="bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white p-3 rounded-full shadow-lg transition-all hover:shadow-xl"
          title="Go Back"
        >
          ←
        </button>
      )}
    </div>
  );
}