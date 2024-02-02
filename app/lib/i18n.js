import {RemixI18n} from 'remix-i18n';
import en from '../locales/en.default.json';
import zh_CN from '../locales/zh-CN.json';
import zh_TW from '../locales/zh-TW.json';
import de from '../locales/de.json';
import fr from '../locales/fr.json';
import ko from '../locales/ko.json';
import ja from '../locales/ja.json';

export const i18n = new RemixI18n({
  supportedLanguages: [
    'en',
    'fr',
    'fr-en',
    'zh-cn',
    'zh',
    'zh-tw',
    'de',
    'kr',
    'ja',
  ],
  fallbackLng: 'en',
});

i18n.set('en', en);
i18n.set('zh-cn', zh_CN);
i18n.set('zh-tw', zh_TW);
i18n.set('de', de);
i18n.set('fr', fr);
i18n.set('kr', ko);
i18n.set('ja', ja);

export const getLocale = (path) => {
  if (path.startsWith('/cn')) {
    return 'zh-cn';
  }

  if (path.startsWith('/hk-en') || path.startsWith('/fr-en')) {
    return 'en';
  }

  if (path.startsWith('/hk') || path.startsWith('/tw')) {
    return 'zh-tw';
  }

  if (path.startsWith('/fr')) {
    return 'fr';
  }

  if (path.startsWith('/de')) {
    return 'de';
  }

  if (path.startsWith('/kr')) {
    return 'kr';
  }

  if (path.startsWith('/jp')) {
    return 'ja';
  }

  return 'en';
};
