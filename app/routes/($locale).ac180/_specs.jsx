import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Bars3Icon} from '@heroicons/react/24/outline';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

import {Button} from '@/components/ui/button';
import {ScrollArea} from '@radix-ui/react-scroll-area';

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
export async function loader({params, request}) {
  const {handle} = params;

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

export default function Specs() {
  /** @type {LoaderReturnData} */
  const {specs} = useLoaderData();

  return (
    <div className="flex flex-col flex-1 gap-y-2 md:gap-y-4">
      <div className="container mt-20">
        <h1 className="text-4xl font-semibold">技术参数</h1>

        <div className="flex flex-col gap-8 pt-8 mt-8 border-t border-gray-300">
          {specs.map(({id, title, lists}) => (
            <div key={id} className="flex flex-col gap-4" id={`co_${title}`}>
              <h3 className="text-3xl font-semibold">{title}</h3>

              <ul className="flex flex-col gap-1">
                {lists.map(({id, title, description}) => (
                  <li
                    key={id}
                    className="flex flex-col gap-8 px-4 py-4 rounded md:items-center md:flex-row odd:bg-gray-100"
                  >
                    <h4 className="font-medium md:basis-60">{title}</h4>
                    <p
                      className="w-full"
                      dangerouslySetInnerHTML={{__html: description}}
                    ></p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <FixedNav specs={specs} />
    </div>
  );
}

function FixedNav({specs}) {
  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger className="fixed z-10 bottom-20 right-4 md:right-20">
        <Button size="icon" variant="secondary" className="rounded-full shadow">
          <span className="sr-only">Open menu</span>
          <Bars3Icon className="w-4 h-4" aria-hidden="true" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent sideOffset={20} align="end">
        <ScrollArea className="w-full overflow-x-hidden overflow-y-auto h-60">
          {specs?.map(({id, title}, index) => (
            <>
              <div key={`nav_${id}`}>
                <Link
                  to={`/ac180/specs#co_${title}`}
                  className="block w-full px-2 py-1 rounded-md hover:bg-gray-100"
                >
                  {index + 1}.{title}
                </Link>
              </div>
              {index < specs.length - 1 && (
                <hr className="block w-full h-0 my-2 bg-gray-100" />
              )}
            </>
          ))}
        </ScrollArea>
      </HoverCardContent>
    </HoverCard>
  );
}
