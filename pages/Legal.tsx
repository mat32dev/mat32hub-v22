import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { Shield, Lock, FileText, ChevronLeft, Disc, Cookie, RotateCcw } from 'lucide-react';

// Datos corporativos reales — Raretraxxx Beat S.L. (compartido con gethostia.com)
const COMPANY = {
  name: 'Raretraxxx Beat, S.L.',
  cif: 'B22628846',
  address: 'Calle Matías Perelló, 32 — 46005 Valencia, España',
  email: 'hola@mat32.com',
  phone: '+34 622 19 08 02',
  web: 'https://www.mat32.com',
  lastUpdate: '2026-04-18',
};

export const Legal: React.FC = () => {
  const { type } = useParams<{ type: string }>();

  const content = (() => {
    switch (type) {
      case 'aviso-legal': return { title: 'Aviso Legal', icon: <FileText className="w-12 h-12 text-mat-500" />, body: <AvisoLegal /> };
      case 'privacidad':  return { title: 'Política de Privacidad', icon: <Shield className="w-12 h-12 text-mat-500" />, body: <Privacidad /> };
      case 'cookies':     return { title: 'Política de Cookies', icon: <Cookie className="w-12 h-12 text-mat-500" />, body: <Cookies /> };
      case 'condiciones': return { title: 'Términos y Condiciones', icon: <Lock className="w-12 h-12 text-mat-500" />, body: <Condiciones /> };
      case 'devoluciones': return { title: 'Política de Devoluciones', icon: <RotateCcw className="w-12 h-12 text-mat-500" />, body: <Devoluciones /> };
      default:            return { title: 'Legal', icon: <Disc className="w-12 h-12 text-mat-500" />, body: <Index /> };
    }
  })();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SEO titleKey={`${content.title} · MAT32`} descriptionKey="Información legal de Raretraxxx Beat S.L. (MAT32) — aviso legal, privacidad, cookies y condiciones." />

      <div className="bg-mat-800 py-16 border-b border-mat-700">
        <div className="container mx-auto px-6 text-center flex flex-col items-center">
          <Link to="/" className="text-mat-500 hover:text-white transition-colors mb-8 flex items-center gap-2 uppercase font-black text-[10px] tracking-widest">
            <ChevronLeft className="w-4 h-4" /> Volver
          </Link>
          <div className="mb-6">{content.icon}</div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white font-exo">{content.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2 justify-center text-[10px] font-black uppercase tracking-[0.3em]">
            <Link to="/legal/aviso-legal" className="px-3 py-1.5 bg-mat-900 border border-mat-700 rounded-lg text-gray-400 hover:text-mat-500">Aviso legal</Link>
            <Link to="/legal/privacidad" className="px-3 py-1.5 bg-mat-900 border border-mat-700 rounded-lg text-gray-400 hover:text-mat-500">Privacidad</Link>
            <Link to="/legal/cookies" className="px-3 py-1.5 bg-mat-900 border border-mat-700 rounded-lg text-gray-400 hover:text-mat-500">Cookies</Link>
            <Link to="/legal/condiciones" className="px-3 py-1.5 bg-mat-900 border border-mat-700 rounded-lg text-gray-400 hover:text-mat-500">Condiciones</Link>
            <Link to="/legal/devoluciones" className="px-3 py-1.5 bg-mat-900 border border-mat-700 rounded-lg text-gray-400 hover:text-mat-500">Devoluciones</Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <article className="bg-mat-800 p-8 md:p-12 border border-mat-700 rounded-3xl shadow-2xl prose-legal">
          {content.body}
          <div className="mt-16 pt-6 border-t border-mat-700 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
            <div>Última actualización: {COMPANY.lastUpdate}</div>
            <div className="text-mat-500 mt-1">{COMPANY.name} · CIF {COMPANY.cif}</div>
          </div>
        </article>
      </div>

      <style>{`
        .prose-legal { color: #d6d3d1; line-height: 1.75; }
        .prose-legal h2 { color: white; font-family: 'Exo 2', sans-serif; font-weight: 900; text-transform: uppercase; letter-spacing: -0.01em; font-size: 1.5rem; margin-top: 2rem; margin-bottom: 0.75rem; padding-top: 1rem; border-top: 1px solid #44403c; }
        .prose-legal h2:first-child { margin-top: 0; padding-top: 0; border-top: none; }
        .prose-legal h3 { color: #ea580c; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; font-size: 0.75rem; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .prose-legal p { margin: 0.75rem 0; }
        .prose-legal ul { list-style: disc; padding-left: 1.5rem; margin: 0.75rem 0; }
        .prose-legal ol { list-style: decimal; padding-left: 1.5rem; margin: 0.75rem 0; }
        .prose-legal li { margin: 0.25rem 0; }
        .prose-legal strong { color: white; font-weight: 700; }
        .prose-legal a { color: #ea580c; text-decoration: underline; }
        .prose-legal a:hover { color: #f97316; }
        .prose-legal table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.875rem; }
        .prose-legal th, .prose-legal td { border: 1px solid #44403c; padding: 0.5rem 0.75rem; text-align: left; vertical-align: top; }
        .prose-legal th { background: #1c1917; color: white; font-weight: 700; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.1em; }
      `}</style>
    </div>
  );
};

