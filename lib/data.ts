// @ts-nocheck
// Data managed via admin — do not edit manually
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
};

export const VOYAGES = [
  {
    slug: "hawaii-volcans-tropicaux",
    title: "Sous les nuages tropicaux d'Hawaï",
    country: "États-Unis",
    city: "Hilo",
    startDate: "2024-06-01",
    description: "Sous les nuages tropicaux d'Hawaï, les volcans façonnent un paysage presque irréel. Entre coulées de lave noire, falaises abruptes et plages sauvages bordées par l'océan Pacifique, chaque instant donne l'impression d'explorer un autre monde — un territoire encore en train de naître sous nos pieds.",
    heroImage: "https://res.cloudinary.com/doxsjisyx/image/upload/v1779368566/photos-du-monde/kbxt5gfqwzvnoyglopcd.png",
    photos: [
    { src: "https://res.cloudinary.com/doxsjisyx/image/upload/v1779123268/istockphoto-858018608-2048x2048_seuyjk.jpg" },
    { src: "https://res.cloudinary.com/doxsjisyx/image/upload/marcus_two_kids_and_pikachu_exploring_an_island_in_jungle_c4ca1393-6cd3-465d-937d-85ce68c48be4_zojkvm" },
    { src: "https://res.cloudinary.com/doxsjisyx/image/upload/marcus_juicy_fruit_in_the_trees_in_jungle_2ca5d57c-ed6e-4bb7-8702-9c771fd13593_ekwxvp" },
    { src: "https://res.cloudinary.com/doxsjisyx/image/upload/marcus_jungle_with_dino_and_pokemon_3f6114f2-be70-4798-a1c1-fe227d2b828d_1_jkqeaq" },
    { src: "https://res.cloudinary.com/doxsjisyx/image/upload/marcus_big_fight_between_pikachu_and_mewtwo_e519e9c8-c85b-433a-bf41-493b3eab6601_1_zuoadj" }
    ],
    lat: null,
    lng: null,
    tags: ["Volcan", "Hawaï", "Lave", "Jungle tropicale"],
    published: true
  }
];
