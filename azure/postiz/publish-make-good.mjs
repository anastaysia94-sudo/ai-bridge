import fs from 'node:fs/promises';

const args = new Set(process.argv.slice(2));
const execute = args.has('--execute');
const runArgIndex = process.argv.indexOf('--run');
const onlyRun = runArgIndex >= 0 ? Number(process.argv[runArgIndex + 1]) : null;
const delayIndex = process.argv.indexOf('--delay-ms');
const delayMs = delayIndex >= 0 ? Math.max(0, Number(process.argv[delayIndex + 1])) : 4000;

const bridge = (process.env.BRIDGE_URL || '').replace(/\/$/, '');
const token = process.env.BRIDGE_API_TOKEN || '';
const expectedInstagram = (process.env.EXPECTED_INSTAGRAM || 'anastaysiag').toLowerCase();
const expectedThreads = (process.env.EXPECTED_THREADS || 'smart.pick.shop').toLowerCase();

if (!bridge || !token) {
  console.error('Set BRIDGE_URL and BRIDGE_API_TOKEN.');
  process.exit(2);
}

const queue = JSON.parse(await fs.readFile(new URL('./make-good-queue-2026-09-30.json', import.meta.url), 'utf8'));
const items = queue.items.filter((x) => !onlyRun || x.run === onlyRun);

function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

async function call(path, { method = 'GET', body } = {}) {
  const response = await fetch(`${bridge}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { 'content-type': 'application/json' } : {})
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(45000)
  });
  const text = await response.text();
  let parsed;
  try { parsed = text ? JSON.parse(text) : null; } catch { parsed = { raw: text }; }
  if (!response.ok) {
    const err = new Error(`${method} ${path} -> ${response.status}`);
    err.status = response.status;
    err.body = parsed;
    throw err;
  }
  return parsed;
}

function channelList(body) {
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.integrations)) return body.integrations;
  if (Array.isArray(body?.data)) return body.data;
  return [];
}

function textOf(channel) {
  return [channel?.name, channel?.profile, channel?.identifier, channel?.customer?.name, channel?.customer?.username]
    .filter(Boolean).join(' ').toLowerCase();
}

function findChannel(channels, platform, expected) {
  const candidates = channels.filter((c) => String(c?.identifier || '').toLowerCase().includes(platform));
  const exact = candidates.find((c) => textOf(c).includes(expected));
  if (exact) return exact;
  if (candidates.length === 1 && textOf(candidates[0]).includes(expected)) return candidates[0];
  const detail = candidates.map((c) => ({ id:c.id, name:c.name, profile:c.profile, identifier:c.identifier }));
  throw new Error(`No verified ${platform} channel matched "${expected}". Candidates: ${JSON.stringify(detail)}`);
}

const channelsBody = await call('/api/v1/channels');
const channels = channelList(channelsBody);
const instagram = findChannel(channels, 'instagram', expectedInstagram);
const threads = findChannel(channels, 'threads', expectedThreads);

console.log(JSON.stringify({
  mode: execute ? 'LIVE' : 'DRY_RUN',
  selectedItems: items.length,
  verifiedChannels: {
    instagram:{ id:instagram.id, name:instagram.name, profile:instagram.profile, identifier:instagram.identifier },
    threads:{ id:threads.id, name:threads.name, profile:threads.profile, identifier:threads.identifier }
  }
}, null, 2));

if (!execute) {
  console.log('Dry run only. Re-run with --execute after reviewing the verified channel identities above.');
  process.exit(0);
}

const results = [];
for (const item of items) {
  const channel = item.platform === 'instagram' ? instagram : threads;
  let image = [];
  if (item.platform === 'instagram') {
    const media = await call('/api/v1/media/from-url', {
      method:'POST',
      body:{ url:item.mediaUrl }
    });
    if (!media?.id || !media?.path) {
      throw new Error(`Instagram media import did not return id/path for run ${item.run} slot ${item.slot}: ${JSON.stringify(media)}`);
    }
    image = [{ id:media.id, path:media.path }];
  }

  const payload = {
    type:'now',
    date:new Date().toISOString(),
    shortLink:false,
    tags:[],
    posts:[{
      integration:{ id:channel.id },
      value:[{ content:item.caption, image }],
      settings:{ __type:String(channel.identifier || item.platform) }
    }]
  };

  try {
    const response = await call('/api/v1/posts', { method:'POST', body:payload });
    results.push({ run:item.run, slot:item.slot, platform:item.platform, ok:true, response });
    console.log(JSON.stringify(results.at(-1)));
  } catch (error) {
    results.push({ run:item.run, slot:item.slot, platform:item.platform, ok:false, status:error.status || null, error:error.body || error.message });
    console.error(JSON.stringify(results.at(-1)));
    break;
  }
  await sleep(delayMs);
}

const ok = results.filter((r) => r.ok).length;
const failed = results.length - ok;
console.log(JSON.stringify({ attempted:results.length, successful:ok, failed, results }, null, 2));
if (failed) process.exit(1);
