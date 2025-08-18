import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
  threshold = 0.1,
  direction = 'up'
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  const controls = useAnimation();

  // Set initial and animate values based on direction
  const getDirectionVariants = () => {
    switch (direction) {
      case 'up':
        return {
          hidden: { y: 50, opacity: 0 },
          visible: { y: 0, opacity: 1 }
        };
      case 'down':
        return {
          hidden: { y: -50, opacity: 0 },
          visible: { y: 0, opacity: 1 }
        };
      case 'left':
        return {
          hidden: { x: 50, opacity: 0 },
          visible: { x: 0, opacity: 1 }
        };
      case 'right':
        return {
          hidden: { x: -50, opacity: 0 },
          visible: { x: 0, opacity: 1 }
        };
      case 'none':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        };
      default:
        return {
          hidden: { y: 50, opacity: 0 },
          visible: { y: 0, opacity: 1 }
        };
    }
  };

  const variants = getDirectionVariants();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;