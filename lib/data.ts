import { Voyage, Photo } from './types';

const BASE = 'https://res.cloudinary.com/doxsjisyx/image/upload';

export const VOYAGES: Voyage[] = [
  {
    id: '1779178508456',
    slug: 'tetette',
    title: 'tetette',
    subtitle: 'cxCCXC',
    description: 'csds',
    country: 'chine',
    continent: 'Amérique Centrale',
    city: '',
    region: '',
    startDate: '1999-09-10',
    endDate: '',
    duration: 7,
    heroImage: 'https://res.cloudinary.com/doxsjisyx/image/upload/v1779178408/photos-du-monde/oeasyrqufe8ermlusfbz.jpg',
    heroImageAlt: 'tetette',
    featured: true,
    coordinates: { lat: 0, lng: 0 },
    tags: [],
    categories: ['Paysages'],
    photos: [
      {
        id: '1779178508456-p0',
        src: 'https://res.cloudinary.com/doxsjisyx/image/upload/v1779178442/photos-du-monde/wkx2sci6vjwbihazs0t0.png',
        alt: 'Magic logo',
        location: '',
        country: 'chine',
        continent: 'Amérique Centrale',
        date: '2026-05-19',
        width: 1200,
        height: 800,
        voyageSlug: 'tetette',
      },
      {
        id: '1779178508456-p1',
        src: 'https://res.cloudinary.com/doxsjisyx/image/upload/v1779178451/photos-du-monde/vsxrtqi1ytf4s6htiuu1.png',
        alt: 'logofb',
        location: '',
        country: 'chine',
        continent: 'Amérique Centrale',
        date: '2026-05-19',
        width: 1200,
        height: 800,
        voyageSlug: 'tetette',
      }
    ],
    anecdotes: [

    ],
    tips: [

    ],
  },
  {
    id: '1',
    slug: 'hawaii-volcans-tropicaux',
    title: "Sous les nuages tropicaux d'Hawaï",
    subtitle: 'Big Island, Hawaii',
    description:
      "Sous les nuages tropicaux d'Hawaï, les volcans façonnent un paysage presque irréel. Entre coulées de lave noire, falaises abruptes et plages sauvages bordées par l'océan Pacifique, chaque instant donne l'impression d'explorer un autre monde — un territoire encore en train de naître sous nos pieds.",
    country: 'États-Unis',
    continent: 'Amérique du Nord',
    city: 'Hilo',
    region: 'Big Island, Hawaii',
    startDate: '2024-06-01',
    endDate: '2024-06-08',
    duration: 7,
    heroImage: `https://res.cloudinary.com/doxsjisyx/image/upload/v1779123268/istockphoto-858018608-2048x2048_seuyjk.jpg`,
    heroImageAlt: 'Île volcanique d\'Hawaï baignée de lumière tropicale',
    featured: true,
    coordinates: { lat: 19.421, lng: -155.287 },
    mapPoints: [
      { name: 'Kilauea', coordinates: { lat: 19.42, lng: -155.29 }, description: 'Volcan actif' },
      { name: 'Plage de lave noire', coordinates: { lat: 19.33, lng: -155.2 }, description: 'Chain of Craters' },
      { name: 'Falaises de Waipio', coordinates: { lat: 20.1, lng: -155.6 }, description: 'Vallée sacrée' },
    ],
    tags: ['Volcan', 'Hawaï', 'Lave', 'Jungle tropicale'],
    categories: ['Volcans', 'Paysages', 'Jungle'],
    photos: [
      {
        id: 'hi-1',
        src: `https://res.cloudinary.com/doxsjisyx/image/upload/v1779123268/istockphoto-858018608-2048x2048_seuyjk.jpg`,
        alt: 'L\'île d\'Hawaï vue depuis l\'océan',
        location: 'Big Island, Hawaii',
        country: 'États-Unis',
        continent: 'Amérique du Nord',
        date: '2024-06-01',
        width: 1200,
        height: 800,
        voyageSlug: 'hawaii-volcans-tropicaux',
      },
      {
        id: 'hi-2',
        src: `${BASE}/marcus_two_kids_and_pikachu_exploring_an_island_in_jungle_c4ca1393-6cd3-465d-937d-85ce68c48be4_zojkvm`,
        alt: 'Exploration de la jungle tropicale hawaïenne',
        location: 'Forêt tropicale, Big Island',
        country: 'États-Unis',
        continent: 'Amérique du Nord',
        date: '2024-06-03',
        width: 1200,
        height: 800,
        voyageSlug: 'hawaii-volcans-tropicaux',
      },
      {
        id: 'hi-3',
        src: `${BASE}/marcus_juicy_fruit_in_the_trees_in_jungle_2ca5d57c-ed6e-4bb7-8702-9c771fd13593_ekwxvp`,
        alt: 'Fruits tropicaux dans la végétation hawaïenne',
        location: 'Végétation volcanique, Hawaii',
        country: 'États-Unis',
        continent: 'Amérique du Nord',
        date: '2024-06-04',
        width: 1200,
        height: 800,
        voyageSlug: 'hawaii-volcans-tropicaux',
      },
      {
        id: 'hi-4',
        src: `${BASE}/marcus_jungle_with_dino_and_pokemon_3f6114f2-be70-4798-a1c1-fe227d2b828d_1_jkqeaq`,
        alt: 'Végétation dense autour des coulées de lave',
        location: 'Chain of Craters Road',
        country: 'États-Unis',
        continent: 'Amérique du Nord',
        date: '2024-06-05',
        width: 1200,
        height: 800,
        voyageSlug: 'hawaii-volcans-tropicaux',
      },
      {
        id: 'hi-5',
        src: `${BASE}/marcus_big_fight_between_pikachu_and_mewtwo_e519e9c8-c85b-433a-bf41-493b3eab6601_1_zuoadj`,
        alt: 'Éruption volcanique illuminant le ciel nocturne',
        location: 'Kilauea, Parc National',
        country: 'États-Unis',
        continent: 'Amérique du Nord',
        date: '2024-06-06',
        width: 1200,
        height: 800,
        voyageSlug: 'hawaii-volcans-tropicaux',
      },
    ],
    anecdotes: [
      {
        id: 'hi-a1',
        title: 'La lave qui avance',
        content:
          'À la tombée de la nuit, depuis le bord du chemin, on voyait la coulée se déplacer lentement vers l\'océan — trois mètres à l\'heure, inexorable. L\'air sentait le soufre et la pierre brûlée. Quand la lave a touché l\'eau, une colonne de vapeur blanche s\'est élevée dans le ciel nocturne. La Terre en train de se construire, sous nos yeux.',
        location: 'Chain of Craters Road, Parc National',
      },
      {
        id: 'hi-a2',
        title: 'La forêt qui repousse',
        content:
          'Sur les flancs du Kilauea, là où la lave a recouvert tout il y a vingt ans, des fougères repoussent entre les roches noires. La vie revient toujours — plus tenace qu\'on ne l\'imagine. Des oiseaux qu\'on ne voit nulle part ailleurs s\'y réfugient. Un écosystème qui se reconstruit dans l\'un des endroits les plus hostiles du monde.',
        location: 'Flancs du Kilauea, Big Island',
      },
      {
        id: 'hi-a3',
        title: 'Les falaises de Waipio',
        content:
          'Au nord de l\'île, la vallée de Waipio s\'ouvre sur l\'océan entre deux falaises de 600 mètres. En bas, une plage noire déserte. Le chemin descend à 25% de pente — on a dû laisser la voiture en haut et descendre à pied. Personne en bas. Juste l\'océan, les falaises, et le bruit des vagues.',
        location: 'Vallée de Waipio, North Kohala',
      },
    ],
    tips: [
      'Réserver au Volcano House — hôtel sur le bord du cratère, vue nocturne unique',
      'Suivre les mises à jour du USGS pour les zones de lave accessibles',
      'Chaussures de randonnée avec semelle épaisse — la lave récente est tranchante',
      'Lunettes de soleil anti-UV renforcées pour les zones de lave blanche en plein soleil',
      'Plage de sable noir de Punaluu — tortues vertes garanties le matin tôt',
    ],
  },
];

