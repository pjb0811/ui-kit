import Slide from './slide';
import SwiperImpl, { initialOptions } from './swiper';

type SwiperComponent = typeof SwiperImpl & { Slide: typeof Slide };

const Swiper = SwiperImpl as SwiperComponent;

Swiper.Slide = Slide;

export default Swiper;
export { initialOptions };
