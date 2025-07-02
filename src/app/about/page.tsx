import type { Metadata } from 'next';
import { MapPin, Camera, Users, Coffee, Plane, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About - Andrew\'s Travel Blog',
  description: 'Learn about Andrew, a passionate travel enthusiast sharing adventures, cultural insights, and travel tips from around the world.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-blue-600 text-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 fade-in">
            Hi, I'm Andrew!
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 fade-in">
            A Travel Enthusiast on a Journey Around the World
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="prose prose-lg max-w-none">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Hey there!</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  I'm Andrew, and I love to travel. What started as a simple vacation turned into 
                  a passion for exploring new places and meeting amazing people along the way.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  This blog is where I share my adventures, the cool places I've been, 
                  and the stories that come with them. Every trip teaches me something new.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Heart className="h-6 w-6 text-red-500 mr-2" />
                  How I Travel
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  I like to really get into the local culture. Eating local food, learning a few words 
                  of the language, getting a bit lost - that's where the best memories happen.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Plane className="h-6 w-6 text-primary mr-2" />
                  What You'll Find Here
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Travel Guides</h4>
                    <p className="text-gray-600 text-sm">
                      Tips for places I've been
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Stories</h4>
                    <p className="text-gray-600 text-sm">
                      Adventures and mishaps
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Local Culture</h4>
                    <p className="text-gray-600 text-sm">
                      Cool things I've learned
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Photos</h4>
                    <p className="text-gray-600 text-sm">
                      Pictures from the road
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Travel Stats */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Travel Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-primary mr-3" />
                    <span className="text-gray-700"><strong>20+ Countries</strong> explored</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-primary mr-3" />
                    <span className="text-gray-700"><strong>10+ Years</strong> traveling</span>
                  </div>
                  <div className="flex items-center">
                    <Camera className="h-5 w-5 text-primary mr-3" />
                    <span className="text-gray-700"><strong>10,000+</strong> photos taken</span>
                  </div>
                  <div className="flex items-center">
                    <Coffee className="h-5 w-5 text-primary mr-3" />
                    <span className="text-gray-700"><strong>∞</strong> cups of coffee</span>
                  </div>
                </div>
              </div>

              {/* Favorite Destinations */}
              <div className="bg-primary/5 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Favorite Destinations</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <span className="text-2xl mr-3">🇯🇵</span>
                    <span>Japan</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span className="text-2xl mr-3">🇳🇿</span>
                    <span>New Zealand</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span className="text-2xl mr-3">🇨🇳</span>
                    <span>China</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span className="text-2xl mr-3">🇨🇭</span>
                    <span>Switzerland</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span className="text-2xl mr-3">🇺🇸</span>
                    <span>United States</span>
                  </div>
                </div>
              </div>

              {/* Current Status */}
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Current Status</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Based in:</strong> Washington D.C.
                </p>
                <p className="text-gray-70">
                  <strong>Next Destination:</strong> <span className="text-green-600 font-medium">[TOP SECRET]</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
