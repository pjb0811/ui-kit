import { SwiperSlide, type SwiperSlideProps } from 'swiper/react';

import { cn } from '@repo/ui/utils';

const Slide = ({ children, className, ...props }: SwiperSlideProps) => {
  return (
    <SwiperSlide className={cn(className)} {...props}>
      {children}
    </SwiperSlide>
  );
};

Slide.displayName = 'SwiperSlide';

export default Slide;
