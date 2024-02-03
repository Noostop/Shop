import {Suspense, useState, forwardRef, useEffect, useRef} from 'react';
import {Await} from '@remix-run/react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';
import clsx from 'clsx';
import {cn} from '@/lib/utils';
import {useRootLoaderData} from '~/root';
import {Link} from '~/components/Link';
import {Logo} from '~/components/Logo';
import {MobileMenuAside} from '~/components/MobileMenuAside';

import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
  ShoppingBagIcon,
  UserIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
// import {Icons} from '@/components/icons';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

import {ScrollArea} from '@/components/ui/scroll-area';
import {CartMain} from '~/components/Cart';
import {SubNavigation} from '~/components/SubNavigation';
import {CountrySelector} from '~/components/CountrySelector';
import {isMobileDevice} from '~/lib/utils';

export function Header({
  pages,
  shop,
  headerMenu,
  haveSubNav,
  isLoggedIn,
  cart,
}) {
  const scrollYProgress = useRef(0);
  const [showMenu, setShowMenu] = useState(false);
  const {scrollY} = useScroll();
  const [isShowMobileMenu, setIsShowMobileMenu] = useState(false);
  // console.log(menu);

  // useMotionValueEvent(scrollY, 'change', (latest) => {
  //   if (latest > 200) {
  //     setShowMenu(true);
  //     scrollYProgress.current = latest;
  //   } else {
  //     setShowMenu(false);
  //   }
  //   console.log('Page scroll: ', latest, scrollYProgress.current);
  // });

  const handleCloseMobileMenu = () => {
    isShowMobileMenu
      ? document.body.classList.remove('overflow-hidden')
      : document.body.classList.add('overflow-hidden');
    setIsShowMobileMenu(!isShowMobileMenu);
  };

  return (
    <>
      <motion.header
        className={clsx(
          'bg-white h-14',
          haveSubNav
            ? 'relative'
            : 'sticky top-0 z-30 border-b border-gray-200',
        )}
        // initial={{opacity: 0}}
        // whileInView={{opacity: 1}}
        // viewport={{once: true}}
        // animate={{background: showMenu ? '#fff' : 'transparent'}}
        // transition={{duration: 0.3, ease: 'easeInOut'}}
      >
        <NavigationMenu className="z-30 w-full h-full max-w-none">
          <div className="container flex items-center h-full gap-2">
            {/* <HeaderMenuMobileToggle
              className="md:hidden"
              onClick={handleCloseMobileMenu}
            /> */}
            <MobileMenuAside menu={headerMenu} />

            <Link to="/">
              <Logo className="w-auto h-6" />
              <span className="sr-only">{shop.name}</span>
            </Link>

            <NavigationMen
              shop={shop}
              menu={headerMenu}
              isLoggedIn={isLoggedIn}
              cart={cart}
              viewport="desktop"
              primaryDomainUrl={shop.primaryDomain.url}
            />

            <div className="flex items-center ml-auto">
              <div className="hidden md:block">
                <CountrySelector />
              </div>

              <User isLoggedIn={isLoggedIn} />

              <Search />

              {/* TODO: 服务器数据和客户端数据不一致 */}
              {/* <Suspense fallback={<div>loadding</div>}>
                <Await resolve={cart}>
                  {(cart) => {
                    if (!cart) return <div>loadding</div>;
                    return (
                      <CartBadge count={cart.totalQuantity || 0} cart={cart} />
                    );
                  }}
                </Await>
              </Suspense> */}
            </div>
          </div>
        </NavigationMenu>
      </motion.header>
    </>
  );
}

