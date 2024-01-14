import {
  Link as RemixLink,
  NavLink as RemixNavLink,
  useMatches,
} from '@remix-run/react';

export function Link(props) {
  const {to, className, ...resOfProps} = props;
  const [root] = useMatches();
  const selectedLocale = root.data.selectedLocale;

  let toWithLocale = to;

  if (typeof to === 'string') {
    toWithLocale = selectedLocale ? `${selectedLocale.pathPrefix}${to}` : to;
  }

  if (typeof className === 'function') {
    return (
      <RemixNavLink
        to={toWithLocale.toLowerCase()}
        className={className}
        {...resOfProps}
      />
    );
  }

  return (
    <RemixLink
      to={toWithLocale.toLowerCase()}
      className={className}
      {...resOfProps}
    />
  );
}
