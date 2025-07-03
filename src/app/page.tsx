import HeroSection from '@/components/HeroSection';
import FeaturedPosts from '@/components/FeaturedPosts';
import BlogPreview from '@/components/BlogPreview';
import InteractiveTravelMap from '@/components/InteractiveTravelMap';
import TravelStats from '@/components/TravelStats';
import Link from 'next/link';
import { getFeaturedPosts, getAllPosts } from '@/lib/staticBlog';
import { travelDestinations } from '@/data/travelData';
import { ArrowRight, MapPin } from 'lucide-react';

export default function HomePage() {
  const featuredPosts = getFeaturedPosts();
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <>
      <HeroSection />
      
      {/* Travel Map Preview Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              My Travel Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Explore the places I've visited and discover where I'm planning to go next on my interactive world map.
            </p>
          </div>
          
          {/* Travel Stats Preview */}
          <div className="mb-8">
            <TravelStats />
          </div>
          
          {/* Map Preview */}
          <div className="mb-8 fade-in">
            <InteractiveTravelMap 
              destinations={travelDestinations} 
              height="400px"
              showControls={false}
            />
          </div>
          
          <div className="text-center fade-in">
            <Link
              href="/travel-map"
              className="inline-flex items-center btn-primary"
            >
              <MapPin className="mr-2 h-5 w-5" />
              Explore Full Travel Map
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <FeaturedPosts posts={featuredPosts} />
      )}
      
      {/* Recent Posts Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {featuredPosts.length > 0 ? 'Latest Posts' : 'Recent Posts'}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {getAllPosts().length > 0 
                ? 'Latest stories from the road'
                : 'More stories coming soon!'
              }
            </p>
          </div>
          
          {recentPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {recentPosts.map((post) => (
                  <BlogPreview key={post.id} post={post} />
                ))}
              </div>
              
              <div className="text-center fade-in">
                <Link
                  href="/blog"
                  className="inline-flex items-center btn-primary"
                >
                  View All Posts
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Nothing here yet</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Working on some travel stories - check back soon!
                </p>
                <Link
                  href="/about"
                  className="btn-secondary"
                >
                  About Me
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
