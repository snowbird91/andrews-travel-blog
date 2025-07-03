export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date?: string;
  created_at?: string;
  updated_at?: string;
  tags: string[];
  featured: boolean;
  coverImage?: string;
  featured_image?: string;
  readTime?: number;
  published?: boolean;
  destination_id?: string;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  email?: string;
  content: string;
  created_at: string;
  post_id: string;
}
