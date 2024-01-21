import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Bars3Icon} from '@heroicons/react/24/outline';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

import {Button} from '@/components/ui/button';
import {ScrollArea} from '@radix-ui/react-scroll-area';
import {pages} from '~/data/pages';

/**
 * @type {MetaFunction}
 */
export const meta = ({data}) => {
  const {title, description} = data;

  return [
    {title: `BLUETTI Specs | ${title}`},
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
  const {specs} = data;

  return (
    <div className="flex flex-col flex-1 gap-y-2 md:gap-y-4 my-14">
      <div className="container mt-20">
        <h1 className="text-4xl font-semibold">技术参数</h1>

        <div className="flex flex-col gap-8 pt-8 mt-8 border-t border-gray-300">
          {specs.map(({id, title, lists}) => (
            <div key={id} className="flex flex-col gap-4" id={`co_${title}`}>
              <h3 className="text-3xl font-semibold">{title}</h3>

              <ul className="flex flex-col gap-1">
                {lists.map(({id, title, description}) => (
                  <li
                    key={id}
                    className="flex flex-col gap-8 px-4 py-4 rounded md:items-center md:flex-row odd:bg-gray-100"
                  >
                    <h4 className="font-medium md:basis-60">{title}</h4>
                    <div
                      className="w-full prose"
                      dangerouslySetInnerHTML={{__html: description}}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <FixedNav specs={specs} />
    </div>
  );
}

function FixedNav({specs}) {
  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger className="fixed z-10 bottom-20 right-4 md:right-20">
        <Button size="icon" variant="secondary" className="rounded-full shadow">
          <span className="sr-only">Open menu</span>
          <Bars3Icon className="w-4 h-4" aria-hidden="true" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent sideOffset={20} align="end">
        <ScrollArea className="w-full overflow-x-hidden overflow-y-auto h-60">
          {specs?.map(({id, title}, index) => (
            <div key={`nav_${id}`}>
              <Link
                to={`/ac180/specs#co_${title}`}
                className="block w-full px-2 py-1 rounded-md hover:bg-gray-100"
              >
                {index + 1}.{title}
              </Link>
              {index < specs.length - 1 && (
                <hr className="block w-full h-0 my-2 bg-gray-100" />
              )}
            </div>
          ))}
        </ScrollArea>
      </HoverCardContent>
    </HoverCard>
  );
  s;
}