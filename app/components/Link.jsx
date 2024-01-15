import {Link as RemixLink, NavLink as RemixNavLink} from '@remix-run/react';

import {usePrefixPathWithLocale} from '~/lib/utils';

export function Link(props) {
  const {to, className, ...resOfProps} = props;

  const selectPath = usePrefixPathWithLocale(to);

  if (typeof className === 'function') {
    return (
      <RemixNavLink
        to={selectPath.toLowerCase()}
        className={className}
        {...resOfProps}
      />
    );
  }

  return (
    <RemixLink
      to={selectPath.toLowerCase()}
      className={className}
      {...resOfProps}
    />
  );
}