// ── INDEX ─────────────────────────────────────────
const Index: React.FC = () => (
  <div>
    <p>Información legal de <strong>{COMPANY.name}</strong>, titular del dominio <a href={COMPANY.web}>{COMPANY.web}</a>.</p>
    <ul>
      <li><Link to="/legal/aviso-legal">Aviso legal</Link> — datos identificativos y condiciones generales.</li>
      <li><Link to="/legal/privacidad">Política de privacidad</Link> — tratamiento de datos personales.</li>
      <li><Link to="/legal/cookies">Política de cookies</Link> — tecnologías de seguimiento.</li>
      <li><Link to="/legal/condiciones">Términos y condiciones</Link> — uso del sitio, reservas y compras.</li>
      <li><Link to="/legal/devoluciones">Política de devoluciones</Link> — desistimiento, cambios y reembolsos de la tienda.</li>
    </ul>
  </div>
);

// ── AVISO LEGAL ──────────────────────────────────
const AvisoLegal: React.FC = () => (
  <div>
    <h2>1. Datos identificativos</h2>
    <p>En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSICE), se informa de lo siguiente:</p>
    <ul>
      <li><strong>Titular:</strong> {COMPANY.name}</li>
      <li><strong>CIF:</strong> {COMPANY.cif}</li>
      <li><strong>Domicilio social:</strong> {COMPANY.address}</li>
      <li><strong>Correo electrónico:</strong> <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>
      <li><strong>Teléfono:</strong> {COMPANY.phone}</li>
      <li><strong>Sitio web:</strong> <a href={COMPANY.web}>{COMPANY.web}</a></li>
    </ul>

    <h2>2. Objeto</h2>
    <p>El presente Aviso Legal regula el acceso, navegación y uso del sitio web <a href={COMPANY.web}>{COMPANY.web}</a> (en adelante, "el Sitio") y los servicios que desde él se prestan: bar hi-fi, tienda de discos, programación musical, reservas de mesa Sobremesa, alquiler del local, academia de formación y panel para miembros.</p>
    <p>La utilización del Sitio atribuye la condición de Usuario e implica la aceptación plena y sin reservas de este Aviso Legal y de la Política de Privacidad y Cookies.</p>

    <h2>3. Condiciones de uso</h2>
    <p>El Usuario se compromete a hacer un uso adecuado de los contenidos y servicios del Sitio y, a título enunciativo pero no limitativo, a no utilizarlos para:</p>
    <ul>
      <li>Incurrir en actividades ilícitas, ilegales o contrarias a la buena fe y al orden público.</li>
      <li>Difundir contenidos o propaganda de carácter racista, xenófobo, pornográfico, de apología del terrorismo o atentatorios contra los derechos humanos.</li>
      <li>Provocar daños en los sistemas físicos y lógicos del titular, de sus proveedores o de terceros.</li>
      <li>Introducir o difundir virus informáticos o cualquier otro sistema capaz de causar los daños anteriormente mencionados.</li>
    </ul>

    <h2>4. Propiedad intelectual e industrial</h2>
    <p>Todos los contenidos del Sitio (textos, fotografías, gráficos, imágenes, iconos, tecnología, software, enlaces y demás contenidos audiovisuales o sonoros), así como su diseño gráfico y códigos fuente, son propiedad intelectual de {COMPANY.name} o de terceros que han autorizado su uso, sin que puedan entenderse cedidos al Usuario ninguno de los derechos de explotación reconocidos por la normativa vigente en materia de propiedad intelectual.</p>
    <p>Las marcas "MAT32", "Raretraxxx" y cualquier otra marca, logotipo o signo distintivo que aparezca en el Sitio son titularidad de {COMPANY.name}.</p>

    <h2>5. Exclusión de garantías y responsabilidad</h2>
    <p>El titular no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos en los contenidos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.</p>

    <h2>6. Enlaces</h2>
    <p>En el caso de que el Sitio contenga enlaces a otros sitios web, el titular no ejercerá ningún tipo de control sobre dichos sitios y contenidos. En ningún caso asumirá responsabilidad alguna por los contenidos de algún enlace perteneciente a un sitio web ajeno.</p>

    <h2>7. Derecho de exclusión</h2>
    <p>El titular se reserva el derecho a denegar o retirar el acceso al Sitio, sin necesidad de preaviso, a instancia propia o de un tercero, a aquellos usuarios que incumplan las presentes Condiciones Generales de Uso.</p>

    <h2>8. Modificaciones</h2>
    <p>El titular podrá modificar en cualquier momento las condiciones aquí establecidas, siendo debidamente publicadas como aquí aparecen.</p>

    <h2>9. Legislación aplicable y jurisdicción</h2>
    <p>La relación entre el titular y el Usuario se regirá por la normativa española vigente. Para la resolución de cualquier controversia las partes se someten a los Juzgados y Tribunales del domicilio del Usuario, cuando éste tenga la condición de consumidor, conforme a la normativa aplicable.</p>
  </div>
);

