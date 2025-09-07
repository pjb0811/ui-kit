'use client';

import { CSSProperties, Fragment, ReactNode } from 'react';

import { Autoplay, EffectCards, Navigation, Scrollbar } from 'swiper/modules';
import { Swiper as SwiperCore, SwiperProps } from 'swiper/react';
import { SwiperOptions } from 'swiper/types';

import { cn } from '@repo/ui/utils';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-cards';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

import { Spin } from '../../atoms';
import Slide from './Slide';

export const initialOptions: SwiperOptions = {
  loop: false,
  spaceBetween: '8',
  slidesPerView: 'auto',
  navigation: false,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
};

const initialStyle = { overflow: 'hidden', width: '100%', maxWidth: 480 };

interface Props<T> extends SwiperProps {
  loading?: boolean;
  loader?: ReactNode;
  loadingClassName?: string;
  options?: SwiperOptions;
  data: T[];
  style?: CSSProperties;
  renderItem(item: T, key: number): ReactNode;
}

const Swiper = <T,>({
  loading,
  loader,
  options = {},
  data = [],
  style,
  renderItem,
  loadingClassName,
  ...props
}: Props<T>) => {
  if (loading) {
    return (
      <div className={cn('h-32', loadingClassName)}>
        {loader || <Spin spinning />}
      </div>
    );
  }

  return (
    <SwiperCore
      modules={[Navigation, Scrollbar, Autoplay, EffectCards]}
      {...initialOptions}
      {...options}
      style={{ ...initialStyle, ...style }}
      {...props}
    >
      {data.map((item: T, i) => (
        <Fragment key={i}>{renderItem(item, i)}</Fragment>
      ))}
    </SwiperCore>
  );
};

Swiper.Slide = Slide;

export default Swiper;
