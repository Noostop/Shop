import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';

import {Link} from '~/components/Link';
import {pages} from '~/data/pages';
import {LayoutTopics} from '~/components/LayoutTopics';

/**
 * @type {MetaFunction}
 */
export const meta = ({data}) => {
  const {title, description} = data;

  return [
    {title: `BLUETTI Download | ${title}`},
    {
      description,
    },
  ];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({params, request}) {
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

export default function Specs() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  const {title, manuals} = data.downloads;

  return (
    <LayoutTopics {...data}>
      <div className="h-full py-20 bg-gray-50 mt-14">
        <div className="container">
          <h1 className="text-4xl font-semibold">{title}</h1>

          <div className="flex flex-col gap-8 pt-8 mt-8 border-t border-gray-300">
            <div className="flex flex-col gap-6 p-4 bg-white rounded">
              <h3 className="text-3xl font-semibold">{manuals.title}</h3>

              <ul className="flex flex-col gap-4">
                {manuals.lists.map(({id, title, description, url}) => (
                  <li
                    key={id}
                    className="flex justify-between p-4 odd:bg-gray-50"
                  >
                    <h4 className="font-medium text-gray-600 line-clamp-2">
                      {title}
                    </h4>
                    <Link
                      className="relative space-y-4 text-sm text-primary hover:text-primary/80"
                      to={url}
                    >
                      .pdf 下载
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </LayoutTopics>
  );
}
