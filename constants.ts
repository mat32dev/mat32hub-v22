
import { Event, Post, VinylRecord, MenuCategory, SellerProfile, Artist, SelectorSubmission } from './types';

const getFutureDate = (daysFromNow: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
};

export const MOCK_ARTISTS: Record<string, Artist> = {
  'soulman': { id: 'art_soul', name: 'Soulman', role: 'Main Selector', instagram: '@soulman_vlc' },
  'analog_digger': { id: 'art_digger', name: 'Analog Digger', role: 'Vinyl Specialist', instagram: '@analog_digger' },
  'mat32_crew': { id: 'art_crew', name: 'Mat32 Crew', role: 'Selectors', instagram: '@mat32__' }
};

export const MOCK_SELLERS: SellerProfile[] = [
  {
    id: 's_mat32',
    name: 'Mat32 Archive',
    email: 'archive@mat32.com',
    discogsUsername: 'ACTIVISTA',
    avatarUrl: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/7701241e-71ee-4929-18c0-d1d0d9576e00/public',
    bio: 'Colección privada del Hub. Joyas de Detroit, Berlin y Sheffield.',
    location: 'Ruzafa',
    isVerified: true,
    specialty: ['Techno', 'IDM', 'Detroit', 'Electro']
  }
];

// DATA SOURCE: Simulación de Scrape de la colección "ACTIVISTA" + Relacionados
const DISCOGS_RAW_DATA = [
  { a: "Underground Resistance", t: "Interstellar Fugitives", l: "UR", y: "1998", g: "Techno", p: 145, img: "https://i.discogs.com/f9-XFm8_U3Yqf8W0VfJ_x-5f_Xk=/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-1534-1163454483.jpeg.jpg", d: "La biblia del techno militante de Detroit. Una compilación que define el sonido de la resistencia." },
  { a: "Aphex Twin", t: "Selected Ambient Works 85-92", l: "Apollo", y: "1992", g: "IDM", p: 480, img: "https://i.discogs.com/jE-099k7e3r9E-E-E-E/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-705-1144023455.jpeg.jpg", d: "Obra maestra atemporal. Picos de venta récord en Discogs por su estado Mint original." },
  { a: "Drexciya", t: "Neptune's Lair", l: "Tresor", y: "1999", g: "Electro", p: 220, img: "https://i.discogs.com/k9-897y-09-E/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-1537-1241512345.jpeg.jpg", d: "El viaje acuático definitivo. Detroit electro en su máxima expresión conceptual." },
  { a: "Basic Channel", t: "BCD", l: "Basic Channel", y: "1995", g: "Dub Techno", p: 190, img: "https://i.discogs.com/y-89k-09-E/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-114-1144012345.jpeg.jpg", d: "El sonido de Berlin condensado. Reverberación, ruido y bajos que alteran el espacio-tiempo." },
  { a: "Model 500", t: "Deep Space", l: "R&S Records", y: "1995", g: "Techno", p: 135, img: "https://i.discogs.com/x-098y-09-E/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-112-1144012345.jpeg.jpg", d: "Juan Atkins explorando los confines del espacio exterior. Futurismo puro desde la Motor City." },
  { a: "Moodymann", t: "Silentintroduction", l: "Planet E", y: "1997", g: "House", p: 275, img: "https://i.discogs.com/z-098y-09-E/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-115-1144012345.jpeg.jpg", d: "Kenny Dixon Jr. en su mejor momento. Sampledelia soul aplicada al house de Detroit." },
  { a: "Boards Of Canada", t: "Music Has The Right To Children", l: "Warp", y: "1998", g: "IDM", p: 520, img: "https://i.discogs.com/a-098y-09-E/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-116-1144012345.jpeg.jpg", d: "Nostalgia analógica en formato LP. Una de las piezas más buscadas de la escudería Warp." },
  { a: "Robert Hood", t: "Internal Empire", l: "Tresor", y: "1994", g: "Techno", p: 165, img: "https://i.discogs.com/b-098y-09-E/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-117-1144012345.jpeg.jpg", d: "Minimalismo industrial. Robert Hood define la eficiencia rítmica en esta pieza de culto." },
  { a: "The Other People Place", t: "Lifestyles Of The Laptop Café", l: "Warp", y: "2001", g: "Electro", p: 650, img: "https://i.discogs.com/c-098y-09-E/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-118-1144012345.jpeg.jpg", d: "Gema oculta de James Stinson. Electro cálido y melancólico para los momentos de soledad." },
  { a: "Jeff Mills", t: "Live At The Liquid Room, Tokyo", l: "Axis", y: "1996", g: "Techno", p: 140, img: "https://i.discogs.com/d-098y-09-E/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-119-1144012345.jpeg.jpg", d: "La técnica de los tres platos capturada para la historia. El DJ set más famoso del techno." }
];

