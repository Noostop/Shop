import {clsx} from 'clsx';
import {useMemo} from 'react';
import {twMerge} from 'tailwind-merge';
import {redirect} from '@shopify/remix-oxygen';
import {useLocation, useMatches} from '@remix-run/react';
import {countries} from '~/data/countries';
import {knowledgeCountry} from '~/lib/cookies.server';

// 首字母大写
export function capitalizeWords(str) {
  return str.replace(/\b\w/g, function (match) {
    return match.toUpperCase();
  });
}

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
  const locale = await knowledgeCountry.parse(cookieHeader);

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
    ? `${
        selectedLocale.pathPrefix == '/' ? '' : selectedLocale.pathPrefix
      }${path}`
    : path;
}

// 获取以存储的语言信息
export function getLocaleFromRequest(request) {
  const url = new URL(request.url);
  const firstPathPart = url.pathname.substring(1).split('/')[0].toLowerCase();

  return countries[firstPathPart]
    ? {
        ...countries[firstPathPart],
      }
    : {
        ...countries['default'],
      };
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

// 字符串移除 HTML 标签
export function removeHtmlTags(text) {
  return text.replace(/<[^>]*>/g, '');
}

export function convertToLowerCase(str) {
  const suStr = str.split('_');
  let result = '';
  if (suStr.length === 1) {
    return str.toLowerCase();
  } else if (suStr.length === 2) {
    return `${suStr[0].toLowerCase()}_${suStr[1].toUpperCase()}`;
  }

  return result;
}

/**
 * 获取本地翻译请求头
 * @param {Object} param0 I18n
 * @returns 请求头
 */
export function getFetchHeaders({i18n, headers = {}}) {
  return {
    ...headers,
    'Content-type': 'application/json',
    shop: i18n.shop,
    country: i18n.country.toUpperCase(),
    language: convertToLowerCase(i18n.language),
  };
}

/**
 * Validates that a url is local
 * @param url
 * @returns `true` if local `false`if external domain
 */
export function isLocalPath(url) {
  try {
    // We don't want to redirect cross domain,
    // doing so could create fishing vulnerability
    // If `new URL()` succeeds, it's a fully qualified
    // url which is cross domain. If it fails, it's just
    // a path, which will be the current domain.
    new URL(url);
  } catch (e) {
    return true;
  }

  return false;
}
