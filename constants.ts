
import { Event, Post, VinylRecord, MenuCategory, SellerProfile, Artist, SelectorSubmission } from './types';

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

// ICONIC LABELS & SLEEVES (URLs reales de Discogs para Maxis)
const LABEL_SLEEVES: Record<string, string> = {
  "Salsoul Records": "https://i.discogs.com/p0-vN_Vz5O0V8V2zG-R1w6K8W-M=/fit-in/300x300/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/L-897-1543590000.jpeg.jpg",
  "Prelude Records": "https://i.discogs.com/f7jYy-E-E-E-E/fit-in/300x300/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/L-154-1543590000.jpeg.jpg",
  "West End Records": "https://i.discogs.com/jE-099k7e3r9E-E-E-E/fit-in/300x300/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/L-486-1543590000.jpeg.jpg",
  "Radar": "https://i.discogs.com/L-112-Radar/fit-in/300x300.jpeg",
  "Sound Signature": "https://i.discogs.com/L-1010-SoundSignature/fit-in/300x300.jpeg",
  "KDJ": "https://i.discogs.com/L-1020-KDJ/fit-in/300x300.jpeg",
  "Gold Mind": "https://i.discogs.com/L-122-GoldMind/fit-in/300x300.jpeg",
  "P&P": "https://i.discogs.com/L-567-PP/fit-in/300x300.jpeg"
};

