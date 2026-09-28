import { Metadata } from 'next';
import { MOCK_RELEASES } from '@/lib/data/mockData';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const targetSlug = decodeURIComponent(params.slug).toLowerCase().trim();
  const release = MOCK_RELEASES.find(
    (r) =>
      r.id === params.slug ||
      (r.slug && r.slug.toLowerCase().trim() === targetSlug)
  );

  if (!release) {
    return {
      title: 'Record Release | WorldStar Hip Hop',
      description: 'Official master release from the WorldStar Hip Hop publishing catalog.',
    };
  }

  const title = `${release.title} by ${release.artistName} — Official ${release.type}`;
  const description = `Stream and explore "${release.title}" by ${release.artistName}. Official WorldStar Hip Hop ${release.type} release featuring ${release.tracksCount || 'full'} master tracks.`;
  const canonicalPath = `/releases/${release.slug || release.id}`;
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
      images: release.coverUrl ? [{ url: release.coverUrl, alt: release.title }] : undefined,
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
  const targetSlug = decodeURIComponent(params.slug).toLowerCase().trim();
  const release = MOCK_RELEASES.find(
    (r) =>
      r.id === params.slug ||
      (r.slug && r.slug.toLowerCase().trim() === targetSlug)
  );

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
                "item": `${siteUrl}/releases/${release.slug || release.id}`
              }
            ]
          },
          {
            "@type": "MusicAlbum",
            "@id": `${siteUrl}/releases/${release.slug || release.id}#album`,
            "name": release.title,
            "byArtist": {
              "@type": "MusicGroup",
              "name": release.artistName
            },
            "image": release.coverUrl,
            "datePublished": release.releaseDate,
            "numTracks": release.tracksCount,
            "url": `${siteUrl}/releases/${release.slug || release.id}`
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
