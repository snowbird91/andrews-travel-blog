'use client'

import { useState } from 'react'
import { createClientSupabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthFormProps {
  onAuthSuccess?: (user: User) => void
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const supabase = createClientSupabase()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) throw error
        if (data.user) {
          setMessage('Login successful!')
          onAuthSuccess?.(data.user)
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        })
        
        if (error) throw error
        setMessage('Check your email for the confirmation link!')
      }
    } catch (error: any) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        {isLogin ? 'Login' : 'Sign Up'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required={!isLogin}
            />
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
            minLength={6}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 dark:bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50"
        >
          {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
        </button>
      </form>
      
      {message && (
        <div className={`mt-4 p-3 rounded-md ${
          message.includes('successful') || message.includes('Check your email') 
            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
            : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
        }`}>
          {message}
        </div>
      )}
      
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  )
}