export const ALL_PHOTOS: Photo[] = VOYAGES.flatMap((v) => v.photos);

export const FEATURED_VOYAGES = VOYAGES.filter((v) => v.featured);

export function getVoyageBySlug(slug: string): Voyage | undefined {
  return VOYAGES.find((v) => v.slug === slug);
}

export const HERO_SLIDES = [
  {
    id: 1,
    image: `https://res.cloudinary.com/doxsjisyx/image/upload/v1779123268/istockphoto-858018608-2048x2048_seuyjk.jpg`,
    country: 'États-Unis',
    location: 'Big Island, Hawaii',
    title: "Sous les nuages\ntropicaux d'Hawaï",
    subtitle: "Les volcans façonnent un paysage presque irréel. La Terre qui se construit encore.",
    slug: 'hawaii-volcans-tropicaux',
    year: '2024',
  },
  {
    id: 2,
    image: `${BASE}/marcus_jungle_with_dino_and_pokemon_3f6114f2-be70-4798-a1c1-fe227d2b828d_1_jkqeaq`,
    country: 'États-Unis',
    location: 'Forêt tropicale, Hawaii',
    title: "La forêt qui\nrepousse sur la lave",
    subtitle: "Sur les flancs du Kilauea, la vie revient toujours. Plus tenace qu'on ne l'imagine.",
    slug: 'hawaii-volcans-tropicaux',
    year: '2024',
  },
  {
    id: 3,
    image: `${BASE}/marcus_big_fight_between_pikachu_and_mewtwo_e519e9c8-c85b-433a-bf41-493b3eab6601_1_zuoadj`,
    country: 'États-Unis',
    location: 'Kilauea, Hawaii',
    title: "La nuit où\nla lave a touché l'océan",
    subtitle: "Une colonne de vapeur blanche dans le ciel nocturne. La Terre sous nos yeux.",
    slug: 'hawaii-volcans-tropicaux',
    year: '2024',
  },
];

export const STATS = [
  { value: '7', label: 'Jours sur l\'île' },
  { value: '3', label: 'Volcans explorés' },
  { value: '5', label: 'Photographies' },
  { value: '2', label: 'Plages de lave noire' },
];
