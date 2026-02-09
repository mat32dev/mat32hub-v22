
import { Event, Post, VinylRecord, MenuCategory, SellerProfile, Artist, SelectorSubmission } from './types';

export const MOCK_ARTISTS: Record<string, Artist> = {
  'soulman': { id: 'art_soul', name: 'Soulman', role: 'Main Selector', instagram: '@soulman_vlc' },
  'analog_digger': { id: 'art_digger', name: 'Analog Digger', role: 'Vinyl Specialist', instagram: '@analog_digger' },
  'mat32_crew': { id: 'art_crew', name: 'Mat32 Crew', role: 'Selectors', instagram: '@mat32__' }
};

export const MOCK_SELLERS: SellerProfile[] = [
  {
    id: 'discos_ruzafa',
    name: 'Discos Ruzafa',
    email: 'ruzafa@mat32.com',
    discogsUsername: 'discos-ruzafa',
    avatarUrl: 'https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/7701241e-71ee-4929-18c0-d1d0d9576e00/public',
    bio: 'Especialistas en Disco, Boogie y rarezas de New York. Curaduría estricta.',
    location: 'Valencia, Ruzafa',
    isVerified: true,
    specialty: ['Disco', 'Paradise Garage', 'Classic House']
  }
];

const DISCOGS_BASE_URL = "https://www.discogs.com/es/user/discos-ruzafa";

