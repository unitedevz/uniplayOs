class Downloader {
  constructor(options = {}) {
    this.proxyBase = options.proxyBase || '/proxy';
    this.onProgress = options.onProgress || null;
    this.onComplete = options.onComplete || null;
    this.onError = options.onError || null;
  }

  async download(url, filename) {
    const name = filename || Utils.getFileName(url);

    try {
      if (this._isBlobUrl(url)) {
        this._trigger(url, name);
        if (this.onComplete) this.onComplete({ url, filename: name });
        return;
      }

      await this._fetchAndTrigger(url, name);
    } catch (err) {
      if (this.onError) this.onError(err);
      throw err;
    }
  }

  async _fetchAndTrigger(url, filename) {
    const proxied = this._needsProxy(url)
      ? `${this.proxyBase}?url=${encodeURIComponent(url)}`
      : url;

    const response = await fetch(proxied);

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : null;

    const reader = response.body.getReader();
    const chunks = [];
    let received = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;
      if (this.onProgress && total) {
        this.onProgress({ received, total, percent: Math.round((received / total) * 100) });
      }
    }

    const blob = new Blob(chunks, {
      type: response.headers.get('content-type') || 'application/octet-stream'
    });

    const blobUrl = URL.createObjectURL(blob);
    this._trigger(blobUrl, filename);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 4000);

    if (this.onComplete) this.onComplete({ url, filename, size: received });
  }

  _trigger(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  _isBlobUrl(url) {
    return url.startsWith('blob:');
  }

  _needsProxy(url) {
    try {
      const u = new URL(url);
      return !u.hostname || (!u.hostname.includes('blob') && u.hostname !== 'localhost');
    } catch {
      return true;
    }
  }
}

if (typeof window !== 'undefined') {
  window.Downloader = Downloader;
}
