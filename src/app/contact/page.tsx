import type { Metadata } from 'next';
import { Mail, Instagram, Twitter, Facebook, MapPin, Send } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact - Andrew\'s Travel Blog',
  description: 'Get in touch with Andrew for travel collaborations, questions, or just to share your own travel stories.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about travel or want to share your own adventures? I'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Me a Message</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="What's this about?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-vertical"
                  placeholder="Tell me about your travel dreams, questions, or ideas..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full btn-primary flex items-center justify-center"
              >
                <Send className="h-5 w-5 mr-2" />
                Send Message
              </button>
            </form>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> This is just a demo form - emails won't actually send.
              </p>
            </div>
          </div>

          {/* Contact Information & Social */}
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-primary mr-4" />
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <a 
                      href="mailto:"
                      className="text-primary hover:tplaceholder@placeholder.comext-primary-dark transition-colors"
                    >
                      placeholder@placeholder.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-primary mr-4" />
                  <div>
                    <h3 className="font-medium text-gray-900">Location</h3>
                    <p className="text-gray-600">Washington D.C., United States</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Follow My Journey</h2>
              <p className="text-gray-600 mb-6">
                Follow my latest adventures!
              </p>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="#"
                  className="flex items-center justify-center p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
                >
                  <Instagram className="h-6 w-6 mr-2" />
                  Instagram
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-105"
                >
                  <Twitter className="h-6 w-6 mr-2" />
                  Twitter
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
                >
                  <Facebook className="h-6 w-6 mr-2" />
                  Facebook
                </a>
                <a
                  href="mailto:placeholder@placeholder.com"
                  className="flex items-center justify-center p-4 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-105"
                >
                  <Mail className="h-6 w-6 mr-2" />
                  Email
                </a>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-primary text-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-4">Let's Connect!</h2>
              <p className="mb-6">
                Always happy to connect with fellow travelers! 
              </p>
              <div className="space-y-2 text-sm">
                <p>• Travel tips and advice</p>
                <p>• Collaboration ideas</p>
                <p>• Just saying hi!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
