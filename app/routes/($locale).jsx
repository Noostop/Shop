import {Await, useLoaderData, Outlet} from '@remix-run/react';
/**
 * @param {LoaderFunctionArgs}
 */
// export async function loader({request, params}) {
//   throw new Response(`${new URL(request.url).pathname} not found`, {
//     status: 404,
//   });
// }

export default function CatchAllPage() {
  return <Outlet />;
}