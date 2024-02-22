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
  return selectedLocale ? `/${selectedLocale.pathPrefix || ''}${path}` : path;
}

export function removeSpacesFromURL(url) {
  // 使用 trim() 方法去除字符串两端的空格
  const trimmedURL = url.trim();
  // 如果 URL 包含空格，可能需要进一步处理
  // 例如，将空格替换为 URL 编码中的 "%20"
  const processedURL = trimmedURL.replace(/\s/g, '%20');
  return processedURL;
}

export function parseUrl(url) {
  // 使用 URL 对象解析 URL
  const {origin, pathname, search} = new URL(url);
  // 将路径按斜杠分割成数组
  const pathSegments = pathname.split('/');
  // 过滤掉空字符串，保留非空路径部分
  const nonEmptySegments = pathSegments.filter((segment) => segment !== '');
  // 获取第一个非空路径部分作为参数
  const firstParam = nonEmptySegments.length > 0 ? nonEmptySegments[0] : null;

  // 进行国家和语言类型的校验
  const validCountries = countries[firstParam && firstParam?.toLowerCase()]; // 有效的国家列表

  // 检查国家和语言是否有效
  if (firstParam && validCountries) {
    return {
      origin,
      pathname,
      search,
      pathPrefix: removeSpacesFromURL(firstParam),
      i18n: validCountries,
    };
  } else {
    // 如果国家参数无效，默认返回一个值
    return {
      origin,
      pathname,
      search,
      pathPrefix: firstParam ? firstParam : 'us',
      i18n: countries['us'],
    };
  }
}

// 获取以存储的语言信息
export async function getLocaleFromRequest({session, request}) {
  const sectionI18n = await session.get('i18n');
  const {origin, pathname, search, i18n, pathPrefix} = parseUrl(request.url);

  let isSame = false;

  if (sectionI18n) {
    isSame = sectionI18n.pathPrefix === pathPrefix;

    return {
      isSame,
      pathPrefix,
      i18n: sectionI18n,
      url: isSame
        ? `${origin}${
            pathname.startsWith(sectionI18n.pathPrefix)
              ? ''
              : `/${sectionI18n.pathPrefix}`
          }${pathname.replace(pathPrefix, sectionI18n)}${search}`
        : `${origin}${
            pathname.startsWith(sectionI18n.pathPrefix)
              ? pathname
              : pathname.replace(pathPrefix, sectionI18n.pathPrefix)
          }${search}`,
    };
  }

  return {isSame, i18n, pathPrefix, url: `${origin}${pathname}${search}`};
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
