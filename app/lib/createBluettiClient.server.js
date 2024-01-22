import {createWithCache, CacheLong} from '@shopify/hydrogen';

export function createBluettiClient({
  serverDomain,
  serverAPiVersion,
  i18n,
  cache,
  waitUntil,
}) {
  const withCache = createWithCache({cache, waitUntil});

  async function post(query, options = {cache: CacheLong()}) {
    return withCache(
      ['r&m', JSON.stringify(query)],
      options.cache,
      async function () {
        const response = await fetch(`${serverDomain}`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            query,
          }),
        });

        if (!response.ok) {
          throw new Error(`从BLUETTI api 获取时出错: ${response.statusText}`);
        }

        const json = await response.json();

        return json.data;
      },
    );
  }

  async function get(query, options = {cache: CacheLong()}) {
    return withCache(['r&m', query], options.cache, async function () {
      const response = await fetch(`${serverDomain}${query}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`从BLUETTI api 获取时出错: ${response.statusText}`);
      }

      const json = await response.json();

      return json.data;
    });
  }

  return {post, get};
}