// ── PRIVACIDAD ──────────────────────────────────
const Privacidad: React.FC = () => (
  <div>
    <h2>1. Responsable del tratamiento</h2>
    <ul>
      <li><strong>Identidad:</strong> {COMPANY.name}</li>
      <li><strong>CIF:</strong> {COMPANY.cif}</li>
      <li><strong>Dirección:</strong> {COMPANY.address}</li>
      <li><strong>Email:</strong> <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>
    </ul>

    <h2>2. Finalidades del tratamiento</h2>
    <p>Tratamos los datos personales facilitados por el Usuario con las siguientes finalidades:</p>
    <ul>
      <li><strong>Gestión de reservas Sobremesa:</strong> confirmar tu mesa, procesar el pago del pase, enviar recordatorios y gestionar cambios o cancelaciones.</li>
      <li><strong>Ventas en el bar y tienda:</strong> gestionar compras de discos, bebidas, merchandising y tickets de eventos, emitir facturas y cumplir obligaciones fiscales.</li>
      <li><strong>Membresía Digger Radar:</strong> gestionar tu cuenta de miembro, enviarte alertas de discos que busques y mantener la comunicación relacionada con el servicio.</li>
      <li><strong>Academia / Workshops:</strong> gestionar pre-registros, confirmar plazas y enviar información logística.</li>
      <li><strong>Alquiler del local:</strong> atender solicitudes de eventos privados, elaborar presupuestos y gestionar reservas.</li>
      <li><strong>Consultas y contacto:</strong> atender tus consultas a través de los formularios web, email o WhatsApp.</li>
      <li><strong>Comunicaciones informativas:</strong> enviarte información sobre programación, eventos y novedades si nos has dado tu consentimiento.</li>
      <li><strong>Gestión interna y seguridad:</strong> prevención del fraude, mantenimiento técnico del Sitio y cumplimiento de obligaciones legales.</li>
    </ul>

    <h2>3. Base jurídica</h2>
    <ul>
      <li><strong>Ejecución contractual:</strong> reservas, compras y membresías.</li>
      <li><strong>Consentimiento:</strong> newsletter, comunicaciones comerciales, uso de cookies no esenciales.</li>
      <li><strong>Cumplimiento legal:</strong> obligaciones fiscales, contables y, en su caso, de prevención del blanqueo de capitales.</li>
      <li><strong>Interés legítimo:</strong> seguridad del Sitio, analítica básica y atención al cliente.</li>
    </ul>

    <h2>4. Categorías de datos tratados</h2>
    <p>Según la interacción del Usuario, podemos tratar las siguientes categorías:</p>
    <ul>
      <li><strong>Identificativos:</strong> nombre, apellidos, DNI cuando sea obligatorio.</li>
      <li><strong>Contacto:</strong> email, teléfono, dirección postal.</li>
      <li><strong>Transaccionales:</strong> detalle de reservas, compras, método de pago (sin almacenar datos completos de tarjeta).</li>
      <li><strong>Técnicos:</strong> dirección IP, navegador, sistema operativo, páginas visitadas, registros de acceso.</li>
      <li><strong>Preferencias musicales:</strong> wantlist y preferencias de los miembros del Digger Radar.</li>
    </ul>

    <h2>5. Plazos de conservación</h2>
    <ul>
      <li><strong>Reservas y clientes:</strong> durante la relación contractual y hasta 6 años después por exigencias fiscales (art. 30 Código de Comercio).</li>
      <li><strong>Contactos no clientes:</strong> 12 meses desde la última interacción.</li>
      <li><strong>Miembros Digger Radar:</strong> mientras mantengan su suscripción activa y 3 años tras la baja para conservar el historial.</li>
      <li><strong>Datos técnicos de navegación:</strong> hasta 12 meses.</li>
    </ul>

    <h2>6. Destinatarios</h2>
    <p>Tus datos pueden ser compartidos con los siguientes terceros bajo contratos de encargado de tratamiento conforme al art. 28 RGPD:</p>
    <ul>
      <li><strong>Infraestructura cloud / hosting</strong> (servidor VPS, CDN Cloudflare).</li>
      <li><strong>Procesadores de pago:</strong> Stripe Payments Europe Ltd. (tarjeta), CaixaBank / Comercia Global Payments (TPV), proveedores bancarios (Bizum).</li>
      <li><strong>Google Ireland Ltd.:</strong> Google Workspace (email <code>hola@mat32.com</code>) y Google Ads (medición de campañas).</li>
      <li><strong>Meta Platforms Ireland Ltd.:</strong> solo si nos contactas por WhatsApp Business.</li>
      <li><strong>Proveedores de email transaccional</strong> para confirmaciones automáticas.</li>
      <li><strong>Obligación legal:</strong> Agencia Tributaria, Seguridad Social, Fuerzas y Cuerpos de Seguridad cuando exista requerimiento.</li>
    </ul>
    <p>No realizamos transferencias internacionales de datos fuera del Espacio Económico Europeo salvo a aquellos proveedores que ofrezcan garantías adecuadas (Cláusulas Contractuales Tipo aprobadas por la Comisión Europea).</p>

    <h2>7. Derechos del usuario</h2>
    <p>En cualquier momento puedes ejercer los siguientes derechos enviando un email a <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>:</p>
    <ul>
      <li><strong>Acceso</strong> a tus datos personales.</li>
      <li><strong>Rectificación</strong> de datos inexactos.</li>
      <li><strong>Supresión</strong> ("derecho al olvido") cuando ya no sean necesarios.</li>
      <li><strong>Limitación</strong> del tratamiento en determinadas circunstancias.</li>
      <li><strong>Oposición</strong> al tratamiento por motivos relacionados con tu situación particular.</li>
      <li><strong>Portabilidad</strong>: recibir tus datos en formato estructurado.</li>
      <li><strong>Retirar el consentimiento</strong> prestado en cualquier momento.</li>
    </ul>
    <p>Si consideras que el tratamiento de tus datos no se ajusta a la normativa, puedes presentar reclamación ante la <strong>Agencia Española de Protección de Datos</strong> (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a>).</p>

    <h2>8. Seguridad</h2>
    <p>Aplicamos medidas técnicas y organizativas apropiadas para garantizar un nivel de seguridad adecuado al riesgo: cifrado TLS en todas las comunicaciones, autenticación de dos factores en accesos administrativos, control de accesos, backups cifrados y registros de auditoría.</p>
  </div>
);

