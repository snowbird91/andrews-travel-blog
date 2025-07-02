import Link from 'next/link';
import { Calendar, Clock, Tag } from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { format } from 'date-fns';

interface BlogPreviewProps {
  post: BlogPost;
}

const BlogPreview = ({ post }: BlogPreviewProps) => {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover-scale transition-transform duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="h-4 w-4 mr-1" />
          <span className="mr-4">{format(new Date(post.date), 'MMM dd, yyyy')}</span>
          <Clock className="h-4 w-4 mr-1" />
          <span>{post.readTime} min read</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          <Link 
            href={`/blog/${post.slug}`}
            className="hover:text-primary transition-colors duration-200"
          >
            {post.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
            {post.tags.length > 2 && (
              <span className="text-xs text-gray-500">
                +{post.tags.length - 2} more
              </span>
            )}
          </div>
          
          <Link
            href={`/blog/${post.slug}`}
            className="text-primary hover:text-primary-dark font-medium text-sm transition-colors duration-200"
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogPreview;
