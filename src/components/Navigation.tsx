'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, MapPin } from 'lucide-react';
import { createClientSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import UserProfile from './UserProfile';
import DarkModeToggle from './DarkModeToggle';

// Admin email addresses (should match AdminGuard)
const ADMIN_EMAILS = [
  'andrewliu3477@gmail.com', // Replace with your actual email
];

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // In development mode without Supabase, allow admin access
      setIsAdmin(true);
      return;
    }

    const supabase = createClientSupabase();
    
    // Check if user is authenticated
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        setIsAdmin(user ? ADMIN_EMAILS.includes(user.email || '') : false);
      } catch (error) {
        console.error('Error getting user:', error);
      }
    };
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        setIsAdmin(currentUser ? ADMIN_EMAILS.includes(currentUser.email || '') : false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Dynamic navigation links based on authentication state
  const baseNavLinks = [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    { href: '/travel-map', label: 'Travel Map' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  // Add Admin link only for authenticated admin users, or Login for non-authenticated users
  const navLinks = [
    ...baseNavLinks,
    ...(isAdmin ? [{ href: '/admin', label: 'Admin' }] : []),
    ...(!user ? [{ href: '/auth', label: 'Login' }] : []),
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-primary dark:text-blue-400">
            <MapPin className="h-6 w-6" />
            <span>Andrew's Travel Blog</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 px-3 py-2 font-medium transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            
            {/* Dark Mode Toggle */}
            <DarkModeToggle />
            
            {/* User Profile */}
            {user && (
              <UserProfile 
                user={user} 
                onLogout={() => setUser(null)} 
              />
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <DarkModeToggle />
            {user && (
              <UserProfile 
                user={user} 
                onLogout={() => setUser(null)} 
              />
            )}
            <button
              onClick={toggleMenu}
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 focus:outline-none focus:text-primary"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 block px-3 py-2 font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
