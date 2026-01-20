
import React, { useState, useEffect } from 'react';
import { imageCache } from '../services/imageCacheService';

interface CachedImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const CachedImage: React.FC<CachedImageProps> = ({ src, alt, className }) => {
  const [displaySrc, setDisplaySrc] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      // Intentar cargar desde la caché de localStorage
      const cached = await imageCache.getImage(src);
      if (isMounted) {
        setDisplaySrc(cached);
      }
    };

    loadImage();
    return () => { isMounted = false; };
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-mat-800 ${className}`}>
      {/* Shimmer effect placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" 
             style={{ backgroundSize: '200% 100%' }}></div>
      )}
      
      {displaySrc && (
        <img
          src={displaySrc}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
        />
      )}
    </div>
  );
};

// CSS adicional inyectado dinámicamente o añadir a index.html
// @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
