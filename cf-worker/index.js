export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = url.searchParams.get('url');

    if (!target) {
      return new Response(JSON.stringify({ error: 'missing url' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const headers = new Headers(request.headers);
    headers.delete('host');

    const upstream = await fetch(target, {
      method: request.method,
      headers,
      redirect: 'follow',
    });

    const response = new Response(upstream.body, upstream);
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  },
};
