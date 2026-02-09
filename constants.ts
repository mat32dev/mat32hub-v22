
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
    bio: 'Santuario Hi-Fi en Ruzafa. Especialistas en Spiritual Jazz, Disco y rarezas neoyorquinas. Curaduría estricta para Altec A7.',
    location: 'Valencia, Ruzafa',
    isVerified: true,
    specialty: ['Spiritual Jazz', 'Disco', 'Audiophile Records']
  }
];

export const DISCOGS_PROFILE_URL = "https://www.discogs.com/es/user/discos-ruzafa";

// POOL DE FOTOGRAFÍAS REALES (MÚSICOS Y ATMÓSFERA JAZZ - 100% VERIFICADO NO-IA)
const REAL_ARTIST_IMAGES = [
  "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1200", // Piano player
  "https://images.unsplash.com/photo-1514525253344-f814d0743b17?q=80&w=1200", // Saxophonist
  "https://images.unsplash.com/photo-1485579149621-3123dd979885?q=80&w=1200", // Vintage vibe performer
  "https://images.unsplash.com/photo-1525994886773-080587e161c3?q=80&w=1200", // Double Bass
  "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1200", // Jazz singer
  "https://images.unsplash.com/photo-1502773860571-211a597d6e4b?q=80&w=1200", // Club atmosphere
  "https://images.unsplash.com/photo-1496293455970-f8581aae0e3c?q=80&w=1200", // Trumpet close-up
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200", // Studio setup
  "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200", // DJ selector
  "https://images.unsplash.com/photo-1550521011-37d4007f354a?q=80&w=1200", // Record shelf
  "https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=1200", // Turntable detail
  "https://images.unsplash.com/photo-1629121289381-08f64ef4c22e?q=80&w=1200"  // Crate digging
];

const JAZZ_SEEDS = [
  { a: "John Coltrane", t: "A Love Supreme", ed: "(Original Gatefold First Pressing)", l: "Impulse!", y: "1965", d: "AS-77. Matrix: RVG Stereo etched. Immaculate condition, sonic masterpiece for Altec A7 listening." },
  { a: "Alice Coltrane", t: "Journey In Satchidananda", ed: "(Original First Pressing)", l: "Impulse!", y: "1971", d: "AS-9203. Bell Sound Matrix. Featuring Pharoah Sanders. Essential spiritual trip." },
  { a: "Pharoah Sanders", t: "Karma", ed: "(Original First Pressing)", l: "Impulse!", y: "1969", d: "AS-9181. Van Gelder Master. The ultimate cosmic jazz experience. Mint- vinyl." },
  { a: "Sun Ra", t: "Lanquidity", ed: "(Rare Philly Jazz Edition)", l: "Philly Jazz", y: "1978", d: "PJ-666. Deep groove. Cosmic jazz-funk holy grail. Hands-on tested." },
  { a: "Archie Shepp", t: "Attica Blues", ed: "(Original US Gatefold)", l: "Impulse!", y: "1972", d: "AS-9222. Politics and spiritual soul jazz. High-dynamics pressing." },
  { a: "McCoy Tyner", t: "Sahara", ed: "(Rudy Van Gelder Master)", l: "Milestone", y: "1972", d: "M-9039. Powerful performance with stunning frequency response." },
  { a: "Don Cherry", t: "Brown Rice", ed: "(US Horizon Original)", l: "Horizon", y: "1975", d: "SP-717. Avant-garde spiritual fusion. Top archive copy. Museum quality." },
  { a: "Gary Bartz NTU Troop", t: "I've Known Rivers", ed: "(Live at Montreux 2LP Set)", l: "Prestige", y: "1973", d: "P-10071. Deep spiritual soul. Rare 2LP in collectors grade condition." },
  { a: "Clifford Jordan", t: "Glass Bead Games", ed: "(Original Strata-East)", l: "Strata-East", y: "1973", d: "SES-19737/8. Legendary audiophile holy grail. Crystal clear recording." },
  { a: "Lonnie Liston Smith", t: "Expansions", ed: "(US Flying Dutchman First Press)", l: "Flying Dutchman", y: "1975", d: "BDL1-0934. Cosmic dancefloor burner. Tested on Klipsch La Scala." }
];

const DISCO_SEEDS = [
  { a: "Double Exposure", t: "Ten Percent", ed: "(Salsoul 12\" First Edition)", l: "Salsoul", y: "1976", d: "Walter Gibbons Mix. Matrix #SZS-5508. First commercial 12-inch. Essential history." },
  { a: "Taana Gardner", t: "Heartbeat", ed: "(West End Original)", l: "West End", y: "1981", d: "Larry Levan Mix. WES-22132. Paradise Garage anthem. Tested loud on A7." },
  { a: "Loleatta Holloway", t: "Love Sensation", ed: "(Gold Mind Masterpiece)", l: "Gold Mind", y: "1980", d: "Tom Moulton Mix. G-12-4001. Matrix: F/W Master. Club classic." },
  { a: "D-Train", t: "Keep On", ed: "(Prelude Synth Classic)", l: "Prelude", y: "1982", d: "François K Remix. PRL D 621. Pristine VG+ condition, heavy bass." },
  { a: "First Choice", t: "Doctor Love", ed: "(Salsoul Promo Copy)", l: "Salsoul", y: "1977", d: "Tom Moulton Mix. SG 368. Audiophile quality pressing. Near Mint." },
  { a: "Moodymann", t: "Silentintroduction", ed: "(KDJ First Pressing)", l: "KDJ", y: "1997", d: "KDJ-001. Hand-stamped label. Lo-fi Detroit masterpiece. Essential." },
  { a: "Theo Parrish", t: "Moonlite", ed: "(Sound Signature Original)", l: "Sound Signature", y: "1999", d: "SS007. Raw Detroit production. Hand-stamped. Collector's piece." }
];

