
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
    avatarUrl: '',
    bio: 'Santuario Hi-Fi en Ruzafa. Curaduría estricta para Altec A7.',
    location: 'Valencia, Ruzafa',
    isVerified: true,
    specialty: ['Jazz', 'Disco', 'House', 'Ambient']
  }
];

export const DISCOGS_PROFILE_URL = "https://www.discogs.com/es/user/discos-ruzafa";

const RECORD_SEEDS = [
  // JAZZ (10)
  { a: "John Coltrane", t: "Blue Train", g: "Jazz", l: "Blue Note", y: "1957", s: "" },
  { a: "Miles Davis", t: "Kind of Blue", g: "Jazz", l: "Columbia", y: "1959", s: "" },
  { a: "Thelonious Monk", t: "Solo Monk", g: "Jazz", l: "Columbia", y: "1965", s: "" },
  { a: "Charles Mingus", t: "Mingus Ah Um", g: "Jazz", l: "Columbia", y: "1959", s: "" },
  { a: "Art Blakey", t: "Moanin'", g: "Jazz", l: "Blue Note", y: "1958", s: "" },
  { a: "Bill Evans", t: "Sunday at the Village Vanguard", g: "Jazz", l: "Riverside", y: "1961", s: "" },
  { a: "Lee Morgan", t: "The Sidewinder", g: "Jazz", l: "Blue Note", y: "1964", s: "" },
  { a: "Wayne Shorter", t: "Speak No Evil", g: "Jazz", l: "Blue Note", y: "1966", s: "" },
  { a: "Herbie Hancock", t: "Maiden Voyage", g: "Jazz", l: "Blue Note", y: "1965", s: "" },
  { a: "Dexter Gordon", t: "Go!", g: "Jazz", l: "Blue Note", y: "1962", s: "" },
  
  // HOUSE (10)
  { a: "Larry Heard", t: "Sceneries Not Songs", g: "House", l: "Black Market", y: "1994", s: "" },
  { a: "Frankie Knuckles", t: "Beyond the Mix", g: "House", l: "Virgin", y: "1991", s: "" },
  { a: "Moodymann", t: "Black Mahogani", g: "House", l: "Peacefrog", y: "2004", s: "" },
  { a: "Theo Parrish", t: "Parallel Dimensions", g: "House", l: "Ubiquity", y: "2000", s: "" },
  { a: "Kerri Chandler", t: "Kaoz Theory", g: "House", l: "Kaoz", y: "2015", s: "" },
  { a: "Ron Trent", t: "Altered States", g: "House", l: "Prescription", y: "1992", s: "" },
  { a: "Masters At Work", t: "The Album", g: "House", l: "Cutting", y: "1993", s: "" },
  { a: "Omar S", t: "The Best", g: "House", l: "FXHE", y: "2016", s: "" },
  { a: "St Germain", t: "Boulevard", g: "House", l: "F Communications", y: "1995", s: "" },
  { a: "Pepe Bradock", t: "Burning", g: "House", l: "Kif", y: "1999", s: "" },

  // SOUL / FUNK (10)
  { a: "Marvin Gaye", t: "What's Going On", g: "Soul", l: "Tamla", y: "1971", s: "" },
  { a: "Curtis Mayfield", t: "Superfly", g: "Soul", l: "Curtom", y: "1972", s: "" },
  { a: "Sly & The Family Stone", t: "There's a Riot Goin' On", g: "Funk", l: "Epic", y: "1971", s: "" },
  { a: "James Brown", t: "The Payback", g: "Funk", l: "Polydor", y: "1973", s: "" },
  { a: "Aretha Franklin", t: "Lady Soul", g: "Soul", l: "Atlantic", y: "1968", s: "" },
  { a: "Stevie Wonder", t: "Innervisions", g: "Soul", l: "Tamla", y: "1973", s: "" },
  { a: "Issac Hayes", t: "Hot Buttered Soul", g: "Soul", l: "Enterprise", y: "1969", s: "" },
  { a: "Al Green", t: "I'm Still in Love with You", g: "Soul", l: "Hi Records", y: "1972", s: "" },
  { a: "George Clinton", t: "Computer Games", g: "Funk", l: "Capitol", y: "1982", s: "" },
  { a: "Funkadelic", t: "Maggot Brain", g: "Funk", l: "Westbound", y: "1971", s: "" },

  // DISCO (10)
  { a: "Donna Summer", t: "Bad Girls", g: "Disco", l: "Casablanca", y: "1979", s: "" },
  { a: "Chic", t: "Risqué", g: "Disco", l: "Atlantic", y: "1979", s: "" },
  { a: "Giorgio Moroder", t: "From Here to Eternity", g: "Disco", l: "Casablanca", y: "1977", s: "" },
  { a: "Cerrone", t: "Supernature", g: "Disco", l: "Malligator", y: "1977", s: "" },
  { a: "Sister Sledge", t: "We Are Family", g: "Disco", l: "Cotillion", y: "1979", s: "" },
  { a: "Sylvester", t: "Step II", g: "Disco", l: "Fantasy", y: "1978", s: "" },
  { a: "Gino Soccio", t: "Outline", g: "Disco", l: "Warner", y: "1979", s: "" },
  { a: "Change", t: "The Glow of Love", g: "Disco", l: "RFC", y: "1980", s: "" },
  { a: "Boney M.", t: "Nightflight to Venus", g: "Disco", l: "Hansa", y: "1978", s: "" },
  { a: "Village People", t: "Cruisin'", g: "Disco", l: "Casablanca", y: "1978", s: "" },

  // ELECTRONICA / AMBIENT (10)
  { a: "Brian Eno", t: "Music for Airports", g: "Ambient", l: "Polydor", y: "1978", s: "" },
  { a: "Aphex Twin", t: "Selected Ambient Works 85-92", g: "Electronica", l: "Apollo", y: "1992", s: "" },
  { a: "Kraftwerk", t: "The Man-Machine", g: "Electronica", l: "Kling Klang", y: "1978", s: "" },
  { a: "Boards of Canada", t: "Music Has the Right to Children", g: "Electronica", l: "Warp", y: "1998", s: "" },
  { a: "Global Communication", t: "76:14", g: "Ambient", l: "Dedicated", y: "1994", s: "" },
  { a: "Steve Roach", t: "Structures from Silence", g: "Ambient", l: "Fortuna", y: "1984", s: "" },
  { a: "The Orb", t: "Adventures Beyond the Ultraworld", g: "Electronica", l: "Big Life", y: "1991", s: "" },
  { a: "Four Tet", t: "Rounds", g: "Electronica", l: "Domino", y: "2003", s: "" },
  { a: "Autechre", t: "Tri Repetae", g: "Electronica", l: "Warp", y: "1995", s: "" },
  { a: "Gas", t: "Zauberberg", g: "Ambient", l: "Mille Plateaux", y: "1997", s: "" },

  // AFROBEAT / LATIN (10)
  { a: "Fela Kuti", t: "Zombie", g: "Afrobeat", l: "Coconut", y: "1976", s: "" },
  { a: "William Onyeabor", t: "Who is William Onyeabor?", g: "Afrobeat", l: "Luaka Bop", y: "2013", s: "" },
  { a: "Tony Allen", t: "No Accommodation for Lagos", g: "Afrobeat", l: "Phonogram", y: "1979", s: "" },
  { a: "Ebo Taylor", t: "Love and Death", g: "Afrobeat", l: "Strut", y: "2010", s: "" },
  { a: "Ray Barretto", t: "Acid", g: "Latin", l: "Fania", y: "1968", s: "" },
  { a: "Willie Colón", t: "The Hustler", g: "Latin", l: "Fania", y: "1968", s: "" },
  { a: "Mulatu Astatke", t: "Ethio Jazz", g: "Jazz", l: "Amha", y: "1974", s: "" },
  { a: "Manu Dibango", t: "Soul Makossa", g: "Afrobeat", l: "Fiesta", y: "1972", s: "" },
  { a: "Celia Cruz", t: "Celia & Johnny", g: "Latin", l: "Vaya", y: "1974", s: "" },
  { a: "Buena Vista Social Club", t: "Self Titled", g: "Latin", l: "World Circuit", y: "1997", s: "" },

  // ADDITIONAL RARITIES (20)
  { a: "Lonnie Liston Smith", t: "Expansions", g: "Jazz-Funk", l: "Flying Dutchman", y: "1975", s: "" },
  { a: "Donald Byrd", t: "Places and Spaces", g: "Jazz-Funk", l: "Blue Note", y: "1975", s: "" },
  { a: "Roy Ayers", t: "Everybody Loves the Sunshine", g: "Soul", l: "Polydor", y: "1976", s: "" },
  { a: "Alice Coltrane", t: "Ptah, the El Daoud", g: "Jazz", l: "Impulse!", y: "1970", s: "" },
  { a: "Pharoah Sanders", t: "The Creator Has a Master Plan", g: "Jazz", l: "Impulse!", y: "1969", s: "" },
  { a: "Hiroshi Yoshimura", t: "Green", g: "Ambient", l: "Air", y: "1986", s: "" },
  { a: "Suso Saiz", t: "Odisea", g: "Ambient", l: "Music When The Lights Go Out", y: "2016", s: "" },
  { a: "Tatsuro Yamashita", t: "For You", g: "City Pop", l: "Air", y: "1982", s: "" },
  { a: "Mariya Takeuchi", t: "Variety", g: "City Pop", l: "Moon", y: "1984", s: "" },
  { a: "Casiopea", t: "Mint Jams", g: "Fusion", l: "Alfa", y: "1982", s: "" },
  { a: "J Dilla", t: "Donuts", g: "Hip Hop", l: "Stones Throw", y: "2006", s: "" },
  { a: "Madlib", t: "Shades of Blue", g: "Hip Hop", l: "Blue Note", y: "2003", s: "" },
  { a: "Flying Lotus", t: "Cosmogramma", g: "Electronica", l: "Warp", y: "2010", s: "" },
  { a: "Burial", t: "Untrue", g: "Electronica", l: "Hyperdub", y: "2007", s: "" },
  { a: "Nicolas Jaar", t: "Space Is Only Noise", g: "Electronica", l: "Circus Company", y: "2011", s: "" },
  { a: "Floating Points", t: "Elaenia", g: "Electronica", l: "Pluto", y: "2015", s: "" },
  { a: "Kamasi Washington", t: "The Epic", g: "Jazz", l: "Brainfeeder", y: "2015", s: "" },
  { a: "Thundercat", t: "Drunk", g: "Funk", l: "Brainfeeder", y: "2017", s: "" },
  { a: "Kaytranada", t: "99.9%", g: "House", l: "XL", y: "2016", s: "" },
  { a: "BadBadNotGood", t: "IV", g: "Jazz", l: "Innovative Leisure", y: "2016", s: "" }
];

