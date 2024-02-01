// Virtual entry point for the app
import * as remixBuild from '@remix-run/dev/server-build';
import {
  cartGetIdDefault,
  cartSetIdDefault,
  createCartHandler,
  createStorefrontClient,
  storefrontRedirect,
} from '@shopify/hydrogen';
import {
  redirect,
  createRequestHandler,
  getStorefrontHeaders,
  createCookieSessionStorage,
} from '@shopify/remix-oxygen';
import {getLocaleFromRequest} from '~/lib/utils';
import {createBluettiClient} from '~/lib/createBluettiClient.server';

/**
 * Export a fetch handler in module format.
 */
export default {
  /**
   * @param {Request} request
   * @param {Env} env
   * @param {ExecutionContext} executionContext
   */
  async fetch(request, env, executionContext) {
    try {
      /**
       * 在工作线程中打开一个缓存实例和一个自定义会话实例。
       */
      if (!env?.SESSION_SECRET) {
        throw new Error('SESSION_SECRET environment variable is not set');
      }

      const waitUntil = executionContext.waitUntil.bind(executionContext);
      const [cache, session] = await Promise.all([
        caches.open('hydrogen'),
        HydrogenSession.init(request, [env.SESSION_SECRET]),
      ]);

      const {isSame, i18n, pathPrefix} = await getLocaleFromRequest({
        session,
        request,
      });

      if (!isSame) {
        const {origin, pathname, search} = new URL(request.url);
        const redirectUrl = new URL(
          `${pathname.replace(pathPrefix, i18n.pathPrefix)}${search}`,
          `${origin}`,
        );

        session.set('i18n', i18n);
        return redirect(redirectUrl, {
          headers: {
            'Set-Cookie': await session.commit(),
          },
        });
      }

      /**
       * 创建 Hydrogen 的 Storefront 客户端。
       */
      const {storefront} = createStorefrontClient({
        cache,
        waitUntil,
        i18n,
        publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
        privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
        storeDomain: env.PUBLIC_STORE_DOMAIN,
        storefrontId: env.PUBLIC_STOREFRONT_ID,
        storefrontHeaders: getStorefrontHeaders(request),
        storefrontApiVersion: '2023-10',
      });

      const bluetti = createBluettiClient({
        cache,
        waitUntil,
        i18n,
        serverDomain: 'https://srv0.bluettipower.com',
        serverAPiVersion: 'v1',
      });

      /*
       * 创建一个购物车处理程序，用于
       * 在会话中创建并更新购物车。
       */
      const cart = createCartHandler({
        storefront,
        getCartId: cartGetIdDefault(request.headers),
        setCartId: cartSetIdDefault(),
        cartQueryFragment: CART_QUERY_FRAGMENT,
      });

      /**
       * 创建一个 Remix 请求处理程序并传递
       * Hydrogen 的 Storefront 客户端到加载器上下文。
       */
      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => ({
          session,
          i18n,
          storefront,
          bluetti,
          cart,
          env,
          waitUntil,
        }),
      });

      const response = await handleRequest(request);

      if (response.status === 404) {
        /**
         * 仅当应用程序出现 404 错误时才检查重定向。
         * 如果重定向不存在，则`storefrontRedirect`
         * 将传递 404 响应。
         */
        const url = new URL(request.url);
        const redirectUrl = new URL(
          `/${pathPrefix}/404?from=${url.pathname}`,
          `${url.origin}`,
        );
        return redirect(redirectUrl, 302);
        // return storefrontRedirect({request, response, storefront});
      }

      return response;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};

/**
 * 这是为您的氢工厂定制的会话实现。
 * 随意根据您的需求定制它，添加辅助方法，或者
 * 用其他东西替换基于 cookie 的实现！
 */
export class HydrogenSession {
  #sessionStorage;
  #session;

  /**
   * @param {SessionStorage} sessionStorage
   * @param {Session} session
   */
  constructor(sessionStorage, session) {
    this.#sessionStorage = sessionStorage;
    this.#session = session;
  }

  /**
   * @static
   * @param {Request} request
   * @param {string[]} secrets
   */
  static async init(request, secrets) {
    const storage = createCookieSessionStorage({
      cookie: {
        name: 'session',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secrets,
      },
    });

    const session = await storage.getSession(request.headers.get('Cookie'));

    return new this(storage, session);
  }

  get has() {
    return this.#session.has;
  }

  get get() {
    return this.#session.get;
  }

  get flash() {
    return this.#session.flash;
  }

  get unset() {
    return this.#session.unset;
  }

  get set() {
    return this.#session.set;
  }

  destroy() {
    return this.#sessionStorage.destroySession(this.#session);
  }

  commit() {
    return this.#sessionStorage.commitSession(this.#session);
  }
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/cart
const CART_QUERY_FRAGMENT = `#graphql
  fragment Money on MoneyV2 {
    currencyCode
    amount
  }
  fragment CartLine on CartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      totalAmount {
        ...Money
      }
      amountPerQuantity {
        ...Money
      }
      compareAtAmountPerQuantity {
        ...Money
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        availableForSale
        compareAtPrice {
          ...Money
        }
        price {
          ...Money
        }
        requiresShipping
        title
        image {
          id
          url
          altText
          width
          height

        }
        product {
          handle
          title
          id
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
  fragment CartApiQuery on Cart {
    id
    checkoutUrl
    totalQuantity
    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
        displayName
      }
      email
      phone
    }
    lines(first: $numCartLines) {
      nodes {
        ...CartLine
      }
    }
    cost {
      subtotalAmount {
        ...Money
      }
      totalAmount {
        ...Money
      }
      totalDutyAmount {
        ...Money
      }
      totalTaxAmount {
        ...Money
      }
    }
    note
    attributes {
      key
      value
    }
    discountCodes {
      code
      applicable
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').SessionStorage} SessionStorage */
/** @typedef {import('@shopify/remix-oxygen').Session} Session */
