import data from '../../data.json';

const HISTORY_SIZE = 5;

export async function onRequestGet({ request, env }) {
  if (!env.API_History) {
    return new Response('KV not bound', { status: 500 });
  }

  const url = new URL(request.url);
  const category = url.searchParams.get('category') || 'all';

  // Filter by category
  const pool = category === 'all'
    ? data
    : data.filter(item => item.category === category);

  if (pool.length === 0) {
    return new Response('Unknown category', { status: 404 });
  }

  // History is tracked per category
  const kvKey = `history:${category}`;
  const stored = await env.API_History.get(kvKey);
  const history = stored ? JSON.parse(stored) : [];

  // Pick a joke not in history
  const available = pool.filter(item => !history.includes(item.joke));
  const source = available.length > 0 ? available : pool;
  const item = source[Math.floor(Math.random() * source.length)];

  // Update history
  history.push(item.joke);
  if (history.length > HISTORY_SIZE) history.shift();
  await env.API_History.put(kvKey, JSON.stringify(history));

  return new Response(item.joke, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    },
  });
}