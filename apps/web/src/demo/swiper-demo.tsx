import { Swiper } from '@repo/ui';

const slides = [
  { title: 'Slide 1', tone: 'bg-blue-500' },
  { title: 'Slide 2', tone: 'bg-green-500' },
  { title: 'Slide 3', tone: 'bg-purple-500' },
  { title: 'Slide 4', tone: 'bg-rose-500' },
  { title: 'Slide 5', tone: 'bg-amber-500' },
];

export default function SwiperDemo() {
  return (
    <Swiper
      data={slides}
      options={{ slidesPerView: 'auto', spaceBetween: 12 }}
      renderItem={item => (
        <Swiper.Slide style={{ width: '160px' }}>
          <div
            className={`flex h-32 w-40 items-center justify-center rounded-lg
            font-bold text-white ${item.tone}`}
          >
            {item.title}
          </div>
        </Swiper.Slide>
      )}
    />
  );
}
