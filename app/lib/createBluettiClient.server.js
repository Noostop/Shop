import {createWithCache, CacheLong} from '@shopify/hydrogen';
import {getFetchHeaders} from './utils';

export function createBluettiClient({
  serverDomain,
  serverAPiVersion,
  i18n,
  cache,
  waitUntil,
}) {
  const withCache = createWithCache({cache, waitUntil});

  async function post(url, body = {}, options = {cache: CacheLong()}) {
    return withCache(
      ['r&m', JSON.stringify(url)],
      options.cache,
      async function () {
        const response = await fetch(`${serverDomain}${url}`, {
          method: 'POST',
          headers: getFetchHeaders({i18n}),
          body: JSON.stringify({
            body,
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

  async function get(url, options = {cache: CacheLong()}) {
    return withCache(['r&m', url], options.cache, async function () {
      const response = await fetch(`${serverDomain}${url}`, {
        method: 'GET',
        headers: getFetchHeaders({i18n}),
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
