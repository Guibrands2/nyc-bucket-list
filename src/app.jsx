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
const VIBE_LABELS = { romantico: "Romantico", amigos: "Amigos", familia: "Familia", solo: "Solo" };
const VIBE_EMOJI = { romantico: "💑", amigos: "👯", familia: "👨‍👩‍👧", solo: "🧘" };
const PRICE_LEVELS = ["gratis", "$", "$$", "$$$"];
const PRICE_LABELS = { gratis: "Gratis", "$": "Barato", "$$": "Medio", "$$$": "Caro" };
const PRICE_EMOJI = { gratis: "🆓", "$": "$", "$$": "$$", "$$$": "$$$" };
const WHO_OPTIONS = ["gui", "gabriel", "juntos"];
const WHO_LABELS = { gui: "Gui", gabriel: "Gabriel", juntos: "Os dois" };
const WHO_EMOJI = { gui: "🧔", gabriel: "👨", juntos: "👫" };
const TIME_OPTIONS = ["30min", "1h", "2h", "3h+", "dia inteiro"];

const INITIAL_PLACES = [
  { id: "t001", category: "Museus", name: "NY Transit Museum", emoji: "🚇", desc: "Museu dentro de uma estacao de metro desativada em Brooklyn Heights, com vagoes vintage dos anos 1900 ate hoje.", price: "$", lat: 40.6906, lng: -73.9899, time: "2h" },
  { id: "t002", category: "Museus", name: "American Museum of Natural History", emoji: "🦕", desc: "O museu do Uma Noite no Museu: dinossauros, baleia azul gigante, planetario, antropologia.", price: "$$", lat: 40.7813, lng: -73.9740, time: "dia inteiro" },
  { id: "t003", category: "Museus", name: "MoMA", emoji: "🎨", desc: "Arte moderna e contemporanea. Van Gogh, Picasso, Dali, Warhol. Um dos melhores museus do mundo.", price: "$$", lat: 40.7614, lng: -73.9776, time: "3h+" },
  { id: "t004", category: "Museus", name: "9/11 Memorial & Museum", emoji: "🕊️", desc: "No local exato das Torres Gemeas, com as piscinas reflexivas enormes. Depoimentos de sobreviventes e familias.", price: "$$", lat: 40.7115, lng: -74.0134, time: "3h+" },
  { id: "t005", category: "Museus", name: "Intrepid Museum", emoji: "✈️", desc: "Porta-avioes real ancorado no Hudson River, com 30 aeronaves, o onibus espacial Enterprise e o Concorde.", price: "$$", lat: 40.7645, lng: -74.0017, time: "3h+" },
  { id: "t006", category: "Museus", name: "Building 92 / Brooklyn Navy Yard", emoji: "⚓", desc: "Centro de visitantes gratuito com 200 anos de historia do estaleiro naval, num predio de 1857.", price: "gratis", lat: 40.6990, lng: -73.9718, time: "1h" },
  { id: "t007", category: "Museus", name: "Museum of Broadway", emoji: "🎭", desc: "Tres andares com figurinos e aderecos originais de Hamilton, Phantom, Rent e Wicked. Na Times Square.", price: "$$", lat: 40.7580, lng: -73.9855, time: "2h" },
  { id: "t008", category: "Monumentos", name: "NY Public Library", emoji: "📚", desc: "A biblioteca dos leoes, classica de filme. A sala de leitura principal e de cair o queixo. Gratis.", price: "gratis", lat: 40.7532, lng: -73.9822, time: "1h" },
  { id: "t009", category: "Monumentos", name: "St. Patrick's Cathedral", emoji: "⛪", desc: "Catedral neogotica no meio da 5th Ave, impressionante por dentro com os vitrais. Gratis.", price: "gratis", lat: 40.7586, lng: -73.9762, time: "30min" },
  { id: "t010", category: "Monumentos", name: "NYSE + Charging Bull", emoji: "🐂", desc: "Fachada neoclassica da bolsa na Wall Street e o touro de bronze iconico do FiDi.", price: "gratis", lat: 40.7069, lng: -74.0089, time: "30min" },
  { id: "t011", category: "Monumentos", name: "Brooklyn Heights Promenade", emoji: "🌆", desc: "Calcadao suspenso em Brooklyn Heights com vista panoramica da skyline de Manhattan.", price: "gratis", lat: 40.6962, lng: -73.9991, time: "1h" },
  { id: "t012", category: "Monumentos", name: "Central Park (norte e leste)", emoji: "🌳", desc: "Bethesda Fountain, The Ramble, Belvedere Castle, Reservoir e Conservatory Garden.", price: "gratis", lat: 40.7812, lng: -73.9665, time: "3h+" },
  { id: "t013", category: "Observatorios", name: "SUMMIT One Vanderbilt", emoji: "🔮", desc: "Instalacoes de arte com espelhos e vidro, vistas deslumbrantes. Abre ate meia-noite.", price: "$$$", lat: 40.7527, lng: -73.9772, time: "2h" },
  { id: "t014", category: "Observatorios", name: "Top of the Rock", emoji: "🏙️", desc: "No Rockefeller Center, com a view classica com o Empire State no meio da foto.", price: "$$$", lat: 40.7593, lng: -73.9787, time: "1h" },
  { id: "t015", category: "Observatorios", name: "Empire State Building", emoji: "🌃", desc: "O icone absoluto de Nova York. Abre ate 11:30pm, otimo pra ir ao anoitecer.", price: "$$$", lat: 40.7484, lng: -73.9857, time: "2h" },
  { id: "t016", category: "Observatorios", name: "The Edge", emoji: "🫧", desc: "Terraco de vidro em Hudson Yards que parece que voce ta voando sobre a cidade.", price: "$$$", lat: 40.7534, lng: -74.0010, time: "1h" },
  { id: "t017", category: "Observatorios", name: "One World Observatory", emoji: "🌍", desc: "No topo do World Trade Center, o predio mais alto do hemisferio ocidental.", price: "$$$", lat: 40.7130, lng: -74.0134, time: "1h" },
  { id: "t018", category: "Natureza", name: "Prospect Park", emoji: "🌿", desc: "O grande parque de Brooklyn, projetado pelos mesmos criadores do Central Park.", price: "gratis", lat: 40.6602, lng: -73.9690, time: "3h+" },
  { id: "t019", category: "Natureza", name: "Bronx Zoo", emoji: "🦁", desc: "Um dos maiores zoologicos urbanos do mundo, no Bronx. Reserve o dia inteiro.", price: "$$", lat: 40.8506, lng: -73.8770, time: "dia inteiro" },
  { id: "t020", category: "Natureza", name: "Coney Island", emoji: "🎡", desc: "Praia iconica com o parque Luna Park, o cachorro-quente do Nathan's Famous e o calcadao historico.", price: "$", lat: 40.5755, lng: -73.9707, time: "dia inteiro" },
  { id: "t021", category: "Livrarias", name: "The Strand", emoji: "📖", desc: "4 andares e 18 milhas de livros na Union Square. Uma das livrarias mais famosas dos EUA.", price: "$", lat: 40.7330, lng: -73.9910, time: "1h" },
  { id: "t022", category: "Livrarias", name: "The Ripped Bodice", emoji: "💘", desc: "Livraria especializada em romance em Park Slope, Brooklyn. Atmosfera aconchegante.", price: "$", lat: 40.6761, lng: -73.9810, time: "1h" },
  { id: "t023", category: "Lojas", name: "Nintendo NY", emoji: "🎮", desc: "No Rockefeller Plaza, com merchandise exclusivo, demos de jogos e historia da Nintendo.", price: "$", lat: 40.7582, lng: -73.9796, time: "1h" },
  { id: "t024", category: "Lojas", name: "Disney Store", emoji: "✨", desc: "Na area da Times Square, dois andares de tudo que e Disney, Marvel e Pixar.", price: "$", lat: 40.7574, lng: -73.9857, time: "1h" },
  { id: "t025", category: "Lojas", name: "Hershey's + M&M + Lego", emoji: "🍫", desc: "As tres gigantes na Times Square. Visuais, caoticas e divertidas pra uma passada rapida.", price: "$", lat: 40.7580, lng: -73.9845, time: "1h" },
  { id: "t026", category: "Entretenimento", name: "SPYSCAPE", emoji: "🕵️", desc: "Museu interativo de espionagem: quebra codigos, esquiva de lasers e descobre seu perfil de espiao.", price: "$$", lat: 40.7634, lng: -73.9863, time: "2h" },
  { id: "t027", category: "Entretenimento", name: "Show no Madison Square Garden", emoji: "🎸", desc: "O maior e mais famoso venue indoor de NY. Uma experiencia a parte independente do show.", price: "$$$", lat: 40.7505, lng: -73.9934, time: "3h+" },
  { id: "t028", category: "Entretenimento", name: "PARAISO (Westlight Rooftop)", emoji: "🌅", desc: "Festa semanal aos domingos no rooftop do William Vale, Williamsburg.", price: "$$", lat: 40.7181, lng: -73.9566, time: "3h+" },
  { id: "t029", category: "Entretenimento", name: "Paradise Sunset NYC", emoji: "🌇", desc: "Day party de rooftop animada.", price: "$$", lat: 40.7549, lng: -73.9840, time: "3h+" },
  { id: "t030", category: "Entretenimento", name: "Ellen's Stardust Diner", emoji: "🎤", desc: "Restaurante dos garcons que cantam na Broadway, tematico dos anos 50.", price: "$$", lat: 40.7614, lng: -73.9848, time: "2h" },
  { id: "t031", category: "Entretenimento", name: "Bares Speakeasy", emoji: "🥃", desc: "Bares secretos escondidos atras de cafeterias, cabines telefonicas ou geladeiras.", price: "$$", lat: 40.7282, lng: -74.0076, time: "2h" },
  { id: "t032", category: "Comida", name: "Joe's Pizza", emoji: "🍕", desc: "A fatia de pizza mais classica de NY desde 1975. Original no West Village.", price: "$", lat: 40.7306, lng: -74.0022, time: "30min" },
  { id: "t033", category: "Compras", name: "American Dream Outlet", emoji: "🛍️", desc: "O maior outlet de NJ em East Rutherford, com parque de diversoes, pista de esqui indoor e aquario.", price: "$$", lat: 40.8135, lng: -74.0669, time: "dia inteiro" },
  { id: "s001", category: "Bairros", name: "Governors Island", emoji: "⛵", desc: "Ilha sem carros na baia, com arte, piquenique e vista pro Downtown.", price: "gratis", lat: 40.6895, lng: -74.0165, time: "3h+" },
  { id: "s002", category: "Bairros", name: "Roosevelt Island", emoji: "🌉", desc: "Ilhinha no East River com tramway iconico saindo da 2nd Ave.", price: "gratis", lat: 40.7614, lng: -73.9506, time: "2h" },
  { id: "s003", category: "Bairros", name: "Harlem", emoji: "🎷", desc: "Berco do jazz e da cultura negra americana. Igrejas gospel, comida soul food e murais incriveis.", price: "$", lat: 40.8116, lng: -73.9465, time: "3h+" },
  { id: "s004", category: "Bairros", name: "Astoria, Queens", emoji: "🇬🇷", desc: "Bairro grego com otimos restaurantes, museu de cinema e atmosfera europeia.", price: "$", lat: 40.7721, lng: -73.9302, time: "3h+" },
  { id: "s005", category: "Bairros", name: "Flushing, Queens", emoji: "🥟", desc: "A melhor gastronomia asiatica fora da Asia. Chinatown gigante com dim sum e boba.", price: "$", lat: 40.7675, lng: -73.8330, time: "3h+" },
  { id: "s006", category: "Bairros", name: "Little Italy & Chinatown", emoji: "🍝", desc: "Dois bairros historicos em Lower Manhattan. Cannoli, dumplings e muita historia.", price: "$", lat: 40.7188, lng: -73.9973, time: "2h" },
  { id: "s007", category: "Bairros", name: "The High Line", emoji: "🌿", desc: "Parque linear suspenso numa ferrovia desativada no West Side.", price: "gratis", lat: 40.7480, lng: -74.0048, time: "2h" },
  { id: "s008", category: "Bairros", name: "Greenpoint, Brooklyn", emoji: "🇵🇱", desc: "Bairro polones com cafes independentes, galerias e vista da skyline.", price: "$", lat: 40.7242, lng: -73.9480, time: "2h" },
  { id: "s009", category: "Bairros", name: "Red Hook, Brooklyn", emoji: "⚓", desc: "Antigo bairro industrial na beira d'agua, com galerias e cervejarias.", price: "$", lat: 40.6759, lng: -74.0109, time: "2h" },
  { id: "s010", category: "Bairros", name: "Jackson Heights, Queens", emoji: "🇮🇳", desc: "Bairro mais diverso do mundo. Culinaria sul-asiatica, latina e muito mais.", price: "$", lat: 40.7498, lng: -73.8831, time: "2h" },
  { id: "s011", category: "Museus", name: "Whitney Museum", emoji: "🎨", desc: "Arte americana contemporanea no Meatpacking District.", price: "$$", lat: 40.7396, lng: -74.0089, time: "2h" },
  { id: "s012", category: "Museus", name: "The Met", emoji: "🏛️", desc: "Um dos maiores museus do mundo. Egito, armaduras medievais, impressionismo.", price: "$$", lat: 40.7794, lng: -73.9632, time: "dia inteiro" },
  { id: "s013", category: "Museus", name: "Guggenheim", emoji: "🌀", desc: "O predio em espiral de Frank Lloyd Wright ja e arte.", price: "$$", lat: 40.7830, lng: -73.9590, time: "2h" },
  { id: "s014", category: "Museus", name: "Museum of the City of NY", emoji: "🗽", desc: "A historia completa de Nova York do seculo XVII ate hoje.", price: "$", lat: 40.7920, lng: -73.9519, time: "2h" },
  { id: "s015", category: "Museus", name: "New York Hall of Science", emoji: "🔬", desc: "Museu de ciencias interativo em Queens.", price: "$", lat: 40.7467, lng: -73.8467, time: "3h+" },
  { id: "s016", category: "Museus", name: "Tenement Museum", emoji: "🏚️", desc: "Visita guiada a apartamentos de imigrantes preservados do seculo XIX.", price: "$$", lat: 40.7183, lng: -73.9898, time: "2h" },
  { id: "s017", category: "Museus", name: "Brooklyn Museum", emoji: "🖼️", desc: "Segundo maior museu de arte dos EUA, com colecao egipcia impressionante.", price: "$$", lat: 40.6712, lng: -73.9636, time: "3h+" },
  { id: "s018", category: "Museus", name: "Frick Collection", emoji: "🎻", desc: "Mansao do seculo XIX transformada em museu com Vermeer, Rembrandt e Renoir.", price: "$$", lat: 40.7713, lng: -73.9672, time: "2h" },
  { id: "s019", category: "Comida", name: "Smorgasburg", emoji: "🍜", desc: "Maior mercado de comida ao ar livre dos EUA, todo sabado em Williamsburg.", price: "$", lat: 40.7223, lng: -73.9572, time: "2h" },
  { id: "s020", category: "Comida", name: "Chelsea Market", emoji: "🥐", desc: "Mercado gourmet coberto numa antiga fabrica de biscoitos.", price: "$$", lat: 40.7424, lng: -74.0048, time: "2h" },
  { id: "s021", category: "Comida", name: "Katz's Delicatessen", emoji: "🥪", desc: "O deli mais famoso de NY, desde 1888. O sanduiche de pastrami e lendario.", price: "$$", lat: 40.7223, lng: -73.9874, time: "1h" },
  { id: "s022", category: "Comida", name: "Di Fara Pizza", emoji: "🍕", desc: "A pizza mais famosa de Brooklyn, feita a mao pelo mesmo dono ha decadas.", price: "$", lat: 40.6249, lng: -73.9612, time: "1h" },
  { id: "s023", category: "Comida", name: "Russ & Daughters", emoji: "🐟", desc: "Salmao defumado, cream cheese, bagel no Lower East Side desde 1914.", price: "$$", lat: 40.7220, lng: -73.9876, time: "1h" },
  { id: "s024", category: "Comida", name: "Levain Bakery", emoji: "🍪", desc: "O cookie de chocolate mais famoso de NY. Enorme, cremoso e quente.", price: "$", lat: 40.7812, lng: -73.9803, time: "30min" },
  { id: "s025", category: "Comida", name: "Peter Luger Steak House", emoji: "🥩", desc: "A churrascaria mais famosa de NY, em Williamsburg desde 1887.", price: "$$$", lat: 40.7099, lng: -73.9625, time: "2h" },
  { id: "s026", category: "Natureza", name: "Staten Island Ferry", emoji: "⛴️", desc: "Balsa gratuita com vista frontal da Estatua da Liberdade.", price: "gratis", lat: 40.6437, lng: -74.0735, time: "1h" },
  { id: "s027", category: "Natureza", name: "Rockaway Beach", emoji: "🏄", desc: "Praia em Queens acessivel de metro. Boa pra surfe.", price: "gratis", lat: 40.5843, lng: -73.8351, time: "dia inteiro" },
  { id: "s028", category: "Natureza", name: "The Cloisters", emoji: "🏰", desc: "Museu de arte medieval dentro de um mosteiro reconstruido no norte de Manhattan.", price: "$$", lat: 40.8648, lng: -73.9317, time: "2h" },
  { id: "s029", category: "Entretenimento", name: "Ver um show na Broadway", emoji: "🎭", desc: "Um classico que nao pode faltar. A experiencia mais nova-iorquina que existe.", price: "$$$", lat: 40.7590, lng: -73.9845, time: "3h+" },
  { id: "s030", category: "Entretenimento", name: "Comedy Cellar", emoji: "😂", desc: "O clube de stand-up mais lendario de NY no Village.", price: "$$", lat: 40.7302, lng: -74.0005, time: "2h" },
  { id: "s031", category: "Entretenimento", name: "Sleep No More", emoji: "🎭", desc: "Peca imersiva de teatro noir onde voce vaga por um hotel de 5 andares.", price: "$$$", lat: 40.7467, lng: -74.0014, time: "3h+" },
  { id: "s032", category: "Entretenimento", name: "Brooklyn Mirage", emoji: "🎧", desc: "O maior venue de musica eletronica dos EUA, em Queens.", price: "$$", lat: 40.6985, lng: -73.9318, time: "3h+" },
  { id: "s033", category: "Entretenimento", name: "Karaoke em Koreatown", emoji: "🎤", desc: "32nd St. Karaoke privativo disponivel ate de madrugada.", price: "$$", lat: 40.7484, lng: -73.9878, time: "2h" },
  { id: "s034", category: "Monumentos", name: "Estatua da Liberdade", emoji: "🗽", desc: "Balsa de Battery Park pra Liberty Island. Reserve com antecedencia pra subir.", price: "$$", lat: 40.6892, lng: -74.0445, time: "3h+" },
  { id: "s035", category: "Monumentos", name: "Grand Central Terminal", emoji: "🚂", desc: "A estacao de trem mais bela do mundo, com teto estrelado.", price: "gratis", lat: 40.7527, lng: -73.9772, time: "30min" },
  { id: "s036", category: "Monumentos", name: "Washington Square Park", emoji: "🎨", desc: "O parque mais vivo de Manhattan, com musicos, xadrez e skatistas.", price: "gratis", lat: 40.7308, lng: -74.0002, time: "1h" },
  { id: "s037", category: "Monumentos", name: "Little Island", emoji: "🌺", desc: "Parque flutuante no Hudson River no Meatpacking, inaugurado em 2021.", price: "gratis", lat: 40.7438, lng: -74.0094, time: "1h" },
  { id: "s038", category: "Monumentos", name: "Flatiron Building", emoji: "🏢", desc: "O predio em formato de ferro de passar roupa. Recentemente reaberto apos reforma.", price: "gratis", lat: 40.7411, lng: -73.9897, time: "30min" },
  { id: "d001", category: "Dispensaries", name: "Housing Works Cannabis", emoji: "🌿", desc: "O primeiro dispensario com fins sociais de NY, em Soho. Ambiente sofisticado e equipe super atenciosa.", price: "$$", lat: 40.7243, lng: -74.0030, time: "30min" },
  { id: "d002", category: "Dispensaries", name: "The Travel Agency", emoji: "✈️", desc: "Dispensario tematico de viagem em Manhattan. Visual unico, otima selecao e atendimento impecavel.", price: "$$", lat: 40.7589, lng: -73.9851, time: "30min" },
  { id: "d003", category: "Dispensaries", name: "Gotham", emoji: "🦇", desc: "Dispensario premium no Midtown com enfase em educacao do consumidor. Ambiente elegante.", price: "$$", lat: 40.7549, lng: -73.9840, time: "30min" },
  { id: "d004", category: "Dispensaries", name: "Smacked Village", emoji: "🌱", desc: "Dispensario bem avaliado no West Village, com ambiente aconchegante e boa selecao de produtos locais.", price: "$$", lat: 40.7335, lng: -74.0030, time: "30min" },
  { id: "d005", category: "Dispensaries", name: "Terp Bros", emoji: "🍃", desc: "Um dos primeiros dispensarios licenciados de NY no Bronx. Muito bem avaliado pela comunidade.", price: "$", lat: 40.8448, lng: -73.8648, time: "30min" },
];

