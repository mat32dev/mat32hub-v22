
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('mat32_wishlist');
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse wishlist", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mat32_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const isInWishlist = (id: string) => wishlist.includes(id);

  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      toggleWishlist, 
      isInWishlist, 
      wishlistCount: wishlist.length 
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
