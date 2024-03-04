import {useNonce, Seo} from '@shopify/hydrogen';
import {defer} from '@shopify/remix-oxygen';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  LiveReload,
  useLoaderData,
  ScrollRestoration,
} from '@remix-run/react';

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context, params}) {
  const {locale} = params;
  const {session, storefront} = context;
  const {pathPrefix} = storefront.i18n;

  // 校验语言路径
  if (locale && !pathPrefix.includes(locale.toLowerCase())) {
    throw new Response(`Page not found`, {
      status: 404,
    });
  }

  const [customerAccessToken, layout] = await Promise.all([
    session.get('customerAccessToken'),
  ]);

  const publicStoreDomain = context.env.PUBLIC_STORE_DOMAIN;

  return defer(
    {
      // seo,
      ...layout,
      publicStoreDomain,
      selectedLocale: storefront.i18n,
    },
    {
      headers: {
        // ...headers,
        // 'Set-Cookie': await session.commit(),
      },
    },
  );
}

export default function Auth() {
  const nonce = useNonce();
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  const locale = data.selectedLocale;

  return (
    <html
      lang={locale.language}
      className="h-full text-base antialiased bg-neutral-950"
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Seo />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />

        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}
