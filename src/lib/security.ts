/**
 * 🛡️ Security Utilities - WorldStar Hip Hop
 * Defense-in-depth protection against Open Redirects, HTML Injection, and Path Traversal
 */

/**
 * Validates and returns a safe local relative redirect URL to prevent Open Redirect vulnerabilities.
 * Disallows protocol-relative URLs (e.g. //evil.com), backslashes, and URI schemes (e.g. javascript:, https:).
 */
export function getSafeRedirectUrl(target: string | null | undefined, defaultUrl: string = '/profile'): string {
  if (!target || typeof target !== 'string') {
    return defaultUrl;
  }

  const trimmed = target.trim();

  // Must start with exactly one '/' and not '//' or '/\'
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.startsWith('/\\')) {
    return defaultUrl;
  }

  // Must not contain backslashes which some browsers parse as path separators
  if (trimmed.includes('\\')) {
    return defaultUrl;
  }

  // Must not contain any protocol scheme before query/hash (e.g. /foo:bar or javascript:)
  const pathPart = trimmed.split(/[?#]/)[0];
  if (pathPart.includes(':')) {
    return defaultUrl;
  }

  // Must not contain control characters or newlines (CRLF injection)
  if (/[\x00-\x1F\x7F]/.test(trimmed)) {
    return defaultUrl;
  }

  return trimmed;
}

/**
 * Escapes HTML characters to prevent XSS / HTML Injection in emails and server templates.
 */
export function escapeHtml(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitizes an R2 storage object key to prevent path traversal and ensure safe storage structure.
 */
export function sanitizeR2Key(key: string | null | undefined): string | null {
  if (!key || typeof key !== 'string') return null;
  const trimmed = key.trim();

  // Prevent directory traversal
  if (trimmed.includes('..')) return null;

  // Disallow leading / or \
  if (trimmed.startsWith('/') || trimmed.startsWith('\\')) return null;

  // Disallow control characters
  if (/[\x00-\x1F\x7F]/.test(trimmed)) return null;

  // Max key length
  if (trimmed.length > 512) return null;

  // Ensure key only contains safe alphanumeric, slash, dot, underscore, dash
  if (!/^[a-zA-Z0-9_\-\.\/]+$/.test(trimmed)) return null;

  return trimmed;
}
