# cf-worker

Cloudflare Worker that acts as an egress proxy for UniplayOS. Requests routed through it exit from Cloudflare's IP range, bypassing IP-based blocks on target sites.

## Deploy

```bash
npm install -g wrangler
wrangler login
wrangler deploy
```

After deploying, copy the worker URL (e.g. `https://uniplay-proxy.your-subdomain.workers.dev`) and set it in your `.env`:

```
CF_WORKER_URL=https://uniplay-proxy.your-subdomain.workers.dev
```

Without this variable set, UniplayOS proxies directly as normal.

## Deploy via Cloudflare Dashboard (no CLI)

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) and log in
2. In the sidebar, go to **Workers & Pages** → **Create**
3. Select **Create Worker**
4. Give it a name (e.g. `uniplay-proxy`)
5. Change the file  path to ```cf-worker/```
6. Click **Deploy**

Your worker URL will be shown at the top of the editor, something like `https://uniplay-proxy.your-subdomain.workers.dev`. Copy that and set it as `CF_WORKER_URL` in your environment.

## How it works

The worker receives requests with a `?url=` query param and fetches the target on behalf of the caller, forwarding headers and streaming the response back. The outbound request to the target site originates from Cloudflare's network.
