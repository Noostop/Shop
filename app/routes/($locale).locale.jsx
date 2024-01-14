import {redirect} from '@shopify/remix-oxygen';
import invariant from 'tiny-invariant';
import {getCountry} from '~/lib/utils';

export const action = async ({request, context}) => {
  const {session} = context;
  const formData = await request.formData();

  // Make sure the form request is valid
  const languageCode = formData.get('language');
  invariant(languageCode, 'Missing language');

  const countryCode = formData.get('country');
  invariant(countryCode, 'Missing country');

  // 确定相对于用户导航的位置重定向到的位置
  // ie. hydrogen.shop/collections -> ca.hydrogen.shop/collections
  const path = formData.get('path');
  const prefix = formData.get('prefix');
  // const toLocale = countries[`${countryCode}-${languageCode}`.toLowerCase()];

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

  const locale = getCountry(prefix);

  const selectPathPrefix = locale.pathPrefix !== '/' ? locale.pathPrefix : '/';

  // 重定向到新的位置
  const redirectUrl = new URL(
    `${selectPathPrefix}${path}`,
    `https://shop.iiixys.cc`,
    // `https://${toLocale?.host}`,
  );

  return redirect(redirectUrl, 302);
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
