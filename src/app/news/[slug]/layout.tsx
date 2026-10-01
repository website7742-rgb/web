import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MOCK_NEWS } from '@/lib/data/mockData';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const targetSlug = decodeURIComponent(params.slug).toLowerCase().trim();
  const article = MOCK_NEWS.find(
    (n) =>
      n.id === params.slug ||
      (n.slug && n.slug.toLowerCase().trim() === targetSlug)
  );

  if (!article) {
    return {
      title: 'Article Not Found | WorldStar Hip Hop',
      description: 'The requested news article could not be located.',
    };
  }

  const title = article.title;
  const description = article.summary || 'Exclusive hip-hop journalism and industry reportage from WorldStar Hip Hop.';
  const canonicalPath = `/news/${article.slug || article.id}`;
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
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
      images: article.imageUrl ? [{ url: article.imageUrl, alt: article.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: article.imageUrl ? [article.imageUrl] : undefined,
    },
  };
}

export default function NewsArticleSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const targetSlug = decodeURIComponent(params.slug).toLowerCase().trim();
  const article = MOCK_NEWS.find(
    (n) =>
      n.id === params.slug ||
      (n.slug && n.slug.toLowerCase().trim() === targetSlug)
  );

  if (!article) {
    notFound();
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldstarhiphop.world').replace(/\/$/, '');

  const jsonLd = article
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
                "name": "News",
                "item": `${siteUrl}/news`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": article.title,
                "item": `${siteUrl}/news/${article.slug || article.id}`
              }
            ]
          },
          {
            "@type": "NewsArticle",
            "@id": `${siteUrl}/news/${article.slug || article.id}#article`,
            "headline": article.title,
            "description": article.summary,
            "image": article.imageUrl,
            "datePublished": article.date,
            "dateModified": article.date,
            "author": {
              "@type": "Person",
              "name": article.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "WorldStar Hip Hop",
              "url": siteUrl,
              "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/favicon.svg`
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `${siteUrl}/news/${article.slug || article.id}`
            }
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