const POPSIKE_GEMS = [
  { a: "Double Exposure", t: "Ten Percent", l: "Salsoul Records", y: "1976", g: "Disco", p: 75, f: "12\"", img: "https://i.discogs.com/f9-XFm8_U3Yqf8W0VfJ_x-5f_Xk=/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-94008-1188406541.jpeg.jpg", d: "Walter Gibbons Remix. Matrix #SZS-5508-A. VG+ copy with minimal surface noise. A classic Popsike top-seller for audiophiles." },
  { a: "Taana Gardner", t: "Heartbeat", l: "West End Records", y: "1981", g: "Boogie", p: 85, f: "12\"", img: "https://i.discogs.com/R-48601-1335012345.jpeg.jpg", d: "Larry Levan Mix. WES-22132. Deep bass response. Deadwax: 'MASTERING BY FRANKFORD/WAYNE'. Extremely clean VG+ labels." },
  { a: "Loleatta Holloway", t: "Love Sensation", l: "Gold Mind", y: "1980", g: "Disco", p: 55, f: "12\"", img: "https://i.discogs.com/R-122114-1144012345.jpeg.jpg", d: "Tom Moulton Mix. Matrix: G-12-4001. First commercial 12\". Powerful vocal section, shiny vinyl with zero scratches." },
  { a: "D-Train", t: "You're The One For Me", l: "Prelude Records", y: "1981", g: "Boogie", p: 42, f: "12\"", img: "https://i.discogs.com/R-135-1144012345.jpeg.jpg", d: "François K Remix. PRL D 621. Classic Prelude synth groove. Matrix: 'F/W' etched. Excellent dynamics for club sound systems." },
  { a: "First Choice", t: "Let No Man Put Asunder", l: "Salsoul Records", y: "1977", g: "Disco", p: 48, f: "12\"", img: "https://i.discogs.com/R-10020-1241512345.jpeg.jpg", d: "Shep Pettibone Mix. SG 368. Essential Salsoul tool. VG+ copy with original company sleeve. No spindle marks." },
  { a: "Loose Joints", t: "Is It All Over My Face?", l: "West End Records", y: "1980", g: "Disco", p: 120, f: "12\"", img: "https://i.discogs.com/R-168-1144012345.jpeg.jpg", d: "Larry Levan Female Vocal Mix. WES 22129. Arthur Russell production. A rare Popsike find in this VG+ condition." },
  { a: "Candido", t: "Jingo", l: "Salsoul Records", y: "1979", g: "Latin Disco", p: 65, f: "12\"", img: "https://i.discogs.com/R-897-123456789.jpeg.jpg", d: "SG 205. Stunning percussion break. Heavily played at The Loft. Very strong VG+, plays almost NM." },
  { a: "Theo Parrish", t: "Moonlite", l: "Sound Signature", y: "1999", g: "Detroit House", p: 95, f: "12\"", img: "https://i.discogs.com/R-1010-1241512345.jpeg.jpg", d: "SS007. Raw Detroit production. Hand-stamped label style. Popsike rarity for modern collectors. Zero wear on grooves." },
  { a: "Moodymann", t: "Don't Be Misled", l: "KDJ", y: "1996", g: "Detroit House", p: 150, f: "12\"", img: "https://i.discogs.com/R-115-1144012345.jpeg.jpg", d: "KDJ-001. First press. Extremely rare hand-made jacket variant. Museum piece for Detroit heads." },
  { a: "Ripple", t: "The Beat Goes On", l: "Salsoul Records", y: "1977", g: "Funk Disco", p: 38, f: "12\"", img: "https://i.discogs.com/R-898-123456789.jpeg.jpg", d: "SG 207. Larry Levan remix. Heavyweight vinyl pressing. Clean copy with original Salsoul jacket." },
  { a: "The Salsoul Orchestra", t: "Nice 'N' Naasty", l: "Salsoul Records", y: "1976", g: "Disco", p: 32, f: "LP", img: "https://i.discogs.com/R-94010-123456789.jpeg.jpg", d: "SZS-5507. Full LP. Vincent Montana Jr production. Includes orchestral hits. Jacket shows minor storage wear." },
  { a: "Joe Bataan", t: "The Bottle", l: "Salsoul Records", y: "1975", g: "Latin Disco", p: 110, f: "12\"", img: "https://i.discogs.com/R-567-123456789.jpeg.jpg", d: "Rare promo version. Gil Scott-Heron cover. Matrix: 'S-401'. Highly sought after by Latin Soul collectors." },
  { a: "Sparque", t: "Let's Go Dancin'", l: "West End Records", y: "1981", g: "Boogie", p: 45, f: "12\"", img: "https://i.discogs.com/R-486-123456789.jpeg.jpg", d: "WES 22135. Produced by Milton Hamilton. Larry Levan's Garage favorite. Mint labels, VG+ vinyl." },
  { a: "Sharon Redd", t: "Beat The Street", l: "Prelude Records", y: "1982", g: "Electro Disco", p: 28, f: "12\"", img: "https://i.discogs.com/R-154-1144012345.jpeg.jpg", d: "PRL D 604. François Kevorkian mix. Heavy funk bass line. Original Prelude company sleeve in excellent condition." },
  { a: "Patti Labelle", t: "Music Is My Way Of Life", l: "Salsoul Records", y: "1979", g: "Disco", p: 60, f: "12\"", img: "https://i.discogs.com/R-94008-1188406541.jpeg.jpg", d: "Rare commercial 12\" version. Matrix: SZS-5508. High BPM classic. Vinyl is shiny, plays loud." }
];

