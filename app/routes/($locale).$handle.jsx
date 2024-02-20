import {Suspense} from 'react';
import {defer, redirectDocument} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Outlet} from '@remix-run/react';
import {CacheNone} from '@shopify/hydrogen';
import {LayoutTopics} from '~/components/LayoutTopics';
import {getLocaleFromRequest} from '~/lib/utils';

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
  const {bluetti, session} = context;
  const {pathPrefix} = await getLocaleFromRequest({
    session,
    request,
  });

  try {
    const product = await bluetti.get(`/supportapi/product/detail/${handle}`, {
      cache: CacheNone(),
    });

    if (product && product.status === 2) {
      return defer(product);
    }

    return redirectDocument(`/${pathPrefix}/404`);
  } catch (error) {
    // const {pathname} = new URL(request.url);
    return redirectDocument(`/${pathPrefix}/404`);
    // throw new Response(`${pathname} not found`, {
    //   status: 404,
    // });
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
