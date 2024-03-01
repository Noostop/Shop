import clsx from 'clsx';
import {useState, Suspense} from 'react';
import {defer, redirect} from '@shopify/remix-oxygen';
import {Image, CacheNone} from '@shopify/hydrogen';
import {Await, useLoaderData} from '@remix-run/react';
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';

import {Link} from '~/components/Link';
import {Button} from '@/components/ui/button';
import {Pagination} from '~/components/Pagination';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [
    {title: `BLUETTI | 帮助中心`},
    {
      description: '帮助中心',
    },
  ];
};

export async function loader({request, context}) {
  const {bluetti, session} = context;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const size = searchParams.get('size');
  const params = {
    current: searchParams.get('current') || 1,
    size: size ? (size > 20 ? 20 : size) : 10,
    keyword: searchParams.get('keyword') || '',
    tagid: searchParams.get('tagid') || '',
  };

  try {
    // 导航菜单
    const sideBarMenu = await bluetti.get(
      '/supportapi/support/directoryList?id=65b084a74a9028c6b4a8e276&isTree=true',
      {
        cache: CacheNone(),
      },
    );

    // 关联问题列表
    const questionList = await bluetti.get(
      `/supportapi/supportQuestion/QuestionList?current=${params.current}&tagID=${params.tagid}&key=${params.keyword}&size=${params.size}&isTree=true&isSend=true`,
      {
        cache: CacheNone(),
      },
    );

    session.set('helpParams', params);
    return defer(
      {sideBarMenu, questionList, params},
      {
        headers: {
          'Set-Cookie': await session.commit(),
        },
      },
    );
  } catch (error) {
    throw new Response(`page not found`, {
      status: 404,
    });
  }
}

export default function Support() {
  const {sideBarMenu, questionList, params} = useLoaderData();
  const {size, current, keyword} = params;

  return (
    <section className="container min-h-screen py-8">
      {/* 搜索框 */}
      <div className="flex py-8 justify-stretch md:justify-center">
        <form className="block w-full md:w-auto" action="/$/help">
          <div className="flex items-center mb-3">
            <div className="relative flex-1 mr-3 max-sm:w-full">
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
                placeholder="Please enter the question you want to know"
                type="text"
                name="keyword"
                id="question"
                defaultValue={keyword}
              />
            </div>
            <div>
              <button
                type="submit"
                className="px-5 py-3 text-sm font-medium text-center text-white rounded-lg cursor-pointer bg-primary hover:bg-primary/80 focus:ring-4 focus:ring-primary/30 dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary/80"
              >
                Search
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
      </div>
      {/* 内容区域 */}
      <div className="grid gap-10 pt-10 mt-10 border-t border-gray-100 lg:grid-cols-12">
        {sideBarMenu.total > 0 && (
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky p-4 bg-gray-200 rounded top-14">
              <CollapsibleMenu data={sideBarMenu.records} params={params} />
            </div>
          </aside>
        )}

        <div
          className={clsx(
            sideBarMenu.total > 0 ? 'lg:col-span-9' : 'lg:col-span-12',
          )}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <Await resolve={questionList}>
              {questionList.total > 0 ? (
                <>
                  <p className="text-xs text-gray-400">
                    已找到 {questionList.total} 个结果
                  </p>
                  <div className="space-y-4 divide-y divide-gray-200">
                    {questionList.records?.map((item) => (
                      <QuestionBox item={item} key={item.id} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <img
                      className="mx-auto mb-4 rounded-lg aspect-square"
                      width={300}
                      height={300}
                      src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/404/404-computer.svg"
                      alt="404 Not Found"
                    />
                    <p>No related questions found</p>
                  </div>
                </div>
              )}
            </Await>
          </Suspense>
          {questionList.total > size && (
            <Pagination
              totalItems={Math.ceil(questionList.total / size)}
              page={Number(current)}
              params={params}
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

const CollapsibleMenu = ({data, params}) => {
  const {size, current, keyword, tagid} = params;

  const [expandedItems, setExpandedItems] = useState({
    '65d5c60cfc4e080cd0bd4c7a': true,
    '65d5c596fc4e080cd0bd4c6c': true,
    '65d5c5c4fc4e080cd0bd4c6e': true,
    '65d5c5c7fc4e080cd0bd4c70': true,
    '65d5c5f5fc4e080cd0bd4c76': true,
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
              to={
                item.url
                  ? item.url
                  : `/help?current=${current}&tagID=${item.id}&key=${keyword}&size=${size}`
              }
              className={clsx(
                'justify-between w-full text-gray-600',
                tagid == item.id ? 'font-semibold !text-black' : null,
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
              to={
                item.url
                  ? item.url
                  : `/help?current=${current}&tagID=${item.id}&key=${keyword}&size=${size}`
              }
              className={clsx(
                'justify-between w-full text-gray-600',
                tagid == item.id ? 'font-semibold !text-black' : null,
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
