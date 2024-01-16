import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Outlet} from '@remix-run/react';
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
      <Outlet />;
    </LayoutTopics>
  );
}
