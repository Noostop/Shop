import clsx from 'clsx';
import {Fragment, useState, useEffect} from 'react';
import {defer, redirectDocument} from '@shopify/remix-oxygen';
import {Image} from '@shopify/hydrogen';
import {Await, Outlet, useLoaderData} from '@remix-run/react';
import {HeaddingWithEyebrow} from '~/components/Headding';
import {Link} from '~/components/Link';
import * as cheerio from 'cheerio';
import {getLocaleFromRequest} from '~/lib/utils';

import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';

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

export async function loader({request, context}) {
  const {bluetti, session} = context;
  const {pathPrefix} = await getLocaleFromRequest({
    session,
    request,
  });
  const id = new URL(request.url).searchParams.get('id') || '';

  if (!id) {
    // throw new Response(`${new URL(request.url).pathname} not found`, {
    //   status: 404,
    // });
    return redirectDocument(`/${pathPrefix}/help`);
  }

  const questionContent = await bluetti.get(
    `/supportapi/supportQuestion/Question/${id}`,
  );

  return defer({questionContent});
}

export default function Support() {
  const {questionContent} = useLoaderData();
  const [preHtml, setPreHtml] = useState();
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    // 解析HTML并获取标题
    const {headings, html} = extractHeadingsFromHTML(questionContent.answer);
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

  return (
    <section className="container py-8">
      <div className="relative grid grid-cols-7">
        <div className="order-2 col-span-2 py-4 ml-8 rounded">
          <div className="sticky top-16 md:top-24">
            <h3 className="font-medium text-gray-600">目录</h3>
            <ul className="mt-2 space-y-2 border-l-2 border-gray-100">
              {headings.map((heading) => (
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

        <div className="order-1 col-span-5">
          <h1 className="text-2xl font-semibold">{questionContent.name}</h1>
          <div
            id="answerContent"
            dangerouslySetInnerHTML={{
              __html: preHtml,
            }}
            className="mt-4 prose prose-lg prose-video:aspect-video prose-video:w-full prose-video:rounded prose-img:rounded prose-a:text-primary prose-a:hover:text-primary/80 max-w-none"
          />
        </div>
      </div>
    </section>
  );
}
