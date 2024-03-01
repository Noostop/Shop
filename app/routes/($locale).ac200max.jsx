import {Suspense} from 'react';
import {defer, redirectDocument} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Outlet} from '@remix-run/react';
import {CacheNone} from '@shopify/hydrogen';
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
export async function loader({params, context}) {
  const handle = 'ac200max';
  const {bluetti} = context;

  try {
    const product = await bluetti.get(`/supportapi/product/detail/${handle}`, {
      cache: CacheNone(),
    });

    if (product && product.status === 2) {
      return defer(product);
    }
  } catch (error) {
    throw new Response(`page not found`, {
      status: 404,
    });
  }
}

export default function Handle() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();

  return (
    <LayoutTopics {...data}>
      <Outlet context={data} />
    </LayoutTopics>
  );
}