const generateUnique90Archive = (): VinylRecord[] => {
  const records: VinylRecord[] = [];
  const editions = [
    "Original US First Press", 
    "Promo Only - White Label", 
    "Mastered by Frankford/Wayne", 
    "Japanese Pressing w/ Obi", 
    "UK Import - DJ Edition", 
    "Canadian Rare Distribution", 
    "Vogue French Pressing", 
    "German Import Archive Copy"
  ];
  
  const technicalNotes = [
    "Etched matrix numbers in deadwax confirm first pressing.",
    "Jacket is clean with no ring wear. Vinyl looks unplayed.",
    "High-end frequency response tested on Altec A7 speakers.",
    "Labels are bright and crisp. No spindle marks detected.",
    "Original company inner sleeve included. Museum quality.",
    "Popsike historical high for this condition is exceeded here.",
    "Deadstock discovery from a closed New York distributor.",
    "Superior dynamics. This copy has been professionally cleaned."
  ];

  for (let i = 0; i < 150; i++) {
    const seed = POPSIKE_GEMS[i % POPSIKE_GEMS.length];
    const edition = editions[Math.floor(i / POPSIKE_GEMS.length) % editions.length];
    const note = technicalNotes[(i + 7) % technicalNotes.length];
    
    // SEO-Friendly slugs and unique prices
    const priceVariance = (i % 5) * 5;
    const finalPrice = seed.p + priceVariance;
    const isSold = i % 8 === 0;

    records.push({
      id: `ruzafa_digger_${i + 1}`,
      sku: `MAT32-RZ-${6000 + i}`,
      artist: seed.a,
      title: `${seed.t} (${edition})`,
      slug: `${seed.a.toLowerCase().replace(/\s+/g, '-')}-${seed.t.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      label: seed.l,
      year: seed.y,
      format: seed.f,
      condition: "VG+",
      genre: seed.g,
      price: finalPrice,
      stock: isSold ? 0 : 1,
      coverUrl: seed.img,
      discogsLink: DISCOGS_BASE_URL,
      description: `${seed.d} ${note}`,
      sellerId: 'discos_ruzafa',
      status: isSold ? 'sold' : 'published',
      tags: [seed.g.toLowerCase(), 'popsike_certified', 'high_vg_plus', seed.l.toLowerCase().replace(/\s+/g, '_')]
    });
  }
  return records;
};

export const MOCK_RECORDS: VinylRecord[] = generateUnique90Archive();

export const MOCK_POSTS: Post[] = [
  {
    id: 'p_rz_1',
    type: 'POST',
    title: 'Nueva Colección: The Ruzafa Legacy',
    slug: 'ruzafa-legacy-drop',
    author: 'discos_ruzafa',
    content: 'Hemos inyectado 150 piezas únicas con precios de mercado real (Popsike). Desde prensas originales de Walter Gibbons hasta rarezas de Detroit House. #DiscosRuzafa #VinylHub',
    imageUrl: "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/ac1a7472-de26-46de-37f3-7ec5509f5900/public",
    likes: 450,
    comments: [],
    timestamp: 'Hace 2 minutos',
    tags: ['#Audiophile', '#DiscoMarket'],
    status: 'published'
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e_rz_1',
    title: 'Paradise Garage Night',
    slug: 'paradise-garage-vlc',
    date: '2025-03-15',
    time: '21:00',
    location: 'Mat32 Ruzafa',
    description: 'Sesión monográfica dedicada a Larry Levan. Solo 12 pulgadas originales de West End y Salsoul.',
    category: 'Listening Session',
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800',
    attendees: 50,
    capacity: 50,
    price: 0,
    paidPrice: 15,
    ticketLink: '#',
    lineup: [MOCK_ARTISTS['analog_digger']],
    vibe: ['Paradise Garage', 'New York Disco'],
    status: 'published',
    tags: ['#larrylevan', '#disco']
  }
];

export const BAR_MENU: MenuCategory[] = [
  {
    title: 'DRINKS BY DISCOS RUZAFA',
    items: [
      { name: 'GIBBONS MARTINI', price: '11,50', description: 'Ginebra Premium, Vermut seco y una nota de jazz.', highlight: true },
      { name: 'SALSOUL SPRITZ', price: '10,00', description: 'Aperol, Cava y una explosión de Soul.', highlight: true }
    ]
  },
  {
    title: 'LOCAL BREWS',
    items: [
      { name: 'VINO RUZAFA', price: '4,50', highlight: true },
      { name: 'CRAFT BEER', price: '6,00', highlight: false }
    ]
  }
];

export const MOCK_SELECTORS: SelectorSubmission[] = [];
