import {useLoaderData, Link} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import {Pagination, getPaginationVariables, Image} from '@shopify/hydrogen';

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context, request}) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: paginationVariables,
  });

  return json({collections});
}

export default function Collections() {
  /** @type {LoaderReturnData} */
  const {collections} = useLoaderData();

  return (
    <div className="container py-16 sm:py-24">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        Collections
      </h1>
      <Pagination connection={collections}>
        {({nodes, isLoading, PreviousLink, NextLink}) => (
          <div>
            <PreviousLink>
              {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
            </PreviousLink>
            <CollectionsGrid collections={nodes} />
            <div className="mt-4">
              <NextLink>
                {isLoading ? 'Loading...' : <span>Load more ↓</span>}
              </NextLink>
            </div>
          </div>
        )}
      </Pagination>
    </div>
  );
}

/**
 * @param {{collections: CollectionFragment[]}}
 */
function CollectionsGrid({collections}) {
  return (
    <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {collections.map((collection, index) => (
        <CollectionItem
          key={collection.id}
          collection={collection}
          index={index}
        />
      ))}
    </div>
  );
}

/**
 * @param {{
 *   collection: CollectionFragment;
 *   index: number;
 * }}
 */
function CollectionItem({collection, index}) {
  return (
    <Link
      className="relative group"
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
    >
      <div className="w-full overflow-hidden bg-gray-200 rounded-md aspect-h-1 aspect-w-1 isolate lg:aspect-none group-hover:opacity-75">
        {collection?.image && (
          <Image
            className="object-cover object-center w-full h-full lg:h-full lg:w-full mix-blend-multiply"
            alt={collection.image.altText || collection.title}
            aspectRatio="1/1"
            data={collection.image}
            loading={index < 3 ? 'eager' : undefined}
          />
        )}
      </div>
      <h5 className="mt-2 text-sm text-gray-700 line-clamp-2">
        {collection.title}
      </h5>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('storefrontapi.generated').CollectionFragment} CollectionFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
