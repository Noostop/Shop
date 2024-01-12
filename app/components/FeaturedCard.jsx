import {Image} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import clsx from 'clsx';
import {motion} from 'framer-motion';
import {Button} from '@/components/ui/button';
import {ChevronRightIcon} from '@heroicons/react/24/outline';

export function FeaturedCardContent({items}) {
  return (
    <div className="grid gap-2 md:gap-4 md:grid-cols-2">
      {items?.map(({id, ...props}) => (
        <FeaturedCard key={id} {...props} />
      ))}
    </div>
  );
}

export function FeaturedCard({title, description, image, links, dark}) {
  return (
    <div className="relative overflow-hidden w-full bg-gray-100 md:col-cols-1 aspect-square lg:aspect-[4/3] xl:aspect-video">
      <Image
        data={image}
        sizes="100vw"
        className="object-cover w-full h-full"
      />

      <div className="absolute inset-0 p-4 text-center lg:p-10">
        <motion.div
          className="space-y-2 xl:space-y-4"
          initial={{opacity: 0, y: -100, scale: 0.8}}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          viewport={{once: true}}
        >
          <h3
            className={clsx(
              'text-xl font-extrabold tracking-tight lg:text-2xl 2xl:text-4xl',
              dark ? 'text-black' : 'text-gray-200',
            )}
          >
            {title}
          </h3>
          <p
            className={clsx(
              'text-sm md:text-base',
              dark ? 'text-black/80' : 'text-gray-200',
            )}
          >
            {description}
          </p>
          <div className="space-x-2">
            {links?.map(({id, title, url}) => (
              <Button
                key={id}
                className={clsx(
                  'capitalize space-x-1',
                  dark ? 'text-black' : 'text-white',
                )}
                variant="link"
                asChild
              >
                <Link to={url} className="flex items-center gap-x-1">
                  <span>{title}</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </Link>
              </Button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
