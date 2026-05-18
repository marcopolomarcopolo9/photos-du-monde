import { Voyage, Photo } from './types';

export const VOYAGES: Voyage[] = [
  {
    id: '1',
    slug: 'costa-rica-volcan-arenal',
    title: 'La nuit où la terre a rugit',
    subtitle: 'Volcan Arenal, Costa Rica',
    description:
      "Cinq jours au cœur du parc national Arenal, à observer l'un des volcans les plus actifs du monde. Des nuits où la lave illumine le ciel noir, des matinées dans la jungle dense peuplée d'animaux extraordinaires, et la sensation permanente que la Terre est vivante sous nos pieds.",
    country: 'Costa Rica',
    continent: 'Amérique Centrale',
    city: 'La Fortuna',
    region: 'Alajuela',
    startDate: '2024-02-12',
    endDate: '2024-02-19',
    duration: 7,
    heroImage:
      'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=2000&q=90',
    heroImageAlt: 'Volcan Arenal au coucher du soleil entouré de jungle tropicale',
    featured: true,
    coordinates: { lat: 10.463, lng: -84.703 },
    mapPoints: [
      { name: 'La Fortuna', coordinates: { lat: 10.468, lng: -84.643 }, description: 'Base de départ' },
      { name: 'Volcan Arenal', coordinates: { lat: 10.463, lng: -84.703 }, description: 'Cratère principal' },
      { name: 'Lac Arenal', coordinates: { lat: 10.52, lng: -84.85 }, description: 'Vue panoramique' },
    ],
    tags: ['Volcan', 'Jungle', 'Oiseaux', 'Costa Rica'],
    categories: ['Volcans', 'Jungle', 'Oiseaux'],
    photos: [
      {
        id: 'cr-1',
        src: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1200&q=85',
        alt: 'Volcan Arenal dans la brume',
        location: 'Parc National Arenal',
        country: 'Costa Rica',
        continent: 'Amérique Centrale',
        date: '2024-02-13',
        width: 1200,
        height: 800,
        voyageSlug: 'costa-rica-volcan-arenal',
      },
      {
        id: 'cr-2',
        src: 'https://images.unsplash.com/photo-1502780809386-dc0a5e679fda?auto=format&fit=crop&w=1200&q=85',
        alt: 'Toucan dans la canopée costaricaine',
        location: 'Canopée d\'Arenal',
        country: 'Costa Rica',
        continent: 'Amérique Centrale',
        date: '2024-02-14',
        width: 1200,
        height: 1500,
        voyageSlug: 'costa-rica-volcan-arenal',
      },
      {
        id: 'cr-3',
        src: 'https://images.unsplash.com/photo-1518182170040-b60c0f3f2c9d?auto=format&fit=crop&w=1200&q=85',
        alt: 'Jungle tropicale dense au Costa Rica',
        location: 'Jungle Arenal',
        country: 'Costa Rica',
        continent: 'Amérique Centrale',
        date: '2024-02-15',
        width: 1200,
        height: 900,
        voyageSlug: 'costa-rica-volcan-arenal',
      },
      {
        id: 'cr-4',
        src: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=1200&q=85',
        alt: 'Toucan à bec coloré perché sur une branche',
        location: 'Forêt Arenal',
        country: 'Costa Rica',
        continent: 'Amérique Centrale',
        date: '2024-02-16',
        width: 1200,
        height: 1600,
        voyageSlug: 'costa-rica-volcan-arenal',
      },
    ],
    anecdotes: [
      {
        id: 'a1',
        title: 'Le rugissement de minuit',
        content:
          'À 2h du matin, un grondement sourd a fait vibrer les murs du lodge. Le volcan se réveillait. En sortant, le ciel était zébré de rouge — la lave coulait silencieusement sur le flanc est du cône, visible depuis la terrasse. Un spectacle de 40 minutes qui ressemble à rien d\'autre sur Terre.',
        location: 'Lodge Arenal, Altitude 800m',
      },
      {
        id: 'a2',
        title: 'L\'appel du quetzal',
        content:
          'Le guide nous a stoppés net sur le sentier. "Écoutez". Un sifflement grave, répété trois fois. En levant les yeux, à 30 mètres — le quetzal resplendissant, queue de 60cm, vert métallique qui irradie même dans la pénombre de la canopée. Un oiseau qui était sacré pour les Mayas.',
        location: 'Sentier Colada, Forêt Nuageuse',
      },
      {
        id: 'a3',
        title: 'La pluie de cendres',
        content:
          'Le quatrième matin, une fine pluie grise couvrait tout. Les voitures, les feuilles, ma veste. Des cendres du volcan, soulevées par un vent thermique nocturne. Ça avait un goût minéral sur les lèvres. J\'en ai ramené un peu dans un bocal.',
        location: 'La Fortuna, Place centrale',
      },
    ],
    tips: [
      'Réserver le lodge côté nord-ouest pour voir la lave la nuit',
      'Guide Rodrigo Martinez (+506 8888-XXXX) — le meilleur pour les oiseaux',
      'Meilleure saison : février-avril (saison sèche, volcan bien visible)',
      'Binoculaires indispensables pour observer les oiseaux dans la canopée',
      'Les termales (sources chaudes) après une journée de randonnée : obligatoires',
    ],
  },
  {
    id: '2',
    slug: 'galapagos-ballet-des-oiseaux',
    title: 'Là où Darwin a tout compris',
    subtitle: 'Îles Galápagos, Équateur',
    description:
      "Treize jours de croisière entre les îles les plus étranges de la planète. Des fous à pieds bleus qui dansent, des iguanes marins qui plongent, un volcan actif dont la dernière éruption date de quelques semaines. Et partout, une faune qui n'a jamais appris à avoir peur des humains.",
    country: 'Équateur',
    continent: 'Amérique du Sud',
    city: 'Puerto Ayora',
    region: 'Galápagos',
    startDate: '2024-06-03',
    endDate: '2024-06-15',
    duration: 13,
    heroImage:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=2000&q=90',
    heroImageAlt: 'Flamants roses aux Galápagos au coucher du soleil',
    featured: true,
    coordinates: { lat: -0.966, lng: -90.965 },
    mapPoints: [
      { name: 'Santa Cruz', coordinates: { lat: -0.74, lng: -90.31 } },
      { name: 'Isabela', coordinates: { lat: -0.97, lng: -91.08 } },
      { name: 'Española', coordinates: { lat: -1.38, lng: -89.68 } },
      { name: 'Genovesa', coordinates: { lat: 0.32, lng: -89.95 } },
    ],
    tags: ['Oiseaux', 'Volcans', 'Faune', 'Galápagos'],
    categories: ['Volcans', 'Oiseaux', 'Faune'],
    photos: [
      {
        id: 'gal-1',
        src: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85',
        alt: 'Flamants roses dans les lagunes des Galápagos',
        location: 'Isla Isabela',
        country: 'Équateur',
        continent: 'Amérique du Sud',
        date: '2024-06-06',
        width: 1200,
        height: 800,
        voyageSlug: 'galapagos-ballet-des-oiseaux',
      },
      {
        id: 'gal-2',
        src: 'https://images.unsplash.com/photo-1524464546800-9efc51ef12db?auto=format&fit=crop&w=1200&q=85',
        alt: 'Ara rouge et bleu dans la végétation tropicale',
        location: 'Isla Santa Cruz',
        country: 'Équateur',
        continent: 'Amérique du Sud',
        date: '2024-06-07',
        width: 1200,
        height: 1600,
        voyageSlug: 'galapagos-ballet-des-oiseaux',
      },
      {
        id: 'gal-3',
        src: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1200&q=85',
        alt: 'Volcan actif de l\'Île Isabela en éruption',
        location: 'Volcan Sierra Negra, Isabela',
        country: 'Équateur',
        continent: 'Amérique du Sud',
        date: '2024-06-09',
        width: 1200,
        height: 900,
        voyageSlug: 'galapagos-ballet-des-oiseaux',
      },
    ],
    anecdotes: [
      {
        id: 'b1',
        title: 'La danse des fous à pieds bleus',
        content:
          'Le fou à pieds bleus mâle lève les pieds, l\'un après l\'autre, très lentement, comme pour montrer la beauté de ses pattes turquoise. La femelle regarde, impassible. C\'est l\'un des rituels de séduction les plus absurdes et touchants qu\'on puisse observer. Et ils se fichent totalement qu\'un photographe soit à 50 centimètres.',
        location: 'Isla Española',
      },
      {
        id: 'b2',
        title: 'Le volcan de la semaine dernière',
        content:
          'Le guide nous a indiqué les coulées de lave refroidies, encore noires et lisses, à 2km du sommet du Sierra Negra. "Ça date de la semaine dernière." On marchait littéralement sur la lave de la semaine précédente. L\'odeur de soufre persistait. La Terre fabriquait encore du sol sous nos pieds.',
        location: 'Volcan Sierra Negra, Isabela',
      },
    ],
    tips: [
      'Croisière de 8 jours minimum pour voir plusieurs îles',
      'Isla Española pour les fous à pieds bleus (oct-déc pour la reproduction)',
      'Ne jamais toucher les animaux — ils viennent d\'eux-mêmes vers vous',
      'Prévoir 2 jours de mal de mer les premiers jours en haute mer',
    ],
  },
  {
    id: '3',
    slug: 'amazonie-emeraude-monde',
    title: "L'émeraude du monde",
    subtitle: 'Amazonie, Pérou',
    description:
      "Trois semaines dans la forêt primaire amazonienne au départ d'Iquitos. La jungle n'est pas silencieuse — elle est assourdissante. Des dizaines d'espèces de perroquets, des aras en vol, des singes hurleurs à l'aube, et une lumière verte unique qui filtre à travers la canopée comme nulle part ailleurs.",
    country: 'Pérou',
    continent: 'Amérique du Sud',
    city: 'Iquitos',
    region: 'Loreto',
    startDate: '2023-09-05',
    endDate: '2023-09-25',
    duration: 20,
    heroImage:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2000&q=90',
    heroImageAlt: 'Canopée amazonienne vue depuis le sol, lumière filtrée',
    featured: true,
    coordinates: { lat: -3.749, lng: -73.247 },
    mapPoints: [
      { name: 'Iquitos', coordinates: { lat: -3.74, lng: -73.25 }, description: 'Accès par avion uniquement' },
      { name: 'Pacaya-Samiria', coordinates: { lat: -5.2, lng: -74.8 }, description: 'Réserve nationale' },
      { name: 'Río Amazonas', coordinates: { lat: -3.5, lng: -72.9 } },
    ],
    tags: ['Jungle', 'Oiseaux', 'Amazonie', 'Pérou'],
    categories: ['Jungle', 'Oiseaux', 'Faune'],
    photos: [
      {
        id: 'am-1',
        src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85',
        alt: 'Forêt amazonienne primaire, lumière verte filtrée',
        location: 'Réserve Pacaya-Samiria',
        country: 'Pérou',
        continent: 'Amérique du Sud',
        date: '2023-09-08',
        width: 1200,
        height: 1800,
        voyageSlug: 'amazonie-emeraude-monde',
      },
      {
        id: 'am-2',
        src: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=85',
        alt: 'Chemin dans la jungle amazonienne',
        location: 'Sentier Pacaya-Samiria',
        country: 'Pérou',
        continent: 'Amérique du Sud',
        date: '2023-09-10',
        width: 1200,
        height: 900,
        voyageSlug: 'amazonie-emeraude-monde',
      },
    ],
    anecdotes: [
      {
        id: 'c1',
        title: 'Le concert de l\'aube',
        content:
          'À 4h30, avant même la lumière, les singes hurleurs démarrent. Un son entre le rugissement de lion et le vent dans les rochers — ça porte à 5 kilomètres. Puis les perroquets, les aras, les toucans. À 5h15, la jungle est une symphonie absolument assourdissante. Le jour n\'est pas encore levé et 200 espèces chantent déjà à plein volume.',
        location: 'Cabanes flottantes, Río Amazonas',
      },
    ],
    tips: [
      'Accès uniquement par avion depuis Lima jusqu\'à Iquitos',
      'Loge sur le fleuve — indispensable pour l\'observation des oiseaux à l\'aube',
      'Septembre-novembre : eau basse, plus facile de voir les animaux',
      'Répulsif DEET 50% minimum — les moustiques sont redoutables',
    ],
  },
  {
    id: '4',
    slug: 'islande-lumiere-volcanique',
    title: 'La lumière qui n\'existe que là',
    subtitle: 'Péninsule de Reykjanes, Islande',
    description:
      "Deux semaines en Islande pour photographier les éruptions récentes de la péninsule de Reykjanes et la lumière unique de l'hiver arctique. Des fulmars qui glissent au-dessus des coulées de lave, des geysers qui explosent dans l'air glacé, et des paysages qui ressemblent à la surface de la Lune.",
    country: 'Islande',
    continent: 'Europe',
    city: 'Grindavík',
    region: 'Suðurnes',
    startDate: '2024-01-08',
    endDate: '2024-01-22',
    duration: 14,
    heroImage:
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=2000&q=90',
    heroImageAlt: 'Lave en fusion coulant sous les aurores boréales en Islande',
    featured: true,
    coordinates: { lat: 63.848, lng: -22.443 },
    mapPoints: [
      { name: 'Reykjavík', coordinates: { lat: 64.13, lng: -21.94 } },
      { name: 'Eruption Sundhnúkur', coordinates: { lat: 63.84, lng: -22.44 } },
      { name: 'Geysir', coordinates: { lat: 64.31, lng: -20.3 } },
    ],
    tags: ['Volcans', 'Aurores', 'Oiseaux', 'Islande'],
    categories: ['Volcans', 'Paysages', 'Oiseaux'],
    photos: [
      {
        id: 'is-1',
        src: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=85',
        alt: 'Éruption volcanique en Islande de nuit avec aurores boréales',
        location: 'Péninsule de Reykjanes',
        country: 'Islande',
        continent: 'Europe',
        date: '2024-01-12',
        width: 1200,
        height: 800,
        voyageSlug: 'islande-lumiere-volcanique',
      },
      {
        id: 'is-2',
        src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=85',
        alt: 'Coulée de lave incandescente sur roche noire',
        location: 'Sundhnúkur, Reykjanes',
        country: 'Islande',
        continent: 'Europe',
        date: '2024-01-13',
        width: 1200,
        height: 1600,
        voyageSlug: 'islande-lumiere-volcanique',
      },
    ],
    anecdotes: [
      {
        id: 'd1',
        title: 'À 80m de la coulée',
        content:
          'Les autorités avaient autorisé l\'accès à 200m de la fissure. On sentait la chaleur sur le visage à 80m. La lave avançait d\'environ 3m par heure, inexorablement, avalant les rochers, les clôtures, absorbant tout en silence. Pas d\'explosion — juste ce mouvement lent et total qui vous rend minuscule.',
        location: 'Fissure Sundhnúkur, Reykjanes',
      },
    ],
    tips: [
      'Suivre les informations de l\'IMO (Iceland Met Office) pour les éruptions en temps réel',
      'Chaussures de marche avec semelle Vibram pour la lave récente',
      'Janvier-mars : aurores boréales et lumière d\'or en journée (4h de soleil)',
      'Masque anti-gaz SO2 pour s\'approcher des fissures',
    ],
  },
  {
    id: '5',
    slug: 'hawaii-kilauea-oiseau-nene',
    title: 'L\'île qui se construit encore',
    subtitle: 'Big Island, Hawaii',
    description:
      "Hawaii Volcanoes National Park abrite le volcan le plus actif du monde et l'une des espèces d'oiseaux les plus rares — le nēnē, oie des laves endémique. Une semaine entre le bord du cratère Kilauea et les forêts d'ohia où survivent les derniers oiseaux forestiers hawaiiens.",
    country: 'États-Unis',
    continent: 'Amérique du Nord',
    city: 'Hilo',
    region: 'Big Island, Hawaii',
    startDate: '2023-11-14',
    endDate: '2023-11-21',
    duration: 7,
    heroImage:
      'https://images.unsplash.com/photo-1562888060-3c78bdb83fac?auto=format&fit=crop&w=2000&q=90',
    heroImageAlt: 'Coulée de lave Kilauea se jetant dans l\'océan Pacifique à Hawaii',
    featured: false,
    coordinates: { lat: 19.421, lng: -155.287 },
    mapPoints: [
      { name: 'Kilauea Caldera', coordinates: { lat: 19.42, lng: -155.29 } },
      { name: 'Chain of Craters Road', coordinates: { lat: 19.33, lng: -155.2 } },
    ],
    tags: ['Volcans', 'Oiseaux', 'Hawaii', 'Lave'],
    categories: ['Volcans', 'Oiseaux', 'Paysages'],
    photos: [
      {
        id: 'hi-1',
        src: 'https://images.unsplash.com/photo-1562888060-3c78bdb83fac?auto=format&fit=crop&w=1200&q=85',
        alt: 'Lave du Kilauea coulant vers l\'océan',
        location: 'Chain of Craters Road, Big Island',
        country: 'États-Unis',
        continent: 'Amérique du Nord',
        date: '2023-11-16',
        width: 1200,
        height: 800,
        voyageSlug: 'hawaii-kilauea-oiseau-nene',
      },
    ],
    anecdotes: [
      {
        id: 'e1',
        title: 'Le nēnē qui n\'a pas peur',
        content:
          'L\'oie nēnē est l\'oiseau officiel d\'Hawaii. Elle a failli disparaître — il en restait 30 dans les années 50. Aujourd\'hui 2 500. Elles se promènent dans le parking du visitor center, impassibles. Elles ont évolué sur une île sans prédateurs, et ça se voit : elles regardent les humains avec la sérénité de quelqu\'un qui sait exactement qui commande ici.',
        location: 'Kilauea Visitor Center',
      },
    ],
    tips: [
      'Réserver au Volcano House (hôtel au bord du cratère) pour voir la lueur la nuit',
      'Lever du soleil au Mauna Kea (4205m) pour voir l\'île d\'en haut',
      'Forêt d\'Ohia : aller avec un guide spécialisé pour les oiseaux endémiques',
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
    image:
      'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=2000&q=90',
    country: 'Costa Rica',
    location: 'Volcan Arenal',
    title: 'La nuit où\nla terre a rugit',
    subtitle:
      "Sept jours au bord du cratère. Une lumière incandescente qui défie la nuit tropicale.",
    slug: 'costa-rica-volcan-arenal',
    year: '2024',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2000&q=90',
    country: 'Pérou',
    location: 'Amazonie',
    title: "L'émeraude\ndu monde",
    subtitle:
      "Trois semaines dans la forêt primaire. Des espèces que peu d'humains ont vues.",
    slug: 'amazonie-emeraude-monde',
    year: '2023',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=2000&q=90',
    country: 'Islande',
    location: 'Péninsule de Reykjanes',
    title: 'La lumière qui\nn\'existe que là',
    subtitle:
      'Lave en fusion sous les aurores. La planète en train de se refaire.',
    slug: 'islande-lumiere-volcanique',
    year: '2024',
  },
];

export const STATS = [
  { value: '23', label: 'Pays visités' },
  { value: '5', label: 'Continents' },
  { value: '247', label: 'Photographies' },
  { value: '312', label: 'Espèces observées' },
];
