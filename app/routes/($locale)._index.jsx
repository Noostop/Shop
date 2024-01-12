import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, Links} from '@remix-run/react';
import {Suspense, useState, useEffect} from 'react';
import {Image, Money} from '@shopify/hydrogen';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {Button} from '@/components/ui/button';
import Autoplay from 'embla-carousel-autoplay';
import clsx from 'clsx';
import {motion, stagger} from 'framer-motion';

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
    <div className="home">
      <SliderShow
        slides={[
          {
            id: '1',
            title: 'New Year Sale 2024',
            description: 'up to 50% off on all products. Limited time offer.',
            position: 'centerLeft',
            mode: 'dark',
            pcImage: {
              url: 'https://www.bluettipower.com/cdn/shop/files/CA_68400bbd-2507-4fdb-93cd-f13c9c39474b.png?v=1704518267',
              width: 5120,
              height: 1600,
              alt: 'spring sale',
            },
            mobileImage: {
              url: 'https://www.bluettipower.com/cdn/shop/files/1_58768def-b985-4e78-ad85-4ab6a58c5e67.png?v=1704518287',
              width: 1200,
              height: 2150,
              alt: 'spring sale',
            },
            links: [
              {
                id: '1',
                title: 'Shop Now',
                url: '/collections',
              },
              {
                id: '2',
                title: 'Learn More',
                url: '/collections',
              },
            ],
          },
          {
            id: '2',
            title: 'Lighting An African Family We Need Your Hands',
            description: 'Reliable Power Security to Get Through Any Emergency',
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
                title: 'Shop Now',
                url: '/collections',
              },
              {
                id: '2',
                title: 'Learn More',
                url: '/collections',
              },
            ],
          },
          {
            id: '3',
            title: 'INNOVATIVE HOME BACKUP SOLUTION',
            description: 'Reliable Power Security to Get Through Any Emergency',
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
          },
        ]}
      />
      <FeaturedCollection collection={data.featuredCollection} />
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

function SliderShow({slides = []}) {
  const contentPosition = {
    topLeft: {
      container: 'text-center md:text-left',
      content: 'pt-20',
    },
    topCenter: {
      container: 'text-center flex justify-center',
      content: 'pt-20',
    },
    topRight: {
      container: 'flex justify-center md:justify-end text-center md:text-right',
      content: 'pt-20',
    },
    centerTop: {
      container: 'flex justify-center text-center items-start',
      content: 'pt-20',
    },
    centerLeft: {
      container:
        'flex justify-center text-center md:text-left md:items-center md:justify-start',
      content: 'pt-20 md:pt-0',
    },
    centerCenter: {
      container: 'flex justify-center text-center md:items-center',
      content: 'pt-20 md:pt-0',
    },
    centerRight: {
      container:
        'flex justify-center md:justify-end text-center md:text-right md:items-center',
      content: 'pt-20 md:pt-0',
    },
    bottomLeft: {
      container:
        'flex justify-center md:justify-start text-center md:text-left md:items-end',
      content: 'pt-20 md:pt-0 pb-20',
    },
    bottomCenter: {
      container: 'flex justify-center text-center md:items-end',
      content: 'pb-20 pt-20 md:pt-0',
    },
    bottomRight: {
      container:
        'flex justify-center md:justify-end text-center md:text-right md:items-end',
      content: 'pb-20 pt-20 md:pt-0',
    },
  };

  const contentStyle = {
    light: 'text-black',
    dark: 'text-white',
  };

  const [api, setApi] = useState();

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on('select', () => {});
  }, [api]);

  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      plugins={
        [
          // Autoplay({
          //   delay: 3000,
          //   stopOnMouseEnter: true,
          //   stopOnInteraction: false,
          // }),
        ]
      }
      setApi={setApi}
      className="w-full group/content"
    >
      <CarouselContent className="h-[75vh] md:h-[60vh] lg:h-[66vh] -ml-0">
        {slides.map(
          ({
            id,
            title,
            description,
            pcImage,
            mobileImage,
            links,
            position = 'centerCenter',
            mode = 'light',
          }) => (
            <CarouselItem key={id} className="relative w-full h-full pl-0">
              <motion.div
                className="h-full bg-gray-300"
                initial={{opacity: 0, scale: 1.04}}
                whileInView={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.8}}
              >
                {pcImage && (
                  <Image
                    data={pcImage}
                    sizes="100vw"
                    className="hidden object-cover w-full h-full md:block"
                  />
                )}
                {mobileImage && (
                  <Image
                    data={mobileImage}
                    sizes="100vw"
                    className="object-cover w-full h-full md:hidden"
                  />
                )}
              </motion.div>
              <div className="absolute inset-0 bg-input/5">
                <motion.div
                  className={clsx(
                    'container h-full',
                    contentStyle[mode],
                    contentPosition[position]?.container,
                  )}
                >
                  <motion.div
                    className={clsx(
                      'space-y-4 w-full md:w-3/4 lg:w-1/2',
                      contentPosition[position]?.content,
                    )}
                    initial={{opacity: 0, y: -100, scale: 0.8}}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                  >
                    <motion.h2 className="text-3xl font-semibold md:text-4xl 2xl:text-5xl">
                      {title}
                    </motion.h2>
                    {description && (
                      <motion.p
                        className={clsx(
                          'text-sm md:text-base',
                          (position != 'centerLeft' || position != 'topLeft') ??
                            'px-6',
                        )}
                      >
                        {description}
                      </motion.p>
                    )}
                    <motion.div className="space-x-2">
                      {links?.map(({id, title, url}) => (
                        <Button
                          key={id}
                          className={clsx(
                            'capitalize bg-input/5 rounded-full',
                            mode == 'dark'
                              ? 'text-white'
                              : 'text-black border-black hover:border-input',
                          )}
                          variant="outline"
                          asChild
                        >
                          <Link to={url}>{title}</Link>
                        </Button>
                      ))}
                      {/* <Button
                        className={clsx(
                          'capitalize bg-input/5 rounded-full',
                          mode == 'dark'
                            ? 'text-white'
                            : 'text-black border-black hover:border-input',
                        )}
                        variant="outline"
                        asChild
                      >
                        <Link to="/collections">Buy Now</Link>
                      </Button> */}
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </CarouselItem>
          ),
        )}
      </CarouselContent>
      <CarouselPrevious className="lg:invisible left-4 lg:group-hover/content:visible" />
      <CarouselNext className="lg:invisible right-4 lg:group-hover/content:visible" />
    </Carousel>
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
                        <div className="w-full overflow-hidden bg-gray-100 rounded-md aspect-square group-hover/item:opacity-75">
                          <Image
                            data={product.images.nodes[0]}
                            aspectRatio="1/1"
                            sizes="(min-width: 45em) 20vw, 50vw"
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
                <CarouselPrevious className="left-4 2xl:-left-10 lg:invisible lg:group-hover:visible" />
                <CarouselNext className="right-4 2xl:-right-10 lg:invisible lg:group-hover:visible" />
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
