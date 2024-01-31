import {RemixServer} from '@remix-run/react';
import isbot from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';
import {I18nProvider} from 'remix-i18n';
import {i18n, getLocale} from './lib/i18n';

/**
' * @param {Request} request
 * @param {number} responseStatusCode
 * @param {Headers} responseHeaders
 * @param {EntryContext} remixContext
 */
export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    imgSrc: [
      "'self'",
      'unsafe-inline',
      'data:',
      'blob:',
      'cdn.shopify.com',
      'checkout.iiixys.cc',
      '*.bluettipower.com',
    ],
    connectSrc: [
      "'self'",
      '*.bluettipower.com',
      '*.google-analytics.com',
      '*.youtube.com',
    ],
  });

  const locale = getLocale(new URL(request.url).pathname);
  i18n.locale(locale);

  const body = await renderToReadableStream(
    <NonceProvider>
      <I18nProvider i18n={i18n}>
        <RemixServer context={remixContext} url={request.url} />
      </I18nProvider>
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  // responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

/** @typedef {import('@shopify/remix-oxygen').EntryContext} EntryContext */
