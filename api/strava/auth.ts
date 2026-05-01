import type { VercelRequest, VercelResponse } from '@vercel/node';

function resolveRedirectUri(req: VercelRequest): string {
  const configured = process.env.STRAVA_REDIRECT_URI?.trim();
  if (configured) return configured;

  const protoHeader = (req.headers['x-forwarded-proto'] as string | undefined)?.split(',')[0]?.trim();
  const hostHeader = (req.headers['x-forwarded-host'] as string | undefined)?.split(',')[0]?.trim() || req.headers.host;
  const protocol = protoHeader || 'https';
  return `${protocol}://${hostHeader}/api/strava/callback`;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const clientId = process.env.STRAVA_CLIENT_ID?.trim();
  const redirectUri = resolveRedirectUri(req);

  if (!clientId) {
    res.status(500).send('Missing STRAVA_CLIENT_ID');
    return;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    approval_prompt: 'force',
    scope: 'read_all,activity:read_all,profile:read_all',
  });

  if (String(req.query.debug ?? '') === '1') {
    res.status(200).json({
      clientId,
      redirectUri,
      authorizeUrl: `https://www.strava.com/oauth/authorize?${params.toString()}`,
      host: req.headers.host ?? '',
      forwardedHost: req.headers['x-forwarded-host'] ?? '',
      forwardedProto: req.headers['x-forwarded-proto'] ?? '',
    });
    return;
  }

  res.redirect(`https://www.strava.com/oauth/authorize?${params.toString()}`);
}
