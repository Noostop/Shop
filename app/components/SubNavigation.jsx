import clsx from 'clsx';
import {useI18n} from 'remix-i18n';
import {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {Link} from '~/components/Link';
import {isMobileDevice} from '~/lib/utils';
import {ChevronDownIcon} from '@heroicons/react/24/solid';
import {AnimatePresence, motion} from 'framer-motion';

export function SubNavigation({
  title,
  navigationInfos,
  shopProductId,
  urlHandle,
  className,
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const {t} = useI18n();

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  // function closeAside(event) {
  //   event.preventDefault();
  //   window.location.href = event.currentTarget.href;
  // }

  if (isMobile) {
    return (
      <motion.nav
        layout
        className="sticky top-0 z-20 w-full h-16 text-white bg-black/80 backdrop-blur"
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 gap-2">
            <h2 className="flex items-center justify-between w-full gap-2">
              <Link
                to={`/${urlHandle}`}
                // onClick={closeAside}
                className="text-base font-semibold leading-4 line-clamp-2"
              >
                {title}
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className={clsx('hover:bg-transparent hover:text-transparent')}
                onClick={() => setShowMenu(!showMenu)}
              >
                <span className="sr-only">Open {title}</span>
                <ChevronDownIcon
                  className={clsx(
                    'w-4 h-4 text-gray-300 transition-transform',
                    showMenu && 'rotate-90',
                  )}
                />
              </Button>
            </h2>

            <div className="flex items-center justify-end gap-x-2">
              {shopProductId ? (
                <Button size="sm" asChild>
                  <Link to={`/products/${urlHandle}`}>
                    {t('products.product.add_to_cart')}
                  </Link>
                </Button>
              ) : (
                <Button size="sm" variant="outline" className="text-black">
                  {t('newsletter.button_label')}
                </Button>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showMenu && (
            <motion.div
              className="w-full text-white bg-black"
              initial={{opacity: 0, height: 0}}
              animate={{opacity: 1, height: 'auto'}}
              exit={{opacity: 0, height: 0}}
              transition={{
                duration: 0.2,
                ease: 'easeInOut',
                staggerChildren: 0.1,
              }}
            >
              <div className="container py-2">
                {navigationInfos?.map(({id, title, url}) => (
                  <motion.div
                    key={id}
                    className="space-y-2"
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{
                      duration: 0.2,
                      // delay: 0.2,
                    }}
                  >
                    <Button
                      asChild
                      variant="ghost"
                      className="pl-0 hover:bg-transparent hover:text-gray-100"
                    >
                      <Link to={url}>{title}</Link>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    );
  }

  return (
    <nav className="sticky top-0 z-20 w-full text-white bg-black/80 backdrop-blur">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between lg:flex-nowrap gap-x-8">
          <div className="flex items-center flex-shrink-0 h-14">
            <h2 className="text-lg font-semibold">
              <Link to={`/${urlHandle}`}>{title}</Link>
            </h2>
          </div>

          <div className="order-2 ml-auto text-sm font-medium md:order-2">
            <ul className="flex text-sm font-medium w-max gap-x-8">
              {navigationInfos?.map(
                ({title, url, enable}) =>
                  enable && (
                    <li key={url} className="flex-shrink-0">
                      <Link
                        to={url}
                        className="block py-3 rounded-lg hover:text-gray-300"
                      >
                        {title}
                      </Link>
                    </li>
                  ),
              )}
            </ul>
          </div>

          <div className="flex items-center order-2 gap-4 lg:order-3">
            {shopProductId ? (
              <Button size="sm" asChild>
                <Link to={`/products/${urlHandle}`}>
                  {t('products.product.add_to_cart')}
                </Link>
              </Button>
            ) : (
              <Button size="sm">{t('newsletter.button_label')}</Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
