import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component for managing document head metadata
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Meta description
 * @param {string} props.canonical - Canonical URL
 * @param {string} props.ogImage - Open Graph image URL
 * @param {string} props.ogType - Open Graph type (website, article, etc.)
 * @param {Object} props.structuredData - JSON-LD structured data object
 */
const SEO = ({ 
  title, 
  description, 
  canonical, 
  ogImage, 
  ogType = 'website',
  structuredData 
}) => {
  const siteName = 'Studly';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = 'Studly is the ultimate interactive e-learning platform where students share knowledge, track progress, and learn together effectively.';
  const metaDescription = description || defaultDescription;
  const siteUrl = 'https://usestudly.com'; // Replace with actual production URL if different
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const defaultOgImage = `${siteUrl}/logo512.png`;
  const metaOgImage = ogImage || defaultOgImage;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaOgImage} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaOgImage} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
