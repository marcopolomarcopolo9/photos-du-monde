// @ts-nocheck
'use client';
import { useEffect } from 'react';

/**
 * Au rechargement de la page, le navigateur restaure la position de scroll
 * précédente (ex: sur le globe). Ce composant force le retour en haut de page,
 * uniquement pour les rechargements — la navigation Précédent/Suivant garde
 * son comportement normal.
 */
export default function ScrollTopOnReload() {
  useEffect(() => {
    const nav = performance.getEntriesByType?.('navigation')?.[0];
    if (nav?.type === 'reload') {
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
      // Certains navigateurs restaurent après coup : on re-force brièvement
      const t = setTimeout(() => window.scrollTo(0, 0), 50);
      return () => clearTimeout(t);
    }
  }, []);

  return null;
}
