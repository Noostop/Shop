export const countries = {
  default: {
    language: 'EN',
    country: 'US',
    label: 'United States (USD $)', // 要在国家/地区选择器中显示的标签
    host: 'shop.iiixys.cc', // host 和 pathPrefix 用于链接
    pathPrefix: '/',
  },
  'en-ca': {
    language: 'EN',
    country: 'CA',
    label: 'Canada (CAD $)',
    host: 'shop.iiixys.cc',
    pathPrefix: '/ca',
  },
  'fr-ca': {
    language: 'EN',
    country: 'CA',
    label: 'Canada (Français) (CAD $)',
    host: 'shop.iiixys.cc',
    pathPrefix: '/fr',
  },
  'en-au': {
    language: 'EN',
    country: 'AU',
    label: 'Australia (AUD $)',
    host: 'shop.iiixys.cc',
    pathPrefix: '/au',
  },
  'zh-cn': {
    lang: 'zh-CN',
    language: 'zh-CN',
    langText: '简体中文',
    label: '中国大陆 (CNY ¥)',
    host: 'hydrogen.au',
    country: '中国大陆',
    alias: 'CN',
    customValue: 'zh-cn',
    pathPrefix: '/zh-cn',
  },
};