const CATEGORIES = [...new Set(INITIAL_PLACES.map(p => p.category))];

const CAT_COLORS = {
  "Museus":          { accent: "#c9a96e", dim: "#2a1f0e" },
  "Monumentos":      { accent: "#b8a9c9", dim: "#1e1a2e" },
  "Observatorios":   { accent: "#e8a598", dim: "#2e1512" },
  "Natureza":        { accent: "#8fbc8f", dim: "#0e1e0e" },
  "Livrarias":       { accent: "#d4a847", dim: "#2a1f00" },
  "Lojas":           { accent: "#d4956a", dim: "#2a1200" },
  "Entretenimento":  { accent: "#c9a0dc", dim: "#1e0a2e" },
  "Compras":         { accent: "#7bbfbb", dim: "#0a1e1e" },
  "Bairros":         { accent: "#e8998d", dim: "#2e0e0a" },
  "Comida":          { accent: "#d4b96e", dim: "#2a1f00" },
  "Dispensaries":    { accent: "#8fbc6e", dim: "#0e1e00" },
};

const T = {
  bg: "#0c0c0c",
  surface: "#141414",
  surfaceHigh: "#1c1c1c",
  border: "#2a2a2a",
  borderLight: "#333333",
  text: "#e8e0d4",
  textMuted: "#7a7268",
  textDim: "#4a4640",
  gold: "#c9a96e",
  cream: "#e8e0d4",
};

