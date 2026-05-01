import type { VercelResponse } from '@vercel/node';

function resolveAllowedOrigin(): string {
  const configured = process.env.FRONTEND_URL?.trim();
  if (!configured) return '*';

  try {
    return new URL(configured).origin;
  } catch {
    return configured;
  }
}

export function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', resolveAllowedOrigin());
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
