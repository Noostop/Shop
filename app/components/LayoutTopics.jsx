import {Await, useLocation, useMatches} from '@remix-run/react';
import {Suspense} from 'react';

import {Header} from '~/components/HeaderNew';
import {motion, MotionConfig, useReducedMotion} from 'framer-motion';
import {SubNavigation} from '~/components/SubNavigation';

export function LayoutTopics({children = null, ...props}) {
  return (
    <section>
      <SubNavigation {...props} />
      <section>{children}</section>
    </section>
  );
}
