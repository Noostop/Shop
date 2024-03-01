import {defer} from '@shopify/remix-oxygen';
import {useLoaderData, useOutletContext} from '@remix-run/react';
import {Faqs, Specs, Downloads, Videos} from '~/components/Topics';

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({params}) {
  const {type} = params;
  const types = ['faqs', 'manuals', 'downloads', 'videos', 'specs'];
  const haveType = types.includes(type);

  if (!haveType) {
    throw new Response(`Page not found`, {
      status: 404,
    });
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
