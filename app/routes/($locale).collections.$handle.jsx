import {json, redirect} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {
  Pagination,
  getPaginationVariables,
  Image,
  Money,
} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/utils';
import {seoPayload} from '~/lib/seo.server';
import {Link} from '~/components/Link';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [{title: `BLUETTI | ${data?.collection.title ?? ''} Collection`}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({request, params, context}) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    return redirect('/collections');
  }

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {handle, ...paginationVariables},
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  const seo = seoPayload.collection({collection, url: request.url});

  return json({collection, seo});
}

export default function Collection() {
  /** @type {LoaderReturnData} */
  const {collection} = useLoaderData();

  return (
    <div className="h-full bg-white">
      <div className="py-24 bg-white sm:py-32">
        <div className="container">
          <p className="text-base font-semibold leading-7 text-indigo-600">
            Get the help you need
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            {collection.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {collection.description}
          </p>
        </div>
      </div>

      <div className="container overflow-hidden">
        <Pagination connection={collection.products}>
          {({nodes, isLoading, PreviousLink, NextLink}) => (
            <>
              <PreviousLink>
                {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
              </PreviousLink>
              <ProductsGrid products={nodes} />
              <br />
              <NextLink>
                {isLoading ? 'Loading...' : <span>Load more ↓</span>}
              </NextLink>
            </>
          )}
        </Pagination>
      </div>
    </div>
  );
}

/**
 * @param {{products: ProductItemFragment[]}}
 */
function ProductsGrid({products}) {
  return (
    <div className="grid grid-cols-2 -mx-px border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductItem
          key={product.id}
          product={product}
          loading={index < 8 ? 'eager' : undefined}
        />
      ))}
    </div>
  );
}

/**
 * @param {{
 *   product: ProductItemFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
function ProductItem({product, loading}) {
  const variant = product.variants.nodes[0];
  // const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);

  return (
    <div
      key={product.id}
      className="relative p-4 border-b border-r border-gray-200 group sm:p-6"
    >
      <div className="overflow-hidden bg-gray-100 rounded-lg aspect-h-1 aspect-w-1 group-hover:opacity-75">
        {product.featuredImage && (
          <Image
            alt={product.featuredImage.altText || product.title}
            aspectRatio="1/1"
            data={product.featuredImage}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
            className="object-cover object-center w-full h-full mix-blend-multiply"
          />
        )}
      </div>
      <div className="pt-10 pb-4 text-center">
        <h3 className="text-sm font-medium text-gray-900">
          <Link prefetch="intent" to={`/products/${product.handle}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.title}
          </Link>
        </h3>
        {/* <div className="flex flex-col items-center mt-3">
          <p className="sr-only">{product.rating} out of 5 stars</p>

          <p className="mt-1 text-sm text-gray-500">
            {product.reviewCount} reviews
          </p>
        </div> */}
        <p className="mt-4 text-base font-medium text-gray-900">
          <Money data={product.priceRange.minVariantPrice} />
        </p>
      </div>
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      nodes {
        selectedOptions {
          name
          value
        }
      }
    }
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
