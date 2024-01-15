import {useState, useEffect, useCallback} from 'react';
import {Image} from '@shopify/hydrogen';
import clsx from 'clsx';
import {motion} from 'framer-motion';
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/24/outline';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import {Link} from '../components/Link';
import {Button} from '@/components/ui/button';
import Autoplay from 'embla-carousel-autoplay';

/**
 * 滚动图片展示
 * @returns 滚动组件
 */
export function SliderShow({autoplay = {}, slides = []}) {
  const contentPosition = {
    topLeft: {
      container: 'text-center md:text-left',
      content: 'pt-20',
    },
    topCenter: {
      container: 'text-center flex justify-center',
      content: 'pt-20',
    },
    topRight: {
      container: 'flex justify-center md:justify-end text-center md:text-right',
      content: 'pt-20',
    },
    centerTop: {
      container: 'flex justify-center text-center items-start',
      content: 'pt-20',
    },
    centerLeft: {
      container:
        'flex justify-center text-center md:text-left md:items-center md:justify-start',
      content: 'pt-20 md:pt-0',
    },
    centerCenter: {
      container: 'flex justify-center text-center md:items-center',
      content: 'pt-20 md:pt-0',
    },
    centerRight: {
      container:
        'flex justify-center md:justify-end text-center md:text-right md:items-center',
      content: 'pt-20 md:pt-0',
    },
    bottomLeft: {
      container:
        'flex justify-center md:justify-start text-center md:text-left md:items-end',
      content: 'pt-20 md:pt-0 pb-20',
    },
    bottomCenter: {
      container: 'flex justify-center text-center md:items-end',
      content: 'pb-20 pt-20 md:pt-0',
    },
    bottomRight: {
      container:
        'flex justify-center md:justify-end text-center md:text-right md:items-end',
      content: 'pb-20 pt-20 md:pt-0',
    },
  };

  const contentStyle = {
    light: 'text-black',
    dark: 'text-white',
  };

  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const autoplayPlugin =
    autoplay &&
    Autoplay({
      delay: 3000,
      stopOnMouseEnter: true,
      stopOnInteraction: false,
      ...autoplay,
    });

  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      plugins={[autoplayPlugin]}
      setApi={setApi}
      className="w-full group/content"
    >
      <CarouselContent className="h-[75vh] md:h-[60vh] lg:h-[66vh] -ml-0">
        {slides.map(
          ({
            id,
            title,
            titleWithImage,
            subtitle,
            description,
            pcImage,
            mobileImage,
            links,
            position = 'centerCenter',
            mode = 'light',
          }) => (
            <CarouselItem key={id} className="relative w-full h-full pl-0">
              <motion.div
                className="h-full bg-gray-300"
                // initial={{opacity: 0, scale: 1.04}}
                // whileInView={{opacity: 1, scale: 1}}
                // exit={{opacity: 0, scale: 0.8}}
              >
                {pcImage && (
                  <Image
                    data={pcImage}
                    sizes="100vw"
                    className="hidden object-cover w-full h-full md:block"
                  />
                )}
                {mobileImage && (
                  <Image
                    data={mobileImage}
                    sizes="100vw"
                    className="object-cover w-full h-full md:hidden"
                  />
                )}
              </motion.div>
              <div className="absolute inset-0 bg-input/5">
                <motion.div
                  className={clsx(
                    'container h-full',
                    contentStyle[mode],
                    contentPosition[position]?.container,
                  )}
                >
                  <motion.div
                    className={clsx(
                      'space-y-4 w-full md:w-3/4 lg:w-1/2',
                      contentPosition[position]?.content,
                    )}
                    initial={{opacity: 0, y: -100, scale: 0.8}}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    viewport={{once: true}}
                  >
                    {subtitle && <p className="text-gray-300">{subtitle}</p>}
                    <motion.h2 className="text-3xl font-semibold md:text-4xl 2xl:text-5xl">
                      {titleWithImage ? (
                        <>
                          <span className="sr-only">{title}</span>
                          <img
                            src={titleWithImage}
                            alt={title}
                            aria-label="title"
                            className="inline-block w-auto h-10"
                          />
                        </>
                      ) : (
                        <span>{title}</span>
                      )}
                    </motion.h2>

                    {description && (
                      <motion.p
                        className={clsx(
                          'text-sm md:text-base',
                          (position != 'centerLeft' || position != 'topLeft') ??
                            'px-6',
                        )}
                      >
                        {description}
                      </motion.p>
                    )}
                    <motion.div className="space-x-2">
                      {links?.map(({id, title, url}) => (
                        <Button
                          key={id}
                          className={clsx(
                            'capitalize bg-input/5 rounded-full',
                            mode == 'dark'
                              ? 'text-white'
                              : 'text-black border-black hover:border-input',
                          )}
                          variant="outline"
                          asChild
                        >
                          <Link to={url}>{title}</Link>
                        </Button>
                      ))}
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </CarouselItem>
          ),
        )}
      </CarouselContent>

      <Button
        className="absolute left-0 h-16 px-2 py-8 text-white transition-colors -translate-y-1/2 bg-transparent rounded-none active::bg-black/50 hover:text-white top-1/2 hover:bg-black/50 rounded-tr-md rounded-br-md"
        size="icon"
        variant="ghost"
        onClick={scrollPrev}
      >
        <>
          <span className="sr-only">Previous slide</span>
          <ChevronLeftIcon className="w-6 h-6" />
        </>
      </Button>

      <Button
        className="absolute right-0 h-16 px-2 py-8 text-white transition-colors -translate-y-1/2 bg-transparent rounded-none active::bg-black/50 hover:text-white top-1/2 hover:bg-black/50 rounded-tl-md rounded-bl-md"
        size="icon"
        variant="ghost"
        onClick={scrollNext}
      >
        <>
          <span className="sr-only">Previous slide</span>
          <ChevronRightIcon className="w-6 h-6" />
        </>
      </Button>

      <div className="absolute w-full bottom-4">
        <div className="container">
          <ul className="inline-flex justify-center w-full gap-x-2">
            {slides.map(({id, title}, index) => (
              <li key={id}>
                <Button
                  size="icon"
                  className={clsx(
                    'h-2 bg-gray-300 rounded-full hover:w-4 hover:bg-primary/80 transition-all',
                    current - 1 == index ? 'w-4 bg-primary' : 'w-2',
                  )}
                  onClick={() => api?.scrollTo(index)}
                >
                  <span className="sr-only">{title}</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Carousel>
  );
}
