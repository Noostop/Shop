import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {SliderShow} from '~/components/SliderShow';
import {pages} from '~/data/pages';

/**
 * @type {MetaFunction}
 */
export const meta = ({data}) => {
  const {title, description} = data;

  return [
    {title: `BLUETTI | ${title}`},
    {
      description,
    },
  ];
};

export const handle = {
  handle: 'ac60',
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({params, request, context}) {
  const {handle} = params;
  const {storefront} = context;
  // const {storefront} = context;
  // const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  // const featuredCollection = collections.nodes[0];
  // const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  try {
    const product = pages.find((p) => p.handle === 'ac60');
    return defer(product);
  } catch (error) {
    throw new Response(`${new URL(request.url).pathname} not found`, {
      status: 404,
    });
  }
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();

  return (
    <div className="flex flex-col flex-1 gap-y-2 md:gap-y-4">
      <SliderShow
        // autoplay
        slides={[
          {
            id: '1',
            title: 'AC180',
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
      <div className="h-screen bg-yellow-100"></div>
      <div className="h-screen bg-pink-200"></div>
      <div className="h-screen bg-yellow-100"></div>
    </div>
  );
}
