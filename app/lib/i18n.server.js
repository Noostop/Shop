import {RemixI18n} from 'remix-i18n';
import zh from '../locales/zh-CN.json';

export const i18n = new RemixI18n({
  supportedLanguages: ['en', 'tl', 'da', 'zh'],
  fallbackLng: 'zh',
});

i18n.set('zh', {
  hello: '你好',
  ...zh,
});
