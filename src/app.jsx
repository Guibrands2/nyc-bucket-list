import { useState, useEffect, useRef, useCallback } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCtyh5cT8gYbZHC0_18akrZPBdWr3kdAXc",
  authDomain: "nyc-bucket-list.firebaseapp.com",
  databaseURL: "https://nyc-bucket-list-default-rtdb.firebaseio.com",
  projectId: "nyc-bucket-list",
  storageBucket: "nyc-bucket-list.firebasestorage.app",
  messagingSenderId: "974412129874",
  appId: "1:974412129874:web:b7343be650f319204de18b"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

const VIBES = ["romantico", "amigos", "familia", "solo"];
const VIBE_EMOJI = { romantico: "💑", amigos: "👯", familia: "👨‍👩‍👧", solo: "🧘" };
const VIBE_LABELS = { romantico: "Romantico", amigos: "Amigos", familia: "Familia", solo: "Solo" };
const PRICE_LEVELS = ["gratis", "$", "$$", "$$$"];
const PRICE_EMOJI = { gratis: "🆓", "$": "$", "$$": "$$", "$$$": "$$$" };
const PRICE_LABELS = { gratis: "Gratis", "$": "Barato", "$$": "Medio", "$$$": "Caro" };
const WHO_OPTIONS = ["gui", "gabriel", "juntos"];
const WHO_EMOJI = { gui: "🧔", gabriel: "👨", juntos: "👫" };
const WHO_LABELS = { gui: "Gui", gabriel: "Gabriel", juntos: "Os dois" };
const TIME_OPTIONS = ["30min", "1h", "2h", "3h+", "dia inteiro"];

const CAT_META = {
  "Museus":          { color: "#2563eb", light: "#dbeafe", emoji: "🏛️" },
  "Monumentos":      { color: "#7c3aed", light: "#ede9fe", emoji: "🗿" },
  "Observatorios":   { color: "#ea7215", light: "#ffedd5", emoji: "🔭" },
  "Natureza":        { color: "#16a34a", light: "#dcfce7", emoji: "🌿" },
  "Livrarias":       { color: "#ca8a04", light: "#fef9c3", emoji: "📚" },
  "Lojas":           { color: "#db2777", light: "#fce7f3", emoji: "🛍️" },
  "Entretenimento":  { color: "#9333ea", light: "#f3e8ff", emoji: "🎭" },
  "Compras":         { color: "#0891b2", light: "#cffafe", emoji: "🏬" },
  "Bairros":         { color: "#dc2626", light: "#fee2e2", emoji: "🗺️" },
  "Comida":          { color: "#d97706", light: "#fef3c7", emoji: "🍴" },
  "Dispensaries":    { color: "#15803d", light: "#dcfce7", emoji: "🌱" },
};

