import { STATS } from '@/lib/data';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function StatsSection() {
  return (
    <section className="bg-noir-soft border-y border-white/5 py-16 md:py-20">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
          {STATS.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.08}>
              <div className="bg-noir-soft flex flex-col items-center justify-center py-10 px-6 text-center group hover:bg-noir transition-colors duration-300">
                <div className="font-serif text-4xl md:text-5xl text-or font-light mb-2">
                  {stat.value}
                </div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-creme/40">
                  {stat.label}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