const css = `
  * { box-sizing: border-box; }
  body { margin: 0; background: ${T.bg}; }
  input, textarea, select { outline: none; }
  ::-webkit-scrollbar { display: none; }
  .place-card:hover { background: #1a1a1a !important; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .fade-in { animation: fadeIn 0.3s ease forwards; }
`;

function GlobalStyle() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
}

function Tag({ children, color, small }) {
  return (
    <span style={{ fontSize: small ? 10 : 11, color: color || T.textMuted, background: (color || T.textMuted) + "15", borderRadius: 6, padding: small ? "1px 6px" : "2px 8px", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function Stars({ value, onChange, size = 20 }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1,2,3,4,5].map(n => (
        <span key={n} onClick={() => onChange && onChange(value === n ? 0 : n)} style={{ fontSize: size, cursor: onChange ? "pointer" : "default", color: n <= value ? T.gold : T.textDim, transition: "color 0.1s" }}>★</span>
      ))}
    </div>
  );
}

function MapTab({ places, entries, onSelect }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [ready, setReady] = useState(!!window.L);

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
    if (mapInstanceRef.current) {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
    } else {
      mapInstanceRef.current = window.L.map(mapRef.current, { center: [40.730, -73.990], zoom: 12, zoomControl: true });
      window.L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", { attribution: "CartoDB" }).addTo(mapInstanceRef.current);
    }
    places.forEach(place => {
      if (!place.lat || !place.lng) return;
      const entry = entries[place.id] || {};
      const col = CAT_COLORS[place.category] || { accent: T.gold };
      const status = entry.status;
      const opacity = status === "skip" ? 0.3 : 1;
      const icon = window.L.divIcon({
        html: "<div style='font-size:22px;opacity:" + opacity + ";filter:drop-shadow(0 2px 6px rgba(0,0,0,0.8))'>" + place.emoji + "</div>",
        className: "",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });
      const marker = window.L.marker([place.lat, place.lng], { icon }).addTo(mapInstanceRef.current);
      marker.on("click", () => onSelect(place));
      markersRef.current.push(marker);
    });
  }, [ready, places, entries]);

  if (!ready) return <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: T.textMuted, fontSize: 14 }}>Carregando mapa...</div>;

  return (
    <div style={{ padding: "0 16px 16px" }}>
      <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 10, letterSpacing: "0.08em" }}>TOQUE EM UM LUGAR PARA VER DETALHES</div>
      <div ref={mapRef} style={{ height: "65vh", borderRadius: 16, overflow: "hidden", border: "1px solid " + T.border }} />
    </div>
  );
}

