
/**
 * ImageCacheService: Optimización de carga mediante persistencia local.
 * Almacena imágenes en base64 para carga instantánea.
 */
class ImageCacheService {
  private storageKey = 'mat32_img_blob_cache';
  private maxItems = 40; // Límite razonable para no saturar localStorage

  private getCache(): Record<string, { data: string; timestamp: number }> {
    try {
      const cached = localStorage.getItem(this.storageKey);
      return cached ? JSON.parse(cached) : {};
    } catch (e) {
      console.warn("Caché de imágenes inaccesible");
      return {};
    }
  }

  private saveCache(cache: Record<string, any>) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(cache));
    } catch (e) {
      // Si falla por cuota, limpiamos la mitad de la caché (las más antiguas)
      const sortedKeys = Object.entries(cache)
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)
        .map(([key]) => key);
      
      const half = Math.floor(sortedKeys.length / 2);
      const newCache = { ...cache };
      for (let i = 0; i < half; i++) {
        delete newCache[sortedKeys[i]];
      }
      localStorage.setItem(this.storageKey, JSON.stringify(newCache));
    }
  }

  async getImage(url: string): Promise<string> {
    const cache = this.getCache();
    
    // 1. Si está en caché, actualizar timestamp y devolver
    if (cache[url]) {
      cache[url].timestamp = Date.now();
      this.saveCache(cache);
      return cache[url].data;
    }

    // 2. Si no está, descargar y convertir a Base64
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          // Guardar en caché
          cache[url] = { data: base64data, timestamp: Date.now() };
          this.saveCache(cache);
          resolve(base64data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error cacheando imagen:", url);
      return url; // Devolver URL original si falla
    }
  }

  clearCache() {
    localStorage.removeItem(this.storageKey);
  }
}

export const imageCache = new ImageCacheService();
