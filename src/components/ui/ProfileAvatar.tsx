'use client';

import React, { useState, useEffect } from 'react';

export const WORLDSTAR_CROWN_FALLBACK = '/branding/WORLDSTARHIPHOP_idk2EHwctZ_2.png';

/**
 * Checks whether a provided image URL is a genuine profile/media image
 * and not a known placeholder, Wikipedia icon, or invalid string.
 */
export function isValidProfileImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (
    !trimmed ||
    trimmed === 'UNVERIFIED' ||
    trimmed === 'null' ||
    trimmed === 'undefined' ||
    trimmed === '/placeholder.png' ||
    trimmed.includes('Instagram_logo_2022') ||
    trimmed.includes('Burger_Recipe') ||
    trimmed.includes('ui-avatars.com')
  ) {
    return false;
  }
  return true;
}

/**
 * Derives uppercase 2-letter initials from a user or artist name.
 */
export function getInitialsFromName(name?: string | null, fallback = 'WS'): string {
  if (!name || typeof name !== 'string') return fallback;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export type FallbackTier = 1 | 2 | 3 | 4;

export interface ProfileAvatarProps {
  /** Priority 1: Real profile image (remote URL, Instagram URL, Supabase/Cloudflare URL) */
  src?: string | null;
  /** Priority 2: Verified local asset specifically associated with this artist/profile */
  localAsset?: string | null;
  /** Alt text for accessibility */
  alt?: string;
  /** Full name or username used to calculate generic initials (Tier 4) */
  name?: string;
  /** Explicit custom initials if desired */
  initials?: string;
  /** Container CSS classes */
  className?: string;
  /** Inner img CSS classes */
  imgClassName?: string;
  /** If true, eagerly load the image */
  priority?: boolean;
  /** Optional callback to notify parent which tier is currently rendered */
  onTierChange?: (tier: FallbackTier, activeSrc: string | null) => void;
}

/**
 * ProfileAvatar enforces the strict 4-tier asset fallback priority:
 * 1. Valid real profile/Instagram image
 * 2. Verified profile-specific local asset
 * 3. Official WorldStar fallback (public/branding/WORLDSTARHIPHOP_idk2EHwctZ_2.png)
 * 4. Generic initials / avatar (rendered ONLY if the official WorldStar fallback is unavailable or fails to load)
 */
export default function ProfileAvatar({
  src,
  localAsset,
  alt,
  name,
  initials,
  className = 'w-full h-full',
  imgClassName = 'w-full h-full object-cover',
  priority = false,
  onTierChange,
}: ProfileAvatarProps) {
  // Determine starting tier based on availability of valid sources
  const getInitialTier = (): { tier: FallbackTier; initialSrc: string | null } => {
    if (isValidProfileImageUrl(src)) {
      return { tier: 1, initialSrc: src!.trim() };
    }
    if (isValidProfileImageUrl(localAsset)) {
      return { tier: 2, initialSrc: localAsset!.trim() };
    }
    return { tier: 3, initialSrc: WORLDSTAR_CROWN_FALLBACK };
  };

  const initial = getInitialTier();
  const [tier, setTier] = useState<FallbackTier>(initial.tier);
  const [currentSrc, setCurrentSrc] = useState<string | null>(initial.initialSrc);

  // Sync state when props change (e.g. after upload or artist change)
  useEffect(() => {
    const updated = getInitialTier();
    setTier(updated.tier);
    setCurrentSrc(updated.initialSrc);
    if (onTierChange) {
      onTierChange(updated.tier, updated.initialSrc);
    }
  }, [src, localAsset]);

  const handleImageError = () => {
    if (tier === 1) {
      // Step down to Tier 2 if verified local asset exists, else to Tier 3
      if (isValidProfileImageUrl(localAsset)) {
        setTier(2);
        setCurrentSrc(localAsset!.trim());
        onTierChange?.(2, localAsset!.trim());
      } else {
        setTier(3);
        setCurrentSrc(WORLDSTAR_CROWN_FALLBACK);
        onTierChange?.(3, WORLDSTAR_CROWN_FALLBACK);
      }
    } else if (tier === 2) {
      // Step down from Tier 2 to Tier 3
      setTier(3);
      setCurrentSrc(WORLDSTAR_CROWN_FALLBACK);
      onTierChange?.(3, WORLDSTAR_CROWN_FALLBACK);
    } else if (tier === 3) {
      // Step down from Tier 3 to Tier 4 (Generic initials) ONLY if WorldStar crown fails to load
      setTier(4);
      setCurrentSrc(null);
      onTierChange?.(4, null);
    }
  };

  const derivedInitials = initials || getInitialsFromName(name, 'WS');
  const safeAlt = alt || name || 'WorldStar Profile';

  // Tier 4: Generic initials / avatar
  if (tier === 4 || !currentSrc) {
    return (
      <div
        className={`flex items-center justify-center bg-neutral-900 border border-neutral-700 text-red-500 font-mono font-black select-none ${className}`}
        aria-label={safeAlt}
      >
        <span className="tracking-widest">{derivedInitials}</span>
      </div>
    );
  }

  // Tiers 1, 2, 3: Render image
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={safeAlt}
      referrerPolicy="no-referrer"
      loading={priority ? 'eager' : 'lazy'}
      onError={handleImageError}
      className={imgClassName}
    />
  );
}
