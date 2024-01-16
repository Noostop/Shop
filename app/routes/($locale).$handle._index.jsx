import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Outlet} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {SliderShow} from '~/components/SliderShow';
import {pages} from '~/data/pages';

import {LayoutTopics} from '~/components/LayoutTopics';

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
      <div className="flex-1 bg-gray-100">
        <Outlet />
      </div>

      <div className="flex flex-col flex-1 gap-y-2 md:gap-y-4 pt-14">
        <div className="h-screen bg-pink-500"></div>
        <div className="h-screen bg-yellow-500"></div>
        <div className="h-screen bg-green-500"></div>
      </div>
    </LayoutTopics>
  );
}
