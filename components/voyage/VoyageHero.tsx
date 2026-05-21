// @ts-nocheck
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Camera, MapPin } from 'lucide-react';
import type { Voyage } from '@/lib/types';

interface Props {
  voyage: Voyage;
}

export default function VoyageHero({ voyage }: Props) {
  const start = new Date(voyage.startDate).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <section className="relative h-[75vh] min-h-[500px] overflow-hidden bg-noir">
      {/* Letterbox */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-noir z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-14 bg-noir z-20" />

      {/* Hero image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={voyage.heroImage}
          alt={voyage.heroImageAlt}
          fill
          priority
          className="object-cover scale-[1.02]"
          sizes="100vw"
        />
      </div>

      {/* Gradient */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-noir via-noir/50 to-noir/20" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-noir/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-30 h-full flex flex-col justify-end pb-20 md:pb-24 px-6 md:px-14 max-w-screen-xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-5 text-[10px] tracking-widest uppercase text-creme/40">
          <Link href="/voyages" className="hover:text-or transition-colors">Voyages</Link>
          <span>/</span>
          <span className="text-creme/60">{voyage.country}</span>
        </div>

        {/* Category tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {(voyage.categories||[]).map((cat) => (
            <span key={cat} className="badge">{cat}</span>
          ))}
        </div>

        {/* Title */}
        <h1 className="font-serif font-light text-4xl md:text-6xl lg:text-7xl text-creme italic leading-tight mb-4">
          {voyage.title}
        </h1>
        <p className="text-lg md:text-xl text-creme/60 font-light mb-8">
          {voyage.subtitle}
        </p>

        {/* Meta strip */}
        <div className="flex flex-wrap gap-6 text-xs text-creme/40">
          <span className="flex items-center gap-2">
            <MapPin size={12} className="text-or" />
            {voyage.city}{voyage.region ? `, ${voyage.region}` : ''}
          </span>
          <span className="flex items-center gap-2">
            <Calendar size={12} className="text-or" />
            {start}
          </span>
          <span className="flex items-center gap-2">
            <Clock size={12} className="text-or" />
            {voyage.duration} jours
          </span>
          <span className="flex items-center gap-2">
            <Camera size={12} className="text-or" />
            {voyage.photos.length} photographies
          </span>
        </div>
      </div>
    </section>
  );
}
