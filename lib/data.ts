// @ts-nocheck
// Data managed via admin — do not edit manually
export type Waypoint = { lat: number; lng: number; label: string; day: number | null };
export type Voyage = {
  slug: string;
  title: string;
  country: string;
  city: string;
  startDate: string;
  description: string;
  heroImage: string;
  photos: { src: string }[];
  lat: number | null;
  lng: number | null;
  tags: string[];
  published: boolean;
  waypoints: Waypoint[];
};

export const VOYAGES = [

];
