import {Suspense} from 'react';
import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Outlet} from '@remix-run/react';
import {pages} from '~/data/pages';
import {AC180} from '~/pages/AC180';
import {AC60} from '~/pages/AC60';

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
export const meta = ({data}) => {
  const {title, description} = data;

  return [
    {title: `BLUETTI | ${title}`},
    {
      description,
    },
  ];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({params, request}) {
  const {locale, handle} = params;
  // console.log('handle', locale, handle);

  try {
    const page = pages.find((p) => p.handle === handle);
    return defer({page, handle});
  } catch (error) {
    throw new Response(`${new URL(request.url).pathname} not found`, {
      status: 404,
    });
  }
}

export default function Handle() {
  /** @type {LoaderReturnData} */
  const {handle} = useLoaderData();

  // if (handle) {
  //   throw new Response(`${handle} not found`, {
  //     status: 404,
  //   });
  // }

  return (
    <>
      {handle === 'ac200max' && <AC180 />}
      {handle === 'ac60' && <AC60 />}
    </>
  );
}
