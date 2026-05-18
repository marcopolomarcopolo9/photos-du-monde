import type { Anecdote } from '@/lib/types';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface Props {
  anecdote: Anecdote;
  index: number;
}

export default function AnecdoteCard({ anecdote, index }: Props) {
  return (
    <ScrollReveal delay={index * 0.1}>
      <div className="border-l-2 border-or/30 pl-6 py-2 hover:border-or transition-colors duration-300 group">
        <div className="text-[10px] tracking-[0.25em] uppercase text-or mb-2">
          {anecdote.location ?? `Anecdote ${index + 1}`}
        </div>
        <h4 className="font-serif italic text-xl text-creme mb-3 group-hover:text-or transition-colors duration-300">
          {anecdote.title}
        </h4>
        <p className="text-sm text-creme/55 leading-relaxed">{anecdote.content}</p>
      </div>
    </ScrollReveal>
  );
}
