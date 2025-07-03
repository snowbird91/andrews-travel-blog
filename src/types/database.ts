export interface Database {
  public: {
    Tables: {
      comments: {
        Row: {
          id: string
          blog_slug: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
          user_email: string
          user_name: string
        }
        Insert: {
          id?: string
          blog_slug: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
          user_email: string
          user_name: string
        }
        Update: {
          id?: string
          blog_slug?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
          user_email?: string
          user_name?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
