import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from 'react-router-dom';
import { Event } from '../types';

interface SEOProps {
  titleKey: string;
  descriptionKey: string;
  keywordsKey?: string;
  schemaType?: 'LocalBusiness' | 'Event' | 'MusicEvent' | 'MusicStore' | 'BarOrPub' | 'Product' | 'WebPage';
  image?: string;
  event?: Event;
}

export const SEO: React.FC<SEOProps> = ({
  titleKey,
  descriptionKey,
  keywordsKey,
  schemaType = 'LocalBusiness',
  image = "https://imagedelivery.net/f4c2d13d7f6a74d21dacac9c2eb7ba5d/7701241e-71ee-4929-18c0-d1d0d9576e00/public",
  event,
}) => {
  const { t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const siteTitle = titleKey.includes('.') ? t(titleKey) : titleKey;
    const finalTitle = `Mat32 | ${siteTitle}`;
    const siteDescription = descriptionKey.includes('.') ? t(descriptionKey) : descriptionKey;
    const canonical = `https://www.mat32.com${location.pathname === '/' ? '' : location.pathname}`;
    const ogImage = event?.imageUrl || image;

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
    updateMeta('og:image', ogImage, 'property');
    updateMeta('og:url', canonical, 'property');
    updateMeta('og:type', event ? 'music.song' : 'website', 'property');
    updateMeta('twitter:card', 'summary_large_image');

    if (keywordsKey) updateMeta('keywords', t(keywordsKey));

    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical);

    const existingScript = document.getElementById('json-ld-schema');
    if (existingScript) existingScript.remove();

    const localBusiness = {
      "@type": ["BarOrPub", "MusicStore", "LocalBusiness"],
      "@id": "https://www.mat32.com/#organization",
      "name": "Mat32 Valencia Discos Bar",
      "description": "Bar de discos de vinilo y cultura DJ en el barrio de Ruzafa, Valencia.",
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
      "sameAs": ["https://www.instagram.com/mat32__"]
    };

    const graph: any[] = [localBusiness];

    if (event && (schemaType === 'Event' || schemaType === 'MusicEvent')) {
      const timeParts = event.time ? event.time.split(/\s*[–\-]\s*/) : [];
      const startTime = timeParts[0]?.trim() || null;
      const endTimeRaw = timeParts[1]?.trim() || null;
      const startDate = event.date && startTime
        ? `${event.date}T${startTime}:00+01:00`
        : event.date;
      // If end time is early morning (e.g. 02:00), the event ends next day
      const endDate = endTimeRaw && event.date
        ? (() => {
            const startH = startTime ? parseInt(startTime.split(':')[0], 10) : 0;
            const endH = parseInt(endTimeRaw.split(':')[0], 10);
            const nextDay = endH < startH;
            if (nextDay) {
              const d = new Date(event.date);
              d.setDate(d.getDate() + 1);
              return `${d.toISOString().split('T')[0]}T${endTimeRaw}:00+01:00`;
            }
            return `${event.date}T${endTimeRaw}:00+01:00`;
          })()
        : undefined;

      graph.push({
        "@type": "MusicEvent",
        "@id": canonical,
        "name": event.title,
        "description": event.description,
        "startDate": startDate,
        ...(endDate ? { "endDate": endDate } : {}),
        "url": canonical,
        "image": event.imageUrl || image,
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": {
          "@type": "MusicVenue",
          "name": "MAT32 Valencia",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Calle Matías Perelló, 32",
            "addressLocality": "Valencia",
            "postalCode": "46005",
            "addressCountry": "ES"
          }
        },
        "organizer": {
          "@type": "Organization",
          "name": "MAT32 Valencia",
          "url": "https://www.mat32.com"
        },
        ...(event.price > 0 ? {
          "offers": {
            "@type": "Offer",
            "price": event.price,
            "priceCurrency": "EUR",
            "url": canonical,
            "availability": "https://schema.org/InStock"
          }
        } : {
          "offers": {
            "@type": "Offer",
            "price": 0,
            "priceCurrency": "EUR",
            "url": canonical,
            "availability": "https://schema.org/InStock"
          }
        }),
        ...(event.lineup?.length > 0 ? {
          "performer": event.lineup.map(a => ({
            "@type": "MusicGroup",
            "name": a.name
          }))
        } : {})
      });
    }

    const jsonLd = { "@context": "https://schema.org", "@graph": graph };
    const script = document.createElement('script');
    script.id = 'json-ld-schema';
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(jsonLd);
    document.head.appendChild(script);

  }, [t, titleKey, descriptionKey, keywordsKey, schemaType, image, event, location]);

  return null;
};
