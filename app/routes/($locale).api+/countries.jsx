import {json} from '@remix-run/server-runtime';
import {CacheLong, generateCacheControlHeader} from '@shopify/hydrogen';
import {countries, areas} from '~/data/countries';
export async function loader() {
  return json(
    {
      areas,
      countries,
    },
    {
      headers: {'cache-control': generateCacheControlHeader(CacheLong())},
    },
  );
} // no-op
export default function CountriesResourceRoute() {
  return null;
}
