import {CartForm, Image, Money} from '@shopify/hydrogen';
import {Await, NavLink, Link} from '@remix-run/react';
import {Suspense, useState} from 'react';
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
} from '@heroicons/react/24/outline';
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from '@heroicons/react/20/solid';
import {motion, AnimatePresence} from 'framer-motion';
import {useVariantUrl} from '~/lib/utils';
import {CartMain} from '~/components/Cart';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import {Button} from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

import {ScrollArea} from '@/components/ui/scroll-area';
import clsx from 'clsx';

const products = [
  {
    name: 'Analytics',
    description: 'Get a better understanding of your traffic',
    href: '#',
    icon: ChartPieIcon,
    imageSrc:
      'https://checkout.iiixys.cc/cdn/shop/products/AC200MAX12V_30ARVCABLE.jpg?v=1679969486&width=300',
  },
  {
    name: 'Engagement',
    description: 'Speak directly to your customers',
    href: '#',
    icon: CursorArrowRaysIcon,
    imageSrc:
      'https://checkout.iiixys.cc/cdn/shop/products/AC200MAX12V_30ARVCABLE.jpg?v=1679969486&width=300',
  },
  {
    name: 'Security',
    description: 'Your customers’ data will be safe and secure',
    href: '#',
    icon: FingerPrintIcon,
    imageSrc:
      'https://checkout.iiixys.cc/cdn/shop/products/AC200MAX12V_30ARVCABLE.jpg?v=1679969486&width=300',
  },
  {
    name: 'Integrations',
    description: 'Connect with third-party tools',
    href: '#',
    icon: SquaresPlusIcon,
    imageSrc:
      'https://checkout.iiixys.cc/cdn/shop/products/AC200MAX12V_30ARVCABLE.jpg?v=1679969486&width=300',
  },
  {
    name: 'Automations',
    description: 'Build strategic funnels that will convert',
    href: '#',
    icon: ArrowPathIcon,
    imageSrc:
      'https://checkout.iiixys.cc/cdn/shop/products/AC200MAX12V_30ARVCABLE.jpg?v=1679969486&width=300',
  },
  {
    name: 'Integrations',
    description: 'Connect with third-party tools',
    href: '#',
    icon: SquaresPlusIcon,
    imageSrc:
      'https://checkout.iiixys.cc/cdn/shop/products/AC200MAX12V_30ARVCABLE.jpg?v=1679969486&width=300',
  },
  {
    name: 'Automations',
    description: 'Build strategic funnels that will convert',
    href: '#',
    icon: ArrowPathIcon,
  },
  {
    name: 'Integrations',
    description: 'Connect with third-party tools',
    href: '#',
    icon: SquaresPlusIcon,
    imageSrc:
      'https://checkout.iiixys.cc/cdn/shop/products/AC200MAX12V_30ARVCABLE.jpg?v=1679969486&width=300',
  },
  {
    name: 'Automations',
    description: 'Build strategic funnels that will convert',
    href: '#',
    icon: ArrowPathIcon,
    imageSrc:
      'https://checkout.iiixys.cc/cdn/shop/products/AC200MAX12V_30ARVCABLE.jpg?v=1679969486&width=300',
  },
  {
    name: 'Integrations',
    description: 'Connect with third-party tools',
    href: '#',
    icon: SquaresPlusIcon,
    imageSrc:
      'https://checkout.iiixys.cc/cdn/shop/products/AC200MAX12V_30ARVCABLE.jpg?v=1679969486&width=300',
  },
  {
    name: 'Automations',
    description: 'Build strategic funnels that will convert',
    href: '#',
    icon: ArrowPathIcon,
    imageSrc:
      'https://checkout.iiixys.cc/cdn/shop/products/AC200MAX12V_30ARVCABLE.jpg?v=1679969486&width=300',
  },
];
const callsToAction = [
  {name: 'Watch demo', href: '#', icon: PlayCircleIcon},
  {name: 'Contact sales', href: '#', icon: PhoneIcon},
  {name: 'Contact sales', href: '#', icon: ChevronDownIcon},
];

/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart}) {
  const {shop, menu} = header;
  return (
    <header className="sticky top-0 z-40">
      <NavMenu
        shop={shop}
        menu={menu}
        isLoggedIn={isLoggedIn}
        cart={cart}
        viewport="desktop"
        primaryDomainUrl={header.shop.primaryDomain.url}
      />
    </header>
  );
}

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
 *   viewport: Viewport;
 * }}
 */
