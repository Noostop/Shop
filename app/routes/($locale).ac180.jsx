import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {SliderShow} from '~/components/SliderShow';

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

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({params, request, context}) {
  const {handle = 'ac180'} = params;
  const {storefront} = context;
  // const {storefront} = context;
  // const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  // const featuredCollection = collections.nodes[0];
  // const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  const products = [
    {
      id: 'ac180',
      handle: 'ac180',
      title: 'AC180 Specs',
      description: '1,800W AC Output / 2,700W Power Lifting Mode',
      specs: [
        {
          id: '1',
          title: '飞行器',
          lists: [
            {
              id: '16534',
              title: '起飞重量',
              description: 'Mavic 3 Pro：958 克<br/>  Mavic 3 Pro Cine：963 克',
            },
            {
              id: '252',
              title: '尺寸',
              description:
                '折叠（不带桨）：长 231.1 毫米，宽 98 毫米，高 95.4 毫米 <br/> 展开（不带桨）：长 347.5 毫米，宽 290.8 毫米，高 107.7 毫米',
            },
            {
              id: '312312',
              title: '最大上升速度',
              description: '8 米/秒',
            },
            {
              id: '442',
              title: '最大下降速度',
              description: '6 米/秒',
            },
            {
              id: '5412',
              title: '最大水平飞行速度（海平面附近无风）',
              description: '21 米/秒',
            },
            {
              id: '6234',
              title: '最大起飞海拔高度',
              description: '6000 米',
            },
            {
              id: '7732',
              title: '最长飞行时间',
              description:
                '<p>43 分钟</p><small>该续航时间在受控测试环境下测得。具体测试条件为：海平面无风环境、以 32.4 公里/小时匀速向前飞行、关闭 APAS、关闭 AirSense、相机参数调整为 1080p/24fps、关闭录像模式并飞行至剩余 0% 电量。在不同的外部环境、使用方式、固件版本下，结果或有不同程度的差异，请以实际体验为准。</small>',
            },
          ],
        },
        {
          id: '2',
          title: '相机',
          lists: [
            {
              id: '111',
              title: '影像传感器',
              description:
                '哈苏相机：4/3 CMOS，有效像素 2000 万<br/>中长焦相机：1/1.3 英寸 CMOS，有效像素 4800 万<br/>长焦相机：1/2 英寸 CMOS，有效像素 1200 万',
            },
            {
              id: '2222',
              title: '镜头',
              description:
                '哈苏相机<br/>视角（FOV）：84°<br/>等效焦距：24 mm<br/>光圈：f/2.8 至 f/11<br/>对焦点：1 米至无穷远<br/>中长焦相机<br/>视角（FOV）：35°<br/>等效焦距：70 mm<br/>光圈：f/2.8<br/>对焦点：3 米至无穷远<br/>长焦相机<br/>视角（FOV）：15°<br/>等效焦距：166 mm<br/>光圈：f/3.4<br/>对焦点：3 米至无穷远',
            },
            {
              id: '3333',
              title: 'ISO 范围',
              description:
                '视频<br/>普通、慢动作：<br/>100 至 6400（普通色彩）<br/>400 至 1600（D-Log）<br/>100 至 1600（D-Log M）<br/>100 至 1600（HLG）<br/>夜景：<br/>800 至 12800（普通色彩）<br/>照片<br/>100 至 6400',
            },
          ],
        },
      ],
      videos: [
        {
          id: '1',
          title: '介绍视频',
          lists: [
            {
              id: '16534',
              title: 'DJI Mavic 3 Pro | 介绍视频',
              description: '',
              video: {
                postImage: {
                  url: 'https://www1.djicdn.com/cms/uploads/947376bb67033c0b6d5c7ad2266b01c4@770*462.jpg',
                  width: 770,
                  height: 462,
                  alt: 'DJI Mavic 3 Pro | 介绍视频',
                },
                url: 'https://cn-videos.dji.net/video_trans/24a7f6f1990141789920877fed8b3a33/720.mp4',
                width: 1280,
                height: 720,
              },
            },
          ],
        },
        {
          id: '2',
          title: '教学视频',
          lists: [
            {
              id: '111',
              title: 'DJI Mavic 3 Pro/Pro Cine｜开箱指引',
              description: '',
              video: {
                postImage: {
                  url: 'https://www1.djicdn.com/cms/uploads/947376bb67033c0b6d5c7ad2266b01c4@770*462.jpg',
                  width: 770,
                  height: 462,
                  alt: 'DJI Mavic 3 Pro/Pro Cine｜开箱指引',
                },
                url: 'https://cn-videos.dji.net/video_trans/24a7f6f1990141789920877fed8b3a33/720.mp4',
                width: 1280,
                height: 720,
              },
            },
            {
              id: '423',
              title: 'DJI Mavic 3 Pro/Pro Cine｜首次飞行指引',
              description: '',
              video: {
                postImage: {
                  url: 'https://www1.djicdn.com/cms/uploads/947376bb67033c0b6d5c7ad2266b01c4@770*462.jpg',
                  width: 770,
                  height: 462,
                  alt: 'DJI Mavic 3 Pro/Pro Cine｜首次飞行指引',
                },
                url: 'https://cn-videos.dji.net/video_trans/24a7f6f1990141789920877fed8b3a33/720.mp4',
                width: 1280,
                height: 720,
              },
            },
            {
              id: '423112',
              title: 'DJI Mavic 3 Pro/Pro Cine｜相机新功能',
              description: '',
              video: {
                postImage: {
                  url: 'https://www1.djicdn.com/cms/uploads/947376bb67033c0b6d5c7ad2266b01c4@770*462.jpg',
                  width: 770,
                  height: 462,
                  alt: 'DJI Mavic 3 Pro/Pro Cine｜相机新功能',
                },
                url: 'https://cn-videos.dji.net/video_trans/24a7f6f1990141789920877fed8b3a33/720.mp4',
                width: 1280,
                height: 720,
              },
            },
            {
              id: '432',
              title: 'DJI Mavic 3 Pro/Pro Cine｜多焦段场景玩法',
              description: '',
              video: {
                postImage: {
                  url: 'https://www1.djicdn.com/cms/uploads/947376bb67033c0b6d5c7ad2266b01c4@770*462.jpg',
                  width: 770,
                  height: 462,
                  alt: 'DJI Mavic 3 Pro/Pro Cine｜多焦段场景玩法',
                },
                url: 'https://cn-videos.dji.net/video_trans/24a7f6f1990141789920877fed8b3a33/720.mp4',
                width: 1280,
                height: 720,
              },
            },
          ],
        },
      ],
    },
  ];

  try {
    const product = products.find((p) => p.handle === handle);
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
