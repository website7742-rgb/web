import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MOCK_ARTISTS } from '@/lib/data/mockData';
import { artistsPart2 } from '@/constants/mockPart2';
import { Artist } from '@/types';

function getArtist(rawSlug: string): Artist | undefined {
  const targetSlug = decodeURIComponent(rawSlug).toLowerCase().trim();
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawSlug);
  const allArtists = [...(MOCK_ARTISTS || []), ...(artistsPart2 || [])];

  return allArtists.find((a) => {
    if (isUUID) return a.id === rawSlug;
    return (
      (a.slug && a.slug.toLowerCase().trim() === targetSlug) ||
      (a.name && a.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') === targetSlug)
    );
  });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const artist = getArtist(params.slug);

  if (!artist) {
    return {
      title: 'Artist Not Found | WorldStar Hip Hop',
      description: 'The requested artist profile does not exist on WorldStar Hip Hop.',
    };
  }

  const title = `${artist.name} — Official Artist Profile & Discography`;
  const rawBio = artist.bio || `Official WorldStar profile for ${artist.name}, featuring official music videos, discography, and streaming statistics.`;
  const description = rawBio.length > 155 ? `${rawBio.slice(0, 152)}...` : rawBio;
  const canonicalPath = `/roster/${artist.slug || artist.id}`;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldstarhiphop.world').replace(/\/$/, '');
  const imageUrl = artist.avatarUrl || artist.heroUrl || `${siteUrl}/og-image.png`;

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
      type: 'profile',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: `${artist.name} Profile Photo`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@worldstar',
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
  const artist = getArtist(params.slug);

  if (!artist) {
    notFound();
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldstarhiphop.world').replace(/\/$/, '');

  const sameAsList = Object.values(artist.socials || {}).filter(
    (url) => typeof url === 'string' && url.startsWith('http')
  );

  const jsonLd = {
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
        "description": artist.bio || artist.tagline || `${artist.name} on WorldStar Hip Hop.`,
        "image": artist.avatarUrl || artist.heroUrl,
        "genre": artist.genres && artist.genres.length > 0 ? artist.genres : ["Hip-Hop", "Rap"],
        "url": `${siteUrl}/roster/${artist.slug || artist.id}`,
        "sameAs": sameAsList.length > 0 ? sameAsList : undefined
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