export function NavMenu({
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
    <NavigationMenu.Root className="relative z-10 bg-white" delayDuration={300}>
      <NavigationMenu.List className="flex items-center justify-between p-2 mx-auto md:p-4 max-w-7xl lg:gap-x-12">
        <NavigationMenu.Item className="md:hidden">
          <HeaderMenuMobileToggle />
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link>
            <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
              <strong>{shop.name}</strong>
            </NavLink>
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <li className="items-center justify-between hidden lg:gap-x-12 lg:flex">
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
              <NavigationMenu.Item key={item.id}>
                <NavigationMenu.Trigger>
                  <NavLink
                    className="text-sm font-semibold leading-6 text-gray-900"
                    end
                    key={item.id}
                    onClick={closeAside}
                    prefetch="intent"
                    style={activeLinkStyle}
                    to={url}
                  >
                    {item.title}
                  </NavLink>
                </NavigationMenu.Trigger>

                <NavigationMenu.Content className="overflow-hidden bg-white shadow-lg rounded-bl-3xl rounded-br-3xl ring-1 ring-gray-900/5">
                  <div className="grid grid-cols-4 px-6 py-10 mx-auto max-w-7xl gap-x-4 lg:px-8 xl:gap-x-8">
                    {products.map((item) => (
                      <div
                        key={item.name}
                        className="relative p-6 text-sm leading-6 rounded-lg group hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-center rounded-lg h-11 w-11 bg-gray-50 group-hover:bg-white">
                          <item.icon
                            className="w-6 h-6 text-gray-600 group-hover:text-indigo-600"
                            aria-hidden="true"
                          />
                        </div>
                        <a
                          href={item.href}
                          className="block mt-6 font-semibold text-gray-900"
                        >
                          {item.name}
                          <span className="absolute inset-0" />
                        </a>
                        <p className="mt-1 text-gray-600">{item.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50">
                    <div className="px-6 mx-auto max-w-7xl lg:px-8">
                      <div className="grid grid-cols-3 divide-x divide-gray-900/5 border-x border-gray-900/5">
                        {callsToAction.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100"
                          >
                            <item.icon
                              className="flex-none w-5 h-5 text-gray-400"
                              aria-hidden="true"
                            />
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* <div className="w-screen max-w-md mx-auto">
                  <div className="p-4">
                    {products.map((item) => (
                      <div
                        key={item.name}
                        className="relative flex items-center p-4 text-sm leading-6 rounded-lg group gap-x-6 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-center flex-none rounded-lg h-11 w-11 bg-gray-50 group-hover:bg-white">
                          <item.icon
                            className="w-6 h-6 text-gray-600 group-hover:text-indigo-600"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="flex-auto">
                          <a
                            href={item.href}
                            className="block font-semibold text-gray-900"
                          >
                            {item.name}
                            <span className="absolute inset-0" />
                          </a>
                          <p className="mt-1 text-gray-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                    {callsToAction.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100"
                      >
                        <item.icon
                          className="flex-none w-5 h-5 text-gray-400"
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div> */}
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            );
          })}
        </li>

        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </NavigationMenu.List>

      <div className="absolute left-0 flex justify-center w-full top-full">
        <NavigationMenu.Viewport className="w-full" />
      </div>
    </NavigationMenu.Root>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderCtas({isLoggedIn, cart}) {
  return (
    <li className="flex justify-center" role="navigation">
      {/* <HeaderMenuMobileToggle />
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        {isLoggedIn ? 'Account' : 'Sign in'}
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} /> */}

      <div className="lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
        {/* <a href="#" className="text-sm font-medium">
          Create an account
        </a> */}
        <span className="w-px h-6 bg-gray-600" aria-hidden="true" />
        <a href="/" className="text-sm font-medium">
          Sign in
        </a>
      </div>
      {/* <CartAside cart={cart} /> */}
      <CartToggle cart={cart} />
    </li>
  );
}

function HeaderMenuMobileToggle() {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center p-1 text-gray-400 rounded-md"
      // onClick={() => setOpen(false)}
    >
      <span className="sr-only">Open menu</span>
      <Bars3Icon className="w-6 h-6" aria-hidden="true" />
    </button>
  );
}

function SearchToggle() {
  return <a href="#search-aside">Search</a>;
}

/**
 * @param {{count: number}}
 */
function CartBadge({count, cart}) {
  if (!cart) {
    return null;
  }

  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger asChild>
        <div className="relative flow-root ml-4 lg:ml-6">
          <a href="/cart" className="flex items-center p-2 -m-2 group">
            <ShoppingBagIcon
              className="flex-shrink-0 w-6 h-6 text-gray-400 group-hover:text-gray-500"
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
          <CartMain layout="aside" cart={cart} />
        </ScrollArea>
      </HoverCardContent>
    </HoverCard>
  );
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart}) {
  return (
    <Suspense fallback={<div>loadding</div>}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <div>null</div>;
          return <CartBadge count={cart.totalQuantity} cart={cart} />;
        }}
      </Await>
    </Suspense>
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

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}

/** @typedef {Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>} HeaderProps */
/** @typedef {'desktop' | 'mobile'} Viewport */

/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('./Layout').LayoutProps} LayoutProps */
