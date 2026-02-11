
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
    specialty: ['Jazz', 'Disco', 'House', 'Ambient', 'Afrobeat']
  }
];

export const DISCOGS_PROFILE_URL = "https://www.discogs.com/es/user/discos-ruzafa";

const BC_BASE = "https://bandcamp.com/EmbeddedPlayer/album=";
const BC_STYLE = "/size=large/bgcol=333333/linkcol=ea580c/minimal=true/transparent=true/";

const RECORD_SEEDS = [
  // JAZZ
  { a: "John Coltrane", t: "A Love Supreme", g: "Jazz", l: "Impulse!", y: "1965", s: `${BC_BASE}2308115201${BC_STYLE}`, d: "Suite de jazz espiritual en cuatro partes. Edición clásica de mediados de los 60." },
  { a: "Alice Coltrane", t: "Journey In Satchidananda", g: "Jazz", l: "Impulse!", y: "1971", s: `${BC_BASE}4013444211${BC_STYLE}`, d: "Fusión de jazz modal con instrumentación de arpa y tambura india." },
  { a: "Pharoah Sanders", t: "Karma", g: "Jazz", l: "Impulse!", y: "1969", s: `${BC_BASE}3082522770${BC_STYLE}`, d: "Referente del free jazz espiritual con extensas improvisaciones percusivas." },
  { a: "Miles Davis", t: "Kind of Blue", g: "Jazz", l: "Columbia", y: "1959", s: "", d: "Jazz modal atmosférico. Considerado el álbum más vendido e influyente del género." },
  { a: "Herbie Hancock", t: "Maiden Voyage", g: "Jazz", l: "Blue Note", y: "1965", s: `${BC_BASE}1230198651${BC_STYLE}`, d: "Jazz moderno con temática oceánica y arreglos sofisticados de piano." },
  { a: "Wayne Shorter", t: "Speak No Evil", g: "Jazz", l: "Blue Note", y: "1966", s: `${BC_BASE}3634045550${BC_STYLE}`, d: "Hard-bop con tintes místicos y una formación estelar de la era dorada de Blue Note." },
  { a: "Sun Ra", t: "Lanquidity", g: "Jazz", l: "Philly Jazz", y: "1978", s: `${BC_BASE}3769152285${BC_STYLE}`, d: "Fusión de jazz afro-futurista con ritmos funk y sintetizadores analógicos." },
  { a: "Archie Shepp", t: "Attica Blues", g: "Jazz", l: "Impulse!", y: "1972", s: `${BC_BASE}3324546413${BC_STYLE}`, d: "Orquestación de jazz con fuerte carga política, soul y elementos de gospel." },
  { a: "Donald Byrd", t: "Places and Spaces", g: "Jazz-Funk", l: "Blue Note", y: "1975", s: "", d: "Producción de los hermanos Mizell. Fusión perfecta de jazz-funk y arreglos de cuerdas." },
  { a: "Lonnie Liston Smith", t: "Expansions", g: "Jazz-Funk", l: "Flying Dutchman", y: "1975", s: "", d: "Grooves percusivos y texturas cósmicas orientadas a la pista de baile espiritual." },

  // HOUSE
  { a: "Larry Heard", t: "Sceneries Not Songs", g: "House", l: "Black Market", y: "1994", s: `${BC_BASE}1073809633${BC_STYLE}`, d: "Deep house de Chicago atmosférico. Paisajes electrónicos cálidos y melódicos." },
  { a: "Moodymann", t: "Silentintroduction", g: "House", l: "Peacefrog", y: "1997", s: `${BC_BASE}1833177726${BC_STYLE}`, d: "House de Detroit con uso intensivo de samples de soul y jazz. Sonido lo-fi crudo." },
  { a: "Theo Parrish", t: "Parallel Dimensions", g: "House", l: "Ubiquity", y: "2000", s: "", d: "Electrónica experimental con ritmos asimétricos y raíces jazzísticas profundas." },
  { a: "Kerri Chandler", t: "Kaoz Theory", g: "House", l: "Kaoz", y: "2015", s: "", d: "House con fuerte presencia de piano y bajos contundentes. Sonido clásico de New Jersey." },
  { a: "Ron Trent", t: "Altered States", g: "House", l: "Prescription", y: "1992", s: "", d: "Pista hipnótica de largo desarrollo. Definió el house atmosférico de los 90." },
  { a: "Pepe Bradock", t: "Burning", g: "House", l: "Kif", y: "1999", s: "", d: "House francés de culto basado en samples psicodélicos y ritmos elegantes." },
  { a: "St Germain", t: "Boulevard", g: "House", l: "F Communications", y: "1995", s: "", d: "Fusión pionera de jazz en directo y estructuras de deep house francés." },
  { a: "Masters At Work", t: "The Album", g: "House", l: "Cutting", y: "1993", s: "", d: "Producción ecléctica que mezcla house, jazz y ritmos latinos desde Nueva York." },
  { a: "Omar S", t: "The Best", g: "House", l: "FXHE", y: "2016", s: "", d: "House directo y sin adornos. Minimalismo analógico característico de Detroit." },
  { a: "Floating Points", t: "Elaenia", g: "House", l: "Pluto", y: "2015", s: `${BC_BASE}1506541584${BC_STYLE}`, d: "Composición electrónica que fusiona el jazz contemporáneo con texturas de sintetizador." },

  // SOUL / FUNK
  { a: "Marvin Gaye", t: "What's Going On", g: "Soul", l: "Tamla", y: "1971", s: "", d: "Obra maestra del soul consciente. Arreglos orquestales y temática social profunda." },
  { a: "Roy Ayers", t: "Everybody Loves the Sunshine", g: "Soul", l: "Polydor", y: "1976", s: "", d: "Soul-jazz atmosférico centrado en el vibráfono. Clásico del sonido veraniego." },
  { a: "Curtis Mayfield", t: "Superfly", g: "Soul", l: "Curtom", y: "1972", s: "", d: "Grooves de funk cinemático. Banda sonora esencial de la cultura negra de los 70." },
  { a: "Aretha Franklin", t: "Lady Soul", g: "Soul", l: "Atlantic", y: "1968", s: "", d: "Interpretación vocal poderosa. Una de las cumbres del soul clásico americano." },
  { a: "Sly & The Family Stone", t: "There's a Riot Goin' On", g: "Funk", l: "Epic", y: "1971", s: "", d: "Funk oscuro basado en el uso pionero de cajas de ritmos y grabaciones densas." },
  { a: "Funkadelic", t: "Maggot Brain", g: "Funk", l: "Westbound", y: "1971", s: "", d: "Psicodelia y funk fusionados con solos de guitarra eléctrica legendarios." },
  { a: "James Brown", t: "The Payback", g: "Funk", l: "Polydor", y: "1973", s: "", d: "Doble LP con grooves cíclicos fundamentales para la historia del hip-hop." },
  { a: "Issac Hayes", t: "Hot Buttered Soul", g: "Soul", l: "Enterprise", y: "1969", s: "", d: "Soul expansivo con versiones largas y orquestaciones cinematográficas densas." },
  { a: "Stevie Wonder", t: "Innervisions", g: "Soul", l: "Tamla", y: "1973", s: "", d: "Soul progresivo grabado con sintetizadores analógicos. Temática urbana y política." },
  { a: "Shuggie Otis", t: "Inspiration Information", g: "Soul", l: "Epic", y: "1974", s: "", d: "Soul psicodélico e íntimo grabado casi íntegramente de forma solitaria." },

  // DISCO
  { a: "Donna Summer", t: "Bad Girls", g: "Disco", l: "Casablanca", y: "1979", s: "", d: "Producción de Giorgio Moroder que mezcla el disco con sintetizadores y rock." },
  { a: "Chic", t: "Risqué", g: "Disco", l: "Atlantic", y: "1979", s: "", d: "Líneas de bajo icónicas y arreglos de guitarra rítmica de Nile Rodgers." },
  { a: "Giorgio Moroder", t: "From Here to Eternity", g: "Disco", l: "Casablanca", y: "1977", s: "", d: "Disco futurista basado exclusivamente en sintetizadores. Precursor del techno." },
  { a: "Cerrone", t: "Supernature", g: "Disco", l: "Malligator", y: "1977", s: "", d: "Space disco francés con percusiones potentes y sintetizadores expansivos." },
  { a: "Sylvester", t: "Step II", g: "Disco", l: "Fantasy", y: "1978", s: "", d: "Energía Hi-NRG impulsada por voces de falsete y ritmos de baile trepidantes." },
  { a: "Gino Soccio", t: "Outline", g: "Disco", l: "Warner", y: "1979", s: "", d: "Disco elegante con influencias europeas. Producción minimalista y sofisticada." },
  { a: "Change", t: "The Glow of Love", g: "Disco", l: "RFC", y: "1980", s: "", d: "Post-disco de alta gama con la colaboración vocal de Luther Vandross." },
  { a: "Boney M.", t: "Nightflight to Venus", g: "Disco", l: "Hansa", y: "1978", s: "", d: "Pop disco con ritmos tribales y arreglos orquestales. Éxito masivo en Europa." },
  { a: "Sister Sledge", t: "We Are Family", g: "Disco", l: "Cotillion", y: "1979", s: "", d: "Producción de la factoría Chic. Himnos de unidad y grooves de baile clásicos." },
  { a: "Loose Joints", t: "Pop Your Funk", g: "Disco", l: "West End", y: "1980", s: "", d: "Post-disco experimental neoyorquino con arreglos de Arthur Russell." },

  // ELECTRONICA
  { a: "Aphex Twin", t: "Selected Ambient Works 85-92", g: "Electronica", l: "Apollo", y: "1992", s: `${BC_BASE}2418512140${BC_STYLE}`, d: "Referente del IDM. Ritmos analógicos hipnóticos y melodías etéreas." },
  { a: "Boards of Canada", t: "Music Has the Right to Children", g: "Electronica", l: "Warp", y: "1998", s: `${BC_BASE}3254924765${BC_STYLE}`, d: "Electrónica nostálgica basada en samples antiguos y texturas de sintetizador analógico." },
  { a: "Kraftwerk", t: "The Man-Machine", g: "Electronica", l: "Kling Klang", y: "1978", s: "", d: "Estética robótica y secuenciación precisa. Fundamental para el desarrollo del techno." },
  { a: "Four Tet", t: "Rounds", g: "Electronica", l: "Domino", y: "2003", s: `${BC_BASE}1237937920${BC_STYLE}`, d: "Folktronica que combina samples acústicos procesados con ritmos electrónicos." },
  { a: "Burial", t: "Untrue", g: "Electronica", l: "Hyperdub", y: "2007", s: `${BC_BASE}1482810459${BC_STYLE}`, d: "Paisaje sonoro urbano y melancólico. Voces procesadas y ritmos de 2-step dubstep." },
  { a: "Nicolas Jaar", t: "Space Is Only Noise", g: "Electronica", l: "Circus Company", y: "2011", s: `${BC_BASE}3370399426${BC_STYLE}`, d: "Electrónica de tempo lento con texturas cinematográficas y samples orgánicos." },
  { a: "Autechre", t: "Tri Repetae", g: "Electronica", l: "Warp", y: "1995", s: `${BC_BASE}2951717325${BC_STYLE}`, d: "Diseño sonoro industrial y geométrico. Una cumbre de la electrónica abstracta." },
  { a: "Global Communication", t: "76:14", g: "Ambient", l: "Dedicated", y: "1994", s: "", d: "Ambient inmersivo de los 90. Capas de sintetizador profundas y desarrollo lento." },
  { a: "The Orb", t: "Adventures Beyond the Ultraworld", g: "Electronica", l: "Big Life", y: "1991", s: "", d: "Ambient house expansivo con samples espaciales y texturas dub." },
  { a: "Flying Lotus", t: "Cosmogramma", g: "Electronica", l: "Warp", y: "2010", s: `${BC_BASE}2875153204${BC_STYLE}`, d: "Fusión de jazz, hip-hop y glitch en una suite psicodélica multidimensional." },

  // AMBIENT
  { a: "Brian Eno", t: "Music for Airports", g: "Ambient", l: "Polydor", y: "1978", s: "", d: "Definición del género ambient. Música diseñada para crear un entorno calmado." },
  { a: "Hiroshi Yoshimura", t: "Green", g: "Ambient", l: "Air Records", y: "1986", s: `${BC_BASE}2621040447${BC_STYLE}`, d: "Ambient japonés minimalista. Texturas cristalinas inspiradas en la naturaleza." },
  { a: "Suso Saiz", t: "Odisea", g: "Ambient", l: "Music When Lights Go Out", y: "2016", s: `${BC_BASE}2262704381${BC_STYLE}`, d: "Antología de guitarra procesada y paisajes sonoros electrónicos desde España." },
  { a: "Steve Roach", t: "Structures from Silence", g: "Ambient", l: "Fortuna", y: "1984", s: `${BC_BASE}3480036687${BC_STYLE}`, d: "Clásico del ambient meditativo. Sintetizadores de respiración lenta y larga duración." },
  { a: "Gas", t: "Zauberberg", g: "Ambient", l: "Mille Plateaux", y: "1997", s: "", d: "Techno ambiental inmersivo. Capas densas que evocan la atmósfera de un bosque." },
  { a: "William Basinski", t: "The Disintegration Loops", g: "Ambient", l: "2062", y: "2002", s: "", d: "Registro sonoro de la degradación física de cintas magnéticas analógicas." },
  { a: "Laraaji", t: "Ambient 3: Day of Radiance", g: "Ambient", l: "EG", y: "1980", s: "", d: "Zither y martillos dulces grabados por Brian Eno para una atmósfera celestial." },
  { a: "Stars of the Lid", t: "And Their Refinement of the Decline", g: "Ambient", l: "Kranky", y: "2007", s: `${BC_BASE}2968132047${BC_STYLE}`, d: "Drones orquestales mínimos y expansivos para escucha profunda y concentrada." },
  { a: "Gigi Masin", t: "Talk to the Sea", g: "Ambient", l: "Music From Memory", y: "2014", s: `${BC_BASE}3072212953${BC_STYLE}`, d: "Melodías acuáticas y minimalistas de uno de los maestros del ambient italiano." },
  { a: "Midori Takada", t: "Through the Looking Glass", g: "Ambient", l: "RCA", y: "1983", s: `${BC_BASE}1232811442${BC_STYLE}`, d: "Minimalismo percusivo japonés que explora el espacio y el silencio." },

  // AFROBEAT / LATIN
  { a: "Fela Kuti", t: "Zombie", g: "Afrobeat", l: "Coconut", y: "1976", s: `${BC_BASE}2474883492${BC_STYLE}`, d: "Ritmo afrobeat imparable con vientos potentes y crítica social feroz." },
  { a: "William Onyeabor", t: "Who is William Onyeabor?", g: "Afrobeat", l: "Luaka Bop", y: "2013", s: `${BC_BASE}1777264835${BC_STYLE}`, d: "Funk sintetizado desde Nigeria. Ritmos de baile hipnóticos y electrónicos." },
  { a: "Tony Allen", t: "No Accommodation for Lagos", g: "Afrobeat", l: "Phonogram", y: "1979", s: "", d: "Polirritmia maestra por el arquitecto de la batería en el afrobeat." },
  { a: "Ray Barretto", t: "Acid", g: "Latin", l: "Fania", y: "1968", s: "", d: "Fusión pionera de boogaloo, soul y jazz latino neoyorquino." },
  { a: "Willie Colón", t: "The Hustler", g: "Latin", l: "Fania", y: "1968", s: "", d: "Salsa dura clásica con arreglos de trombón agresivos y vibración urbana." },
  { a: "Mulatu Astatke", t: "Ethio Jazz", g: "Jazz", l: "Amha", y: "1974", s: "", d: "Escalas etíopes combinadas con instrumentación de jazz occidental contemporáneo." },
  { a: "Manu Dibango", t: "Soul Makossa", g: "Afrobeat", l: "Fiesta", y: "1972", s: "", d: "Éxito internacional que conectó el makossa camerunés con la escena disco." },
  { a: "Celia Cruz", t: "Celia & Johnny", g: "Latin", l: "Vaya", y: "1974", s: "", d: "Álbum clásico de salsa con la energía vocal de Cruz y la orquesta de Pacheco." },
  { a: "Buena Vista Social Club", t: "Self Titled", g: "Latin", l: "World Circuit", y: "1997", s: "", d: "Grabación orgánica que rescató los sonidos tradicionales del son cubano." },
  { a: "Joe Bataan", t: "Gypsy Woman", g: "Latin", l: "Fania", y: "1967", s: "", d: "Latin soul y boogaloo característico del barrio latino de Nueva York." },

  // HIP HOP / CITY POP
  { a: "J Dilla", t: "Donuts", g: "Hip Hop", l: "Stones Throw", y: "2006", s: `${BC_BASE}312683073${BC_STYLE}`, d: "Collage rítmico instrumental. Reinvención radical del arte del sampling." },
  { a: "Madlib", t: "Shades of Blue", g: "Hip Hop", l: "Blue Note", y: "2003", s: "", d: "Remezclas y reinterpretaciones del catálogo histórico de Blue Note bajo filtros hip-hop." },
  { a: "MF DOOM", t: "Mm..Food", g: "Hip Hop", l: "Rhymesayers", y: "2004", s: "", d: "Lirismo complejo y rimas internas sobre samples de jazz y dibujos animados." },
  { a: "A Tribe Called Quest", t: "The Low End Theory", g: "Hip Hop", l: "Jive", y: "1991", s: "", d: "Conexión definitiva entre el jazz-rap y líneas de bajo acústico profundas." },
  { a: "Nujabes", t: "Metaphorical Music", g: "Hip Hop", l: "Hydeout", y: "2003", s: "", d: "Hip-hop instrumental melódico con fuerte influencia de jazz y nostalgia." },
  { a: "DJ Shadow", t: "Endtroducing.....", g: "Hip Hop", l: "Mo' Wax", y: "1996", s: "", d: "Primer álbum compuesto exclusivamente por muestras de otros discos grabados." },
  { a: "Mos Def", t: "Black on Both Sides", g: "Hip Hop", l: "Rawkus", y: "1999", s: "", d: "Hip-hop con alma y lírica consciente. Producción variada y sofisticada." },
  { a: "Tatsuro Yamashita", t: "For You", g: "City Pop", l: "Air Records", y: "1982", s: "", d: "Referente del pop japonés ochentero. Producción impecable y grooves soleados." },
  { a: "Mariya Takeuchi", t: "Variety", g: "City Pop", l: "Moon Records", y: "1984", s: "", d: "Álbum icónico del sonido City Pop de finales del siglo XX en Japón." },
  { a: "Casiopea", t: "Mint Jams", g: "Fusion", l: "Alfa", y: "1982", s: "", d: "Jazz-fusion virtuoso grabado en directo con precisión técnica asombrosa." },
  { a: "BadBadNotGood", t: "IV", g: "Jazz", l: "Innovative Leisure", y: "2016", s: `${BC_BASE}3153396655${BC_STYLE}`, d: "Jazz moderno con mentalidad de hip-hop y colaboraciones vocales diversas." },
  { a: "Kamasi Washington", t: "The Epic", g: "Jazz", l: "Brainfeeder", y: "2015", s: `${BC_BASE}4172421319${BC_STYLE}`, d: "Jazz espiritual de gran escala. Orquestaciones densas y coro de gospel." }
];

