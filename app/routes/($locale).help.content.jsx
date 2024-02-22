import clsx from 'clsx';
import {useState, useEffect} from 'react';
import {defer, redirectDocument} from '@shopify/remix-oxygen';
import {Image} from '@shopify/hydrogen';
import {Await, Outlet, useLoaderData} from '@remix-run/react';
import {Link} from '~/components/Link';
import * as cheerio from 'cheerio';
import {
  getLocaleFromRequest,
  removeHtmlTags,
  getFetchHeaders,
} from '~/lib/utils';

import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';

import {Button} from '@/components/ui/button';
import {
  HandThumbDownIcon,
  HandThumbUpIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

import {createBluettiClient} from '~/lib/createBluettiClient';

const extractHeadingsFromHTML = (html) => {
  const headings = [];
  const $ = cheerio.load(html);

  $('h1, h2, h3, h4, h5, h6').each((index, element) => {
    const headingId = 'heading_' + (index + 1);
    $(element).attr('id', headingId);

    const level = parseInt($(element).prop('tagName').charAt(1), 10);
    const text = $(element).text();

    headings.push({level, text, headingId});
  });

  return {headings, html: $.html()};
};

/**
 * @type {MetaFunction}
 */
export const meta = ({data}) => {
  const {content} = data;

  return [
    {title: `BLUETTI | ${content?.name}`},
    {
      description: removeHtmlTags(content?.questionDetail),
    },
  ];
};

export async function loader({request, context}) {
  const {bluetti, session, env, i18n} = context;
  const {pathPrefix} = await getLocaleFromRequest({
    session,
    request,
  });
  const id = new URL(request.url).searchParams.get('id') || '';

  if (!id) {
    return redirectDocument(`/${pathPrefix}/help`);
  }

  const content = await bluetti.get(
    `/supportapi/supportQuestion/Question/${id}`,
  );

  return defer({content, env, i18n});
}

export default function Support() {
  const {content, env, i18n} = useLoaderData();
  const [preHtml, setPreHtml] = useState();
  const [headings, setHeadings] = useState([]);
  const [success, setSuccess] = useState(false);

  const bluetti = new createBluettiClient({
    i18n,
    serverDomain: env.BLUETTI_SERVER_DOMAIN,
    serverAPiVersion: 'v1',
  });

  useEffect(() => {
    // 解析HTML并获取标题
    const {headings, html} = extractHeadingsFromHTML(content.answer);
    setHeadings(headings);
    setPreHtml(html);
  }, []);

  const handleClick = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  const handleFeedback = async (type) => {
    setSuccess(true);

    const response = await bluetti.post(
      `/supportapi/supportQuestion/LikeOrOppose`,
      {
        type,
        id: content.id,
        userId: '648c149b6d557dee404dfad4',
      },
    );

    if (!response.ok) {
      throw new Error(`Error getting from BLUETTI API: ${response.statusText}`);
    }
  };

  return (
    <section className="container min-h-screen py-24">
      <div className="relative grid grid-cols-7">
        {headings.length > 0 && (
          <div className="order-2 col-span-2 py-4 ml-8 rounded">
            <div className="sticky top-16 md:top-24">
              <h3 className="font-medium text-gray-600">目录</h3>
              <ul className="mt-2 space-y-2 border-l-2 border-gray-100">
                {headings?.map((heading) => (
                  <li
                    key={heading.headingId}
                    style={{
                      paddingLeft: `${(heading.level - 1) * 20}px`,
                    }}
                    className={clsx(
                      'pl-4 relative after:contents[*] transition-all hover:font-semibold hover:after:opacity-100 after:opacity-0 after:block after:w-px after:h-full after:rounded-full after:bg-primary after:absolute after:top-1/2 after:-left-px after:transform after:-translate-y-1/2',
                    )}
                  >
                    <button
                      className="pl-4 text-sm text-gray-600 cursor-pointer hover:text-primary"
                      onClick={() => handleClick(heading.headingId)}
                    >
                      {heading.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div
          className={clsx(
            headings.length > 0 ? 'order-1 col-span-5' : 'col-span-7',
          )}
        >
          <h1 className="text-2xl font-semibold">{content.name}</h1>
          <div
            id="answerContent"
            dangerouslySetInnerHTML={{
              __html: preHtml,
            }}
            className="min-h-screen mt-4 prose prose-lg prose-video:aspect-video prose-video:w-full prose-video:rounded prose-img:rounded prose-a:text-primary prose-a:hover:text-primary/80 max-w-none"
          />
          <div className="flex items-center justify-between h-16 p-4 mt-20 bg-gray-100 rounded">
            {success ? (
              <>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span className="text-lg font-semibold">感谢您的反馈。</span>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="text-lg font-semibold">
                    内容是否有帮助？
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    className="gap-x-1"
                    variant="outline"
                    onClick={() => handleFeedback(2)}
                  >
                    <HandThumbDownIcon className="w-4 h-4" />
                    无帮助
                  </Button>
                  <Button className="gap-x-1" onClick={() => handleFeedback(1)}>
                    <HandThumbUpIcon className="w-4 h-4" />
                    有帮助
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
