import {defer} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Link} from '~/components/Link';
import {getLocaleFromRequest} from '~/lib/utils';

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({request, context}) {
  const {session} = context;
  const {pathPrefix} = await getLocaleFromRequest({
    session,
    request,
  });

  return defer({pathPrefix});
}

export default function NotFond() {
  const data = useLoaderData();
  const [times, setTimes] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimes((times) => times - 1);
      if (times <= 1) {
        window.location.href = `/${data.pathPrefix}`;
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [times, data.pathPrefix]);

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-16 lg:px-6">
        <div className="max-w-screen-sm mx-auto text-center">
          <img
            className="mx-auto mb-4 aspect-square"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/404/404-computer.svg"
            alt="404 Not Found"
          />
          <h1 className="mb-4 text-2xl font-extrabold text-primary-600 dark:text-primary-500">
            404
          </h1>
          <p className="mb-10 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
            抱歉，找不到该页面。
          </p>
          <p className="mb-4 text-gray-500 dark:text-gray-400">
            点击下方返回BLUETTI官网。 我们将在{' '}
            <span className="font-medium text-orange-500">{times}</span>{' '}
            秒后自动重定向。
          </p>
          <ul className="flex items-center justify-center space-x-4 text-gray-500 dark:text-gray-400">
            <li>
              <Button asChild>
                <Link to="/">BLUETTI 官网</Link>
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
