import {SubNavigation} from '~/components/SubNavigation';
import {AC180} from '~/pages/AC180';
import {AC60} from '~/pages/AC60';

export function LayoutTopics({children = null, ...props}) {
  return (
    <>
      <SubNavigation {...props} />
      {children}
    </>
  );
}
