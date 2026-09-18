import fs from 'node:fs';

const base = (process.env.BRIDGE_URL || '').replace(/\/$/, '');
const token = process.env.BRIDGE_API_TOKEN || '';
const command = process.argv[2] || '';

if (!base || !token) {
  console.error('Set BRIDGE_URL and BRIDGE_API_TOKEN.');
  process.exit(2);
}

const routes = {
  channels: ['GET', '/api/v1/channels'],
  queue: ['GET', '/api/v1/posts/queue'],
  post: ['POST', '/api/v1/posts'],
  media: ['POST', '/api/v1/media/from-url'],
  whatsapp: ['POST', '/api/v1/whatsapp/send'],
  snapchat: ['POST', '/api/v1/snapchat/package']
};

if (!routes[command]) {
  console.error('Usage: node send.mjs channels|queue|post|media|whatsapp|snapchat');
  process.exit(2);
}

const [method, path] = routes[command];
let body;
if (method === 'POST') {
  body = fs.readFileSync(0, 'utf8').trim();
  if (!body) {
    console.error('POST commands expect JSON on stdin.');
    process.exit(2);
  }
  JSON.parse(body);
}

const response = await fetch(`${base}${path}`, {
  method,
  headers: {
    Authorization: `Bearer ${token}`,
    ...(body ? { 'content-type': 'application/json' } : {})
  },
  body
});

const text = await response.text();
console.log(text);
if (!response.ok) process.exit(1);
