import React, { useState } from 'react';
import { MapPin, Plus, Search } from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';
import { FilterStatus } from '../types';
import LocationCard from './LocationCard';

const FilterButton: React.FC<{
  label: string;
  value: FilterStatus;
  activeFilter: FilterStatus;
  onClick: (filter: FilterStatus) => void;
}> = ({ label, value, activeFilter, onClick }) => (
  <button
    onClick={() => onClick(value)}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      activeFilter === value
        ? 'bg-teal-600 text-white'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    {label}
  </button>
);

const Sidebar: React.FC = () => {
  const { filteredLocations, filterStatus, setFilter, toggleModal } = useLocationContext();
  const [searchTerm, setSearchTerm] = useState('');

  const displayedLocations = filteredLocations.filter((location) =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <MapPin className="mr-2 text-teal-600" />
          Travel Wishlist
        </h1>
        <p className="text-gray-600 mt-1">Map your dreams, plan your adventures</p>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="flex space-x-2">
          <FilterButton label="All" value="all" activeFilter={filterStatus} onClick={setFilter} />
          <FilterButton label="Wishlist" value="wishlist" activeFilter={filterStatus} onClick={setFilter} />
          <FilterButton label="Visited" value="visited" activeFilter={filterStatus} onClick={setFilter} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {displayedLocations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No locations found</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-2 text-teal-600 hover:text-teal-700"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          displayedLocations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => toggleModal()}
          className="w-full flex items-center justify-center py-2 px-4 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add New Location
        </button>
      </div>
    </div>
  );
};

export default Sidebar;