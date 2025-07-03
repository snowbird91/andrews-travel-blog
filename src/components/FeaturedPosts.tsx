import { BlogPost } from '@/types/blog';
import BlogPreview from './BlogPreview';

interface FeaturedPostsProps {
  posts: BlogPost[];
}

const FeaturedPosts = ({ posts }: FeaturedPostsProps) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Stories
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Some of my favorite travel experiences
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogPreview key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPosts;