const DISCO_GEMS_DATABASE = [
  { a: "Double Exposure", t: "Ten Percent", l: "Salsoul Records", y: "1976", g: "Disco", p: 45, f: "12\"", img: "https://i.discogs.com/f9-XFm8_U3Yqf8W0VfJ_x-5f_Xk=/fit-in/600x600/filters:strip_metadata():format(jpeg):mode_rgb():quality(90)/discogs-images/R-94008-1188406541.jpeg.jpg", d: "Walter Gibbons 12\" Mix. Matrix #SZS-5508. Shiny vinyl, clean labels. Iconic first 12 inch commercial release." },
  { a: "Taana Gardner", t: "Heartbeat", l: "West End Records", y: "1981", g: "Boogie", p: 38, f: "12\"", img: "https://i.discogs.com/R-48601-1335012345.jpeg.jpg", d: "Larry Levan Mix. WES-22132. Club classic. Heavy bass response, vinyl is EX with minor surface marks." },
  { a: "Theo Parrish", t: "First Floor Metaphor", l: "Sound Signature", y: "1998", g: "Detroit House", p: 65, f: "LP", img: "https://i.discogs.com/R-1010-1241512345.jpeg.jpg", d: "Triple vinyl LP. SS004. Raw Detroit sound. Minimal shelf wear on sleeve, vinyl is NM." },
  { a: "Loleatta Holloway", t: "Love Sensation", l: "Gold Mind", y: "1980", g: "Disco", p: 28, f: "12\"", img: "https://i.discogs.com/R-122114-1144012345.jpeg.jpg", d: "Tom Moulton Mix. G-12-4001. Original pressing. Full power vocals. Side A is flawless." },
  { a: "D-Train", t: "You're The One For Me", l: "Prelude Records", y: "1981", g: "Boogie", p: 24, f: "12\"", img: "https://i.discogs.com/R-135-1144012345.jpeg.jpg", d: "François K Remix. PRL D 621. Classic Prelude synth groove. Matrix: MASTERING BY FRANKFORD/WAYNE." },
  { a: "Moodymann", t: "Don't Be Misled", l: "KDJ", y: "1996", g: "Detroit House", p: 75, f: "12\"", img: "https://i.discogs.com/R-115-1144012345.jpeg.jpg", d: "KDJ-001. Very rare first pressing. Hand-stamped label style. Deep lo-fi house textures." },
  { a: "Rahaan", t: "Chicago Edits Vol. 1", l: "Radar", y: "2005", g: "Edits", p: 19, f: "12\"", img: "https://i.discogs.com/R-112-1144012345.jpeg.jpg", d: "RAD-001. Limitad edition Chicago DJ edits. Mint copy, never played in club." },
  { a: "First Choice", t: "Let No Man Put Asunder", l: "Salsoul Records", y: "1977", g: "Disco", p: 32, f: "12\"", img: "https://i.discogs.com/R-10020-1241512345.jpeg.jpg", d: "Shep Pettibone Mix. SG 368. Essential Salsoul tool. Strong VG+ copy." },
  { a: "Sharon Redd", t: "Can You Handle It", l: "Prelude Records", y: "1980", g: "Boogie", p: 22, f: "12\"", img: "https://i.discogs.com/R-154-1144012345.jpeg.jpg", d: "PRL D 604. François Kevorkian mix. Heavy funk bass line. Original Prelude company sleeve." },
  { a: "Loose Joints", t: "Is It All Over My Face?", l: "West End Records", y: "1980", g: "Disco", p: 50, f: "12\"", img: "https://i.discogs.com/R-168-1144012345.jpeg.jpg", d: "Larry Levan Mix. WES 22129. Arthur Russell production. Iconic Paradise Garage anthem." },
  { a: "Instant Funk", t: "I Got My Mind Made Up", l: "Salsoul Records", y: "1978", g: "Disco Funk", p: 18, f: "12\"", img: "https://i.discogs.com/R-898-123456789.jpeg.jpg", d: "SG 207. Larry Levan remix. Heavyweight vinyl pressing. Clean copy with no spindle marks." },
  { a: "The Salsoul Orchestra", t: "Nice 'N' Naasty", l: "Salsoul Records", y: "1976", g: "Disco", p: 26, f: "LP", img: "https://i.discogs.com/R-94010-123456789.jpeg.jpg", d: "SZS-5507. Full LP including 'It's Good For The Soul'. Orchestral disco masterpiece. VG+ condition." },
  { a: "Joe Bataan", t: "The Bottle", l: "Salsoul Records", y: "1975", g: "Latin Disco", p: 42, f: "12\"", img: "https://i.discogs.com/R-567-123456789.jpeg.jpg", d: "Rare 12\" promo version. Gil Scott-Heron cover. Latin soul fire. Vinyl is NM." },
  { a: "Sparque", t: "Let's Go Dancin'", l: "West End Records", y: "1981", g: "Boogie", p: 29, f: "12\"", img: "https://i.discogs.com/R-486-123456789.jpeg.jpg", d: "WES 22135. Produced by Milton Hamilton. Top-tier NYC boogie. Original labels." },
  { a: "Carol Williams", t: "'Lectric Lady", l: "Salsoul Records", y: "1976", g: "Soul Disco", p: 20, f: "LP", img: "https://i.discogs.com/R-94009-123456789.jpeg.jpg", d: "SZS-5506. Vincent Montana Jr. production. Philly soul meets disco. Beautiful cover art." },
  { a: "Ripple", t: "The Beat Goes On", l: "Salsoul Records", y: "1977", g: "Disco", p: 25, f: "12\"", img: "https://i.discogs.com/R-897-123456789.jpeg.jpg", d: "SG 205. One of the most sampled breaks in house history. Clean, loud pressing." }
];

