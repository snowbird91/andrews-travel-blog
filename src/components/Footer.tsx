import Link from 'next/link';
import { MapPin, Mail, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-6 w-6 text-primary dark:text-blue-400" />
              <span className="text-xl font-bold">Andrew's Travel Blog</span>
            </div>
            <p className="text-gray-300 dark:text-gray-400 mb-4 max-w-md">
              Stories and tips from my travels around the world.
            </p>
            <div className="flex space-x-4">
              <a href="mailto:andrew@andrewstravelblog.com" className="text-gray-300 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300 dark:text-gray-400">
            © {currentYear} Andrew's Travel Blog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
