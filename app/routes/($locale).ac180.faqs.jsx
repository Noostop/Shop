import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {Bars3Icon, PlayIcon} from '@heroicons/react/24/outline';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

import {Button} from '@/components/ui/button';
import {ScrollArea} from '@radix-ui/react-scroll-area';
import {Link} from '~/components/Link';
import {pages} from '~/data/pages';

/**
 * @type {MetaFunction}
 */
export const meta = ({data}) => {
  const {title, description} = data;

  return [
    {title: `BLUETTI Faq | ${title}`},
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
    const product = pages.find((p) => p.handle === 'ac180');
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
  const {title, faqs} = data.faq;

  return (
    <div className="h-full py-20 bg-gray-50 mt-14">
      <div className="container">
        <h1 className="text-4xl font-semibold">{title}</h1>

        <div className="flex flex-col gap-8 pt-8 mt-8 border-t border-gray-300">
          {faqs.map(({id, title, lists}) => (
            <div key={id} className="flex flex-col gap-4" id={`co_${title}`}>
              <h3 className="text-3xl font-semibold">{title}</h3>

              <ul className="flex flex-col gap-1">
                {lists.map(({id, title, description}) => (
                  <li
                    key={id}
                    className="flex flex-col gap-8 px-4 py-4 rounded odd:bg-gray-100"
                  >
                    <h4 className="font-medium">{title}</h4>
                    <div
                      className="prose-sm prose"
                      dangerouslySetInnerHTML={{__html: description}}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
