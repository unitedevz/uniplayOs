import { pipeline } from 'stream';
import { Readable } from 'stream';

const TIMEOUT_MS = 15000;
const CF_WORKER_URL = process.env.CF_WORKER_URL || null;

function applyHeaders(res, response) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const contentType = response.headers.get('content-type');
  if (contentType) res.setHeader('Content-Type', contentType);

  const contentLength = response.headers.get('content-length');
  if (contentLength) res.setHeader('Content-Length', contentLength);

  const contentRange = response.headers.get('content-range');
  if (contentRange) res.setHeader('Content-Range', contentRange);

  res.setHeader('Accept-Ranges', response.headers.get('accept-ranges') || 'bytes');
}

export const proxyMedia = async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: 'missing url' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const range = req.headers.range;

    const referer = (() => { try { const u = new URL(url); return `${u.protocol}//${u.hostname}`; } catch { return ''; } })();

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      'Accept': '*/*',
      'Referer': referer,
    };

    if (range) headers.Range = range;

    const fetchUrl = CF_WORKER_URL
      ? `${CF_WORKER_URL}?url=${encodeURIComponent(url)}`
      : url;

    const response = await fetch(fetchUrl, { headers, redirect: 'follow', signal: controller.signal });

    clearTimeout(timeout);

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('text/html')) {
      return res.status(422).json({ error: 'url returned html, not a media file' });
    }

    applyHeaders(res, response);
    res.status(response.status);

    if (!response.body) return res.end();

    const nodeStream = Readable.fromWeb(response.body);

    pipeline(nodeStream, res, (err) => {
      if (err && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
        console.error('stream error', err.message);
      }
    });

  } catch (error) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'upstream timeout' });
    }
    console.error('proxy error', error.message);
    res.status(500).json({ error: 'proxy failed' });
  }
};
