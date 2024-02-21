import {
  compress,
  decompress,
  compressToUTF16,
  decompressFromUTF16,
  compressToBase64,
  decompressFromBase64,
  compressToUint8Array,
  decompressFromUint8Array,
} from 'lz-string';
import {Suspense, useState, useEffect} from 'react';
import {defer, redirect} from '@shopify/remix-oxygen';
import {Await, useLoaderData, useOutletContext} from '@remix-run/react';
import {CacheNone} from '@shopify/hydrogen';
import {AC180} from '~/pages/AC180';
import {AC60} from '~/pages/AC60';
import {getLocaleFromRequest} from '~/lib/utils';
import {Render} from '@bluetti/craft';

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
  const {handle} = params;
  const {bluetti, session} = context;
  const {pathPrefix} = await getLocaleFromRequest({
    session,
    request,
  });

  try {
    const data = await bluetti.get(
      `/pageapi/page/${handle}?shop=bluettipower-develop`,
      {
        cache: CacheNone(),
      },
    );

    return defer(data);
  } catch (error) {
    const {pathname} = new URL(request.url);
    throw new Response(`${pathname} not found`, {
      status: 404,
    });
  }
}

export default function TopicsIndex() {
  const {urlHandle} = useOutletContext();
  const data = useLoaderData();

  console.log(data);

  return (
    <>
      <Render data={data?.content} />

      {/* {urlHandle === 'ac200max' && <AC180 />}
      {urlHandle === 'ac60' && <AC60 />} */}
    </>
  );
}
