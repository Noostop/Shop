import {redirect, createCookie} from '@shopify/remix-oxygen';

export const knowledgeCountry = createCookie('knowledgeCountry', {
  maxAge: 604_800, // one week
});
