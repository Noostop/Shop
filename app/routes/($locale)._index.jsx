import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, Links} from '@remix-run/react';
import {Suspense, useState, useEffect, useCallback} from 'react';
import {Image, Money} from '@shopify/hydrogen';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import {SliderShow} from '../components/SliderShow';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  const {storefront} = context;
  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = collections.nodes[0];
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  return defer({featuredCollection, recommendedProducts});
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  return (
    <div className="flex-1">
      <SliderShow
        autoplay
        slides={[
          {
            id: '1',
            title: '2024 年新年大促销',
            titleWithImage: '',
            subtitle: '新年新气象',
            description: '所有产品均可享受高达 50% 的折扣。 限时优惠。',
            position: 'centerLeft',
            mode: 'dark',
            pcImage: {
              url: 'https://www.bluettipower.com/cdn/shop/files/CA_68400bbd-2507-4fdb-93cd-f13c9c39474b.png?v=1704518267',
              width: 5120,
              height: 1600,
              alt: '春节促销',
            },
            mobileImage: {
              url: 'https://www.bluettipower.com/cdn/shop/files/1_58768def-b985-4e78-ad85-4ab6a58c5e67.png?v=1704518287',
              width: 1200,
              height: 2150,
              alt: '春节促销',
            },
            links: [
              {
                id: '1',
                title: '立即参与',
                url: '/collections',
              },
            ],
          },
          {
            id: '2',
            title: '照亮非洲家庭，我们需要您的双手',
            description: '可靠的电力安全，应对任何紧急情况',
            position: 'topCenter',
            mode: 'dark',
            pcImage: {
              url: 'https://www.bluettipower.com/cdn/shop/files/LAAF-PC.jpg?v=1704702172',
              width: 5120,
              height: 1600,
              alt: 'spring sale',
            },
            mobileImage: {
              url: 'https://www.bluettipower.com/cdn/shop/files/s1.jpg?v=1703208532',
              width: 1200,
              height: 2150,
              alt: 'spring sale',
            },
            links: [
              {
                id: '1',
                title: '立即购买',
                url: '/collections',
              },
              {
                id: '2',
                title: '查看更多',
                url: '/collections',
              },
            ],
          },
          {
            id: '3',
            title: '创新的家庭备份解决方案',
            description: '可靠的电力安全，应对任何紧急情况',
            position: 'topLeft',
            mode: 'dark',
            pcImage: {
              url: 'https://www.bluettipower.com/cdn/shop/files/1_25a028e8-2a71-4a3c-affe-61ceae699684.webp?v=1697183665',
              width: 5120,
              height: 1600,
              alt: 'spring sale',
            },
            mobileImage: {
              url: 'https://www.bluettipower.com/cdn/shop/files/2_68778c6f-3a97-40bf-b66a-dfd0a5ae5f07.webp?v=1697183681',
              width: 1200,
              height: 2150,
              alt: 'spring sale',
            },
            links: [
              {
                id: '2',
                title: '查看更多',
                url: '/collections',
              },
            ],
          },
        ]}
      />
      <FeaturedCollection collection={data.featuredCollection} />
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

/**
 * @param {{
 *   collection: FeaturedCollectionFragment;
 * }}
 */
function FeaturedCollection({collection}) {
  if (!collection) return null;
  const image = collection?.image;

  return (
    <div>{collection.title}</div>
    // <Link
    //   className="featured-collection"
    //   to={`/collections/${collection.handle}`}
    // >
    //   {image && (
    //     <div className="featured-collection-image">
    //       <Image data={image} sizes="100vw" />
    //     </div>
    //   )}
    //   <h1>{collection.title}</h1>
    // </Link>
  );
}

/**
 * @param {{
 *   products: Promise<RecommendedProductsQuery>;
 * }}
 */
function RecommendedProducts({products}) {
  return (
    <div className="bg-white group">
      <div className="container">
        <div className="md:flex md:items-center md:justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Recommended Products
          </h2>
          <Link
            to={`/collections`}
            className="hidden text-sm font-medium text-indigo-600 hover:text-indigo-500 md:block"
          >
            Shop the collection
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={products}>
            {({products}) => (
              <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="mt-10">
                  {products.nodes.map((product) => (
                    <CarouselItem
                      key={product.id}
                      className="basis-2/3 md:basis-1/3 lg:basis-1/4"
                    >
                      <div className="relative group/item">
                        <div className="w-full overflow-hidden bg-gray-100 rounded-md aspect-square lg:group-hover/item:opacity-75">
                          <Image
                            data={product.images.nodes[0]}
                            aspectRatio="1/1"
                            sizes="(min-width: 45em) 60vw, 100vw"
                            className="object-cover object-center w-full h-full mix-blend-multiply"
                          />
                        </div>
                        <h3 className="mt-4 text-sm text-gray-700 line-clamp-2">
                          <Link
                            to={`/products/${product.handle}`}
                            prefetch="intent"
                          >
                            <span className="absolute inset-0" />
                            {product.title}
                          </Link>
                        </h3>
                        {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p> */}
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          <Money data={product.priceRange.minVariantPrice} />
                        </p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="invisible left-4 2xl:-left-10 lg:group-hover:visible" />
                <CarouselNext className="invisible right-4 2xl:-right-10 lg:group-hover:visible" />
              </Carousel>
            )}
          </Await>
        </Suspense>

        <div className="mt-8 text-sm md:hidden">
          <Link
            to={`/collections`}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Shop the collection
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 10, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