const ListItem = forwardRef(({className, title, children, ...props}, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-sm leading-snug line-clamp-2 text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

function NavigationMen({
  shop,
  menu,
  primaryDomainUrl,
  viewport,
  isLoggedIn,
  cart,
}) {
  const {publicStoreDomain} = useRootLoaderData();

  function closeAside(event) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  return (
    <NavigationMenuList className="hidden xl:flex">
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // 如果 url 是内部的，我们会删除域名
        // const url =
        //   item.url.includes('myshopify.com') ||
        //   item.url.includes(publicStoreDomain) ||
        //   item.url.includes(primaryDomainUrl)
        //     ? new URL(item.url).pathname
        //     : item.url;
        return (
          <NavigationMenuItem key={item.id}>
            <NavigationMenuTrigger
              className="relative bg-transparent hover:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent"
              as="div"
            >
              <Link
                className="text-sm font-semibold leading-6 text-gray-900"
                key={item.id}
                onClick={closeAside}
                // prefetch="intent"
                // style={activeLinkStyle}
                reloadDocument
                to={item.to}
              >
                {item.title}
              </Link>
            </NavigationMenuTrigger>

            <NavigationMenuContent>
              <div className="w-screen">
                <div className="container">
                  <div className="w-full bg-white">
                    <ul className="grid gap-3 py-6 w-full lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex flex-col justify-end w-full h-full p-6 no-underline rounded-md outline-none select-none bg-gradient-to-b from-muted/50 to-muted focus:shadow-md"
                            to={item.to}
                          >
                            {/* <Icons.logo className="w-6 h-6" /> */}
                            <div className="mt-4 mb-2 text-lg font-medium">
                              {item.title}
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Beautifully designed components that you can copy
                              and paste into your apps. Accessible.
                              Customizable. Open Source.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex flex-col justify-end w-full h-full p-6 no-underline rounded-md outline-none select-none bg-gradient-to-b from-muted/50 to-muted focus:shadow-md"
                            to={item.to}
                          >
                            {/* <Icons.logo className="w-6 h-6" /> */}
                            <div>
                              <Logo className="w-auto h-6" />
                            </div>
                            <div className="mt-4 mb-2 text-lg font-medium">
                              {item.title}
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Beautifully designed components that you can copy
                              and paste into your apps. Accessible.
                              Customizable. Open Source.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/docs" title="Introduction">
                        Re-usable components built using Radix UI and Tailwind
                        CSS.
                      </ListItem>
                      <ListItem href="/docs/installation" title="Installation">
                        How to install dependencies and structure your app.
                      </ListItem>
                      <ListItem
                        href="/docs/primitives/typography"
                        title="Typography"
                      >
                        Styles for headings, paragraphs, lists...etc
                      </ListItem>
                    </ul>
                  </div>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        );
      })}
    </NavigationMenuList>
  );
}

function HeaderMenuMobileToggle({className, ...props}) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center p-1 text-gray-400 rounded-md',
        className,
      )}
      {...props}
    >
      <span className="sr-only">Open menu</span>
      <Bars3Icon className="w-6 h-6" aria-hidden="true" />
    </button>
  );
}

// 移动端菜单
// function MobileMenuAside({menu, isOpen = false, onClose, ...props}) {
//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.aside
//           className="fixed inset-0 z-50 w-full h-full bg-white pb-14"
//           initial={{opacity: 0, left: '-100%'}}
//           animate={{opacity: 1, left: 0}}
//           exit={{opacity: 0, left: '-100%'}}
//           transition={{
//             duration: 0.2,
//             ease: 'easeInOut',
//             staggerChildren: 0.1,
//           }}
//         >
//           <div className="container sticky top-0 z-10 flex items-center justify-between bg-white border-b border-gray-200 h-14">
//             <button
//               className={clsx(
//                 'inline-flex items-center justify-center p-1 text-gray-400 rounded-md',
//               )}
//               onClick={onClose}
//             >
//               <span className="sr-only">Close menu</span>
//               <XMarkIcon className="w-6 h-6" aria-hidden="true" />
//             </button>

//             <CountrySelector />
//           </div>

//           <ScrollArea className="h-full">
//             <Accordion type="multiple">
//               {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
//                 if (!item.url) return null;

//                 // 如果 url 是内部的，我们会删除域名
//                 // const url =
//                 //   item.url.includes('myshopify.com') ||
//                 //   item.url.includes(publicStoreDomain) ||
//                 //   item.url.includes(primaryDomainUrl)
//                 //     ? new URL(item.url).pathname
//                 //     : item.url;
//                 return (
//                   <AccordionItem key={item.id} value={item.id}>
//                     <AccordionTrigger className="container hover:no-underline hover:text-parimary">
//                       {item.title}
//                     </AccordionTrigger>