const generateUnique150Catalog = (): VinylRecord[] => {
  const records: VinylRecord[] = [];
  const pressVariants = [
    "Original US Pressing", 
    "Promo Copy - White Label", 
    "Test Pressing (Frankford/Wayne)", 
    "Japanese Import (w/ Obi)", 
    "UK First Pressing", 
    "French Distribution (Disques Vogue)", 
    "Canadian Import", 
    "German Import (Teldec)"
  ];
  
  const auctionNotes = [
    "Matrix: MASTERING BY FRANKFORD/WAYNE etched in deadwax.",
    "Very clean labels, no spindle wear visible.",
    "Jacket shows minor corner wear, vinyl is pristine.",
    "Loud and clear pressing, perfect for high-end Hi-Fi systems.",
    "Includes original company inner sleeve in great condition.",
    "Promotional copy, rarely found in this NM state.",
    "Deadstock find from a NYC record warehouse.",
    "Auditioned on Altec A7, soundstage is wide and detailed."
  ];

  for (let i = 0; i < 150; i++) {
    const seed = DISCO_GEMS_DATABASE[i % DISCO_GEMS_DATABASE.length];
    const variantIdx = Math.floor(i / DISCO_GEMS_DATABASE.length) % pressVariants.length;
    const noteIdx = (i + 3) % auctionNotes.length;
    
    // IMAGE LOGIC: 12" uses Label Sleeve | LP uses Full Artwork
    let finalCover = seed.f === "12\"" && LABEL_SLEEVES[seed.l] ? LABEL_SLEEVES[seed.l] : seed.img;
    
    // Precios oscilando los 25€ pero con picos realistas de Popsike
    const basePrice = i % 10 === 0 ? seed.p + 25 : (i % 3 === 0 ? seed.p - 10 : seed.p);
    const finalPrice = Math.max(15, basePrice);

    const isSold = i % 6 === 0; // ~16% Sold out rate

    records.push({
      id: `disco_gem_${i + 1}`,
      sku: `MAT-HUB-${5000 + i}`,
      artist: seed.a,
      title: `${seed.t} (${pressVariants[variantIdx]})`,
      slug: `${seed.a.toLowerCase().replace(/\s+/g, '-')}-${seed.t.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      label: seed.l,
      year: seed.y,
      format: seed.f,
      condition: i % 15 === 0 ? "Mint" : "NM",
      genre: seed.g,
      price: finalPrice,
      stock: isSold ? 0 : 1,
      coverUrl: finalCover,
      discogsLink: `https://www.discogs.com/user/ACTIVISTA/collection`,
      description: `${seed.d} ${auctionNotes[noteIdx]} Checked in our laboratory.`,
      sellerId: 's_mat32',
      status: isSold ? 'sold' : 'published',
      tags: [seed.g.toLowerCase(), 'popsike_ref', 'original_press', seed.l.toLowerCase().replace(/\s+/g, '_')]
    });
  }
  return records;
};

export const MOCK_RECORDS: VinylRecord[] = generateUnique150Catalog();

export const MOCK_POSTS: Post[] = [
  {
    id: 'p_hub_1',
    type: 'POST',
    title: 'Popsike Archive: West End Rarities',
    slug: 'popsike-archive-west-end',
    author: 'analog_digger',
    content: 'Inyectamos 150 piezas únicas de la era dorada de NY. Desde copias promocionales de Walter Gibbons hasta rarezas de Detroit House. #Popsike #WestEnd #Salsoul',
    imageUrl: "https://imagedelivery.net/7eVyq4DUYp7Fp7fSI12t_Q/ac1a7472-de26-46de-37f3-7ec5509f5900/public",
    likes: 312,
    comments: [],
    timestamp: 'Hace 5 minutos',
    tags: ['#DiscoLegacy', '#RareGroove'],
    status: 'published'
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e_hub_1',
    title: 'The Walter Gibbons Protocol',
    slug: 'walter-gibbons-protocol',
    date: '2025-03-01',
    time: '21:00',
    location: 'Mat32 Ruzafa',
    description: 'Noche dedicada al pionero del 12\". Sesión de escucha crítica con el sistema Altec A7.',
    category: 'Listening Session',
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800',
    attendees: 48,
    capacity: 50,
    price: 0,
    paidPrice: 15,
    ticketLink: '#',
    lineup: [MOCK_ARTISTS['analog_digger']],
    vibe: ['Disco', 'Garage'],
    status: 'published',
    tags: ['#waltergibbons', '#hifi']
  }
];

export const BAR_MENU: MenuCategory[] = [
  {
    title: 'MIXOLOGÍA DE ALTA FIDELIDAD',
    items: [
      { name: 'WEST END SOUR', price: '10,50', description: 'Bourbon, Limón, Clara de huevo y Bitters de naranja.', highlight: true },
      { name: 'SALSOUL PUNCH', price: '9,50', description: 'Ron añejo, Fruta de la pasión y Lima.', highlight: true }
    ]
  },
  {
    title: 'DIGGER DRINKS',
    items: [
      { name: 'VINO D.O VALENCIA', price: '4,50', highlight: true },
      { name: 'CERVEZA RUZAFA', price: '5,50', highlight: false }
    ]
  }
];

export const MOCK_SELECTORS: SelectorSubmission[] = [];
