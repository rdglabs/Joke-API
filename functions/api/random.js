import data from '../../data.json';

const HISTORY_SIZE = 14;
const KV_KEY = 'recent';

export async function onRequestGet({ env }) {
  // Load history from KV
  const stored = await env.JOKE_HISTORY.get(KV_KEY);
  const history = stored ? JSON.parse(stored) : [];

  // Pick a joke not in history
  const available = data.filter(item => !history.includes(item));
  const pool = available.length > 0 ? available : data;
  const item = pool[Math.floor(Math.random() * pool.length)];

  // Update history
  history.push(item);
  if (history.length > HISTORY_SIZE) history.shift();
  await env.JOKE_HISTORY.put(KV_KEY, JSON.stringify(history));

  return new Response(item, {
    headers: {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    },
  });
}