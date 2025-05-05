import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Location } from '../types';
import { useLocationContext } from '../context/LocationContext';

const LocationModal: React.FC = () => {
  const { isModalOpen, toggleModal, currentLocation, addLocation, updateLocation } = useLocationContext();
  const [formData, setFormData] = useState<{
    name: string;
    notes: string;
    status: 'wishlist' | 'visited';
    coordinates: [number, number];
  }>({
    name: '',
    notes: '',
    status: 'wishlist',
    coordinates: [0, 0],
  });

  useEffect(() => {
    if (currentLocation) {
      setFormData({
        name: currentLocation.name,
        notes: currentLocation.notes,
        status: currentLocation.status,
        coordinates: currentLocation.coordinates,
      });
    } else {
      setFormData({
        name: '',
        notes: '',
        status: 'wishlist',
        coordinates: [0, 0],
      });
    }
  }, [currentLocation, isModalOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.name.trim() === '') return;
    
    if (currentLocation) {
      updateLocation({
        ...currentLocation,
        ...formData,
      });
    } else {
      addLocation(formData);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <div 
        className="bg-white rounded-xl w-full max-w-md overflow-hidden transform transition-all shadow-2xl"
        style={{ animation: 'modalSlide 0.3s ease-out' }}
      >
        <div className="flex justify-between items-center p-6 bg-gradient-to-r from-teal-500 to-teal-600">
          <h2 className="text-xl font-semibold text-white">
            {currentLocation ? 'Edit Location' : 'Add New Location'}
          </h2>
          <button
            onClick={() => toggleModal()}
            className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Location Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow"
              placeholder="e.g., Paris, France"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Travel Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow resize-none"
              placeholder="What would you like to do here?"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow appearance-none bg-white"
            >
              <option value="wishlist">Wishlist</option>
              <option value="visited">Visited</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => toggleModal()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all transform active:scale-95"
            >
              {currentLocation ? 'Update Location' : 'Add Location'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes modalSlide {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LocationModal;