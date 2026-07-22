'use client';

import { type MotionProps, motion } from 'motion/react';

import { cn } from '@repo/ui/utils';

const effectVariants = {
  fadeIn: {
    offscreen: { opacity: 0 },
    onscreen: { opacity: 1 },
  },
  fadeInUp: {
    offscreen: { opacity: 0, y: 50 },
    onscreen: { opacity: 1, y: 0 },
  },
  slideInUp: {
    offscreen: { opacity: 1, y: 50 },
    onscreen: { opacity: 1, y: 0 },
  },
};

export interface ItemProps {
  effect?: keyof typeof effectVariants;
  delay?: number;
  once?: boolean;
  duration?: number;
  className?: string;
  children?: React.ReactNode;
  viewport?: MotionProps['viewport'];
  variants?: MotionProps['variants'];
  transition?: MotionProps['transition'];
}

const Item = ({
  effect = 'fadeInUp',
  children,
  once,
  viewport,
  variants,
  duration,
  delay,
  transition,
  className,
  ...props
}: ItemProps) => {
  return (
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once, ...viewport }}
      variants={{
        offscreen: {
          ...effectVariants[effect].offscreen,
          ...variants?.offscreen,
          transition: {
            duration: 0,
          },
        },
        onscreen: {
          ...effectVariants[effect].onscreen,
          ...variants?.onscreen,
          transition: {
            duration,
            ease: 'easeOut',
            delay,
            ...transition,
          },
        },
      }}
      className={cn(
        'flex h-full items-center justify-center',
        className,
        //
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Item;
