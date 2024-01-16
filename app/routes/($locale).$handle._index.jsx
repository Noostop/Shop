import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Outlet} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {SliderShow} from '~/components/SliderShow';
import {pages} from '~/data/pages';

import {LayoutTopics} from '~/components/LayoutTopics';
import {AC180} from '~/pages/AC180';
import {AC60} from '~/pages/AC60';

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
  const {handle} = params;

  try {
    const product = pages.find((p) => p.handle === handle);
    return defer(product);
  } catch (error) {
    throw new Response(`${new URL(request.url).pathname} not found`, {
      status: 404,
    });
  }
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();

  return (
    <LayoutTopics {...data}>
      {data.handle === 'ac180' && <AC180 />}
      {data.handle === 'ac60' && <AC60 />}
    </LayoutTopics>
  );
}
