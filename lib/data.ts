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
    { src: "https://res.cloudinary.com/doxsjisyx/image/upload/v1779430697/photos-du-monde/gyaenlhdxfzh7snq8pk3.jpg" },
    { src: "https://res.cloudinary.com/doxsjisyx/image/upload/f_auto,q_auto/v1779432441/photos-du-monde/kvihgh5gzm3ustkddz2h.jpg" },
    { src: "https://res.cloudinary.com/doxsjisyx/image/upload/f_auto,q_auto/v1779432445/photos-du-monde/tt8asa7fnuxyfce0g46s.jpg" },
    { src: "https://res.cloudinary.com/doxsjisyx/image/upload/f_auto,q_auto/v1779432447/photos-du-monde/w9huiiq6khx4lf3g4acw.jpg" },
    { src: "https://res.cloudinary.com/doxsjisyx/image/upload/f_auto,q_auto/v1779432450/photos-du-monde/emgdtvufponxl1fvrt09.jpg" },
    { src: "https://res.cloudinary.com/doxsjisyx/image/upload/f_auto,q_auto/v1779432452/photos-du-monde/opbeqy4wfb6npnobwxpo.jpg" },
    { src: "https://res.cloudinary.com/doxsjisyx/image/upload/f_auto,q_auto/v1779432454/photos-du-monde/vrwask99ljiiqddptbha.jpg" },
    { src: "https://res.cloudinary.com/doxsjisyx/image/upload/f_auto,q_auto/v1779432456/photos-du-monde/eul9llvxwg3mrpb5mkmg.jpg" }
    ],
    lat: 9.915285,
    lng: -84.105542,
    tags: [],
    published: true,
    waypoints: [

    ]
  }
];
