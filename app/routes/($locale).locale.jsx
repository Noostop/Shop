import invariant from 'tiny-invariant';
import {json, redirect} from '@shopify/remix-oxygen';
import {getLocaleFromRequest} from '~/lib/utils';

export const action = async ({request, context}) => {
  const {session} = context;

  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    const formData = await request.formData();

    // Make sure the form request is valid
    const languageCode = formData.get('language');
    invariant(languageCode, 'Missing language');

    const countryCode = formData.get('country');
    invariant(countryCode, 'Missing country');

    // 确定相对于用户导航的位置重定向到的位置
    const path = formData.get('path');

    const {isSame, i18n} = await getLocaleFromRequest({
      session,
      request,
    });

    const cartId = await session.get('cartId');

    // 如果有购物车 ID，则更新购物车买家的国家/地区代码
    if (cartId) {
      await updateCartBuyerIdentity(context, {
        cartId,
        buyerIdentity: {
          countryCode,
        },
      });
    }

    if (!isSame) {
      const url = new URL(request.url);
      const redirectUrl = new URL(`${i18n.pathPrefix}${path}`, `${url.origin}`);

      session.set('i18n', i18n);
      return redirect(redirectUrl, {
        headers: {
          'Set-Cookie': await session.commit(),
        },
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return json({error: error.message}, {status: 400});
    }
    return json({error}, {status: 400});
  }
};

async function updateCartBuyerIdentity({storefront}, {cartId, buyerIdentity}) {
  return await storefront.mutate(UPDATE_CART_BUYER_COUNTRY, {
    variables: {
      cartId,
      buyerIdentity,
    },
  });
}

const UPDATE_CART_BUYER_COUNTRY = `#graphql
  mutation CartBuyerIdentityUpdate(
    $cartId: ID!
    $buyerIdentity: CartBuyerIdentityInput!
    $country: CountryCode = ZZ
  ) @inContext(country: $country) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        id
      }
    }
  }
`;
