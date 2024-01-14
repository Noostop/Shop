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

export function getLocaleFromRequest(request) {
  const url = new URL(request.url);

  console.log(url.host, 'url.host');

  switch (url.host) {
    // case 'ca.hydrogen.shop':
    //   if (/^\/fr($|\/)/.test(url.pathname)) {
    //     return countries['fr-ca'];
    //   } else {
    //     return countries['en-ca'];
    //   }
    //   break;
    // case 'hydrogen.au':
    //   return countries['en-au'];
    //   break;
    default:
      return countries['default'];
  }
}

// export function getLocaleFromRequest(request) {
//   const url = new URL(request.url);
//   const firstPathPart = url.pathname.split('/')[1]?.toUpperCase() ?? '';

//   let pathPrefix = '';
//   let [language, country] = ['EN', 'US'];

//   if (/^[A-Z]{2}-[A-Z]{2}$/i.test(firstPathPart)) {
//     pathPrefix = '/' + firstPathPart;
//     [language, country] = firstPathPart.split('-');
//   }

//   return {language, country, pathPrefix};
// }
