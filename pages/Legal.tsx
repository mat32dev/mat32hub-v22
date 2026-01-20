
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Lock, FileText, ChevronLeft, Disc } from 'lucide-react';

export const Legal: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const { t, language } = useLanguage();

  const getContent = () => {
    switch (type) {
      case 'aviso-legal':
        return {
          titleKey: 'legal.notice',
          icon: <FileText className="w-12 h-12 text-mat-500" />,
          body: language === 'es' ? (
            <div className="space-y-6 text-gray-400 font-light leading-relaxed">
              <p>En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSICE) a continuación se detallan los datos identificativos de la entidad:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Razón social:</strong> Rarertraxx Beat S.L.</li>
                <li><strong>NIF:</strong> B-XXXXXXXX (Pendiente)</li>
                <li><strong>Dirección:</strong> Calle Matías Perelló, 32, 46005 Valencia</li>
                <li><strong>Email:</strong> groove@mat32.com</li>
                <li><strong>Teléfono:</strong> +34 960 000 032</li>
              </ul>
              <p>El presente aviso legal regula las condiciones generales de acceso y utilización del sitio web accesible en la dirección URL mat32.com.</p>
            </div>
          ) : (
            <div className="space-y-6 text-gray-400 font-light leading-relaxed">
              <p>In compliance with Article 10 of Law 34/2002, of July 11, on Services of the Information Society and Electronic Commerce (LSSICE), the identifying data of the entity are detailed below:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Business Name:</strong> Rarertraxx Beat S.L.</li>
                <li><strong>Tax ID (NIF):</strong> B-XXXXXXXX</li>
                <li><strong>Address:</strong> Calle Matías Perelló, 32, 46005 Valencia, Spain</li>
                <li><strong>Email:</strong> groove@mat32.com</li>
                <li><strong>Phone:</strong> +34 960 000 032</li>
              </ul>
              <p>This legal notice regulates the general conditions of access and use of the website accessible at the URL mat32.com.</p>
            </div>
          )
        };
      case 'privacidad':
        return {
          titleKey: 'legal.privacy',
          icon: <Shield className="w-12 h-12 text-mat-500" />,
          body: (
            <div className="space-y-6 text-gray-400 font-light leading-relaxed">
              <p>{language === 'es' ? 'Responsable: Rarertraxx Beat S.L. garantiza la protección de todos los datos de carácter personal que proporcione el usuario.' : 'Controller: Rarertraxx Beat S.L. guarantees the protection of all personal data provided by the user.'}</p>
              <p>{language === 'es' ? 'Finalidad: Gestión de reservas de mesa, venta de discos y suscripción a la newsletter.' : 'Purpose: Management of table bookings, records sales, and newsletter subscription.'}</p>
              <p>{language === 'es' ? 'Derechos: Acceso, rectificación, supresión y portabilidad enviando un email a groove@mat32.com.' : 'Rights: Access, rectification, erasure, and portability by sending an email to groove@mat32.com.'}</p>
            </div>
          )
        };
      case 'cookies':
        return {
          titleKey: 'legal.cookies',
          icon: <Disc className="w-12 h-12 text-mat-500" />,
          body: (
            <div className="space-y-6 text-gray-400 font-light leading-relaxed">
              <p>{language === 'es' ? 'Este sitio utiliza cookies técnicas necesarias para el funcionamiento de la tienda y la selección de idioma.' : 'This site uses technical cookies necessary for the operation of the shop and language selection.'}</p>
              <p>{language === 'es' ? 'No utilizamos cookies de seguimiento de terceros sin su consentimiento explícito.' : 'We do not use third-party tracking cookies without your explicit consent.'}</p>
            </div>
          )
        };
      case 'condiciones':
        return {
          titleKey: 'legal.terms',
          icon: <Lock className="w-12 h-12 text-mat-500" />,
          body: (
            <div className="space-y-6 text-gray-400 font-light leading-relaxed">
              <p>{language === 'es' ? 'Las compras realizadas en mat32.com están sujetas a la legislación española vigente.' : 'Purchases made on mat32.com are subject to current Spanish legislation.'}</p>
              <p>{language === 'es' ? 'Envío de discos: Realizamos envíos nacionales e internacionales mediante protocolos seguros de embalaje.' : 'Records Shipping: We carry out national and international shipping using secure packaging protocols.'}</p>
            </div>
          )
        };
      default:
        return { titleKey: 'Legal', icon: null, body: null };
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen bg-mat-900">
      <SEO titleKey={content.titleKey} descriptionKey="Legal Information for Mat32" />
      
      <div className="bg-mat-800 py-16 border-b border-mat-700">
        <div className="container mx-auto px-6 text-center flex flex-col items-center">
          <Link to="/" className="text-mat-500 hover:text-white transition-colors mb-8 flex items-center gap-2 uppercase font-black text-[10px] tracking-widest">
            <ChevronLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="mb-6">{content.icon}</div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white font-exo">{t(content.titleKey)}</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20 max-w-3xl">
        <div className="bg-mat-800 p-10 md:p-16 border-2 border-mat-700 rounded-[3rem] shadow-2xl">
          {content.body}
          <div className="mt-16 pt-8 border-t border-mat-700 flex justify-between items-center">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Mat32 Hub Protocol</p>
            <p className="text-[10px] font-black text-mat-500 uppercase tracking-widest">Rarertraxx Beat S.L.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
