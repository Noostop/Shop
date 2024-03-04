import {useNonce} from '@shopify/hydrogen';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  LiveReload,
  useMatches,
  useRouteError,
  ScrollRestoration,
  isRouteErrorResponse,
} from '@remix-run/react';
import favicon from '../public/favicon.svg';
import {Link} from '~/components/Link';
import {Button} from '@/components/ui/button';

import tailwindStyles from '~/styles/tailwind.css';

/**
 * 这对于避免在子导航上重新获取根查询非常重要
 * @type {ShouldRevalidateFunction}
 */
export const shouldRevalidate = ({formMethod, currentUrl, nextUrl}) => {
  // 执行突变时重新验证，例如添加到购物车、登录...
  if (formMethod && formMethod !== 'GET') {
    return true;
  }

  // 通过 useRevalidator 手动重新验证时重新验证
  if (currentUrl.toString() === nextUrl.toString()) {
    return true;
  }

  return false;
};

export function links() {
  return [
    {rel: 'stylesheet', href: tailwindStyles},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

/**
 * @return {LoaderReturnData}
 */
export const useRootLoaderData = () => {
  const [root] = useMatches();
  return root?.data;
};

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const rootData = useRootLoaderData();
  const locale = rootData?.selectedLocale;
  const nonce = useNonce();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <html lang={locale?.language} className="antialiased bg-neutral-950">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {/* <Layout {...rootData}> */}
        <section className="flex items-center justify-center h-screen">
          <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-16 lg:px-6">
            <div className="max-w-screen-sm mx-auto text-center">
              <h1 className="mb-4 font-extrabold tracking-tight text-gray-600 text-7xl lg:text-9xl">
                {errorStatus}
              </h1>
              <p className="mb-4 text-3xl font-bold tracking-tight text-gray-600 md:text-4xl">
                Something&apos;s missing.
              </p>
              <div className="mb-4 prose text-red-600">
                <code>{errorMessage}</code>
              </div>
              <Button asChild variant="destructive" className="mt-8">
                <Link to="/">Back to Homepage</Link>
              </Button>
            </div>
          </div>
        </section>
        {/* </Layout> */}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}
