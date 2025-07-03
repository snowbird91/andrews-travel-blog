import Link from 'next/link';
import { Calendar, Clock, Tag } from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { format } from 'date-fns';

interface BlogPreviewProps {
  post: BlogPost;
}

const BlogPreview = ({ post }: BlogPreviewProps) => {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 hover-scale overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
          <Calendar className="h-4 w-4 mr-1" />
          <span className="mr-4">{format(new Date(post.date), 'MMM dd, yyyy')}</span>
          <Clock className="h-4 w-4 mr-1" />
          <span>{post.readTime} min read</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
          <Link 
            href={`/blog/${post.slug}`}
            className="hover:text-primary dark:hover:text-blue-400 transition-colors duration-200"
          >
            {post.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 dark:bg-blue-500/20 text-primary dark:text-blue-400"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
            {post.tags.length > 2 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{post.tags.length - 2} more
              </span>
            )}
          </div>
          
          <Link
            href={`/blog/${post.slug}`}
            className="text-primary dark:text-blue-400 hover:text-primary-dark dark:hover:text-blue-300 font-medium text-sm transition-colors duration-200"
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogPreview;
