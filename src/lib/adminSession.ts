const KNOWN_ADMIN_EMAILS = [
  'armyking1428@gmail.com',
  'admin@wshh.com',
  'website7742@gmail.com',
  'admin@worldstarhiphop.world',
];

function getSigningSecret(): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.AUTH_SECRET;
  if (!secret) {
    return 'wshh-secure-admin-signing-secret-2026-worldstar';
  }
  return secret;
}

// Convert ArrayBuffer to Hex String
function buf2hex(buffer: ArrayBuffer): string {
  return Array.prototype.map
    .call(new Uint8Array(buffer), (x: number) => ('00' + x.toString(16)).slice(-2))
    .join('');
}

// Universal HMAC-SHA256 signature using Web Crypto API
async function computeHmac(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
  return buf2hex(signatureBuffer);
}

/**
 * Creates a cryptographically signed (HMAC-SHA256) admin session token.
 * Format: <timestamp>:<email>:<hmacHex>
 */
export async function createSignedAdminToken(email: string): Promise<string> {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const timestamp = Date.now().toString();
  const payload = `${timestamp}:${normalizedEmail}`;
  const secret = getSigningSecret();

  const signature = await computeHmac(payload, secret);
  return `${payload}:${signature}`;
}

/**
 * Validates a signed admin session token.
 * Enforces cryptographic HMAC-SHA256 verification, timing-safe equality, expiry, and email authority.
 */
export async function verifySignedAdminToken(token?: string | null): Promise<{ valid: boolean; email?: string }> {
  if (!token || typeof token !== 'string') {
    return { valid: false };
  }

  const parts = token.split(':');
  if (parts.length !== 3) {
    return { valid: false };
  }

  const [timestampStr, email, providedSignature] = parts;
  const timestamp = parseInt(timestampStr, 10);

  if (isNaN(timestamp) || !email || !providedSignature) {
    return { valid: false };
  }

  // Enforce 24-hour expiration window
  const MAX_AGE_MS = 24 * 60 * 60 * 1000;
  if (Date.now() - timestamp > MAX_AGE_MS || timestamp > Date.now() + 60000) {
    return { valid: false };
  }

  // Verify email is in known admin list
  if (!KNOWN_ADMIN_EMAILS.includes(email.toLowerCase())) {
    return { valid: false };
  }

  // Recompute expected HMAC signature
  const payload = `${timestampStr}:${email}`;
  const secret = getSigningSecret();
  const expectedSignature = await computeHmac(payload, secret);

  // Timing-safe comparison using byte-by-byte constant-time loop
  if (providedSignature.length !== expectedSignature.length) {
    return { valid: false };
  }

  let mismatch = 0;
  for (let i = 0; i < providedSignature.length; i++) {
    mismatch |= providedSignature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
  }

  if (mismatch !== 0) {
    return { valid: false };
  }

  return { valid: true, email };
}
