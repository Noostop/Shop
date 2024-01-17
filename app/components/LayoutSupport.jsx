import {SubNavigation} from '~/components/SubNavigation';

export function LayoutSupport({children = null, page}) {
  return (
    <>
      <SubNavigation {...page} />
      {children}
    </>
  );
}
