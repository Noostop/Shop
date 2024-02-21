import clsx from 'clsx';
import {Fragment, useState, Suspense} from 'react';
import {defer, redirect} from '@shopify/remix-oxygen';
import {Image, CacheNone} from '@shopify/hydrogen';
import {Await, Outlet, useLoaderData} from '@remix-run/react';
import {HeaddingWithEyebrow} from '~/components/Headding';
import {Link} from '~/components/Link';
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import {Button} from '@/components/ui/button';
import {Pagination} from '~/components/Pagination';

export async function loader({params, request, context}) {
  const {bluetti} = context;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const paramsConfig = {
    current: searchParams.get('current') || 1,
    size: searchParams.get('size') || 10,
    keyword: searchParams.get('keyword') || '',
    tagid: searchParams.get('tagid') || '',
  };

  const support = await bluetti.get(
    '/supportapi/support/directoryList?current=1&size=20&shopName=bluettipower&id=&directoryType=&language=en&isTree=true&country=US',
    {
      cache: CacheNone(),
    },
  );

  const questionList = await bluetti.get(
    `/supportapi/supportQuestion/QuestionList?current=${paramsConfig.current}&tagID=${paramsConfig.tagid}&key=${paramsConfig.keyword}&size=${paramsConfig.size}&shopName=&isTree=true&isSend=true`,
    {
      cache: CacheNone(),
    },
  );

  return defer({support, questionList, paramsConfig});
}

// TODO: 搜索事件
export default function Support() {
  const {support, questionList, paramsConfig} = useLoaderData();
  const records = support.records.find(
    (item) => item.id === '65864e8555b57154dcd3db90',
  );
  const {size, current, keyword, tagid} = paramsConfig;

  return (
    <section className="container py-8">
      <section className="flex justify-center py-8">
        <form action="/$/help">
          <div className="flex items-center mb-3">
            <div className="relative mr-3 max-sm:w-full">
              <label
                htmlFor="question"
                className="hidden mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                question
              </label>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg md:w-96 bg-gray-50 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                placeholder="请输入您想了解的问题"
                type="text"
                name="keyword"
                id="question"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="px-5 py-3 text-sm font-medium text-center text-white rounded-lg cursor-pointer bg-primary hover:bg-primary/80 focus:ring-4 focus:ring-primary/30 dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary/80"
              >
                查询
              </button>
            </div>
          </div>
          <div className="space-x-2 text-sm text-center text-gray-500 lg:text-left dark:text-gray-300">
            <Link
              to="/"
              className="text-primary hover:underline dark:text-primary"
            >
              全球储能合集
            </Link>
            <Link
              to="/"
              className="text-primary hover:underline dark:text-primary"
            >
              购买配件
            </Link>
            <Link
              to="/"
              className="text-primary hover:underline dark:text-primary"
            >
              设备信息查询
            </Link>
          </div>
        </form>
      </section>
      <div className="grid gap-10 pt-10 mt-10 border-t border-gray-100 lg:grid-cols-12">
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky p-4 bg-gray-200 rounded top-14">
            <CollapsibleMenu data={records?.children} tagid={tagid} />
          </div>
        </aside>

        <div className="lg:col-span-9">
          <p className="text-xs text-gray-400">
            已找到 {questionList.total} 个结果
          </p>

          <Suspense fallback={<div>Loading...</div>}>
            <Await resolve={questionList}>
              <div className="space-y-4 divide-y divide-gray-200">
                {questionList.records?.map((item) => (
                  <QuestionBox item={item} key={item.id} />
                ))}
              </div>
            </Await>
          </Suspense>
          {questionList.total > size && (
            <Pagination
              totalItems={Math.ceil(questionList.total / size)}
              page={Number(current)}
            />
          )}
        </div>
      </div>
    </section>
  );
}

const QuestionBox = ({item, className}) => {
  return (
    <Link
      className={clsx('flex flex-col gap-2 py-4 group', className)}
      to={`/help/content?id=${item.id}`}
      reloadDocument
    >
      <h3
        className="text-lg font-semibold transition-colors group-hover:text-primary"
        dangerouslySetInnerHTML={{__html: item.name}}
      />
      <div
        className="text-gray-600 line-clamp-2"
        dangerouslySetInnerHTML={{__html: item.questionDetail}}
      />
      <div className="text-sm text-gray-500">适用产品： BLUETTI EB3A</div>
    </Link>
  );
};

const CollapsibleMenu = ({data, tagid}) => {
  const [expandedItems, setExpandedItems] = useState({
    '65ae157ddfdfd80771ff545b': true,
    '65ae158fdfdfd80771ff545d': true,
    '65ae15c0dfdfd80771ff545f': true,
    '65ae1971dfdfd80771ff54ab': true,
    '65ae15d5dfdfd80771ff5461': true,
  });

  const toggleItem = (itemId) => {
    setExpandedItems((prevState) => ({
      ...prevState,
      [itemId]: !prevState[itemId],
    }));
  };

  const renderMenuItem = (item) => {
    const isExpanded = expandedItems[item.id];

    return (
      <div className="space-y-2" key={item.id}>
        {item.children && item.children.length > 0 ? (
          <Button variant="ghost" onClick={() => toggleItem(item.id)} asChild>
            <Link
              to={item.url ? item.url : `/help?tagid=${item.id}`}
              className={clsx(
                'justify-between w-full text-gray-600',
                tagid == item.id ? 'font-semibold text-black' : null,
              )}
            >
              <span>{item.name}</span>
              <ChevronDownIcon
                className={clsx(
                  'w-4 h-4 transition-all',
                  isExpanded ? 'rotate-0' : 'rotate-90',
                )}
              />
            </Link>
          </Button>
        ) : (
          <Button variant="ghost" asChild>
            <Link
              to={item.url ? item.url : `/help?tagid=${item.id}`}
              className={clsx(
                'justify-between w-full text-gray-600',
                tagid == item.id ? 'font-semibold text-black' : null,
              )}
            >
              <span>{item.name}</span>
            </Link>
          </Button>
        )}
        {isExpanded && item.children && item.children.length > 0 && (
          <div className="space-y-2" style={{marginLeft: 10}}>
            {item.children.map((child) => renderMenuItem(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">{data.map((item) => renderMenuItem(item))}</div>
  );
};