// ── COOKIES ─────────────────────────────────────
const Cookies: React.FC = () => (
  <div>
    <h2>1. Qué son las cookies</h2>
    <p>Las cookies son pequeños archivos de texto que los sitios web envían al dispositivo del visitante para almacenar información sobre su interacción con el sitio. Permiten, entre otras cosas, recordar preferencias, mantener sesiones iniciadas y analizar el uso del Sitio.</p>

    <h2>2. Tipos de cookies que utilizamos</h2>
    <table>
      <thead>
        <tr><th>Cookie</th><th>Tipo</th><th>Finalidad</th><th>Duración</th></tr>
      </thead>
      <tbody>
        <tr><td>mat32_auth_session_v15</td><td>Técnica · propia</td><td>Mantener sesión administrativa iniciada</td><td>8 horas</td></tr>
        <tr><td>mat32_cart_v1</td><td>Técnica · propia</td><td>Recordar productos del carrito</td><td>Sesión</td></tr>
        <tr><td>mat32_wishlist_v1</td><td>Técnica · propia</td><td>Guardar lista de deseos</td><td>Persistente</td></tr>
        <tr><td>mat32_lang</td><td>Técnica · propia</td><td>Recordar idioma</td><td>Persistente</td></tr>
        <tr><td>_gcl_au, _ga, _gid</td><td>Analíticas · Google</td><td>Medición de Google Ads / Analytics</td><td>90 días – 2 años</td></tr>
        <tr><td>Cloudflare (cf_*)</td><td>Técnica · CDN</td><td>Seguridad y optimización</td><td>Sesión / 30 días</td></tr>
      </tbody>
    </table>

    <h2>3. Gestión de cookies</h2>
    <p>Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones del navegador:</p>
    <ul>
      <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
      <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
      <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer">Firefox</a></li>
      <li><a href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
    </ul>
    <p>La desactivación de cookies técnicas puede impedir el correcto funcionamiento de algunas secciones (carrito, login, panel miembro). La desactivación de cookies analíticas no afecta a la navegación.</p>

    <h2>4. Actualización</h2>
    <p>Esta política puede actualizarse para reflejar cambios en la legislación o en la configuración del Sitio. Te recomendamos revisarla periódicamente.</p>
  </div>
);

