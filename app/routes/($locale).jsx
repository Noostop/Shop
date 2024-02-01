import {defer, json, redirect} from '@shopify/remix-oxygen';
import {Outlet} from '@remix-run/react';
import {knowledgeCountry} from '~/lib/cookies.server';
import {countries} from '~/data/countries';
import {i18n, getLocale} from '~/lib/i18n';
import {parseUrl} from '~/lib/utils';

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({request, params, context}) {
  const {locale, handle} = params;
  const {session} = context;
  const {pathname, search} = new URL(request.url);
  const country = await session.get('i18n');

  // console.log(parseUrl(request.url), 'parseUrl(pathname)');

  const filteredEntries = Object.entries(countries).filter(
    ([key, value]) => key == locale,
  );
  const filteredObject = Object.fromEntries(filteredEntries);

  // if (country && country.pathPrefix !== 'us') {
  // if (getLocale(`/${country.pathPrefix}`)) {
  //   if (!pathname.startsWith(`/${country.pathPrefix}`)) {
  //     const strippedPathname = pathname.replace(
  //       `/${country.pathPrefix}`,
  //       `${getLocale(`/${country.pathPrefix}`)}`,
  //     );
  //     console.log(
  //       `${strippedPathname}${search}`,
  //       'filteredObject///////////',
  //     );
  //   }
  // }
  // session.set('country', selectCountry);
  // headers.append('Set-Cookie', await session.commit());
  // return redirect(`/${country.pathPrefix}${url.pathname}${url.search}`, {
  //   status: 302,
  // });
  // }

  // if (locale === 'us') {
  //   session.set('customerAccessToken', countries['us']);
  //   return redirect('/us', {
  //     headers: {
  //       'Set-Cookie': await session.commit(),
  //     },
  //   });
  // }

  // console.log(locale, handle, 'cookie+++++++++++++');

  // if (cookie.pathPrefix) {
  //   if (locale !== undefined && locale !== cookie.pathPrefix) {
  //     const filteredEntries = Object.entries(countries).filter(
  //       ([key, value]) => key == locale,
  //     );
  //     const filteredObject = Object.fromEntries(filteredEntries);

  //     if (filteredObject[locale]) {
  //       const redirectUrl = new URL(
  //         `${
  //           filteredObject[locale].pathPrefix === 'us'
  //             ? ''
  //             : filteredObject[locale].pathPrefix
  //         }`,
  //         `${filteredObject[locale].host}`,
  //       );

  //       return redirect(redirectUrl, {
  //         status: 302,
  //         headers: {
  //           'Set-Cookie': await knowledgeCountry.serialize(
  //             filteredObject[locale],
  //           ),
  //         },
  //       });
  //     } else {
  //       // console.log(filteredObject[locale], 'filteredObject');

  //       const redirectUrl = new URL(
  //         `${cookie.pathPrefix || ''}/ac180`,
  //         `${cookie.host}`,
  //       );

  //       return redirect(redirectUrl, {
  //         status: 302,
  //         headers: {
  //           'Set-Cookie': await knowledgeCountry.serialize(
  //             filteredObject[locale],
  //           ),
  //         },
  //       });
  //     }
  //   }
  // } else {
  //   const filteredEntries = Object.entries(countries).filter(
  //     ([key, value]) => key == locale,
  //   );
  //   const filteredObject = Object.fromEntries(filteredEntries);

  //   const redirectUrl = new URL(
  //     `${
  //       filteredObject[locale]?.pathPrefix === 'us'
  //         ? ''
  //         : filteredObject[locale]?.pathPrefix
  //     }`,
  //     `${filteredObject[locale]?.host}`,
  //   );

  //   return redirect(redirectUrl, {
  //     status: 302,
  //     headers: {
  //       'Set-Cookie': await knowledgeCountry.serialize(filteredObject[locale]),
  //     },
  //   });
  // }

  //   throw new Response(`${new URL(request.url).pathname} not found`, {
  //     status: 404,
  //   });

  return defer({});
}

export default function CatchAllPage() {
  return <Outlet />;
}
