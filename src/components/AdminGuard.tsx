'use client';

import React, { useState, useEffect } from 'react';
import { createClientSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Shield, AlertTriangle } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

// List of admin email addresses
const getAdminEmails = () => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (adminEmail) {
    return [adminEmail];
  }
  // Fallback for development
  return ['andrewliu3477@gmail.com'];
};

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // If Supabase is not configured, allow access for development
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    const supabase = createClientSupabase();
    
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        setIsAdmin(user ? getAdminEmails().includes(user.email || '') : false);
      } catch (error) {
        console.error('Error getting user:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        setIsAdmin(currentUser ? getAdminEmails().includes(currentUser.email || '') : false);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isSupabaseConfigured) {
    // Show warning but allow access for development
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-200">
                <strong>Development Mode:</strong> Authentication is not configured. 
                In production, only authorized users will have access to this admin panel.
              </p>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
              Authentication Required
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              You need to be signed in to access the admin panel.
            </p>
            <div className="mt-6">
              <a
                href="/auth"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-red-400" />
            <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
              Access Denied
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              You don't have permission to access the admin panel.
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Signed in as: {user.email}
            </p>
            <div className="mt-6">
              <a
                href="/"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
