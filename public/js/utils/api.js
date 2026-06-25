class Api {
  static base = '/proxy';

  static async get(url, { onError } = {}) {
    return this._request(url, { method: 'GET', onError });
  }

  static async _request(url, { method, onError } = {}) {
    const proxied = `${this.base}?url=${encodeURIComponent(url)}`;

    try {
      const response = await fetch(proxied, { method });

      if (!response.ok) {
        const err = new Error(`${response.status} ${response.statusText}`);
        if (onError) { onError(err); return null; }
        return null;
      }

      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        return await response.json();
      }

      return await response.text();
    } catch (err) {
      if (onError) onError(err);
      return null;
    }
  }
}

if (typeof window !== 'undefined') {
  window.Api = Api;
}