const INITIAL_PLACES = [
  { id: "t001", category: "Museus", name: "NY Transit Museum", emoji: "🚇", desc: "Museu dentro de uma estacao de metro desativada em Brooklyn Heights, com vagoes vintage dos anos 1900 ate hoje.", price: "$", lat: 40.6906, lng: -73.9899, time: "2h", link: "https://www.nytransitmuseum.org" },
  { id: "t002", category: "Museus", name: "American Museum of Natural History", emoji: "🦕", desc: "O museu do Uma Noite no Museu: dinossauros, baleia azul gigante, planetario, antropologia.", price: "$$", lat: 40.7813, lng: -73.9740, time: "dia inteiro", link: "https://www.amnh.org" },
  { id: "t003", category: "Museus", name: "MoMA", emoji: "🎨", desc: "Arte moderna e contemporanea. Van Gogh, Picasso, Dali, Warhol. Um dos melhores museus do mundo.", price: "$$", lat: 40.7614, lng: -73.9776, time: "3h+", link: "https://www.moma.org" },
  { id: "t004", category: "Museus", name: "9/11 Memorial & Museum", emoji: "🕊️", desc: "No local exato das Torres Gemeas, com as piscinas reflexivas enormes. Depoimentos de sobreviventes e familias.", price: "$$", lat: 40.7115, lng: -74.0134, time: "3h+", link: "https://www.911memorial.org" },
  { id: "t005", category: "Museus", name: "Intrepid Museum", emoji: "✈️", desc: "Porta-avioes real ancorado no Hudson River, com 30 aeronaves, o onibus espacial Enterprise e o Concorde.", price: "$$", lat: 40.7645, lng: -74.0017, time: "3h+", link: "https://www.intrepidmuseum.org" },
  { id: "t006", category: "Museus", name: "Building 92 / Brooklyn Navy Yard", emoji: "⚓", desc: "Centro de visitantes gratuito com 200 anos de historia do estaleiro naval, num predio de 1857.", price: "gratis", lat: 40.6990, lng: -73.9718, time: "1h", link: "https://brooklynnavyyard.org" },
  { id: "t007", category: "Museus", name: "Museum of Broadway", emoji: "🎭", desc: "Tres andares com figurinos e aderecos originais de Hamilton, Phantom, Rent e Wicked. Na Times Square.", price: "$$", lat: 40.7580, lng: -73.9855, time: "2h", link: "https://www.themuseumofbroadway.com" },
  { id: "t008", category: "Monumentos", name: "NY Public Library", emoji: "📚", desc: "A biblioteca dos leoes, classica de filme. A sala de leitura principal e de cair o queixo. Gratis.", price: "gratis", lat: 40.7532, lng: -73.9822, time: "1h", link: "https://www.nypl.org" },
  { id: "t009", category: "Monumentos", name: "St. Patrick's Cathedral", emoji: "⛪", desc: "Catedral neogotica no meio da 5th Ave, impressionante por dentro com os vitrais. Gratis.", price: "gratis", lat: 40.7586, lng: -73.9762, time: "30min", link: "https://saintpatrickscathedral.org" },
  { id: "t010", category: "Monumentos", name: "NYSE + Charging Bull", emoji: "🐂", desc: "Fachada neoclassica da bolsa na Wall Street e o touro de bronze iconico do FiDi.", price: "gratis", lat: 40.7069, lng: -74.0089, time: "30min" },
  { id: "t011", category: "Monumentos", name: "Brooklyn Heights Promenade", emoji: "🌆", desc: "Calcadao suspenso em Brooklyn Heights com vista panoramica da skyline de Manhattan.", price: "gratis", lat: 40.6962, lng: -73.9991, time: "1h" },
  { id: "t012", category: "Monumentos", name: "Central Park (norte e leste)", emoji: "🌳", desc: "Bethesda Fountain, The Ramble, Belvedere Castle, Reservoir e Conservatory Garden.", price: "gratis", lat: 40.7812, lng: -73.9665, time: "3h+" },
  { id: "t013", category: "Observatorios", name: "SUMMIT One Vanderbilt", emoji: "🔮", desc: "Instalacoes de arte com espelhos e vidro, vistas deslumbrantes. Abre ate meia-noite.", price: "$$$", lat: 40.7527, lng: -73.9772, time: "2h", link: "https://summitov.com" },
  { id: "t014", category: "Observatorios", name: "Top of the Rock", emoji: "🏙️", desc: "No Rockefeller Center, com a view classica com o Empire State no meio da foto.", price: "$$$", lat: 40.7593, lng: -73.9787, time: "1h", link: "https://www.topoftherocknyc.com" },
  { id: "t015", category: "Observatorios", name: "Empire State Building", emoji: "🌃", desc: "O icone absoluto de Nova York. Abre ate 11:30pm, otimo pra ir ao anoitecer.", price: "$$$", lat: 40.7484, lng: -73.9857, time: "2h", link: "https://www.esbnyc.com" },
  { id: "t016", category: "Observatorios", name: "The Edge", emoji: "🫧", desc: "Terraco de vidro em Hudson Yards que parece que voce ta voando sobre a cidade.", price: "$$$", lat: 40.7534, lng: -74.0010, time: "1h", link: "https://edgenyc.com" },
  { id: "t017", category: "Observatorios", name: "One World Observatory", emoji: "🌍", desc: "No topo do World Trade Center, o predio mais alto do hemisferio ocidental.", price: "$$$", lat: 40.7130, lng: -74.0134, time: "1h", link: "https://www.oneworldobservatory.com" },
  { id: "t018", category: "Natureza", name: "Prospect Park", emoji: "🌿", desc: "O grande parque de Brooklyn, projetado pelos mesmos criadores do Central Park.", price: "gratis", lat: 40.6602, lng: -73.9690, time: "3h+" },
  { id: "t019", category: "Natureza", name: "Bronx Zoo", emoji: "🦁", desc: "Um dos maiores zoologicos urbanos do mundo, no Bronx. Reserve o dia inteiro.", price: "$$", lat: 40.8506, lng: -73.8770, time: "dia inteiro", link: "https://bronxzoo.com" },
  { id: "t020", category: "Natureza", name: "Coney Island", emoji: "🎡", desc: "Praia iconica com o parque Luna Park, o cachorro-quente do Nathan's Famous e o calcadao historico.", price: "$", lat: 40.5755, lng: -73.9707, time: "dia inteiro" },
  { id: "t021", category: "Livrarias", name: "The Strand", emoji: "📖", desc: "4 andares e 18 milhas de livros na Union Square. Uma das livrarias mais famosas dos EUA.", price: "$", lat: 40.7330, lng: -73.9910, time: "1h", link: "https://www.strandbooks.com" },
  { id: "t022", category: "Livrarias", name: "The Ripped Bodice", emoji: "💘", desc: "Livraria especializada em romance em Park Slope, Brooklyn. Atmosfera aconchegante.", price: "$", lat: 40.6761, lng: -73.9810, time: "1h", link: "https://www.therippedbodicebklyn.com" },
  { id: "t023", category: "Lojas", name: "Nintendo NY", emoji: "🎮", desc: "No Rockefeller Plaza, com merchandise exclusivo, demos de jogos e historia da Nintendo.", price: "$", lat: 40.7582, lng: -73.9796, time: "1h" },
  { id: "t024", category: "Lojas", name: "Disney Store", emoji: "✨", desc: "Na area da Times Square, dois andares de tudo que e Disney, Marvel e Pixar.", price: "$", lat: 40.7574, lng: -73.9857, time: "1h" },
  { id: "t025", category: "Lojas", name: "Hershey's + M&M + Lego", emoji: "🍫", desc: "As tres gigantes na Times Square. Visuais, caoticas e divertidas pra uma passada rapida.", price: "$", lat: 40.7580, lng: -73.9845, time: "1h" },
  { id: "t026", category: "Entretenimento", name: "SPYSCAPE", emoji: "🕵️", desc: "Museu interativo de espionagem: quebra codigos, esquiva de lasers e descobre seu perfil de espiao.", price: "$$", lat: 40.7634, lng: -73.9863, time: "2h", link: "https://spyscape.com" },
  { id: "t027", category: "Entretenimento", name: "Show no Madison Square Garden", emoji: "🎸", desc: "O maior e mais famoso venue indoor de NY. Uma experiencia a parte independente do show.", price: "$$$", lat: 40.7505, lng: -73.9934, time: "3h+", link: "https://www.msg.com" },
  { id: "t028", category: "Entretenimento", name: "PARAISO (Westlight Rooftop)", emoji: "🌅", desc: "Festa semanal aos domingos no rooftop do William Vale, Williamsburg.", price: "$$", lat: 40.7181, lng: -73.9566, time: "3h+", link: "https://www.paraisonyc.com" },
  { id: "t029", category: "Entretenimento", name: "Paradise Sunset NYC", emoji: "🌇", desc: "Day party de rooftop animada.", price: "$$", lat: 40.7549, lng: -73.9840, time: "3h+" },
  { id: "t030", category: "Entretenimento", name: "Ellen's Stardust Diner", emoji: "🎤", desc: "Restaurante dos garcons que cantam na Broadway, tematico dos anos 50.", price: "$$", lat: 40.7614, lng: -73.9848, time: "2h", link: "https://www.ellensstardustdiner.com" },
  { id: "t031", category: "Entretenimento", name: "Bares Speakeasy", emoji: "🥃", desc: "Bares secretos escondidos atras de cafeterias, cabines telefonicas ou geladeiras.", price: "$$", lat: 40.7282, lng: -74.0076, time: "2h" },
  { id: "t032", category: "Comida", name: "Joe's Pizza", emoji: "🍕", desc: "A fatia de pizza mais classica de NY desde 1975. Original no West Village.", price: "$", lat: 40.7306, lng: -74.0022, time: "30min", link: "https://www.joespizzanyc.com" },
  { id: "t033", category: "Compras", name: "American Dream Outlet", emoji: "🛍️", desc: "O maior outlet de NJ em East Rutherford, com parque de diversoes, pista de esqui indoor e aquario.", price: "$$", lat: 40.8135, lng: -74.0669, time: "dia inteiro", link: "https://www.americandream.com" },
  { id: "s001", category: "Bairros", name: "Governors Island", emoji: "⛵", desc: "Ilha sem carros na baia, com arte, piquenique e vista pro Downtown.", price: "gratis", lat: 40.6895, lng: -74.0165, time: "3h+", link: "https://govisland.com" },
  { id: "s002", category: "Bairros", name: "Roosevelt Island", emoji: "🌉", desc: "Ilhinha no East River com tramway iconico saindo da 2nd Ave.", price: "gratis", lat: 40.7614, lng: -73.9506, time: "2h" },
  { id: "s003", category: "Bairros", name: "Harlem", emoji: "🎷", desc: "Berco do jazz e da cultura negra americana. Igrejas gospel, comida soul food e murais incriveis.", price: "$", lat: 40.8116, lng: -73.9465, time: "3h+" },
  { id: "s004", category: "Bairros", name: "Astoria, Queens", emoji: "🇬🇷", desc: "Bairro grego com otimos restaurantes, museu de cinema e atmosfera europeia.", price: "$", lat: 40.7721, lng: -73.9302, time: "3h+" },
  { id: "s005", category: "Bairros", name: "Flushing, Queens", emoji: "🥟", desc: "A melhor gastronomia asiatica fora da Asia. Chinatown gigante com dim sum e boba.", price: "$", lat: 40.7675, lng: -73.8330, time: "3h+" },
  { id: "s006", category: "Bairros", name: "Little Italy & Chinatown", emoji: "🍝", desc: "Dois bairros historicos em Lower Manhattan. Cannoli, dumplings e muita historia.", price: "$", lat: 40.7188, lng: -73.9973, time: "2h" },
  { id: "s007", category: "Bairros", name: "The High Line", emoji: "🌿", desc: "Parque linear suspenso numa ferrovia desativada no West Side.", price: "gratis", lat: 40.7480, lng: -74.0048, time: "2h", link: "https://www.thehighline.org" },
  { id: "s008", category: "Bairros", name: "Greenpoint, Brooklyn", emoji: "🇵🇱", desc: "Bairro polones com cafes independentes, galerias e vista da skyline.", price: "$", lat: 40.7242, lng: -73.9480, time: "2h" },
  { id: "s009", category: "Bairros", name: "Red Hook, Brooklyn", emoji: "⚓", desc: "Antigo bairro industrial na beira d'agua, com galerias e cervejarias.", price: "$", lat: 40.6759, lng: -74.0109, time: "2h" },
  { id: "s010", category: "Bairros", name: "Jackson Heights, Queens", emoji: "🇮🇳", desc: "Bairro mais diverso do mundo. Culinaria sul-asiatica, latina e muito mais.", price: "$", lat: 40.7498, lng: -73.8831, time: "2h" },
  { id: "s011", category: "Museus", name: "Whitney Museum", emoji: "🎨", desc: "Arte americana contemporanea no Meatpacking District.", price: "$$", lat: 40.7396, lng: -74.0089, time: "2h", link: "https://whitney.org" },
  { id: "s012", category: "Museus", name: "The Met", emoji: "🏛️", desc: "Um dos maiores museus do mundo. Egito, armaduras medievais, impressionismo.", price: "$$", lat: 40.7794, lng: -73.9632, time: "dia inteiro", link: "https://www.metmuseum.org" },
  { id: "s013", category: "Museus", name: "Guggenheim", emoji: "🌀", desc: "O predio em espiral de Frank Lloyd Wright ja e arte.", price: "$$", lat: 40.7830, lng: -73.9590, time: "2h", link: "https://www.guggenheim.org" },
  { id: "s014", category: "Museus", name: "Museum of the City of NY", emoji: "🗽", desc: "A historia completa de Nova York do seculo XVII ate hoje.", price: "$", lat: 40.7920, lng: -73.9519, time: "2h", link: "https://mcny.org" },
  { id: "s015", category: "Museus", name: "New York Hall of Science", emoji: "🔬", desc: "Museu de ciencias interativo em Queens.", price: "$", lat: 40.7467, lng: -73.8467, time: "3h+", link: "https://nysci.org" },
  { id: "s016", category: "Museus", name: "Tenement Museum", emoji: "🏚️", desc: "Visita guiada a apartamentos de imigrantes preservados do seculo XIX.", price: "$$", lat: 40.7183, lng: -73.9898, time: "2h", link: "https://www.tenement.org" },
  { id: "s017", category: "Museus", name: "Brooklyn Museum", emoji: "🖼️", desc: "Segundo maior museu de arte dos EUA, com colecao egipcia impressionante.", price: "$$", lat: 40.6712, lng: -73.9636, time: "3h+", link: "https://www.brooklynmuseum.org" },
  { id: "s018", category: "Museus", name: "Frick Collection", emoji: "🎻", desc: "Mansao do seculo XIX transformada em museu com Vermeer, Rembrandt e Renoir.", price: "$$", lat: 40.7713, lng: -73.9672, time: "2h", link: "https://www.frick.org" },
  { id: "s019", category: "Comida", name: "Smorgasburg", emoji: "🍜", desc: "Maior mercado de comida ao ar livre dos EUA, todo sabado em Williamsburg.", price: "$", lat: 40.7223, lng: -73.9572, time: "2h", link: "https://www.smorgasburg.com" },
  { id: "s020", category: "Comida", name: "Chelsea Market", emoji: "🥐", desc: "Mercado gourmet coberto numa antiga fabrica de biscoitos.", price: "$$", lat: 40.7424, lng: -74.0048, time: "2h", link: "https://www.chelseamarket.com" },
  { id: "s021", category: "Comida", name: "Katz's Delicatessen", emoji: "🥪", desc: "O deli mais famoso de NY, desde 1888. O sanduiche de pastrami e lendario.", price: "$$", lat: 40.7223, lng: -73.9874, time: "1h", link: "https://katzsdelicatessen.com" },
  { id: "s022", category: "Comida", name: "Di Fara Pizza", emoji: "🍕", desc: "A pizza mais famosa de Brooklyn, feita a mao pelo mesmo dono ha decadas.", price: "$", lat: 40.6249, lng: -73.9612, time: "1h" },
  { id: "s023", category: "Comida", name: "Russ & Daughters", emoji: "🐟", desc: "Salmao defumado, cream cheese, bagel no Lower East Side desde 1914.", price: "$$", lat: 40.7220, lng: -73.9876, time: "1h", link: "https://www.russanddaughters.com" },
  { id: "s024", category: "Comida", name: "Levain Bakery", emoji: "🍪", desc: "O cookie de chocolate mais famoso de NY. Enorme, cremoso e quente.", price: "$", lat: 40.7812, lng: -73.9803, time: "30min", link: "https://levainbakery.com" },
  { id: "s025", category: "Comida", name: "Peter Luger Steak House", emoji: "🥩", desc: "A churrascaria mais famosa de NY, em Williamsburg desde 1887.", price: "$$$", lat: 40.7099, lng: -73.9625, time: "2h", link: "https://peterluger.com" },
  { id: "s026", category: "Natureza", name: "Staten Island Ferry", emoji: "⛴️", desc: "Balsa gratuita com vista frontal da Estatua da Liberdade.", price: "gratis", lat: 40.6437, lng: -74.0735, time: "1h" },
  { id: "s027", category: "Natureza", name: "Rockaway Beach", emoji: "🏄", desc: "Praia em Queens acessivel de metro. Boa pra surfe.", price: "gratis", lat: 40.5843, lng: -73.8351, time: "dia inteiro" },
  { id: "s028", category: "Natureza", name: "The Cloisters", emoji: "🏰", desc: "Museu de arte medieval dentro de um mosteiro reconstruido no norte de Manhattan.", price: "$$", lat: 40.8648, lng: -73.9317, time: "2h", link: "https://www.metmuseum.org/visit/met-cloisters" },
  { id: "s029", category: "Entretenimento", name: "Ver um show na Broadway", emoji: "🎭", desc: "Um classico que nao pode faltar. A experiencia mais nova-iorquina que existe.", price: "$$$", lat: 40.7590, lng: -73.9845, time: "3h+", link: "https://www.broadway.com" },
  { id: "s030", category: "Entretenimento", name: "Comedy Cellar", emoji: "😂", desc: "O clube de stand-up mais lendario de NY no Village.", price: "$$", lat: 40.7302, lng: -74.0005, time: "2h", link: "https://www.comedycellar.com" },
  { id: "s031", category: "Entretenimento", name: "Sleep No More", emoji: "🎭", desc: "Peca imersiva de teatro noir onde voce vaga por um hotel de 5 andares.", price: "$$$", lat: 40.7467, lng: -74.0014, time: "3h+", link: "https://www.sleepnomorenyc.com" },
  { id: "s032", category: "Entretenimento", name: "Brooklyn Mirage", emoji: "🎧", desc: "O maior venue de musica eletronica dos EUA, em Queens.", price: "$$", lat: 40.6985, lng: -73.9318, time: "3h+", link: "https://www.avant-gardner.com" },
  { id: "s033", category: "Entretenimento", name: "Karaoke em Koreatown", emoji: "🎤", desc: "32nd St. Karaoke privativo disponivel ate de madrugada.", price: "$$", lat: 40.7484, lng: -73.9878, time: "2h" },
  { id: "s034", category: "Monumentos", name: "Estatua da Liberdade", emoji: "🗽", desc: "Balsa de Battery Park pra Liberty Island. Reserve com antecedencia pra subir.", price: "$$", lat: 40.6892, lng: -74.0445, time: "3h+", link: "https://www.nps.gov/stli" },
  { id: "s035", category: "Monumentos", name: "Grand Central Terminal", emoji: "🚂", desc: "A estacao de trem mais bela do mundo, com teto estrelado.", price: "gratis", lat: 40.7527, lng: -73.9772, time: "30min" },
  { id: "s036", category: "Monumentos", name: "Washington Square Park", emoji: "🎨", desc: "O parque mais vivo de Manhattan, com musicos, xadrez e skatistas.", price: "gratis", lat: 40.7308, lng: -74.0002, time: "1h" },
  { id: "s037", category: "Monumentos", name: "Little Island", emoji: "🌺", desc: "Parque flutuante no Hudson River no Meatpacking, inaugurado em 2021.", price: "gratis", lat: 40.7438, lng: -74.0094, time: "1h", link: "https://littleisland.org" },
  { id: "s038", category: "Monumentos", name: "Flatiron Building", emoji: "🏢", desc: "O predio em formato de ferro de passar roupa. Recentemente reaberto apos reforma.", price: "gratis", lat: 40.7411, lng: -73.9897, time: "30min" },
  { id: "d001", category: "Dispensaries", name: "Housing Works Cannabis", emoji: "🌿", desc: "O primeiro dispensario com fins sociais de NY, em Soho. Ambiente sofisticado e equipe super atenciosa.", price: "$$", lat: 40.7243, lng: -74.0030, time: "30min", link: "https://housingworkscannabis.com" },
  { id: "d002", category: "Dispensaries", name: "The Travel Agency", emoji: "✈️", desc: "Dispensario tematico de viagem em Manhattan. Visual unico, otima selecao e atendimento impecavel.", price: "$$", lat: 40.7589, lng: -73.9851, time: "30min" },
  { id: "d003", category: "Dispensaries", name: "Gotham", emoji: "🦇", desc: "Dispensario premium no Midtown com enfase em educacao do consumidor. Ambiente elegante.", price: "$$", lat: 40.7549, lng: -73.9840, time: "30min" },
  { id: "d004", category: "Dispensaries", name: "Smacked Village", emoji: "🌱", desc: "Dispensario bem avaliado no West Village, com ambiente aconchegante e boa selecao de produtos locais.", price: "$$", lat: 40.7335, lng: -74.0030, time: "30min" },
  { id: "d005", category: "Dispensaries", name: "Terp Bros", emoji: "🍃", desc: "Um dos primeiros dispensarios licenciados de NY no Bronx. Muito bem avaliado pela comunidade.", price: "$", lat: 40.8448, lng: -73.8648, time: "30min" },
];

