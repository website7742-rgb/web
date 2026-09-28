import { Metadata } from 'next';
import { MOCK_ARTISTS } from '@/lib/data/mockData';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const targetSlug = decodeURIComponent(params.slug).toLowerCase().trim();
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.slug);

  const artist = MOCK_ARTISTS.find((a) => {
    if (isUUID) return a.id === params.slug;
    return (
      (a.slug && a.slug.toLowerCase().trim() === targetSlug) ||
      (a.name && a.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') === targetSlug)
    );
  });

  if (!artist) {
    return {
      title: 'Artist Profile | WorldStar Hip Hop',
      description: 'Official artist biography, music videos, and discography on WorldStar Hip Hop.',
    };
  }

  const title = `${artist.name} — Official Artist Profile & Discography`;
  const rawBio = artist.bio || `Official WorldStar profile for ${artist.name}, featuring official music videos, discography, and streaming statistics.`;
  const description = rawBio.length > 155 ? `${rawBio.slice(0, 152)}...` : rawBio;
  const canonicalPath = `/roster/${artist.slug || artist.id}`;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldstarhiphop.world').replace(/\/$/, '');

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${canonicalPath}`,
      siteName: 'WorldStar Hip Hop',
      images: artist.avatarUrl ? [{ url: artist.avatarUrl, alt: artist.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: artist.avatarUrl ? [artist.avatarUrl] : undefined,
    },
  };
}

export default function ArtistSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const targetSlug = decodeURIComponent(params.slug).toLowerCase().trim();
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.slug);

  const artist = MOCK_ARTISTS.find((a) => {
    if (isUUID) return a.id === params.slug;
    return (
      (a.slug && a.slug.toLowerCase().trim() === targetSlug) ||
      (a.name && a.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') === targetSlug)
    );
  });

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldstarhiphop.world').replace(/\/$/, '');

  const jsonLd = artist
    ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": siteUrl
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Artists",
                "item": `${siteUrl}/roster`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": artist.name,
                "item": `${siteUrl}/roster/${artist.slug || artist.id}`
              }
            ]
          },
          {
            "@type": "MusicGroup",
            "@id": `${siteUrl}/roster/${artist.slug || artist.id}#artist`,
            "name": artist.name,
            "description": artist.bio,
            "image": artist.avatarUrl,
            "genre": artist.genres,
            "url": `${siteUrl}/roster/${artist.slug || artist.id}`,
            "sameAs": Object.values(artist.socials || {}).filter(
              (url) => typeof url === 'string' && url.startsWith('http')
            )
          }
        ]
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
