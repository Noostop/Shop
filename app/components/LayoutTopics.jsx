import {SubNavigation} from '~/components/SubNavigation';

export function LayoutTopics({children = null, ...props}) {
  return (
    <>
      <SubNavigation {...props} />
      <section>{children}</section>
    </>
  );
}
