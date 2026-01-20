
import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  titleKey: string;
  descriptionKey: string;
  schemaType?: 'LocalBusiness' | 'Event' | 'CollectionPage' | 'Product' | 'WebPage' | 'MusicStore' | 'BarOrPub';
  image?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  titleKey, 
  descriptionKey, 
  schemaType = 'LocalBusiness',
  image = "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200"
}) => {
  const { t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const siteTitle = `Mat32 | ${t(titleKey)}`;
    const siteDescription = t(descriptionKey);
    const canonical = `https://www.mat32.com${location.pathname === '/' ? '' : location.pathname}`;
    
    document.title = siteTitle;

    const updateMeta = (name: string, content: string, attr: string = 'name') => {
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMeta('description', siteDescription);
    updateMeta('og:title', siteTitle, 'property');
    updateMeta('og:description', siteDescription, 'property');
    updateMeta('og:image', image, 'property');
    updateMeta('og:url', canonical, 'property');
    updateMeta('og:type', 'website', 'property');
    updateMeta('twitter:card', 'summary_large_image');
    
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical);

    const existingScript = document.getElementById('json-ld-schema');
    if (existingScript) existingScript.remove();

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": ["BarOrPub", "MusicStore", "LocalBusiness"],
      "name": "Mat32 Valencia Discos Bar",
      "description": "El mejor sonido Hi-Fi de Valencia. Alquiler de local para eventos privados en Ruzafa.",
      "url": "https://www.mat32.com",
      "image": image,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Calle Matías Perelló, 32",
        "addressLocality": "Valencia",
        "postalCode": "46005",
        "addressCountry": "ES"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 39.461159,
        "longitude": -0.370535
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Thursday", "Friday", "Saturday"],
          "opens": "18:00",
          "closes": "02:00"
        }
      ],
      "priceRange": "$$",
      "telephone": "+34960000032"
    };

    const script = document.createElement('script');
    script.id = 'json-ld-schema';
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(jsonLd);
    document.head.appendChild(script);

  }, [t, titleKey, descriptionKey, schemaType, image, location]);

  return null;
};
