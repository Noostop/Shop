import {clsx} from 'clsx';
import {useMemo} from 'react';
import {twMerge} from 'tailwind-merge';
import {redirect} from '@shopify/remix-oxygen';
import {useLocation, useMatches} from '@remix-run/react';
import {countries} from '~/data/countries';
import {knowledgeCountry} from '~/lib/cookies.server';

/**
 * @param {string} handle
 * @param {SelectedOption[]} selectedOptions
 */
export function useVariantUrl(handle, request, selectedOptions) {
  const {pathname} = useLocation();

  return useMemo(() => {
    return getVariantUrl({
      request,
      handle,
      pathname,
      searchParams: new URLSearchParams(),
      selectedOptions,
    });
  }, [handle, selectedOptions, pathname]);
}

/**
 * @param {{
 *   handle: string;
 *   pathname: string;
 *   searchParams: URLSearchParams;
 *   selectedOptions: SelectedOption[];
 * }}
 */
export async function getVariantUrl({
  request,
  handle,
  pathname,
  searchParams,
  selectedOptions,
}) {
  const cookieHeader = request.headers.get('Cookie');
  const locale = (await knowledgeCountry.parse(cookieHeader)) ?? DEFAULT_LOCALE;

  // const match = /(\/[a-zA-Z]{2}-[a-zA-Z]{2}\/)/g.exec(pathname);
  // const isLocalePathname = match && match.length > 0;

  const path = locale
    ? `${locale.pathPrefix || ''}/products/${handle}`
    : `/products/${handle}`;

  selectedOptions.forEach((option) => {
    searchParams.set(option.name, option.value);
  });

  const searchString = searchParams.toString();

  return path + (searchString ? '?' + searchParams.toString() : '');
}

/** @typedef {import('@shopify/hydrogen/storefront-api-types').SelectedOption} SelectedOption */

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function usePrefixPathWithLocale(path) {
  const [root] = useMatches();
  const selectedLocale = root.data.selectedLocale;

  return selectedLocale
    ? `${selectedLocale.pathPrefix || ''}${
        path?.startsWith('/') ? path : '/' + path
      }`
    : path;
}

// 获取以存储的语言信息
export async function getLocaleFromRequest(request) {
  const cookieHeader = request.headers.get('Cookie');
  return (await knowledgeCountry.parse(cookieHeader)) ?? DEFAULT_LOCALE;
}

// 读取请求头中的语言信息
export function getApproximateLocaleFromRequest(request) {
  const url = new URL(request.url);

  // Get the accept-language header
  const acceptLang = request.headers.get('accept-language');

  // Do something with accept language.
  // For example:
  if (acceptLang.includes('en-US')) {
    return {
      language: 'EN',
      country: 'US',
    };
  }

  // Use the default locale
  return {
    language: 'EN',
    country: 'CA',
  };
}

// 默认地址信息
export const DEFAULT_LOCALE = Object.freeze({
  ...countries.default,
});

function resolveToFromType({customPrefixes, pathname, type}) {
  if (!pathname || !type) return '';

  /*
    MenuItemType enum
    @see: https://shopify.dev/api/storefront/unstable/enums/MenuItemType
  */
  const defaultPrefixes = {
    BLOG: 'blogs',
    COLLECTION: 'collections',
    COLLECTIONS: 'collections', // Collections All (not documented)
    FRONTPAGE: 'frontpage',
    HTTP: '',
    PAGE: 'pages',
    CATALOG: 'collections/all', // Products All
    PRODUCT: 'products',
    SEARCH: 'search',
    SHOP_POLICY: 'policies',
  };

  const pathParts = pathname.split('/');
  const handle = pathParts.pop() || '';
  const routePrefix = {
    ...defaultPrefixes,
    ...customPrefixes,
  };

  switch (true) {
    // special cases
    case type === 'FRONTPAGE':
      return '/';

    case type === 'ARTICLE': {
      const blogHandle = pathParts.pop();
      return routePrefix.BLOG
        ? `/${routePrefix.BLOG}/${blogHandle}/${handle}/`
        : `/${blogHandle}/${handle}/`;
    }

    case type === 'COLLECTIONS':
      return `/${routePrefix.COLLECTIONS}`;

    case type === 'SEARCH':
      return `/${routePrefix.SEARCH}`;

    case type === 'CATALOG':
      return `/${routePrefix.CATALOG}`;

    // common cases: BLOG, PAGE, COLLECTION, PRODUCT, SHOP_POLICY, HTTP
    default:
      return routePrefix[type]
        ? `/${routePrefix[type]}/${handle}`
        : `/${handle}`;
  }
}

/*
  Parse each menu link and adding, isExternal, to and target
*/
function parseItem(primaryDomain, env, customPrefixes = {}) {
  return function (item) {
    if (!item?.url || !item?.type) {
      // eslint-disable-next-line no-console
      console.warn('Invalid menu item.  Must include a url and type.');
      return null;
    }

    // extract path from url because we don't need the origin on internal to attributes
    const {host, pathname} = new URL(item.url);

    const isInternalLink =
      host === new URL(primaryDomain).host || host === env.PUBLIC_STORE_DOMAIN;

    const parsedItem = isInternalLink
      ? // internal links
        {
          ...item,
          isExternal: false,
          target: '_self',
          to: resolveToFromType({type: item.type, customPrefixes, pathname}),
        }
      : // external links
        {
          ...item,
          isExternal: true,
          target: '_blank',
          to: item.url,
        };

    if ('items' in item) {
      return {
        ...parsedItem,
        items: item.items
          .map(parseItem(primaryDomain, env, customPrefixes))
          .filter(Boolean),
      };
    } else {
      return parsedItem;
    }
  };
}

export function parseMenu(menu, primaryDomain, env, customPrefixes = {}) {
  if (!menu?.items) {
    // eslint-disable-next-line no-console
    console.warn('Invalid menu passed to parseMenu');
    return null;
  }

  const parser = parseItem(primaryDomain, env, customPrefixes);

  const parsedMenu = {
    ...menu,
    items: menu.items.map(parser).filter(Boolean),
  };

  return parsedMenu;
}

export function isMobileDevice() {
  return (
    typeof window.orientation !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1
  );
}
