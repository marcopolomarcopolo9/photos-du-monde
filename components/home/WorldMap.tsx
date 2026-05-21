// @ts-nocheck
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { VOYAGES } from '@/lib/data';

// Convert lat/lng to SVG coordinates (Robinson-like simple projection)
function toXY(lat: number, lng: number): { x: number; y: number } {
  const width = 1000;
  const height = 500;
  const x = (lng + 180) * (width / 360);
  const y = (90 - lat) * (height / 180);
  return { x, y };
}

export default function WorldMap() {
  const [hovered, setHovered] = useState<string | null>(null);

  const voyagesWithCoords = VOYAGES.filter(
    (v) => v.coordinates && (v.coordinates.lat !== 0 || v.coordinates.lng !== 0)
  );

  const hoveredVoyage = voyagesWithCoords.find((v) => v.slug === hovered);

  return (
    <section className="bg-noir-soft py-24 md:py-32 overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-px bg-or" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-or font-poppins">
            Les destinations
          </span>
        </div>
        <h2 className="font-serif font-light text-4xl md:text-5xl text-creme italic leading-snug mb-12">
          Une carte du <em>monde explorÃ©</em>
        </h2>

        {/* Map container */}
        <div className="relative rounded-sm overflow-hidden border border-white/5">
          {/* World map SVG background */}
          <svg
            viewBox="0 0 1000 500"
            className="w-full"
            style={{ background: 'linear-gradient(180deg, #0d1a0d 0%, #0a1208 100%)' }}
          >
            {/* Simple continent outlines */}
            {/* North America */}
            <path
              d="M 130 80 L 155 70 L 185 75 L 220 65 L 245 75 L 260 95 L 255 115 L 240 130 L 230 160 L 215 175 L 200 200 L 185 230 L 170 240 L 155 235 L 145 220 L 140 200 L 120 185 L 110 165 L 105 140 L 110 115 L 125 95 Z"
              fill="#1a3d14"
              fillOpacity="0.4"
              stroke="#2d6a22"
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />
            {/* Greenland */}
            <path
              d="M 195 35 L 215 30 L 230 38 L 225 52 L 210 58 L 195 50 Z"
              fill="#1a3d14"
              fillOpacity="0.3"
              stroke="#2d6a22"
              strokeWidth="0.6"
              strokeOpacity="0.4"
            />
            {/* South America */}
            <path
              d="M 200 250 L 220 240 L 245 245 L 260 260 L 265 285 L 260 315 L 250 345 L 235 375 L 220 395 L 205 400 L 195 390 L 190 365 L 195 335 L 190 305 L 185 275 L 190 255 Z"
              fill="#1a3d14"
              fillOpacity="0.4"
              stroke="#2d6a22"
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />
            {/* Europe */}
            <path
              d="M 455 75 L 475 68 L 495 72 L 510 80 L 515 95 L 505 108 L 490 115 L 475 112 L 460 105 L 450 90 Z"
              fill="#1a3d14"
              fillOpacity="0.4"
              stroke="#2d6a22"
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />
            {/* Africa */}
            <path
              d="M 460 145 L 490 135 L 520 140 L 540 160 L 548 190 L 545 225 L 535 260 L 520 295 L 505 325 L 490 340 L 475 338 L 460 320 L 448 290 L 442 255 L 440 220 L 442 185 L 448 160 Z"
              fill="#1a3d14"
              fillOpacity="0.4"
              stroke="#2d6a22"
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />
            {/* Asia */}
            <path
              d="M 510 75 L 560 65 L 620 60 L 680 68 L 730 75 L 770 85 L 790 100 L 800 120 L 790 145 L 770 160 L 745 165 L 720 158 L 700 150 L 670 155 L 640 165 L 610 160 L 580 155 L 555 145 L 530 135 L 515 118 L 508 95 Z"
              fill="#1a3d14"
              fillOpacity="0.4"
              stroke="#2d6a22"
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />
            {/* Indian subcontinent */}
            <path
              d="M 620 165 L 650 158 L 668 172 L 665 200 L 650 225 L 635 230 L 620 218 L 614 195 Z"
              fill="#1a3d14"
              fillOpacity="0.35"
              stroke="#2d6a22"
              strokeWidth="0.7"
              strokeOpacity="0.4"
            />
            {/* Southeast Asia */}
            <path
              d="M 730 155 L 760 150 L 780 162 L 790 180 L 780 195 L 760 198 L 740 188 L 728 172 Z"
              fill="#1a3d14"
              fillOpacity="0.35"
              stroke="#2d6a22"
              strokeWidth="0.7"
              strokeOpacity="0.4"
            />
            {/* Australia */}
            <path
              d="M 770 290 L 810 278 L 850 280 L 875 295 L 880 320 L 870 348 L 845 360 L 810 358 L 780 345 L 760 320 L 758 300 Z"
              fill="#1a3d14"
              fillOpacity="0.4"
              stroke="#2d6a22"
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />

            {/* Equator line */}
            <line
              x1="0"
              y1="250"
              x2="1000"
              y2="250"
              stroke="#C8A96E"
              strokeWidth="0.4"
              strokeOpacity="0.2"
              strokeDasharray="4 8"
            />
            {/* Tropic of Cancer */}
            <line
              x1="0"
              y1="203"
              x2="1000"
              y2="203"
              stroke="#C8A96E"
              strokeWidth="0.3"
              strokeOpacity="0.1"
              strokeDasharray="2 10"
            />
            {/* Tropic of Capricorn */}
            <line
              x1="0"
              y1="297"
              x2="1000"
              y2="297"
              stroke="#C8A96E"
              strokeWidth="0.3"
              strokeOpacity="0.1"
              strokeDasharray="2 10"
            />

            {/* Grid lines */}
            {[-60, -30, 0, 30, 60, 90, 120, 150].map((lng) => {
              const x = (lng + 180) * (1000 / 360);
              return (
                <line
                  key={lng}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2="500"
                  stroke="#ffffff"
                  strokeWidth="0.3"
                  strokeOpacity="0.04"
                />
              );
            })}
            {[-60, -30, 0, 30, 60].map((lat) => {
              const y = (90 - lat) * (500 / 180);
              return (
                <line
                  key={lat}
                  x1="0"
                  y1={y}
                  x2="1000"
                  y2={y}
                  stroke="#ffffff"
                  strokeWidth="0.3"
                  strokeOpacity="0.04"
                />
              );
            })}

            {/* Voyage markers */}
            {voyagesWithCoords.map((voyage) => {
              const { x, y } = toXY(voyage.coordinates!.lat, voyage.coordinates!.lng);
              const isHovered = hovered === voyage.slug;
              return (
                <g key={voyage.slug}>
                  {/* Pulse ring */}
                  {isHovered && (
                    <circle
                      cx={x}
                      cy={y}
                      r="16"
                      fill="none"
                      stroke="#C8A96E"
                      strokeWidth="1"
                      strokeOpacity="0.5"
                    />
                  )}
                  {/* Outer ring */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 7 : 5}
                    fill="none"
                    stroke="#C8A96E"
                    strokeWidth={isHovered ? 1.5 : 1}
                    strokeOpacity={isHovered ? 0.9 : 0.5}
                    style={{ transition: 'all 0.3s ease' }}
                  />
                  {/* Inner dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 3.5 : 2.5}
                    fill="#C8A96E"
                    fillOpacity={isHovered ? 1 : 0.7}
                    style={{ transition: 'all 0.3s ease' }}
                  />
                  {/* Invisible hit area */}
                  <circle
                    cx={x}
                    cy={y}
                    r="18"
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHovered(voyage.slug)}
                    onMouseLeave={() => setHovered(null)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Hover tooltip */}
          {hoveredVoyage && (
            <div className="absolute bottom-4 left-4 bg-noir/90 backdrop-blur-sm border border-or/30 px-5 py-4 max-w-xs pointer-events-none">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-px bg-or" />
                <span className="text-[9px] tracking-[0.3em] uppercase text-or font-poppins">
                  {hoveredVoyage.country}
                </span>
              </div>
              <p className="font-serif italic text-creme text-lg leading-tight">
                {hoveredVoyage.title}
              </p>
              <p className="text-[11px] text-creme/50 mt-1 font-poppins">
                {hoveredVoyage.region || hoveredVoyage.city}
              </p>
            </div>
          )}

          {/* Corner label */}
          <div className="absolute top-3 right-4 text-[9px] tracking-[0.25em] uppercase text-creme/20 font-poppins">
            {voyagesWithCoords.length} destinations
          </div>
        </div>

        {/* Destination chips */}
        <div className="flex flex-wrap gap-3 mt-8">
          {voyagesWithCoords.map((voyage) => (
            <Link
              key={voyage.slug}
              href={`/voyages/${voyage.slug}`}
              className="group flex items-center gap-2 border border-white/10 hover:border-or/50 px-4 py-2 transition-all duration-300"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-or/60 group-hover:bg-or transition-colors" />
              <span className="text-[11px] tracking-[0.15em] uppercase text-creme/60 group-hover:text-creme/90 transition-colors font-poppins">
                {voyage.country}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
