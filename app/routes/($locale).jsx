import {defer, json, redirect} from '@shopify/remix-oxygen';
import {Outlet} from '@remix-run/react';
import {knowledgeCountry} from '~/lib/cookies.server';
import {countries} from '~/data/countries';

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({request, params, context}) {
  const {locale, handle} = params;
  const {session} = context;
  const country = await session.get('country');

  console.log(country, 'index_country///////////');

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
