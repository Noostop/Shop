import {Suspense} from 'react';
import {defer, redirect} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Outlet} from '@remix-run/react';
import {pages} from '~/data/pages';
import {SubNavigation} from '~/components/SubNavigation';

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
  const {bluetti} = context;

  try {
    const product = await bluetti.get(`/supportapi/product/detail/${handle}`);
    return defer(product);
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
    <>
      <SubNavigation {...data} />
      <Outlet />
    </>
  );
}
