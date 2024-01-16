import {Await, useLocation, useMatches} from '@remix-run/react';
import {Suspense} from 'react';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/FooterNew';
import {NavMenu} from '~/components/Header';
import {CartMain} from '~/components/Cart';
import {
  PredictiveSearchForm,
  PredictiveSearchResults,
} from '~/components/Search';

import {Header} from '~/components/HeaderNew';
import {motion, MotionConfig, useReducedMotion} from 'framer-motion';

/**
 * @param {LayoutProps}
 */
export function Layout({
  cart,
  children = null,
  shop,
  headerMenu,
  footerMenu,
  isLoggedIn,
  pages,
  selectedLocale,
}) {
  let shouldReduceMotion = useReducedMotion();

  const {pathname} = useLocation();

  const haveSubNav = pages.some((page) => pathname.includes(page.handle));

  return (
    <div className="flex flex-col min-h-screen">
      <MotionConfig
        transition={shouldReduceMotion ? {duration: 0} : {duration: 1}}
      >
        {/* <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside menu={header?.menu} shop={header?.shop} /> */}
        <Header
          pages={pages}
          shop={shop}
          headerMenu={headerMenu}
          cart={cart}
          haveSubNav={haveSubNav}
          isLoggedIn={isLoggedIn}
        />
        <main className="flex-grow">{children}</main>
        <Suspense>
          <Await resolve={footerMenu}>
            {(footer) => <Footer menu={footer?.menu} shop={shop} />}
          </Await>
        </Suspense>
      </MotionConfig>
    </div>
  );
}

/**
 * @param {{cart: LayoutProps['cart']}}
 */
function CartAside({cart}) {
  return (
    <Aside id="cart-aside" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchAside() {
  return (
    <Aside id="search-aside" heading="SEARCH">
      <div className="predictive-search">
        <br />
        <PredictiveSearchForm>
          {({fetchResults, inputRef}) => (
            <div>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
              />
              &nbsp;
              <button type="submit">Search</button>
            </div>
          )}
        </PredictiveSearchForm>
        <PredictiveSearchResults />
      </div>
    </Aside>
  );
}

/**
 * @param {{
 *   menu: HeaderQuery['menu'];
 *   shop: HeaderQuery['shop'];
 * }}
 */
function MobileMenuAside({menu, shop}) {
  return (
    menu &&
    shop?.primaryDomain?.url && (
      <Aside id="mobile-menu-aside" heading="MENU">
        <NavMenu
          menu={menu}
          viewport="mobile"
          primaryDomainUrl={shop.primaryDomain.url}
        />
      </Aside>
    )
  );
}