//                     <AccordionContent>
//                       <div className="container">
//                         <ul className="grid gap-3 py-6 px-4 bg-gray-100 rounded-lg w-full lg:grid-cols-[.75fr_1fr]">
//                           <li className="row-span-3">
//                             <div>
//                               <Link
//                                 className="text-sm font-semibold leading-6 text-primary"
//                                 key={item.id}
//                                 // prefetch="intent"
//                                 // style={activeLinkStyle}
//                                 reloadDocument
//                                 to={item.to}
//                               >
//                                 {item.title}
//                               </Link>
//                             </div>
//                           </li>
//                           <li>
//                             Re-usable components built using Radix UI and
//                             Tailwind CSS.
//                           </li>
//                           <li>
//                             How to install dependencies and structure your app.
//                           </li>
//                           <li>Styles for headings, paragraphs, lists...etc</li>
//                         </ul>
//                       </div>
//                     </AccordionContent>
//                   </AccordionItem>
//                 );
//               })}
//             </Accordion>
//           </ScrollArea>
//         </motion.aside>
//       )}
//     </AnimatePresence>
//   );
// }

/**
 * @param {{count: number}}
 */
function CartBadge({count, cart, ...props}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  if (isMobile) {
    return (
      <div className="flow-root ml-4 lg:ml-6">
        <Link
          to="/cart"
          className="relative flex items-center p-2 -m-2 md:group"
        >
          <ShoppingBagIcon
            className="flex-shrink-0 w-6 h-6"
            aria-hidden="true"
          />
          {count > 0 && (
            <span className="absolute inset-0 flex items-end justify-center pb-3 md:hidden">
              <span className="w-2 h-2 origin-center bg-red-500 rounded-full animate-bounce"></span>
            </span>
          )}
          <span className="sr-only">items in cart, view bag</span>
        </Link>
      </div>
    );
  }
  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger asChild>
        <div className="flow-root ml-4 lg:ml-6">
          <Link
            to="/cart"
            className="relative flex items-center p-2 -m-2 md:group"
          >
            <ShoppingBagIcon
              className="flex-shrink-0 w-6 h-6"
              aria-hidden="true"
            />
            {count > 0 && (
              <>
                <span className="absolute top-0 items-center justify-center hidden w-5 h-5 p-1 font-mono text-xs font-medium text-red-500 rounded-full md:flex -right-1 bg-red-50">
                  {count > 99 ? '99+' : count}
                </span>
                <span className="absolute inset-0 flex items-end justify-center pb-3 md:hidden">
                  <span className="w-2 h-2 origin-center bg-red-500 rounded-full animate-bounce"></span>
                </span>
              </>
            )}
            <span className="sr-only">items in cart, view bag</span>
          </Link>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="p-0" sideOffset={20} align="end">
        <ScrollArea className={clsx('pt-4', count === 0 ? 'h-0' : 'h-96')}>
          <Suspense fallback={<p>Loading cart ...</p>}>
            <Await resolve={cart}>
              {(cart) => {
                return <CartMain layout="aside" cart={cart} />;
              }}
            </Await>
          </Suspense>
        </ScrollArea>
      </HoverCardContent>
    </HoverCard>
  );
}

function User({isLoggedIn}) {
  if (isLoggedIn) {
    return (
      <div className="relative flow-root ml-4 lg:ml-6">
        <Link to="/account" className="flex items-center p-2 -m-2 group">
          <UserCircleIcon
            className="flex-shrink-0 w-6 h-6"
            aria-hidden="true"
          />
        </Link>
      </div>
    );
  }

  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger asChild>
        <div className="relative flow-root ml-4 lg:ml-6">
          <Link to="/account" className="flex items-center p-2 -m-2 group">
            <UserCircleIcon
              className="flex-shrink-0 w-6 h-6"
              aria-hidden="true"
            />
          </Link>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="p-1" sideOffset={20} align="end">
        <ScrollArea>
          <ul className="overflow-hidden text-sm">
            <li className="w-full p-2 transition-all rounded hover:bg-gray-200">
              <Link className="block w-full" to="/account/login">
                登录
              </Link>
            </li>
            <li className="w-full p-2 transition-all rounded hover:bg-gray-200">
              <Link className="block w-full" to="/account/register">
                注册
              </Link>
            </li>
          </ul>
        </ScrollArea>
      </HoverCardContent>
    </HoverCard>
  );
}

function Search() {
  return (
    <div className="relative flow-root ml-4 lg:ml-6">
      <a href="/search" className="flex items-center p-2 -m-2 group">
        <MagnifyingGlassIcon
          className="flex-shrink-0 w-6 h-6"
          aria-hidden="true"
        />
      </a>
    </div>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};