export const MOCK_RECORDS: VinylRecord[] = RECORD_SEEDS.map((seed, i) => ({
  id: `mat32_v26_${i}`,
  sku: `MAT32-26-${i.toString().padStart(3, '0')}`,
  artist: seed.a,
  title: seed.t,
  slug: `${seed.a.toLowerCase().replace(/\s+/g, '-')}-${seed.t.toLowerCase().replace(/\s+/g, '-')}`,
  label: seed.l,
  year: seed.y,
  format: "LP",
  condition: "NM",
  genre: seed.g,
  price: 25 + (i % 45),
  stock: 1,
  coverUrl: "",
  discogsLink: DISCOGS_PROFILE_URL,
  streamingLink: seed.s,
  description: seed.d,
  sellerId: 'discos_ruzafa',
  status: 'published',
  tags: [seed.g.toLowerCase(), 'analog_sound']
}));

export const MOCK_POSTS: Post[] = [
  {
    id: 'p_rz_26_2',
    type: 'POST',
    title: 'Archive v26.2: The Musical Protocol',
    slug: 'musical-protocol-v26-2',
    author: 'discos_ruzafa',
    content: 'Actualización masiva del catálogo. 85 discos únicos con descripciones centradas puramente en el estilo y la edición musical. #VinylArchive #DiggerLife',
    imageUrl: "",
    likes: 6700,
    comments: [],
    timestamp: 'Hace 5 minutos',
    tags: ['#NewEntries', '#GlobalGrooves'],
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
    description: 'Protocolo de escucha abierta 2026. La primera sesión del año para selectores locales. Trae tu maleta de vinilos y domina los Altec A7.',
    category: 'Open Decks',
    imageUrl: '',
    attendees: 0,
    capacity: 100,
    price: 0,
    paidPrice: 0,
    ticketLink: '#',
    lineup: [MOCK_ARTISTS['mat32_crew']],
    vibe: ['Community', 'Eclectic', 'Hi-Fi'],
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
    description: 'Segunda jornada 2026. Espacio para la experimentación sonora. Géneros abiertos, mentes abiertas. Conecta con la red.',
    category: 'Open Decks',
    imageUrl: '',
    attendees: 0,
    capacity: 100,
    price: 0,
    paidPrice: 0,
    ticketLink: '#',
    lineup: [MOCK_ARTISTS['mat32_crew']],
    vibe: ['Discovery', 'Deep Listening', 'Selectors'],
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
