import {createWithCache, CacheLong} from '@shopify/hydrogen';
import {convertToLowerCase} from './utils';

export function createBluettiClient({
  serverDomain,
  serverAPiVersion,
  i18n,
  cache,
  waitUntil,
}) {
  const withCache = createWithCache({cache, waitUntil});

  const headers = {
    'Content-type': 'application/json',
    shop: i18n.shop,
    country: i18n.country.toUpperCase(),
    language: convertToLowerCase(i18n.language),
  };

  async function post(query, options = {cache: CacheLong()}) {
    return withCache(
      ['r&m', JSON.stringify(query)],
      options.cache,
      async function () {
        const response = await fetch(`${serverDomain}`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            query,
          }),
        });

        if (!response.ok) {
          throw new Error(
            `Error getting from BLUETTI API: ${response.statusText}`,
          );
        }

        const json = await response.json();

        if (json.code !== 0) {
          throw new Error(`Error getting from BLUETTI API: ${json.msg}`);
        }

        return json.data;
      },
    );
  }

  async function get(query, options = {cache: CacheLong()}) {
    return withCache(['r&m', query], options.cache, async function () {
      const response = await fetch(`${serverDomain}${query}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(
          `Error getting from BLUETTI API: ${response.statusText}`,
        );
      }

      const json = await response.json();

      if (json.code !== 0) {
        throw new Error(`Error getting from BLUETTI API: ${json.msg}`);
      }

      return json.data;
    });
  }

  return {post, get};
}
