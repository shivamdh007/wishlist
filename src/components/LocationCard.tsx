import React from 'react';
import { MapPin, Edit, Trash2, CheckCircle, Circle } from 'lucide-react';
import { Location } from '../types';
import { useLocationContext } from '../context/LocationContext';

interface LocationCardProps {
  location: Location;
}

const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
  const { toggleModal, deleteLocation, toggleStatus } = useLocationContext();

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-2">
            <MapPin 
              className={`mt-1 ${
                location.status === 'visited' ? 'text-emerald-500' : 'text-amber-500'
              }`} 
              size={18} 
            />
            <div>
              <h3 className="font-medium text-gray-800">{location.name}</h3>
              {location.notes && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{location.notes}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => toggleStatus(location.id)}
            className={`flex items-center text-xs font-medium rounded-full px-3 py-1 ${
              location.status === 'visited'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {location.status === 'visited' ? (
              <>
                <CheckCircle size={14} className="mr-1" />
                Visited
              </>
            ) : (
              <>
                <Circle size={14} className="mr-1" />
                Wishlist
              </>
            )}
          </button>
        </div>
      </div>
      <div className="border-t border-gray-100 px-4 py-2 bg-gray-50 flex justify-end space-x-2">
        <button
          onClick={() => toggleModal(location)}
          className="p-1 text-gray-500 hover:text-teal-600 transition-colors"
          aria-label="Edit location"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={() => deleteLocation(location.id)}
          className="p-1 text-gray-500 hover:text-red-600 transition-colors"
          aria-label="Delete location"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default LocationCard;