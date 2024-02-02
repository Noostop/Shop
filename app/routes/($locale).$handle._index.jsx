import {Suspense} from 'react';
import {defer, redirect} from '@shopify/remix-oxygen';
import {Await, useLoaderData, useOutletContext} from '@remix-run/react';
import {CacheNone} from '@shopify/hydrogen';
import {AC180} from '~/pages/AC180';
import {AC60} from '~/pages/AC60';
import {getLocaleFromRequest} from '~/lib/utils';

// export function shouldRevalidate({
//   currentParams,
//   nextParams,
//   defaultShouldRevalidate,
// }) {
//   const currentId = currentParams.slug.split('--')[1];
//   const nextId = nextParams.slug.split('--')[1];

//   console.log('currentId', currentParams);
//   console.log('nextId', nextParams);

//   // if (currentId === nextId) {
//   //   return false;
//   // }

//   // return defaultShouldRevalidate;
//   return false;
// }

/**
 * @type {MetaFunction}
 */
// export const meta = ({data}) => {
//   const {title, description} = data;

//   return [
//     {title: `BLUETTI | ${title}`},
//     {
//       description,
//     },
//   ];
// };

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({params, context, request}) {
  // const {handle} = params;
  // const {bluetti, session} = context;
  // const {pathPrefix} = await getLocaleFromRequest({
  //   session,
  //   request,
  // });

  // try {
  //   const product = await bluetti.get(`/supportapi/product/detail/${handle}`, {
  //     cache: CacheNone(),
  //   });

  //   if (product.id) {
  //     return defer(product);
  //   }

  //   return redirect(`/${pathPrefix}/404`);
  // } catch (error) {
  //   const {pathname} = new URL(request.url);

  //   throw new Response(`${pathname} not found`, {
  //     status: 404,
  //   });
  // }

  return defer({});
}

export default function TopicsIndex() {
  const {urlHandle} = useOutletContext();

  return (
    <>
      {urlHandle === 'ac200max' && <AC180 />}
      {urlHandle === 'ac60' && <AC60 />}
    </>
  );
}
