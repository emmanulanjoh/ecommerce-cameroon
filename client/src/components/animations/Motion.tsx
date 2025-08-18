import React from 'react';
import { motion, Variants } from 'framer-motion';

interface MotionProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

// Fade in animation
export const FadeIn: React.FC<MotionProps> = ({ 
  children, 
  delay = 0, 
  duration = 0.5,
  className = '' 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

// Slide in from left animation
export const SlideInLeft: React.FC<MotionProps> = ({ 
  children, 
  delay = 0, 
  duration = 0.5,
  className = '' 
}) => (
  <motion.div
    initial={{ x: -50, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

// Slide in from right animation
export const SlideInRight: React.FC<MotionProps> = ({ 
  children, 
  delay = 0, 
  duration = 0.5,
  className = '' 
}) => (
  <motion.div
    initial={{ x: 50, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

// Scale animation
export const ScaleIn: React.FC<MotionProps> = ({ 
  children, 
  delay = 0, 
  duration = 0.5,
  className = '' 
}) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

// Staggered children animation
interface StaggerProps extends MotionProps {
  staggerChildren?: number;
}

export const StaggerContainer: React.FC<StaggerProps> = ({ 
  children, 
  delay = 0, 
  duration = 0.5,
  staggerChildren = 0.1,
  className = '' 
}) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren: delay
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Child item for stagger container
export const StaggerItem: React.FC<MotionProps> = ({ 
  children, 
  duration = 0.5,
  className = '' 
}) => {
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration } }
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
};