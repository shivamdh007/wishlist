import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useLocationContext } from '../context/LocationContext';

// Fix Leaflet icon issues
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const wishlistIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const visitedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Helper component to handle map clicks
const MapClickHandler: React.FC = () => {
  const map = useMap();
  const { toggleModal } = useLocationContext();
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      
      // Remove temporary marker if it exists
      if (markerRef.current) {
        markerRef.current.remove();
      }
      
      // Add a temporary marker
      markerRef.current = L.marker([lat, lng], { icon: defaultIcon }).addTo(map);
      
      // Open the modal with the coordinates
      toggleModal({
        id: '',
        name: '',
        notes: '',
        status: 'wishlist',
        coordinates: [lat, lng],
        createdAt: Date.now(),
      });
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, [map, toggleModal]);

  return null;
};

const Map: React.FC = () => {
  const { locations, toggleModal, toggleStatus } = useLocationContext();

  return (
    <MapContainer 
      center={[20, 0]} 
      zoom={2} 
      style={{ height: '100%', width: '100%' }}
      minZoom={2}
      maxBounds={[[-90, -180], [90, 180]]}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {locations.map((location) => (
        <Marker 
          key={location.id} 
          position={location.coordinates}
          icon={location.status === 'visited' ? visitedIcon : wishlistIcon}
        >
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-medium text-lg">{location.name}</h3>
              {location.notes && <p className="mt-1 text-gray-600">{location.notes}</p>}
              <div className="mt-2 flex justify-between items-center">
                <button
                  onClick={() => toggleStatus(location.id)}
                  className={`text-xs px-2 py-1 rounded ${
                    location.status === 'visited' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {location.status === 'visited' ? 'Visited' : 'Wishlist'}
                </button>
                <button
                  onClick={() => toggleModal(location)}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Edit
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
      
      <MapClickHandler />
    </MapContainer>
  );
};

export default Map;