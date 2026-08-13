'use client';

import { useEffect } from 'react';

export default function UrlSecurityGuard() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      let changed = false;

      if (url.searchParams.has('code') || url.searchParams.has('error')) {
        url.searchParams.delete('code');
        url.searchParams.delete('error');
        url.searchParams.delete('error_description');
        url.searchParams.delete('error_code');
        changed = true;
      }

      if (url.hash.includes('access_token') || url.hash.includes('error')) {
        url.hash = '';
        changed = true;
      }

      if (changed) {
        window.history.replaceState({}, document.title, url.toString());
      }
    }
  }, []);

  return null;
}
