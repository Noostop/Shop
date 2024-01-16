import invariant from 'tiny-invariant';
import {redirect} from '@shopify/remix-oxygen';
import {knowledgeCountry} from '~/lib/cookies.server';
import {DEFAULT_LOCALE} from '~/lib/utils';
import {countries} from '~/data/countries';

export const action = async ({request, context}) => {
  const {session} = context;
  const formData = await request.formData();

  // Make sure the form request is valid
  const languageCode = formData.get('language');
  invariant(languageCode, 'Missing language');

  const countryCode = formData.get('country');
  invariant(countryCode, 'Missing country');

  // 确定相对于用户导航的位置重定向到的位置
  const path = formData.get('path');
  let toLocale = DEFAULT_LOCALE; //countries[`${countryCode}-${languageCode}`.toLowerCase()] ?? DEFAULT_LOCALE;

  Object.keys(countries).map((countryKey) => {
    const locale = countries[countryKey];
    if (locale.country === countryCode && locale.language === languageCode) {
      toLocale = locale;
    }
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

  const redirectUrl = new URL(
    `${toLocale.pathPrefix || ''}${path}`,
    `${toLocale?.host}`,
  );

  return redirect(redirectUrl, {
    status: 302,
    headers: {
      'Set-Cookie': await knowledgeCountry.serialize(toLocale),
    },
  });
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
