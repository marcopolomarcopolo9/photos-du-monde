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
  {
    slug: "costa-rica-jungl",
    title: "costa rica & jungl",
    country: "Costa Rica",
    city: "San josé ",
    startDate: "2024",
    description: "Un voyage a la carte au millieu de jungle et plage un savoureux melange de couleure et ambiances..",
    heroImage: "https://res.cloudinary.com/doxsjisyx/image/upload/v1779430677/photos-du-monde/zoamp6ljimhdi3uykrfp.jpg",
    photos: [
    { src: "https://res.cloudinary.com/doxsjisyx/image/upload/v1779430695/photos-du-monde/iaoklbpf7acmnciznc47.jpg" },
    { src: "https://res.cloudinary.com/doxsjisyx/image/upload/v1779430697/photos-du-monde/gyaenlhdxfzh7snq8pk3.jpg" }
    ],
    lat: 9.915285,
    lng: -84.105542,
    tags: [],
    published: true,
    waypoints: [

    ]
  }
];
