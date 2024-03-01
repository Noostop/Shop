import {useI18n} from 'remix-i18n';
import {useState, useEffect} from 'react';
import {useMatches} from '@remix-run/react';
import {Button} from '@/components/ui/button';
import {Link} from '~/components/Link';

export default function NotFond() {
  const [root] = useMatches();
  const {t} = useI18n();
  const [times, setTimes] = useState(10);
  const rootData = root?.data;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimes((times) => times - 1);
      if (times <= 1) {
        window.location.href = `${rootData.selectedLocale.pathPrefix}`;
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [times]);

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-16 lg:px-6">
        <div className="max-w-screen-sm mx-auto text-center">
          <img
            className="mx-auto mb-4 bg-gray-100 rounded-lg aspect-square"
            width={600}
            height={600}
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/404/404-computer.svg"
            alt="404 Not Found"
          />
          <h1 className="mb-4 text-2xl font-extrabold text-primary-600 dark:text-primary-500">
            {t('templates.404.subtext')}
          </h1>
          <p className="mb-10 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
            {t('templates.404.title')}
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