// ── CONDICIONES ─────────────────────────────────
const Condiciones: React.FC = () => (
  <div>
    <h2>1. Información general</h2>
    <p>Las presentes Condiciones Generales regulan el uso del Sitio y la contratación de los servicios ofrecidos por {COMPANY.name}, CIF {COMPANY.cif}, con domicilio en {COMPANY.address}.</p>

    <h2>2. Reservas Sobremesa</h2>
    <h3>2.1 Pase</h3>
    <p>La reserva de mesa Sobremesa implica el pago anticipado de un pase de <strong>2,50€ por persona</strong>. El pase cubre únicamente la reserva de la mesa y el acceso a la franja Sobremesa. <strong>Las bebidas y la comida no están incluidas</strong> y se abonan aparte en el local.</p>
    <h3>2.2 Pago</h3>
    <p>El pago del pase se realiza online mediante Bizum o tarjeta (Stripe). La reserva queda confirmada una vez recibido el pago. Sin pago confirmado no se garantiza la mesa.</p>
    <h3>2.3 Modificación y cancelación</h3>
    <ul>
      <li><strong>Hasta 24h antes:</strong> modificación o cancelación gratuita, con reembolso íntegro del pase.</li>
      <li><strong>Menos de 24h antes o no-show:</strong> no se realizará reembolso salvo causa de fuerza mayor debidamente acreditada.</li>
      <li>Los cambios se solicitan por email a <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.</li>
    </ul>
    <h3>2.4 Puntualidad y duración</h3>
    <p>La franja reservada tiene una duración aproximada de 50 minutos. Se ruega puntualidad; transcurridos 15 minutos sin llegada, la mesa podrá liberarse sin derecho a devolución.</p>
    <h3>2.5 BYO food</h3>
    <p>El formato "Bring Your Own" permite al Usuario traer comida para consumir en el local dentro del marco razonable de la sobremesa (picoteo, táper, compra en el barrio). No se permite la introducción de bebidas alcohólicas o refrescos de fuera.</p>

    <h2>3. Menú MAT32 (Comida)</h2>
    <p>Los platos del Menú MAT32 son preparados por proveedores colaboradores. El pago se realiza al entregar el pedido en el local mediante TPV. Los precios incluyen IVA.</p>
    <p>En caso de alergias o intolerancias, el Usuario debe comunicarlo al reservar. MAT32 no se responsabiliza de reacciones derivadas de información no comunicada.</p>

    <h2>4. Eventos y tickets</h2>
    <p>Los tickets para eventos son nominativos y personales. No se admiten devoluciones una vez confirmada la compra salvo cancelación del evento por causa imputable al organizador.</p>

    <h2>5. Tienda de discos</h2>
    <h3>5.1 Condiciones generales</h3>
    <p>Los discos se venden en el estado descrito en cada ficha. MAT32 ofrece información sobre el grado de conservación (M, NM, VG+, VG…) según la nomenclatura estándar Goldmine.</p>
    <h3>5.2 Envíos</h3>
    <p>Realizamos envíos en territorio nacional e internacional. Los plazos y costes se informan en el checkout. El envío se realiza mediante embalaje específico para vinilo.</p>
    <h3>5.3 Derecho de desistimiento</h3>
    <p>El Usuario dispone de 14 días naturales desde la recepción para desistir de la compra, salvo en el caso de discos precintados cuyo precinto haya sido abierto (art. 103.i Ley General para la Defensa de los Consumidores).</p>

    <h2>6. Alquiler del local</h2>
    <p>El alquiler se formaliza mediante presupuesto aceptado y firma de contrato. Las condiciones específicas (horario, capacidad, personal, catering) se detallan en cada contrato.</p>

    <h2>7. Membresía Digger Radar</h2>
    <p>La membresía es personal e intransferible. El uso fraudulento (compartir credenciales, revender alertas) puede conllevar la revocación de la cuenta sin derecho a reembolso. Ver <Link to="/member">panel de miembro</Link> para detalles del servicio.</p>

    <h2>8. Precios e impuestos</h2>
    <p>Todos los precios mostrados en el Sitio incluyen los impuestos aplicables (IVA) salvo indicación contraria. En caso de error material en un precio, {COMPANY.name} se reserva el derecho de cancelar el pedido, con reembolso íntegro si ya hubiese sido cobrado.</p>

    <h2>9. Atención al cliente</h2>
    <p>Para cualquier consulta, reclamación o incidencia, contacta:</p>
    <ul>
      <li>Email: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>
      <li>Teléfono / WhatsApp: {COMPANY.phone}</li>
      <li>Dirección: {COMPANY.address}</li>
    </ul>
    <p>Existen hojas de reclamación oficiales a disposición de los consumidores.</p>

    <h2>10. Ley aplicable y jurisdicción</h2>
    <p>Las presentes Condiciones se rigen por la legislación española. Para la resolución de cualquier controversia, ambas partes se someten expresamente a los Juzgados y Tribunales del domicilio del consumidor conforme a la normativa aplicable.</p>
  </div>
);

