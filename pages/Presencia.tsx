import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export const Presencia: React.FC = () => {
  return (
    <div className="min-h-screen bg-ink text-paper pb-24">
      <SEO titleKey="Presencia · MAT32 Valencia" descriptionKey="En MAT32 no está prohibido mirar el móvil. Solo te invitamos a no hacerlo." />

      <div className="container mx-auto px-6 md:px-10 pt-24 md:pt-32 max-w-2xl">

        <div className="text-center mb-20">
          <div className="mono-tag" style={{ color: '#c8462a' }}>PRESENCIA</div>
          <h1 className="display mt-6" style={{ fontSize: 'clamp(40px, 6vw, 80px)', lineHeight: 0.9 }}>
            Aquí no se<br/>mira el móvil.
          </h1>
        </div>

        <div className="space-y-12 serif-italic text-paper/70 leading-relaxed">

          <p className="text-xl">
            No está prohibido. Solo te invitamos a no hacerlo.
          </p>

          <p className="text-lg">
            El sistema Altec A7 está encendido. Los vinilos giran.
            No hay grabación que mejore lo que está pasando ahora.
          </p>

          <p className="text-lg">
            Una luz de pantalla se ve desde cualquier ángulo de la sala.
            La gente vino a escuchar.
          </p>

          <p className="text-lg">
            Sin móvil escuchas más. Sin cámara recuerdas mejor.
          </p>

          <p className="text-lg">
            Solo te pedimos que lo dejes en el bolsillo.
          </p>

        </div>

        <div className="mt-16 flex flex-wrap gap-3 justify-center">
          <Link to="/records" className="bg-bermellon text-paper px-5 py-3 mono-tag hover:bg-paper hover:text-ink transition-colors">
            VER DISCOS →
          </Link>
          <Link to="/events" className="hairline px-5 py-3 mono-tag hover:bg-paper hover:text-ink transition-colors">
            PROGRAMACIÓN
          </Link>
        </div>

      </div>
    </div>
  );
};