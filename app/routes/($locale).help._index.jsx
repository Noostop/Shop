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

  console.log(searchTerm, 'searchTerm');

  const questionList = await bluetti.get(
    '/supportapi/supportQuestion/QuestionList?current=&size=&shopName=bluettipower&id=&directoryType=&language=en&isTree=true&country=US',
  );

  return defer({questionList});
}

export default function Support() {
  const {questionList} = useLoaderData();

  console.log(questionList, 'questionList');

  return (
    <section>
      <ul className="space-y-4 divide-y divide-gray-200">
        {questionList.records.map((item) => (
          <li key={item.id}>
            <QuestionBox item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

const QuestionBox = ({item}) => {
  return (
    <Link
      className="flex flex-col gap-2 p-4 py-4 transition-colors rounded hover:bg-gray-100"
      to={`/help/${item.id}`}
    >
      <h3
        className="text-lg font-semibold"
        dangerouslySetInnerHTML={{__html: item.questionDetail}}
      />
      <div
        className="text-gray-600 line-clamp-2"
        dangerouslySetInnerHTML={{__html: item.answer}}
      />
      <div className="text-sm text-gray-500">适用产品： DJI Mini 3 Pro</div>
    </Link>
  );
};
