import clsx from 'clsx';
import {Fragment, useState} from 'react';
import {defer, redirect} from '@shopify/remix-oxygen';
import {Image} from '@shopify/hydrogen';
import {Await, Outlet, useLoaderData} from '@remix-run/react';
import {HeaddingWithEyebrow} from '~/components/Headding';
import {Link} from '~/components/Link';
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

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export async function loader({params, request, context}) {
  const {locale, id} = params;
  const {bluetti} = context;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const searchTerm = String(searchParams.get('id') || '');

  console.log(searchTerm, 'searchTerm');

  const support = await bluetti.get(
    '/supportapi/support/directoryList?current=1&size=20&shopName=bluettipower&id=&directoryType=&language=en&isTree=true&country=US',
  );

  return defer({support});
}

// TODO: 搜索事件
export default function Support() {
  const {support} = useLoaderData();
  const records = support.records.find(
    (item) => item.id === '65864e8555b57154dcd3db90',
  );

  const handleItemClick = (item) => {
    console.log(item);
    // 在这里可以执行其他点击事件的逻辑
  };

  return (
    <section className="container py-8">
      <section className="flex py-8 justify-cente">
        <form action="/help" className="">
          <div className="flex items-center mb-3">
            <div className="relative mr-3 max-sm:w-full">
              <label
                htmlFor="member_question"
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
                name="member[q]"
                id="member_question"
                required=""
              />
            </div>
            <div>
              <input
                type="submit"
                value="查询"
                className="px-5 py-3 text-sm font-medium text-center text-white rounded-lg cursor-pointer bg-primary hover:bg-primary/80 focus:ring-4 focus:ring-primary/30 dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary/80"
                name="member_submit"
                id="member_submit"
              />
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
        <AsideMenu
          items={records?.children}
          onItemClick={handleItemClick}
          defaultValu={[
            '6586c50555b57154dcd3dbae',
            '65ae1f54dfdfd80771ff54b3',
            '65ae158fdfdfd80771ff545d',
            '65ae157ddfdfd80771ff545b',
            '65ae15d5dfdfd80771ff5461',
          ]}
        />

        <div className="lg:col-span-9">
          <Outlet />
        </div>
      </div>
    </section>
  );
}

const MenuItem = ({item, onItemClick}) => {
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <AccordionItem value={item.id}>
        <AccordionTrigger className="px-2 py-2 rounded hover:no-underline hover:text-parimary hover:bg-gray-100">
          {item.name}
        </AccordionTrigger>

        {/* 递归渲染子菜单 */}
        {hasChildren && (
          <AccordionContent className="pb-0 pl-2">
            <Menu menuData={item.children} onItemClick={onItemClick} />
          </AccordionContent>
        )}
      </AccordionItem>
    );
  }

  return (
    <AccordionItem value={item.id} className={clsx(hasChildren && 'pl-4')}>
      <AccordionTrigger className="py-2 hover:no-underline !hover:text-parimary [&>svg]:hidden hover:bg-gray-100 rounded px-2">
        {item.name}
      </AccordionTrigger>
    </AccordionItem>
  );
};

const Menu = ({menuData, defaultValu, onItemClick}) => {
  return (
    <Accordion
      type="multiple"
      collapsible={menuData.id}
      className="w-full space-y-2"
      defaultValue={defaultValu}
      onValueChange={onItemClick}
    >
      {menuData?.map((menuItem) => (
        <MenuItem key={menuItem.id} item={menuItem} onItemClick={onItemClick} />
      ))}
    </Accordion>
  );
};

const AsideMenu = ({items, onItemClick, defaultValu}) => {
  return (
    <aside className="hidden lg:block lg:col-span-3">
      <div className="p-4 bg-gray-200 rounded">
        <Menu
          menuData={items}
          onItemClick={onItemClick}
          defaultValu={defaultValu}
        />
      </div>
    </aside>
  );
};
