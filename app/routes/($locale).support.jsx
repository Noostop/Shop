import {Outlet} from '@remix-run/react';
import {LayoutSupport} from '~/components/LayoutSupport';

export default function Support() {
  const page = {
    title: '服务与支持',
    urlHandle: 'support',
    navigationInfos: [
      {
        url: '/support/repair',
        title: '服务申请与信息支持',
        enable: true,
      },
      {
        url: '/support/service',
        title: '增值服务',
        enable: true,
      },
    ],
  };

  return (
    <LayoutSupport page={page}>
      <Outlet />
    </LayoutSupport>
  );
}
