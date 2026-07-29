# HOF SECURE PIPELINE ARCHITECTURE & BLINDSPOT REMEDIATION

The CISO's assessment is accurate. The previous mitigation closed the front door, but the Server Action pipeline still contained structural blind spots that could be exploited via CSRF, Parameter Pollution, and Magic Bytes Spoofing.

## Uncovered Blind Spots
1. **Next.js CSRF on Server Actions:** While Next.js 14 does implement strict Origin checks for Server Actions internally, standard API routes or custom Server Action implementations sometimes leak if not strictly bound. We must explicitly validate the `Origin` header against the `Host` header within the HOF to enforce absolute strictness.
2. **Magic Bytes Spoofing:** Checking the `.type` property of a `File` object is client-driven (controlled by the attacker). An attacker can rename `malware.exe` to `payload.png` and bypass the previous check. We must read the binary header (Magic Bytes) of the file chunk to mathematically prove its MIME type.
3. **Parameter Pollution / Type Juggling:** `formData.get('key')` can return a `File`, `string`, or `null`. If a string was expected but a file was sent (or an array of values where one was expected), it can crash the backend or manipulate logic. We need strict type assertion.

## Proposed Changes

### [NEW] `src/lib/safeAction.ts`
Create the Higher-Order Function (HOF) `withAdminAuthAndRateLimit` that will wrap all admin-level server actions.
- **Rate Limiting:** Implements a sliding window rate limiter (mocked gracefully if Redis env vars are absent).
- **Origin Validation (CSRF):** Extracts `headers().get('origin')` and strictly compares it to `headers().get('host')`.
- **Strict RBAC:** Uses `supabase.auth.getUser()` and explicitly verifies the user's role/clearance before invoking the wrapped action.
- **Global Try/Catch:** Centralizes error handling so no internal DB errors ever leak to the client.

### [MODIFY] `src/actions/adminActions.ts`
Refactor `addArtist`, `deleteArtist`, and `addVideo` to be wrapped by `withAdminAuthAndRateLimit`.
- Remove redundant auth checks (now handled by the HOF).
- Safely extract and assert parameters.

### [MODIFY] `src/actions/storageActions.ts`
Refactor `uploadToR2` to be wrapped by `withAdminAuthAndRateLimit`.
- Implement **OOM Prevention:** Check `file.size` *before* allocating `file.arrayBuffer()`.
- Implement **Magic Bytes Validation:** Slice the first 4-12 bytes of the file and verify the hexadecimal signature (e.g., `89504E47` for PNG, `FFD8FF` for JPEG) to definitively block disguised malware.

## User Review Required
> [!CAUTION]
> This refactor aggressively locks down Server Actions. If any current admin user does not have `admin@wshh.com` as their email (our fallback RBAC check), they will be locked out.
> The Rate Limiter will currently fallback to a passthrough if Upstash Redis env vars are not configured, ensuring local dev isn't broken.

## Verification Plan
1. Send a request with a spoofed `Origin` header to verify the CSRF block.
2. Attempt to upload a dummy text file renamed to `.png` to verify the Magic Bytes block.
3. Execute standard admin actions to confirm legitimate traffic passes through the HOF cleanly.
