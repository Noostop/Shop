import {json} from '@remix-run/server-runtime';
import {CacheLong, generateCacheControlHeader} from '@shopify/hydrogen';
import {pages} from '~/data/pages';

export async function action({request, params, context}) {
  if (request.method !== 'POST') {
    throw new Error('Invalid request method');
  }

  const search = await fetchPage({
    params,
    request,
    context,
  });

  console.log(search, 'params -- +++++ 1');

  return json({search});
}

async function fetchPage({handle}) {
  const page = pages.find((p) => p.handle === handle);

  if (page) {
    return page;
  }

  return {error: 'page not found'};
}

// no-op
export default function CountriesResourceRoute() {
  return null;
}
