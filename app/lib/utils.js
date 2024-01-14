import {clsx} from 'clsx';
import {useMemo} from 'react';
import {twMerge} from 'tailwind-merge';
import {useLocation, useMatches} from '@remix-run/react';
import {countries} from '~/data/countries';

/**
 * @param {string} handle
 * @param {SelectedOption[]} selectedOptions
 */
export function useVariantUrl(handle, selectedOptions) {
  const {pathname} = useLocation();

  return useMemo(() => {
    return getVariantUrl({
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
export function getVariantUrl({
  handle,
  pathname,
  searchParams,
  selectedOptions,
}) {
  const match = /(\/[a-zA-Z]{2}-[a-zA-Z]{2}\/)/g.exec(pathname);
  const isLocalePathname = match && match.length > 0;

  const path = isLocalePathname
    ? `${match[0]}products/${handle}`
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
    ? `${selectedLocale.pathPrefix}${path.startsWith('/') ? path : '/' + path}`
    : path;
}

// export function getLocaleFromRequest(request) {
//   const url = new URL(request.url);

//   console.log(url.host, 'url.host');

//   switch (url.host) {
//     case 'shop.iiixys.cc':
//       if (/^\/fr($|\/)/.test(url.pathname)) {
//         return countries['fr-ca'];
//       } else {
//         return countries['en-ca'];
//       }
//       break;
//     // case 'hydrogen.au':
//     //   return countries['en-au'];
//     //   break;
//     default:
//       return countries['default'];
//   }
// }

export function getCountry(prefix) {
  let locale = '';
  switch (prefix) {
    case 'ca':
      locale = countries['/ca-en'];
      break;
    case 'cn':
      locale = countries['/zh-cn'];
      break;
    case 'de':
      locale = countries['/de-de'];
      break;
    case 'fr-en':
      locale = countries['/fr-en'];
      break;
    case 'fr':
      locale = countries['/fr'];
      break;
    case 'jp':
      locale = countries['/jp'];
      break;
    default:
      locale = countries.default;
  }

  return locale;
}

export function getLocaleFromRequest(request) {
  const url = new URL(request.url);
  const firstPathPart = url.pathname.split('/')[1]?.toLowerCase() ?? '';
  const locale = getCountry(firstPathPart);

  // if (/^[a-z]{2}-[a-z]{2}$/i.test(firstPathPart)) {
  //   pathPrefix = '/' + firstPathPart;
  //   countries[pathPrefix] && ([language, country] = firstPathPart.split('-'));
  //   // [language, country] = firstPathPart.split('-');
  // }

  return locale;
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
