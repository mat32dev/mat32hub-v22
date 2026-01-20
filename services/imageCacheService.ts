
/**
 * ImageCacheService: Optimización agresiva de carga.
 * Cachea imágenes en Base64 para carga instantánea en visitas recurrentes.
 */
class ImageCacheService {
  private storageKey = 'mat32_image_v2_cache';
  private quotaLimit = 4.5 * 1024 * 1024; // ~4.5MB límite preventivo de localStorage

  private getCache(): Record<string, { data: string; timestamp: number }> {
    try {
      const cached = localStorage.getItem(this.storageKey);
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  }

  private saveCache(cache: Record<string, any>) {
    try {
      const data = JSON.stringify(cache);
      if (data.length > this.quotaLimit) {
        // Limpieza inteligente: Eliminar el 40% más antiguo
        const sorted = Object.entries(cache).sort((a: any, b: any) => a[1].timestamp - b[1].timestamp);
        const reduced = Object.fromEntries(sorted.slice(Math.floor(sorted.length * 0.4)));
        localStorage.setItem(this.storageKey, JSON.stringify(reduced));
      } else {
        localStorage.setItem(this.storageKey, data);
      }
    } catch (e) {
      console.warn("Storage quota exceeded, clearing cache");
      localStorage.removeItem(this.storageKey);
    }
  }

  async getImage(url: string): Promise<string> {
    const cache = this.getCache();
    if (cache[url]) {
      cache[url].timestamp = Date.now();
      this.saveCache(cache);
      return cache[url].data;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) return url;
      const blob = await response.blob();
      
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          // Solo cacheamos si no es excesivamente grande (>500kb no se cachea para ahorrar cuota)
          if (base64.length < 500000) {
            cache[url] = { data: base64, timestamp: Date.now() };
            this.saveCache(cache);
          }
          resolve(base64);
        };
        reader.readAsDataURL(blob);
      });
    } catch {
      return url;
    }
  }
}

export const imageCache = new ImageCacheService();
