// @ts-nocheck
import type { Voyage } from '@/lib/types';

interface Props {
  voyage: Voyage;
}

export default function VoyageMap({ voyage }: Props) {
  const points = voyage.mapPoints ?? [];

  // Simple lat/lng to SVG position (crude world map projection)
  const toSVG = (lat: number, lng: number) => ({
    x: ((lng + 180) / 360) * 360 + 20,
    y: ((90 - lat) / 180) * 180 + 10,
  });

  return (
    <div className="bg-noir-mid border border-white/5 p-6 md:p-8">
      <div className="text-[10px] tracking-[0.3em] uppercase text-or mb-6">
        Carte du voyage
      </div>

      {/* SVG Map */}
      <div className="relative w-full aspect-[2/1] bg-noir rounded overflow-hidden mb-6">
        <svg
          viewBox="0 0 400 200"
          className="w-full h-full"
          aria-label={`Carte du voyage ${voyage.title}`}
        >
          {/* Grid */}
          {[0, 50, 100, 150, 200].map((y) => (
            <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          ))}
          {[0, 80, 160, 240, 320, 400].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="200" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          ))}

          {/* Continent outlines (simplified) */}
          {/* Americas */}
          <path
            d="M40 30 L55 28 L60 35 L65 50 L70 70 L65 90 L60 110 L55 130 L50 150 L45 160 L40 155 L35 140 L30 120 L32 95 L35 70 L38 50Z"
            fill="rgba(255,255,255,0.04)"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.5"
          />
          {/* Europe/Africa */}
          <path
            d="M165 25 L185 22 L195 30 L200 50 L198 70 L195 90 L185 120 L175 145 L165 160 L155 155 L150 135 L148 110 L150 85 L155 60 L160 40Z"
            fill="rgba(255,255,255,0.04)"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.5"
          />
          {/* Asia */}
          <path
            d="M200 25 L240 22 L280 28 L295 40 L300 55 L290 70 L280 80 L260 85 L240 82 L220 78 L205 70 L198 55 L200 40Z"
            fill="rgba(255,255,255,0.04)"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.5"
          />

          {/* Route line */}
          {points.length > 1 && (
            <polyline
              points={points
                .map(({ coordinates }) => {
                  const pos = toSVG(coordinates.lat, coordinates.lng);
                  return `${pos.x},${pos.y}`;
                })
                .join(' ')}
              fill="none"
              stroke="#C8A96E"
              strokeWidth="0.8"
              strokeDasharray="4,3"
              opacity="0.6"
            />
          )}

          {/* Points */}
          {points.map((point, i) => {
            const pos = toSVG(point.coordinates.lat, point.coordinates.lng);
            return (
              <g key={i}>
                <circle cx={pos.x} cy={pos.y} r="4" fill="rgba(200,169,110,0.15)" />
                <circle cx={pos.x} cy={pos.y} r="2" fill="#C8A96E" />
                <text
                  x={pos.x + 6}
                  y={pos.y + 4}
                  fill="rgba(240,232,216,0.7)"
                  fontSize="6"
                  fontFamily="'Barlow', sans-serif"
                  fontWeight="300"
                >
                  {point.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Points list */}
      {points.length > 0 && (
        <div className="flex flex-col gap-3">
          {points.map((point, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-4 h-4 mt-0.5 flex items-center justify-center flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-or" />
              </div>
              <div>
                <div className="text-xs font-medium text-creme/80">{point.name}</div>
                {point.description && (
                  <div className="text-[11px] text-creme/40 mt-0.5">{point.description}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
