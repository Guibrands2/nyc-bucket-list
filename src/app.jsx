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

const AI_PROXY = "https://nyc-ai-proxy.guibrandao-pagamentos.workers.dev";
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

const VIBES = ["romantico", "amigos", "familia", "solo"];
const VIBE_EMOJI = { romantico: "💑", amigos: "👯", familia: "👨‍👩‍👧", solo: "🧘" };
const VIBE_LABELS = { romantico: "Romantico", amigos: "Amigos", familia: "Familia", solo: "Solo" };
const SEASONS = ["verao", "inverno", "primavera", "outono", "sempre"];
const SEASON_EMOJI = { verao: "☀️", inverno: "❄️", primavera: "🌸", outono: "🍂", sempre: "🗓️" };
const SEASON_LABELS = { verao: "Verao", inverno: "Inverno", primavera: "Primavera", outono: "Outono", sempre: "Sempre" };
const PRICE_LEVELS = ["gratis", "$", "$$", "$$$"];
const PRICE_EMOJI = { gratis: "🆓", "$": "$", "$$": "$$", "$$$": "$$$" };
const PRICE_LABELS = { gratis: "Gratis", "$": "Barato", "$$": "Medio", "$$$": "Caro" };
const WHO_OPTIONS = ["gui", "gabriel", "juntos"];
const WHO_EMOJI = { gui: "🧔", gabriel: "👨", juntos: "👫" };
const WHO_LABELS = { gui: "Gui", gabriel: "Gabriel", juntos: "Os dois" };
const TIME_OPTIONS = ["30min", "1h", "2h", "3h+", "dia inteiro"];

const CAT_META = {
  "Museus":          { color: "#2563eb" },
  "Monumentos":      { color: "#7c3aed" },
  "Observatorios":   { color: "#ea7215" },
  "Natureza":        { color: "#16a34a" },
  "Livrarias":       { color: "#ca8a04" },
  "Lojas":           { color: "#db2777" },
  "Entretenimento":  { color: "#9333ea" },
  "Compras":         { color: "#0891b2" },
  "Bairros":         { color: "#dc2626" },
  "Comida":          { color: "#d97706" },
  "Dispensaries":    { color: "#15803d" },
  "Daytrips":        { color: "#0369a1" },
};

const S = {
  bg: "#0f0f13", card: "#1a1a22", cardHover: "#20202a",
  border: "#2a2a38", text: "#f0eeff", textSub: "#9090b0", textDim: "#50506a",
  accent: "#ff3366", green: "#00e676", yellow: "#ffd600", blue: "#4da6ff",
};

