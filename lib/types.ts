export interface Photo {
  id: string;
  src: string;
  alt: string;
  location: string;
  country: string;
  continent: string;
  date: string;
  width: number;
  height: number;
  voyageSlug?: string;
  tags?: string[];
}

export interface Anecdote {
  id: string;
  title: string;
  content: string;
  icon?: string;
  location?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MapPoint {
  name: string;
  coordinates: Coordinates;
  description?: string;
}

export interface Voyage {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  country: string;
  continent: string;
  city: string;
  region?: string;
  startDate: string;
  endDate: string;
  duration: number;
  heroImage: string;
  heroImageAlt: string;
  photos: Photo[];
  anecdotes: Anecdote[];
  tips: string[];
  coordinates: Coordinates;
  mapPoints?: MapPoint[];
  tags: string[];
  categories: Category[];
  featured?: boolean;
  photoCount?: number;
}

export type Continent =
  | 'Amérique du Sud'
  | 'Amérique Centrale'
  | 'Amérique du Nord'
  | 'Europe'
  | 'Asie'
  | 'Afrique'
  | 'Océanie';

export type Category =
  | 'Volcans'
  | 'Jungle'
  | 'Oiseaux'
  | 'Faune'
  | 'Paysages'
  | 'Aventure'
  | 'Côtes'
  | 'Désert';

export interface GalleryFilter {
  type: 'continent' | 'country' | 'category' | 'all';
  value: string;
  label: string;
}

export interface AdminVoyage extends Omit<Voyage, 'photos'> {
  photos: (Photo | { file: File; preview: string })[];
}
