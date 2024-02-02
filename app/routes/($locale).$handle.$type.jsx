import {defer, redirectDocument} from '@shopify/remix-oxygen';
import {useLoaderData, useOutletContext} from '@remix-run/react';
import {getLocaleFromRequest} from '~/lib/utils';

import {Faqs, Specs, Downloads, Videos} from '~/components/Topics';

/**
 * @type {MetaFunction}
 */
// export const meta = ({data}) => {
//   const {title, description} = data;

//   return [
//     {title: `BLUETTI | ${title}`},
//     {
//       description,
//     },
//   ];
// };

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({params, context, request}) {
  const {type} = params;
  const {session} = context;
  const {pathPrefix} = await getLocaleFromRequest({
    session,
    request,
  });

  const types = ['faqs', 'manuals', 'downloads', 'videos', 'specs'];

  const haveType = types.includes(type);

  if (!haveType) {
    return redirectDocument(`/${pathPrefix}/404`);
  }

  return defer({type});
}

export default function TopicsType() {
  const {type} = useLoaderData();
  const {commonQuestions, technicalParameters, videos, downloadFiles} =
    useOutletContext();

  return (
    <>
      {type === 'faqs' && <Faqs data={commonQuestions} />}
      {type === 'specs' && <Specs data={technicalParameters} />}
      {type === 'downloads' && <Downloads data={downloadFiles} />}
      {type === 'videos' && <Videos data={videos} />}
    </>
  );
}