const INITIAL_PLACES = [
  { id: "t001", category: "Museus", name: "NY Transit Museum", emoji: "🚇", desc: "Museu dentro de uma estacao de metro desativada em Brooklyn Heights, com vagoes vintage.", price: "$", lat: 40.6906, lng: -73.9899, time: "2h", link: "https://www.nytransitmuseum.org", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Altamente recomendado para fas de historia urbana." },
  { id: "t002", category: "Museus", name: "American Museum of Natural History", emoji: "🦕", desc: "O museu do Uma Noite no Museu: dinossauros, baleia azul gigante, planetario.", price: "$$", lat: 40.7813, lng: -73.9740, time: "dia inteiro", link: "https://www.amnh.org", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Um dos melhores museus do mundo. Reserve pelo menos 4h." },
  { id: "t003", category: "Museus", name: "MoMA", emoji: "🎨", desc: "Arte moderna e contemporanea. Van Gogh, Picasso, Dali, Warhol.", price: "$$", lat: 40.7614, lng: -73.9776, time: "3h+", link: "https://www.moma.org", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Colecao incrivel. Sextas a noite tem entrada gratuita em alguns periodos." },
  { id: "t004", category: "Museus", name: "9/11 Memorial & Museum", emoji: "🕊️", desc: "No local exato das Torres Gemeas. Depoimentos de sobreviventes e familias.", price: "$$", lat: 40.7115, lng: -74.0134, time: "3h+", link: "https://www.911memorial.org", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Experiencia profunda e necessaria. Reserve ingressos com antecedencia." },
  { id: "t005", category: "Museus", name: "Intrepid Museum", emoji: "✈️", desc: "Porta-avioes real ancorado no Hudson River com o onibus espacial Enterprise e o Concorde.", price: "$$", lat: 40.7645, lng: -74.0017, time: "3h+", link: "https://www.intrepidmuseum.org", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Unico e espetacular. O Concorde e o Enterprise valem o ingresso sozinhos." },
  { id: "t006", category: "Museus", name: "Building 92 / Brooklyn Navy Yard", emoji: "⚓", desc: "Centro de visitantes gratuito com 200 anos de historia do estaleiro naval.", price: "gratis", lat: 40.6990, lng: -73.9718, time: "1h", link: "https://brooklynnavyyard.org", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Joia escondida de Brooklyn. Gratuito e muito interessante." },
  { id: "t007", category: "Museus", name: "Museum of Broadway", emoji: "🎭", desc: "Tres andares com figurinos e aderecos originais de Hamilton, Phantom, Rent e Wicked.", price: "$$", lat: 40.7580, lng: -73.9855, time: "2h", link: "https://www.themuseumofbroadway.com", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Essencial para fas de musicais. Interativo e muito bem curado." },
  { id: "t008", category: "Monumentos", name: "NY Public Library", emoji: "📚", desc: "A biblioteca dos leoes, classica de filme. A sala de leitura principal e de cair o queixo.", price: "gratis", lat: 40.7532, lng: -73.9822, time: "1h", link: "https://www.nypl.org", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Arquitetura deslumbrante. Gratis e no coracao do Midtown." },
  { id: "t009", category: "Monumentos", name: "St. Patrick's Cathedral", emoji: "⛪", desc: "Catedral neogotica no meio da 5th Ave, impressionante por dentro com os vitrais.", price: "gratis", lat: 40.7586, lng: -73.9762, time: "30min", petFriendly: false, publicBathroom: false, season: "sempre", rep: "A luz pelos vitrais e cinematografica. Silencioso e gratuito." },
  { id: "t010", category: "Monumentos", name: "NYSE + Charging Bull", emoji: "🐂", desc: "Fachada neoclassica da bolsa na Wall Street e o touro de bronze iconico do FiDi.", price: "gratis", lat: 40.7069, lng: -74.0089, time: "30min", petFriendly: true, publicBathroom: false, season: "sempre", rep: "Classico de NYC. Vale a visita ao FiDi ao redor." },
  { id: "t011", category: "Monumentos", name: "Brooklyn Heights Promenade", emoji: "🌆", desc: "Calcadao suspenso com vista panoramica da skyline. Mais tranquilo que a ponte.", price: "gratis", lat: 40.6962, lng: -73.9991, time: "1h", petFriendly: true, publicBathroom: false, season: "sempre", rep: "A melhor vista de Manhattan. Muito menos turista que a Brooklyn Bridge." },
  { id: "t012", category: "Monumentos", name: "Central Park (norte e leste)", emoji: "🌳", desc: "Bethesda Fountain, The Ramble, Belvedere Castle, Reservoir e Conservatory Garden.", price: "gratis", lat: 40.7812, lng: -73.9665, time: "3h+", petFriendly: true, publicBathroom: true, season: "primavera", rep: "A parte menos turistica do parque. The Ramble e incrivel para birdwatching." },
  { id: "t013", category: "Observatorios", name: "SUMMIT One Vanderbilt", emoji: "🔮", desc: "Instalacoes de arte com espelhos e vidro, vistas deslumbrantes. Abre ate meia-noite.", price: "$$$", lat: 40.7527, lng: -73.9772, time: "2h", link: "https://summitov.com", petFriendly: false, publicBathroom: true, season: "sempre", rep: "O mais impressionante dos observatorios. As instalacoes de arte elevam a experiencia." },
  { id: "t014", category: "Observatorios", name: "Top of the Rock", emoji: "🏙️", desc: "No Rockefeller Center, com a view classica com o Empire State no meio da foto.", price: "$$$", lat: 40.7593, lng: -73.9787, time: "1h", link: "https://www.topoftherocknyc.com", petFriendly: false, publicBathroom: true, season: "sempre", rep: "A view mais iconica de NYC. Va no por do sol para ver a cidade acender." },
  { id: "t015", category: "Observatorios", name: "Empire State Building", emoji: "🌃", desc: "O icone absoluto de Nova York. Abre ate 11:30pm, otimo pra ir ao anoitecer.", price: "$$$", lat: 40.7484, lng: -73.9857, time: "2h", link: "https://www.esbnyc.com", petFriendly: false, publicBathroom: true, season: "sempre", rep: "O classico dos classicos. A noite e magico. Reserve online." },
  { id: "t016", category: "Observatorios", name: "The Edge", emoji: "🫧", desc: "Terraco de vidro em Hudson Yards que parece que voce ta voando sobre a cidade.", price: "$$$", lat: 40.7534, lng: -74.0010, time: "1h", link: "https://edgenyc.com", petFriendly: false, publicBathroom: true, season: "sempre", rep: "O mais moderno e ousado. O piso de vidro da um frio na barriga incrivel." },
  { id: "t017", category: "Observatorios", name: "One World Observatory", emoji: "🌍", desc: "No topo do World Trade Center, o predio mais alto do hemisferio ocidental.", price: "$$$", lat: 40.7130, lng: -74.0134, time: "1h", link: "https://www.oneworldobservatory.com", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Vista para o Downtown e Hudson River. A ascensao em si ja e uma experiencia." },
  { id: "t018", category: "Natureza", name: "Prospect Park", emoji: "🌿", desc: "O grande parque de Brooklyn, projetado pelos mesmos criadores do Central Park.", price: "gratis", lat: 40.6602, lng: -73.9690, time: "3h+", petFriendly: true, publicBathroom: true, season: "primavera", rep: "Melhor que o Central Park para os moradores. Menos turista, mais genuino." },
  { id: "t019", category: "Natureza", name: "Bronx Zoo", emoji: "🦁", desc: "Um dos maiores zoologicos urbanos do mundo, no Bronx. Reserve o dia inteiro.", price: "$$", lat: 40.8506, lng: -73.8770, time: "dia inteiro", link: "https://bronxzoo.com", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Enorme e incrivel. Separe o dia inteiro." },
  { id: "t020", category: "Natureza", name: "Coney Island", emoji: "🎡", desc: "Praia iconica com o parque Luna Park e o cachorro-quente do Nathan's Famous.", price: "$", lat: 40.5755, lng: -73.9707, time: "dia inteiro", petFriendly: true, publicBathroom: true, season: "verao", rep: "Nostalgia pura. Melhor no verao. O Nathan's Famous e uma instituicao americana." },
  { id: "t021", category: "Livrarias", name: "The Strand", emoji: "📖", desc: "4 andares e 18 milhas de livros na Union Square. Uma das livrarias mais famosas dos EUA.", price: "$", lat: 40.7330, lng: -73.9910, time: "1h", link: "https://www.strandbooks.com", petFriendly: false, publicBathroom: false, season: "sempre", rep: "Uma das livrarias mais famosas do mundo. Os carrinhos de $1 na calcada sao imperdíveis." },
  { id: "t022", category: "Livrarias", name: "The Ripped Bodice", emoji: "💘", desc: "Livraria especializada em romance em Park Slope, Brooklyn.", price: "$", lat: 40.6761, lng: -73.9810, time: "1h", link: "https://www.therippedbodicebklyn.com", petFriendly: false, publicBathroom: false, season: "sempre", rep: "Joia de Park Slope. Selecao curada de romance, equipe apaixonada." },
  { id: "t023", category: "Lojas", name: "Nintendo NY", emoji: "🎮", desc: "No Rockefeller Plaza, com merchandise exclusivo e demos de jogos.", price: "$", lat: 40.7582, lng: -73.9796, time: "1h", petFriendly: false, publicBathroom: false, season: "sempre", rep: "Paraiso para gamers. Exclusivos que nao encontra em outro lugar." },
  { id: "t024", category: "Lojas", name: "Disney Store", emoji: "✨", desc: "Na area da Times Square, dois andares de tudo que e Disney, Marvel e Pixar.", price: "$", lat: 40.7574, lng: -73.9857, time: "1h", petFriendly: false, publicBathroom: false, season: "sempre", rep: "Maior Disney Store do mundo. Magica para criancas e adultos nostalgicos." },
  { id: "t025", category: "Lojas", name: "Hershey's + M&M + Lego", emoji: "🍫", desc: "As tres gigantes na Times Square. Visuais, caoticas e divertidas.", price: "$", lat: 40.7580, lng: -73.9845, time: "1h", petFriendly: false, publicBathroom: false, season: "sempre", rep: "Mais pela experiencia visual que pelas compras. Muito caotico mas iconico." },
  { id: "t026", category: "Entretenimento", name: "SPYSCAPE", emoji: "🕵️", desc: "Museu interativo de espionagem: quebra codigos e descobre seu perfil de espiao.", price: "$$", lat: 40.7634, lng: -73.9863, time: "2h", link: "https://spyscape.com", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Super interativo e surpreendente. Otimo para casais." },
  { id: "t027", category: "Entretenimento", name: "Show no Madison Square Garden", emoji: "🎸", desc: "O maior e mais famoso venue indoor de NY.", price: "$$$", lat: 40.7505, lng: -73.9934, time: "3h+", link: "https://www.msg.com", petFriendly: false, publicBathroom: true, season: "sempre", rep: "O Garden e uma lenda. Mesmo shows mediocres ficam epicos dentro dele." },
  { id: "t028", category: "Entretenimento", name: "PARAISO (Westlight Rooftop)", emoji: "🌅", desc: "Festa semanal aos domingos no rooftop do William Vale, Williamsburg.", price: "$$", lat: 40.7181, lng: -73.9566, time: "3h+", link: "https://www.paraisonyc.com", petFriendly: false, publicBathroom: true, season: "verao", rep: "Um dos melhores rooftops de NYC. Musica, drinks e vista incrivel." },
  { id: "t029", category: "Entretenimento", name: "Paradise Sunset NYC", emoji: "🌇", desc: "Day party de rooftop animada.", price: "$$", lat: 40.7549, lng: -73.9840, time: "3h+", petFriendly: false, publicBathroom: true, season: "verao", rep: "Festas animadas com vista incrivel da cidade." },
  { id: "t030", category: "Entretenimento", name: "Ellen's Stardust Diner", emoji: "🎤", desc: "Restaurante dos garcons que cantam na Broadway, tematico dos anos 50.", price: "$$", lat: 40.7614, lng: -73.9848, time: "2h", link: "https://www.ellensstardustdiner.com", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Experiencia unica em NYC. Garcons cantores talentosíssimos." },
  { id: "t031", category: "Entretenimento", name: "Bares Speakeasy", emoji: "🥃", desc: "Bares secretos escondidos atras de cafeterias e cabines telefonicas.", price: "$$", lat: 40.7282, lng: -74.0076, time: "2h", petFriendly: false, publicBathroom: true, season: "sempre", rep: "PDT e Please Don't Tell sao os mais famosos. Reserve com antecedencia." },
  { id: "t032", category: "Comida", name: "Joe's Pizza", emoji: "🍕", desc: "A fatia de pizza mais classica de NY desde 1975. Original no West Village.", price: "$", lat: 40.7306, lng: -74.0022, time: "30min", link: "https://www.joespizzanyc.com", petFriendly: false, publicBathroom: false, season: "sempre", rep: "A pizza perfeita de NYC. Simples, classica e deliciosa." },
  { id: "t033", category: "Compras", name: "American Dream Outlet", emoji: "🛍️", desc: "O maior outlet de NJ com parque de diversoes, pista de esqui indoor e aquario.", price: "$$", lat: 40.8135, lng: -74.0669, time: "dia inteiro", link: "https://www.americandream.com", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Muito alem de um outlet. O parque de diversoes indoor vale a visita." },
  { id: "s001", category: "Bairros", name: "Governors Island", emoji: "⛵", desc: "Ilha sem carros na baia com arte, piquenique e vista pro Downtown.", price: "gratis", lat: 40.6895, lng: -74.0165, time: "3h+", link: "https://govisland.com", petFriendly: true, publicBathroom: true, season: "verao", rep: "Esconderijo perfeito no verao. Bicicletas, hammocks, arte e nenhum carro." },
  { id: "s002", category: "Bairros", name: "Roosevelt Island", emoji: "🌉", desc: "Ilhinha no East River com tramway iconico saindo da 2nd Ave.", price: "gratis", lat: 40.7614, lng: -73.9506, time: "2h", petFriendly: true, publicBathroom: false, season: "sempre", rep: "Muito subestimado. O tramway e uma experiencia unica." },
  { id: "s003", category: "Bairros", name: "Harlem", emoji: "🎷", desc: "Berco do jazz e da cultura negra americana. Gospel, soul food e murais incriveis.", price: "$", lat: 40.8116, lng: -73.9465, time: "3h+", petFriendly: true, publicBathroom: false, season: "sempre", rep: "Visita cultural essencial. O gospel de domingo e transformador." },
  { id: "s004", category: "Bairros", name: "Astoria, Queens", emoji: "🇬🇷", desc: "Bairro grego com otimos restaurantes, museu de cinema e atmosfera europeia.", price: "$", lat: 40.7721, lng: -73.9302, time: "3h+", petFriendly: true, publicBathroom: false, season: "sempre", rep: "A melhor comida grega fora da Grecia. Museum of the Moving Image imperdivel." },
  { id: "s005", category: "Bairros", name: "Flushing, Queens", emoji: "🥟", desc: "A melhor gastronomia asiatica fora da Asia. Chinatown gigante com dim sum.", price: "$", lat: 40.7675, lng: -73.8330, time: "3h+", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Para os amantes de comida asiatica e um paraiso." },
  { id: "s006", category: "Bairros", name: "Little Italy & Chinatown", emoji: "🍝", desc: "Dois bairros historicos em Lower Manhattan. Cannoli, dumplings e historia.", price: "$", lat: 40.7188, lng: -73.9973, time: "2h", petFriendly: true, publicBathroom: false, season: "sempre", rep: "Little Italy e pequena mas charmosa. Chinatown e enorme e autentica." },
  { id: "s007", category: "Bairros", name: "The High Line", emoji: "🌿", desc: "Parque linear suspenso numa ferrovia desativada no West Side.", price: "gratis", lat: 40.7480, lng: -74.0048, time: "2h", link: "https://www.thehighline.org", petFriendly: true, publicBathroom: true, season: "primavera", rep: "Um dos melhores projetos urbanos do seculo. Arte, jardins e vistas unicas." },
  { id: "s008", category: "Bairros", name: "Greenpoint, Brooklyn", emoji: "🇵🇱", desc: "Bairro polones com cafes independentes, galerias e vista da skyline.", price: "$", lat: 40.7242, lng: -73.9480, time: "2h", petFriendly: true, publicBathroom: false, season: "sempre", rep: "O bairro mais charmoso de Brooklyn. Cafes incriveis." },
  { id: "s009", category: "Bairros", name: "Red Hook, Brooklyn", emoji: "⚓", desc: "Antigo bairro industrial na beira d'agua com galerias e cervejarias.", price: "$", lat: 40.6759, lng: -74.0109, time: "2h", petFriendly: true, publicBathroom: false, season: "verao", rep: "Off the beaten path mas vale muito." },
  { id: "s010", category: "Bairros", name: "Jackson Heights, Queens", emoji: "🇮🇳", desc: "Bairro mais diverso do mundo. Culinaria sul-asiatica, latina e muito mais.", price: "$", lat: 40.7498, lng: -73.8831, time: "2h", petFriendly: true, publicBathroom: false, season: "sempre", rep: "Uma volta ao mundo em alguns quarteiroes." },
  { id: "s011", category: "Museus", name: "Whitney Museum", emoji: "🎨", desc: "Arte americana contemporanea no Meatpacking District com terraco incrivel.", price: "$$", lat: 40.7396, lng: -74.0089, time: "2h", link: "https://whitney.org", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Colecao americana extraordinaria. O terraco com vista pro Hudson e bonus." },
  { id: "s012", category: "Museus", name: "The Met", emoji: "🏛️", desc: "Um dos maiores museus do mundo. Egito, armaduras medievais, impressionismo.", price: "$$", lat: 40.7794, lng: -73.9632, time: "dia inteiro", link: "https://www.metmuseum.org", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Poderia passar uma semana e nao ver tudo. Um dos 3 maiores museus do mundo." },
  { id: "s013", category: "Museus", name: "Guggenheim", emoji: "🌀", desc: "O predio em espiral de Frank Lloyd Wright ja e arte. Colecao de arte moderna.", price: "$$", lat: 40.7830, lng: -73.9590, time: "2h", link: "https://www.guggenheim.org", petFriendly: false, publicBathroom: true, season: "sempre", rep: "O edificio sozinho ja justifica a visita." },
  { id: "s014", category: "Museus", name: "Museum of the City of NY", emoji: "🗽", desc: "A historia completa de Nova York do seculo XVII ate hoje.", price: "$", lat: 40.7920, lng: -73.9519, time: "2h", link: "https://mcny.org", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Para quem quer entender NYC fundo." },
  { id: "s015", category: "Museus", name: "New York Hall of Science", emoji: "🔬", desc: "Museu de ciencias interativo em Queens com playground cientifico ao ar livre.", price: "$", lat: 40.7467, lng: -73.8467, time: "3h+", link: "https://nysci.org", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Subestimado e incrivel." },
  { id: "s016", category: "Museus", name: "Tenement Museum", emoji: "🏚️", desc: "Visita guiada a apartamentos de imigrantes preservados do seculo XIX.", price: "$$", lat: 40.7183, lng: -73.9898, time: "2h", link: "https://www.tenement.org", petFriendly: false, publicBathroom: false, season: "sempre", rep: "Uma das experiencias mais tocantes de NYC." },
  { id: "s017", category: "Museus", name: "Brooklyn Museum", emoji: "🖼️", desc: "Segundo maior museu de arte dos EUA com colecao egipcia impressionante.", price: "$$", lat: 40.6712, lng: -73.9636, time: "3h+", link: "https://www.brooklynmuseum.org", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Incrivelmente subestimado. A colecao egipcia rivaliza com o Met." },
  { id: "s018", category: "Museus", name: "Frick Collection", emoji: "🎻", desc: "Mansao do seculo XIX transformada em museu com Vermeer, Rembrandt e Renoir.", price: "$$", lat: 40.7713, lng: -73.9672, time: "2h", link: "https://www.frick.org", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Experiencia unica de ver arte numa mansao. Intimista e absolutamente elegante." },
  { id: "s019", category: "Comida", name: "Smorgasburg", emoji: "🍜", desc: "Maior mercado de comida ao ar livre dos EUA, todo sabado em Williamsburg.", price: "$", lat: 40.7223, lng: -73.9572, time: "2h", link: "https://www.smorgasburg.com", petFriendly: true, publicBathroom: true, season: "verao", rep: "O melhor mercado de comida dos EUA. Chega cedo e leva cash." },
  { id: "s020", category: "Comida", name: "Chelsea Market", emoji: "🥐", desc: "Mercado gourmet coberto numa antiga fabrica de biscoitos.", price: "$$", lat: 40.7424, lng: -74.0048, time: "2h", link: "https://www.chelseamarket.com", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Perfeito para almocar." },
  { id: "s021", category: "Comida", name: "Katz's Delicatessen", emoji: "🥪", desc: "O deli mais famoso de NY, desde 1888. O sanduiche de pastrami e lendario.", price: "$$", lat: 40.7223, lng: -73.9874, time: "1h", link: "https://katzsdelicatessen.com", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Uma instituicao. O pastrami e transcendental." },
  { id: "s022", category: "Comida", name: "Di Fara Pizza", emoji: "🍕", desc: "A pizza mais famosa de Brooklyn, feita a mao pelo mesmo dono ha decadas.", price: "$", lat: 40.6249, lng: -73.9612, time: "1h", petFriendly: false, publicBathroom: false, season: "sempre", rep: "Peregrinacao obrigatoria para fas de pizza." },
  { id: "s023", category: "Comida", name: "Russ & Daughters", emoji: "🐟", desc: "Salmao defumado, cream cheese, bagel no Lower East Side desde 1914.", price: "$$", lat: 40.7220, lng: -73.9876, time: "1h", link: "https://www.russanddaughters.com", petFriendly: false, publicBathroom: false, season: "sempre", rep: "Lendario. O bagel com lox e cream cheese aqui e o melhor do mundo." },
  { id: "s024", category: "Comida", name: "Levain Bakery", emoji: "🍪", desc: "O cookie de chocolate mais famoso de NY. Enorme, cremoso e quente.", price: "$", lat: 40.7812, lng: -73.9803, time: "30min", link: "https://levainbakery.com", petFriendly: false, publicBathroom: false, season: "sempre", rep: "O cookie mais famoso de NYC. Quente, cremoso e enorme." },
  { id: "s025", category: "Comida", name: "Peter Luger Steak House", emoji: "🥩", desc: "A churrascaria mais famosa de NY, em Williamsburg desde 1887. So aceita dinheiro.", price: "$$$", lat: 40.7099, lng: -73.9625, time: "2h", link: "https://peterluger.com", petFriendly: false, publicBathroom: true, season: "sempre", rep: "A melhor churrascaria dos EUA. Reserve meses antes." },
  { id: "s026", category: "Natureza", name: "Staten Island Ferry", emoji: "⛴️", desc: "Balsa gratuita com vista frontal da Estatua da Liberdade.", price: "gratis", lat: 40.6437, lng: -74.0735, time: "1h", petFriendly: true, publicBathroom: true, season: "sempre", rep: "A melhor vista gratuita de NYC." },
  { id: "s027", category: "Natureza", name: "Rockaway Beach", emoji: "🏄", desc: "Praia em Queens acessivel de metro. Boa pra surfe e com bares na orla.", price: "gratis", lat: 40.5843, lng: -73.8351, time: "dia inteiro", petFriendly: true, publicBathroom: true, season: "verao", rep: "A praia urbana mais legal dos EUA." },
  { id: "s028", category: "Natureza", name: "The Cloisters", emoji: "🏰", desc: "Museu de arte medieval dentro de um mosteiro reconstruido no norte de Manhattan.", price: "$$", lat: 40.8648, lng: -73.9317, time: "2h", link: "https://www.metmuseum.org/visit/met-cloisters", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Surreal e magnifico. Parece que voce saiu de NYC completamente." },
  { id: "s029", category: "Entretenimento", name: "Ver um show na Broadway", emoji: "🎭", desc: "Um classico que nao pode faltar. A experiencia mais nova-iorquina que existe.", price: "$$$", lat: 40.7590, lng: -73.9845, time: "3h+", link: "https://www.broadway.com", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Obrigatorio em NYC. TKTS na Times Square tem ingressos com ate 50% de desconto." },
  { id: "s030", category: "Entretenimento", name: "Comedy Cellar", emoji: "😂", desc: "O clube de stand-up mais lendario de NY no Village.", price: "$$", lat: 40.7302, lng: -74.0005, time: "2h", link: "https://www.comedycellar.com", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Dave Chappelle e Louis CK aparecem sem aviso." },
  { id: "s031", category: "Entretenimento", name: "Sleep No More", emoji: "🎭", desc: "Peca imersiva de teatro noir onde voce vaga por um hotel de 5 andares.", price: "$$$", lat: 40.7467, lng: -74.0014, time: "3h+", link: "https://www.sleepnomorenyc.com", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Uma das experiencias mais unicas do mundo." },
  { id: "s032", category: "Entretenimento", name: "Brooklyn Mirage", emoji: "🎧", desc: "O maior venue de musica eletronica dos EUA, em Queens.", price: "$$", lat: 40.6985, lng: -73.9318, time: "3h+", link: "https://www.avant-gardner.com", petFriendly: false, publicBathroom: true, season: "verao", rep: "O melhor venue de eletronico dos EUA." },
  { id: "s033", category: "Entretenimento", name: "Karaoke em Koreatown", emoji: "🎤", desc: "32nd St. Karaoke privativo (norebang) disponivel ate de madrugada.", price: "$$", lat: 40.7484, lng: -73.9878, time: "2h", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Norebang privativo e muito melhor que karaoke comum." },
  { id: "s034", category: "Monumentos", name: "Estatua da Liberdade", emoji: "🗽", desc: "Balsa de Battery Park pra Liberty Island. Reserve com antecedencia pra subir.", price: "$$", lat: 40.6892, lng: -74.0445, time: "3h+", link: "https://www.nps.gov/stli", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Reserve para subir na coroa com meses de antecedencia." },
  { id: "s035", category: "Monumentos", name: "Grand Central Terminal", emoji: "🚂", desc: "A estacao de trem mais bela do mundo com teto estrelado e o Whispering Gallery.", price: "gratis", lat: 40.7527, lng: -73.9772, time: "30min", petFriendly: false, publicBathroom: true, season: "sempre", rep: "Arquitetura de tirar o folego. O Whispering Gallery e magico." },
  { id: "s036", category: "Monumentos", name: "Washington Square Park", emoji: "🎨", desc: "O parque mais vivo de Manhattan com musicos, xadrez e skatistas.", price: "gratis", lat: 40.7308, lng: -74.0002, time: "1h", petFriendly: true, publicBathroom: true, season: "primavera", rep: "O coracao do Greenwich Village." },
  { id: "s037", category: "Monumentos", name: "Little Island", emoji: "🌺", desc: "Parque flutuante no Hudson River no Meatpacking, inaugurado em 2021.", price: "gratis", lat: 40.7438, lng: -74.0094, time: "1h", link: "https://littleisland.org", petFriendly: true, publicBathroom: true, season: "primavera", rep: "O projeto de parque mais bonito do seculo em NYC." },
  { id: "s038", category: "Monumentos", name: "Flatiron Building", emoji: "🏢", desc: "O predio em formato de ferro de passar roupa. Recentemente reaberto apos reforma.", price: "gratis", lat: 40.7411, lng: -73.9897, time: "30min", petFriendly: true, publicBathroom: false, season: "sempre", rep: "Icone arquitetonico de NYC." },
  { id: "d001", category: "Dispensaries", name: "Housing Works Cannabis", emoji: "🌿", desc: "O primeiro dispensario com fins sociais de NY, em Soho.", price: "$$", lat: 40.7243, lng: -74.0030, time: "30min", link: "https://housingworkscannabis.com", petFriendly: false, publicBathroom: false, season: "sempre", rep: "O melhor dispensario de NYC. Ambiente unico e missao social." },
  { id: "d002", category: "Dispensaries", name: "The Travel Agency", emoji: "✈️", desc: "Dispensario tematico de viagem em Manhattan. Visual unico e atendimento impecavel.", price: "$$", lat: 40.7589, lng: -73.9851, time: "30min", petFriendly: false, publicBathroom: false, season: "sempre", rep: "O mais instagramavel de todos." },
  { id: "d003", category: "Dispensaries", name: "Gotham", emoji: "🦇", desc: "Dispensario premium no Midtown com enfase em educacao do consumidor.", price: "$$", lat: 40.7549, lng: -73.9840, time: "30min", petFriendly: false, publicBathroom: false, season: "sempre", rep: "Elegante e sofisticado." },
  { id: "d004", category: "Dispensaries", name: "Smacked Village", emoji: "🌱", desc: "Dispensario bem avaliado no West Village com ambiente aconchegante.", price: "$$", lat: 40.7335, lng: -74.0030, time: "30min", petFriendly: false, publicBathroom: false, season: "sempre", rep: "Favorito dos moradores do West Village." },
  { id: "d005", category: "Dispensaries", name: "Terp Bros", emoji: "🍃", desc: "Um dos primeiros dispensarios licenciados de NY no Bronx.", price: "$", lat: 40.8448, lng: -73.8648, time: "30min", petFriendly: false, publicBathroom: false, season: "sempre", rep: "Pioneiro licenciado do Bronx." },
  { id: "dt001", category: "Daytrips", name: "Cold Spring, NY", emoji: "🏔️", desc: "Cidade historica as margens do Hudson River com trilhas e antiquarios.", price: "$", lat: 41.4209, lng: -73.9557, time: "dia inteiro", link: "https://coldspringny.gov", petFriendly: true, publicBathroom: true, season: "outono", rep: "Um dos melhores daytrips de NYC. Metro-North de Grand Central, 1h20." },
  { id: "dt002", category: "Daytrips", name: "Hudson, NY", emoji: "🎨", desc: "Cidade de arte e antiquarios com restaurantes excelentes e arquitetura vitoriana.", price: "$$", lat: 42.2529, lng: -73.7935, time: "dia inteiro", petFriendly: true, publicBathroom: true, season: "outono", rep: "A cidade mais charmosa do Hudson Valley." },
  { id: "dt003", category: "Daytrips", name: "Princeton, NJ", emoji: "🎓", desc: "Campus universitario historico com museu de arte de classe mundial.", price: "$", lat: 40.3573, lng: -74.6672, time: "dia inteiro", petFriendly: true, publicBathroom: true, season: "sempre", rep: "Campus lindo para passear. O Princeton University Art Museum e de graca." },
  { id: "dt004", category: "Daytrips", name: "Fire Island, NY", emoji: "🏝️", desc: "Ilha sem carros no Atlantico com praias paradisiacas e comunidade LGBTQ+ vibrante.", price: "$$", lat: 40.6318, lng: -73.1271, time: "dia inteiro", petFriendly: false, publicBathroom: true, season: "verao", rep: "Praia mais bonita proximo a NYC. Cherry Grove e The Pines sao incriveis." },
  { id: "dt005", category: "Daytrips", name: "Catskills, NY", emoji: "🌲", desc: "Montanhas com cachoeiras, trilhas e cidades artisticas a 2h de NYC.", price: "$$", lat: 42.0987, lng: -74.2179, time: "dia inteiro", petFriendly: true, publicBathroom: true, season: "outono", rep: "O destino favorito dos nova-iorquinos. Cachoeira Kaaterskill e espetacular." },
  { id: "dt006", category: "Daytrips", name: "Asbury Park, NJ", emoji: "🎸", desc: "Cidade costeira vibrante com cena musical, boardwalk historico e bares incriveis.", price: "$", lat: 40.2204, lng: -74.0121, time: "dia inteiro", petFriendly: true, publicBathroom: true, season: "verao", rep: "A cidade mais cool de NJ. Cena musical incrivel." },
  { id: "dt007", category: "Daytrips", name: "Philadelphia, PA", emoji: "🔔", desc: "Cidade historica com Liberty Bell, Reading Terminal Market e restaurantes.", price: "$$", lat: 39.9526, lng: -75.1652, time: "dia inteiro", petFriendly: true, publicBathroom: true, season: "sempre", rep: "A 1h15 de trem. O cheesesteak e o Reading Terminal Market sao imperdíveis." },
  { id: "dt008", category: "Daytrips", name: "Ski - Mountain Creek, NJ", emoji: "⛷️", desc: "Resort de ski mais proximo de NYC, a menos de 1h de carro.", price: "$$$", lat: 41.1812, lng: -74.5099, time: "dia inteiro", link: "https://mountaincreek.com", petFriendly: false, publicBathroom: true, season: "inverno", rep: "Menor que resorts de Vermont mas acessivel e divertido." },
  { id: "dt009", category: "Daytrips", name: "Long Beach, NY", emoji: "🌊", desc: "A praia mais acessivel de NYC via LIRR, com boardwalk e boa infraestrutura.", price: "$", lat: 40.5882, lng: -73.6585, time: "dia inteiro", petFriendly: false, publicBathroom: true, season: "verao", rep: "30 minutos de Penn Station. A praia mais pratica de NYC." },
  { id: "dt010", category: "Daytrips", name: "Storm King Art Center", emoji: "🗿", desc: "Museu de escultura ao ar livre em 500 acres de paisagem natural no Hudson Valley.", price: "$$", lat: 41.4096, lng: -74.0046, time: "dia inteiro", link: "https://stormking.org", petFriendly: false, publicBathroom: true, season: "outono", rep: "Uma das experiencias artisticas mais unicas do mundo." },
];

const CATEGORIES = [...new Set(INITIAL_PLACES.map(p => p.category))].sort();

const injectCSS = () => {
  if (document.getElementById("nyc-css")) return;
  const s = document.createElement("style");
  s.id = "nyc-css";
  s.textContent = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0f0f13; font-family: 'Inter', system-ui, sans-serif; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-thumb { background: #2a2a38; border-radius: 2px; }
    input, textarea, select, button { font-family: inherit; }
    input:focus, textarea:focus { outline: none; }
    .card:hover { background: #20202a !important; }
    .card { transition: background 0.12s ease; }
    .btn { transition: all 0.12s ease; cursor: pointer; border: none; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
    @keyframes slideIn { from { transform:translateY(100%); } to { transform:translateY(0); } }
    @keyframes toastIn { from { opacity:0; transform:translateX(60px); } to { opacity:1; transform:translateX(0); } }
    .fade-up { animation: fadeUp 0.2s ease forwards; }
    .pulsing { animation: pulse 1.5s ease infinite; }
    .modal { animation: slideIn 0.28s ease forwards; }
    .leaflet-container, .leaflet-pane { z-index: 1 !important; }
    .leaflet-top, .leaflet-bottom { z-index: 2 !important; }
    .swipe-card { touch-action: pan-y; user-select: none; }
  `;
  document.head.appendChild(s);
};

function Toast({ message, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }, []);
  const colors = { success: ["#1a3a1a","#00e676"], error: ["#3a1a1a","#ff3366"], info: ["#1a1a3a","#4da6ff"] };
  const [bg, border] = colors[type] || colors.info;
  return <div style={{ position:"fixed", top:18, right:16, zIndex:9999, background:bg, border:"1px solid "+border, borderRadius:12, padding:"11px 16px", color:"#f0eeff", fontSize:13, fontWeight:600, boxShadow:"0 4px 20px #00000060", animation:"toastIn 0.25s ease", maxWidth:260 }}>{message}</div>;
}

function WeatherWidget() {
  const [w, setW] = useState(null);
  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current=temperature_2m,weather_code&daily=precipitation_sum,temperature_2m_max,temperature_2m_min&temperature_unit=celsius&timezone=America/New_York&forecast_days=1")
      .then(r => r.json()).then(d => {
        const code = d.current.weather_code;
        const tempC = Math.round(d.current.temperature_2m);
        const tempF = Math.round(tempC * 9/5 + 32);
        const maxC = Math.round(d.daily.temperature_2m_max[0]);
        const minC = Math.round(d.daily.temperature_2m_min[0]);
        const rain = d.daily.precipitation_sum[0];
        let icon = "☀️", desc = "Ensolarado";
        if (code >= 71) { icon = "❄️"; desc = "Nevando"; }
        else if (code >= 61) { icon = "🌧️"; desc = "Chovendo"; }
        else if (code >= 51) { icon = "🌦️"; desc = "Garoa"; }
        else if (code >= 45) { icon = "🌫️"; desc = "Nebuloso"; }
        else if (code >= 3) { icon = "☁️"; desc = "Nublado"; }
        else if (code >= 1) { icon = "⛅"; desc = "Parcialmente nublado"; }
        setW({ tempC, tempF, maxC, minC, icon, desc, outdoor: rain < 2 && code < 61 });
      }).catch(() => {});
  }, []);
  if (!w) return null;
  return (
    <div style={{ background: w.outdoor ? "#001a08" : "#1a0008", border:"1px solid "+(w.outdoor ? "#003310" : "#330010"), borderRadius:12, padding:"10px 14px", marginBottom:10, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:24 }}>{w.icon}</span>
        <div>
          <div style={{ fontSize:15, fontWeight:700, color:"#f0eeff" }}>{w.tempC}°C / {w.tempF}°F <span style={{ fontSize:12, fontWeight:400, color:"#9090b0" }}>{w.desc}</span></div>
          <div style={{ fontSize:11, color:"#50506a" }}>Min {w.minC}°C / Max {w.maxC}°C</div>
        </div>
      </div>
      <div style={{ fontSize:11, fontWeight:600, color: w.outdoor ? "#00e676" : "#ff3366", background:(w.outdoor ? "#00e676" : "#ff3366")+"20", borderRadius:20, padding:"4px 10px" }}>
        {w.outdoor ? "Bom pra sair!" : "Indoor hoje"}
      </div>
    </div>
  );
}

function MapTab({ places, entries, onSelect }) {
  const mapRef = useRef(null);
  const inst = useRef(null);
  const markers = useRef([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.L) { setReady(true); return; }
    const link = document.createElement("link"); link.rel="stylesheet"; link.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"; document.head.appendChild(link);
    const script = document.createElement("script"); script.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"; script.onload=()=>setReady(true); document.head.appendChild(script);
  }, []);
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    if (!inst.current) {
      inst.current = window.L.map(mapRef.current, { center:[40.730,-73.990], zoom:12 });
      window.L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", { attribution:"CartoDB" }).addTo(inst.current);
    }
    markers.current.forEach(m=>m.remove()); markers.current=[];
    places.forEach(p => {
      if (!p.lat || !p.lng) return;
      const meta = CAT_META[p.category]||{color:"#ff3366"};
      const icon = window.L.divIcon({ html:"<div style='width:28px;height:28px;border-radius:50%;background:"+meta.color+"30;border:2px solid "+meta.color+";display:flex;align-items:center;justify-content:center;font-size:13px;box-shadow:0 2px 8px #00000080'>"+p.emoji+"</div>", className:"", iconSize:[28,28], iconAnchor:[14,14] });
      const m = window.L.marker([p.lat,p.lng],{icon}).addTo(inst.current);
      m.on("click",()=>onSelect(p)); markers.current.push(m);
    });
  }, [ready, places, entries]);
  if (!ready) return <div style={{ height:"60vh", display:"flex", alignItems:"center", justifyContent:"center", color:"#50506a" }}>Carregando mapa...</div>;
  return (
    <div style={{ padding:"0 16px 16px" }}>
      <div style={{ fontSize:11, color:"#50506a", marginBottom:8, letterSpacing:"0.08em" }}>TOQUE EM UM PIN PARA DETALHES</div>
      <div style={{ borderRadius:14, overflow:"hidden", border:"1px solid #2a2a38" }}>
        <div ref={mapRef} style={{ height:"62vh", width:"100%" }} />
      </div>
    </div>
  );
}

function NearbyModal({ place, places, entries, onSelect, onClose }) {
  const dist = (a,b) => Math.sqrt(Math.pow(a.lat-b.lat,2)+Math.pow(a.lng-b.lng,2));
  const nearby = places.filter(p=>p.id!==place.id&&p.lat&&p.lng&&(entries[p.id]||{}).status!=="fui").sort((a,b)=>dist(place,a)-dist(place,b)).slice(0,6);
  return (
    <div style={{ position:"fixed", inset:0, background:"#000000f0", zIndex:400, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={onClose}>
      <div className="modal" style={{ background:"#1a1a22", borderTop:"1px solid #2a2a38", borderRadius:"20px 20px 0 0", padding:"20px 16px 40px", maxWidth:560, width:"100%", maxHeight:"70vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
        <div style={{ width:36, height:3, background:"#2a2a38", borderRadius:2, margin:"0 auto 16px" }} />
        <div style={{ fontSize:15, fontWeight:700, color:"#f0eeff", marginBottom:14 }}>Lugares proximos a {place.name}</div>
        {nearby.map(p => {
          const meta = CAT_META[p.category]||{color:"#ff3366"};
          return <div key={p.id} onClick={()=>{onClose();setTimeout(()=>onSelect(p),150);}} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", background:"#0f0f13", border:"1px solid #2a2a38", borderRadius:10, marginBottom:8, cursor:"pointer" }}>
            <span style={{ fontSize:22 }}>{p.emoji}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, color:"#f0eeff", fontWeight:600 }}>{p.name}</div>
              <div style={{ fontSize:11, color:"#50506a", marginTop:2 }}>{p.category} · {PRICE_EMOJI[p.price]||"?"} · {p.time||"1h"}</div>
            </div>
            <span style={{ fontSize:10, color:meta.color, background:meta.color+"20", borderRadius:6, padding:"2px 8px" }}>{meta.color ? p.category.slice(0,3) : ""}</span>
          </div>;
        })}
        {!nearby.length && <div style={{ color:"#50506a", fontSize:13, textAlign:"center", padding:"20px 0" }}>Nenhum lugar proximo encontrado.</div>}
      </div>
    </div>
  );
}

function CheckInModal({ place, onClose, onSave, addToast }) {
  const handleCheckIn = async () => {
    const today = new Date().toISOString().split("T")[0];
    await onSave({ status:"fui", date:today, who:"juntos", note:"Check-in rapido!", photos:[], stars:0, thumb:null, vibes:[], price:place.price||null, petFriendly:place.petFriendly||false, publicBathroom:place.publicBathroom||false, link:place.link||"" });
    addToast("Check-in feito em "+place.name+"!", "success");
    onClose();
  };
  return (
    <div style={{ position:"fixed", inset:0, background:"#000000f0", zIndex:400, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={onClose}>
      <div className="modal" style={{ background:"#1a1a22", border:"1px solid #2a2a38", borderRadius:20, padding:"28px 24px", maxWidth:340, width:"100%", textAlign:"center" }} onClick={e=>e.stopPropagation()}>
        <div style={{ fontSize:40, marginBottom:12 }}>{place.emoji}</div>
        <div style={{ fontSize:17, fontWeight:700, color:"#f0eeff", marginBottom:6 }}>{place.name}</div>
        <div style={{ fontSize:13, color:"#9090b0", marginBottom:24 }}>Marcar como visitado hoje?</div>
        <button onClick={handleCheckIn} style={{ width:"100%", padding:"14px", background:"#00e676", border:"none", borderRadius:12, color:"#000", fontSize:14, fontWeight:700, cursor:"pointer", marginBottom:10 }}>✓ Check-in agora!</button>
        <button onClick={onClose} style={{ width:"100%", padding:"12px", background:"none", border:"1px solid #2a2a38", borderRadius:12, color:"#9090b0", fontSize:13, cursor:"pointer" }}>Cancelar</button>
      </div>
    </div>
  );
}

function NearbyDrawer({ userLat, userLng, places, entries, onSelect, onClose }) {
  const dist = (a) => Math.sqrt(Math.pow((a.lat||0)-userLat,2)+Math.pow((a.lng||0)-userLng,2));
  const KM_PER_DEG = 111;
  const nearby = places.filter(p=>p.lat&&p.lng&&(entries[p.id]||{}).status!=="fui").map(p=>({ ...p, distKm: dist(p)*KM_PER_DEG })).filter(p=>p.distKm<3).sort((a,b)=>a.distKm-b.distKm).slice(0,8);
  return (
    <div style={{ position:"fixed", inset:0, background:"#000000f0", zIndex:400, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={onClose}>
      <div className="modal" style={{ background:"#1a1a22", borderTop:"1px solid #2a2a38", borderRadius:"20px 20px 0 0", padding:"20px 16px 40px", maxWidth:560, width:"100%", maxHeight:"75vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
        <div style={{ width:36, height:3, background:"#2a2a38", borderRadius:2, margin:"0 auto 16px" }} />
        <div style={{ fontSize:15, fontWeight:700, color:"#f0eeff", marginBottom:4 }}>📍 Lugares proximos a voce</div>
        <div style={{ fontSize:12, color:"#9090b0", marginBottom:14 }}>No raio de 3km</div>
        {!nearby.length ? <div style={{ color:"#50506a", fontSize:13, textAlign:"center", padding:"30px 0" }}>Nenhum lugar da lista a menos de 3km. Explore a cidade!</div> : nearby.map(p => {
          const meta = CAT_META[p.category]||{color:"#ff3366"};
          return <div key={p.id} onClick={()=>{onClose();setTimeout(()=>onSelect(p),150);}} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", background:"#0f0f13", border:"1px solid #2a2a38", borderRadius:10, marginBottom:8, cursor:"pointer" }}>
            <span style={{ fontSize:22 }}>{p.emoji}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, color:"#f0eeff", fontWeight:600 }}>{p.name}</div>
              <div style={{ fontSize:11, color:"#50506a", marginTop:2 }}>{p.category} · {(p.distKm*1000).toFixed(0)}m de distancia</div>
            </div>
            <span style={{ fontSize:10, color:meta.color, background:meta.color+"20", borderRadius:6, padding:"2px 8px" }}>{PRICE_EMOJI[p.price]||"?"}</span>
          </div>;
        })}
      </div>
    </div>
  );
}

function AIChatModal({ places, entries, onClose }) {
  const [msgs, setMsgs] = useState([{ role:"assistant", content:"Oi! Sou seu guia de NYC. Pergunta qualquer coisa sobre os lugares da lista, bairros, transporte, dicas... Posso ajudar com base nos seus lugares ja visitados e o que voce quer ver!" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  const visited = places.filter(p=>(entries[p.id]||{}).status==="fui").map(p=>p.name).join(", ");
  const wishlist = places.filter(p=>(entries[p.id]||{}).status==="quero").map(p=>p.name).join(", ");

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim(); setInput("");
    const newMsgs = [...msgs, { role:"user", content:userMsg }];
    setMsgs(newMsgs); setLoading(true);
    const context = "Voce e um guia especialista em NYC. O usuario mora em Jersey City, NJ. Lugares ja visitados: "+visited+". Lista de desejos: "+wishlist+". Responda em portugues brasileiro de forma concisa e util.";
    try {
      const r = await fetch(AI_PROXY, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ messages:[{ role:"user", content:context+"\n\nPergunta do usuario: "+userMsg }] }) });
      const d = await r.json();
      const text = d.content&&d.content[0] ? d.content[0].text : "Erro ao responder.";
      setMsgs([...newMsgs, { role:"assistant", content:text }]);
    } catch { setMsgs([...newMsgs, { role:"assistant", content:"Erro ao conectar. Tente novamente." }]); }
    setLoading(false);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"#000000f0", zIndex:300, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={onClose}>
      <div className="modal" style={{ background:"#1a1a22", borderTop:"1px solid #2a2a38", borderRadius:"20px 20px 0 0", padding:"20px 0 0", maxWidth:560, width:"100%", height:"85vh", display:"flex", flexDirection:"column" }} onClick={e=>e.stopPropagation()}>
        <div style={{ padding:"0 16px 16px", borderBottom:"1px solid #2a2a38", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div><div style={{ fontSize:16, fontWeight:700, color:"#f0eeff" }}>🤖 Guia de NYC</div><div style={{ fontSize:12, color:"#9090b0" }}>Pergunte qualquer coisa sobre NYC</div></div>
          <button onClick={onClose} style={{ background:"#0f0f13", border:"1px solid #2a2a38", borderRadius:8, width:32, height:32, color:"#9090b0", cursor:"pointer", fontSize:16 }}>×</button>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"16px" }}>
          {msgs.map((m,i) => (
            <div key={i} style={{ marginBottom:12, display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
              <div style={{ maxWidth:"85%", padding:"10px 14px", borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px", background:m.role==="user"?"#ff3366":"#0f0f13", border:m.role==="user"?"none":"1px solid #2a2a38", color:"#f0eeff", fontSize:13, lineHeight:1.6 }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && <div style={{ display:"flex", justifyContent:"flex-start", marginBottom:12 }}><div style={{ padding:"10px 14px", borderRadius:"18px 18px 18px 4px", background:"#0f0f13", border:"1px solid #2a2a38" }}><span className="pulsing" style={{ color:"#9090b0", fontSize:13 }}>digitando...</span></div></div>}
          <div ref={bottomRef} />
        </div>
        <div style={{ padding:"12px 16px", borderTop:"1px solid #2a2a38", display:"flex", gap:8 }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Pergunte sobre NYC..." style={{ flex:1, background:"#0f0f13", border:"1px solid #2a2a38", borderRadius:20, padding:"10px 16px", color:"#f0eeff", fontSize:14 }} />
          <button onClick={send} disabled={!input.trim()||loading} style={{ background:input.trim()&&!loading?"#ff3366":"#2a2a38", border:"none", borderRadius:20, padding:"10px 16px", color:input.trim()&&!loading?"#fff":"#50506a", cursor:input.trim()&&!loading?"pointer":"default", fontSize:14, fontWeight:600, transition:"all 0.15s" }}>↑</button>
        </div>
      </div>
    </div>
  );
}

function PlannerModal({ places, entries, onClose, addToast }) {
  const [sel, setSel] = useState([]);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("select");
  const [startLoc, setStartLoc] = useState("Jersey City, NJ");
  const [locLoading, setLocLoading] = useState(false);
  const pending = places.filter(p=>{ const e=entries[p.id]||{}; return !e.status||e.status==="quero"; });
  const toggle = id => setSel(prev=>prev.includes(id)?prev.filter(x=>x!==id):prev.length<8?[...prev,id]:prev);

  const detectLocation = () => {
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(async pos => {
      try {
        const r = await fetch("https://nominatim.openstreetmap.org/reverse?lat="+pos.coords.latitude+"&lon="+pos.coords.longitude+"&format=json");
        const d = await r.json();
        const loc = (d.address.neighbourhood||d.address.suburb||d.address.city||"minha localizacao")+", "+(d.address.state||"NY");
        setStartLoc(loc);
      } catch { setStartLoc(pos.coords.latitude.toFixed(4)+", "+pos.coords.longitude.toFixed(4)); }
      setLocLoading(false);
    }, () => { setLocLoading(false); });
  };

  const plan = async () => {
    setStep("result"); setLoading(true);
    const chosen = places.filter(p=>sel.includes(p.id));
    const prompt = "Estou em "+startLoc+" e quero visitar esses lugares em NYC em um dia: "+chosen.map(p=>p.name+" ("+p.category+", tempo: "+(p.time||"1h")+", preco: "+(p.price||"$")+")").join("; ")+". Monte um roteiro detalhado com: ordem ideal por localizacao geografica partindo de "+startLoc+", horarios sugeridos, transporte entre cada lugar (metro/a pe/taxi com linhas especificas), onde almocar e jantar no caminho, e dicas praticas de cada local. Seja especifico. Responda em portugues brasileiro.";
    try {
      const r = await fetch(AI_PROXY, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ messages:[{role:"user",content:prompt}] }) });
      const d = await r.json();
      setResult(d.content&&d.content[0] ? d.content[0].text : "Erro ao gerar roteiro.");
    } catch { setResult("Erro ao conectar. Verifique sua conexao."); }
    setLoading(false);
  };

  const copy = () => { navigator.clipboard.writeText(result); addToast("Roteiro copiado!", "success"); };

  return (
    <div style={{ position:"fixed", inset:0, background:"#000000f0", zIndex:300, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={onClose}>
      <div className="modal" style={{ background:"#1a1a22", borderTop:"1px solid #2a2a38", borderRadius:"20px 20px 0 0", padding:"20px 16px 40px", maxWidth:560, width:"100%", maxHeight:"90vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
        <div style={{ width:36, height:3, background:"#2a2a38", borderRadius:2, margin:"0 auto 16px" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ fontSize:16, fontWeight:700, color:"#f0eeff" }}>Planejar meu dia 🗓️</div>
          <button onClick={onClose} style={{ background:"#0f0f13", border:"1px solid #2a2a38", borderRadius:8, width:32, height:32, color:"#9090b0", cursor:"pointer", fontSize:16 }}>×</button>
        </div>
        {step==="select" ? <>
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:10, color:"#50506a", letterSpacing:"0.12em", marginBottom:6 }}>PONTO DE PARTIDA</div>
            <div style={{ display:"flex", gap:8 }}>
              <input value={startLoc} onChange={e=>setStartLoc(e.target.value)} style={{ flex:1, background:"#0f0f13", border:"1px solid #2a2a38", borderRadius:10, padding:"9px 12px", color:"#f0eeff", fontSize:13 }} />
              <button onClick={detectLocation} disabled={locLoading} style={{ padding:"9px 12px", background:"#ff336620", border:"1px solid #ff3366", borderRadius:10, color:"#ff3366", fontSize:12, cursor:"pointer", whiteSpace:"nowrap" }}>
                {locLoading ? "..." : "📍 GPS"}
              </button>
            </div>
          </div>
          <div style={{ fontSize:12, color:"#9090b0", marginBottom:10 }}>Selecione ate 8 lugares ({8-sel.length} restantes)</div>
          <div style={{ maxHeight:"48vh", overflowY:"auto", marginBottom:14 }}>
            {pending.map(p => {
              const on=sel.includes(p.id); const meta=CAT_META[p.category]||{color:"#ff3366"};
              return <div key={p.id} onClick={()=>toggle(p.id)} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", borderRadius:10, marginBottom:6, background:on?meta.color+"15":"#0f0f13", border:"1px solid "+(on?meta.color+"50":"#2a2a38"), cursor:"pointer", transition:"all 0.15s" }}>
                <span style={{ fontSize:20 }}>{p.emoji}</span>
                <div style={{ flex:1 }}><div style={{ fontSize:13, color:"#f0eeff", fontWeight:on?600:400 }}>{p.name}</div><div style={{ fontSize:11, color:"#50506a" }}>{p.category} · {p.time||"1h"}</div></div>
                <div style={{ width:20, height:20, borderRadius:"50%", background:on?meta.color:"none", border:"2px solid "+(on?meta.color:"#2a2a38"), display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"#000", flexShrink:0 }}>{on?"✓":""}</div>
              </div>;
            })}
          </div>
          <button onClick={plan} disabled={!sel.length} style={{ width:"100%", padding:"14px", background:sel.length?"#ff3366":"#2a2a38", border:"none", borderRadius:12, color:sel.length?"#fff":"#50506a", fontSize:14, fontWeight:700, cursor:sel.length?"pointer":"default", transition:"all 0.2s" }}>
            Gerar roteiro com IA ({sel.length}/8)
          </button>
        </> : loading ? (
          <div style={{ textAlign:"center", padding:"40px 0" }}>
            <div className="pulsing" style={{ fontSize:36, marginBottom:12 }}>🤖</div>
            <div style={{ fontSize:13, color:"#9090b0" }}>Claude esta montando seu roteiro...</div>
          </div>
        ) : <>
          <div style={{ background:"#0f0f13", borderRadius:12, padding:"14px", marginBottom:14, fontSize:13, color:"#f0eeff", lineHeight:1.7, whiteSpace:"pre-wrap", maxHeight:"55vh", overflowY:"auto" }}>{result}</div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={copy} style={{ flex:1, padding:"12px", background:"#ff3366", border:"none", borderRadius:10, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>Copiar roteiro</button>
            <button onClick={()=>{setStep("select");setResult("");setSel([]);}} style={{ flex:1, padding:"12px", background:"#0f0f13", border:"1px solid #2a2a38", borderRadius:10, color:"#9090b0", fontSize:13, cursor:"pointer" }}>Novo</button>
          </div>
        </>}
      </div>
    </div>
  );
}

function TimelineTab({ places, entries, onSelect }) {
  const visited = places.filter(p=>(entries[p.id]||{}).status==="fui").map(p=>({...p,entry:entries[p.id]})).sort((a,b)=>(b.entry.date||"").localeCompare(a.entry.date||""));
  if (!visited.length) return <div style={{ textAlign:"center", padding:"60px 20px", color:"#50506a" }}><div style={{ fontSize:40, marginBottom:12 }}>📖</div><div style={{ fontSize:14 }}>Nenhum lugar visitado ainda.</div><div style={{ fontSize:12, marginTop:6 }}>Marque lugares como Ja fui para construir sua linha do tempo!</div></div>;
  let lastMonth = "";
  return (
    <div style={{ padding:"0 16px 80px" }}>
      {visited.map((p,i) => {
        const meta = CAT_META[p.category]||{color:"#ff3366"};
        const month = p.entry.date ? p.entry.date.slice(0,7) : "sem-data";
        const showMonth = month!==lastMonth; lastMonth=month;
        const fp = p.entry.photos ? p.entry.photos[0] : null;
        return <div key={p.id} className="fade-up">
          {showMonth && <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:i>0?24:0, marginBottom:14 }}>
            <div style={{ height:1, flex:1, background:"#2a2a38" }} />
            <div style={{ fontSize:11, color:"#50506a", letterSpacing:"0.12em", whiteSpace:"nowrap" }}>{month!=="sem-data" ? new Date(month+"-01").toLocaleDateString("pt-BR",{month:"long",year:"numeric"}).toUpperCase() : "SEM DATA"}</div>
            <div style={{ height:1, flex:1, background:"#2a2a38" }} />
          </div>}
          <div onClick={()=>onSelect(p)} style={{ display:"flex", gap:12, marginBottom:10, background:"#1a1a22", borderRadius:14, padding:"12px", border:"1px solid #2a2a38", cursor:"pointer", transition:"background 0.12s" }} className="card">
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{ width:3, flex:1, background:meta.color+"60", borderRadius:2, minHeight:20 }} />
              <div style={{ width:10, height:10, borderRadius:"50%", background:meta.color, flexShrink:0 }} />
              <div style={{ width:3, flex:1, background:meta.color+"20", borderRadius:2, minHeight:20 }} />
            </div>
            {fp ? <img src={fp} alt="" style={{ width:60, height:60, borderRadius:10, objectFit:"cover", flexShrink:0 }} /> : <div style={{ width:60, height:60, borderRadius:10, background:meta.color+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{p.emoji}</div>}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:14, fontWeight:600, color:"#f0eeff" }}>{p.name}</div>
              <div style={{ fontSize:11, color:"#50506a", marginTop:2 }}>{p.entry.date&&new Date(p.entry.date+"T12:00:00").toLocaleDateString("pt-BR")}{p.entry.who&&" · "+WHO_EMOJI[p.entry.who]+" "+WHO_LABELS[p.entry.who]}</div>
              {p.entry.stars>0 && <div style={{ fontSize:13, color:"#ffd600", marginTop:3 }}>{"★".repeat(p.entry.stars)}</div>}
              {p.entry.thumb && <span style={{ fontSize:14 }}>{p.entry.thumb==="up"?"👍":"👎"}</span>}
              {p.entry.note && <div style={{ fontSize:12, color:"#9090b0", marginTop:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.entry.note}</div>}
            </div>
          </div>
        </div>;
      })}
    </div>
  );
}

function CuradoriaTab({ places, lists, onSaveLists, onSelectPlace }) {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState(""); const [emoji, setEmoji] = useState("📋"); const [desc, setDesc] = useState("");
  const [editingList, setEditingList] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const create = () => {
    if (!name.trim()) return;
    onSaveLists([...lists, { id:"l"+Date.now(), name:name.trim(), emoji, desc:desc.trim(), placeIds:[] }]);
    setName(""); setEmoji("📋"); setDesc(""); setShowCreate(false);
  };

  const del = id => { onSaveLists(lists.filter(l=>l.id!==id)); if(editingList===id) setEditingList(null); };

  const togglePlace = (lid, pid) => onSaveLists(lists.map(l=>l.id===lid?{...l,placeIds:l.placeIds.includes(pid)?l.placeIds.filter(x=>x!==pid):[...l.placeIds,pid]}:l));

  const removeFromList = (lid, pid) => onSaveLists(lists.map(l=>l.id===lid?{...l,placeIds:l.placeIds.filter(x=>x!==pid)}:l));

  const copyShare = (list) => {
    const listPlaces = list.placeIds.map(pid=>places.find(p=>p.id===pid)).filter(Boolean);
    const text = list.emoji+" "+list.name+"\n\n"+listPlaces.map(p=>p.emoji+" "+p.name).join("\n")+"\n\nApp: "+window.location.href;
    navigator.clipboard.writeText(text);
  };

  return (
    <div style={{ padding:"0 16px 80px" }}>
      {!showCreate && <button onClick={()=>setShowCreate(true)} style={{ width:"100%", padding:"12px", background:"#ff336615", border:"1px dashed #ff336650", borderRadius:12, color:"#ff3366", fontSize:14, cursor:"pointer", marginBottom:14, fontFamily:"inherit" }}>+ Criar nova curadoria</button>}
      {showCreate && <div style={{ background:"#1a1a22", border:"1px solid #2a2a38", borderRadius:14, padding:"16px", marginBottom:14 }}>
        <div style={{ display:"flex", gap:10, marginBottom:10 }}>
          <input value={emoji} onChange={e=>setEmoji(e.target.value)} maxLength={2} style={{ width:46, background:"#0f0f13", border:"1px solid #2a2a38", borderRadius:8, padding:"8px", color:"#f0eeff", fontSize:20, textAlign:"center" }} />
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nome da curadoria..." style={{ flex:1, background:"#0f0f13", border:"1px solid #2a2a38", borderRadius:8, padding:"8px 12px", color:"#f0eeff", fontSize:14 }} />
        </div>
        <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Descricao opcional..." style={{ width:"100%", background:"#0f0f13", border:"1px solid #2a2a38", borderRadius:8, padding:"8px 12px", color:"#f0eeff", fontSize:13, marginBottom:10 }} />
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={create} style={{ flex:1, padding:"10px", background:"#ff3366", border:"none", borderRadius:8, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>Criar</button>
          <button onClick={()=>setShowCreate(false)} style={{ flex:1, padding:"10px", background:"#0f0f13", border:"1px solid #2a2a38", borderRadius:8, color:"#9090b0", fontSize:13, cursor:"pointer" }}>Cancelar</button>
        </div>
      </div>}

      {!lists.length && !showCreate && <div style={{ textAlign:"center", padding:"40px 0", color:"#50506a" }}><div style={{ fontSize:32, marginBottom:8 }}>📋</div><div style={{ fontSize:13 }}>Crie curadorias para organizar e compartilhar seus favoritos!</div><div style={{ fontSize:12, marginTop:4 }}>Ex: NYC Romantico, Dia de chuva, Para amigos</div></div>}

      {lists.map(list => {
        const isEditing = editingList===list.id;
        const listPlaces = list.placeIds.map(pid=>places.find(p=>p.id===pid)).filter(Boolean);
        return (
          <div key={list.id} style={{ background:"#1a1a22", border:"1px solid #2a2a38", borderRadius:14, marginBottom:12, overflow:"hidden" }}>
            <div style={{ padding:"14px", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div style={{ flex:1, cursor:"pointer" }} onClick={()=>setEditingList(isEditing?null:list.id)}>
                <div style={{ fontSize:15, fontWeight:600, color:"#f0eeff" }}>{list.emoji} {list.name}</div>
                {list.desc && <div style={{ fontSize:12, color:"#50506a", marginTop:2 }}>{list.desc}</div>}
                <div style={{ fontSize:11, color:"#50506a", marginTop:4 }}>{list.placeIds.length} lugares · toque para {isEditing?"fechar":"editar"}</div>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <button onClick={()=>copyShare(list)} style={{ padding:"5px 10px", background:"#0f0f13", border:"1px solid #2a2a38", borderRadius:8, color:"#9090b0", fontSize:12, cursor:"pointer" }}>↗</button>
                <button onClick={()=>del(list.id)} style={{ padding:"5px 8px", background:"#0f0f13", border:"1px solid #2a2a38", borderRadius:8, color:"#9090b0", fontSize:12, cursor:"pointer" }}>🗑</button>
              </div>
            </div>

            {listPlaces.length>0 && <div style={{ padding:"0 14px 14px" }}>
              <div style={{ fontSize:10, color:"#50506a", letterSpacing:"0.1em", marginBottom:8 }}>LUGARES NA LISTA</div>
              {listPlaces.map((p,idx) => {
                const meta = CAT_META[p.category]||{color:"#ff3366"};
                return <div key={p.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", background:"#0f0f13", border:"1px solid #2a2a38", borderRadius:10, marginBottom:6 }}>
                  <span style={{ fontSize:11, color:"#50506a", width:16, textAlign:"center" }}>{idx+1}</span>
                  <span style={{ fontSize:18 }}>{p.emoji}</span>
                  <div style={{ flex:1, cursor:"pointer" }} onClick={()=>onSelectPlace(p)}>
                    <div style={{ fontSize:13, color:"#f0eeff" }}>{p.name}</div>
                    <div style={{ fontSize:10, color:"#50506a" }}>{p.category}</div>
                  </div>
                  {isEditing && <button onClick={()=>removeFromList(list.id,p.id)} style={{ background:"none", border:"none", color:"#50506a", cursor:"pointer", fontSize:16, padding:"2px 6px" }}>×</button>}
                </div>;
              })}
            </div>}

            {isEditing && <div style={{ borderTop:"1px solid #2a2a38", padding:"12px 14px" }}>
              <div style={{ fontSize:10, color:"#50506a", letterSpacing:"0.1em", marginBottom:8 }}>ADICIONAR LUGARES</div>
              <div style={{ maxHeight:200, overflowY:"auto" }}>
                {places.filter(p=>!list.placeIds.includes(p.id)).map(p => <div key={p.id} onClick={()=>togglePlace(list.id,p.id)} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:"1px solid #2a2a3850", cursor:"pointer" }}>
                  <span style={{ fontSize:16 }}>{p.emoji}</span>
                  <span style={{ fontSize:13, color:"#f0eeff", flex:1 }}>{p.name}</span>
                  <span style={{ fontSize:11, color:"#50506a" }}>{p.category}</span>
                  <span style={{ fontSize:16, color:"#ff3366" }}>+</span>
                </div>)}
              </div>
            </div>}
          </div>
        );
      })}
    </div>
  );
}

function PhotoGallery({ photos, onChange }) {
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const handleAdd = ev => {
    const files=Array.from(ev.target.files); if(!files.length) return;
    setUploading(true); setProgress(0); let loaded=0;
    files.forEach(file => {
      const reader=new FileReader();
      reader.onprogress=e=>{if(e.lengthComputable) setProgress(Math.round((e.loaded/e.total)*100));};
      reader.onload=e=>{onChange(prev=>prev.length<4?[...prev,e.target.result]:prev); loaded++; if(loaded===files.length){setUploading(false);setProgress(0);}};
      reader.readAsDataURL(file);
    });
    ev.target.value="";
  };
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        {photos.map((p,i)=><div key={i} style={{ position:"relative", aspectRatio:"4/3" }}><img src={p} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:10 }} /><button onClick={()=>onChange(prev=>prev.filter((_,j)=>j!==i))} style={{ position:"absolute", top:6, right:6, background:"#000c", border:"none", borderRadius:"50%", width:22, height:22, color:"#fff", cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button></div>)}
        {photos.length<4 && <div onClick={()=>!uploading&&fileRef.current.click()} style={{ aspectRatio:"4/3", background:"#0f0f13", border:"1px dashed #2a2a38", borderRadius:10, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:uploading?"default":"pointer", color:"#50506a", fontSize:12, gap:4, position:"relative", overflow:"hidden" }}>
          {uploading?<><div style={{ fontSize:11, color:"#9090b0" }}>Carregando {progress}%</div><div style={{ position:"absolute", bottom:0, left:0, height:3, width:progress+"%", background:"#ff3366", transition:"width 0.1s" }} /></>:<><span style={{ fontSize:22 }}>+</span><span>Foto {photos.length+1}/4</span></>}
        </div>}
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleAdd} style={{ display:"none" }} />
    </div>
  );
}

function DetailModal({ place, entry, places, entries, onClose, onSave, onDelete, onSelectNearby, addToast }) {
  const e = entry||{};
  const [note, setNote] = useState(e.note||"");
  const [date, setDate] = useState(e.date||new Date().toISOString().split("T")[0]);
  const [photos, setPhotos] = useState(e.photos||(e.photo?[e.photo]:[]));
  const [status, setStatus] = useState(e.status||"quero");
  const [stars, setStars] = useState(e.stars||0);
  const [thumb, setThumb] = useState(e.thumb||null);
  const [vibes, setVibes] = useState(e.vibes||[]);
  const [price, setPrice] = useState(e.price||place.price||null);
  const [who, setWho] = useState(e.who||"juntos");
  const [link, setLink] = useState(e.link||place.link||"");
  const [petFriendly, setPetFriendly] = useState(e.petFriendly!==undefined?e.petFriendly:(place.petFriendly||false));
  const [publicBathroom, setPublicBathroom] = useState(e.publicBathroom!==undefined?e.publicBathroom:(place.publicBathroom||false));
  const [season, setSeason] = useState(e.season||place.season||"sempre");
  const [saving, setSaving] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [showNearby, setShowNearby] = useState(false);
  const meta = CAT_META[place.category]||{color:"#ff3366"};
  const STATUS = { quero:{label:"Quero ir",icon:"♡",sel:"♥",color:"#4da6ff"}, fui:{label:"Ja fui!",icon:"○",sel:"✓",color:"#00e676"}, skip:{label:"Pular",icon:"−",sel:"−",color:"#50506a"} };
  const mapsUrl = "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(place.name+" New York");

  const handleSave = async () => {
    setSaving(true);
    await onSave({ status, note, date, photos, stars, thumb, vibes, price, who, link, petFriendly, publicBathroom, season });
    setSaving(false); addToast("Salvo!", "success");
  };

  const handleDelete = async () => {
    await onDelete(); addToast("Removido!", "success");
  };

  return (
    <>
      <div style={{ position:"fixed", inset:0, background:"#000000f0", zIndex:300, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={onClose}>
        <div className="modal" style={{ background:"#1a1a22", borderTop:"1px solid #2a2a38", borderRadius:"20px 20px 0 0", padding:"20px 16px 48px", maxWidth:560, width:"100%", maxHeight:"94vh", overflowY:"auto" }} onClick={ev=>ev.stopPropagation()}>
          <div style={{ width:36, height:3, background:"#2a2a38", borderRadius:2, margin:"0 auto 16px" }} />

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                <span style={{ fontSize:28 }}>{place.emoji}</span>
                <div>
                  <div style={{ fontSize:17, fontWeight:700, color:"#f0eeff", lineHeight:1.2 }}>{place.name}</div>
                  <div style={{ display:"flex", gap:5, marginTop:4, flexWrap:"wrap" }}>
                    <span style={{ fontSize:11, color:meta.color, background:meta.color+"20", borderRadius:6, padding:"2px 8px" }}>{place.category}</span>
                    {price && <span style={{ fontSize:11, color:"#9090b0", background:"#0f0f13", borderRadius:6, padding:"2px 8px" }}>{PRICE_EMOJI[price]}</span>}
                    {place.time && <span style={{ fontSize:11, color:"#50506a", background:"#0f0f13", borderRadius:6, padding:"2px 8px" }}>⏱ {place.time}</span>}
                    {petFriendly && <span style={{ fontSize:11, color:"#4ade80", background:"#4ade8020", borderRadius:6, padding:"2px 8px" }}>🐾</span>}
                    {publicBathroom && <span style={{ fontSize:11, color:"#60a5fa", background:"#60a5fa20", borderRadius:6, padding:"2px 8px" }}>🚻</span>}
                    {season && season!=="sempre" && <span style={{ fontSize:11, color:"#ffd600", background:"#ffd60015", borderRadius:6, padding:"2px 8px" }}>{SEASON_EMOJI[season]}</span>}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <button onClick={()=>setShowNearby(true)} title="Lugares proximos" style={{ background:"#0f0f13", border:"1px solid #2a2a38", borderRadius:8, width:34, height:34, color:"#9090b0", cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" }}>🗺</button>
              <a href={mapsUrl} target="_blank" rel="noreferrer" style={{ background:"#0f0f13", border:"1px solid #2a2a38", borderRadius:8, width:34, height:34, color:"#9090b0", display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none", fontSize:15 }}>📍</a>
              {link && <a href={link} target="_blank" rel="noreferrer" style={{ background:"#0f0f13", border:"1px solid #2a2a38", borderRadius:8, width:34, height:34, color:"#9090b0", display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none", fontSize:15 }}>🔗</a>}
              <button onClick={onClose} style={{ background:"#0f0f13", border:"1px solid #2a2a38", borderRadius:8, width:34, height:34, color:"#9090b0", cursor:"pointer", fontSize:18 }}>×</button>
            </div>
          </div>

          <div style={{ fontSize:13, color:"#9090b0", lineHeight:1.6, marginBottom:10, padding:"10px 12px", background:"#0f0f13", borderRadius:10, borderLeft:"2px solid "+meta.color }}>{place.desc}</div>
          {place.rep && <div style={{ fontSize:12, color:"#ffd600", lineHeight:1.5, marginBottom:16, padding:"8px 12px", background:"#ffd60010", borderRadius:10, borderLeft:"2px solid #ffd600" }}>⭐ {place.rep}</div>}

          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:10, color:"#50506a", letterSpacing:"0.12em", marginBottom:8 }}>STATUS</div>
            <div style={{ display:"flex", gap:8 }}>
              {Object.entries(STATUS).map(([key,cfg])=><button key={key} onClick={()=>setStatus(key)} style={{ flex:1, padding:"10px 4px", borderRadius:10, background:status===key?cfg.color+"18":"#0f0f13", border:"1px solid "+(status===key?cfg.color+"60":"#2a2a38"), color:status===key?cfg.color:"#50506a", fontSize:14, cursor:"pointer", transition:"all 0.15s" }}><div>{status===key?cfg.sel:cfg.icon}</div><div style={{ fontSize:10, marginTop:3 }}>{cfg.label}</div></button>)}
            </div>
          </div>

          {status==="fui" && <>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:10, color:"#50506a", letterSpacing:"0.12em", marginBottom:8 }}>QUEM FOI?</div>
              <div style={{ display:"flex", gap:8 }}>
                {WHO_OPTIONS.map(w=><button key={w} onClick={()=>setWho(w)} style={{ flex:1, padding:"10px 4px", borderRadius:10, background:who===w?"#ffd60018":"#0f0f13", border:"1px solid "+(who===w?"#ffd60060":"#2a2a38"), color:who===w?"#ffd600":"#50506a", fontSize:13, cursor:"pointer", transition:"all 0.15s" }}><div>{WHO_EMOJI[w]}</div><div style={{ fontSize:10, marginTop:3 }}>{WHO_LABELS[w]}</div></button>)}
              </div>
            </div>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:10, color:"#50506a", letterSpacing:"0.12em", marginBottom:8 }}>QUANDO?</div>
              <input type="date" value={date} onChange={ev=>setDate(ev.target.value)} style={{ width:"100%", background:"#0f0f13", border:"1px solid #2a2a38", borderRadius:10, padding:"10px 14px", color:"#f0eeff", fontSize:14 }} />
            </div>
          </>}

          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:10, color:"#50506a", letterSpacing:"0.12em", marginBottom:8 }}>PRECO</div>
            <div style={{ display:"flex", gap:6 }}>
              {PRICE_LEVELS.map(p=><button key={p} onClick={()=>setPrice(price===p?null:p)} style={{ flex:1, padding:"8px 4px", borderRadius:10, background:price===p?"#ffd60018":"#0f0f13", border:"1px solid "+(price===p?"#ffd60060":"#2a2a38"), color:price===p?"#ffd600":"#50506a", fontSize:13, cursor:"pointer", transition:"all 0.15s" }}>{PRICE_EMOJI[p]}</button>)}
            </div>
          </div>

          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:10, color:"#50506a", letterSpacing:"0.12em", marginBottom:8 }}>MELHOR EPOCA</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {SEASONS.map(s=><button key={s} onClick={()=>setSeason(s)} style={{ padding:"6px 10px", borderRadius:20, background:season===s?"#ffd60018":"#0f0f13", border:"1px solid "+(season===s?"#ffd60060":"#2a2a38"), color:season===s?"#ffd600":"#50506a", fontSize:12, cursor:"pointer", transition:"all 0.15s" }}>{SEASON_EMOJI[s]} {SEASON_LABELS[s]}</button>)}
            </div>
          </div>

          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:10, color:"#50506a", letterSpacing:"0.12em", marginBottom:8 }}>VIBE</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {VIBES.map(v=><button key={v} onClick={()=>setVibes(prev=>prev.includes(v)?prev.filter(x=>x!==v):[...prev,v])} style={{ padding:"6px 12px", borderRadius:20, background:vibes.includes(v)?"#ff336618":"#0f0f13", border:"1px solid "+(vibes.includes(v)?"#ff336660":"#2a2a38"), color:vibes.includes(v)?"#ff3366":"#50506a", fontSize:12, cursor:"pointer", transition:"all 0.15s" }}>{VIBE_EMOJI[v]} {VIBE_LABELS[v]}</button>)}
            </div>
          </div>

          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:10, color:"#50506a", letterSpacing:"0.12em", marginBottom:8 }}>FACILIDADES</div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>setPetFriendly(!petFriendly)} style={{ flex:1, padding:"9px", borderRadius:10, background:petFriendly?"#4ade8018":"#0f0f13", border:"1px solid "+(petFriendly?"#4ade8060":"#2a2a38"), color:petFriendly?"#4ade80":"#50506a", fontSize:12, cursor:"pointer", transition:"all 0.15s" }}>🐾 Pet friendly</button>
              <button onClick={()=>setPublicBathroom(!publicBathroom)} style={{ flex:1, padding:"9px", borderRadius:10, background:publicBathroom?"#60a5fa18":"#0f0f13", border:"1px solid "+(publicBathroom?"#60a5fa60":"#2a2a38"), color:publicBathroom?"#60a5fa":"#50506a", fontSize:12, cursor:"pointer", transition:"all 0.15s" }}>🚻 Banheiro gratis</button>
            </div>
          </div>

          {status==="fui" && <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:10, color:"#50506a", letterSpacing:"0.12em", marginBottom:8 }}>AVALIACAO</div>
            <div style={{ display:"flex", gap:4, marginBottom:10 }}>
              {[1,2,3,4,5].map(n=><span key={n} onClick={()=>setStars(stars===n?0:n)} style={{ fontSize:26, cursor:"pointer", color:n<=stars?"#ffd600":"#50506a", transition:"color 0.1s" }}>★</span>)}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>setThumb(thumb==="up"?null:"up")} style={{ flex:1, padding:"10px", borderRadius:10, background:thumb==="up"?"#00e67620":"#0f0f13", border:"1px solid "+(thumb==="up"?"#00e676":"#2a2a38"), fontSize:20, cursor:"pointer", transition:"all 0.15s" }}>👍</button>
              <button onClick={()=>setThumb(thumb==="down"?null:"down")} style={{ flex:1, padding:"10px", borderRadius:10, background:thumb==="down"?"#ff336620":"#0f0f13", border:"1px solid "+(thumb==="down"?"#ff3366":"#2a2a38"), fontSize:20, cursor:"pointer", transition:"all 0.15s" }}>👎</button>
            </div>
          </div>}

          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:10, color:"#50506a", letterSpacing:"0.12em", marginBottom:8 }}>{status==="fui"?"COMO FOI?":"NOTAS"}</div>
            <textarea value={note} onChange={ev=>setNote(ev.target.value)} placeholder={status==="fui"?"Adoramos! A fila valeu...":"Lembrete, dica, horario..."} rows={3} style={{ width:"100%", background:"#0f0f13", border:"1px solid #2a2a38", borderRadius:10, padding:"10px 14px", color:"#f0eeff", fontSize:14, resize:"none" }} />
          </div>

          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:10, color:"#50506a", letterSpacing:"0.12em", marginBottom:8 }}>LINK (ingresso, evento, site)</div>
            <input value={link} onChange={ev=>setLink(ev.target.value)} placeholder="https://..." style={{ width:"100%", background:"#0f0f13", border:"1px solid #2a2a38", borderRadius:10, padding:"10px 14px", color:"#f0eeff", fontSize:13 }} />
          </div>

          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:10, color:"#50506a", letterSpacing:"0.12em", marginBottom:8 }}>FOTOS (ate 4)</div>
            <PhotoGallery photos={photos} onChange={setPhotos} />
          </div>

          <button onClick={handleSave} disabled={saving} style={{ width:"100%", padding:"14px", background:saving?"#2a2a38":"#ff3366", border:"none", borderRadius:12, color:saving?"#50506a":"#fff", fontSize:14, fontWeight:700, cursor:saving?"default":"pointer", marginBottom:10, transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            {saving?<><span className="pulsing">●</span> Salvando...</>:"Salvar"}
          </button>

          {place.custom && (confirmDel ?
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>setConfirmDel(false)} style={{ flex:1, padding:"11px", background:"#0f0f13", border:"1px solid #2a2a38", borderRadius:10, color:"#9090b0", fontSize:13, cursor:"pointer" }}>Cancelar</button>
              <button onClick={handleDelete} style={{ flex:1, padding:"11px", background:"#4a0000", border:"1px solid #883333", borderRadius:10, color:"#ff8888", fontSize:13, cursor:"pointer" }}>Confirmar</button>
            </div> :
            <button onClick={()=>setConfirmDel(true)} style={{ width:"100%", padding:"11px", background:"none", border:"1px solid #2a2a38", borderRadius:10, color:"#50506a", fontSize:13, cursor:"pointer" }}>Remover lugar</button>
          )}
        </div>
      </div>
      {showNearby && <NearbyModal place={place} places={places} entries={entries} onSelect={p=>{setShowNearby(false);onClose();setTimeout(()=>onSelectNearby(p),150);}} onClose={()=>setShowNearby(false)} />}
    </>
  );
}

function AddModal({ onClose, onAdd, addToast }) {
  const [name,setName]=useState(""); const [desc,setDesc]=useState(""); const [emoji,setEmoji]=useState("📍");
  const [category,setCategory]=useState(CATEGORIES[0]); const [price,setPrice]=useState("$"); const [time,setTime]=useState("2h"); const [link,setLink]=useState("");
  const [saving,setSaving]=useState(false);
  const handle = async () => {
    if (!name.trim()) return; setSaving(true);
    await onAdd({ id:"u"+Date.now(), name:name.trim(), desc:desc.trim(), emoji, category, price, time, link, custom:true, season:"sempre" });
    addToast(name+" adicionado!", "success"); setSaving(false); onClose();
  };
  return (
    <div style={{ position:"fixed", inset:0, background:"#000000f0", zIndex:300, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={onClose}>
      <div className="modal" style={{ background:"#1a1a22", borderTop:"1px solid #2a2a38", borderRadius:"20px 20px 0 0", padding:"20px 16px 48px", maxWidth:560, width:"100%", maxHeight:"85vh", overflowY:"auto" }} onClick={ev=>ev.stopPropagation()}>
        <div style={{ width:36, height:3, background:"#2a2a38", borderRadius:2, margin:"0 auto 16px" }} />
        <div style={{ fontSize:15, fontWeight:700, color:"#f0eeff", marginBottom:16 }}>Novo lugar</div>
        <div style={{ display:"flex", gap:10, marginBottom:12 }}>
          <input value={emoji} onChange={ev=>setEmoji(ev.target.value)} maxLength={2} style={{ width:50, background:"#0f0f13", border:"1px solid #2a2a38", borderRadius:8, padding:"8px", color:"#f0eeff", fontSize:22, textAlign:"center" }} />
          <input value={name} onChange={ev=>setName(ev.target.value)} placeholder="Nome do lugar..." style={{ flex:1, background:"#0f0f13", border:"1px solid #2a2a38", borderRadius:8, padding:"8px 12px", color:"#f0eeff", fontSize:14 }} />
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:12 }}>
          <select value={category} onChange={ev=>setCategory(ev.target.value)} style={{ flex:1, background:"#1a1a22", border:"1px solid #2a2a38", borderRadius:8, padding:"8px 10px", color:"#f0eeff", fontSize:13 }}>
            {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          <div style={{ display:"flex", gap:4 }}>
            {PRICE_LEVELS.map(p=><button key={p} onClick={()=>setPrice(p)} style={{ padding:"8px", borderRadius:8, background:price===p?"#ff336620":"#0f0f13", border:"1px solid "+(price===p?"#ff3366":"#2a2a38"), color:price===p?"#ff3366":"#50506a", fontSize:12, cursor:"pointer" }}>{PRICE_EMOJI[p]}</button>)}
          </div>
        </div>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:12 }}>
          {TIME_OPTIONS.map(t=><button key={t} onClick={()=>setTime(t)} style={{ padding:"5px 10px", borderRadius:20, background:time===t?"#ff336620":"#0f0f13", border:"1px solid "+(time===t?"#ff3366":"#2a2a38"), color:time===t?"#ff3366":"#50506a", fontSize:11, cursor:"pointer" }}>{t}</button>)}
        </div>
        <textarea value={desc} onChange={ev=>setDesc(ev.target.value)} placeholder="Descricao..." rows={2} style={{ width:"100%", background:"#0f0f13", border:"1px solid #2a2a38", borderRadius:8, padding:"8px 12px", color:"#f0eeff", fontSize:13, resize:"none", marginBottom:10 }} />
        <input value={link} onChange={ev=>setLink(ev.target.value)} placeholder="Link (opcional)..." style={{ width:"100%", background:"#0f0f13", border:"1px solid #2a2a38", borderRadius:8, padding:"8px 12px", color:"#f0eeff", fontSize:13, marginBottom:14 }} />
        <button onClick={handle} disabled={saving} style={{ width:"100%", padding:"13px", background:saving?"#2a2a38":"#ff3366", border:"none", borderRadius:10, color:saving?"#50506a":"#fff", fontSize:14, fontWeight:700, cursor:saving?"default":"pointer" }}>{saving?"Adicionando...":"Adicionar"}</button>
      </div>
    </div>
  );
}

function ShareModal({ places, entries, onClose, addToast }) {
  const recs=places.filter(p=>{const e=entries[p.id]||{};return e.thumb==="up"||(e.stars&&e.stars>=4);});
  const url=window.location.href;
  const text="Nossos favoritos em NYC 🗽\n\n"+recs.map(p=>{const e=entries[p.id]||{};return p.emoji+" "+p.name+(e.stars?" "+"★".repeat(e.stars):"");}).join("\n")+"\n\n"+url;
  const copy=t=>{navigator.clipboard.writeText(t);addToast("Copiado!","success");};
  return (
    <div style={{ position:"fixed", inset:0, background:"#000000f0", zIndex:300, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={onClose}>
      <div className="modal" style={{ background:"#1a1a22", borderTop:"1px solid #2a2a38", borderRadius:"20px 20px 0 0", padding:"20px 16px 40px", maxWidth:560, width:"100%", maxHeight:"80vh", overflowY:"auto" }} onClick={ev=>ev.stopPropagation()}>
        <div style={{ width:36, height:3, background:"#2a2a38", borderRadius:2, margin:"0 auto 16px" }} />
        <div style={{ fontSize:15, fontWeight:700, color:"#f0eeff", marginBottom:6 }}>Compartilhar</div>
        <div style={{ fontSize:12, color:"#9090b0", marginBottom:14 }}>{recs.length} lugares com 👍 ou 4+ estrelas</div>
        {!recs.length?<div style={{ color:"#50506a", fontSize:13, textAlign:"center", padding:"20px 0" }}>Avalie lugares primeiro!</div>:<>
          <div style={{ background:"#0f0f13", borderRadius:10, padding:"12px", marginBottom:14, maxHeight:160, overflowY:"auto" }}>
            {recs.map(p=>{const e=entries[p.id]||{};return <div key={p.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 0", borderBottom:"1px solid #2a2a38" }}><span style={{ fontSize:16 }}>{p.emoji}</span><div style={{ flex:1 }}><div style={{ fontSize:13, color:"#f0eeff" }}>{p.name}</div><div style={{ fontSize:11, color:"#50506a" }}>{e.stars>0&&"★".repeat(e.stars)} {e.thumb==="up"?"👍":""}</div></div></div>;})}
          </div>
          <button onClick={()=>copy(text)} style={{ width:"100%", padding:"13px", background:"#ff3366", border:"none", borderRadius:10, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", marginBottom:8 }}>Copiar lista pra WhatsApp</button>
          <button onClick={()=>copy(url)} style={{ width:"100%", padding:"13px", background:"#0f0f13", border:"1px solid #2a2a38", borderRadius:10, color:"#f0eeff", fontSize:13, cursor:"pointer" }}>Copiar link do app</button>
        </>}
      </div>
    </div>
  );
}

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
  const [filterPet, setFilterPet] = useState(false);
  const [filterBathroom, setFilterBathroom] = useState(false);
  const [filterSeason, setFilterSeason] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [selected, setSelected] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showPlanner, setShowPlanner] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showNearby, setShowNearby] = useState(false);
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [placeOfDay, setPlaceOfDay] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => { injectCSS(); }, []);

  const addToast = (message, type="success") => {
    const id = Date.now();
    setToasts(prev=>[...prev,{id,message,type}]);
    setTimeout(()=>setToasts(prev=>prev.filter(t=>t.id!==id)),3000);
  };

  useEffect(() => {
    const u1=onValue(ref(db,"entries"),snap=>{if(snap.val())setEntries(snap.val());setLoading(false);});
    const u2=onValue(ref(db,"customPlaces"),snap=>{if(snap.val()){const c=Object.values(snap.val());setPlaces(prev=>{const ids=new Set(prev.map(p=>p.id));return[...prev,...c.filter(p=>!ids.has(p.id))];});}});
    const u3=onValue(ref(db,"lists"),snap=>{if(snap.val())setLists(Object.values(snap.val()));});
    setTimeout(()=>setLoading(false),3000);
    return()=>{u1();u2();u3();};
  }, []);

  useEffect(() => {
    if (!places.length) return;
    const candidates=places.filter(p=>{const e=entries[p.id];return !e||!e.status||e.status==="quero";});
    if (!candidates.length) return;
    const seed=new Date().toDateString(); let h=0;
    for(let i=0;i<seed.length;i++) h=((h<<5)-h)+seed.charCodeAt(i);
    setPlaceOfDay(candidates[Math.abs(h)%candidates.length]);
  }, [places, entries]);

  const handleSave = async (placeId, data) => {
    setSyncing(true);
    setEntries(prev=>({...prev,[placeId]:data}));
    await set(ref(db,"entries/"+placeId),data);
    setSyncing(false);
  };

  const handleAdd = async place => {
    setPlaces(prev=>[...prev,place]);
    await set(ref(db,"customPlaces/"+place.id),place);
  };

  const handleDelete = async placeId => {
    setPlaces(prev=>prev.filter(p=>p.id!==placeId));
    const ne={...entries}; delete ne[placeId]; setEntries(ne);
    try {
      await remove(ref(db,"customPlaces/"+placeId));
      await remove(ref(db,"entries/"+placeId));
    } catch(err) { console.error("Delete error:", err); }
    setSelected(null);
  };

  const saveLists = async newLists => {
    setLists(newLists);
    const obj={}; newLists.forEach(l=>{obj[l.id]=l;});
    await set(ref(db,"lists"),obj);
  };

  const getSurprise = () => {
    const c=places.filter(p=>{const e=entries[p.id];return !e||!e.status||e.status==="quero";});
    if(c.length){setSelected(c[Math.floor(Math.random()*c.length)]);addToast("Lugar sorteado!","info");}
  };

  const handleNearby = () => {
    navigator.geolocation.getCurrentPosition(pos=>{
      setUserLat(pos.coords.latitude); setUserLng(pos.coords.longitude); setShowNearby(true);
    }, ()=>addToast("Nao foi possivel obter sua localizacao","error"));
  };

  const activeFiltersCount = [filterVibe,filterPrice,filterStars>0,filterThumb,filterPet,filterBathroom,filterSeason].filter(Boolean).length;

  const filteredPlaces = places.filter(p=>{
    const entry=entries[p.id]||{};
    const sl=search.toLowerCase();
    const searchOk=!search||p.name.toLowerCase().includes(sl)||(p.desc||"").toLowerCase().includes(sl)||p.category.toLowerCase().includes(sl);
    const catOk=activeCategory==="Todos"||p.category===activeCategory;
    const status=entry.status;
    const statusOk=activeFilter==="todos"?true:activeFilter==="quero"?(!status||status==="quero"):activeFilter==="fui"?status==="fui":status==="skip";
    const vibeOk=!filterVibe||(entry.vibes&&entry.vibes.includes(filterVibe));
    const priceOk=!filterPrice||(entry.price||p.price)===filterPrice;
    const starsOk=filterStars===0||(entry.stars&&entry.stars>=filterStars);
    const thumbOk=!filterThumb||entry.thumb===filterThumb;
    const petOk=!filterPet||(entry.petFriendly!==undefined?entry.petFriendly:p.petFriendly);
    const bathOk=!filterBathroom||(entry.publicBathroom!==undefined?entry.publicBathroom:p.publicBathroom);
    const seasonOk=!filterSeason||(entry.season||p.season)===filterSeason;
    return searchOk&&catOk&&statusOk&&vibeOk&&priceOk&&starsOk&&thumbOk&&petOk&&bathOk&&seasonOk;
  }).sort((a,b)=>{
    if(sortBy==="az") return a.name.localeCompare(b.name);
    if(sortBy==="za") return b.name.localeCompare(a.name);
    if(sortBy==="stars") return((entries[b.id]||{}).stars||0)-((entries[a.id]||{}).stars||0);
    if(sortBy==="pending"){const sa=(entries[a.id]||{}).status;const sb=(entries[b.id]||{}).status;return(!sa?-1:!sb?1:0);}
    if(sortBy==="date"){const da=(entries[a.id]||{}).date||"";const db2=(entries[b.id]||{}).date||"";return db2.localeCompare(da);}
    if(sortBy==="cat") return a.category.localeCompare(b.category);
    return 0;
  });

  const total=places.length;
  const visited=Object.values(entries).filter(e=>e.status==="fui").length;
  const pct=Math.round((visited/total)*100);
  const TABS=[["list","Lista"],["map","Mapa"],["timeline","Linha do Tempo"],["curadoria","Curadoria"]];

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#0f0f13", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center" }}><div style={{ fontSize:48, marginBottom:12 }}>🗽</div><div className="pulsing" style={{ fontSize:11, color:"#50506a", letterSpacing:"0.2em" }}>NYC BUCKET LIST</div></div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#0f0f13", color:"#f0eeff", fontFamily:"'Inter', system-ui, sans-serif" }}>
      {toasts.map(t=><Toast key={t.id} message={t.message} type={t.type} onDone={()=>setToasts(prev=>prev.filter(x=>x.id!==t.id))} />)}

      <div style={{ background:"#0f0f13f8", backdropFilter:"blur(12px)", borderBottom:"1px solid #2a2a38", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ maxWidth:600, margin:"0 auto", padding:"14px 16px 0" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div onClick={()=>window.location.reload()} style={{ cursor:"pointer" }}>
              <div style={{ fontSize:11, color:"#50506a", letterSpacing:"0.18em", marginBottom:1 }}>GUI & GABRIEL {syncing&&<span className="pulsing" style={{ color:"#ff3366" }}>· SALVANDO</span>}</div>
              <div style={{ fontSize:22, fontWeight:800, letterSpacing:"-0.02em", background:"linear-gradient(90deg,#ff3366,#ff6b35,#ffd600)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>NYC Bucket List 🗽</div>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <button onClick={getSurprise} title="Sorteie um lugar!" style={{ background:"#1a1a22", border:"1px solid #2a2a38", borderRadius:10, width:36, height:36, color:"#9090b0", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>🎲</button>
              <button onClick={handleNearby} title="Lugares proximos" style={{ background:"#1a1a22", border:"1px solid #2a2a38", borderRadius:10, width:36, height:36, color:"#9090b0", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>📍</button>
              <button onClick={()=>setShowChat(true)} title="Chat IA" style={{ background:"#1a1a22", border:"1px solid #2a2a38", borderRadius:10, width:36, height:36, color:"#9090b0", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>🤖</button>
              <button onClick={()=>setShowPlanner(true)} style={{ background:"#1a1a22", border:"1px solid #2a2a38", borderRadius:10, width:36, height:36, color:"#9090b0", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>🗓️</button>
              <button onClick={()=>setShowShare(true)} style={{ background:"#1a1a22", border:"1px solid #2a2a38", borderRadius:10, width:36, height:36, color:"#9090b0", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>↗</button>
            </div>
          </div>

          <div style={{ background:"#1a1a22", border:"1px solid #2a2a38", borderRadius:12, padding:"10px 14px", marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <div style={{ fontSize:11, color:"#50506a", letterSpacing:"0.08em" }}>NYC EXPLORADA</div>
              <div style={{ fontSize:13, fontWeight:700, color:"#ff3366" }}>{pct}% · {filteredPlaces.length} de {total} lugares</div>
            </div>
            <div style={{ height:4, background:"#2a2a38", borderRadius:2 }}>
              <div style={{ height:"100%", width:pct+"%", background:"linear-gradient(90deg,#ff3366,#ff6b35,#ffd600)", borderRadius:2, transition:"width 0.6s ease" }} />
            </div>
            <div style={{ display:"flex", gap:14, marginTop:6 }}>
              <span style={{ fontSize:11, color:"#00e676" }}>✓ {visited} visitados</span>
              <span style={{ fontSize:11, color:"#50506a" }}>{total-visited} na lista</span>
            </div>
          </div>

          <div style={{ display:"flex", gap:0, background:"#1a1a22", borderRadius:10, padding:3, border:"1px solid #2a2a38", marginBottom:10 }}>
            {TABS.map(([key,label])=><button key={key} onClick={()=>setTab(key)} style={{ flex:1, padding:"7px 4px", borderRadius:8, background:tab===key?"#ff3366":"none", border:"none", color:tab===key?"#fff":"#50506a", fontSize:11, cursor:"pointer", fontWeight:tab===key?600:400, transition:"all 0.15s" }}>{label}</button>)}
          </div>

          {tab==="list" && <>
            <div style={{ position:"relative", marginBottom:8 }}>
              <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"#50506a", fontSize:13 }}>🔍</span>
              <input value={search} onChange={ev=>setSearch(ev.target.value)} placeholder="Buscar lugares, categorias..." style={{ width:"100%", background:"#1a1a22", border:"1px solid #2a2a38", borderRadius:10, padding:"9px 34px 9px 34px", color:"#f0eeff", fontSize:13 }} />
              {search&&<button onClick={()=>setSearch("")} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#50506a", cursor:"pointer", fontSize:16 }}>×</button>}
            </div>
            <div style={{ display:"flex", gap:5, marginBottom:8, overflowX:"auto", scrollbarWidth:"none" }}>
              {[["todos","Todos"],["quero","♥ Quero"],["fui","✓ Fui"],["skip","− Skip"]].map(([key,label])=><button key={key} onClick={()=>setActiveFilter(activeFilter===key&&key!=="todos"?"todos":key)} className="btn" style={{ padding:"5px 12px", borderRadius:20, background:activeFilter===key?"#ff3366":"#1a1a22", border:"1px solid "+(activeFilter===key?"#ff3366":"#2a2a38"), color:activeFilter===key?"#fff":"#50506a", fontSize:12, whiteSpace:"nowrap" }}>{label}</button>)}
              <button onClick={()=>setShowFilters(!showFilters)} className="btn" style={{ padding:"5px 12px", borderRadius:20, background:activeFiltersCount>0?"#ffd60020":"#1a1a22", border:"1px solid "+(activeFiltersCount>0?"#ffd600":"#2a2a38"), color:activeFiltersCount>0?"#ffd600":"#50506a", fontSize:12, whiteSpace:"nowrap" }}>{activeFiltersCount>0?"Filtros ("+activeFiltersCount+")":"Filtros"}</button>
              <select value={sortBy} onChange={ev=>setSortBy(ev.target.value)} style={{ background:"#1a1a22", border:"1px solid #2a2a38", borderRadius:20, padding:"5px 10px", color:"#50506a", fontSize:12 }}>
                <option value="default">Padrao</option><option value="az">A Z</option><option value="za">Z A</option><option value="stars">Nota</option><option value="pending">Pendentes</option><option value="date">Data</option><option value="cat">Categoria</option>
              </select>
            </div>

            {showFilters && <div style={{ background:"#1a1a22", border:"1px solid #2a2a38", borderRadius:12, padding:"12px", marginBottom:8 }}>
              <div style={{ marginBottom:10 }}><div style={{ fontSize:10, color:"#50506a", letterSpacing:"0.12em", marginBottom:6 }}>VIBE</div><div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>{VIBES.map(v=><button key={v} onClick={()=>setFilterVibe(filterVibe===v?null:v)} className="btn" style={{ padding:"4px 10px", borderRadius:20, background:filterVibe===v?"#ff336620":"#0f0f13", border:"1px solid "+(filterVibe===v?"#ff3366":"#2a2a38"), color:filterVibe===v?"#ff3366":"#50506a", fontSize:11 }}>{VIBE_EMOJI[v]} {VIBE_LABELS[v]}</button>)}</div></div>
              <div style={{ marginBottom:10 }}><div style={{ fontSize:10, color:"#50506a", letterSpacing:"0.12em", marginBottom:6 }}>PRECO</div><div style={{ display:"flex", gap:5 }}>{PRICE_LEVELS.map(p=><button key={p} onClick={()=>setFilterPrice(filterPrice===p?null:p)} className="btn" style={{ flex:1, padding:"6px", borderRadius:8, background:filterPrice===p?"#ffd60020":"#0f0f13", border:"1px solid "+(filterPrice===p?"#ffd600":"#2a2a38"), color:filterPrice===p?"#ffd600":"#50506a", fontSize:12 }}>{PRICE_EMOJI[p]}</button>)}</div></div>
              <div style={{ marginBottom:10 }}><div style={{ fontSize:10, color:"#50506a", letterSpacing:"0.12em", marginBottom:6 }}>MELHOR EPOCA</div><div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>{SEASONS.map(s=><button key={s} onClick={()=>setFilterSeason(filterSeason===s?null:s)} className="btn" style={{ padding:"5px 10px", borderRadius:20, background:filterSeason===s?"#ffd60020":"#0f0f13", border:"1px solid "+(filterSeason===s?"#ffd600":"#2a2a38"), color:filterSeason===s?"#ffd600":"#50506a", fontSize:11 }}>{SEASON_EMOJI[s]} {SEASON_LABELS[s]}</button>)}</div></div>
              <div style={{ marginBottom:10 }}><div style={{ fontSize:10, color:"#50506a", letterSpacing:"0.12em", marginBottom:6 }}>NOTA MINIMA</div><div style={{ display:"flex", gap:4 }}>{[1,2,3,4,5].map(n=><span key={n} onClick={()=>setFilterStars(filterStars===n?0:n)} style={{ fontSize:22, cursor:"pointer", color:n<=filterStars?"#ffd600":"#50506a" }}>★</span>)}</div></div>
              <div style={{ marginBottom:10 }}><div style={{ fontSize:10, color:"#50506a", letterSpacing:"0.12em", marginBottom:6 }}>POLEGAR</div><div style={{ display:"flex", gap:6 }}>{[["up","👍 Recomendados"],["down","👎 Nao curtiram"]].map(([key,label])=><button key={key} onClick={()=>setFilterThumb(filterThumb===key?null:key)} className="btn" style={{ flex:1, padding:"7px", borderRadius:8, background:filterThumb===key?"#ff336620":"#0f0f13", border:"1px solid "+(filterThumb===key?"#ff3366":"#2a2a38"), color:filterThumb===key?"#ff3366":"#50506a", fontSize:12 }}>{label}</button>)}</div></div>
              <div style={{ marginBottom:activeFiltersCount>0?10:0 }}><div style={{ fontSize:10, color:"#50506a", letterSpacing:"0.12em", marginBottom:6 }}>FACILIDADES</div><div style={{ display:"flex", gap:6 }}><button onClick={()=>setFilterPet(!filterPet)} className="btn" style={{ flex:1, padding:"7px", borderRadius:8, background:filterPet?"#4ade8020":"#0f0f13", border:"1px solid "+(filterPet?"#4ade80":"#2a2a38"), color:filterPet?"#4ade80":"#50506a", fontSize:12 }}>🐾 Pet friendly</button><button onClick={()=>setFilterBathroom(!filterBathroom)} className="btn" style={{ flex:1, padding:"7px", borderRadius:8, background:filterBathroom?"#60a5fa20":"#0f0f13", border:"1px solid "+(filterBathroom?"#60a5fa":"#2a2a38"), color:filterBathroom?"#60a5fa":"#50506a", fontSize:12 }}>🚻 Banheiro</button></div></div>
              {activeFiltersCount>0&&<button onClick={()=>{setFilterVibe(null);setFilterPrice(null);setFilterStars(0);setFilterThumb(null);setFilterPet(false);setFilterBathroom(false);setFilterSeason(null);}} style={{ width:"100%", padding:"7px", background:"none", border:"1px solid #2a2a38", borderRadius:8, color:"#50506a", fontSize:12, cursor:"pointer" }}>Limpar filtros</button>}
            </div>}

            <div style={{ display:"flex", gap:5, overflowX:"auto", scrollbarWidth:"none", paddingBottom:10 }}>
              {["Todos",...CATEGORIES].map(cat=>{const meta=CAT_META[cat];const active=activeCategory===cat;return <button key={cat} onClick={()=>setActiveCategory(activeCategory===cat&&cat!=="Todos"?"Todos":cat)} className="btn" style={{ padding:"4px 10px", borderRadius:20, background:active?(meta?meta.color:"#ff3366")+"20":"#1a1a22", border:"1px solid "+(active?(meta?meta.color:"#ff3366")+"60":"#2a2a38"), color:active?(meta?meta.color:"#ff3366"):"#50506a", fontSize:10, whiteSpace:"nowrap", letterSpacing:"0.04em" }}>{cat}</button>;})}
            </div>
          </>}
        </div>
      </div>

      <div style={{ maxWidth:600, margin:"0 auto", padding:"10px 16px 100px" }}>
        {tab==="map"&&<MapTab places={filteredPlaces} entries={entries} onSelect={setSelected} />}
        {tab==="timeline"&&<TimelineTab places={places} entries={entries} onSelect={setSelected} />}
        {tab==="curadoria"&&<CuradoriaTab places={places} lists={lists} onSaveLists={saveLists} onSelectPlace={setSelected} />}

        {tab==="list"&&<>
          <WeatherWidget />
          {placeOfDay&&!search&&activeFilter==="todos"&&activeCategory==="Todos"&&(
            <div onClick={()=>setSelected(placeOfDay)} style={{ background:"linear-gradient(135deg,#1a0008,#0a001a,#001a08)", border:"1px solid #2a2a38", borderRadius:14, padding:"14px 16px", marginBottom:10, cursor:"pointer", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,#ff3366,#ff6b35,#ffd600)" }} />
              <div style={{ fontSize:10, color:"#50506a", letterSpacing:"0.15em", marginBottom:8 }}>LUGAR DO DIA 🎲</div>
              <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                <div style={{ fontSize:32 }}>{placeOfDay.emoji}</div>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:"#f0eeff" }}>{placeOfDay.name}</div>
                  <div style={{ fontSize:12, color:"#9090b0", marginTop:2 }}>{placeOfDay.category} · {PRICE_EMOJI[placeOfDay.price]||"?"} · {placeOfDay.time||"?"}</div>
                </div>
              </div>
            </div>
          )}

          {!filteredPlaces.length&&<div style={{ textAlign:"center", color:"#50506a", padding:"60px 0" }}><div style={{ fontSize:32, marginBottom:8 }}>🔍</div><div style={{ fontSize:14 }}>Nenhum lugar encontrado</div></div>}

          {filteredPlaces.map(place=>{
            const entry=entries[place.id]||{};
            const status=entry.status;
            const meta=CAT_META[place.category]||{color:"#ff3366"};
            const displayPrice=entry.price||place.price;
            const fp=entry.photos?entry.photos[0]:null;
            const pc=entry.photos?entry.photos.length:0;
            const isPet=entry.petFriendly!==undefined?entry.petFriendly:place.petFriendly;
            const hasBath=entry.publicBathroom!==undefined?entry.publicBathroom:place.publicBathroom;
            const hasLink=entry.link||place.link;
            const placeSeason=entry.season||place.season;
            return (
              <div key={place.id} style={{ position:"relative" }}>
                <div className="card" onClick={()=>setSelected(place)} style={{ background:"#1a1a22", border:"1px solid "+(status==="fui"?meta.color+"40":"#2a2a38"), borderRadius:12, marginBottom:8, padding:"12px 14px", cursor:"pointer", opacity:status==="skip"?0.3:1, display:"flex", gap:12 }}>
                  {fp?<img src={fp} alt="" style={{ width:54, height:54, borderRadius:8, objectFit:"cover", flexShrink:0 }} />:<div style={{ width:54, height:54, borderRadius:8, background:meta.color+"18", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{place.emoji}</div>}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8 }}>
                      <div style={{ fontSize:14, fontWeight:600, color:"#f0eeff", lineHeight:1.3 }}>{place.name}</div>
                      <div style={{ display:"flex", alignItems:"center", gap:4, flexShrink:0 }}>
                        {hasLink&&<span style={{ fontSize:10 }}>🔗</span>}
                        {isPet&&<span style={{ fontSize:10 }}>🐾</span>}
                        {hasBath&&<span style={{ fontSize:10 }}>🚻</span>}
                        {entry.thumb==="up"&&<span style={{ fontSize:12 }}>👍</span>}
                        {entry.thumb==="down"&&<span style={{ fontSize:12 }}>👎</span>}
                        {entry.stars>0&&<span style={{ fontSize:10, color:"#ffd600" }}>{"★".repeat(entry.stars)}</span>}
                        {pc>0&&<span style={{ fontSize:10, color:"#50506a" }}>📷{pc>1?pc:""}</span>}
                        <span style={{ fontSize:15, color:status==="fui"?meta.color:status==="quero"?"#4da6ff":"#50506a" }}>{status==="fui"?"✓":status==="quero"?"♥":status==="skip"?"−":"○"}</span>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:4, alignItems:"center", marginTop:4, flexWrap:"wrap" }}>
                      <span style={{ fontSize:10, color:meta.color, background:meta.color+"18", borderRadius:5, padding:"1px 6px" }}>{place.category}</span>
                      {displayPrice&&<span style={{ fontSize:10, color:"#50506a" }}>{PRICE_EMOJI[displayPrice]}</span>}
                      {place.time&&<span style={{ fontSize:10, color:"#50506a" }}>⏱ {place.time}</span>}
                      {placeSeason&&placeSeason!=="sempre"&&<span style={{ fontSize:10, color:"#ffd600" }}>{SEASON_EMOJI[placeSeason]}</span>}
                      {entry.who&&entry.who!=="juntos"&&<span style={{ fontSize:10 }}>{WHO_EMOJI[entry.who]}</span>}
                      {entry.vibes&&entry.vibes.map(v=><span key={v} style={{ fontSize:10 }}>{VIBE_EMOJI[v]}</span>)}
                    </div>
                    {entry.note&&<div style={{ fontSize:11, color:"#9090b0", marginTop:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{entry.note}</div>}
                    {status==="fui"&&entry.date&&<div style={{ fontSize:10, color:"#50506a", marginTop:2 }}>{new Date(entry.date+"T12:00:00").toLocaleDateString("pt-BR")}</div>}
                  </div>
                </div>
                {status!=="fui"&&<button onClick={e=>{e.stopPropagation();setCheckIn(place);}} title="Check-in rapido" style={{ position:"absolute", bottom:16, right:12, background:"#00e67615", border:"1px solid #00e67640", borderRadius:8, padding:"3px 8px", color:"#00e676", fontSize:10, cursor:"pointer", fontFamily:"inherit" }}>✓ check-in</button>}
              </div>
            );
          })}
        </>}
      </div>

      <button onClick={()=>setShowAdd(true)} style={{ position:"fixed", bottom:24, right:20, width:52, height:52, background:"#ff3366", border:"none", borderRadius:"50%", color:"#fff", fontSize:24, cursor:"pointer", boxShadow:"0 4px 20px #ff336660", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>+</button>

      {selected&&<DetailModal place={selected} entry={entries[selected.id]} places={places} entries={entries} onClose={()=>setSelected(null)} onSave={async data=>{await handleSave(selected.id,data);}} onDelete={()=>handleDelete(selected.id)} onSelectNearby={setSelected} addToast={addToast} />}
      {checkIn&&<CheckInModal place={checkIn} onClose={()=>setCheckIn(null)} onSave={async data=>{await handleSave(checkIn.id,data);}} addToast={addToast} />}
      {showAdd&&<AddModal onClose={()=>setShowAdd(false)} onAdd={handleAdd} addToast={addToast} />}
      {showShare&&<ShareModal places={places} entries={entries} onClose={()=>setShowShare(false)} addToast={addToast} />}
      {showPlanner&&<PlannerModal places={places} entries={entries} onClose={()=>setShowPlanner(false)} addToast={addToast} />}
      {showChat&&<AIChatModal places={places} entries={entries} onClose={()=>setShowChat(false)} />}
      {showNearby&&userLat&&<NearbyDrawer userLat={userLat} userLng={userLng} places={places} entries={entries} onSelect={setSelected} onClose={()=>setShowNearby(false)} />}
    </div>
  );
}
