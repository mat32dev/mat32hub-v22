
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
    bio: 'Paradise Garage & Loft Legacy Archive. Salsoul, West End, Prelude y rarezas de Detroit.',
    location: 'Ruzafa',
    isVerified: true,
    specialty: ['Disco', 'Boogie', 'Classic House', 'Edit Culture']
  }
];

// LOGOS DE SELLOS PARA 12" (GENERIC SLEEVES)
const LABEL_SLEEVES: Record<string, string> = {
  "Salsoul Records": "https://i.discogs.com/L-897-Salsoul/fit-in/300x300.jpeg",
  "Prelude Records": "https://i.discogs.com/L-154-Prelude/fit-in/300x300.jpeg",
  "West End Records": "https://i.discogs.com/L-486-West-End/fit-in/300x300.jpeg",
  "Radar": "https://i.discogs.com/L-112-Radar/fit-in/300x300.jpeg",
  "Gold Mind Records": "https://i.discogs.com/L-122-GoldMind/fit-in/300x300.jpeg",
  "Sound Signature": "https://i.discogs.com/L-1010-SoundSignature/fit-in/300x300.jpeg",
  "KDJ": "https://i.discogs.com/L-1020-KDJ/fit-in/300x300.jpeg"
};

const DISCO_DATABASE_SEED = [
  { a: "Double Exposure", t: "Ten Percent", l: "Salsoul Records", y: "1976", g: "Disco", p: 180, f: "12\"", img: "https://i.discogs.com/R-94008-1188406541.jpeg.jpg", d: "La mezcla de Walter Gibbons que inventó el 12\". Pura energía percusiva para el Garage." },
  { a: "Taana Gardner", t: "Heartbeat", l: "West End Records", y: "1981", g: "Boogie", p: 250, f: "12\"", img: "https://i.discogs.com/R-48601-1335012345.jpeg.jpg", d: "El pulso de Larry Levan en New York. Un beat hipnótico que definió una era." },
  { a: "Loleatta Holloway", t: "Love Sensation", l: "Gold Mind Records", y: "1980", g: "Disco", p: 320, f: "LP", img: "https://i.discogs.com/R-122114-1144012345.jpeg.jpg", d: "La voz definitiva del disco. Un LP que es una catedral sonora producida por Dan Hartman." },
  { a: "Sharon Redd", t: "Beat The Street", l: "Prelude Records", y: "1982", g: "Electro Disco", p: 145, f: "12\"", img: "https://i.discogs.com/R-154-1144012345.jpeg.jpg", d: "Sintetizadores que brillan en la oscuridad. El sonido de Prelude en su punto más álgido." },
  { a: "Moodymann", t: "Silentintroduction", l: "KDJ", y: "1997", g: "Detroit House", p: 450, f: "LP", img: "https://i.discogs.com/R-115-1144012345.jpeg.jpg", d: "Kenny Dixon Jr. fundiendo el legado del disco con la mugre de Detroit. Rareza absoluta." },
  { a: "Theo Parrish", t: "Parallel Dimensions", l: "Sound Signature", y: "2000", g: "Deep House", p: 380, f: "LP", img: "https://i.discogs.com/R-1010-1241512345.jpeg.jpg", d: "Experimentación rítmica que bebe del jazz y el soul. Una obra maestra del sonido lo-fi." },
  { a: "Rahaan", t: "Rahaan Edits Vol. 1", l: "Radar", y: "2005", g: "Disco Edits", p: 120, f: "12\"", img: "https://i.discogs.com/R-112-1144012345.jpeg.jpg", d: "La magia de Chicago aplicada a los clásicos. Edits crudos pensados para DJs de verdad." },
  { a: "Candido", t: "Jingo", l: "Salsoul Records", y: "1979", g: "Latin Disco", p: 210, f: "12\"", img: "https://i.discogs.com/R-157-1144012345.jpeg.jpg", d: "Percusiones explosivas para el clímax de la noche. Un himno de David Mancuso en The Loft." },
  { a: "First Choice", t: "Doctor Love", l: "Gold Mind Records", y: "1977", g: "Disco", p: 195, f: "12\"", img: "https://i.discogs.com/R-10020-1241512345.jpeg.jpg", d: "Tom Moulton al mando de la mezcla. Elegancia vocal y arreglos de cuerda que son historia." },
  { a: "D Train", t: "You're The One For Me", l: "Prelude Records", y: "1981", g: "Boogie", p: 165, f: "12\"", img: "https://i.discogs.com/R-135-1144012345.jpeg.jpg", d: "La cumbre del post-disco. Mezcla perfecta de sintetizadores y voces soul potentes." },
  { a: "Loose Joints", t: "Is It All Over My Face?", l: "West End Records", y: "1980", g: "Disco", p: 600, f: "12\"", img: "https://i.discogs.com/R-168-1144012345.jpeg.jpg", d: "Arthur Russell rompiendo barreras. La mezcla vocal de Larry Levan es vanguardia pura." },
  { a: "Positive Force", t: "We Got The Funk", l: "Radar", y: "1979", g: "Funk", p: 110, f: "12\"", img: "https://i.discogs.com/R-112-1144012345.jpeg.jpg", d: "El groove que lo empezó todo. Una pieza esencial de cualquier maleta de disco-funk." }
];

