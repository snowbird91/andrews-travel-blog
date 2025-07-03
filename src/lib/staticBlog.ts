import { BlogPost } from '@/types/blog';

// Static blog posts array - Add your blog posts here
export const blogPosts: BlogPost[] = [
  // Sample post for demonstration (remove or modify as needed)
  {
    id: 'sample-post',
    title: 'Welcome to My Travel Blog',
    slug: 'welcome-to-my-travel-blog',
    excerpt: 'Sample Blog!',
    content: `# Welcome to My Travel Blog

I love flying!`,
    author: 'Andrew',
    date: '2025-07-02T19:56:53.772Z',
    tags: ['welcome', 'getting-started'],
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    readTime: 3
  }
];

// Helper functions for blog operations
export const getFeaturedPosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.featured);
};

export const getPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

export const getAllPosts = (): BlogPost[] => {
  return blogPosts.sort((a, b) => {
    const dateA = new Date(a.date || a.created_at || Date.now()).getTime();
    const dateB = new Date(b.date || b.created_at || Date.now()).getTime();
    return dateB - dateA;
  });
};

export const getPostsByTag = (tag: string): BlogPost[] => {
  return blogPosts.filter(post => post.tags.includes(tag));
};
