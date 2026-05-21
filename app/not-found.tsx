import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-noir flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        {/* Big 404 */}
        <div className="font-serif font-light text-[120px] md:text-[180px] leading-none text-white/5 select-none mb-0">
          404
        </div>

        {/* Gold line */}
        <div className="flex items-center justify-center gap-4 mb-8 -mt-4">
          <div className="h-px bg-or/40 w-12" />
          <div className="w-1.5 h-1.5 rounded-full bg-or" />
          <div className="h-px bg-or/40 w-12" />
        </div>

        <h1 className="font-serif italic text-3xl text-creme font-light mb-4">
          Page introuvable
        </h1>
        <p className="text-creme/40 text-sm leading-relaxed mb-10 font-poppins">
          Cette page n&apos;existe pas ou a été déplacée.<br />
          Revenez explorer les destinations.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-or text-noir text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-or/90 transition-colors font-poppins">
            Retour à l&apos;accueil
          </Link>
          <Link href="/voyages"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white/15 text-creme/60 hover:text-creme hover:border-white/30 text-[11px] tracking-[0.2em] uppercase transition-colors font-poppins">
            Voir les voyages
          </Link>
        </div>
      </div>
    </div>
  );
}