const generateRecords = (): VinylRecord[] => {
  const records: VinylRecord[] = [];
  
  // Generar 150 items basados en el scrape simulado y expansión de catálogo
  for (let i = 0; i < 150; i++) {
    const raw = DISCOGS_RAW_DATA[i % DISCOGS_RAW_DATA.length];
    const isRelated = i >= 100;
    
    records.push({
      id: `v_${i + 1}`,
      sku: `MAT-HUB-${1000 + i}`,
      artist: isRelated ? `${raw.a} (Legacy)` : raw.a,
      title: isRelated ? `${raw.t} Vol. ${Math.floor(i/10)}` : raw.t,
      slug: `${raw.a.toLowerCase().replace(/\s+/g, '-')}-${raw.t.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      label: raw.l,
      year: (parseInt(raw.y) + (isRelated ? Math.floor(i/50) : 0)).toString(),
      format: "LP",
      condition: i % 12 === 0 ? "Mint" : "NM",
      genre: raw.g,
      price: i % 15 === 0 ? raw.p * 1.8 : raw.p, // Inflación por rareza real
      stock: 1,
      coverUrl: i % 2 === 0 
        ? `https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800&sig=${i}` // Fallback estético
        : `https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=800&sig=${i}`,
      discogsLink: "https://www.discogs.com/user/ACTIVISTA/collection",
      description: `${raw.d} Importado directamente de la colección ACTIVISTA. Sonido verificado en Altec A7.`,
      sellerId: 's_mat32',
      status: 'published',
      tags: [raw.g.toLowerCase(), 'discogs_verified', 'activista_selection']
    });
  }
  return records;
};

export const MOCK_RECORDS: VinylRecord[] = generateRecords();

export const MOCK_POSTS: Post[] = [
  {
    id: 'p_1',
    type: 'POST',
    title: 'Nueva llegada: Detroit Masterclass',
    slug: 'detroit-masterclass',
    author: 'mat32__',
    content: 'Acabamos de recibir una copia inmaculada de Interstellar Fugitives. El que sepa, sabe. #Techno #UR #Detroit',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800',
    likes: 89,
    comments: [],
    timestamp: 'Hace 1 hora',
    tags: ['#Detroit', '#VinylHub'],
    status: 'published'
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e_1',
    title: 'Detroit Legacy Night',
    slug: 'detroit-legacy',
    date: getFutureDate(3),
    time: '21:00',
    location: 'Mat32 Ruzafa',
    description: 'Sesión dedicada a los pioneros de la Motor City. Solo vinilos originales.',
    category: 'Listening Session',
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800',
    attendees: 24,
    capacity: 40,
    price: 0,
    paidPrice: 12,
    ticketLink: '#',
    lineup: [MOCK_ARTISTS['analog_digger']],
    vibe: ['Techno', 'Electro'],
    status: 'published',
    tags: ['#detroit', '#hifi']
  }
];

export const BAR_MENU: MenuCategory[] = [
  {
    title: 'COCTELERÍA ANALÓGICA',
    items: [
      { name: 'NEGRONI HI-FI', price: '9,50', description: 'Gin local, Vermut artesano y Campari.', highlight: true },
      { name: 'ROTARY SOUR', price: '10,00', description: 'Nuestra versión del pisco sour con matices de jazmín.', highlight: true }
    ]
  },
  {
    title: 'LISTENING FUEL',
    items: [
      { name: 'VINO D.O VALENCIA', price: '4,50', highlight: true },
      { name: 'CERVEZA ARTESANA RUZAFA', price: '5,50', highlight: false }
    ]
  }
];

export const MOCK_SELECTORS: SelectorSubmission[] = [];
