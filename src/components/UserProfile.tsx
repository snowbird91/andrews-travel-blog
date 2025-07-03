'use client'

import { useState, useEffect } from 'react'
import { createClientSupabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { LogOut, User as UserIcon } from 'lucide-react'

interface UserProfileProps {
  user: User
  onLogout: () => void
}

export default function UserProfile({ user, onLogout }: UserProfileProps) {
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      const supabase = createClientSupabase()
      await supabase.auth.signOut()
      onLogout()
    } catch (error) {
      console.error('Error logging out:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <UserIcon className="h-5 w-5 text-gray-600" />
        <span className="text-sm text-gray-700">
          {user.user_metadata?.full_name || user.email}
        </span>
      </div>
      
      <button
        onClick={handleLogout}
        disabled={loading}
        className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
      >
        <LogOut className="h-4 w-4" />
        <span>{loading ? 'Logging out...' : 'Logout'}</span>
      </button>
    </div>
  )
}
