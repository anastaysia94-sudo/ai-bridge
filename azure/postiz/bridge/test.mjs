import http from 'node:http';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';

const postizPort = 19797;
const bridgePort = 19798;

const mock = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  assert.equal(req.headers.authorization, 'postiz-test-key');
  res.setHeader('content-type', 'application/json');

  if (req.method === 'GET' && url.pathname === '/public/v1/integrations') {
    res.end(JSON.stringify([{ id: 'ig-1', name: 'Test IG', identifier: 'instagram', disabled: false, profile: 'test' }]));
    return;
  }
  if (req.method === 'GET' && url.pathname === '/public/v1/posts') {
    assert.ok(url.searchParams.get('startDate'));
    assert.ok(url.searchParams.get('endDate'));
    res.end(JSON.stringify({ posts: [
      { id: 'q-1', content: 'queued', state: 'QUEUE' },
      { id: 'p-1', content: 'published', state: 'PUBLISHED' }
    ] }));
    return;
  }
  if (req.method === 'POST' && url.pathname === '/public/v1/posts') {
    let raw = '';
    for await (const chunk of req) raw += chunk;
    const body = JSON.parse(raw);
    assert.equal(body.type, 'draft');
    res.end(JSON.stringify([{ postId: 'draft-1', integration: 'ig-1' }]));
    return;
  }
  if (req.method === 'POST' && url.pathname === '/public/v1/upload-from-url') {
    let raw = '';
    for await (const chunk of req) raw += chunk;
    const body = JSON.parse(raw);
    assert.equal(body.url, 'https://example.com/a.jpg');
    res.end(JSON.stringify({ id: 'media-1', name: 'a.jpg', path: 'https://cdn.example.com/a.jpg' }));
    return;
  }
  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'mock_not_found' }));
});

await new Promise((resolve) => mock.listen(postizPort, '127.0.0.1', resolve));

const child = spawn(process.execPath, ['server.mjs'], {
  cwd: new URL('.', import.meta.url),
  env: {
    ...process.env,
    PORT: String(bridgePort),
    POSTIZ_BASE_URL: `http://127.0.0.1:${postizPort}`,
    POSTIZ_API_KEY: 'postiz-test-key',
    BRIDGE_API_TOKEN: 'bridge-test-token'
  },
  stdio: ['ignore', 'pipe', 'inherit']
});

const base = `http://127.0.0.1:${bridgePort}`;
const auth = { Authorization: 'Bearer bridge-test-token' };

async function waitForBridge() {
  for (let i = 0; i < 50; i += 1) {
    try {
      const r = await fetch(`${base}/health`);
      if (r.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error('bridge did not start');
}

try {
  await waitForBridge();

  let response = await fetch(`${base}/api/v1/channels`);
  assert.equal(response.status, 401);

  response = await fetch(`${base}/api/v1/channels`, { headers: auth });
  assert.equal(response.status, 200);
  const channels = await response.json();
  assert.equal(channels[0].id, 'ig-1');

  response = await fetch(`${base}/api/v1/posts/queue`, { headers: auth });
  assert.equal(response.status, 200);
  const queue = await response.json();
  assert.equal(queue.posts.length, 1);
  assert.equal(queue.posts[0].state, 'QUEUE');

  response = await fetch(`${base}/api/v1/posts`, {
    method: 'POST',
    headers: { ...auth, 'content-type': 'application/json' },
    body: JSON.stringify({
      type: 'draft',
      date: new Date().toISOString(),
      shortLink: false,
      tags: [],
      posts: [{ integration: { id: 'ig-1' }, value: [{ content: 'test', image: [] }], settings: { __type: 'instagram', post_type: 'post' } }]
    })
  });
  assert.equal(response.status, 200);
  assert.equal((await response.json())[0].postId, 'draft-1');

  response = await fetch(`${base}/api/v1/media/from-url`, {
    method: 'POST',
    headers: { ...auth, 'content-type': 'application/json' },
    body: JSON.stringify({ url: 'https://example.com/a.jpg' })
  });
  assert.equal(response.status, 200);
  const media = await response.json();
  assert.equal(media.id, 'media-1');
  assert.equal(media.path, 'https://cdn.example.com/a.jpg');

  response = await fetch(`${base}/api/v1/snapchat/package`, {
    method: 'POST',
    headers: { ...auth, 'content-type': 'application/json' },
    body: JSON.stringify({ mediaUrl: 'https://example.com/a.jpg', caption: 'test' })
  });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).status, 'requires-user-share');

  console.log('bridge tests passed');
} finally {
  child.kill('SIGTERM');
  mock.close();
}
