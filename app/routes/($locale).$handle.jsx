/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({params, request}) {
  console.log(params, 'params');

  // throw new Response(`${new URL(request.url).pathname} not found`, {
  //   status: 404,
  // });
}

export default function CatchAllPage() {
  return null;
}
