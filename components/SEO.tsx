
// Added React to imports to resolve "Cannot find namespace 'React'" error on line 14
import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  titleKey: string;
  descriptionKey: string;
  keywordsKey?: string;
  schemaType?: 'LocalBusiness' | 'Event' | 'MusicEvent' | 'MusicStore' | 'BarOrPub' | 'Product' | 'WebPage';
  image?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  titleKey, 
  descriptionKey, 
  keywordsKey,
  schemaType = 'LocalBusiness',
  image = "https://imagedelivery.net/f4c2d13d7f6a74d21dacac9c2eb7ba5d/7701241e-71ee-4929-18c0-d1d0d9576e00/public"
}) => {
  const { t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const siteTitle = titleKey.includes('.') ? t(titleKey) : titleKey;
    const finalTitle = `Mat32 | ${siteTitle}`;
    const siteDescription = t(descriptionKey);
    const canonical = `https://www.mat32.com${location.pathname === '/' ? '' : location.pathname}`;
    
    document.title = finalTitle;

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
    updateMeta('og:title', finalTitle, 'property');
    updateMeta('og:description', siteDescription, 'property');
    updateMeta('og:image', image, 'property');
    updateMeta('og:url', canonical, 'property');
    updateMeta('og:type', 'website', 'property');
    updateMeta('twitter:card', 'summary_large_image');
    
    if (keywordsKey) {
      updateMeta('keywords', t(keywordsKey));
    }
    
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
      "@graph": [
        {
          "@type": ["BarOrPub", "MusicStore", "LocalBusiness"],
          "@id": "https://www.mat32.com/#organization",
          "name": "Mat32 Valencia Discos Bar",
          "description": siteDescription,
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
          "openingHours": "Th,Fr,Sa 18:00-02:00",
          "priceRange": "$$",
          "sameAs": [
            "https://www.instagram.com/mat32__"
          ]
        }
      ]
    };

    const script = document.createElement('script');
    script.id = 'json-ld-schema';
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(jsonLd);
    document.head.appendChild(script);

  }, [t, titleKey, descriptionKey, keywordsKey, schemaType, image, location]);

  return null;
};
