# Vails.org

Server-rendered wedding veil knowledge base built on Cloudflare Workers.

## Local Development

```bash
npm install
npm run index   # build search index
npm run dev     # start Wrangler dev server
```

## Staging & Production

Deploy to Cloudflare Pages:

```bash
npm run build
```

## Managing Content

Set secrets for admin credentials and wrangler:

```bash
wrangler secret put ADMIN_USER
wrangler secret put ADMIN_PASS
```

Create KV namespaces for `CONTENT` and update `wrangler.toml` with IDs.
