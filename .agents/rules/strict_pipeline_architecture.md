# Strict Pipeline Architecture Rule

From this point forward, all feature development in this repository MUST adhere to the **Strict Pipeline Architecture** rule:

1. **Zero Fragmented Code:** Every feature built must be a complete end-to-end pipeline:
   `[Polished UI Component]` ➔ `[React State / Optimistic UX]` ➔ `[Secure Server Action / API]` ➔ `[Supabase DB Mutation / Query]` ➔ `[Next.js ISR Cache Revalidation]`.
2. **Pristine Quality:** No isolated UI components without backend logic, no mock fallbacks where live database pipelines exist, and no unhandled exceptions.
3. **Database & Scale Hardening:** All foreign key relationships must include B-Tree indexes, race conditions must be handled atomically (e.g. Postgres unique constraint `23505` catches), and input debouncing/throttling must be enforced.
