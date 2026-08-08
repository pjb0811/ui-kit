'use client';

import { cloneElement, isValidElement } from 'react';

import { Swiper as SwiperCore, SwiperProps } from 'swiper/react';
import { SwiperModule, SwiperOptions } from 'swiper/types';

import { cn } from '@repo/ui/utils';

import 'swiper/css';

import { Spin } from '../../atoms';

/**
 * Baseline Swiper options. `navigation` / `autoplay` are inert unless the
 * matching modules are passed through the `modules` prop — see the README next
 * to this file.
 */
export const initialOptions: SwiperOptions = {
  loop: false,
  spaceBetween: 8,
  slidesPerView: 'auto',
  navigation: false,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
};

const initialStyle = { width: '100%', maxWidth: '100vw', overflow: 'hidden' };

interface Props<T> extends SwiperProps {
  loading?: boolean;
  loader?: React.ReactNode;
  loadingClassName?: string;
  options?: SwiperOptions;
  /**
   * Swiper feature modules to activate. Nothing is bundled by default — import
   * the modules you need from `swiper/modules` together with their stylesheets
   * (`swiper/css/<module>`) and pass them here.
   *
   * @example
   * import { Autoplay, Navigation } from 'swiper/modules';
   * import 'swiper/css/autoplay';
   * import 'swiper/css/navigation';
   *
   * <Swiper modules={[Autoplay, Navigation]} ... />
   *
   * @default []
   */
  modules?: SwiperModule[];
  data: T[];
  renderItem(item: T, key: number): React.ReactNode;
}

const Swiper = <T,>({
  loading,
  loader,
  options = {},
  modules = [],
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
      modules={modules}
      {...initialOptions}
      {...options}
      style={{ ...initialStyle, ...style }}
      {...props}
    >
      {data.map((item: T, i) => {
        const node = renderItem(item, i);
        // Fall back to an index key only when the consumer's renderItem
        // didn't already set one — cloning (rather than wrapping in a
        // Fragment) keeps the returned element a direct child of
        // SwiperCore, which swiper/react's slide detection relies on.
        return isValidElement(node) && node.key == null
          ? cloneElement(node, { key: i })
          : node;
      })}
    </SwiperCore>
  );
};

export default Swiper;
