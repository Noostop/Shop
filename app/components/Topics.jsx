import {Link} from '@remix-run/react';
import {Bars3Icon, PlayIcon} from '@heroicons/react/24/outline';
import {Image} from '@shopify/hydrogen';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {Dialog, DialogContent, DialogTrigger} from '@/components/ui/dialog';

import {Button} from '@/components/ui/button';
import {ScrollArea} from '@radix-ui/react-scroll-area';

export function Faqs({data}) {
  return (
    <div className="h-full py-20 bg-gray-50">
      <div className="container">
        <h1 className="text-4xl font-semibold">常见问题</h1>

        <div className="flex flex-col gap-8 pt-8 mt-8 border-t border-gray-300">
          {data?.map(({groupName, commonQuestionDetails}) => (
            <div
              key={groupName}
              className="flex flex-col gap-4"
              id={`co_${groupName}`}
            >
              <h3 className="text-3xl font-semibold">{groupName}</h3>

              <Accordion type="multiple" className="space-y-2">
                {commonQuestionDetails?.map(({sort, answer, question}) => (
                  <AccordionItem
                    key={sort}
                    value={answer}
                    className="px-4 py-4 border-none rounded odd:bg-gray-100"
                  >
                    <AccordionTrigger className="text-left hover:no-underline hover:text-parimary">
                      <h4 className="text-base font-medium">{question}</h4>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div
                        className="prose-sm prose"
                        dangerouslySetInnerHTML={{__html: answer}}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Specs({data}) {
  return (
    <div className="flex flex-col flex-1 gap-y-2 md:gap-y-4">
      <div className="container mt-20">
        <h1 className="text-4xl font-semibold">技术参数</h1>

        <div className="flex flex-col gap-8 pt-8 mt-8 border-t border-gray-300">
          {data.map(({title, parameterItems}) => (
            <div key={title} className="flex flex-col gap-4" id={`co_${title}`}>
              <h3 className="text-3xl font-semibold">{title}</h3>

              <ul className="flex flex-col gap-1">
                {parameterItems.map(({key, value}) => (
                  <li
                    key={key}
                    className="flex flex-col gap-8 px-4 py-4 rounded md:items-center md:flex-row odd:bg-gray-100"
                  >
                    <h4 className="font-medium md:basis-60">{key}</h4>
                    <div
                      className="w-full prose"
                      dangerouslySetInnerHTML={{__html: value}}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <FixedNav data={data} />
    </div>
  );
}

export function Downloads({data}) {
  const {title, manuals} = data.downloads;

  return (
    <div className="h-full py-20 bg-gray-50">
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
  );
}

export function Videos({data}) {
  return (
    <div className="h-full py-20 bg-gray-50">
      <div className="container">
        <h1 className="text-4xl font-semibold">视频</h1>

        <div className="flex flex-col gap-8 pt-8 mt-8 border-t border-gray-300">
          {data?.map(({title, videoDetails}) => (
            <div
              key={title}
              className="flex flex-col gap-6 p-4 bg-white rounded"
              id={`co_${title}`}
            >
              <h3 className="text-3xl font-semibold">{title}</h3>

              <ul className="flex flex-wrap gap-4">
                {videoDetails?.map(
                  ({sort, videoName, describe, cover, url}) => (
                    <li key={sort} className="w-full md:basis-1/2 lg:basis-1/3">
                      <div className="relative space-y-4 group">
                        <div className="relative overflow-hidden bg-gray-300 rounded aspect-video">
                          <Image
                            data={{
                              url: cover,
                              alt: videoName,
                            }}
                            className="object-cover w-full h-full"
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Dialog>
                              <DialogTrigger asChild>
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
                              </DialogTrigger>
                              <DialogContent className="p-0 overflow-hidden border-none md:max-w-6xl aspect-video">
                                <video
                                  src={url}
                                  className="object-cover w-full h-full"
                                  controls
                                  loop
                                  autoPlay
                                >
                                  <track kind="captions" />
                                </video>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                        <h4 className="font-medium md:basis-60 line-clamp-2">
                          {videoName}
                        </h4>
                        <p
                          className="text-sm text-gray-500 line-clamp-3"
                          dangerouslySetInnerHTML={{__html: describe}}
                        />
                      </div>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* <FixedNav videos={data.videos} /> */}
    </div>
  );
}

// 导航菜单
function FixedNav({data}) {
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
          {data?.map(({id, title}, index) => (
            <div key={`nav_${id}`}>
              <Link
                to={`/ac180/specs#co_${title}`}
                className="block w-full px-2 py-1 rounded-md hover:bg-gray-100"
              >
                {index + 1}.{title}
              </Link>
              {index < data.length - 1 && (
                <hr className="block w-full h-0 my-2 bg-gray-100" />
              )}
            </div>
          ))}
        </ScrollArea>
      </HoverCardContent>
    </HoverCard>
  );
}
