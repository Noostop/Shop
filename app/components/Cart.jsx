import {CartForm, Image, Money} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import {useVariantUrl} from '~/utils';
import clsx from 'clsx';
import {Button} from '@/components/ui/button';

/**
 * @param {CartMainProps}
 */
export function CartMain({layout, cart}) {
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart.discountCodes.filter((code) => code.applicable).length);
  const className = `relative ${withDiscount ? 'with-discount' : ''}`;

  return (
    <>
      {linesCount == 0 && <CartEmpty layout={layout} />}
      <CartDetails cart={cart} layout={layout} />
    </>
  );
}

/**
 * @param {CartMainProps}
 */
function CartDetails({layout, cart}) {
  const cartHasItems = !!cart && cart.totalQuantity > 0;

  return (
    <>
      <CartLines lines={cart?.lines} layout={layout} />
      {cartHasItems && (
        <CartSummary cost={cart.cost} layout={layout}>
          {layout === 'page' && (
            <CartDiscounts discountCodes={cart.discountCodes} />
          )}
          <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
        </CartSummary>
      )}
    </>
  );
}

/**
 * @param {{
 *   layout: CartMainProps['layout'];
 *   lines: CartApiQueryFragment['lines'] | undefined;
 * }}
 */
function CartLines({lines, layout}) {
  if (!lines) return null;

  return (
    <div aria-labelledby="cart-lines">
      <ul className="-mt-4 divide-y">
        {lines.nodes.map((line) => (
          <CartLineItem key={line.id} line={line} layout={layout} />
        ))}
      </ul>
    </div>
  );
}

/**
 * @param {{
 *   layout: CartMainProps['layout'];
 *   line: CartLine;
 * }}
 */
function CartLineItem({layout, line}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);

  return (
    <li key={id} className="flex px-4 py-4">
      <div className="flex-shrink-0 w-10 h-10 overflow-hidden border border-gray-200 rounded-md">
        {image && (
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            height={100}
            loading="lazy"
            width={100}
            className="object-cover object-center w-full h-full"
          />
        )}
      </div>

      <div className="flex flex-col flex-1 ml-4">
        <Link
          prefetch="intent"
          to={lineItemUrl}
          // onClick={() => {
          //   if (layout === 'aside') {
          //     // close the drawer
          //     window.location.href = lineItemUrl;
          //   }
          // }}
        >
          <h3 className="text-sm line-clamp-2">{product.title}</h3>
        </Link>
        <CartLinePrice line={line} as="span" />
        <ul>
          {selectedOptions.map((option) => (
            <li key={option.name}>
              <small>
                {option.name}: {option.value}
              </small>
            </li>
          ))}
        </ul>
        <div className="text-xs">Qty: x {line.quantity}</div>
        {/* <CartLineQuantity line={line} layout={layout} /> */}
      </div>
    </li>
  );
}

/**
 * @param {{checkoutUrl: string}}
 */
function CartCheckoutActions({checkoutUrl}) {
  if (!checkoutUrl) return null;

  return (
    <div>
      <Button asChild>
        <a href={checkoutUrl} target="_self">
          <p>Continue to Checkout &rarr;</p>
        </a>
      </Button>
    </div>
  );
}

/**
 * @param {{
 *   children?: React.ReactNode;
 *   cost: CartApiQueryFragment['cost'];
 *   layout: CartMainProps['layout'];
 * }}
 */
export function CartSummary({cost, layout, children = null}) {
  return (
    <>
      {layout === 'page' && (
        <div aria-labelledby="cart-summary">
          <h4>Totals</h4>
          <dl className="">
            <dt>Subtotal</dt>
            <dd>
              {cost?.subtotalAmount?.amount ? (
                <Money data={cost?.subtotalAmount} />
              ) : (
                '-'
              )}
            </dd>
          </dl>
          {children}
        </div>
      )}
      {layout === 'aside' && (
        <div
          aria-labelledby="cart-summary"
          className="sticky top-0 flex flex-col w-full gap-2 px-2 pt-2 border-t border-gray-300"
        >
          <dl className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>
              {cost?.subtotalAmount?.amount ? (
                <Money data={cost?.subtotalAmount} />
              ) : (
                '-'
              )}
            </dd>
          </dl>
          {children}
        </div>
      )}
    </>
  );
}

/**
 * @param {{lineIds: string[]}}
 */
function CartLineRemoveButton({lineIds}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button type="submit">Remove</button>
    </CartForm>
  );
}

/**
 * @param {{line: CartLine}}
 */
function CartLineQuantity({line, layout}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center">
      <small>Quantity: {quantity} &nbsp;&nbsp;</small>
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
          name="decrease-quantity"
          value={prevQuantity}
        >
          <span>&#8722; </span>
        </button>
      </CartLineUpdateButton>
      &nbsp;
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
        >
          <span>&#43;</span>
        </button>
      </CartLineUpdateButton>
      &nbsp;
      {layout === 'page' && <CartLineRemoveButton lineIds={[lineId]} />}
    </div>
  );
}

/**
 * @param {{
 *   line: CartLine;
 *   priceType?: 'regular' | 'compareAt';
 *   [key: string]: any;
 * }}
 */
function CartLinePrice({line, priceType = 'regular', ...passthroughProps}) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;

  const moneyV2 =
    priceType === 'regular'
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return null;
  }

  return (
    <div>
      <Money withoutTrailingZeros {...passthroughProps} data={moneyV2} />
    </div>
  );
}

/**
 * @param {{
 *   hidden: boolean;
 *   layout?: CartMainProps['layout'];
 * }}
 */
export function CartEmpty({hidden = false, layout = 'aside'}) {
  const className = clsx(
    layout === 'page' && 'cart-empty-page',
    layout === 'aside' && 'p-2',
  );

  return (
    <div className={className} hidden={hidden}>
      <p>
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      {layout === 'page' && (
        <Button asChild>
          <Link
            to="/collections"
            onClick={() => {
              if (layout === 'aside') {
                window.location.href = '/collections';
              }
            }}
          >
            Continue shopping →
          </Link>
        </Button>
      )}
    </div>
  );
}

/**
 * @param {{
 *   discountCodes: CartApiQueryFragment['discountCodes'];
 * }}
 */
function CartDiscounts({discountCodes}) {
  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button>Remove</button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div>
          <input type="text" name="discountCode" placeholder="Discount code" />
          &nbsp;
          <button type="submit">Apply</button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

/**
 * @param {{
 *   discountCodes?: string[];
 *   children: React.ReactNode;
 * }}
 */
function UpdateDiscountForm({discountCodes, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

/**
 * @param {{
 *   children: React.ReactNode;
 *   lines: CartLineUpdateInput[];
 * }}
 */
function CartLineUpdateButton({children, lines}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

/** @typedef {CartApiQueryFragment['lines']['nodes'][0]} CartLine */
/**
 * @typedef {{
 *   cart: CartApiQueryFragment | null;
 *   layout: 'page' | 'aside';
 * }} CartMainProps
 */

/** @typedef {import('@shopify/hydrogen/storefront-api-types').CartLineUpdateInput} CartLineUpdateInput */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
