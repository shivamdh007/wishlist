import { Location } from '../types';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const sortLocations = (locations: Location[], sortBy: 'newest' | 'alphabetical' = 'newest'): Location[] => {
  return [...locations].sort((a, b) => {
    if (sortBy === 'newest') {
      return b.createdAt - a.createdAt;
    }
    return a.name.localeCompare(b.name);
  });
};