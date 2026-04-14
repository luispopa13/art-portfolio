import { useEffect } from 'react';

export function useSEO({ 
  title = "Art by Maise- Original Paintings", 
  description = "Explore unique original paintings that capture emotion and beauty.",
  image = "/og-image.jpg"
}) {
  useEffect(() => {
    // Set page title
    const fullTitle = title.includes("Art by Misa") ? title : `${title} - Art by Misa`;
    document.title = fullTitle;

    // Set meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;

    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:type', content: 'website' }
    ];

    ogTags.forEach(tag => {
      let element = document.querySelector(`meta[property="${tag.property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', tag.property);
        document.head.appendChild(element);
      }
      element.content = tag.content;
    });

  }, [title, description, image]);
}