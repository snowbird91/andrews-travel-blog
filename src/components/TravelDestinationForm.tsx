'use client';

import React, { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { TravelDestination } from '@/data/travelData';

interface TravelDestinationFormProps {
  destination?: TravelDestination | null;
  onSave: (destination: TravelDestination) => void;
  onCancel: () => void;
}

const TravelDestinationForm: React.FC<TravelDestinationFormProps> = ({
  destination,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<TravelDestination>>({
    id: '',
    name: '',
    country: '',
    coordinates: [0, 0],
    visited: false,
    visitDate: '',
    description: '',
    photos: [],
    rating: 1,
    highlights: [],
    travelTips: [],
  });

  const [newHighlight, setNewHighlight] = useState('');
  const [newTip, setNewTip] = useState('');
  const [newPhoto, setNewPhoto] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (destination) {
      setFormData(destination);
    }
  }, [destination]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (name === 'coordinates') {
      const coords = value.split(',').map(coord => parseFloat(coord.trim()));
      if (coords.length === 2 && !coords.some(isNaN)) {
        setFormData(prev => ({ ...prev, coordinates: coords as [number, number] }));
      }
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...(prev.highlights || []), newHighlight.trim()]
      }));
      setNewHighlight('');
    }
  };

  const removeHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights?.filter((_, i) => i !== index) || []
    }));
  };

  const addTip = () => {
    if (newTip.trim()) {
      setFormData(prev => ({
        ...prev,
        travelTips: [...(prev.travelTips || []), newTip.trim()]
      }));
      setNewTip('');
    }
  };

  const removeTip = (index: number) => {
    setFormData(prev => ({
      ...prev,
      travelTips: prev.travelTips?.filter((_, i) => i !== index) || []
    }));
  };

  const addPhoto = () => {
    if (newPhoto.trim()) {
      setFormData(prev => ({
        ...prev,
        photos: [...(prev.photos || []), newPhoto.trim()]
      }));
      setNewPhoto('');
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage('');
    
    try {
      // Generate ID if not provided
      const destinationId = formData.id || 
        formData.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 
        `destination-${Date.now()}`;

      const destination: TravelDestination = {
        id: destinationId,
        name: formData.name || '',
        country: formData.country || '',
        coordinates: formData.coordinates || [0, 0],
        visited: formData.visited || false,
        visitDate: formData.visitDate,
        description: formData.description || '',
        photos: formData.photos || [],
        rating: formData.rating,
        highlights: formData.highlights || [],
        travelTips: formData.travelTips || [],
      };

      // Call API to save destination
      const method = destination.id && destination.id !== destinationId ? 'PUT' : 'POST';
      const response = await fetch('/api/destinations', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(destination),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSaveMessage(result.message || 'Destination saved successfully!');
        onSave(destination);
        
        // Close form after a brief delay to show success message
        setTimeout(() => {
          onCancel();
        }, 1500);
      } else {
        throw new Error(result.error || 'Failed to save destination');
      }
    } catch (error) {
      console.error('Error saving destination:', error);
      setSaveMessage(error instanceof Error ? error.message : 'Failed to save destination');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {destination ? 'Edit Destination' : 'Add New Destination'}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Destination Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Paris, Tokyo, New York"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Country *
            </label>
            <input
              type="text"
              name="country"
              value={formData.country || ''}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., France, Japan, United States"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Coordinates (lat, lng) *
            </label>
            <input
              type="text"
              name="coordinates"
              value={formData.coordinates?.join(', ') || ''}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., 48.8566, 2.3522"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use <a href="https://www.latlong.net/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">LatLong.net</a> to find coordinates
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rating (1-5)
            </label>
            <select
              name="rating"
              value={formData.rating || 1}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {[1, 2, 3, 4, 5].map(rating => (
                <option key={rating} value={rating}>{rating} Star{rating !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Visit Information */}
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="visited"
              checked={formData.visited || false}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">I've visited this place</span>
          </label>

          {formData.visited && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Visit Date
              </label>
              <input
                type="date"
                name="visitDate"
                value={formData.visitDate || ''}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Describe your experience or what makes this place special..."
          />
        </div>

        {/* Photos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Photos
          </label>
          <div className="space-y-2">
            {formData.photos?.map((photo, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="url"
                  value={photo}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <input
                type="url"
                value={newPhoto}
                onChange={(e) => setNewPhoto(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={addPhoto}
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Highlights
          </label>
          <div className="space-y-2">
            {formData.highlights?.map((highlight, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={highlight}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => removeHighlight(index)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                placeholder="Add a highlight..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={addHighlight}
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Travel Tips */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Travel Tips
          </label>
          <div className="space-y-2">
            {formData.travelTips?.map((tip, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={tip}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => removeTip(index)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newTip}
                onChange={(e) => setNewTip(e.target.value)}
                placeholder="Add a travel tip..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={addTip}
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Success/Error Message */}
        {saveMessage && (
          <div className={`p-4 rounded-md ${
            saveMessage.includes('successfully') || saveMessage.includes('saved')
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700'
          }`}>
            {saveMessage}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-4 w-4 mr-2 inline" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2 inline" />
                Save Destination
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TravelDestinationForm;