const generateRecords = (): VinylRecord[] => {
  const records: VinylRecord[] = [];
  const pressings = ["(Original Pressing)", "(Promo Copy)", "(White Label)", "(Japanese Import with Obi)", "(French Pressing)"];
  
  for (let i = 0; i < 150; i++) {
    const seed = DISCO_DATABASE_SEED[i % DISCO_DATABASE_SEED.length];
    const pressing = pressings[Math.floor(i / DISCO_DATABASE_SEED.length) % pressings.length];
    
    // Lógica de Imagen: 12" -> Label Sleeve | LP -> Portada Original
    let finalCover = seed.img;
    if (seed.f === "12\"" && LABEL_SLEEVES[seed.l]) {
      finalCover = LABEL_SLEEVES[seed.l];
    }

    records.push({
      id: `v_hub_${i + 1}`,
      sku: `MAT-HUB-${2000 + i}`,
      artist: seed.a,
      title: `${seed.t} ${i >= DISCO_DATABASE_SEED.length ? pressing : ""}`,
      slug: `${seed.a.toLowerCase().replace(/\s+/g, '-')}-${seed.t.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      label: seed.l,
      year: seed.y,
      format: seed.f,
      condition: i % 15 === 0 ? "Mint" : "NM",
      genre: seed.g,
      price: i % 10 === 0 ? seed.p * 2.2 : seed.p + (i * 2), // Precios variados y realistas
      stock: 1,
      coverUrl: finalCover,
      discogsLink: "https://www.discogs.com/user/ACTIVISTA/collection",
      description: `${seed.d} Procedente de la colección privada Mat32. Sonido audiófilo garantizado.`,
      sellerId: 's_mat32',
      status: 'published',
      tags: [seed.g.toLowerCase(), 'paradise_garage', 'the_loft', seed.l.toLowerCase().replace(/\s+/g, '_')]
    });
  }
  return records;
};

export const MOCK_RECORDS: VinylRecord[] = generateRecords();

export const MOCK_POSTS: Post[] = [
  {
    id: 'p_1',
    type: 'POST',
    title: 'The Salsoul Connection',
    slug: 'salsoul-connection',
    author: 'mat32__',
    content: 'Acabamos de recibir una remesa de West End y Salsoul. Rarezas en 12" que no verás en otro sitio de Valencia. #Disco #Ruzafa #Levan',
    imageUrl: "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/ac1a7472-de26-46de-37f3-7ec5509f5900/public",
    likes: 156,
    comments: [],
    timestamp: 'Hace 2 horas',
    tags: ['#Disco', '#HiFi'],
    status: 'published'
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e_1',
    title: 'A Night at the Garage',
    slug: 'night-at-garage',
    date: getFutureDate(5),
    time: '21:00',
    location: 'Mat32 Ruzafa',
    description: 'Tributo sonoro a Larry Levan. Solo 12" originales de los sellos West End y Prelude.',
    category: 'Listening Session',
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800',
    attendees: 35,
    capacity: 50,
    price: 0,
    paidPrice: 15,
    ticketLink: '#',
    lineup: [MOCK_ARTISTS['soulman'], MOCK_ARTISTS['analog_digger']],
    vibe: ['Disco', 'Soulful'],
    status: 'published',
    tags: ['#larrylevan', '#disco']
  }
];

export const BAR_MENU: MenuCategory[] = [
  {
    title: 'COCTELERÍA DISCO',
    items: [
      { name: 'WEST END SOUR', price: '10,50', description: 'Bourbon, Limón, Amargo de naranja y un toque de soul.', highlight: true },
      { name: 'SALSOUL PUNCH', price: '9,50', description: 'Ron añejo, Fruta de la pasión y Lima fresca.', highlight: true }
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
