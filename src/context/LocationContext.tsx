import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Location, FilterStatus } from '../types';
import { getLocations, saveLocations } from '../utils/localStorage';
import { generateId } from '../utils/helpers';

interface LocationState {
  locations: Location[];
  filterStatus: FilterStatus;
  isModalOpen: boolean;
  currentLocation: Location | null;
}

type LocationAction =
  | { type: 'ADD_LOCATION'; payload: Omit<Location, 'id' | 'createdAt'> }
  | { type: 'UPDATE_LOCATION'; payload: Location }
  | { type: 'DELETE_LOCATION'; payload: string }
  | { type: 'SET_FILTER'; payload: FilterStatus }
  | { type: 'TOGGLE_MODAL'; payload?: Location | null }
  | { type: 'TOGGLE_STATUS'; payload: string }
  | { type: 'LOAD_LOCATIONS'; payload: Location[] };

const initialState: LocationState = {
  locations: [],
  filterStatus: 'all',
  isModalOpen: false,
  currentLocation: null,
};

const locationReducer = (state: LocationState, action: LocationAction): LocationState => {
  switch (action.type) {
    case 'ADD_LOCATION':
      const newLocation: Location = {
        ...action.payload,
        id: generateId(),
        createdAt: Date.now(),
      };
      return {
        ...state,
        locations: [newLocation, ...state.locations],
        isModalOpen: false,
        currentLocation: null,
      };

    case 'UPDATE_LOCATION':
      return {
        ...state,
        locations: state.locations.map((location) =>
          location.id === action.payload.id ? action.payload : location
        ),
        isModalOpen: false,
        currentLocation: null,
      };

    case 'DELETE_LOCATION':
      return {
        ...state,
        locations: state.locations.filter((location) => location.id !== action.payload),
      };

    case 'SET_FILTER':
      return {
        ...state,
        filterStatus: action.payload,
      };

    case 'TOGGLE_MODAL':
      return {
        ...state,
        isModalOpen: !state.isModalOpen,
        currentLocation: action.payload || null,
      };

    case 'TOGGLE_STATUS':
      return {
        ...state,
        locations: state.locations.map((location) =>
          location.id === action.payload
            ? {
                ...location,
                status: location.status === 'wishlist' ? 'visited' : 'wishlist',
              }
            : location
        ),
      };

    case 'LOAD_LOCATIONS':
      return {
        ...state,
        locations: action.payload,
      };

    default:
      return state;
  }
};

interface LocationContextType extends LocationState {
  addLocation: (location: Omit<Location, 'id' | 'createdAt'>) => void;
  updateLocation: (location: Location) => void;
  deleteLocation: (id: string) => void;
  setFilter: (filter: FilterStatus) => void;
  toggleModal: (location?: Location | null) => void;
  toggleStatus: (id: string) => void;
  filteredLocations: Location[];
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(locationReducer, initialState);

  useEffect(() => {
    const savedLocations = getLocations();
    if (savedLocations.length > 0) {
      dispatch({ type: 'LOAD_LOCATIONS', payload: savedLocations });
    }
  }, []);

  useEffect(() => {
    saveLocations(state.locations);
  }, [state.locations]);

  const filteredLocations = state.locations.filter((location) => {
    if (state.filterStatus === 'all') return true;
    return location.status === state.filterStatus;
  });

  const addLocation = (location: Omit<Location, 'id' | 'createdAt'>) => {
    dispatch({ type: 'ADD_LOCATION', payload: location });
  };

  const updateLocation = (location: Location) => {
    dispatch({ type: 'UPDATE_LOCATION', payload: location });
  };

  const deleteLocation = (id: string) => {
    dispatch({ type: 'DELETE_LOCATION', payload: id });
  };

  const setFilter = (filter: FilterStatus) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const toggleModal = (location?: Location | null) => {
    dispatch({ type: 'TOGGLE_MODAL', payload: location });
  };

  const toggleStatus = (id: string) => {
    dispatch({ type: 'TOGGLE_STATUS', payload: id });
  };

  const value = {
    ...state,
    filteredLocations,
    addLocation,
    updateLocation,
    deleteLocation,
    setFilter,
    toggleModal,
    toggleStatus,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};