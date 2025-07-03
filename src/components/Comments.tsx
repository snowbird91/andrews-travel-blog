'use client'

import { useState, useEffect } from 'react'
import { createClientSupabase, isSupabaseConfigured } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { MessageCircle, Send, AlertCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import AuthForm from './AuthForm'

interface Comment {
  id: string
  content: string
  created_at: string
  user_name: string
  user_email: string
}

interface CommentsProps {
  blogSlug: string
}

export default function Comments({ blogSlug }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  const fetchComments = async () => {
    if (!isSupabaseConfigured) return;
    
    try {
      const supabase = createClientSupabase()
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('blog_slug', blogSlug)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching comments:', error)
        return
      }

      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const supabase = createClientSupabase()
    
    // Check if user is authenticated
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error getting user:', error)
      }
    }
    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
        if (session?.user) {
          setShowAuth(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    fetchComments()
  }, [blogSlug]) // eslint-disable-line react-hooks/exhaustive-deps

  // If Supabase is not configured, show a message
  if (!isSupabaseConfigured) {
    return (
      <div className="mt-12 border-t pt-8">
        <div className="flex items-center space-x-2 mb-6">
          <MessageCircle className="h-6 w-6 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900">Comments</h3>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-center space-x-2 text-blue-800">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">Comments System Coming Soon!</p>
          </div>
          <p className="text-blue-700 mt-1">
            The commenting system will be available once the database is configured.
          </p>
        </div>
      </div>
    )
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newComment.trim() || !isSupabaseConfigured) return

    setLoading(true)
    try {
      const supabase = createClientSupabase()
      const { error } = await supabase
        .from('comments')
        .insert({
          blog_slug: blogSlug,
          user_id: user.id,
          content: newComment.trim(),
          user_email: user.email!,
          user_name: user.user_metadata?.full_name || user.email!.split('@')[0]
        })

      if (error) throw error

      setNewComment('')
      await fetchComments() // Refresh comments
    } catch (error) {
      console.error('Error submitting comment:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-12 border-t pt-8">
      <div className="flex items-center space-x-2 mb-6">
        <MessageCircle className="h-6 w-6 text-gray-600" />
        <h3 className="text-xl font-semibold text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Add a comment
            </label>
            <textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Share your thoughts..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            <span>{loading ? 'Posting...' : 'Post Comment'}</span>
          </button>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-md">
          <p className="text-gray-700 mb-4">Please login to leave a comment.</p>
          <button
            onClick={() => setShowAuth(!showAuth)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {showAuth ? 'Hide Login' : 'Login / Sign Up'}
          </button>
          {showAuth && (
            <div className="mt-4">
              <AuthForm onAuthSuccess={() => setShowAuth(false)} />
            </div>
          )}
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">
                  {comment.user_name}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
