
import React, { useState } from 'react';
import { optimizeImageUrl } from '../services/dataService';

interface CachedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean; // Si es true, carga inmediatamente (para el Hero)
  aspectRatio?: string; // Ej: "1/1", "16/9"
}

export const CachedImage: React.FC<CachedImageProps> = ({ 
  src, 
  alt, 
  className, 
  priority = false,
  aspectRatio = "aspect-square" 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Optimizamos la URL antes de cargar
  const optimizedSrc = optimizeImageUrl(src, priority ? 1200 : 800);

  return (
    <div className={`relative overflow-hidden bg-mat-800 ${aspectRatio} ${className}`}>
      {/* Skeleton / Placeholder animado */}
      {!isLoaded && (
        <div className="absolute inset-0 z-0 flex items-center justify-center">
           <div className="w-full h-full bg-gradient-to-tr from-mat-900 via-mat-800 to-mat-900 animate-pulse"></div>
        </div>
      )}
      
      <img
        src={optimizedSrc}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        loading={priority ? "eager" : "lazy"}
        // @ts-ignore - Atributo moderno para prioridad de carga
        fetchpriority={priority ? "high" : "auto"}
        className={`w-full h-full object-cover transition-all duration-1000 ease-out ${
          isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-xl'
        }`}
      />
      
      {/* Overlay sutil para mejorar legibilidad de texto si hay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
    </div>
  );
};
