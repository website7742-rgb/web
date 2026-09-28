import { Metadata } from 'next';
import { getReleaseBySlugOrId } from '@/lib/data/verifiedReleases';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const release = getReleaseBySlugOrId(params.slug);
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldstarhiphop.world').replace(/\/$/, '');

  if (!release) {
    return {
      title: 'Record Release | WorldStar Hip Hop',
      description: 'Official master release from the WorldStar Hip Hop publishing catalog.',
      alternates: {
        canonical: `${siteUrl}/releases`,
      },
    };
  }

  const title = `${release.title} by ${release.artistName} | WorldStar Hip Hop`;
  const description = `Stream and explore "${release.title}" by ${release.artistName}. Official WorldStar Hip Hop ${release.type.toLowerCase()} release in ${release.genre || 'Hip-Hop'} featuring ${release.tracksCount} master track${release.tracksCount > 1 ? 's' : ''}.`;
  const canonicalUrl = `${siteUrl}/releases/${release.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'WorldStar Hip Hop',
      images: release.coverUrl ? [{ url: release.coverUrl, alt: `${release.title} by ${release.artistName}` }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: release.coverUrl ? [release.coverUrl] : undefined,
    },
  };
}

export default function ReleaseSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const release = getReleaseBySlugOrId(params.slug);
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldstarhiphop.world').replace(/\/$/, '');

  const jsonLd = release
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
                "name": "Releases",
                "item": `${siteUrl}/releases`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": release.title,
                "item": `${siteUrl}/releases/${release.slug}`
              }
            ]
          },
          release.type === 'ALBUM'
            ? {
                "@type": "MusicAlbum",
                "@id": `${siteUrl}/releases/${release.slug}#album`,
                "name": release.title,
                "byArtist": {
                  "@type": "MusicGroup",
                  "name": release.artistName,
                  ...(release.artistSlug ? { "@id": `${siteUrl}/roster/${release.artistSlug}` } : {})
                },
                "genre": release.genre || "Hip-Hop",
                "datePublished": release.releaseDate,
                "image": release.coverUrl,
                "numTracks": release.tracksCount,
                "publisher": {
                  "@type": "Organization",
                  "name": "WorldStar Hip Hop",
                  "url": siteUrl
                },
                ...(release.spotifyUrl ? { "sameAs": release.spotifyUrl } : {})
              }
            : {
                "@type": "MusicRecording",
                "@id": `${siteUrl}/releases/${release.slug}#recording`,
                "name": release.title,
                "byArtist": {
                  "@type": "MusicGroup",
                  "name": release.artistName,
                  ...(release.artistSlug ? { "@id": `${siteUrl}/roster/${release.artistSlug}` } : {})
                },
                "genre": release.genre || "Hip-Hop",
                "datePublished": release.releaseDate,
                "image": release.coverUrl,
                "inAlbum": {
                  "@type": "MusicAlbum",
                  "name": `${release.title} - Single`
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "WorldStar Hip Hop",
                  "url": siteUrl
                },
                ...(release.spotifyUrl ? { "sameAs": release.spotifyUrl } : {})
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
