import {defer, redirect} from '@shopify/remix-oxygen';
import {Await, useLoaderData} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import {SliderShow} from '../components/SliderShow';
import {FeaturedCardContent} from '../components/FeaturedCard';
import {Testimonials} from '../components/Testimonials';
import {Link} from '../components/Link';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'BLUETTI | Home'}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({request, params, context}) {
  const {storefront} = context;
  const {language, country} = storefront.i18n;

  // console.log(language, country, 'params');

  const {locale, handle} = params;

  console.log(locale, handle, ' -- +++++ 1');

  // if (
  //   params.locale &&
  //   params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  // ) {
  //   // 如果定义了语言环境 URL 参数，但我们仍然使用“EN-US”
  //   // locale参数必须无效，发送到404页面
  //   throw new Response(null, {status: 404});
  // }

  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = collections.nodes[0];
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  return defer({featuredCollection, recommendedProducts});
}

export default function Home() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();

  return (
    <section className="flex flex-col flex-1 gap-y-2 md:gap-y-4">
      <SliderShow
        // autoplay
        slides={[
          {
            id: '1534543543',
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
                id: '112331231',
                title: '立即参与',
                url: '/collections',
              },
            ],
          },
          {
            id: '253426346345',
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
                id: '1423423',
                title: '立即购买',
                url: '/collections',
              },
              {
                id: '2313131',
                title: '查看更多',
                url: '/collections',
              },
            ],
          },
          {
            id: '384567345634',
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
                id: '254634524',
                title: '查看更多',
                url: '/collections',
              },
            ],
          },
        ]}
      />
      <FeaturedCardContent
        items={[
          {
            id: '1243546454353',
            title: '便携式发电站',
            description: '适合公路、露营和移动生活',
            image: {
              url: 'https://www.bluettipower.com/cdn/shop/files/eb3a_2512x1392_527-1_2ac5e2aa-4721-42c9-a8c9-42a6e6814679.webp?v=1653648453',
              width: 2512,
              height: 1392,
              alt: '便携式发电站',
            },
            links: [
              {
                id: '15673454',
                title: '了解更多',
                url: '/collections',
              },
              {
                id: '2754623',
                title: '立即购买',
                url: '/collections',
              },
            ],
          },
          {
            id: '27453562',
            title: '5000W 移动电源',
            description: '为停电做好准备',
            image: {
              url: 'https://www.bluettipower.com/cdn/shop/files/AC500_B300S_2512x1392_3c58c6d6-5e1c-4f13-9f9d-0009acb4b00a.jpg?v=1688971661',
              width: 2512,
              height: 1392,
              alt: '5000W 移动电源',
            },
            links: [
              {
                id: '17453226',
                title: '了解更多',
                url: '/collections',
              },
            ],
          },
          {
            id: '374256745',
            title: '为停电做好准备',
            description: '为停电做好准备',
            image: {
              url: 'https://www.bluettipower.com/cdn/shop/files/Portable_Power_Station_602.webp?v=1654141834',
              width: 2512,
              height: 1392,
              alt: '为停电做好准备',
            },
            links: [
              {
                id: '15723466346',
                title: '了解更多',
                url: '/collections',
              },
            ],
          },
          {
            id: '47856856',
            title: '磷酸铁锂电池',
            description: '经久耐用',
            dark: true,
            image: {
              url: 'https://www.bluettipower.com/cdn/shop/files/1_4106f9ae-8644-4d37-b4a1-1b984dcf44e0.jpg?v=1703152235',
              width: 2512,
              height: 1392,
              alt: '磷酸铁锂电池',
            },
            links: [
              {
                id: '1967967',
                title: '了解更多',
                url: '/collections',
              },
              {
                id: '25654764767',
                title: '立即购买',
                url: '/collections',
              },
            ],
          },
        ]}
      />
      <Testimonials />
      {/* <FeaturedCollection collection={data.featuredCollection} /> */}
      <RecommendedProducts products={data.recommendedProducts} />
    </section>
  );
}

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
                        <div className="mt-1 text-sm font-medium text-gray-900">
                          <Money data={product.priceRange.minVariantPrice} />
                        </div>
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
