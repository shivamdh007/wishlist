import { Location } from '../types';

const STORAGE_KEY = 'travel-wishlist-locations';

export const saveLocations = (locations: Location[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
};

export const getLocations = (): Location[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};