import {defer, redirect} from '@shopify/remix-oxygen';
import {Image} from '@shopify/hydrogen';
import {Await, useLoaderData} from '@remix-run/react';
import {MagnifyingGlassIcon} from '@heroicons/react/24/outline';
import {Link} from '~/components/Link';

export async function loader({params, context}) {
  const {locale, handle} = params;
  const {bluetti} = context;
  const support = await bluetti.get(
    '/supportapi/support/directoryList?current=&size=&shopName=bluettipower&id=&directoryType=&language=en&isTree=true&country=US',
  );

  return defer({support});
}

export default function Support() {
  const {support} = useLoaderData();

  console.log(support, 'support');

  return (
    <>
      <section className="py-8 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="grid py-8 mx-auto lg:gap-12 xl:gap-8 lg:py-16 lg:grid-cols-12">
            <div className="text-center lg:text-left max-sm:w-full lg:col-span-7 xl:col-span-6">
              <h1 className="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-white">
                服务与支持
              </h1>
              <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                欢迎使用 BLUETTI 创新服务与支持
              </p>
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
            </div>
            <div className="hidden lg:mt-0 lg:col-span-5 xl:col-span-6 lg:flex">
              <Image
                className="object-cover w-full h-full overflow-hidden bg-gray-100 rounded mix-blend-multiply"
                data={{
                  url: 'https://cdn.shopifycdn.net/s/files/1/0536/3390/8911/files/support-contact-1.png?v=1672038801',
                  alt: '服务与支持',
                  width: 1200,
                  height: 500,
                }}
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              />
            </div>
          </div>
        </div>
      </section>
      <div className="container pt-8">
        <div className="h-screen bg-pink-500"></div>
        <div className="h-screen bg-pink-500"></div>
      </div>
    </>
  );
}
