import http from 'node:http';
import crypto from 'node:crypto';

const PORT = Number(process.env.PORT || 8787);
const POSTIZ_BASE_URL = (process.env.POSTIZ_BASE_URL || '').replace(/\/$/, '');
const POSTIZ_API_KEY = process.env.POSTIZ_API_KEY || '';
const BRIDGE_API_TOKEN = process.env.BRIDGE_API_TOKEN || '';

function json(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(data),
    'cache-control': 'no-store'
  });
  res.end(data);
}

function safeEqual(a, b) {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

function requireBridgeAuth(req, res) {
  if (!BRIDGE_API_TOKEN) {
    json(res, 503, { error: 'bridge_not_configured' });
    return false;
  }
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token || !safeEqual(token, BRIDGE_API_TOKEN)) {
    json(res, 401, { error: 'unauthorized' });
    return false;
  }
  return true;
}

async function readBody(req, limit = 2_000_000) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > limit) throw new Error('payload_too_large');
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks);
  return { raw, json: raw.length ? JSON.parse(raw.toString('utf8')) : {} };
}

async function postiz(path, options = {}) {
  if (!POSTIZ_BASE_URL || !POSTIZ_API_KEY) {
    throw new Error('postiz_not_configured');
  }
  const headers = {
    Authorization: POSTIZ_API_KEY,
    ...(options.body ? { 'content-type': 'application/json' } : {})
  };
  const response = await fetch(`${POSTIZ_BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: AbortSignal.timeout(30_000)
  });
  const text = await response.text();
  let body;
  try { body = text ? JSON.parse(text) : null; } catch { body = { raw: text }; }
  return { status: response.status, body };
}

function queueRange(url) {
  const now = new Date();
  const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  return {
    startDate: url.searchParams.get('startDate') || now.toISOString(),
    endDate: url.searchParams.get('endDate') || end.toISOString()
  };
}

function verifyWhatsAppSignature(raw, signatureHeader) {
  const secret = process.env.WHATSAPP_APP_SECRET || '';
  if (!secret) return false;
  if (!signatureHeader?.startsWith('sha256=')) return false;
  const expected = `sha256=${crypto.createHmac('sha256', secret).update(raw).digest('hex')}`;
  return safeEqual(signatureHeader, expected);
}

async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'GET' && url.pathname === '/health') {
    return json(res, 200, { status: 'ok', postizConfigured: Boolean(POSTIZ_BASE_URL && POSTIZ_API_KEY) });
  }

  // Meta webhook verification must be callable by Meta without bridge Bearer auth.
  if (req.method === 'GET' && url.pathname === '/webhooks/whatsapp') {
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');
    if (mode === 'subscribe' && token && safeEqual(token, process.env.WHATSAPP_VERIFY_TOKEN || '')) {
      res.writeHead(200, { 'content-type': 'text/plain' });
      return res.end(challenge || '');
    }
    return json(res, 403, { error: 'webhook_verification_failed' });
  }

  if (req.method === 'POST' && url.pathname === '/webhooks/whatsapp') {
    try {
      const { raw, json: body } = await readBody(req);
      if (!verifyWhatsAppSignature(raw, req.headers['x-hub-signature-256'])) {
        return json(res, 401, { error: 'invalid_whatsapp_signature' });
      }
      // Acknowledge immediately. Persist/forward in a separate trusted worker if needed.
      return json(res, 200, { received: true, object: body?.object || null });
    } catch (error) {
      return json(res, 400, { error: error.message });
    }
  }

  if (!requireBridgeAuth(req, res)) return;

  if (req.method === 'GET' && url.pathname === '/api/v1/channels') {
    const upstream = await postiz('/public/v1/integrations');
    return json(res, upstream.status, upstream.body);
  }

  if (req.method === 'GET' && url.pathname === '/api/v1/posts/queue') {
    const { startDate, endDate } = queueRange(url);
    const params = new URLSearchParams({ startDate, endDate });
    const upstream = await postiz(`/public/v1/posts?${params}`);
    if (upstream.status >= 400) return json(res, upstream.status, upstream.body);
    const posts = Array.isArray(upstream.body?.posts) ? upstream.body.posts : [];
    return json(res, 200, {
      posts: posts.filter((p) => p?.state === 'QUEUE'),
      range: { startDate, endDate }
    });
  }

  if (req.method === 'POST' && url.pathname === '/api/v1/posts') {
    try {
      const { json: body } = await readBody(req);
      const upstream = await postiz('/public/v1/posts', { method: 'POST', body });
      return json(res, upstream.status, upstream.body);
    } catch (error) {
      return json(res, error.message === 'payload_too_large' ? 413 : 400, { error: error.message });
    }
  }

  if (req.method === 'POST' && url.pathname === '/api/v1/media/from-url') {
    try {
      const { json: body } = await readBody(req);
      if (!body?.url) return json(res, 400, { error: 'url_required' });
      const upstream = await postiz('/public/v1/upload-from-url', {
        method: 'POST',
        body: { url: String(body.url) }
      });
      return json(res, upstream.status, upstream.body);
    } catch (error) {
      return json(res, error.message === 'payload_too_large' ? 413 : 400, { error: error.message });
    }
  }

  if (req.method === 'POST' && url.pathname === '/api/v1/whatsapp/send') {
    try {
      const { json: body } = await readBody(req);
      const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
      const accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
      const version = process.env.WHATSAPP_GRAPH_VERSION || '';
      if (!phoneId || !accessToken || !version) {
        return json(res, 503, { error: 'whatsapp_not_configured' });
      }
      const payload = { messaging_product: 'whatsapp', ...body };
      const response = await fetch(`https://graph.facebook.com/${encodeURIComponent(version)}/${encodeURIComponent(phoneId)}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30_000)
      });
      const text = await response.text();
      let result;
      try { result = text ? JSON.parse(text) : null; } catch { result = { raw: text }; }
      return json(res, response.status, result);
    } catch (error) {
      return json(res, 400, { error: error.message });
    }
  }

  if (req.method === 'POST' && url.pathname === '/api/v1/snapchat/package') {
    try {
      const { json: body } = await readBody(req);
      if (!body.mediaUrl) return json(res, 400, { error: 'mediaUrl_required' });
      return json(res, 200, {
        platform: 'snapchat',
        caption: String(body.caption || ''),
        mediaUrl: String(body.mediaUrl),
        scheduledFor: body.scheduledFor || null,
        status: 'requires-user-share'
      });
    } catch (error) {
      return json(res, 400, { error: error.message });
    }
  }

  return json(res, 404, { error: 'not_found' });
}

const server = http.createServer((req, res) => {
  handler(req, res).catch((error) => {
    console.error(error);
    json(res, 502, { error: 'upstream_error', message: error.message });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Postiz bridge listening on :${PORT}`);
});
