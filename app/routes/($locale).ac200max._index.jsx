import {defer} from '@shopify/remix-oxygen';
import {useLoaderData, useOutletContext} from '@remix-run/react';
import {CacheNone} from '@shopify/hydrogen';
import {AC180} from '~/pages/AC180';
import {Render} from '@bluetti/craft';

/**
 * @type {MetaFunction}
 */
export const meta = ({data}) => {
  const {title, desc} = data;
  return [
    {title: `BLUETTI | ${title}`},
    {
      description: desc,
    },
  ];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({params, context, request}) {
  const handle = 'ac60';
  const {bluetti} = context;

  try {
    const data = await bluetti.get(
      `/pageapi/page/${handle}?shop=bluettipower-develop`,
      {
        cache: CacheNone(),
      },
    );

    return defer(data);
  } catch (error) {
    throw new Response(`not found`, {
      status: 404,
    });
  }
}

export default function TopicsIndex() {
  const {urlHandle} = useOutletContext();
  const {published, content} = useLoaderData();

  const localComponent = () => {
    switch (urlHandle) {
      case 'ac200max':
        return <AC180 />;
      default:
        return published && <Render data={content} />;
    }
  };

  return localComponent();
}
