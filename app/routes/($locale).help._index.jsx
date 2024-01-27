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

export async function loader({params, request, context}) {
  const {locale, handle} = params;
  const {bluetti} = context;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const searchTerm = String(searchParams.get('id') || '');

  const questionList = await bluetti.get(
    '/supportapi/supportQuestion/QuestionList?current=&size=&shopName=bluettipower-develop&language=en&isTree=true&country=US',
  );

  return defer({questionList});
}

export default function Support() {
  const {questionList} = useLoaderData();

  return (
    <section>
      <div className="space-y-4 divide-y divide-gray-200">
        {questionList.records.map((item) => (
          <QuestionBox item={item} key={item.id} className="odd:bg-gray-100" />
        ))}
      </div>
    </section>
  );
}

const QuestionBox = ({item, className}) => {
  return (
    <Link
      className={clsx(
        'flex flex-col gap-2 p-4 py-4 transition-colors rounded md:hover:bg-gray-100',
        className,
      )}
      to={`/help/${item.id}`}
    >
      <h3
        className="text-lg font-semibold"
        dangerouslySetInnerHTML={{__html: item.name}}
      />
      <div
        className="text-gray-600 line-clamp-2"
        dangerouslySetInnerHTML={{__html: item.questionDetail}}
      />
      <div className="text-sm text-gray-500">适用产品： DJI Mini 3 Pro</div>
    </Link>
  );
};
