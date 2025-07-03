import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import Markdown from 'markdown-to-jsx';
import { BlogPost } from '@/types/blog';
import Comments from '@/components/Comments';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                   (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                   'http://localhost:3000');
    
    const response = await fetch(`${baseUrl}/api/blog`, {
      cache: 'no-store'
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    return [];
  }
}

async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const posts = await getAllPosts();
    return posts.find(post => post.slug === slug) || null;
  } catch (error) {
    return null;
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found - Andrew\'s Travel Blog',
    };
  }

  return {
    title: `${post.title} - Andrew's Travel Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.created_at,
      authors: [post.author || 'Andrew'],
      images: [post.coverImage || post.featured_image || ''],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={post.coverImage || post.featured_image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center text-white/90 text-sm">
              <div className="flex items-center mr-6 mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                {format(new Date(post.created_at || new Date()), 'MMMM dd, yyyy')}
              </div>
              {post.readTime && (
                <div className="flex items-center mr-6 mb-2">
                  <Clock className="h-4 w-4 mr-2" />
                  {post.readTime} min read
                </div>
              )}
              <div className="flex items-center mb-2">
                By {post.author || 'Andrew'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <Markdown
            options={{
              overrides: {
                img: {
                  props: {
                    className: 'rounded-lg shadow-lg',
                  },
                },
              },
            }}
          >
            {post.content}
          </Markdown>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 dark:bg-blue-500/20 text-primary dark:text-blue-400"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <Comments blogSlug={params.slug} />

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/blog"
            className="inline-flex items-center btn-primary"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to All Posts
          </Link>
        </div>
      </div>
    </article>
  );
}
