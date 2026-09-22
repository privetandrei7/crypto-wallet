const crypto = require('crypto');

const BASE = 'https://open.gasfree.io';
const PREFIX = '/tron';

function auth(path, method) {
  const key = process.env.GASFREE_API_KEY;
  const secret = process.env.GASFREE_API_SECRET;
  if (!key || !secret) throw new Error('GasFree API credentials are not configured');
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const message = method + path + timestamp;
  const signature = crypto.createHmac('sha256', secret).update(message).digest('base64');
  return {
    Timestamp: timestamp,
    Authorization: `ApiKey ${key}:${signature}`,
  };
}

async function gasfree(path, method = 'GET', body) {
  const headers = { ...auth(path, method), 'Content-Type': 'application/json' };
  const response = await fetch(BASE + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || `GasFree HTTP ${response.status}`);
  }
  return data;
}

export default {
  async fetch(request) {
    try {
      const url = new URL(request.url);
      const action = url.searchParams.get('action');

      if (request.method === 'GET' && action === 'token') {
        return Response.json(await gasfree(PREFIX + '/api/v1/config/token/all'));
      }

      if (request.method === 'GET' && action === 'providers') {
        return Response.json(await gasfree(PREFIX + '/api/v1/config/provider/all'));
      }

      if (request.method === 'GET' && action === 'address') {
        const account = url.searchParams.get('account');
        if (!account) return Response.json({ error: 'account is required' }, { status: 400 });
        return Response.json(await gasfree(PREFIX + '/api/v1/address/' + encodeURIComponent(account)));
      }

      if (request.method === 'GET' && action === 'status') {
        const id = url.searchParams.get('id');
        if (!id) return Response.json({ error: 'id is required' }, { status: 400 });
        return Response.json(await gasfree(PREFIX + '/api/v1/gasfree/' + encodeURIComponent(id)));
      }

      if (request.method === 'POST' && action === 'submit') {
        const body = await request.json();
        return Response.json(await gasfree(PREFIX + '/api/v1/gasfree/submit', 'POST', body));
      }

      return Response.json({ error: 'Unknown action' }, { status: 404 });
    } catch (error) {
      return Response.json({ error: error.message || 'GasFree proxy error' }, { status: 500 });
    }
  },
};
