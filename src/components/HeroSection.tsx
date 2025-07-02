import Link from 'next/link';
import { MapPin, Camera, Users, Coffee } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 via-primary to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 fade-in">
            Andrew's Travel Blog
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto fade-in">
            Adventures from around the world
          </p>
          
          {/* Travel Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="text-center fade-in">
              <div className="flex justify-center mb-2">
                <MapPin className="h-8 w-8 text-blue-200" />
              </div>
              <div className="text-2xl font-bold">20+</div>
              <div className="text-blue-200">Countries</div>
            </div>
            <div className="text-center fade-in">
              <div className="flex justify-center mb-2">
                <Users className="h-8 w-8 text-blue-200" />
              </div>
              <div className="text-2xl font-bold">10+</div>
              <div className="text-blue-200">Years Traveling</div>
            </div>
            <div className="text-center fade-in">
              <div className="flex justify-center mb-2">
                <Camera className="h-8 w-8 text-blue-200" />
              </div>
              <div className="text-2xl font-bold">10,000+</div>
              <div className="text-blue-200">Photos</div>
            </div>
            <div className="text-center fade-in">
              <div className="flex justify-center mb-2">
                <Coffee className="h-8 w-8 text-blue-200" />
              </div>
              <div className="text-2xl font-bold">∞</div>
              <div className="text-blue-200">Cups of Coffee</div>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in">
            <Link
              href="/blog"
              className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 text-lg"
            >
              Read My Stories
            </Link>
            <Link
              href="/about"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-all duration-200 text-lg"
            >
              About Me
            </Link>
          </div>
        </div>
      </div>
      
      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
          alt="Travel Adventure"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
      </div>
    </section>
  );
};

export default HeroSection;
