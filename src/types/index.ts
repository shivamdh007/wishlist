export interface Location {
  id: string;
  name: string;
  coordinates: [number, number];
  notes: string;
  status: 'wishlist' | 'visited';
  createdAt: number;
}

export type FilterStatus = 'all' | 'wishlist' | 'visited';