import type { Metadata } from 'next';
import BlogPreview from '@/components/BlogPreview';
import { getAllPosts } from '@/lib/staticBlog';

export const metadata: Metadata = {
  title: 'Blog - Andrew\'s Travel Blog',
  description: 'Explore all of Andrew\'s travel adventures, destination guides, and cultural insights from around the world.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Travel Stories
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stories from the road
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogPreview key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Nothing here yet</h2>
              <p className="text-gray-600 mb-8">
                Working on some travel stories - check back soon!
              </p>
              <div className="space-y-4">
                <a
                  href="/about"
                  className="inline-block btn-primary"
                >
                  About Me
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
