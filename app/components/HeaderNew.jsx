import {Suspense, useState, forwardRef, useRef} from 'react';
import {Await, NavLink, Link} from '@remix-run/react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';
import clsx from 'clsx';
import {cn} from '@/lib/utils';
import {useRootLoaderData} from '~/root';

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

const components = [
  {
    title: 'Alert Dialog',
    href: '/docs/primitives/alert-dialog',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Hover Card',
    href: '/docs/primitives/hover-card',
    description:
      'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Progress',
    href: '/docs/primitives/progress',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  },
  {
    title: 'Scroll-area',
    href: '/docs/primitives/scroll-area',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'Tabs',
    href: '/docs/primitives/tabs',
    description:
      'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  },
  {
    title: 'Tooltip',
    href: '/docs/primitives/tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  },
];

export function Header({header, isLoggedIn, cart}) {
  const {shop, menu} = header;
  const scrollYProgress = useRef(0);
  const [showMenu, setShowMenu] = useState(false);

  const {scrollY} = useScroll();

  console.log(menu);

  // useMotionValueEvent(scrollY, 'change', (latest) => {
  //   if (latest > 200) {
  //     setShowMenu(true);
  //     scrollYProgress.current = latest;
  //   } else {
  //     setShowMenu(false);
  //   }
  //   console.log('Page scroll: ', latest, scrollYProgress.current);
  // });

  return (
    <motion.header
      className="sticky top-0 z-40 bg-white"
      initial={{opacity: 0}}
      whileInView={{opacity: 1}}
      viewport={{once: true}}
      // animate={{background: showMenu ? '#fff' : 'transparent'}}
      transition={{duration: 0.3, ease: 'easeInOut'}}
    >
      <div className="container flex items-center gap-2 h-14">
        <HeaderMenuMobileToggle className="md:hidden" />

        <NavLink prefetch="intent" to="/" end>
          <strong>{shop.name}</strong>
        </NavLink>

        <NavigationMen
          shop={shop}
          menu={menu}
          isLoggedIn={isLoggedIn}
          cart={cart}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
        />

        <div className="flex items-center ml-auto">
          <User isLoggedIn={isLoggedIn} />

          <Search />

          <Suspense fallback={<CartBadge count={0} />}>
            <Await resolve={cart}>
              {(cart) => {
                if (!cart) return <CartBadge count={0} />;
                return (
                  <CartBadge count={cart.totalQuantity || 0} cart={cart} />
                );
              }}
            </Await>
          </Suspense>
        </div>
      </div>
    </motion.header>
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
    <NavigationMenu className="hidden py-2 ml-6 lg:flex max-w-none">
      <NavigationMenuList className="space-x-2">
        {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
          if (!item.url) return null;

          // if the url is internal, we strip the domain
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          return (
            <NavigationMenuItem key={item.id}>
              <NavigationMenuTrigger className="relative bg-transparent hover:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
                <NavLink
                  className="text-sm font-semibold leading-6 text-gray-900"
                  key={item.id}
                  onClick={closeAside}
                  // prefetch="intent"
                  // style={activeLinkStyle}
                  to={url}
                  end
                >
                  {item.title}
                </NavLink>
              </NavigationMenuTrigger>

              <NavigationMenuContent className="w-full">
                <div className="w-full p-4 bg-white">
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex flex-col justify-end w-full h-full p-6 no-underline rounded-md outline-none select-none bg-gradient-to-b from-muted/50 to-muted focus:shadow-md"
                          href="/"
                        >
                          {/* <Icons.logo className="w-6 h-6" /> */}
                          <div className="mt-4 mb-2 text-lg font-medium">
                            shadcn/ui
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Beautifully designed components that you can copy
                            and paste into your apps. Accessible. Customizable.
                            Open Source.
                          </p>
                        </a>
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
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>

      {/* <div className="absolute w-full bg-red-500 top-full">
        <NavigationMenuViewport />
      </div> */}
    </NavigationMenu>
  );
}

function HeaderMenuMobileToggle({className}) {
  return (
    <button
      type="button"
      className={clsx(
        'inline-flex items-center justify-center p-1 text-gray-400 rounded-md',
        className,
      )}
      // onClick={() => setOpen(false)}
    >
      <span className="sr-only">Open menu</span>
      <Bars3Icon className="w-6 h-6" aria-hidden="true" />
    </button>
  );
}

/**
 * @param {{count: number}}
 */
function CartBadge({count, cart}) {
  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger asChild>
        <div className="relative flow-root ml-4 lg:ml-6">
          <a href="/cart" className="flex items-center p-2 -m-2 group">
            <ShoppingBagIcon
              className="flex-shrink-0 w-6 h-6"
              aria-hidden="true"
            />
            <span className="absolute inline-flex items-center p-1 text-xs font-medium text-gray-600 rounded-full -top-2 -right-4 bg-gray-50 ring-1 ring-inset ring-gray-500/10">
              {count}
            </span>
            <span className="sr-only">items in cart, view bag</span>
          </a>
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
        <a href="/account" className="flex items-center p-2 -m-2 group">
          <UserCircleIcon
            className="flex-shrink-0 w-6 h-6"
            aria-hidden="true"
          />
        </a>
      </div>
    );
  }

  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger asChild>
        <div className="relative flow-root ml-4 lg:ml-6">
          <a href="/account" className="flex items-center p-2 -m-2 group">
            <UserCircleIcon
              className="flex-shrink-0 w-6 h-6"
              aria-hidden="true"
            />
          </a>
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
