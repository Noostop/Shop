import {getFetchHeaders} from './utils';

export function createBluettiClient({serverDomain, serverAPiVersion, i18n}) {
  async function post(url, body = {}) {
    const response = await fetch(`${serverDomain}${url}`, {
      method: 'POST',
      headers: getFetchHeaders({i18n}),
      body: JSON.stringify({
        ...body,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error getting from BLUETTI API: ${response.statusText}`);
    }

    const json = await response.json();

    if (json.code !== 0) {
      throw new Error(`Error getting from BLUETTI API: ${json.msg}`);
    }

    return json.data;
  }

  async function get(url) {
    const response = await fetch(`${serverDomain}${url}`, {
      method: 'GET',
      headers: getFetchHeaders({i18n}),
    });

    if (!response.ok) {
      throw new Error(`Error getting from BLUETTI API: ${response.statusText}`);
    }

    const json = await response.json();

    if (json.code !== 0) {
      throw new Error(`Error getting from BLUETTI API: ${json.msg}`);
    }

    return json.data;
  }

  return {post, get};
}
