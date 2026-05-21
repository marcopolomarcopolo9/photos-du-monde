# Photos du Monde 🌋🦜

> Site photographique immersif — Volcans · Jungle · Oiseaux

## Stack
- **Next.js 15** (App Router)
- **TypeScript** strict
- **Tailwind CSS** + thème custom
- **Framer Motion** animations
- **next/image** optimisation images

## Lancer le projet

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en développement
npm run dev

# 3. Build production
npm run build && npm start
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Structure

```
app/
├── page.tsx              → Accueil (Hero + Stats + Voyages featured)
├── galerie/page.tsx      → Galerie masonry complète
├── voyages/page.tsx      → Liste des voyages
├── voyages/[slug]/       → Page voyage individuelle
└── admin/page.tsx        → Interface admin

components/
├── layout/               → Navbar, Footer
├── home/                 → Hero, FeaturedVoyages, StatsSection
├── gallery/              → MasonryGrid, Lightbox, Filters
├── voyage/               → VoyageHero, VoyageMap, AnecdoteCard
└── ui/                   → CustomCursor, ScrollReveal

lib/
├── data.ts               → Données de voyage (à enrichir)
└── types.ts              → Types TypeScript
```

## Ajouter un voyage

Éditer `lib/data.ts` et ajouter une entrée dans le tableau `VOYAGES` :

```ts
{
  id: '6',
  slug: 'mon-nouveau-voyage',
  title: 'Titre cinématographique',
  subtitle: 'Lieu, Pays',
  description: 'Description complète...',
  country: 'Pays',
  continent: 'Amérique du Sud',
  city: 'Ville',
  startDate: '2025-01-10',
  endDate: '2025-01-20',
  duration: 10,
  heroImage: 'https://images.unsplash.com/...',
  heroImageAlt: 'Description de l'image',
  photos: [...],
  anecdotes: [...],
  tips: [...],
  coordinates: { lat: 0, lng: 0 },
  tags: ['Jungle', 'Oiseaux'],
  categories: ['Jungle', 'Oiseaux'],
  featured: true,
}
```

## Palette couleurs

| Nom | Valeur | Usage |
|-----|--------|-------|
| `noir` | `#0a0805` | Fond principal |
| `creme` | `#f0e8d8` | Texte principal |
| `or` | `#C8A96E` | Accents, liens |
| `volcan` | `#7A2E1A` | Tags volcans |
| `jungle` | `#1A3D14` | Tags jungle |

## Déploiement

Compatible **Vercel** (déploiement en un clic), **Netlify**, ou tout hébergeur Node.js.

```bash
# Sur Vercel
vercel deploy
```
# Force deploy Thu May 21 12:56:38 UTC 2026