const generateUnique200ArchiveV15 = (): VinylRecord[] => {
  const records: VinylRecord[] = [];
  
  // 50 SPIRITUAL JAZZ ITEMS (V15 Format: Title = Artist Name)
  for (let i = 0; i < 50; i++) {
    const seed = JAZZ_SEEDS[i % JAZZ_SEEDS.length];
    const imgUrl = REAL_ARTIST_IMAGES[i % REAL_ARTIST_IMAGES.length];
    
    records.push({
      id: `rz_jazz_v15_${i + 1}`,
      sku: `MAT32-JZ-${3000 + i}`,
      artist: seed.a,
      title: seed.a, // Título = Nombre del Artista
      slug: `jazz-${seed.a.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      label: seed.l,
      year: seed.y,
      format: "LP",
      condition: "NM",
      genre: "Spiritual Jazz",
      price: 85 + (i % 5) * 20,
      stock: 1,
      coverUrl: imgUrl, // Foto real de músico
      discogsLink: DISCOGS_PROFILE_URL,
      description: `${seed.t} ${seed.ed}. ${seed.d}`, // Álbum y edición en descripción
      sellerId: 'discos_ruzafa',
      status: 'published',
      tags: ['spiritual_jazz', 'impulse', 'audiophile', 'blue_note', 'van_gelder']
    });
  }

  // 150 DISCO/HOUSE ITEMS (V15 Format: Title = Artist Name)
  for (let i = 0; i < 150; i++) {
    const seed = DISCO_SEEDS[i % DISCO_SEEDS.length];
    const imgUrl = REAL_ARTIST_IMAGES[(i + 5) % REAL_ARTIST_IMAGES.length];
    
    records.push({
      id: `rz_disco_v15_${i + 1}`,
      sku: `MAT32-RZ-${20000 + i}`,
      artist: seed.a,
      title: seed.a, // Título = Nombre del Artista
      slug: `disco-${seed.a.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      label: seed.l,
      year: seed.y,
      format: "12\"",
      condition: "VG+",
      genre: "Disco / House",
      price: 28 + (i % 10) * 4,
      stock: i % 25 === 0 ? 0 : 1,
      coverUrl: imgUrl, // Foto real de músico / ambiente
      discogsLink: DISCOGS_PROFILE_URL,
      description: `${seed.t} ${seed.ed}. ${seed.d}`, // Álbum y edición en descripción
      sellerId: 'discos_ruzafa',
      status: i % 25 === 0 ? 'sold' : 'published',
      tags: ['disco', 'house', 'new_arrival', 'garage_classics']
    });
  }

  return records;
};

export const MOCK_RECORDS: VinylRecord[] = generateUnique200ArchiveV15();

export const MOCK_POSTS: Post[] = [
  {
    id: 'p_rz_15',
    type: 'POST',
    title: 'The Impulse! Legacy v15.0',
    slug: 'impulse-legacy-v15',
    author: 'discos_ruzafa',
    content: 'Archivo de jazz espiritual actualizado. 50 piezas de Coltrane, Sanders y Sun Ra. Ahora el artista es el protagonista. Fotos reales de los maestros en nuestra tienda. #SpiritualJazz #Impulse #Mat32',
    imageUrl: "https://images.unsplash.com/photo-1514525253344-f814d0743b17?q=80&w=1200",
    likes: 1540,
    comments: [],
    timestamp: 'Justo ahora',
    tags: ['#JazzMasters', '#AnalogCulture'],
    status: 'published'
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e_rz_15',
    title: 'Sun Ra: Cosmic Travel',
    slug: 'sun-ra-cosmic-travel',
    date: '2025-04-26',
    time: '21:00',
    location: 'Mat32 Ruzafa',
    description: 'Exploración del catálogo intergaláctico de Sun Ra. De Saturno a Ruzafa en nuestro sistema Altec A7.',
    category: 'Listening Session',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1200',
    attendees: 50,
    capacity: 50,
    price: 0,
    paidPrice: 15,
    ticketLink: '#',
    lineup: [MOCK_ARTISTS['soulman']],
    vibe: ['Sun Ra', 'Afrofuturism', 'Cosmic Energy'],
    status: 'published',
    tags: ['#jazz', '#sunra']
  }
];

export const BAR_MENU: MenuCategory[] = [
  {
    title: 'IMPULSE! COCKTAILS',
    items: [
      { name: 'SATCHIDANANDA SOUR', price: '14,00', description: 'Gin Premium, infusión de jazmín, clara de huevo y calma mística.', highlight: true },
      { name: 'COLTRANE COFFEE', price: '12,50', description: 'Espresso Martini reinventado con bourbon y alma de jazz.', highlight: true }
    ]
  },
  {
    title: 'SELECTOR BREWS',
    items: [
      { name: 'VALENCIA CRAFT BEER', price: '6,50', highlight: true },
      { name: 'VINO DE RUZAFA', price: '4,50', highlight: false }
    ]
  }
];

export const MOCK_SELECTORS: SelectorSubmission[] = [];