// ── DEVOLUCIONES ────────────────────────────────
const Devoluciones: React.FC = () => (
  <div>
    <p>Esta política de devoluciones aplica a los productos físicos comprados en la tienda online de {COMPANY.name} (discos de vinilo y merchandising, sección <Link to="/marketplace">Marketplace</Link>). Cumple con la Ley General para la Defensa de los Consumidores y Usuarios (Real Decreto Legislativo 1/2007) y la normativa europea de comercio electrónico.</p>

    <table>
      <thead>
        <tr><th>Resumen</th><th>Condición</th></tr>
      </thead>
      <tbody>
        <tr><td>Plazo para devolver</td><td>14 días naturales desde la recepción del pedido</td></tr>
        <tr><td>Coste de la devolución</td><td>A cargo del cliente, salvo error, defecto o daño de transporte (entonces gratis)</td></tr>
        <tr><td>Método de reembolso</td><td>Mismo medio de pago utilizado en la compra</td></tr>
        <tr><td>Plazo de reembolso</td><td>Máximo 14 días naturales desde que recibimos el producto devuelto</td></tr>
        <tr><td>Productos excluidos</td><td>Discos con precinto de higiene/protección abierto</td></tr>
      </tbody>
    </table>

    <h2>1. Derecho de desistimiento</h2>
    <p>El Usuario dispone de <strong>14 días naturales</strong> desde la recepción del pedido para desistir de la compra sin necesidad de justificar su decisión, conforme al artículo 102 y siguientes del Real Decreto Legislativo 1/2007.</p>
    <p>Para ejercerlo, basta con comunicarlo dentro de ese plazo por email a <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>, indicando el número de pedido y los productos a devolver. Tras confirmar la solicitud, el Usuario dispone de 14 días naturales adicionales para reenviar el producto.</p>

    <h2>2. Cómo iniciar una devolución</h2>
    <ol>
      <li>Escribe a <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> con tu número de pedido y el motivo (desistimiento, defecto, error en el envío).</li>
      <li>Te confirmamos la solicitud y te indicamos la dirección de envío: {COMPANY.address}.</li>
      <li>Envías el producto bien protegido, a ser posible en su embalaje original.</li>
      <li>Verificamos el estado del producto recibido y procesamos el reembolso.</li>
    </ol>

    <h2>3. Estado del producto devuelto</h2>
    <p>El producto debe devolverse en el mismo estado en que fue entregado, sin señales de uso indebido, con su funda, inserto y embalaje original en la medida de lo posible. En el caso de discos de vinilo, la manipulación razonable para inspeccionar el producto no afecta al derecho de desistimiento.</p>

    <h2>4. Excepciones al derecho de desistimiento</h2>
    <p>Conforme al artículo 103.i del RDL 1/2007, <strong>no se admite la devolución de discos sellados cuyo precinto de higiene o protección haya sido retirado</strong> tras la entrega, al tratarse de grabaciones sonoras susceptibles de copia. Esta excepción no aplica a productos con defecto de fabricación o error en el envío.</p>

    <h2>5. Gastos de envío de la devolución</h2>
    <p>Los gastos de envío para devolver el producto corren a cargo del Usuario, salvo en los siguientes casos, en los que {COMPANY.name} asume el coste íntegro:</p>
    <ul>
      <li>El producto recibido no coincide con el pedido realizado.</li>
      <li>El producto llega defectuoso o dañado durante el transporte.</li>
      <li>El error es atribuible a {COMPANY.name} (envío incorrecto, descripción errónea del estado del disco).</li>
    </ul>

    <h2>6. Reembolso</h2>
    <p>Una vez recibido y verificado el producto devuelto, {COMPANY.name} reembolsará el importe pagado (incluidos los gastos de envío iniciales, salvo la parte correspondiente a envíos exprés adicionales) utilizando el mismo medio de pago empleado en la compra, en un plazo máximo de <strong>14 días naturales</strong> desde la recepción de la devolución o desde que el Usuario acredite haberla enviado, lo que ocurra antes.</p>

    <h2>7. Productos defectuosos, dañados o pedidos erróneos</h2>
    <p>Si el disco llega dañado, con un defecto de fabricación no descrito en la ficha del producto, o si recibes un pedido distinto al solicitado, contáctanos en un plazo de 48 horas desde la recepción a <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> adjuntando fotos del producto y del embalaje. Ofreceremos, a elección del Usuario, sustitución del producto o reembolso íntegro, sin coste alguno para el cliente.</p>

    <h2>8. Cambios</h2>
    <p>No gestionamos cambios directos de producto. Para cambiar un artículo, solicita la devolución conforme a esta política y realiza un nuevo pedido con el producto deseado.</p>

    <h2>9. Contacto</h2>
    <p>Para cualquier consulta sobre devoluciones, reembolsos o incidencias con tu pedido:</p>
    <ul>
      <li>Email: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>
      <li>Teléfono / WhatsApp: {COMPANY.phone}</li>
      <li>Dirección de devoluciones: {COMPANY.address}</li>
    </ul>
  </div>
);
