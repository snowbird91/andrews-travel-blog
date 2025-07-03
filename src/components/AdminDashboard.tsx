'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, MapPin, FileText, Settings } from 'lucide-react';
import TravelDestinationForm from './TravelDestinationForm';
import BlogPostForm from './BlogPostForm';
import { travelDestinations } from '@/data/travelData';
import { getAllPosts } from '@/lib/staticBlog';

type TabType = 'destinations' | 'blog' | 'settings';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('destinations');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: 'destination' | 'post'; id: string; name: string } | null>(null);

  const tabs = [
    { id: 'destinations' as TabType, label: 'Travel Destinations', icon: MapPin },
    { id: 'blog' as TabType, label: 'Blog Posts', icon: FileText },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  const handleAddNew = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDeleteClick = (type: 'destination' | 'post', id: string, name: string) => {
    setShowDeleteConfirm({ type, id, name });
  };

  const handleDeleteConfirm = async () => {
    if (showDeleteConfirm) {
      try {
        const { type, id, name } = showDeleteConfirm;
        
        const endpoint = type === 'destination' ? '/api/destinations' : '/api/blog';
        const response = await fetch(`${endpoint}?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (response.ok && result.success) {
          alert(`${name} has been deleted successfully!`);
          // Refresh the page to show updated data
          window.location.reload();
          setShowDeleteConfirm(null);
        } else {
          throw new Error(result.error || `Failed to delete ${type}`);
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        alert(`Error: ${error instanceof Error ? error.message : 'Failed to delete item'}`);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Manage your travel blog content
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {/* Add New Button */}
        {(activeTab === 'destinations' || activeTab === 'blog') && (
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {activeTab === 'destinations' ? 'Travel Destinations' : 'Blog Posts'}
            </h2>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New {activeTab === 'destinations' ? 'Destination' : 'Post'}
            </button>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'destinations' && (
          <div>
            {showForm ? (
              <TravelDestinationForm
                destination={editingItem}
                onSave={handleCloseForm}
                onCancel={handleCloseForm}
              />
            ) : (
              <div className="space-y-6">
                {/* Current Destinations List */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Current Destinations ({travelDestinations.length})
                    </h3>
                  </div>
                  
                  {travelDestinations.length > 0 ? (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {travelDestinations.map((destination) => (
                        <div key={destination.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                  {destination.name}
                                </h4>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {destination.country}
                                </span>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  destination.visited 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                }`}>
                                  {destination.visited ? 'Visited' : 'Wishlist'}
                                </span>
                                {destination.rating && (
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <span key={i} className={`text-sm ${
                                        i < destination.rating! ? 'text-yellow-400' : 'text-gray-300'
                                      }`}>
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                {destination.description}
                              </p>
                              {destination.visitDate && (
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                  Visited: {destination.visitDate}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEdit(destination)}
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                                title="Edit destination"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick('destination', destination.id, destination.name)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                                title="Delete destination"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <MapPin className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No destinations</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Get started by adding your first travel destination.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'blog' && (
          <div>
            {showForm ? (
              <BlogPostForm
                post={editingItem}
                onSave={handleCloseForm}
                onCancel={handleCloseForm}
              />
            ) : (
              <div className="space-y-6">
                {/* Current Blog Posts List */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Current Blog Posts ({getAllPosts().length})
                    </h3>
                  </div>
                  
                  {getAllPosts().length > 0 ? (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {getAllPosts().map((post) => (
                        <div key={post.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                  {post.title}
                                </h4>
                                {post.featured && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    Featured
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                {post.excerpt}
                              </p>
                              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                <span>By {post.author}</span>
                                <span>{post.date}</span>
                                <span>{post.tags?.join(', ')}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEdit(post)}
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                                title="Edit post"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick('post', post.id, post.title)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                                title="Delete post"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No blog posts</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Get started by creating your first blog post.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              General Settings
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Site settings and configuration options will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-4">
                Delete {showDeleteConfirm.type === 'destination' ? 'Destination' : 'Blog Post'}
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete "{showDeleteConfirm.name}"? This action cannot be undone.
                </p>
              </div>
              <div className="items-center px-4 py-3 flex justify-center space-x-4">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
