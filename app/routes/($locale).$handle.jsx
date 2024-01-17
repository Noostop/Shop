import {Suspense} from 'react';
import {defer, redirect} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Outlet} from '@remix-run/react';
import {pages} from '~/data/pages';
import {LayoutTopics} from '~/components/LayoutTopics';
import {countries} from '~/data/countries';

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
//   return true;
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
export async function loader({params, request, context}) {
  const {locale, handle} = params;

  console.log(locale, handle, '$handle');

  if (!locale) {
    return redirect(`/`);
  }

  try {
    const page = pages.find((p) => p.handle === handle);
    return defer(page);
  } catch (error) {
    throw new Response(`${new URL(request.url).pathname} not found`, {
      status: 404,
    });
  }
}

export default function Handle() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();

  return (
    <LayoutTopics {...data}>
      <Outlet />
    </LayoutTopics>
  );
}
