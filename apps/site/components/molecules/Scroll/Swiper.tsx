'use client';

import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

import clsx from 'clsx';
import useEmblaCarousel from 'embla-carousel-react';

import { useEffect, useState } from 'react';
import type { EmblaOptionsType } from 'embla-carousel-react';

export type SwiperProps = {
  slides: React.ReactNode[];
  className?: string;
  options?: EmblaOptionsType;
};

export default function Swiper({ slides, className, options }: SwiperProps) {
  const [emblaRef, embla] = useEmblaCarousel({
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps',
    ...options,
  });

  const [showPrevious, setShowPrevious] = useState(false);
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    if (embla) {
      setShowPrevious(embla.canScrollPrev());
      setShowNext(embla.canScrollNext());
    }
  }, [embla]);

  if (embla)
    embla.on('scroll', () => {
      const { limit, target, location, scrollTo } = embla.internalEngine();

      const currentLocation = location.get();
      const currentTarget = target.get();

      if (limit.reachedMax(currentTarget)) {
        if (limit.reachedMax(currentLocation)) location.set(limit.max);
        target.set(limit.max);
        scrollTo.distance(0, false);
      }
      if (limit.reachedMin(target.get())) {
        if (limit.reachedMin(currentLocation)) location.set(limit.min);
        target.set(limit.min);
        scrollTo.distance(0, false);
      }

      console.log('Current Location:', currentLocation, limit.reachedMin(currentLocation));

      setShowPrevious(embla.canScrollPrev());
      setShowNext(embla.canScrollNext());
    });

  return (
    <div className={clsx('h-fit w-full flex items-center', className)}>
      {showPrevious && (
        <IconChevronLeft
          className="h-10 w-10 text-1 p-2 rounded-full bg-1-hover cursor-pointer"
          onClick={() => embla?.scrollPrev()}
        />
      )}
      <div className="w-full overflow-hidden text-0" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {slides.map((slide, idx) => (
            <div className={clsx('min-w-0 shrink-0', idx !== slides.length - 1 && 'pr-5')} key={idx}>
              {slide}
            </div>
          ))}
        </div>
      </div>
      {showNext && (
        <IconChevronRight
          className="h-10 w-10 text-1 p-2 rounded-full bg-1-hover cursor-pointer"
          onClick={() => embla?.scrollNext()}
        />
      )}
    </div>
  );
}
