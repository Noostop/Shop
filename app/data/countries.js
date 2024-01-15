// const HOST = 'http://localhost:3000';
const HOST = 'https://shop.iiixys.cc';

export const countries = {
  default: {
    country: 'US',
    language: 'EN',
    countryText: '美国',
    langText: '英语',
    currency: 'USD',
    alias: ' US',
    host: HOST,
  },
  'cn-zh': {
    country: 'CN',
    language: 'ZH',
    countryText: '中国',
    langText: '简体中文',
    currency: 'CNY',
    alias: 'CN',
    pathPrefix: '/cn',
    host: HOST,
  },
  'fr-en': {
    country: 'FR',
    language: 'EN',
    countryText: '法国',
    langText: '英语',
    currency: 'EUR',
    alias: 'FR-EN',
    pathPrefix: '/fr-en',
    host: HOST,
  },
  'fr-fr': {
    country: 'FR',
    language: 'FR',
    countryText: '法国',
    langText: '法语',
    currency: 'EUR',
    alias: 'FR=FR',
    pathPrefix: '/fr',
    host: HOST,
  },
  'jp-ja': {
    country: 'JP',
    language: 'JA',
    countryText: '日本',
    langText: '日语',
    currency: 'JPY',
    alias: 'JP',
    pathPrefix: '/jp',
    host: HOST,
  },
};
