export const CATEGORIES = [
  { slug: 'volcans',    label: 'Volcans',          emoji: '🌋', description: 'Lave, cratères et paysages volcaniques' },
  { slug: 'forets',     label: 'Forêts',           emoji: '🌿', description: 'Forêts tropicales, jungles et sous-bois' },
  { slug: 'plages',     label: 'Plages',           emoji: '🏖️', description: 'Côtes, plages et paysages maritimes' },
  { slug: 'montagnes',  label: 'Montagnes',        emoji: '⛰️', description: 'Sommets, cols et paysages alpins' },
  { slug: 'deserts',    label: 'Déserts',          emoji: '🏜️', description: 'Dunes, steppes et terres arides' },
  { slug: 'faune',      label: 'Faune',            emoji: '🦜', description: 'Oiseaux, mammifères et vie sauvage' },
  { slug: 'flore',      label: 'Flore',            emoji: '🌸', description: 'Plantes, fleurs et végétation du monde' },
  { slug: 'villes',     label: 'Villes',           emoji: '🏙️', description: 'Cultures, architectures et vie urbaine' },
  { slug: 'culture',    label: 'Culture',          emoji: '🎭', description: 'Traditions, peuples et patrimoine' },
  { slug: 'aurores',    label: 'Aurores boréales', emoji: '🌌', description: 'Lumières polaires et ciels nordiques' },
  { slug: 'voitures',   label: 'Voitures',         emoji: '🚗', description: 'Voitures et transport' },
  { slug: 'svalbard',   label: 'Svalbard',          emoji: '🧊', description: 'Archipel arctique norvégien' },

] as const;

export type CategorySlug = typeof CATEGORIES[number]['slug'];

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find(c => c.slug === slug);
}

export function getCategoryLabel(slug: string) {
  return CATEGORIES.find(c => c.slug === slug)?.label || slug;
}