export const MOCK_RECORDS: VinylRecord[] = RECORD_SEEDS.map((seed, i) => ({
  id: `mat32_v25_${i}`,
  sku: `MAT32-25-${i.toString().padStart(3, '0')}`,
  artist: seed.a,
  title: seed.t,
  slug: `${seed.a.toLowerCase().replace(/\s+/g, '-')}-${seed.t.toLowerCase().replace(/\s+/g, '-')}`,
  label: seed.l,
  year: seed.y,
  format: "LP",
  condition: "NM",
  genre: seed.g,
  price: 25 + (i % 50),
  stock: 1,
  coverUrl: "",
  discogsLink: DISCOGS_PROFILE_URL,
  streamingLink: seed.s,
  description: `Original pressing on ${seed.l}. Curated for Hi-Fi listening.`,
  sellerId: 'discos_ruzafa',
  status: 'published',
  tags: [seed.g.toLowerCase(), 'curated']
}));

export const MOCK_POSTS: Post[] = [
  {
    id: 'p_rz_25',
    type: 'POST',
    title: 'Archive v25.0: The Global Groove Protocol',
    slug: 'global-groove-v25',
    author: 'discos_ruzafa',
    content: 'Actualización masiva del catálogo. 80 nuevos discos únicos que abarcan desde el Afrobeat hasta el Ambient. #Mat32 #DiverseSounds #HiFi',
    imageUrl: "",
    likes: 5800,
    comments: [],
    timestamp: 'Hace 2 minutos',
    tags: ['#NewArrivals', '#VinylCollection'],
    status: 'published'
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e_open_listening_12_feb_2026',
    title: 'Open Decks: Listening Session I',
    slug: 'open-decks-listening-feb-12-2026',
    date: '2026-02-12',
    time: '19:30',
    location: 'Mat32 Ruzafa',
    description: 'Protocolo de escucha abierta 2026. Trae tus joyas y compártelas en nuestro sistema Altec A7. Sin géneros, solo calidad.',
    category: 'Open Decks',
    imageUrl: '',
    attendees: 0,
    capacity: 100,
    price: 0,
    paidPrice: 0,
    ticketLink: '#',
    lineup: [MOCK_ARTISTS['mat32_crew']],
    vibe: ['Community', 'Eclectic', 'High-Fidelity'],
    status: 'published',
    tags: ['#opendecks', '#2026', '#valencia']
  },
  {
    id: 'e_open_listening_19_feb_2026',
    title: 'Open Decks: Listening Session II',
    slug: 'open-decks-listening-feb-19-2026',
    date: '2026-02-19',
    time: '19:30',
    location: 'Mat32 Ruzafa',
    description: 'Segunda jornada 2026. Espacio para selectores locales. La cabina es tuya para explorar nuevos horizontes sonoros.',
    category: 'Open Decks',
    imageUrl: '',
    attendees: 0,
    capacity: 100,
    price: 0,
    paidPrice: 0,
    ticketLink: '#',
    lineup: [MOCK_ARTISTS['mat32_crew']],
    vibe: ['Discovery', 'Analog Ritual', 'Selectors'],
    status: 'published',
    tags: ['#listening', '#community', '#2026']
  }
];

