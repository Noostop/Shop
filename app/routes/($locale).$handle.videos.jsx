import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {Bars3Icon, PlayIcon} from '@heroicons/react/24/outline';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

import {Button} from '@/components/ui/button';
import {ScrollArea} from '@radix-ui/react-scroll-area';
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

  return (
    <LayoutTopics {...data}>
      <div className="h-full py-20 bg-gray-50">
        <div className="container">
          <h1 className="text-4xl font-semibold">视频</h1>

          <div className="flex flex-col gap-8 pt-8 mt-8 border-t border-gray-300">
            {data.videos.map(({id, title, lists}) => (
              <div
                key={id}
                className="flex flex-col gap-6 p-4 bg-white rounded"
                id={`co_${title}`}
              >
                <h3 className="text-3xl font-semibold">{title}</h3>

                <ul className="flex flex-wrap gap-4">
                  {lists.map(({id, title, description, video}) => (
                    <li key={id} className="lg:basis-1/3">
                      <div className="relative space-y-4 group">
                        <div className="relative aspect-video">
                          <Image
                            data={video.postImage}
                            className="object-cover w-full h-full overflow-hidden rounded"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="rounded-full shadow opacity-60 group-hover:opacity-100"
                            >
                              <span className="sr-only">Open menu</span>
                              <PlayIcon
                                className="w-4 h-4"
                                aria-hidden="true"
                              />
                            </Button>
                          </div>
                        </div>
                        <h4 className="font-medium md:basis-60 line-clamp-2">
                          {title}
                        </h4>
                        <p
                          className="text-sm text-gray-500 line-clamp-3"
                          dangerouslySetInnerHTML={{__html: description}}
                        ></p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <FixedNav specs={data.videos} />
      </div>
    </LayoutTopics>
  );
}

function FixedNav({videos}) {
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
          {videos?.map(({id, title}, index) => (
            <>
              <div key={`nav_${id}`}>
                <Link
                  to={`/ac180/specs#co_${title}`}
                  className="block w-full px-2 py-1 rounded-md hover:bg-gray-100"
                >
                  {index + 1}.{title}
                </Link>
              </div>
              {index < videos.length - 1 && (
                <hr className="block w-full h-0 my-2 bg-gray-100" />
              )}
            </>
          ))}
        </ScrollArea>
      </HoverCardContent>
    </HoverCard>
  );
}
