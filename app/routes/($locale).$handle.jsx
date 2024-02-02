import {Suspense} from 'react';
import {defer, redirect} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Outlet} from '@remix-run/react';
import {CacheNone} from '@shopify/hydrogen';
import {SubNavigation} from '~/components/SubNavigation';
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
  const {locale, handle} = params;
  const {bluetti, session} = context;
  const {pathPrefix} = await getLocaleFromRequest({
    session,
    request,
  });

  try {
    const product = await bluetti.get(`/supportapi/product/detail/${handle}`, {
      cache: CacheNone(),
    });

    if (product.id) {
      return defer(product);
    }

    return redirect(`/${pathPrefix}/404`);
  } catch (error) {
    const {pathname} = new URL(request.url);

    throw new Response(`${pathname} not found`, {
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
