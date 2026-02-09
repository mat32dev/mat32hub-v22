
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
  { a: "John Coltrane", t: "A Love Supreme", g: "Jazz", l: "Impulse!", y: "1965", s: `${BC_BASE}2308115201${BC_STYLE}`, d: "Obra maestra del jazz espiritual estructurada como una suite en cuatro partes." },
  { a: "Alice Coltrane", t: "Journey In Satchidananda", g: "Jazz", l: "Impulse!", y: "1971", s: `${BC_BASE}4013444211${BC_STYLE}`, d: "Exploración sonora que fusiona el jazz con instrumentación de arpa y tambura." },
  { a: "Pharoah Sanders", t: "Karma", g: "Jazz", l: "Impulse!", y: "1969", s: `${BC_BASE}3082522770${BC_STYLE}`, d: "Liderado por la épica pieza 'The Creator Has a Master Plan', es una cumbre del free jazz." },
  { a: "Miles Davis", t: "Kind of Blue", g: "Jazz", l: "Columbia", y: "1959", s: "", d: "El disco de jazz modal más influyente de la historia, definido por su atmósfera introspectiva." },
  { a: "Herbie Hancock", t: "Maiden Voyage", g: "Jazz", l: "Blue Note", y: "1965", s: `${BC_BASE}1230198651${BC_STYLE}`, d: "Concepto marino que despliega un jazz moderno y sofisticado de mediados de los 60." },
  { a: "Wayne Shorter", t: "Speak No Evil", g: "Jazz", l: "Blue Note", y: "1966", s: `${BC_BASE}3634045550${BC_STYLE}`, d: "Hard-bop avanzado con composiciones místicas y una sección rítmica impecable." },
  { a: "Sun Ra", t: "Lanquidity", g: "Jazz", l: "Philly Jazz", y: "1978", s: `${BC_BASE}3769152285${BC_STYLE}`, d: "Fusión de jazz cósmico con ritmos funk y texturas electrónicas tempranas." },
  { a: "Archie Shepp", t: "Attica Blues", g: "Jazz", l: "Impulse!", y: "1972", s: `${BC_BASE}3324546413${BC_STYLE}`, d: "Big band con fuerte carga política que mezcla soul, gospel y vanguardia." },
  { a: "Donald Byrd", t: "Places and Spaces", g: "Jazz-Funk", l: "Blue Note", y: "1975", s: "", d: "Producido por los hermanos Mizell, es un estandarte del jazz fusionado con el soul de los 70." },
  { a: "Lonnie Liston Smith", t: "Expansions", g: "Jazz-Funk", l: "Flying Dutchman", y: "1975", s: "", d: "Jazz cósmico y percusivo orientado a la pista de baile espiritual." },

  // HOUSE
  { a: "Larry Heard", t: "Sceneries Not Songs", g: "House", l: "Black Market", y: "1994", s: `${BC_BASE}1073809633${BC_STYLE}`, d: "Paisajes electrónicos profundos de la mano del arquitecto del deep house." },
  { a: "Moodymann", t: "Silentintroduction", g: "House", l: "Peacefrog", y: "1997", s: `${BC_BASE}1833177726${BC_STYLE}`, d: "Muestreo crudo de Detroit que fusiona blues, jazz y soul sobre ritmos house." },
  { a: "Theo Parrish", t: "Parallel Dimensions", g: "House", l: "Ubiquity", y: "2000", s: "", d: "House experimental con ritmos descentrados y una sensibilidad jazzística única." },
  { a: "Kerri Chandler", t: "Kaoz Theory", g: "House", l: "Kaoz", y: "2015", s: "", d: "Estructuras rítmicas sólidas y bajos contundentes directos desde New Jersey." },
  { a: "Ron Trent", t: "Altered States", g: "House", l: "Prescription", y: "1992", s: "", d: "Himno hipnótico que definió el sonido house atmosférico y progresivo de Chicago." },
  { a: "Pepe Bradock", t: "Burning", g: "House", l: "Kif", y: "1999", s: "", d: "House francés de culto conocido por su sampleo hipnótico y producción elegante." },
  { a: "St Germain", t: "Boulevard", g: "House", l: "F Communications", y: "1995", s: "", d: "La perfecta intersección entre el jazz en vivo y la programación electrónica." },
  { a: "Masters At Work", t: "The Album", g: "House", l: "Cutting", y: "1993", s: "", d: "Producción maestra que encapsula la vibración de los clubes de Nueva York en los 90." },
  { a: "Omar S", t: "The Best", g: "House", l: "FXHE", y: "2016", s: "", d: "House minimalista y directo, grabado sin adornos innecesarios en Detroit." },
  { a: "Floating Points", t: "Elaenia", g: "House", l: "Pluto", y: "2015", s: `${BC_BASE}1506541584${BC_STYLE}`, d: "Composición electrónica que roza lo sinfónico con elementos de jazz y krautrock." },

  // SOUL / FUNK
  { a: "Marvin Gaye", t: "What's Going On", g: "Soul", l: "Tamla", y: "1971", s: "", d: "Álbum conceptual de soul que reflexiona sobre la justicia social y el medio ambiente." },
  { a: "Roy Ayers", t: "Everybody Loves the Sunshine", g: "Soul", l: "Polydor", y: "1976", s: "", d: "Clásico del jazz-funk atmosférico con el vibráfono distintivo de Ayers." },
  { a: "Curtis Mayfield", t: "Superfly", g: "Soul", l: "Curtom", y: "1972", s: "", d: "Banda sonora seminal del blaxploitation cargada de grooves de funk y letras conscientes." },
  { a: "Aretha Franklin", t: "Lady Soul", g: "Soul", l: "Atlantic", y: "1968", s: "", d: "Una de las interpretaciones vocales más poderosas en la historia del soul americano." },
  { a: "Sly & The Family Stone", t: "There's a Riot Goin' On", g: "Funk", l: "Epic", y: "1971", s: "", d: "Funk oscuro e hipnótico que cambió el rumbo de la música negra de los 70." },
  { a: "Funkadelic", t: "Maggot Brain", g: "Funk", l: "Westbound", y: "1971", s: "", d: "Psicodelia y funk se encuentran en este álbum dominado por guitarras ácidas." },
  { a: "James Brown", t: "The Payback", g: "Funk", l: "Polydor", y: "1973", s: "", d: "Doble LP de funk crudo que sirve como base fundamental para el sampling moderno." },
  { a: "Issac Hayes", t: "Hot Buttered Soul", g: "Soul", l: "Enterprise", y: "1969", s: "", d: "Soul expansivo con orquestaciones cinematográficas y versiones extensas." },
  { a: "Stevie Wonder", t: "Innervisions", g: "Soul", l: "Tamla", y: "1973", s: "", d: "Obra cumbre de la era sintetizada de Wonder, fusionando funk, gospel y pop." },
  { a: "Shuggie Otis", t: "Inspiration Information", g: "Soul", l: "Epic", y: "1974", s: "", d: "Soul psicodélico grabado de forma solitaria con un uso pionero de la caja de ritmos." },

  // DISCO
  { a: "Donna Summer", t: "Bad Girls", g: "Disco", l: "Casablanca", y: "1979", s: "", d: "El pico del sonido disco producido por Giorgio Moroder, mezclando rock y sintetizadores." },
  { a: "Chic", t: "Risqué", g: "Disco", l: "Atlantic", y: "1979", s: "", d: "Producción impecable de Nile Rodgers y Bernard Edwards con líneas de bajo icónicas." },
  { a: "Giorgio Moroder", t: "From Here to Eternity", g: "Disco", l: "Casablanca", y: "1977", s: "", d: "Pionero del Italo-disco y la electrónica de baile basada exclusivamente en sintetizadores." },
  { a: "Cerrone", t: "Supernature", g: "Disco", l: "Malligator", y: "1977", s: "", d: "Disco espacial francés con tintes ecológicos y percusiones potentes." },
  { a: "Sylvester", t: "Step II", g: "Disco", l: "Fantasy", y: "1978", s: "", d: "Energía Hi-NRG impulsada por la voz única de falsete de Sylvester." },
  { a: "Gino Soccio", t: "Outline", g: "Disco", l: "Warner", y: "1979", s: "", d: "Disco minimalista con influencias europeas, fundamental para el sonido club posterior." },
  { a: "Change", t: "The Glow of Love", g: "Disco", l: "RFC", y: "1980", s: "", d: "Post-disco elegante con colaboraciones vocales de un joven Luther Vandross." },
  { a: "Boney M.", t: "Nightflight to Venus", g: "Disco", l: "Hansa", y: "1978", s: "", d: "Mezcla de ritmos tribales, disco y pop que dominó las listas europeas." },
  { a: "Sister Sledge", t: "We Are Family", g: "Disco", l: "Cotillion", y: "1979", s: "", d: "Himnos de unidad con la marca de producción distintiva de la factoría Chic." },
  { a: "Loose Joints", t: "Pop Your Funk", g: "Disco", l: "West End", y: "1980", s: "", d: "Avant-disco neoyorquino con arreglos experimentales de Arthur Russell." },

  // ELECTRONICA
  { a: "Aphex Twin", t: "Selected Ambient Works 85-92", g: "Electronica", l: "Apollo", y: "1992", s: `${BC_BASE}2418512140${BC_STYLE}`, d: "Referente del IDM que combina ritmos analógicos con melodías etéreas." },
  { a: "Boards of Canada", t: "Music Has the Right to Children", g: "Electronica", l: "Warp", y: "1998", s: `${BC_BASE}3254924765${BC_STYLE}`, d: "Electrónica bucólica basada en el uso de samples antiguos y sintetizadores nostálgicos." },
  { a: "Kraftwerk", t: "The Man-Machine", g: "Electronica", l: "Kling Klang", y: "1978", s: "", d: "El diseño sonoro de la modernidad robótica, fundamental para el techno y el electro." },
  { a: "Four Tet", t: "Rounds", g: "Electronica", l: "Domino", y: "2003", s: `${BC_BASE}1237937920${BC_STYLE}`, d: "Folktronica que utiliza texturas acústicas procesadas digitalmente." },
  { a: "Burial", t: "Untrue", g: "Electronica", l: "Hyperdub", y: "2007", s: `${BC_BASE}1482810459${BC_STYLE}`, d: "Dubstep emocional y brumoso que captura la melancolía urbana nocturna." },
  { a: "Nicolas Jaar", t: "Space Is Only Noise", g: "Electronica", l: "Circus Company", y: "2011", s: `${BC_BASE}3370399426${BC_STYLE}`, d: "Microhouse y electrónica experimental con un enfoque minimalista y cinematográfico." },
  { a: "Autechre", t: "Tri Repetae", g: "Electronica", l: "Warp", y: "1995", s: `${BC_BASE}2951717325${BC_STYLE}`, d: "Diseño sonoro industrial y geométrico, una cumbre de la electrónica abstracta." },
  { a: "Global Communication", t: "76:14", g: "Ambient", l: "Dedicated", y: "1994", s: "", d: "Viaje sonoro inmersivo que define el ambient de los 90." },
  { a: "The Orb", t: "Adventures Beyond the Ultraworld", g: "Electronica", l: "Big Life", y: "1991", s: "", d: "Ambient house expansivo cargado de samples espaciales y dub." },
  { a: "Flying Lotus", t: "Cosmogramma", g: "Electronica", l: "Warp", y: "2010", s: `${BC_BASE}2875153204${BC_STYLE}`, d: "Fusión de jazz, hip-hop y glitch en una suite psicodélica multidimensional." },

  // AMBIENT
  { a: "Brian Eno", t: "Music for Airports", g: "Ambient", l: "Polydor", y: "1978", s: "", d: "El disco que definió el género ambient como música diseñada para ser ignorada o escuchada." },
  { a: "Hiroshi Yoshimura", t: "Green", g: "Ambient", l: "Air Records", y: "1986", s: `${BC_BASE}2621040447${BC_STYLE}`, d: "Kankyo Ongaku japonés (música ambiental) de texturas cristalinas y naturales." },
  { a: "Suso Saiz", t: "Odisea", g: "Ambient", l: "Music When Lights Go Out", y: "2016", s: `${BC_BASE}2262704381${BC_STYLE}`, d: "Antología de un pionero del ambient español, centrada en la guitarra procesada." },
  { a: "Steve Roach", t: "Structures from Silence", g: "Ambient", l: "Fortuna", y: "1984", s: `${BC_BASE}3480036687${BC_STYLE}`, d: "Clásico del ambient meditativo basado en sintetizadores de respiración lenta." },
  { a: "Gas", t: "Zauberberg", g: "Ambient", l: "Mille Plateaux", y: "1997", s: "", d: "Techno ambiental inmersivo inspirado en la atmósfera de los bosques alemanes." },
  { a: "William Basinski", t: "The Disintegration Loops", g: "Ambient", l: "2062", y: "2002", s: "", d: "Registro de la decadencia física de cintas de audio magnéticas." },
  { a: "Laraaji", t: "Ambient 3: Day of Radiance", g: "Ambient", l: "EG", y: "1980", s: "", d: "Zither y martillos dulces grabados por Brian Eno para un trance celestial." },
  { a: "Stars of the Lid", t: "And Their Refinement of the Decline", g: "Ambient", l: "Kranky", y: "2007", s: `${BC_BASE}2968132047${BC_STYLE}`, d: "Drones orquestales mínimos y expansivos para escucha profunda." },
  { a: "Gigi Masin", t: "Talk to the Sea", g: "Ambient", l: "Music From Memory", y: "2014", s: `${BC_BASE}3072212953${BC_STYLE}`, d: "Melodías acuáticas y nostálgicas de un maestro del minimalismo italiano." },
  { a: "Midori Takada", t: "Through the Looking Glass", g: "Ambient", l: "RCA", y: "1983", s: `${BC_BASE}1232811442${BC_STYLE}`, d: "Minimalismo percusivo que explora el espacio y el silencio." },

  // AFROBEAT / LATIN
  { a: "Fela Kuti", t: "Zombie", g: "Afrobeat", l: "Coconut", y: "1976", s: `${BC_BASE}2474883492${BC_STYLE}`, d: "Crítica política feroz sobre un ritmo afrobeat imparable." },
  { a: "William Onyeabor", t: "Who is William Onyeabor?", g: "Afrobeat", l: "Luaka Bop", y: "2013", s: `${BC_BASE}1777264835${BC_STYLE}`, d: "Sintetizadores psicodélicos y ritmos funk desde Nigeria." },
  { a: "Tony Allen", t: "No Accommodation for Lagos", g: "Afrobeat", l: "Phonogram", y: "1979", s: "", d: "El latido rítmico del afrobeat en su estado más puro." },
  { a: "Ray Barretto", t: "Acid", g: "Latin", l: "Fania", y: "1968", s: "", d: "Fusión pionera de boogaloo, jazz y ritmos afrocubanos." },
  { a: "Willie Colón", t: "The Hustler", g: "Latin", l: "Fania", y: "1968", s: "", d: "Salsa dura neoyorquina con arreglos de trombón agresivos." },
  { a: "Mulatu Astatke", t: "Ethio Jazz", g: "Jazz", l: "Amha", y: "1974", s: "", d: "Escalas etíopes combinadas con instrumentación de jazz occidental." },
  { a: "Manu Dibango", t: "Soul Makossa", g: "Afrobeat", l: "Fiesta", y: "1972", s: "", d: "El éxito que conectó los ritmos africanos con la naciente escena disco de NY." },
  { a: "Celia Cruz", t: "Celia & Johnny", g: "Latin", l: "Vaya", y: "1974", s: "", d: "Uno de los álbumes de salsa más vendidos, con una química perfecta entre voz y orquesta." },
  { a: "Buena Vista Social Club", t: "Self Titled", g: "Latin", l: "World Circuit", y: "1997", s: "", d: "Rescate de los sonidos tradicionales cubanos con una producción cálida." },
  { a: "Joe Bataan", t: "Gypsy Woman", g: "Latin", l: "Fania", y: "1967", s: "", d: "Soul latino y boogaloo del 'King of Latin Soul'." },

  // HIP HOP / BEATS
  { a: "J Dilla", t: "Donuts", g: "Hip Hop", l: "Stones Throw", y: "2006", s: `${BC_BASE}312683073${BC_STYLE}`, d: "Collage rítmico terminal que redefinió el arte del sampling." },
  { a: "Madlib", t: "Shades of Blue", g: "Hip Hop", l: "Blue Note", y: "2003", s: "", d: "Reimaginación del catálogo de Blue Note a través de filtros hip-hop." },
  { a: "MF DOOM", t: "Mm..Food", g: "Hip Hop", l: "Rhymesayers", y: "2004", s: "", d: "Lirismo complejo y rimas internas sobre samples de dibujos animados antiguos." },
  { a: "The Roots", t: "Things Fall Apart", g: "Hip Hop", l: "MCA", y: "1999", s: "", d: "Hip-hop tocado con instrumentos reales con un enfoque orgánico y consciente." },
  { a: "A Tribe Called Quest", t: "The Low End Theory", g: "Hip Hop", l: "Jive", y: "1991", s: "", d: "La unión definitiva entre el bajo jazzístico y el flow alternativo." },
  { a: "Nujabes", t: "Metaphorical Music", g: "Hip Hop", l: "Hydeout", y: "2003", s: "", d: "Hip-hop instrumental melódico y nostálgico con fuerte influencia jazz." },
  { a: "DJ Shadow", t: "Endtroducing.....", g: "Hip Hop", l: "Mo' Wax", y: "1996", s: "", d: "Primer álbum compuesto exclusivamente por samples de otros discos." },
  { a: "Mos Def", t: "Black on Both Sides", g: "Hip Hop", l: "Rawkus", y: "1999", s: "", d: "Soulful hip-hop que celebra la cultura negra con una producción diversa." },
  { a: "Eric B. & Rakim", t: "Paid in Full", g: "Hip Hop", l: "4th & B'way", y: "1987", s: "", d: "Evolución técnica del rap y el DJing en la era dorada." },
  { a: "De La Soul", t: "3 Feet High and Rising", g: "Hip Hop", l: "Tommy Boy", y: "1989", s: "", d: "Incursión lúdica y colorida que introdujo el eclecticismo en el hip-hop." },
  { a: "Tatsuro Yamashita", t: "For You", g: "City Pop", l: "Air Records", y: "1982", s: "", d: "Producción impecable de pop japonés con influencias de funk y AOR." },
  { a: "Mariya Takeuchi", t: "Variety", g: "City Pop", l: "Moon Records", y: "1984", s: "", d: "Clásico del pop de finales del siglo XX en Japón, suave y melódico." },
  { a: "Casiopea", t: "Mint Jams", g: "Fusion", l: "Alfa", y: "1982", s: "", d: "Jazz-fusion virtuoso grabado en directo con una precisión técnica asombrosa." },
  { a: "BadBadNotGood", t: "IV", g: "Jazz", l: "Innovative Leisure", y: "2016", s: `${BC_BASE}3153396655${BC_STYLE}`, d: "Jazz moderno con mentalidad de hip-hop y colaboraciones vocales diversas." },
  { a: "Kamasi Washington", t: "The Epic", g: "Jazz", l: "Brainfeeder", y: "2015", s: `${BC_BASE}4172421319${BC_STYLE}`, d: "Jazz espiritual de gran escala con coro y orquesta." }
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
    id: 'p_rz_26_1',
    type: 'POST',
    title: 'Archive v26.1: The Purist Core',
    slug: 'purist-core-v26-1',
    author: 'discos_ruzafa',
    content: 'Catálogo de vinilos actualizado con reseñas técnicas completas. Desde el Jazz modal hasta el Ambient estructural. #VinylCulture #HiFi #Purist',
    imageUrl: "",
    likes: 6400,
    comments: [],
    timestamp: 'Justo ahora',
    tags: ['#VinylCommunity', '#DeepListening'],
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
