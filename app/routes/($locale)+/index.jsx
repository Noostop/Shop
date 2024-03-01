import {Suspense} from 'react';
import {defer, redirect, redirectDocument} from '@shopify/remix-oxygen';
import {Await, useLoaderData, useMatches} from '@remix-run/react';
import {useI18n} from 'remix-i18n';
import {Image, Money} from '@shopify/hydrogen';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import {SliderShow} from '~/components/SliderShow';
import {FeaturedCardContent} from '~/components/FeaturedCard';
import {Testimonials} from '~/components/Testimonials';
import {Link} from '~/components/Link';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'BLUETTI | Home'}];
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

export default function Home() {
  /** @type {LoaderReturnData} */
  // const data = useLoaderData();
  // const {t} = useI18n();

  return (
    <section className="flex flex-col flex-1">
      <SliderShow
        // autoplay
        slides={[
          {
            id: '15345435432',
            title: 'BLUETTI Energy Storage System',
            titleWithImage: '',
            subtitle: '',
            description: 'Protect your family from unexpected power outages.',
            position: 'centerTop',
            mode: 'dark',
            pcImage: {
              url: 'https://cdn.shopify.com/s/files/1/0536/3390/8911/files/architecture_archviz_coronarenderer_forest_night_visualization.webp?v=1708410908',
              width: 5120,
              height: 1600,
              alt: 'BLUETTI Energy Storage System',
            },
            mobileImage: {
              url: 'https://www.bluettipower.com/cdn/shop/files/1_58768def-b985-4e78-ad85-4ab6a58c5e67.png?v=1704518287',
              width: 1200,
              height: 2150,
              alt: 'BLUETTI Energy Storage System',
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

      {/* <FeaturedBenefitsCard /> */}

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
      {/* <RecommendedProducts products={data.recommendedProducts} /> */}
    </section>
  );
}

function FeaturedBenefitsCard({item}) {
  return (
    <section className="bg-black">
      <div className="container py-12 text-center lg:py-28">
        <p className="text-white/85">tumbling around in the</p>
        <h2 className="text-3xl font-bold text-white/85 lg:text-6xl">
          Key Benefits of BLUETTI ESS
        </h2>
      </div>
      <div className="flex flex-col gap-8 mt-6 rounded-lg text-white/85 lg:gap-0 lg:mt-24 lg:flex-row md:grid-rows-2">
        <div className="w-full shadow-lg lg:basis-1/2 lg:order-2">
          <div className="relative h-full">
            <div className="absolute inset-0 h-1/2 bg-gradient-to-b from-black to-transparent"></div>
            <Image
              className="aspect-[3/4] object-cover object-center w-full h-full"
              data={{
                url: 'https://cdn.shopify.com/s/files/1/0536/3390/8911/files/architecture_architecture_of_the_house_kk_project_kk_projects_res.webp?v=1708413473',
                width: 1944,
                height: 1546,
                altText: 'BLUETTI ESS',
              }}
            />
            <div className="inset-0 p-4 lg:absolute lg:px-10 lg:py-8 lg:w-3/4 2xl:w-1/2">
              <p>
                With the seamless UPS function, BLUETTI ESS ensures you can
                continue your daily routines without a hitch. You'll never have
                to worry about spoiled food or stumbling around in the dark
                during power outages. It's your reliable partner for
                uninterrupted comfort.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:basis-1/2">
          <div className="order-3 py-8 text-center lg:-order-1 basis-1/2">
            <div className="mx-auto max-w-80">
              <h3 className="text-3xl font-bold">Outage Protection</h3>
              <p className="mt-2">
                Ensuring your life never misses a beat, even when the grid does.
              </p>
            </div>
            <Image
              className="mx-auto"
              data={{
                url: 'https://cdn.shopify.com/s/files/1/0536/3390/8911/files/Pinterest_6a642218-4378-4982-a9a4-1965449af166.png?v=1708414689',
                width: 570,
                height: 320,
                altText: 'BLUETTI ESS',
              }}
              width={570}
              height={320}
            />
          </div>
          <div className="shadow-lg basis-1/2">
            <div className="relative h-full">
              <div className="absolute inset-0 hidden h-full bg-gradient-to-b from-black/80 to-transparent lg:visited:"></div>
              <Image
                className="w-full h-full"
                data={{
                  url: 'https://cdn.shopify.com/s/files/1/0536/3390/8911/files/logo-Logo-Design-brand-identity-Graphic-Designer-visual-identity.webp?v=1708414084',
                  width: 1439,
                  height: 675,
                  altText: 'BLUETTI ESS',
                }}
              />
              <div className="inset-0 p-4 lg:absolute lg:-translate-x-1/2 lg:w-3/4 2xl:w-1/2 lg:top-10 lg:left-1/2">
                <p>
                  BLUETTI ESS is an ideal solution to reduce your energy costs
                  as it empowers you to access the free abundance of energy the
                  sun provides for your everyday life. This system makes
                  achieving energy independence a breeze, and over time, you’ll
                  find the system pays for it self!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    <div className="py-4 bg-white group">
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