function PhotoGallery({ photos, onChange }) {
  const fileRef = useRef();
  const handleAdd = (ev) => {
    const files = Array.from(ev.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        onChange(prev => prev.length < 4 ? [...prev, e.target.result] : prev);
      };
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
            <button onClick={() => onChange(prev => prev.filter((_, j) => j !== i))} style={{ position: "absolute", top: 6, right: 6, background: "#000000cc", border: "none", borderRadius: "50%", width: 24, height: 24, color: "#fff", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>x</button>
          </div>
        ))}
        {photos.length < 4 && (
          <div onClick={() => fileRef.current.click()} style={{ aspectRatio: "4/3", background: T.surfaceHigh, border: "1px dashed " + T.border, borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.textMuted, fontSize: 12 }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>+</div>
            <div>Foto {photos.length + 1}/4</div>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleAdd} style={{ display: "none" }} />
    </div>
  );
}

function DetailModal({ place, entry, onClose, onSave, onDelete }) {
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
  const [confirmDelete, setConfirmDelete] = useState(false);
  const col = CAT_COLORS[place.category] || { accent: T.gold };
  const toggleVibe = (v) => setVibes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  const mapsUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(place.name + " New York");

  const STATUS_CONFIG = {
    quero: { label: "Quero ir", icon: "♡", activeIcon: "♥", color: "#8faadc" },
    fui:   { label: "Ja fui!", icon: "○", activeIcon: "✓", color: "#8fbc8f" },
    skip:  { label: "Pular",   icon: "−", activeIcon: "−", color: T.textMuted },
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000ee", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: T.surface, borderTop: "1px solid " + T.border, borderRadius: "20px 20px 0 0", padding: "24px 20px 48px", maxWidth: 560, width: "100%", maxHeight: "94vh", overflowY: "auto" }} onClick={ev => ev.stopPropagation()}>

        <div style={{ width: 36, height: 3, background: T.border, borderRadius: 2, margin: "0 auto 20px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 28 }}>{place.emoji}</span>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: T.cream, letterSpacing: "-0.01em" }}>{place.name}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 3, flexWrap: "wrap" }}>
                  <Tag color={col.accent}>{place.category}</Tag>
                  {price && <Tag color={T.textMuted}>{PRICE_EMOJI[price]} {PRICE_LABELS[price]}</Tag>}
                  {place.time && <Tag color={T.textMuted}>⏱ {place.time}</Tag>}
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <a href={mapsUrl} target="_blank" rel="noreferrer" style={{ background: T.surfaceHigh, border: "1px solid " + T.border, borderRadius: 10, width: 36, height: 36, color: T.textMuted, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 16 }}>📍</a>
            <button onClick={onClose} style={{ background: T.surfaceHigh, border: "1px solid " + T.border, borderRadius: 10, width: 36, height: 36, color: T.textMuted, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          </div>
        </div>

        <div style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.6, marginBottom: 20, padding: "12px 14px", background: T.surfaceHigh, borderRadius: 10, borderLeft: "2px solid " + col.accent }}>{place.desc}</div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.12em", marginBottom: 10 }}>STATUS</div>
          <div style={{ display: "flex", gap: 8 }}>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <button key={key} onClick={() => setStatus(key)} style={{ flex: 1, padding: "10px 4px", borderRadius: 10, background: status === key ? cfg.color + "18" : T.surfaceHigh, border: "1px solid " + (status === key ? cfg.color + "60" : T.border), color: status === key ? cfg.color : T.textDim, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                <div>{status === key ? cfg.activeIcon : cfg.icon}</div>
                <div style={{ fontSize: 10, marginTop: 3, letterSpacing: "0.05em" }}>{cfg.label}</div>
              </button>
            ))}
          </div>
        </div>

        {status === "fui" && (
          <>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.12em", marginBottom: 8 }}>QUEM FOI?</div>
              <div style={{ display: "flex", gap: 8 }}>
                {WHO_OPTIONS.map(w => (
                  <button key={w} onClick={() => setWho(w)} style={{ flex: 1, padding: "10px 4px", borderRadius: 10, background: who === w ? T.gold + "18" : T.surfaceHigh, border: "1px solid " + (who === w ? T.gold + "60" : T.border), color: who === w ? T.gold : T.textDim, fontSize: 12, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                    <div>{WHO_EMOJI[w]}</div>
                    <div style={{ fontSize: 10, marginTop: 3 }}>{WHO_LABELS[w]}</div>
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.12em", marginBottom: 8 }}>QUANDO?</div>
              <input type="date" value={date} onChange={ev => setDate(ev.target.value)} style={{ width: "100%", background: T.surfaceHigh, border: "1px solid " + T.border, borderRadius: 10, padding: "10px 14px", color: T.cream, fontSize: 14, fontFamily: "inherit" }} />
            </div>
          </>
        )}

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.12em", marginBottom: 8 }}>PRECO</div>
          <div style={{ display: "flex", gap: 6 }}>
            {PRICE_LEVELS.map(p => (
              <button key={p} onClick={() => setPrice(price === p ? null : p)} style={{ flex: 1, padding: "8px 4px", borderRadius: 10, background: price === p ? T.gold + "18" : T.surfaceHigh, border: "1px solid " + (price === p ? T.gold + "60" : T.border), color: price === p ? T.gold : T.textDim, fontSize: 11, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                {PRICE_EMOJI[p]}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.12em", marginBottom: 8 }}>VIBE</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {VIBES.map(v => (
              <button key={v} onClick={() => toggleVibe(v)} style={{ padding: "6px 12px", borderRadius: 20, background: vibes.includes(v) ? T.gold + "18" : T.surfaceHigh, border: "1px solid " + (vibes.includes(v) ? T.gold + "60" : T.border), color: vibes.includes(v) ? T.gold : T.textDim, fontSize: 12, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                {VIBE_EMOJI[v]} {VIBE_LABELS[v]}
              </button>
            ))}
          </div>
        </div>

        {status === "fui" && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.12em", marginBottom: 8 }}>AVALIACAO</div>
            <Stars value={stars} onChange={setStars} size={24} />
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button onClick={() => setThumb(thumb === "up" ? null : "up")} style={{ flex: 1, padding: "10px", borderRadius: 10, background: thumb === "up" ? "#4a7a4a" : T.surfaceHigh, border: "1px solid " + (thumb === "up" ? "#6aaa6a" : T.border), color: thumb === "up" ? "#8fdc8f" : T.textDim, fontSize: 18, cursor: "pointer" }}>👍</button>
              <button onClick={() => setThumb(thumb === "down" ? null : "down")} style={{ flex: 1, padding: "10px", borderRadius: 10, background: thumb === "down" ? "#7a3a3a" : T.surfaceHigh, border: "1px solid " + (thumb === "down" ? "#aa6a6a" : T.border), color: thumb === "down" ? "#dc8f8f" : T.textDim, fontSize: 18, cursor: "pointer" }}>👎</button>
            </div>
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.12em", marginBottom: 8 }}>{status === "fui" ? "COMO FOI?" : "NOTAS"}</div>
          <textarea value={note} onChange={ev => setNote(ev.target.value)} placeholder={status === "fui" ? "Adoramos! A fila valeu..." : "Lembrete, dica, horario..."} rows={3} style={{ width: "100%", background: T.surfaceHigh, border: "1px solid " + T.border, borderRadius: 10, padding: "10px 14px", color: T.cream, fontSize: 14, fontFamily: "inherit", resize: "none" }} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.12em", marginBottom: 8 }}>FOTOS (ate 4)</div>
          <PhotoGallery photos={photos} onChange={setPhotos} />
        </div>

        <button onClick={() => onSave({ status, note, date, photos, stars, thumb, vibes, price, who })} style={{ width: "100%", padding: "14px", background: col.accent, border: "none", borderRadius: 12, color: "#000", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.04em", marginBottom: 10 }}>
          Salvar
        </button>

        {place.custom && (
          confirmDelete ? (
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setConfirmDelete(false)} style={{ flex: 1, padding: "12px", background: T.surfaceHigh, border: "1px solid " + T.border, borderRadius: 12, color: T.textMuted, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Cancelar</button>
              <button onClick={onDelete} style={{ flex: 1, padding: "12px", background: "#7a2a2a", border: "1px solid #aa4a4a", borderRadius: 12, color: "#dc8f8f", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Confirmar remocao</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} style={{ width: "100%", padding: "12px", background: "none", border: "1px solid " + T.border, borderRadius: 12, color: T.textDim, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Remover lugar</button>
          )
        )}
      </div>
    </div>
  );
}

function AddModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [emoji, setEmoji] = useState("📍");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState("$");
  const [time, setTime] = useState("2h");
  const handle = () => {
    if (!name.trim()) return;
    onAdd({ id: "u" + Date.now(), name: name.trim(), desc: desc.trim(), emoji, category, price, time, custom: true });
    onClose();
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000ee", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: T.surface, borderTop: "1px solid " + T.border, borderRadius: "20px 20px 0 0", padding: "24px 20px 48px", maxWidth: 560, width: "100%", maxHeight: "85vh", overflowY: "auto" }} onClick={ev => ev.stopPropagation()}>
        <div style={{ width: 36, height: 3, background: T.border, borderRadius: 2, margin: "0 auto 20px" }} />
        <div style={{ fontSize: 14, fontWeight: 700, color: T.cream, letterSpacing: "0.08em", marginBottom: 20 }}>NOVO LUGAR</div>

        <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.12em", marginBottom: 6 }}>EMOJI</div>
            <input value={emoji} onChange={ev => setEmoji(ev.target.value)} maxLength={2} style={{ width: 52, background: T.surfaceHigh, border: "1px solid " + T.border, borderRadius: 10, padding: "10px", color: T.cream, fontSize: 22, textAlign: "center", fontFamily: "inherit" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.12em", marginBottom: 6 }}>NOME</div>
            <input value={name} onChange={ev => setName(ev.target.value)} placeholder="Ex: Yankee Stadium" style={{ width: "100%", background: T.surfaceHigh, border: "1px solid " + T.border, borderRadius: 10, padding: "10px 14px", color: T.cream, fontSize: 14, fontFamily: "inherit" }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.12em", marginBottom: 6 }}>CATEGORIA</div>
            <select value={category} onChange={ev => setCategory(ev.target.value)} style={{ width: "100%", background: T.surface, border: "1px solid " + T.border, borderRadius: 10, padding: "10px 12px", color: T.cream, fontSize: 13, fontFamily: "inherit" }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.12em", marginBottom: 6 }}>PRECO</div>
            <div style={{ display: "flex", gap: 4 }}>
              {PRICE_LEVELS.map(p => (
                <button key={p} onClick={() => setPrice(p)} style={{ padding: "10px 8px", borderRadius: 10, background: price === p ? T.gold + "25" : T.surfaceHigh, border: "1px solid " + (price === p ? T.gold : T.border), color: price === p ? T.gold : T.textDim, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{PRICE_EMOJI[p]}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.12em", marginBottom: 6 }}>TEMPO ESTIMADO</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {TIME_OPTIONS.map(t => (
              <button key={t} onClick={() => setTime(t)} style={{ padding: "6px 12px", borderRadius: 20, background: time === t ? T.gold + "18" : T.surfaceHigh, border: "1px solid " + (time === t ? T.gold : T.border), color: time === t ? T.gold : T.textDim, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{t}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.12em", marginBottom: 6 }}>DESCRICAO</div>
          <textarea value={desc} onChange={ev => setDesc(ev.target.value)} placeholder="Uma linha sobre o que e..." rows={2} style={{ width: "100%", background: T.surfaceHigh, border: "1px solid " + T.border, borderRadius: 10, padding: "10px 14px", color: T.cream, fontSize: 14, fontFamily: "inherit", resize: "none" }} />
        </div>

        <button onClick={handle} style={{ width: "100%", padding: "14px", background: T.gold, border: "none", borderRadius: 12, color: "#000", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Adicionar</button>
      </div>
    </div>
  );
}

function ShareModal({ places, entries, onClose }) {
  const [copied, setCopied] = useState(false);
  const recommended = places.filter(p => { const e = entries[p.id] || {}; return e.thumb === "up" || (e.stars && e.stars >= 4); });
  const url = window.location.href;
  const text = "Nossos favoritos em NYC 🗽\n\n" + recommended.map(p => { const e = entries[p.id] || {}; return p.emoji + " " + p.name + (e.stars ? " " + "★".repeat(e.stars) : ""); }).join("\n") + "\n\nApp completo: " + url;
  const copy = (t) => { navigator.clipboard.writeText(t); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000ee", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: T.surface, borderTop: "1px solid " + T.border, borderRadius: "20px 20px 0 0", padding: "24px 20px 48px", maxWidth: 560, width: "100%", maxHeight: "80vh", overflowY: "auto" }} onClick={ev => ev.stopPropagation()}>
        <div style={{ width: 36, height: 3, background: T.border, borderRadius: 2, margin: "0 auto 20px" }} />
        <div style={{ fontSize: 14, fontWeight: 700, color: T.cream, marginBottom: 6 }}>COMPARTILHAR</div>
        <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>{recommended.length} lugares com 👍 ou 4+ estrelas</div>
        {recommended.length === 0 ? (
          <div style={{ color: T.textDim, fontSize: 13, textAlign: "center", padding: "20px 0" }}>Avalie alguns lugares primeiro!</div>
        ) : (
          <>
            <div style={{ background: T.surfaceHigh, borderRadius: 12, padding: "12px", marginBottom: 16, maxHeight: 180, overflowY: "auto" }}>
              {recommended.map(p => { const e = entries[p.id] || {}; return (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid " + T.border }}>
                  <span style={{ fontSize: 18 }}>{p.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: T.cream }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: T.textMuted }}>{e.stars > 0 && "★".repeat(e.stars)} {e.thumb === "up" ? "👍" : ""}</div>
                  </div>
                </div>
              ); })}
            </div>
            <button onClick={() => copy(text)} style={{ width: "100%", padding: "13px", background: copied ? "#4a7a4a" : T.gold, border: "none", borderRadius: 12, color: "#000", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginBottom: 8, transition: "background 0.2s" }}>
              {copied ? "Copiado!" : "Copiar lista pra WhatsApp"}
            </button>
            <button onClick={() => copy(url)} style={{ width: "100%", padding: "13px", background: T.surfaceHigh, border: "1px solid " + T.border, borderRadius: 12, color: T.cream, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Copiar link do app</button>
          </>
        )}
      </div>
    </div>
  );
}

function SurpriseCard({ place, onOpen }) {
  if (!place) return null;
  const col = CAT_COLORS[place.category] || { accent: T.gold };
  return (
    <div onClick={() => onOpen(place)} className="fade-in" style={{ background: "linear-gradient(135deg, #1a1608, #0e1a0e)", border: "1px solid " + T.border, borderRadius: 14, padding: "14px 16px", marginBottom: 12, cursor: "pointer", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, " + col.accent + ", transparent)" }} />
      <div style={{ fontSize: 10, color: T.textMuted, letterSpacing: "0.15em", marginBottom: 8 }}>LUGAR DO DIA 🎲</div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ fontSize: 28 }}>{place.emoji}</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.cream }}>{place.name}</div>
          <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>
            {place.category} {place.price && "· " + PRICE_EMOJI[place.price]} {place.time && "· " + place.time}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [places, setPlaces] = useState(INITIAL_PLACES);
  const [entries, setEntries] = useState({});
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
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [placeOfDay, setPlaceOfDay] = useState(null);
  const [surpriseKey, setSurpriseKey] = useState(0);

  useEffect(() => {
    const entriesRef = ref(db, "entries");
    const unsubEntries = onValue(entriesRef, snapshot => {
      const data = snapshot.val();
      if (data) setEntries(data);
      setLoading(false);
    });
    const placesRef = ref(db, "customPlaces");
    const unsubPlaces = onValue(placesRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const custom = Object.values(data);
        setPlaces(prev => {
          const ids = new Set(prev.map(p => p.id));
          return [...prev, ...custom.filter(p => !ids.has(p.id))];
        });
      }
    });
    return () => { unsubEntries(); unsubPlaces(); };
  }, []);

  useEffect(() => {
    if (!places.length) return;
    const candidates = places.filter(p => { const e = entries[p.id]; return !e || !e.status || e.status === "quero"; });
    if (!candidates.length) return;
    const seed = new Date().toDateString();
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    setPlaceOfDay(candidates[Math.abs(hash) % candidates.length]);
  }, [places, entries]);

  const getSurprise = () => {
    const candidates = places.filter(p => { const e = entries[p.id]; return !e || !e.status || e.status === "quero"; });
    if (!candidates.length) return;
    const r = candidates[Math.floor(Math.random() * candidates.length)];
    setSelected(r);
    setSurpriseKey(k => k + 1);
  };

  const handleSave = async (placeId, data) => {
    setSyncing(true);
    const newEntries = { ...entries, [placeId]: data };
    setEntries(newEntries);
    await set(ref(db, "entries/" + placeId), data);
    setSyncing(false);
    setSelected(null);
  };

  const handleAdd = async (place) => {
    setPlaces(prev => [...prev, place]);
    await set(ref(db, "customPlaces/" + place.id), place);
  };

  const handleDelete = async (placeId) => {
    setPlaces(prev => prev.filter(p => p.id !== placeId));
    await remove(ref(db, "customPlaces/" + placeId));
    await remove(ref(db, "entries/" + placeId));
    setEntries(prev => { const n = { ...prev }; delete n[placeId]; return n; });
    setSelected(null);
  };

  const activeFiltersCount = [filterVibe, filterPrice, filterStars > 0, filterThumb].filter(Boolean).length;

  const filteredPlaces = places.filter(p => {
    const entry = entries[p.id] || {};
    const status = entry.status;
    const sl = search.toLowerCase();
    const searchOk = !search || p.name.toLowerCase().includes(sl) || p.desc.toLowerCase().includes(sl) || p.category.toLowerCase().includes(sl);
    const catOk = activeCategory === "Todos" || p.category === activeCategory;
    const statusOk = activeFilter === "todos" ? true : activeFilter === "quero" ? (status === "quero" || !status) : activeFilter === "fui" ? status === "fui" : activeFilter === "skip" ? status === "skip" : true;
    const vibeOk = !filterVibe || (entry.vibes && entry.vibes.includes(filterVibe));
    const priceOk = !filterPrice || (entry.price || p.price) === filterPrice;
    const starsOk = filterStars === 0 || (entry.stars && entry.stars >= filterStars);
    const thumbOk = !filterThumb || entry.thumb === filterThumb;
    return searchOk && catOk && statusOk && vibeOk && priceOk && starsOk && thumbOk;
  }).sort((a, b) => {
    if (sortBy === "stars") return ((entries[b.id] || {}).stars || 0) - ((entries[a.id] || {}).stars || 0);
    if (sortBy === "pending") { const sa = (entries[a.id] || {}).status; const sb = (entries[b.id] || {}).status; if (!sa && sb) return -1; if (sa && !sb) return 1; return 0; }
    if (sortBy === "date") { const da = (entries[a.id] || {}).date || ""; const db2 = (entries[b.id] || {}).date || ""; return db2.localeCompare(da); }
    if (sortBy === "category") return a.category.localeCompare(b.category);
    return 0;
  });

  const total = places.length;
  const visited = Object.values(entries).filter(e => e.status === "fui").length;
  const pct = Math.round((visited / total) * 100);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🗽</div>
        <div style={{ fontSize: 11, color: T.textDim, letterSpacing: "0.2em" }}>CARREGANDO</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.cream, fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <GlobalStyle />

      <div style={{ background: T.bg, borderBottom: "1px solid " + T.border, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "16px 16px 0" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, color: T.textDim, letterSpacing: "0.2em", marginBottom: 2 }}>GUI & GABRIEL</div>
              <h1 style={{ fontSize: 22, fontWeight: 400, letterSpacing: "0.06em", margin: 0, color: T.cream }}>Nova York 🗽</h1>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={getSurprise} title="Surpreenda-me" style={{ background: T.surfaceHigh, border: "1px solid " + T.border, borderRadius: 10, width: 36, height: 36, color: T.textMuted, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>🎲</button>
              <button onClick={() => setShowShare(true)} style={{ background: T.surfaceHigh, border: "1px solid " + T.border, borderRadius: 10, padding: "0 12px", height: 36, color: T.textMuted, cursor: "pointer", fontSize: 12, fontFamily: "inherit", letterSpacing: "0.06em" }}>↗</button>
              {syncing && <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.1em" }}>SALVANDO</div>}
            </div>
          </div>

          <div style={{ background: T.surfaceHigh, borderRadius: 12, padding: "12px 14px", marginBottom: 14, border: "1px solid " + T.border }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: T.textDim, letterSpacing: "0.1em" }}>NYC EXPLORADA</div>
              <div style={{ fontSize: 13, color: T.gold, fontWeight: 700 }}>{pct}%</div>
            </div>
            <div style={{ height: 3, background: T.border, borderRadius: 2 }}>
              <div style={{ height: "100%", width: pct + "%", background: "linear-gradient(90deg, " + T.gold + ", #e8c88e)", borderRadius: 2, transition: "width 0.6s ease" }} />
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
              <span style={{ fontSize: 11, color: "#8fbc8f" }}>✓ {visited} visitados</span>
              <span style={{ fontSize: 11, color: T.textDim }}>{total - visited} restantes</span>
            </div>
          </div>

          <div style={{ position: "relative", marginBottom: 10 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.textDim, fontSize: 13 }}>🔍</span>
            <input value={search} onChange={ev => setSearch(ev.target.value)} placeholder="Buscar lugares, categorias..." style={{ width: "100%", background: T.surfaceHigh, border: "1px solid " + T.border, borderRadius: 10, padding: "10px 16px 10px 36px", color: T.cream, fontSize: 13, fontFamily: "inherit" }} />
            {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: T.textDim, cursor: "pointer", fontSize: 16 }}>×</button>}
          </div>

          <div style={{ display: "flex", gap: 0, marginBottom: 10, background: T.surfaceHigh, borderRadius: 10, padding: 3, border: "1px solid " + T.border }}>
            {[["list", "Lista"], ["map", "Mapa"]].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} style={{ flex: 1, padding: "7px", borderRadius: 8, background: tab === key ? T.surface : "none", border: "none", color: tab === key ? T.cream : T.textDim, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>{label}</button>
            ))}
          </div>

          {tab === "list" && (
            <>
              <div style={{ display: "flex", gap: 6, marginBottom: 8, overflowX: "auto", scrollbarWidth: "none" }}>
                {[["todos", "Todos"], ["quero", "♥ Quero"], ["fui", "✓ Fui"], ["skip", "− Skip"]].map(([key, label]) => (
                  <button key={key} onClick={() => setActiveFilter(key)} style={{ background: activeFilter === key ? T.gold + "18" : "none", border: "1px solid " + (activeFilter === key ? T.gold + "60" : T.border), borderRadius: 20, padding: "5px 12px", color: activeFilter === key ? T.gold : T.textDim, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>{label}</button>
                ))}
                <button onClick={() => setShowFilters(!showFilters)} style={{ background: activeFiltersCount > 0 ? T.gold + "18" : "none", border: "1px solid " + (activeFiltersCount > 0 ? T.gold : T.border), borderRadius: 20, padding: "5px 12px", color: activeFiltersCount > 0 ? T.gold : T.textDim, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>
                  {activeFiltersCount > 0 ? "Filtros (" + activeFiltersCount + ")" : "Filtros"}
                </button>
                <select value={sortBy} onChange={ev => setSortBy(ev.target.value)} style={{ background: T.surfaceHigh, border: "1px solid " + T.border, borderRadius: 20, padding: "5px 10px", color: T.textDim, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                  <option value="default">Ordem</option>
                  <option value="stars">Nota</option>
                  <option value="pending">Pendentes</option>
                  <option value="date">Data</option>
                  <option value="category">Categoria</option>
                </select>
              </div>

              {showFilters && (
                <div style={{ background: T.surfaceHigh, border: "1px solid " + T.border, borderRadius: 12, padding: "14px", marginBottom: 10 }}>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.12em", marginBottom: 8 }}>VIBE</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {VIBES.map(v => <button key={v} onClick={() => setFilterVibe(filterVibe === v ? null : v)} style={{ padding: "5px 10px", borderRadius: 20, background: filterVibe === v ? T.gold + "18" : "none", border: "1px solid " + (filterVibe === v ? T.gold : T.border), color: filterVibe === v ? T.gold : T.textDim, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>{VIBE_EMOJI[v]} {VIBE_LABELS[v]}</button>)}
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.12em", marginBottom: 8 }}>PRECO</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {PRICE_LEVELS.map(p => <button key={p} onClick={() => setFilterPrice(filterPrice === p ? null : p)} style={{ flex: 1, padding: "6px", borderRadius: 10, background: filterPrice === p ? T.gold + "18" : "none", border: "1px solid " + (filterPrice === p ? T.gold : T.border), color: filterPrice === p ? T.gold : T.textDim, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{PRICE_EMOJI[p]}</button>)}
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.12em", marginBottom: 8 }}>NOTA MINIMA</div>
                    <Stars value={filterStars} onChange={setFilterStars} size={20} />
                  </div>
                  <div style={{ marginBottom: activeFiltersCount > 0 ? 10 : 0 }}>
                    <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.12em", marginBottom: 8 }}>POLEGAR</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[["up", "👍 Recomendados"], ["down", "👎 Nao curtiram"]].map(([key, label]) => <button key={key} onClick={() => setFilterThumb(filterThumb === key ? null : key)} style={{ flex: 1, padding: "8px", borderRadius: 10, background: filterThumb === key ? T.gold + "18" : "none", border: "1px solid " + (filterThumb === key ? T.gold : T.border), color: filterThumb === key ? T.gold : T.textDim, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{label}</button>)}
                    </div>
                  </div>
                  {activeFiltersCount > 0 && <button onClick={() => { setFilterVibe(null); setFilterPrice(null); setFilterStars(0); setFilterThumb(null); }} style={{ width: "100%", padding: "8px", background: "none", border: "1px solid " + T.border, borderRadius: 10, color: T.textDim, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Limpar filtros</button>}
                </div>
              )}

              <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 12 }}>
                {["Todos", ...CATEGORIES].map(cat => {
                  const col = CAT_COLORS[cat];
                  const active = activeCategory === cat;
                  return <button key={cat} onClick={() => setActiveCategory(cat)} style={{ background: active ? ((col ? col.accent : T.cream) + "18") : "none", border: "1px solid " + (active ? (col ? col.accent : T.cream) + "50" : T.border), borderRadius: 20, padding: "5px 12px", color: active ? (col ? col.accent : T.cream) : T.textDim, fontSize: 10, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", letterSpacing: "0.06em" }}>{cat.toUpperCase()}</button>;
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "12px 16px 100px" }}>
        {tab === "map" ? (
          <MapTab places={filteredPlaces} entries={entries} onSelect={setSelected} />
        ) : (
          <>
            {placeOfDay && !search && activeFilter === "todos" && activeCategory === "Todos" && (
              <SurpriseCard place={placeOfDay} onOpen={setSelected} />
            )}

            {filteredPlaces.length === 0 && (
              <div style={{ textAlign: "center", color: T.textDim, padding: "60px 0", fontSize: 14 }}>Nenhum lugar encontrado</div>
            )}

            {filteredPlaces.map(place => {
              const entry = entries[place.id] || {};
              const status = entry.status;
              const col = CAT_COLORS[place.category] || { accent: T.gold };
              const displayPrice = entry.price || place.price;
              const firstPhoto = entry.photos ? entry.photos[0] : (entry.photo || null);
              return (
                <div key={place.id} className="place-card" onClick={() => setSelected(place)} style={{ background: T.surface, border: "1px solid " + (status === "fui" ? col.accent + "30" : T.border), borderRadius: 12, marginBottom: 8, padding: "14px", cursor: "pointer", opacity: status === "skip" ? 0.35 : 1, transition: "all 0.15s", display: "flex", gap: 12 }}>
                  {firstPhoto ? (
                    <img src={firstPhoto} alt="" style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 56, height: 56, borderRadius: 8, background: col.accent + "12", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{place.emoji}</div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: T.cream, lineHeight: 1.3 }}>{place.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                        {entry.thumb === "up" && <span style={{ fontSize: 12 }}>👍</span>}
                        {entry.thumb === "down" && <span style={{ fontSize: 12 }}>👎</span>}
                        {entry.stars > 0 && <span style={{ fontSize: 10, color: T.gold }}>{"★".repeat(entry.stars)}</span>}
                        {firstPhoto && entry.photos && entry.photos.length > 1 && <span style={{ fontSize: 10, color: T.textDim }}>📷{entry.photos.length}</span>}
                        <span style={{ fontSize: 14, color: status === "fui" ? col.accent : status === "quero" ? "#8faadc" : T.textDim }}>
                          {status === "fui" ? "✓" : status === "quero" ? "♥" : status === "skip" ? "−" : "○"}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 5, alignItems: "center", marginTop: 4, flexWrap: "wrap" }}>
                      <Tag color={col.accent} small>{place.category}</Tag>
                      {displayPrice && <Tag color={T.textDim} small>{PRICE_EMOJI[displayPrice]}</Tag>}
                      {place.time && <Tag color={T.textDim} small>⏱ {place.time}</Tag>}
                      {entry.who && entry.who !== "juntos" && <Tag color={T.gold} small>{WHO_EMOJI[entry.who]}</Tag>}
                      {entry.vibes && entry.vibes.map(v => <Tag key={v} color={T.textDim} small>{VIBE_EMOJI[v]}</Tag>)}
                    </div>
                    {entry.note && <div style={{ fontSize: 11, color: T.textMuted, marginTop: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.note}</div>}
                    {status === "fui" && entry.date && <div style={{ fontSize: 10, color: T.textDim, marginTop: 3 }}>{entry.date}</div>}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      <button onClick={() => setShowAdd(true)} style={{ position: "fixed", bottom: 24, right: 20, width: 52, height: 52, background: T.gold, border: "none", borderRadius: "50%", color: "#000", fontSize: 24, cursor: "pointer", boxShadow: "0 4px 20px " + T.gold + "40", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>+</button>

      {selected && <DetailModal place={selected} entry={entries[selected.id]} onClose={() => setSelected(null)} onSave={(data) => handleSave(selected.id, data)} onDelete={() => handleDelete(selected.id)} />}
      {showAdd && <AddModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
      {showShare && <ShareModal places={places} entries={entries} onClose={() => setShowShare(false)} />}
    </div>
  );
}
