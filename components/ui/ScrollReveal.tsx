'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface Props {
    children?: React.ReactNode;
    delay?: number;
    className?: string;
    direction?: 'up' | 'left' | 'right' | 'none';
}

export default function ScrollReveal({
    children,
    delay = 0,
    className,
    direction = 'up',
}: Props) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

  const initial =
        direction === 'up'
        ? { opacity: 0, y: 32 }
          : direction === 'left'
        ? { opacity: 0, x: -32 }
          : direction === 'right'
        ? { opacity: 0, x: 32 }
          : { opacity: 0 };

  return (
        <motion.div
                ref={ref}
                initial={initial}
                animate={inView ? { opacity: 1, x: 0, y: 0 } : initial}
                transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
                className={className}
              >
          {children}
        </motion.div>motion.div>
      );
}</motion.div>
