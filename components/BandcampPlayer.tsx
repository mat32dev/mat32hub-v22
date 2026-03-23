import React from 'react';

interface BandcampPlayerProps {
  src: string;
  affiliateUrl?: string;
}

export const BandcampPlayer: React.FC<BandcampPlayerProps> = ({ src, affiliateUrl }) => {
  if (!src || !src.includes('EmbeddedPlayer')) return null;

  return (
    <div className="rounded-2xl overflow-hidden border border-mat-700 bg-mat-950 my-8">
      <iframe
        src={src}
        className="w-full"
        style={{ height: '120px', border: 0 }}
        seamless
        allow="autoplay"
        title="Bandcamp player"
      />
      {affiliateUrl && (
        <a
          href={affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-mat-500 transition-colors border-t border-mat-700"
        >
          ESCUCHAR Y COMPRAR EN BANDCAMP ↗
        </a>
      )}
    </div>
  );
};
