
import React, { useState } from 'react';
import { optimizeImageUrl } from '../services/dataService';
import { Disc } from 'lucide-react';

interface CachedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  aspectRatio?: string;
}

export const CachedImage: React.FC<CachedImageProps> = ({ 
  src, 
  alt, 
  className, 
  priority = false,
  aspectRatio = "aspect-square" 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const optimizedSrc = optimizeImageUrl(src, priority ? 1200 : 800);

  return (
    <div className={`relative overflow-hidden bg-mat-800 ${aspectRatio} ${className}`}>
      {/* SKELETON / PLACEHOLDER */}
      {(!isLoaded && !hasError) && (
        <div className="absolute inset-0 z-0 flex items-center justify-center">
           <div className="w-full h-full bg-gradient-to-tr from-mat-900 via-mat-800 to-mat-900 animate-pulse"></div>
        </div>
      )}

      {/* ERROR PLACEHOLDER (VINYL SPINNING) */}
      {hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-mat-900 border border-mat-800 p-6 text-center">
           <Disc className="w-12 h-12 text-mat-700 animate-spin-slow mb-3" />
           <span className="text-[8px] font-black text-mat-700 uppercase tracking-widest">SIGNAL_LOST_RETRYING</span>
        </div>
      )}
      
      {!hasError && (
        <img
          src={optimizedSrc}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          loading={priority ? "eager" : "lazy"}
          // @ts-ignore
          fetchpriority={priority ? "high" : "auto"}
          className={`w-full h-full object-cover transition-all duration-1000 ease-out ${
            isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-xl'
          }`}
        />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
    </div>
  );
};