const CATEGORIES = [...new Set(INITIAL_PLACES.map(p => p.category))].sort();

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  bg: "#0f0f13",
  card: "#1a1a22",
  cardHover: "#20202a",
  border: "#2a2a38",
  borderBright: "#3a3a50",
  text: "#f0eeff",
  textSub: "#9090b0",
  textDim: "#50506a",
  accent: "#ff3366",
  accentGlow: "#ff336640",
  green: "#00e676",
  greenDim: "#00e67620",
  yellow: "#ffd600",
  yellowDim: "#ffd60020",
  white: "#ffffff",
};

const injectCSS = () => {
  const style = document.createElement("style");
  style.textContent = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: ${S.bg}; font-family: 'Inter', system-ui, sans-serif; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${S.border}; border-radius: 2px; }
    input, textarea, select, button { font-family: inherit; }
    input:focus, textarea:focus { outline: none; }
    .card-hover:hover { background: ${S.cardHover} !important; transform: translateY(-1px); box-shadow: 0 4px 20px #00000040; }
    .card-hover { transition: all 0.15s ease; }
    .pill-btn { transition: all 0.15s ease; cursor: pointer; border: none; font-family: inherit; }
    .pill-btn:hover { filter: brightness(1.15); }
    @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
    .fade-up { animation: fadeUp 0.25s ease forwards; }
    .pulse { animation: pulse 2s ease infinite; }
    .leaflet-container { z-index: 1 !important; }
    .leaflet-pane { z-index: 1 !important; }
    .leaflet-top, .leaflet-bottom { z-index: 2 !important; }
  `;
  document.head.appendChild(style);
};

// ─── WEATHER WIDGET ───────────────────────────────────────────────────────────
function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current=temperature_2m,weather_code,wind_speed_10m&daily=precipitation_sum,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America/New_York&forecast_days=3")
      .then(r => r.json())
      .then(data => {
        const code = data.current.weather_code;
        const temp = Math.round(data.current.temperature_2m);
        const maxToday = Math.round(data.daily.temperature_2m_max[0]);
        const minToday = Math.round(data.daily.temperature_2m_min[0]);
        const rain = data.daily.precipitation_sum[0];
        const windTomorrow = data.current.wind_speed_10m;

        let icon = "☀️"; let desc = "Ensolarado";
        if (code >= 71 && code <= 77) { icon = "❄️"; desc = "Nevando"; }
        else if (code >= 61 && code <= 67) { icon = "🌧️"; desc = "Chovendo"; }
        else if (code >= 51 && code <= 57) { icon = "🌦️"; desc = "Garoa"; }
        else if (code >= 45) { icon = "🌫️"; desc = "Nebuloso"; }
        else if (code >= 3) { icon = "☁️"; desc = "Nublado"; }
        else if (code >= 1) { icon = "⛅"; desc = "Parcialmente nublado"; }

        const outdoor = rain < 2 && code < 61;
        setWeather({ temp, maxToday, minToday, icon, desc, outdoor, rain: rain.toFixed(1) });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ background: S.card, border: "1px solid " + S.border, borderRadius: 12, padding: "12px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
      <div className="pulse" style={{ fontSize: 20 }}>🌤️</div>
      <div style={{ fontSize: 12, color: S.textDim }}>Buscando clima de NYC...</div>
    </div>
  );

  if (!weather) return null;

  return (
    <div style={{ background: weather.outdoor ? "#001a0a" : "#1a0005", border: "1px solid " + (weather.outdoor ? "#003320" : "#330010"), borderRadius: 12, padding: "12px 16px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 28 }}>{weather.icon}</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: S.text }}>{weather.temp}°F <span style={{ fontSize: 12, fontWeight: 400, color: S.textSub }}>{weather.desc}</span></div>
          <div style={{ fontSize: 11, color: S.textDim }}>Min {weather.minToday}° / Max {weather.maxToday}° · Chuva {weather.rain}mm</div>
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: weather.outdoor ? S.green : S.accent, background: weather.outdoor ? S.greenDim : S.accentGlow, borderRadius: 20, padding: "4px 10px" }}>
          {weather.outdoor ? "Bom pra sair!" : "Talvez ficar indoor"}
        </div>
      </div>
    </div>
  );
}

// ─── MAP TAB ──────────────────────────────────────────────────────────────────
function MapTab({ places, entries, onSelect }) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);
  const markersRef = useRef([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.L) { setReady(true); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => setReady(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    if (!instanceRef.current) {
      instanceRef.current = window.L.map(mapRef.current, { center: [40.730, -73.990], zoom: 12 });
      window.L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", { attribution: "CartoDB" }).addTo(instanceRef.current);
    }
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    places.forEach(place => {
      if (!place.lat || !place.lng) return;
      const entry = entries[place.id] || {};
      const status = entry.status;
      const meta = CAT_META[place.category] || { color: "#ff3366" };
      const bg = status === "fui" ? meta.color : status === "quero" ? "#ffffff30" : "#ffffff15";
      const icon = window.L.divIcon({
        html: "<div style='width:32px;height:32px;border-radius:50%;background:" + bg + ";display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid " + meta.color + ";box-shadow:0 2px 8px #00000080'>" + place.emoji + "</div>",
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      const m = window.L.marker([place.lat, place.lng], { icon }).addTo(instanceRef.current);
      m.on("click", () => onSelect(place));
      markersRef.current.push(m);
    });
  }, [ready, places, entries]);

  if (!ready) return <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: S.textDim, fontSize: 13 }}>Carregando mapa...</div>;

  return (
    <div style={{ padding: "0 16px 16px", position: "relative" }}>
      <div style={{ fontSize: 11, color: S.textDim, marginBottom: 8, letterSpacing: "0.08em" }}>TOQUE EM UM PIN PARA VER DETALHES</div>
      <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", border: "1px solid " + S.border }}>
        <div ref={mapRef} style={{ height: "62vh", width: "100%" }} />
      </div>
    </div>
  );
}

// ─── AI PLANNER ───────────────────────────────────────────────────────────────
function PlannerModal({ places, entries, onClose }) {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("select");

  const pending = places.filter(p => { const e = entries[p.id] || {}; return !e.status || e.status === "quero"; });

  const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 8 ? [...prev, id] : prev);

  const plan = async () => {
    setStep("result");
    setLoading(true);
    const chosen = places.filter(p => selected.includes(p.id));
    const prompt = "Sou um turista morando em Jersey City, NJ. Quero visitar esses lugares em NYC em um dia: " + chosen.map(p => p.name + " (" + p.category + ", tempo estimado: " + (p.time || "1h") + ", preco: " + (p.price || "$") + ")").join("; ") + ". Monte um roteiro detalhado para o dia, incluindo: ordem ideal de visita considerando localizacao geografica, horario sugerido para cada lugar, transporte entre eles (metro/a pe/taxi), onde almocar e jantar no caminho, e dicas praticas para cada local. Seja especifico e pratico. Responda em portugues brasileiro.";
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] })
      });
      const data = await response.json();
      const text = data.content && data.content[0] ? data.content[0].text : "Erro ao gerar roteiro.";
      setResult(text);
    } catch (e) {
      setResult("Erro ao conectar com a IA. Tente novamente.");
    }
    setLoading(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000ee", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: S.card, border: "1px solid " + S.border, borderRadius: "20px 20px 0 0", padding: "20px 16px 40px", maxWidth: 560, width: "100%", maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 3, background: S.border, borderRadius: 2, margin: "0 auto 16px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: S.text }}>Planejar meu dia 🗓️</div>
            {step === "select" && <div style={{ fontSize: 12, color: S.textSub, marginTop: 2 }}>Selecione ate 8 lugares (ate {8 - selected.length} restantes)</div>}
          </div>
          <button onClick={onClose} style={{ background: S.bg, border: "1px solid " + S.border, borderRadius: 8, width: 32, height: 32, color: S.textSub, cursor: "pointer", fontSize: 16 }}>×</button>
        </div>

        {step === "select" ? (
          <>
            <div style={{ maxHeight: "50vh", overflowY: "auto", marginBottom: 14 }}>
              {pending.map(p => {
                const on = selected.includes(p.id);
                const meta = CAT_META[p.category] || { color: S.accent };
                return (
                  <div key={p.id} onClick={() => toggle(p.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, marginBottom: 6, background: on ? meta.color + "15" : S.bg, border: "1px solid " + (on ? meta.color + "50" : S.border), cursor: "pointer", transition: "all 0.15s" }}>
                    <span style={{ fontSize: 20 }}>{p.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: S.text, fontWeight: on ? 600 : 400 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: S.textDim }}>{p.category} · {p.time || "1h"}</div>
                    </div>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: on ? meta.color : "none", border: "2px solid " + (on ? meta.color : S.border), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#000", flexShrink: 0 }}>{on ? "✓" : ""}</div>
                  </div>
                );
              })}
            </div>
            <button onClick={plan} disabled={selected.length === 0} style={{ width: "100%", padding: "14px", background: selected.length > 0 ? S.accent : S.border, border: "none", borderRadius: 12, color: selected.length > 0 ? "#fff" : S.textDim, fontSize: 14, fontWeight: 700, cursor: selected.length > 0 ? "pointer" : "default", transition: "all 0.2s" }}>
              Gerar roteiro com IA ({selected.length} lugares)
            </button>
          </>
        ) : (
          <>
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div className="pulse" style={{ fontSize: 32, marginBottom: 12 }}>🤖</div>
                <div style={{ fontSize: 13, color: S.textSub }}>Claude esta montando seu roteiro...</div>
              </div>
            ) : (
              <>
                <div style={{ background: S.bg, borderRadius: 12, padding: "14px", marginBottom: 14, fontSize: 13, color: S.text, lineHeight: 1.7, whiteSpace: "pre-wrap", maxHeight: "55vh", overflowY: "auto" }}>{result}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => navigator.clipboard.writeText(result)} style={{ flex: 1, padding: "12px", background: S.accent, border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Copiar roteiro</button>
                  <button onClick={() => { setStep("select"); setResult(""); setSelected([]); }} style={{ flex: 1, padding: "12px", background: S.bg, border: "1px solid " + S.border, borderRadius: 10, color: S.textSub, fontSize: 13, cursor: "pointer" }}>Novo roteiro</button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── HISTORY TAB ──────────────────────────────────────────────────────────────
function HistoryTab({ places, entries }) {
  const visited = places
    .filter(p => (entries[p.id] || {}).status === "fui")
    .map(p => ({ ...p, entry: entries[p.id] }))
    .sort((a, b) => (b.entry.date || "").localeCompare(a.entry.date || ""));

  if (visited.length === 0) return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: S.textDim }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>📖</div>
      <div style={{ fontSize: 14 }}>Nenhum lugar visitado ainda.</div>
      <div style={{ fontSize: 12, marginTop: 6 }}>Marque lugares como "ja fui" para ver o historico aqui!</div>
    </div>
  );

  let lastMonth = "";
  return (
    <div style={{ padding: "0 16px 80px" }}>
      {visited.map((p, i) => {
        const meta = CAT_META[p.category] || { color: S.accent };
        const month = p.entry.date ? p.entry.date.slice(0, 7) : "Sem data";
        const showMonth = month !== lastMonth;
        lastMonth = month;
        const firstPhoto = p.entry.photos ? p.entry.photos[0] : (p.entry.photo || null);
        return (
          <div key={p.id}>
            {showMonth && (
              <div style={{ fontSize: 11, color: S.textDim, letterSpacing: "0.12em", marginTop: i > 0 ? 20 : 0, marginBottom: 10, paddingLeft: 4 }}>
                {month !== "Sem data" ? new Date(month + "-01").toLocaleDateString("pt-BR", { month: "long", year: "numeric" }).toUpperCase() : "SEM DATA"}
              </div>
            )}
            <div className="fade-up" style={{ display: "flex", gap: 12, marginBottom: 12, background: S.card, borderRadius: 14, padding: "14px", border: "1px solid " + S.border }}>
              <div style={{ width: 4, borderRadius: 2, background: meta.color, flexShrink: 0 }} />
              {firstPhoto ? (
                <img src={firstPhoto} alt="" style={{ width: 60, height: 60, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
              ) : (
                <div style={{ width: 60, height: 60, borderRadius: 10, background: meta.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{p.emoji}</div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: S.text }}>{p.name}</div>
                <div style={{ fontSize: 11, color: S.textDim, marginTop: 2 }}>
                  {p.entry.date && new Date(p.entry.date + "T12:00:00").toLocaleDateString("pt-BR")}
                  {p.entry.who && " · " + WHO_EMOJI[p.entry.who] + " " + WHO_LABELS[p.entry.who]}
                </div>
                {p.entry.stars > 0 && <div style={{ fontSize: 12, color: S.yellow, marginTop: 4 }}>{"★".repeat(p.entry.stars)}</div>}
                {p.entry.note && <div style={{ fontSize: 12, color: S.textSub, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.entry.note}</div>}
                {p.entry.thumb && <div style={{ fontSize: 14, marginTop: 4 }}>{p.entry.thumb === "up" ? "👍" : "👎"}</div>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── LISTS TAB ────────────────────────────────────────────────────────────────
function ListsTab({ places, lists, onSaveLists, onSelectPlace }) {
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("📋");
  const [desc, setDesc] = useState("");
  const [pickingFor, setPickingFor] = useState(null);

  const createList = () => {
    if (!name.trim()) return;
    const newList = { id: "l" + Date.now(), name: name.trim(), emoji, desc: desc.trim(), placeIds: [] };
    onSaveLists([...lists, newList]);
    setName(""); setEmoji("📋"); setDesc(""); setShowCreate(false);
  };

  const deleteList = (id) => onSaveLists(lists.filter(l => l.id !== id));

  const togglePlace = (listId, placeId) => {
    onSaveLists(lists.map(l => l.id === listId ? { ...l, placeIds: l.placeIds.includes(placeId) ? l.placeIds.filter(x => x !== placeId) : [...l.placeIds, placeId] } : l));
  };

  return (
    <div style={{ padding: "0 16px 80px" }}>
      {!showCreate && (
        <button onClick={() => setShowCreate(true)} style={{ width: "100%", padding: "12px", background: S.accent + "15", border: "1px dashed " + S.accent + "50", borderRadius: 12, color: S.accent, fontSize: 14, cursor: "pointer", marginBottom: 14, fontFamily: "inherit" }}>
          + Criar nova lista curada
        </button>
      )}

      {showCreate && (
        <div style={{ background: S.card, border: "1px solid " + S.border, borderRadius: 14, padding: "16px", marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <input value={emoji} onChange={e => setEmoji(e.target.value)} maxLength={2} style={{ width: 48, background: S.bg, border: "1px solid " + S.border, borderRadius: 8, padding: "8px", color: S.text, fontSize: 20, textAlign: "center" }} />
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome da lista..." style={{ flex: 1, background: S.bg, border: "1px solid " + S.border, borderRadius: 8, padding: "8px 12px", color: S.text, fontSize: 14 }} />
          </div>
          <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Descricao opcional..." style={{ width: "100%", background: S.bg, border: "1px solid " + S.border, borderRadius: 8, padding: "8px 12px", color: S.text, fontSize: 13, marginBottom: 12 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={createList} style={{ flex: 1, padding: "10px", background: S.accent, border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Criar</button>
            <button onClick={() => setShowCreate(false)} style={{ flex: 1, padding: "10px", background: S.bg, border: "1px solid " + S.border, borderRadius: 8, color: S.textSub, fontSize: 13, cursor: "pointer" }}>Cancelar</button>
          </div>
        </div>
      )}

      {lists.length === 0 && !showCreate && (
        <div style={{ textAlign: "center", padding: "40px 0", color: S.textDim }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
          <div style={{ fontSize: 13 }}>Crie listas tematicas para organizar e compartilhar seus favoritos!</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Ex: "NYC Romantico", "Dia de chuva", "Para amigos"</div>
        </div>
      )}

      {lists.map(list => (
        <div key={list.id} style={{ background: S.card, border: "1px solid " + S.border, borderRadius: 14, marginBottom: 12, overflow: "hidden" }}>
          <div style={{ padding: "14px 14px 10px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: S.text }}>{list.emoji} {list.name}</div>
              {list.desc && <div style={{ fontSize: 12, color: S.textDim, marginTop: 2 }}>{list.desc}</div>}
              <div style={{ fontSize: 11, color: S.textDim, marginTop: 4 }}>{list.placeIds.length} lugares</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setPickingFor(pickingFor === list.id ? null : list.id)} style={{ padding: "5px 10px", background: pickingFor === list.id ? S.accent + "20" : S.bg, border: "1px solid " + (pickingFor === list.id ? S.accent : S.border), borderRadius: 8, color: pickingFor === list.id ? S.accent : S.textDim, fontSize: 12, cursor: "pointer" }}>
                {pickingFor === list.id ? "Fechar" : "+ Add"}
              </button>
              <button onClick={() => deleteList(list.id)} style={{ padding: "5px 8px", background: S.bg, border: "1px solid " + S.border, borderRadius: 8, color: S.textDim, fontSize: 12, cursor: "pointer" }}>🗑</button>
            </div>
          </div>

          {list.placeIds.length > 0 && (
            <div style={{ padding: "0 14px 14px", display: "flex", flexWrap: "wrap", gap: 6 }}>
              {list.placeIds.map(pid => {
                const p = places.find(x => x.id === pid);
                if (!p) return null;
                return (
                  <div key={pid} onClick={() => onSelectPlace(p)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", background: S.bg, border: "1px solid " + S.border, borderRadius: 20, cursor: "pointer" }}>
                    <span style={{ fontSize: 13 }}>{p.emoji}</span>
                    <span style={{ fontSize: 12, color: S.text }}>{p.name}</span>
                    <span onClick={ev => { ev.stopPropagation(); togglePlace(list.id, pid); }} style={{ fontSize: 11, color: S.textDim, cursor: "pointer" }}>×</span>
                  </div>
                );
              })}
            </div>
          )}

          {pickingFor === list.id && (
            <div style={{ borderTop: "1px solid " + S.border, padding: "10px 14px", maxHeight: 200, overflowY: "auto" }}>
              {places.filter(p => !list.placeIds.includes(p.id)).map(p => (
                <div key={p.id} onClick={() => togglePlace(list.id, p.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid " + S.border + "50", cursor: "pointer" }}>
                  <span style={{ fontSize: 16 }}>{p.emoji}</span>
                  <span style={{ fontSize: 13, color: S.text }}>{p.name}</span>
                  <span style={{ fontSize: 11, color: S.textDim, marginLeft: "auto" }}>{p.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── PHOTO GALLERY ────────────────────────────────────────────────────────────
function PhotoGallery({ photos, onChange }) {
  const fileRef = useRef();
  const handleAdd = ev => {
    Array.from(ev.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => onChange(prev => prev.length < 4 ? [...prev, e.target.result] : prev);
      reader.readAsDataURL(file);
    });
    ev.target.value = "";
  };
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {photos.map((p, i) => (
          <div key={i} style={{ position: "relative", aspectRatio: "4/3" }}>
            <img src={p} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10 }} />
            <button onClick={() => onChange(prev => prev.filter((_, j) => j !== i))} style={{ position: "absolute", top: 6, right: 6, background: "#000c", border: "none", borderRadius: "50%", width: 22, height: 22, color: "#fff", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          </div>
        ))}
        {photos.length < 4 && (
          <div onClick={() => fileRef.current.click()} style={{ aspectRatio: "4/3", background: S.bg, border: "1px dashed " + S.border, borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: S.textDim, fontSize: 12, gap: 4 }}>
            <span style={{ fontSize: 22 }}>+</span>
            <span>Foto {photos.length + 1}/4</span>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleAdd} style={{ display: "none" }} />
    </div>
  );
}

// ─── NEARBY PLACES ────────────────────────────────────────────────────────────
function NearbyPlaces({ place, places, entries, onSelect }) {
  if (!place.lat || !place.lng) return null;
  const dist = (a, b) => Math.sqrt(Math.pow(a.lat - b.lat, 2) + Math.pow(a.lng - b.lng, 2));
  const nearby = places
    .filter(p => p.id !== place.id && p.lat && p.lng && (entries[p.id] || {}).status !== "fui")
    .sort((a, b) => dist(place, a) - dist(place, b))
    .slice(0, 3);
  if (nearby.length === 0) return null;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 10, color: S.textDim, letterSpacing: "0.12em", marginBottom: 8 }}>LUGARES PROXIMOS</div>
      {nearby.map(p => {
        const meta = CAT_META[p.category] || { color: S.accent };
        return (
          <div key={p.id} onClick={() => onSelect(p)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: S.bg, border: "1px solid " + S.border, borderRadius: 10, marginBottom: 6, cursor: "pointer" }}>
            <span style={{ fontSize: 18 }}>{p.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: S.text }}>{p.name}</div>
              <div style={{ fontSize: 11, color: S.textDim }}>{p.category}</div>
            </div>
            <div style={{ fontSize: 10, color: meta.color, background: meta.color + "20", borderRadius: 6, padding: "2px 6px" }}>{p.price || "$"}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── DETAIL MODAL ─────────────────────────────────────────────────────────────
function DetailModal({ place, entry, places, entries, onClose, onSave, onDelete, onSelectNearby }) {
  const e = entry || {};
  const [note, setNote] = useState(e.note || "");
  const [date, setDate] = useState(e.date || new Date().toISOString().split("T")[0]);
  const [photos, setPhotos] = useState(e.photos || (e.photo ? [e.photo] : []));
  const [status, setStatus] = useState(e.status || "quero");
  const [stars, setStars] = useState(e.stars || 0);
  const [thumb, setThumb] = useState(e.thumb || null);
  const [vibes, setVibes] = useState(e.vibes || []);
  const [price, setPrice] = useState(e.price || place.price || null);
  const [who, setWho] = useState(e.who || "juntos");
  const [link, setLink] = useState(e.link || place.link || "");
  const [confirmDel, setConfirmDel] = useState(false);
  const meta = CAT_META[place.category] || { color: S.accent };

  const STATUS = {
    quero: { label: "Quero ir", icon: "♡", sel: "♥", color: "#4da6ff" },
    fui:   { label: "Ja fui!", icon: "○", sel: "✓", color: S.green },
    skip:  { label: "Pular",   icon: "−", sel: "−", color: S.textDim },
  };

  const mapsUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(place.name + " New York");

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000f0", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: S.card, borderTop: "1px solid " + S.border, borderRadius: "20px 20px 0 0", padding: "20px 16px 48px", maxWidth: 560, width: "100%", maxHeight: "94vh", overflowY: "auto" }} onClick={ev => ev.stopPropagation()}>
        <div style={{ width: 36, height: 3, background: S.border, borderRadius: 2, margin: "0 auto 16px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 28 }}>{place.emoji}</span>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: S.text, lineHeight: 1.2 }}>{place.name}</div>
                <div style={{ display: "flex", gap: 5, marginTop: 4, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: meta.color, background: meta.color + "20", borderRadius: 6, padding: "2px 8px" }}>{place.category}</span>
                  {price && <span style={{ fontSize: 11, color: S.textSub, background: S.bg, borderRadius: 6, padding: "2px 8px" }}>{PRICE_EMOJI[price]} {PRICE_LABELS[price]}</span>}
                  {place.time && <span style={{ fontSize: 11, color: S.textDim, background: S.bg, borderRadius: 6, padding: "2px 8px" }}>⏱ {place.time}</span>}
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <a href={mapsUrl} target="_blank" rel="noreferrer" style={{ background: S.bg, border: "1px solid " + S.border, borderRadius: 8, width: 34, height: 34, color: S.textSub, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 15 }}>📍</a>
            {(link || place.link) && <a href={link || place.link} target="_blank" rel="noreferrer" style={{ background: S.bg, border: "1px solid " + S.border, borderRadius: 8, width: 34, height: 34, color: S.textSub, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 15 }}>🔗</a>}
            <button onClick={onClose} style={{ background: S.bg, border: "1px solid " + S.border, borderRadius: 8, width: 34, height: 34, color: S.textSub, cursor: "pointer", fontSize: 18 }}>×</button>
          </div>
        </div>

        <div style={{ fontSize: 13, color: S.textSub, lineHeight: 1.6, marginBottom: 18, padding: "10px 12px", background: S.bg, borderRadius: 10, borderLeft: "2px solid " + meta.color }}>{place.desc}</div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: S.textDim, letterSpacing: "0.12em", marginBottom: 8 }}>STATUS</div>
          <div style={{ display: "flex", gap: 8 }}>
            {Object.entries(STATUS).map(([key, cfg]) => (
              <button key={key} onClick={() => setStatus(key)} style={{ flex: 1, padding: "10px 4px", borderRadius: 10, background: status === key ? cfg.color + "18" : S.bg, border: "1px solid " + (status === key ? cfg.color + "60" : S.border), color: status === key ? cfg.color : S.textDim, fontSize: 14, cursor: "pointer", transition: "all 0.15s" }}>
                <div>{status === key ? cfg.sel : cfg.icon}</div>
                <div style={{ fontSize: 10, marginTop: 3 }}>{cfg.label}</div>
              </button>
            ))}
          </div>
        </div>

        {status === "fui" && (
          <>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: S.textDim, letterSpacing: "0.12em", marginBottom: 8 }}>QUEM FOI?</div>
              <div style={{ display: "flex", gap: 8 }}>
                {WHO_OPTIONS.map(w => (
                  <button key={w} onClick={() => setWho(w)} style={{ flex: 1, padding: "10px 4px", borderRadius: 10, background: who === w ? S.yellow + "18" : S.bg, border: "1px solid " + (who === w ? S.yellow + "60" : S.border), color: who === w ? S.yellow : S.textDim, fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}>
                    <div>{WHO_EMOJI[w]}</div>
                    <div style={{ fontSize: 10, marginTop: 3 }}>{WHO_LABELS[w]}</div>
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: S.textDim, letterSpacing: "0.12em", marginBottom: 8 }}>QUANDO?</div>
              <input type="date" value={date} onChange={ev => setDate(ev.target.value)} style={{ width: "100%", background: S.bg, border: "1px solid " + S.border, borderRadius: 10, padding: "10px 14px", color: S.text, fontSize: 14 }} />
            </div>
          </>
        )}

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: S.textDim, letterSpacing: "0.12em", marginBottom: 8 }}>PRECO</div>
          <div style={{ display: "flex", gap: 6 }}>
            {PRICE_LEVELS.map(p => (
              <button key={p} onClick={() => setPrice(price === p ? null : p)} style={{ flex: 1, padding: "8px 4px", borderRadius: 10, background: price === p ? S.yellow + "18" : S.bg, border: "1px solid " + (price === p ? S.yellow + "60" : S.border), color: price === p ? S.yellow : S.textDim, fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}>
                {PRICE_EMOJI[p]}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: S.textDim, letterSpacing: "0.12em", marginBottom: 8 }}>VIBE</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {VIBES.map(v => (
              <button key={v} onClick={() => setVibes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])} style={{ padding: "6px 12px", borderRadius: 20, background: vibes.includes(v) ? S.accent + "18" : S.bg, border: "1px solid " + (vibes.includes(v) ? S.accent + "60" : S.border), color: vibes.includes(v) ? S.accent : S.textDim, fontSize: 12, cursor: "pointer", transition: "all 0.15s" }}>
                {VIBE_EMOJI[v]} {VIBE_LABELS[v]}
              </button>
            ))}
          </div>
        </div>

        {status === "fui" && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: S.textDim, letterSpacing: "0.12em", marginBottom: 8 }}>AVALIACAO</div>
            <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
              {[1,2,3,4,5].map(n => (
                <span key={n} onClick={() => setStars(stars === n ? 0 : n)} style={{ fontSize: 26, cursor: "pointer", color: n <= stars ? S.yellow : S.textDim, transition: "color 0.1s" }}>★</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setThumb(thumb === "up" ? null : "up")} style={{ flex: 1, padding: "10px", borderRadius: 10, background: thumb === "up" ? S.green + "20" : S.bg, border: "1px solid " + (thumb === "up" ? S.green : S.border), fontSize: 20, cursor: "pointer" }}>👍</button>
              <button onClick={() => setThumb(thumb === "down" ? null : "down")} style={{ flex: 1, padding: "10px", borderRadius: 10, background: thumb === "down" ? S.accent + "20" : S.bg, border: "1px solid " + (thumb === "down" ? S.accent : S.border), fontSize: 20, cursor: "pointer" }}>👎</button>
            </div>
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: S.textDim, letterSpacing: "0.12em", marginBottom: 8 }}>{status === "fui" ? "COMO FOI?" : "NOTAS"}</div>
          <textarea value={note} onChange={ev => setNote(ev.target.value)} placeholder={status === "fui" ? "Adoramos! A fila valeu..." : "Lembrete, dica, horario..."} rows={3} style={{ width: "100%", background: S.bg, border: "1px solid " + S.border, borderRadius: 10, padding: "10px 14px", color: S.text, fontSize: 14, resize: "none" }} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: S.textDim, letterSpacing: "0.12em", marginBottom: 8 }}>LINK (ingresso, evento, site)</div>
          <input value={link} onChange={ev => setLink(ev.target.value)} placeholder="https://..." style={{ width: "100%", background: S.bg, border: "1px solid " + S.border, borderRadius: 10, padding: "10px 14px", color: S.text, fontSize: 13 }} />
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 10, color: S.textDim, letterSpacing: "0.12em", marginBottom: 8 }}>FOTOS (ate 4)</div>
          <PhotoGallery photos={photos} onChange={setPhotos} />
        </div>

        <NearbyPlaces place={place} places={places} entries={entries} onSelect={p => { onClose(); setTimeout(() => onSelectNearby(p), 100); }} />

        <button onClick={() => onSave({ status, note, date, photos, stars, thumb, vibes, price, who, link })} style={{ width: "100%", padding: "14px", background: S.accent, border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 10, letterSpacing: "0.04em" }}>
          Salvar
        </button>

        {place.custom && (
          confirmDel ? (
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setConfirmDel(false)} style={{ flex: 1, padding: "11px", background: S.bg, border: "1px solid " + S.border, borderRadius: 10, color: S.textSub, fontSize: 13, cursor: "pointer" }}>Cancelar</button>
              <button onClick={onDelete} style={{ flex: 1, padding: "11px", background: "#5a0000", border: "1px solid #aa3333", borderRadius: 10, color: "#ff8888", fontSize: 13, cursor: "pointer" }}>Confirmar</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDel(true)} style={{ width: "100%", padding: "11px", background: "none", border: "1px solid " + S.border, borderRadius: 10, color: S.textDim, fontSize: 13, cursor: "pointer" }}>Remover lugar</button>
          )
        )}
      </div>
    </div>
  );
}

// ─── ADD MODAL ────────────────────────────────────────────────────────────────
function AddModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [emoji, setEmoji] = useState("📍");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState("$");
  const [time, setTime] = useState("2h");
  const [link, setLink] = useState("");
  const handle = () => {
    if (!name.trim()) return;
    onAdd({ id: "u" + Date.now(), name: name.trim(), desc: desc.trim(), emoji, category, price, time, link, custom: true });
    onClose();
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000f0", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: S.card, borderTop: "1px solid " + S.border, borderRadius: "20px 20px 0 0", padding: "20px 16px 48px", maxWidth: 560, width: "100%", maxHeight: "85vh", overflowY: "auto" }} onClick={ev => ev.stopPropagation()}>
        <div style={{ width: 36, height: 3, background: S.border, borderRadius: 2, margin: "0 auto 16px" }} />
        <div style={{ fontSize: 15, fontWeight: 700, color: S.text, marginBottom: 16 }}>Novo lugar</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <input value={emoji} onChange={ev => setEmoji(ev.target.value)} maxLength={2} style={{ width: 50, background: S.bg, border: "1px solid " + S.border, borderRadius: 8, padding: "8px", color: S.text, fontSize: 22, textAlign: "center" }} />
          <input value={name} onChange={ev => setName(ev.target.value)} placeholder="Nome do lugar..." style={{ flex: 1, background: S.bg, border: "1px solid " + S.border, borderRadius: 8, padding: "8px 12px", color: S.text, fontSize: 14 }} />
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <select value={category} onChange={ev => setCategory(ev.target.value)} style={{ flex: 1, background: S.card, border: "1px solid " + S.border, borderRadius: 8, padding: "8px 10px", color: S.text, fontSize: 13 }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div style={{ display: "flex", gap: 4 }}>
            {PRICE_LEVELS.map(p => <button key={p} onClick={() => setPrice(p)} style={{ padding: "8px 8px", borderRadius: 8, background: price === p ? S.accent + "20" : S.bg, border: "1px solid " + (price === p ? S.accent : S.border), color: price === p ? S.accent : S.textDim, fontSize: 12, cursor: "pointer" }}>{PRICE_EMOJI[p]}</button>)}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {TIME_OPTIONS.map(t => <button key={t} onClick={() => setTime(t)} style={{ padding: "6px 10px", borderRadius: 20, background: time === t ? S.accent + "20" : S.bg, border: "1px solid " + (time === t ? S.accent : S.border), color: time === t ? S.accent : S.textDim, fontSize: 11, cursor: "pointer" }}>{t}</button>)}
        </div>
        <textarea value={desc} onChange={ev => setDesc(ev.target.value)} placeholder="Descricao..." rows={2} style={{ width: "100%", background: S.bg, border: "1px solid " + S.border, borderRadius: 8, padding: "8px 12px", color: S.text, fontSize: 13, resize: "none", marginBottom: 10 }} />
        <input value={link} onChange={ev => setLink(ev.target.value)} placeholder="Link (opcional)..." style={{ width: "100%", background: S.bg, border: "1px solid " + S.border, borderRadius: 8, padding: "8px 12px", color: S.text, fontSize: 13, marginBottom: 14 }} />
        <button onClick={handle} style={{ width: "100%", padding: "13px", background: S.accent, border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Adicionar</button>
      </div>
    </div>
  );
}

// ─── SHARE MODAL ──────────────────────────────────────────────────────────────
function ShareModal({ places, entries, onClose }) {
  const [copied, setCopied] = useState(false);
  const recs = places.filter(p => { const e = entries[p.id] || {}; return e.thumb === "up" || (e.stars && e.stars >= 4); });
  const url = window.location.href;
  const text = "Nossos favoritos em NYC 🗽\n\n" + recs.map(p => { const e = entries[p.id] || {}; return p.emoji + " " + p.name + (e.stars ? " " + "★".repeat(e.stars) : ""); }).join("\n") + "\n\n" + url;
  const copy = t => { navigator.clipboard.writeText(t); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000f0", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: S.card, borderTop: "1px solid " + S.border, borderRadius: "20px 20px 0 0", padding: "20px 16px 40px", maxWidth: 560, width: "100%", maxHeight: "80vh", overflowY: "auto" }} onClick={ev => ev.stopPropagation()}>
        <div style={{ width: 36, height: 3, background: S.border, borderRadius: 2, margin: "0 auto 16px" }} />
        <div style={{ fontSize: 15, fontWeight: 700, color: S.text, marginBottom: 6 }}>Compartilhar</div>
        <div style={{ fontSize: 12, color: S.textSub, marginBottom: 14 }}>{recs.length} lugares com 👍 ou 4+ estrelas</div>
        {recs.length === 0 ? (
          <div style={{ color: S.textDim, fontSize: 13, textAlign: "center", padding: "20px 0" }}>Avalie lugares primeiro!</div>
        ) : (
          <>
            <div style={{ background: S.bg, borderRadius: 10, padding: "12px", marginBottom: 14, maxHeight: 160, overflowY: "auto" }}>
              {recs.map(p => { const e = entries[p.id] || {}; return <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid " + S.border }}><span style={{ fontSize: 16 }}>{p.emoji}</span><div style={{ flex: 1 }}><div style={{ fontSize: 13, color: S.text }}>{p.name}</div><div style={{ fontSize: 11, color: S.textDim }}>{e.stars > 0 && "★".repeat(e.stars)} {e.thumb === "up" ? "👍" : ""}</div></div></div>; })}
            </div>
            <button onClick={() => copy(text)} style={{ width: "100%", padding: "13px", background: copied ? "#1a5a1a" : S.accent, border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 8, transition: "background 0.2s" }}>{copied ? "Copiado!" : "Copiar lista pra WhatsApp"}</button>
            <button onClick={() => copy(url)} style={{ width: "100%", padding: "13px", background: S.bg, border: "1px solid " + S.border, borderRadius: 10, color: S.text, fontSize: 13, cursor: "pointer" }}>Copiar link do app</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [places, setPlaces] = useState(INITIAL_PLACES);
  const [entries, setEntries] = useState({});
  const [lists, setLists] = useState([]);
  const [tab, setTab] = useState("list");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [activeFilter, setActiveFilter] = useState("todos");
  const [filterVibe, setFilterVibe] = useState(null);
  const [filterPrice, setFilterPrice] = useState(null);
  const [filterStars, setFilterStars] = useState(0);
  const [filterThumb, setFilterThumb] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showPlanner, setShowPlanner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [placeOfDay, setPlaceOfDay] = useState(null);

  useEffect(() => { injectCSS(); }, []);

  useEffect(() => {
    const u1 = onValue(ref(db, "entries"), snap => { if (snap.val()) setEntries(snap.val()); setLoading(false); });
    const u2 = onValue(ref(db, "customPlaces"), snap => {
      if (snap.val()) { const c = Object.values(snap.val()); setPlaces(prev => { const ids = new Set(prev.map(p => p.id)); return [...prev, ...c.filter(p => !ids.has(p.id))]; }); }
    });
    const u3 = onValue(ref(db, "lists"), snap => { if (snap.val()) setLists(Object.values(snap.val())); setLoading(false); });
    setTimeout(() => setLoading(false), 3000);
    return () => { u1(); u2(); u3(); };
  }, []);

  useEffect(() => {
    if (!places.length) return;
    const candidates = places.filter(p => { const e = entries[p.id]; return !e || !e.status || e.status === "quero"; });
    if (!candidates.length) return;
    const seed = new Date().toDateString();
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = ((h << 5) - h) + seed.charCodeAt(i);
    setPlaceOfDay(candidates[Math.abs(h) % candidates.length]);
  }, [places, entries]);

  const handleSave = async (placeId, data) => {
    setSyncing(true);
    setEntries(prev => ({ ...prev, [placeId]: data }));
    await set(ref(db, "entries/" + placeId), data);
    setSyncing(false);
    setSelected(null);
  };

  const handleAdd = async place => {
    setPlaces(prev => [...prev, place]);
    await set(ref(db, "customPlaces/" + place.id), place);
  };

  const handleDelete = async placeId => {
    setPlaces(prev => prev.filter(p => p.id !== placeId));
    await remove(ref(db, "customPlaces/" + placeId));
    await remove(ref(db, "entries/" + placeId));
    setEntries(prev => { const n = { ...prev }; delete n[placeId]; return n; });
    setSelected(null);
  };

  const saveLists = async newLists => {
    setLists(newLists);
    const obj = {};
    newLists.forEach(l => { obj[l.id] = l; });
    await set(ref(db, "lists"), obj);
  };

  const getSurprise = () => {
    const candidates = places.filter(p => { const e = entries[p.id]; return !e || !e.status || e.status === "quero"; });
    if (candidates.length) setSelected(candidates[Math.floor(Math.random() * candidates.length)]);
  };

  const activeFiltersCount = [filterVibe, filterPrice, filterStars > 0, filterThumb].filter(Boolean).length;

  const filteredPlaces = places.filter(p => {
    const entry = entries[p.id] || {};
    const sl = search.toLowerCase();
    const searchOk = !search || p.name.toLowerCase().includes(sl) || (p.desc || "").toLowerCase().includes(sl) || p.category.toLowerCase().includes(sl);
    const catOk = activeCategory === "Todos" || p.category === activeCategory;
    const status = entry.status;
    const statusOk = activeFilter === "todos" ? true : activeFilter === "quero" ? (!status || status === "quero") : activeFilter === "fui" ? status === "fui" : status === "skip";
    const vibeOk = !filterVibe || (entry.vibes && entry.vibes.includes(filterVibe));
    const priceOk = !filterPrice || (entry.price || p.price) === filterPrice;
    const starsOk = filterStars === 0 || (entry.stars && entry.stars >= filterStars);
    const thumbOk = !filterThumb || entry.thumb === filterThumb;
    return searchOk && catOk && statusOk && vibeOk && priceOk && starsOk && thumbOk;
  }).sort((a, b) => {
    if (sortBy === "az") return a.name.localeCompare(b.name);
    if (sortBy === "za") return b.name.localeCompare(a.name);
    if (sortBy === "stars") return ((entries[b.id] || {}).stars || 0) - ((entries[a.id] || {}).stars || 0);
    if (sortBy === "pending") { const sa = (entries[a.id] || {}).status; const sb = (entries[b.id] || {}).status; return (!sa ? -1 : !sb ? 1 : 0); }
    if (sortBy === "date") { const da = (entries[a.id] || {}).date || ""; const db2 = (entries[b.id] || {}).date || ""; return db2.localeCompare(da); }
    if (sortBy === "cat") return a.category.localeCompare(b.category);
    return 0;
  });

  const total = places.length;
  const visited = Object.values(entries).filter(e => e.status === "fui").length;
  const pct = Math.round((visited / total) * 100);

  const TABS = [["list", "Lista", "☰"], ["map", "Mapa", "🗺"], ["history", "Historico", "📖"], ["curated", "Listas", "📋"]];

  if (loading) return (
    <div style={{ minHeight: "100vh", background: S.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🗽</div>
        <div className="pulse" style={{ fontSize: 11, color: S.textDim, letterSpacing: "0.2em" }}>NYC BUCKET LIST</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: S.bg, color: S.text, fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* HEADER */}
      <div style={{ background: S.bg + "f8", backdropFilter: "blur(12px)", borderBottom: "1px solid " + S.border, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "14px 16px 0" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div onClick={() => window.location.reload()} style={{ cursor: "pointer" }}>
              <div style={{ fontSize: 11, color: S.textDim, letterSpacing: "0.18em", marginBottom: 1 }}>GUI & GABRIEL {syncing && <span className="pulse">· SALVANDO</span>}</div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", background: "linear-gradient(90deg, " + S.accent + ", #ff6b35, #ffd600)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>NYC Bucket List 🗽</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={getSurprise} title="Surpreenda-me" style={{ background: S.card, border: "1px solid " + S.border, borderRadius: 10, width: 36, height: 36, color: S.textSub, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>🎲</button>
              <button onClick={() => setShowPlanner(true)} style={{ background: S.card, border: "1px solid " + S.border, borderRadius: 10, width: 36, height: 36, color: S.textSub, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>🗓️</button>
              <button onClick={() => setShowShare(true)} style={{ background: S.card, border: "1px solid " + S.border, borderRadius: 10, width: 36, height: 36, color: S.textSub, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>↗</button>
            </div>
          </div>

          {/* PROGRESS */}
          <div style={{ background: S.card, border: "1px solid " + S.border, borderRadius: 12, padding: "10px 14px", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ fontSize: 11, color: S.textDim, letterSpacing: "0.08em" }}>NYC EXPLORADA</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: S.accent }}>{pct}%</div>
            </div>
            <div style={{ height: 4, background: S.border, borderRadius: 2 }}>
              <div style={{ height: "100%", width: pct + "%", background: "linear-gradient(90deg, " + S.accent + ", #ff6b35, " + S.yellow + ")", borderRadius: 2, transition: "width 0.6s ease" }} />
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 6 }}>
              <span style={{ fontSize: 11, color: S.green }}>✓ {visited} visitados</span>
              <span style={{ fontSize: 11, color: S.textDim }}>{total - visited} na lista</span>
            </div>
          </div>

          {/* TABS */}
          <div style={{ display: "flex", gap: 0, background: S.card, borderRadius: 10, padding: 3, border: "1px solid " + S.border, marginBottom: 10 }}>
            {TABS.map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} style={{ flex: 1, padding: "7px 4px", borderRadius: 8, background: tab === key ? S.accent : "none", border: "none", color: tab === key ? "#fff" : S.textDim, fontSize: 12, cursor: "pointer", fontWeight: tab === key ? 600 : 400, transition: "all 0.15s" }}>{label}</button>
            ))}
          </div>

          {tab === "list" && (
            <>
              <div style={{ position: "relative", marginBottom: 8 }}>
                <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: S.textDim, fontSize: 13 }}>🔍</span>
                <input value={search} onChange={ev => setSearch(ev.target.value)} placeholder="Buscar lugares, categorias..." style={{ width: "100%", background: S.card, border: "1px solid " + S.border, borderRadius: 10, padding: "9px 34px 9px 34px", color: S.text, fontSize: 13 }} />
                {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: S.textDim, cursor: "pointer", fontSize: 16 }}>×</button>}
              </div>

              <div style={{ display: "flex", gap: 5, marginBottom: 8, overflowX: "auto", scrollbarWidth: "none" }}>
                {[["todos", "Todos"], ["quero", "♥ Quero"], ["fui", "✓ Fui"], ["skip", "− Skip"]].map(([key, label]) => (
                  <button key={key} onClick={() => setActiveFilter(activeFilter === key && key !== "todos" ? "todos" : key)} className="pill-btn" style={{ padding: "5px 12px", borderRadius: 20, background: activeFilter === key ? S.accent : S.card, border: "1px solid " + (activeFilter === key ? S.accent : S.border), color: activeFilter === key ? "#fff" : S.textDim, fontSize: 12, whiteSpace: "nowrap" }}>{label}</button>
                ))}
                <button onClick={() => setShowFilters(!showFilters)} className="pill-btn" style={{ padding: "5px 12px", borderRadius: 20, background: activeFiltersCount > 0 ? S.yellow + "20" : S.card, border: "1px solid " + (activeFiltersCount > 0 ? S.yellow : S.border), color: activeFiltersCount > 0 ? S.yellow : S.textDim, fontSize: 12, whiteSpace: "nowrap" }}>
                  {activeFiltersCount > 0 ? "Filtros (" + activeFiltersCount + ")" : "Filtros"}
                </button>
                <select value={sortBy} onChange={ev => setSortBy(ev.target.value)} style={{ background: S.card, border: "1px solid " + S.border, borderRadius: 20, padding: "5px 10px", color: S.textDim, fontSize: 12 }}>
                  <option value="default">Padrao</option>
                  <option value="az">A → Z</option>
                  <option value="za">Z → A</option>
                  <option value="stars">Nota</option>
                  <option value="pending">Pendentes</option>
                  <option value="date">Data visita</option>
                  <option value="cat">Categoria</option>
                </select>
              </div>

              {showFilters && (
                <div style={{ background: S.card, border: "1px solid " + S.border, borderRadius: 12, padding: "12px", marginBottom: 8 }}>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, color: S.textDim, letterSpacing: "0.12em", marginBottom: 6 }}>VIBE</div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {VIBES.map(v => <button key={v} onClick={() => setFilterVibe(filterVibe === v ? null : v)} className="pill-btn" style={{ padding: "4px 10px", borderRadius: 20, background: filterVibe === v ? S.accent + "20" : S.bg, border: "1px solid " + (filterVibe === v ? S.accent : S.border), color: filterVibe === v ? S.accent : S.textDim, fontSize: 11 }}>{VIBE_EMOJI[v]} {VIBE_LABELS[v]}</button>)}
                    </div>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, color: S.textDim, letterSpacing: "0.12em", marginBottom: 6 }}>PRECO</div>
                    <div style={{ display: "flex", gap: 5 }}>
                      {PRICE_LEVELS.map(p => <button key={p} onClick={() => setFilterPrice(filterPrice === p ? null : p)} className="pill-btn" style={{ flex: 1, padding: "6px", borderRadius: 8, background: filterPrice === p ? S.yellow + "20" : S.bg, border: "1px solid " + (filterPrice === p ? S.yellow : S.border), color: filterPrice === p ? S.yellow : S.textDim, fontSize: 12 }}>{PRICE_EMOJI[p]}</button>)}
                    </div>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, color: S.textDim, letterSpacing: "0.12em", marginBottom: 6 }}>NOTA MINIMA</div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[1,2,3,4,5].map(n => <span key={n} onClick={() => setFilterStars(filterStars === n ? 0 : n)} style={{ fontSize: 22, cursor: "pointer", color: n <= filterStars ? S.yellow : S.textDim }}> ★</span>)}
                    </div>
                  </div>
                  <div style={{ marginBottom: activeFiltersCount > 0 ? 10 : 0 }}>
                    <div style={{ fontSize: 10, color: S.textDim, letterSpacing: "0.12em", marginBottom: 6 }}>POLEGAR</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {[["up", "👍 Recomendados"], ["down", "👎 Nao curtiram"]].map(([key, label]) => <button key={key} onClick={() => setFilterThumb(filterThumb === key ? null : key)} className="pill-btn" style={{ flex: 1, padding: "7px", borderRadius: 8, background: filterThumb === key ? S.accent + "20" : S.bg, border: "1px solid " + (filterThumb === key ? S.accent : S.border), color: filterThumb === key ? S.accent : S.textDim, fontSize: 12 }}>{label}</button>)}
                    </div>
                  </div>
                  {activeFiltersCount > 0 && <button onClick={() => { setFilterVibe(null); setFilterPrice(null); setFilterStars(0); setFilterThumb(null); }} style={{ width: "100%", padding: "7px", background: "none", border: "1px solid " + S.border, borderRadius: 8, color: S.textDim, fontSize: 12, cursor: "pointer" }}>Limpar filtros</button>}
                </div>
              )}

              <div style={{ display: "flex", gap: 5, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 10 }}>
                {["Todos", ...CATEGORIES].map(cat => {
                  const meta = CAT_META[cat];
                  const active = activeCategory === cat;
                  return <button key={cat} onClick={() => setActiveCategory(activeCategory === cat && cat !== "Todos" ? "Todos" : cat)} className="pill-btn" style={{ padding: "4px 10px", borderRadius: 20, background: active ? (meta ? meta.color : S.accent) + "20" : S.card, border: "1px solid " + (active ? (meta ? meta.color : S.accent) + "60" : S.border), color: active ? (meta ? meta.color : S.accent) : S.textDim, fontSize: 10, whiteSpace: "nowrap", letterSpacing: "0.04em" }}>{cat}</button>;
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "10px 16px 100px" }}>
        {tab === "map" && <MapTab places={filteredPlaces} entries={entries} onSelect={setSelected} />}
        {tab === "history" && <HistoryTab places={places} entries={entries} />}
        {tab === "curated" && <ListsTab places={places} lists={lists} onSaveLists={saveLists} onSelectPlace={setSelected} />}

        {tab === "list" && (
          <>
            <WeatherWidget />

            {placeOfDay && !search && activeFilter === "todos" && activeCategory === "Todos" && (
              <div onClick={() => setSelected(placeOfDay)} style={{ background: "linear-gradient(135deg, #1a0008, #0a001a, #001a08)", border: "1px solid " + S.border, borderRadius: 14, padding: "14px 16px", marginBottom: 10, cursor: "pointer", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, " + S.accent + ", #ff6b35, " + S.yellow + ")" }} />
                <div style={{ fontSize: 10, color: S.textDim, letterSpacing: "0.15em", marginBottom: 8 }}>LUGAR DO DIA 🎲</div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ fontSize: 32 }}>{placeOfDay.emoji}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: S.text }}>{placeOfDay.name}</div>
                    <div style={{ fontSize: 12, color: S.textSub, marginTop: 2 }}>{placeOfDay.category} · {PRICE_EMOJI[placeOfDay.price] || "?"} · {placeOfDay.time || "?"}</div>
                  </div>
                </div>
              </div>
            )}

            {filteredPlaces.length === 0 && (
              <div style={{ textAlign: "center", color: S.textDim, padding: "60px 0" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
                <div style={{ fontSize: 14 }}>Nenhum lugar encontrado</div>
              </div>
            )}

            {filteredPlaces.map(place => {
              const entry = entries[place.id] || {};
              const status = entry.status;
              const meta = CAT_META[place.category] || { color: S.accent, light: S.accentGlow };
              const displayPrice = entry.price || place.price;
              const firstPhoto = entry.photos ? entry.photos[0] : (entry.photo || null);
              const photoCount = entry.photos ? entry.photos.length : (entry.photo ? 1 : 0);
              const hasLink = entry.link || place.link;
              return (
                <div key={place.id} className="card-hover" onClick={() => setSelected(place)} style={{ background: S.card, border: "1px solid " + (status === "fui" ? meta.color + "40" : S.border), borderRadius: 12, marginBottom: 8, padding: "12px 14px", cursor: "pointer", opacity: status === "skip" ? 0.3 : 1, display: "flex", gap: 12 }}>
                  {firstPhoto ? (
                    <img src={firstPhoto} alt="" style={{ width: 54, height: 54, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 54, height: 54, borderRadius: 8, background: meta.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{place.emoji}</div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: S.text, lineHeight: 1.3 }}>{place.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                        {hasLink && <span style={{ fontSize: 11 }}>🔗</span>}
                        {entry.thumb === "up" && <span style={{ fontSize: 12 }}>👍</span>}
                        {entry.thumb === "down" && <span style={{ fontSize: 12 }}>👎</span>}
                        {entry.stars > 0 && <span style={{ fontSize: 10, color: S.yellow }}>{"★".repeat(entry.stars)}</span>}
                        {photoCount > 0 && <span style={{ fontSize: 10, color: S.textDim }}>📷{photoCount > 1 ? photoCount : ""}</span>}
                        <span style={{ fontSize: 15, color: status === "fui" ? meta.color : status === "quero" ? "#4da6ff" : S.textDim }}>
                          {status === "fui" ? "✓" : status === "quero" ? "♥" : status === "skip" ? "−" : "○"}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 4, alignItems: "center", marginTop: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 10, color: meta.color, background: meta.color + "18", borderRadius: 5, padding: "1px 6px" }}>{place.category}</span>
                      {displayPrice && <span style={{ fontSize: 10, color: S.textDim }}>{PRICE_EMOJI[displayPrice]}</span>}
                      {place.time && <span style={{ fontSize: 10, color: S.textDim }}>⏱ {place.time}</span>}
                      {entry.who && entry.who !== "juntos" && <span style={{ fontSize: 10, color: S.yellow }}>{WHO_EMOJI[entry.who]}</span>}
                      {entry.vibes && entry.vibes.map(v => <span key={v} style={{ fontSize: 10, color: S.textDim }}>{VIBE_EMOJI[v]}</span>)}
                    </div>
                    {entry.note && <div style={{ fontSize: 11, color: S.textSub, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.note}</div>}
                    {status === "fui" && entry.date && <div style={{ fontSize: 10, color: S.textDim, marginTop: 2 }}>{new Date(entry.date + "T12:00:00").toLocaleDateString("pt-BR")}</div>}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* FAB */}
      <button onClick={() => setShowAdd(true)} style={{ position: "fixed", bottom: 24, right: 20, width: 52, height: 52, background: S.accent, border: "none", borderRadius: "50%", color: "#fff", fontSize: 24, cursor: "pointer", boxShadow: "0 4px 20px " + S.accent + "60", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>+</button>

      {selected && <DetailModal place={selected} entry={entries[selected.id]} places={places} entries={entries} onClose={() => setSelected(null)} onSave={data => handleSave(selected.id, data)} onDelete={() => handleDelete(selected.id)} onSelectNearby={setSelected} />}
      {showAdd && <AddModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
      {showShare && <ShareModal places={places} entries={entries} onClose={() => setShowShare(false)} />}
      {showPlanner && <PlannerModal places={places} entries={entries} onClose={() => setShowPlanner(false)} />}
    </div>
  );
}
