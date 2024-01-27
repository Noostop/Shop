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
export async function loader({params, request, context}) {
  const {handle} = params;
  const {bluetti} = context;

  try {
    const product = await bluetti.get(`/supportapi/product/detail/${handle}`);
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
  const {commonQuestions} = data;

  return (
    <div className="h-full py-20 bg-gray-50 mt-14">
      <div className="container">
        <h1 className="text-4xl font-semibold">视频</h1>

        <div className="flex flex-col gap-8 pt-8 mt-8 border-t border-gray-300">
          {commonQuestions?.map(({groupName, commonQuestionDetails}) => (
            <div
              key={groupName}
              className="flex flex-col gap-4"
              id={`co_${groupName}`}
            >
              <h3 className="text-3xl font-semibold">{groupName}</h3>

              <ul className="flex flex-col gap-1">
                {commonQuestionDetails?.map(({answer, question}) => (
                  <li
                    key={answer}
                    className="flex flex-col gap-8 px-4 py-4 rounded odd:bg-gray-100"
                  >
                    <h4 className="font-medium">{answer}</h4>
                    <div
                      className="prose-sm prose"
                      dangerouslySetInnerHTML={{__html: question}}
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