export const BAR_MENU: MenuCategory[] = [
  {
    title: 'SIGNATURE DRINKS',
    items: [
      { name: 'MARTINI 32', price: '14,00', description: 'Ginebra Premium y esencia cítrica de Valencia.', highlight: true },
      { name: 'NEGRONI RUZAFA', price: '12,50', description: 'El clásico equilibrado para largas sesiones de escucha.', highlight: true },
      { name: 'ANALOG OLD FASHIONED', price: '13,50', description: 'Borbón, bitters de cacao y piel de naranja ahumada.' }
    ]
  },
  {
    title: 'CLASSIC SELECTION',
    items: [
      { name: 'GIN TONIC PREMIUM', price: '11,00', description: 'Selección de botánicos según la vibración de la noche.' },
      { name: 'MOSCOW MULE', price: '10,50', description: 'Ginger beer artesanal y toque de lima fresca.' },
      { name: 'MEZCAL MARGARITA', price: '13,00', description: 'Toque ahumado y sal de gusano.' }
    ]
  },
  {
    title: 'WINE & BEER',
    items: [
      { name: 'TINTO VALENCIA (COPA)', price: '4,50', description: 'Bobal seleccionado de pequeños productores locales.' },
      { name: 'BLANCO MARINA ALTA (COPA)', price: '4,00', description: 'Seco, afrutado y fresco.' },
      { name: 'CRAFT BEER MAT32', price: '5,50', description: 'IPA de edición limitada para el local.' },
      { name: 'CERVEZA DE GRIFO', price: '3,50', description: 'Fría y directa.' }
    ]
  },
  {
    title: 'HI-FI SNACKS',
    items: [
      { name: 'TABLA DE QUESOS CURADOS', price: '15,00', description: 'Selección de quesos nacionales y frutos secos.' },
      { name: 'OLIVAS RUZAFA', price: '3,50', description: 'Aliño secreto de la casa.' }
    ]
  }
];

export const MOCK_SELECTORS: SelectorSubmission[] = [];
