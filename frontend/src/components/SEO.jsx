import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title = "Art by Maise- Original Paintings", 
  description = "Explore unique original paintings that capture emotion and beauty. Each piece tells a story through color and form.",
  image = "/og-image.jpg",
  url = window.location.href,
  type = "website"
}) {
  const fullTitle = title.includes("Art by Misa") ? title : `${title} - Art by Misa`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
}