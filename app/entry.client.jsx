import {RemixBrowser} from '@remix-run/react';
import {startTransition, StrictMode} from 'react';
import {hydrateRoot} from 'react-dom/client';

import {I18nProvider} from 'remix-i18n';
import {i18n} from './lib/i18n.server';

// const locale = getLocale(window.location.pathname);
i18n.locale('zh');

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <I18nProvider i18n={i18n}>
        <RemixBrowser />
      </I18nProvider>
    </StrictMode>,
  );
});
