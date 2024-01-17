import {Outlet} from '@remix-run/react';
import {LayoutSupport} from '~/components/LayoutSupport';

export default function Support() {
  const page = {
    title: '服务与支持',
    handle: '/support',
    navBars: {
      navs: [
        {id: '31341234124', title: '产品支持', url: '/support/product'},
        {
          id: '44343243444',
          title: '服务申请与信息支持',
          url: '/support/repair',
        },
        {id: '53131231254', title: '增值服务', url: '/support/service'},
      ],
    },
  };

  return (
    <LayoutSupport page={page}>
      <Outlet />
    </LayoutSupport>
  );
}
