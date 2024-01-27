import {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {Link} from '~/components/Link';
import {isMobileDevice} from '~/lib/utils';
import {ChevronDownIcon} from '@heroicons/react/24/solid';
import {ScrollArea} from '@radix-ui/react-scroll-area';
import {AnimatePresence, motion} from 'framer-motion';
import clsx from 'clsx';

export function SubNavigation({
  title,
  navigationInfos,
  shopProductId,
  urlHandle,
  className,
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  function closeAside(event) {
    event.preventDefault();
    window.location.href = event.currentTarget.href;
  }

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
                to={handle}
                onClick={closeAside}
                prefetch="intent"
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
              {actions?.map(({id, title, url, type}) =>
                type === 'buy' ? (
                  <Button size="sm" key={id} asChild>
                    <Link to={url}>{title}</Link>
                  </Button>
                ) : (
                  <Button
                    key={id}
                    size="sm"
                    asChild
                    variant="outline"
                    className="text-black"
                  >
                    <Link to={url}>{title}</Link>
                  </Button>
                ),
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
                {navs?.map(({id, title, url}) => (
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
                      <Link to={url} onClick={closeAside} prefetch="intent">
                        {title}
                      </Link>
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
              <Link to={urlHandle}>{title}</Link>
            </h2>
          </div>

          <div className="order-2 ml-auto text-sm font-medium md:order-2">
            <ul className="flex text-sm font-medium w-max gap-x-8">
              {navigationInfos?.map(({id, title, url}) => (
                <li key={id} className="flex-shrink-0">
                  <Link
                    to={url}
                    className="block py-3 rounded-lg hover:text-gray-300"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center order-2 gap-4 lg:order-3">
            {shopProductId ? (
              <Button size="sm" asChild>
                <Link to={`/${shopProductId}`}>购买</Link>
              </Button>
            ) : (
              <Button
                size="sm"
                asChild
                variant="outline"
                className="text-black"
              >
                订阅
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
