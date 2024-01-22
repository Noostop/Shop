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

  if (!id) {
    throw new Response(`${new URL(request.url).pathname} not found`, {
      status: 404,
    });
  }

  const questionContent = await bluetti.get(
    `/supportapi/supportQuestion/Question/${id}?current=&size=&shopName=bluettipower&id=&directoryType=&language=en&isTree=true&country=US`,
  );

  return defer({questionContent});
}

export default function Support() {
  const {questionContent} = useLoaderData();

  return (
    <section className="container py-8">
      <h1 className="text-2xl font-semibold">{questionContent.name}</h1>
      <div
        dangerouslySetInnerHTML={{__html: questionContent.answer}}
        className="mt-4 prose"
      />
    </section>
  );
}
