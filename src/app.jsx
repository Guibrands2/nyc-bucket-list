import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
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

// ─── LANGUAGE ─────────────────────────────────────────────────────────────────
const isEN = navigator.language?.toLowerCase().startsWith("en");

const T = {
  appTitle: isEN ? "NYC Bucket List" : "NYC Bucket List",
  byGuiGab: isEN ? "GUI & GABRIEL" : "GUI & GABRIEL",
  saving: isEN ? "SAVING" : "SALVANDO",
  explored: isEN ? "NYC EXPLORED" : "NYC EXPLORADA",
  visited: isEN ? "visited" : "visitados",
  onList: isEN ? "on list" : "na lista",
  tabs: isEN ? ["List","Map","Timeline","Curadoria"] : ["Lista","Mapa","Linha do Tempo","Curadoria"],
  search: isEN ? "Search places, categories..." : "Buscar lugares, categorias...",
  all: isEN ? "All" : "Todos",
  want: isEN ? "♥ Want" : "♥ Quero",
  been: isEN ? "✓ Been" : "✓ Fui",
  filters: isEN ? "Filters" : "Filtros",
  sort: isEN ? "Sort" : "Ordem",
  sortOpts: isEN
    ? ["Default","A Z","Z A","Rating","Pending","Date","Category"]
    : ["Padrao","A Z","Z A","Nota","Pendentes","Data","Categoria"],
  placeOfDay: isEN ? "PLACE OF THE DAY" : "LUGAR DO DIA",
  noPlaces: isEN ? "No places found" : "Nenhum lugar encontrado",
  checkin: isEN ? "✓ check-in" : "✓ check-in",
  nearby: isEN ? "Nearby" : "Proximos",
  plan: isEN ? "Plan" : "Planejar",
  share: isEN ? "Share" : "Compartilhar",
  roll: isEN ? "Surprise" : "Sortear",
  save: isEN ? "Save" : "Salvar",
  saving2: isEN ? "Saving..." : "Salvando...",
  remove: isEN ? "Remove place" : "Remover lugar",
  confirm: isEN ? "Confirm" : "Confirmar",
  cancel: isEN ? "Cancel" : "Cancelar",
  status: isEN ? "STATUS" : "STATUS",
  wantGo: isEN ? "Want to go" : "Quero ir",
  beenThere: isEN ? "Been there!" : "Ja fui!",
  whoWent: isEN ? "WHO WENT?" : "QUEM FOI?",
  when: isEN ? "WHEN?" : "QUANDO?",
  price: isEN ? "PRICE" : "PRECO",
  bestSeason: isEN ? "BEST SEASON" : "MELHOR EPOCA",
  vibe: isEN ? "VIBE" : "VIBE",
  facilities: isEN ? "FACILITIES" : "FACILIDADES",
  pet: isEN ? "🐾 Pet friendly" : "🐾 Pet friendly",
  bathroom: isEN ? "🚻 Free bathroom" : "🚻 Banheiro gratis",
  rating: isEN ? "RATING" : "AVALIACAO",
  notes: isEN ? "NOTES" : "NOTAS",
  howWasIt: isEN ? "HOW WAS IT?" : "COMO FOI?",
  notePlaceholder: isEN ? "Loved it! Worth the wait..." : "Adoramos! A fila valeu...",
  reminderPlaceholder: isEN ? "Reminder, tip, hours..." : "Lembrete, dica, horario...",
  link: isEN ? "LINK (ticket, event, website)" : "LINK (ingresso, evento, site)",
  photos: isEN ? "PHOTOS (up to 4)" : "FOTOS (ate 4)",
  nearbyWalk: isEN ? "NEARBY ON FOOT" : "LUGARES PROXIMOS A PE",
  addNew: isEN ? "New place" : "Novo lugar",
  add: isEN ? "Add" : "Adicionar",
  adding: isEN ? "Adding..." : "Adicionando...",
  createCuradoria: isEN ? "+ Create new curadoria" : "+ Criar nova curadoria",
  curadoriaEmpty: isEN ? "Create curadorias to organize your favorites!" : "Crie curadorias para organizar seus favoritos!",
  curadoriaEx: isEN ? "Ex: Weekend with friends, Rainy day, Romantic NYC" : "Ex: Para ir com amigos, Dia de chuva, NYC romantico",
  curadoriaName: isEN ? "Curadoria name..." : "Nome da curadoria...",
  curadoriaDesc: isEN ? "Description (ex: For the gym group)" : "Descricao (ex: Para ir com o grupo da academia)",
  create: isEN ? "Create and add places →" : "Criar e adicionar lugares →",
  back: isEN ? "← Back" : "← Voltar",
  myCuradorias: isEN ? "← My curadorias" : "← Minhas curadorias",
  places: isEN ? "places" : "lugares",
  tapToEdit: isEN ? "tap to edit" : "toque para editar",
  selectPlaces: isEN ? "Select places to add:" : "Selecione lugares para adicionar:",
  filterPlaces: isEN ? "Filter: Brooklyn, free, museum..." : "Filtrar: Brooklyn, gratis, museu...",
  shareBtn: isEN ? "↗ Share" : "↗ Compartilhar",
  editPlace: isEN ? "Edit place" : "Editar lugar",
  removedToast: isEN ? "removed" : "removido",
  undoBtn: isEN ? "Undo" : "Desfazer",
  savedToast: isEN ? "Saved!" : "Salvo!",
  addedToast: isEN ? "added!" : "adicionado!",
  copiedToast: isEN ? "Copied!" : "Copiado!",
  surpriseToast: isEN ? "Place rolled!" : "Lugar sorteado!",
  checkinToast: isEN ? "Checked in at" : "Check-in em",
  locationErr: isEN ? "Could not get your location" : "Nao foi possivel obter sua localizacao",
  goodOutdoor: isEN ? "Good to go out!" : "Bom pra sair!",
  indoorDay: isEN ? "Indoor today" : "Indoor hoje",
  chatTitle: isEN ? "NYC Guide & Planner" : "Guia & Planejador NYC",
  chatSub: isEN ? "Chat, select places and generate a route" : "Converse, selecione e gere um roteiro",
  chatGreeting: isEN
    ? "Hi! I am your NYC guide 🗽\n\nI can help you plan your day, suggest places and build a route.\n\nWhat do you have in mind? Tell me the neighborhood, type of outing, time available..."
    : "Oi! Sou seu guia de NYC 🗽\n\nPosso te ajudar a planejar o dia, sugerir lugares e montar um roteiro.\n\nO que voce tem em mente? Me diz o bairro, tipo de programa, quanto tempo disponivel?",
  departure: isEN ? "Departure point..." : "Ponto de partida...",
  gps: isEN ? "GPS" : "GPS",
  placesCount: isEN ? "PLACES" : "LUGARES",
  clearSel: isEN ? "Clear" : "Limpar",
  genRoute: isEN ? "Generate route" : "Gerar roteiro",
  routeTitle: isEN ? "Day route 🗓️" : "Roteiro do dia 🗓️",
  departingFrom: isEN ? "Departing from:" : "Partindo de:",
  copyRoute: isEN ? "Copy route" : "Copiar roteiro",
  newRoute: isEN ? "New" : "Novo",
  routeCopied: isEN ? "Route copied!" : "Roteiro copiado!",
  typing: isEN ? "typing..." : "digitando...",
  askNYC: isEN ? "Ask about NYC or request suggestions..." : "Pergunte sobre NYC ou peca sugestoes...",
  generating: isEN ? "Claude is building your route..." : "Claude esta montando seu roteiro...",
  checkinNow: isEN ? "✓ Check-in now!" : "✓ Check-in agora!",
  checkinQuestion: isEN ? "Mark as visited today?" : "Marcar como visitado hoje?",
  nearbyTitle: isEN ? "Nearby places" : "Lugares proximos",
  nearbyRadius: isEN ? "Within 3km · walking distance" : "No raio de 3km · distancia a pe",
  noneNearby: isEN ? "No places from the list within 3km." : "Nenhum lugar da lista a menos de 3km.",
  walkMin: isEN ? "min walk" : "min",
  calc: isEN ? "calc..." : "calc...",
  improving: isEN ? "Improving..." : "Melhorando...",
  improveBtn: isEN ? "✨ Improve with AI" : "✨ IA",
  multiSelect: isEN ? "(multi-select)" : "(multi-select)",
  minRating: isEN ? "MIN RATING" : "NOTA MINIMA",
  thumb: isEN ? "THUMB" : "POLEGAR",
  recommended: isEN ? "👍 Recommended" : "👍 Recomendados",
  notRec: isEN ? "👎 Not recommended" : "👎 Nao curtiram",
  clearFilters: isEN ? "Clear filters" : "Limpar filtros",
  addressOptional: isEN ? "Address (optional, for map)" : "Endereco (opcional, para o mapa)",
  descLabel: isEN ? "Description..." : "Descricao...",
  linkOptional: isEN ? "Link (optional)..." : "Link (opcional)...",
  timeEst: isEN ? "Time estimate" : "Tempo estimado",
  favoritesList: isEN ? "Our NYC favorites 🗽" : "Nossos favoritos em NYC 🗽",
  copyWhatsApp: isEN ? "Copy list for WhatsApp" : "Copiar lista pra WhatsApp",
  copyLink: isEN ? "Copy app link" : "Copiar link do app",
  shareTitle: isEN ? "Share" : "Compartilhar",
  shareWith: isEN ? "places with 👍 or 4+ stars" : "lugares com 👍 ou 4+ estrelas",
  rateFirst: isEN ? "Rate places first!" : "Avalie lugares primeiro!",
  spending: isEN ? "SPENT" : "QUANTO GASTARAM",
  spendingPlaceholder: isEN ? "0.00" : "0.00",
  totalSpent: isEN ? "Total spent" : "Total gasto",
  needsReservation: isEN ? "Needs reservation" : "Precisa reservar",
  openingHours: isEN ? "OPENING HOURS" : "HORARIO DE FUNCIONAMENTO",
  hoursPlaceholder: isEN ? "Ex: Mon-Fri 10am-8pm, Sat-Sun 11am-6pm" : "Ex: Seg-Sex 10h-20h, Sab-Dom 11h-18h",
  weather: { sunny:"Sunny", cloudy:"Cloudy", partCloud:"Partly cloudy", foggy:"Foggy", drizzle:"Drizzle", rainy:"Rainy", snowy:"Snowing",
    ensolarado:"Ensolarado", nublado:"Nublado", parcNublado:"Parcialmente nublado", nebuloso:"Nebuloso", garoa:"Garoa", chovendo:"Chovendo", nevando:"Nevando" },
  filterVibe: isEN ? "VIBE" : "VIBE",
  filterPrice: isEN ? "PRICE" : "PRECO",
  filterSeason: isEN ? "SEASON" : "EPOCA",
  filterStars: isEN ? "MIN RATING" : "NOTA MINIMA",
  filterPet: isEN ? "Pet friendly" : "Pet friendly",
  filterBathroom: isEN ? "Free bathroom" : "Banheiro gratis",
  filterRegion: isEN ? "REGION" : "REGIAO",
  clearAll: isEN ? " Clear" : " Limpar",
  gpsError: isEN ? "Could not get location" : "Nao foi possivel obter localizacao",
  placeAdded: isEN ? "Place added!" : "Lugar adicionado!",
};

const VIBES = ["romantico","amigos","familia","solo"];
const VIBE_EMOJI = { romantico:"💑", amigos:"👯", familia:"👨‍👩‍👧", solo:"🧘" };
const VIBE_LABELS_PT = { romantico:"Romantico", amigos:"Amigos", familia:"Familia", solo:"Solo" };
const VIBE_LABELS_EN = { romantico:"Romantic", amigos:"Friends", familia:"Family", solo:"Solo" };
const VIBE_LABELS = isEN ? VIBE_LABELS_EN : VIBE_LABELS_PT;

const SEASONS = ["verao","inverno","primavera","outono","sempre"];
const SEASON_EMOJI = { verao:"☀️", inverno:"❄️", primavera:"🌸", outono:"🍂", sempre:"🗓️" };
const SEASON_LABELS_PT = { verao:"Verao", inverno:"Inverno", primavera:"Primavera", outono:"Outono", sempre:"Sempre" };
const SEASON_LABELS_EN = { verao:"Summer", inverno:"Winter", primavera:"Spring", outono:"Fall", sempre:"Anytime" };
const SEASON_LABELS = isEN ? SEASON_LABELS_EN : SEASON_LABELS_PT;

const PRICE_LEVELS = ["gratis","$","$$","$$$"];
const PRICES = PRICE_LEVELS;
const PRICE_EMOJI = { gratis:"🆓", "$":"$", "$$":"$$", "$$$":"$$$" };

const WHO_OPTIONS = ["gui","gabriel","juntos"];
const WHO_EMOJI = { gui:"🧔", gabriel:"👨", juntos:"👫" };
const WHO_LABELS_PT = { gui:"Gui", gabriel:"Gabriel", juntos:"Os dois" };
const WHO_LABELS_EN = { gui:"Gui", gabriel:"Gabriel", juntos:"Both" };
const WHO_LABELS = isEN ? WHO_LABELS_EN : WHO_LABELS_PT;

const TIME_OPTIONS = ["30min","1h","2h","3h+","dia inteiro"];

const CAT_META = {
  "Museus":           { color:"#2563eb", en:"Museums" },
  "Monumentos":       { color:"#7c3aed", en:"Monuments" },
  "Observatorios":    { color:"#ea7215", en:"Observatories" },
  "Natureza":         { color:"#16a34a", en:"Nature" },
  "Praias":           { color:"#0891b2", en:"Beaches" },
  "Livrarias":        { color:"#ca8a04", en:"Bookstores" },
  "Lojas":            { color:"#db2777", en:"Shops" },
  "Entretenimento":   { color:"#9333ea", en:"Entertainment" },
  "Compras":          { color:"#0369a1", en:"Shopping" },
  "Bairros":          { color:"#dc2626", en:"Neighborhoods" },
  "Comida":           { color:"#d97706", en:"Food" },
  "Mercados & Delis": { color:"#b45309", en:"Markets & Delis" },
  "Dispensaries":     { color:"#15803d", en:"Dispensaries" },
  "Bares":            { color:"#c2410c", en:"Bars" },
  "Daytrips":         { color:"#475569", en:"Daytrips" },
};

const catLabel = (cat) => isEN ? (CAT_META[cat]?.en || cat) : cat;

const S = {
  bg:"#f8f7f4", card:"#ffffff", cardHover:"#f5f4f1",
  border:"#e8e6e0", text:"#1a1a1a", textSub:"#8a8a9a", textDim:"#b0aebb",
  accent:"#ff2d55", green:"#30d158", yellow:"#ff9f0a", blue:"#007aff",
};

function normalize(str) {
  return (str||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
}

const INITIAL_PLACES = [
  { id:"t001", category:"Museus", name:"NY Transit Museum", nameEN:"NY Transit Museum", emoji:"🚇", desc:"Museu dentro de uma estacao de metro desativada em Brooklyn Heights, com vagoes vintage.", descEN:"Museum inside a decommissioned subway station in Brooklyn Heights with vintage cars.", price:"$", lat:40.6906, lng:-73.9899, time:"2h", link:"https://www.nytransitmuseum.org", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Altamente recomendado para fas de historia urbana.", repEN:"Highly recommended for urban history enthusiasts.", hours:"Ter-Dom 10h-17h, Sex 10h-20h" },
  { id:"t002", bestTime:"Manha de semana, antes das 10h para evitar filas", category:"Museus", name:"American Museum of Natural History", nameEN:"American Museum of Natural History", emoji:"🦕", desc:"O museu do Uma Noite no Museu: dinossauros, baleia azul gigante, planetario.", descEN:"The Night at the Museum museum: dinosaurs, giant blue whale, planetarium.", price:"$$", lat:40.7813, lng:-73.9740, time:"dia inteiro", link:"https://www.amnh.org", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Um dos melhores museus do mundo. Reserve pelo menos 4h.", repEN:"One of the best museums in the world. Reserve at least 4h.", hours:"Diario 10h-17h30" },
  { id:"t003", bestTime:"Sexta a noite, menos cheio e eventualmente gratis", category:"Museus", name:"MoMA", nameEN:"MoMA", emoji:"🎨", desc:"Arte moderna e contemporanea. Van Gogh, Picasso, Dali, Warhol.", descEN:"Modern and contemporary art. Van Gogh, Picasso, Dali, Warhol.", price:"$$", lat:40.7614, lng:-73.9776, time:"3h+", link:"https://www.moma.org", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Colecao incrivel. Sextas a noite tem entrada gratuita em alguns periodos.", repEN:"Incredible collection. Friday nights sometimes have free admission.", hours:"Seg-Qui e Sab-Dom 10h30-17h30, Sex 10h30-20h" },
  { id:"t004", category:"Museus", name:"9/11 Memorial & Museum", nameEN:"9/11 Memorial & Museum", emoji:"🕊️", desc:"No local exato das Torres Gemeas. Depoimentos de sobreviventes e familias.", descEN:"At the exact site of the Twin Towers. Testimonies from survivors and families.", price:"$$", lat:40.7115, lng:-74.0134, time:"3h+", link:"https://www.911memorial.org", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Experiencia profunda e necessaria.", repEN:"A deep and necessary experience.", hours:"Diario 9h-20h" },
  { id:"t005", category:"Museus", name:"Intrepid Museum", nameEN:"Intrepid Museum", emoji:"🛳️", desc:"Porta-avioes real ancorado no Hudson River com o Concorde e o Enterprise.", descEN:"Real aircraft carrier on the Hudson with the Concorde and Space Shuttle Enterprise.", price:"$$", lat:40.7645, lng:-74.0017, time:"3h+", link:"https://www.intrepidmuseum.org", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Unico e espetacular.", repEN:"Unique and spectacular." },
  { id:"t006", category:"Museus", name:"Building 92 / Brooklyn Navy Yard", nameEN:"Building 92 / Brooklyn Navy Yard", emoji:"🚢", desc:"Centro de visitantes gratuito com 200 anos de historia do estaleiro naval.", descEN:"Free visitor center with 200 years of naval shipyard history.", price:"gratis", lat:40.6990, lng:-73.9718, time:"1h", link:"https://brooklynnavyyard.org", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Joia escondida de Brooklyn. Gratuito.", repEN:"Hidden gem of Brooklyn. Free." },
  { id:"t007", category:"Museus", name:"Museum of Broadway", nameEN:"Museum of Broadway", emoji:"🎪", desc:"Tres andares com figurinos de Hamilton, Phantom, Rent e Wicked.", descEN:"Three floors of costumes from Hamilton, Phantom, Rent and Wicked.", price:"$$", lat:40.7580, lng:-73.9855, time:"2h", link:"https://www.themuseumofbroadway.com", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Essencial para fas de musicais.", repEN:"Essential for musical fans." },
  { id:"t008", category:"Monumentos", name:"NY Public Library", nameEN:"NY Public Library", emoji:"📚", desc:"A biblioteca dos leoes, classica de filme. A sala de leitura principal e de cair o queixo.", descEN:"The lions library, classic from movies. The main reading room is breathtaking.", price:"gratis", lat:40.7532, lng:-73.9822, time:"1h", link:"https://www.nypl.org", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Arquitetura deslumbrante. Gratis.", repEN:"Stunning architecture. Free." },
  { id:"t009", category:"Monumentos", name:"St. Patrick's Cathedral", nameEN:"St. Patrick's Cathedral", emoji:"⛪", desc:"Catedral neogotica no meio da 5th Ave, impressionante por dentro com os vitrais.", descEN:"Neo-Gothic cathedral in the middle of 5th Ave, stunning stained glass inside.", price:"gratis", lat:40.7586, lng:-73.9762, time:"30min", petFriendly:false, publicBathroom:false, season:"sempre", rep:"A luz pelos vitrais e cinematografica.", repEN:"The light through the stained glass is cinematic." },
  { id:"t010", category:"Monumentos", name:"NYSE + Charging Bull", nameEN:"NYSE + Charging Bull", emoji:"🐂", desc:"Fachada neoclassica da bolsa na Wall Street e o touro de bronze iconico do FiDi.", descEN:"Neoclassical stock exchange facade on Wall Street and the iconic bronze bull.", price:"gratis", lat:40.7069, lng:-74.0089, time:"30min", petFriendly:true, publicBathroom:false, season:"sempre", rep:"Classico de NYC.", repEN:"NYC classic." },
  { id:"t011", category:"Monumentos", name:"Brooklyn Heights Promenade", nameEN:"Brooklyn Heights Promenade", emoji:"🌆", desc:"Calcadao suspenso com vista panoramica da skyline. Mais tranquilo que a ponte.", descEN:"Elevated walkway with panoramic skyline views. More peaceful than the bridge.", price:"gratis", lat:40.6962, lng:-73.9991, time:"1h", petFriendly:true, publicBathroom:false, season:"sempre", rep:"A melhor vista de Manhattan.", repEN:"The best view of Manhattan." },
  { id:"t012", category:"Monumentos", name:"Central Park", nameEN:"Central Park", emoji:"🌳", desc:"Bethesda Fountain, The Ramble, Belvedere Castle, Reservoir e Conservatory Garden.", descEN:"Bethesda Fountain, The Ramble, Belvedere Castle, Reservoir and Conservatory Garden.", price:"gratis", lat:40.7812, lng:-73.9665, time:"3h+", petFriendly:true, publicBathroom:true, season:"primavera", rep:"The Ramble e incrivel para birdwatching.", repEN:"The Ramble is incredible for birdwatching." },
  { id:"t013", needsReservation:true, bestTime:"Apos as 19h, experiencia noturna incrivel", category:"Observatorios", name:"SUMMIT One Vanderbilt", nameEN:"SUMMIT One Vanderbilt", emoji:"🔮", desc:"Instalacoes de arte com espelhos e vidro, vistas deslumbrantes. Abre ate meia-noite.", descEN:"Art installations with mirrors and glass, stunning views. Open until midnight.", price:"$$$", lat:40.7527, lng:-73.9772, time:"2h", link:"https://summitov.com", petFriendly:false, publicBathroom:true, season:"sempre", rep:"O mais impressionante dos observatorios.", repEN:"The most impressive of the observatories.", hours:"Dom-Qui 9h-23h, Sex-Sab 9h-2h" },
  { id:"t014", needsReservation:true, bestTime:"Por do sol, chegue 30min antes das 17h", category:"Observatorios", name:"Top of the Rock", nameEN:"Top of the Rock", emoji:"🏙️", desc:"No Rockefeller Center, com a view classica com o Empire State no meio da foto.", descEN:"At Rockefeller Center, with the classic view of the Empire State in the photo.", price:"$$$", lat:40.7593, lng:-73.9787, time:"1h", link:"https://www.topoftherocknyc.com", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Va no por do sol para ver a cidade acender.", repEN:"Go at sunset to see the city light up.", hours:"Diario 9h-0h" },
  { id:"t015", needsReservation:true, bestTime:"Entardecer, por volta das 17h para ver a cidade acender", category:"Observatorios", name:"Empire State Building", nameEN:"Empire State Building", emoji:"🌃", desc:"O icone absoluto de Nova York. Abre ate 11:30pm, otimo pra ir ao anoitecer.", descEN:"The absolute icon of New York. Open until 11:30pm, great for sunset.", price:"$$$", lat:40.7484, lng:-73.9857, time:"2h", link:"https://www.esbnyc.com", petFriendly:false, publicBathroom:true, season:"sempre", rep:"O classico dos classicos. Reserve online.", repEN:"The classic of classics. Book online.", hours:"Diario 9h-23h30" },
  { id:"t016", category:"Observatorios", name:"The Edge", nameEN:"The Edge", emoji:"🫧", desc:"Terraco de vidro em Hudson Yards que parece que voce ta voando sobre a cidade.", descEN:"Glass terrace at Hudson Yards that feels like flying over the city.", price:"$$$", lat:40.7534, lng:-74.0010, time:"1h", link:"https://edgenyc.com", petFriendly:false, publicBathroom:true, season:"sempre", rep:"O piso de vidro da um frio na barriga incrivel.", repEN:"The glass floor gives an incredible thrill.", hours:"Diario 10h-22h" },
  { id:"t017", category:"Observatorios", name:"One World Observatory", nameEN:"One World Observatory", emoji:"🌍", desc:"No topo do World Trade Center, o predio mais alto do hemisferio ocidental.", descEN:"At the top of the World Trade Center, the tallest building in the Western Hemisphere.", price:"$$$", lat:40.7130, lng:-74.0134, time:"1h", link:"https://www.oneworldobservatory.com", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Vista para o Downtown e Hudson River.", repEN:"Views of Downtown and the Hudson River.", hours:"Diario 9h-21h" },
  { id:"t018", category:"Natureza", name:"Prospect Park", nameEN:"Prospect Park", emoji:"🌲", desc:"O grande parque de Brooklyn, projetado pelos mesmos criadores do Central Park.", descEN:"Brooklyn's great park, designed by the same creators of Central Park.", price:"gratis", lat:40.6602, lng:-73.9690, time:"3h+", petFriendly:true, publicBathroom:true, season:"primavera", rep:"Menos turista que o Central Park, mais genuino.", repEN:"Less touristy than Central Park, more genuine." },
  { id:"t019", category:"Natureza", name:"Bronx Zoo", nameEN:"Bronx Zoo", emoji:"🦁", desc:"Um dos maiores zoologicos urbanos do mundo, no Bronx.", descEN:"One of the world's largest urban zoos, in the Bronx.", price:"$$", lat:40.8506, lng:-73.8770, time:"dia inteiro", link:"https://bronxzoo.com", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Enorme e incrivel. Separe o dia inteiro.", repEN:"Huge and incredible. Set aside the whole day." },
  { id:"t020", bestTime:"Tarde de primavera, flores em bloom no parque", category:"Natureza", name:"The High Line", nameEN:"The High Line", emoji:"🌿", desc:"Parque linear suspenso numa ferrovia desativada no West Side.", descEN:"Elevated linear park on a decommissioned railway on the West Side.", price:"gratis", lat:40.7480, lng:-74.0048, time:"2h", link:"https://www.thehighline.org", petFriendly:true, publicBathroom:true, season:"primavera", rep:"Um dos melhores projetos urbanos do seculo.", repEN:"One of the best urban projects of the century." },
  { id:"pr001", category:"Praias", name:"Coney Island", nameEN:"Coney Island", emoji:"🎡", desc:"Praia iconica com o parque Luna Park e o cachorro-quente do Nathan's Famous.", descEN:"Iconic beach with Luna Park and Nathan's Famous hot dogs.", price:"$", lat:40.5755, lng:-73.9707, time:"dia inteiro", petFriendly:true, publicBathroom:true, season:"verao", rep:"Nostalgia pura. Melhor no verao.", repEN:"Pure nostalgia. Best in summer." },
  { id:"pr002", bestTime:"Manha de semana, praia praticamente vazia", category:"Praias", name:"Rockaway Beach", nameEN:"Rockaway Beach", emoji:"🏄", desc:"Praia em Queens acessivel de metro. Boa pra surfe e com bares na orla.", descEN:"Queens beach accessible by subway. Great for surfing with bars on the boardwalk.", price:"gratis", lat:40.5843, lng:-73.8351, time:"dia inteiro", petFriendly:true, publicBathroom:true, season:"verao", rep:"A praia urbana mais legal dos EUA.", repEN:"The coolest urban beach in the US." },
  { id:"pr003", category:"Praias", name:"Long Beach, NY", nameEN:"Long Beach, NY", emoji:"🌊", desc:"A praia mais acessivel de NYC via LIRR, com boardwalk e boa infraestrutura.", descEN:"Most accessible beach from NYC via LIRR, with boardwalk and good facilities.", price:"$", lat:40.5882, lng:-73.6585, time:"dia inteiro", petFriendly:false, publicBathroom:true, season:"verao", rep:"30 minutos de Penn Station.", repEN:"30 minutes from Penn Station." },
  { id:"pr004", category:"Praias", name:"Brighton Beach", nameEN:"Brighton Beach", emoji:"🇺🇦", desc:"Praia russa em Brooklyn com mercados, restaurantes sovieticos e atmosfera unica.", descEN:"Russian beach in Brooklyn with markets, Soviet restaurants and unique atmosphere.", price:"gratis", lat:40.5779, lng:-73.9612, time:"3h+", petFriendly:true, publicBathroom:true, season:"verao", rep:"Uma volta ao mundo sem sair de Brooklyn.", repEN:"A trip around the world without leaving Brooklyn." },
  { id:"pr005", category:"Praias", name:"Jacob Riis Park", nameEN:"Jacob Riis Park", emoji:"🏖️", desc:"Praia preservada no Queens com atmosfera vintage e menos turista.", descEN:"Preserved beach in Queens with a vintage atmosphere and fewer tourists.", price:"gratis", lat:40.5618, lng:-73.8904, time:"dia inteiro", petFriendly:true, publicBathroom:true, season:"verao", rep:"A praia favorita dos nova-iorquinos que sabem.", repEN:"The favorite beach of savvy New Yorkers." },
  { id:"pr006", category:"Praias", name:"Sandy Hook, NJ", nameEN:"Sandy Hook, NJ", emoji:"🦅", desc:"Peninsula pristina em NJ com praias federais, trilhas e vista de Manhattan.", descEN:"Pristine NJ peninsula with federal beaches, trails and Manhattan views.", price:"$", lat:40.4643, lng:-74.0094, time:"dia inteiro", petFriendly:true, publicBathroom:true, season:"verao", rep:"A praia mais bonita da regiao.", repEN:"The most beautiful beach in the region." },
  { id:"pr007", category:"Praias", name:"Fire Island, NY", nameEN:"Fire Island, NY", emoji:"🏝️", desc:"Ilha sem carros no Atlantico com praias paradisiacas e comunidade LGBTQ+.", descEN:"Car-free Atlantic island with paradisiacal beaches and vibrant LGBTQ+ community.", price:"$$", lat:40.6318, lng:-73.1271, time:"dia inteiro", petFriendly:false, publicBathroom:true, season:"verao", rep:"Praia mais bonita proximo a NYC.", repEN:"Most beautiful beach near NYC." },
  { id:"md001", bestTime:"Sabado entre 10h-12h antes de lotar", category:"Mercados & Delis", name:"Smorgasburg", nameEN:"Smorgasburg", emoji:"🥘", desc:"Maior mercado de comida ao ar livre dos EUA, todo sabado em Williamsburg.", descEN:"Largest outdoor food market in the US, every Saturday in Williamsburg.", price:"$", lat:40.7223, lng:-73.9572, time:"2h", link:"https://www.smorgasburg.com", petFriendly:true, publicBathroom:true, season:"verao", rep:"O melhor mercado de comida dos EUA.", repEN:"The best food market in the US.", hours:"Sab 11h-18h (Williamsburg)" },
  { id:"md002", category:"Mercados & Delis", name:"Chelsea Market", nameEN:"Chelsea Market", emoji:"🥐", desc:"Mercado gourmet coberto numa antiga fabrica de biscoitos no Meatpacking.", descEN:"Covered gourmet market in a former cookie factory in the Meatpacking District.", price:"$$", lat:40.7424, lng:-74.0048, time:"2h", link:"https://www.chelseamarket.com", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Perfeito para almocar.", repEN:"Perfect for lunch." },
  { id:"md003", category:"Mercados & Delis", name:"Katz's Delicatessen", nameEN:"Katz's Delicatessen", emoji:"🥪", desc:"O deli mais famoso de NY, desde 1888. O sanduiche de pastrami e lendario.", descEN:"NY's most famous deli, since 1888. The pastrami sandwich is legendary.", price:"$$", lat:40.7223, lng:-73.9874, time:"1h", link:"https://katzsdelicatessen.com", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Uma instituicao. O pastrami e transcendental.", repEN:"An institution. The pastrami is transcendental.", hours:"Seg-Qua 8h-22h45, Qui-Dom 24h" },
  { id:"md004", category:"Mercados & Delis", name:"Russ & Daughters", nameEN:"Russ & Daughters", emoji:"🐟", desc:"Salmao defumado, cream cheese e bagel no Lower East Side desde 1914.", descEN:"Smoked salmon, cream cheese and bagel on the Lower East Side since 1914.", price:"$$", lat:40.7220, lng:-73.9876, time:"1h", link:"https://www.russanddaughters.com", petFriendly:false, publicBathroom:false, season:"sempre", rep:"Lendario. O melhor bagel com lox do mundo.", repEN:"Legendary. The best lox bagel in the world.", hours:"Seg-Sex 8h-18h, Sab 8h-19h, Dom 8h-17h30" },
  { id:"md005", category:"Mercados & Delis", name:"Essex Market", nameEN:"Essex Market", emoji:"🏬", desc:"Mercado gourmet moderno no Lower East Side, com bancas de comida do mundo todo.", descEN:"Modern gourmet market on the Lower East Side with food stalls from around the world.", price:"$$", lat:40.7183, lng:-73.9860, time:"1h", petFriendly:false, publicBathroom:true, season:"sempre", rep:"O mercado moderno do LES. Diverso e delicioso.", repEN:"The modern LES market. Diverse and delicious." },
  { id:"md006", category:"Mercados & Delis", name:"Union Square Greenmarket", nameEN:"Union Square Greenmarket", emoji:"🥬", desc:"Mercado de produtores locais todo sabado e quarta em Union Square.", descEN:"Local farmers market every Saturday and Wednesday at Union Square.", price:"$", lat:40.7359, lng:-73.9906, time:"1h", petFriendly:true, publicBathroom:false, season:"sempre", rep:"O melhor mercado de agricultores de NYC.", repEN:"The best farmers market in NYC.", hours:"Sab 8h-18h, Qua 8h-18h" },
  { id:"md007", category:"Mercados & Delis", name:"Zabar's", nameEN:"Zabar's", emoji:"🧀", desc:"Deli gourmet lendario no Upper West Side desde 1934. Queijos, defumados e delicatessen.", descEN:"Legendary gourmet deli on the Upper West Side since 1934. Cheeses, smoked fish.", price:"$$", lat:40.7844, lng:-73.9830, time:"1h", link:"https://zabars.com", petFriendly:false, publicBathroom:false, season:"sempre", rep:"Uma instituicao nova-iorquina.", repEN:"A New York institution.", hours:"Seg-Sex 8h-19h30, Sab 8h-20h, Dom 9h-18h" },
  { id:"md008", category:"Mercados & Delis", name:"Barney Greengrass", nameEN:"Barney Greengrass", emoji:"🥚", desc:"O rei do esturjao desde 1908 no Upper West Side. Brunch lendario.", descEN:"The sturgeon king since 1908 on the Upper West Side. Legendary brunch.", price:"$$", lat:40.7851, lng:-73.9804, time:"1h", petFriendly:false, publicBathroom:false, season:"sempre", rep:"Cafe da manha mais famoso do Upper West Side.", repEN:"Most famous breakfast on the Upper West Side.", hours:"Ter-Dom 8h30-16h" },
  { id:"md009", category:"Mercados & Delis", name:"Astor Wines & Spirits", nameEN:"Astor Wines & Spirits", emoji:"🍷", desc:"Uma das melhores adegas de NYC, no East Village. Selecao enorme e precos justos.", descEN:"One of NYC's best wine shops, in the East Village. Huge selection, fair prices.", price:"$$", lat:40.7284, lng:-73.9899, time:"30min", link:"https://astorwines.com", petFriendly:false, publicBathroom:false, season:"sempre", rep:"A melhor loja de vinhos de NYC.", repEN:"The best wine shop in NYC." },
  { id:"md010", category:"Mercados & Delis", name:"Park Avenue Liquor Shop", nameEN:"Park Avenue Liquor Shop", emoji:"🥃", desc:"Loja especializada em whisky com uma das maiores selecoes de bourbon dos EUA.", descEN:"Whisky specialty store with one of the largest bourbon selections in the US.", price:"$$$", lat:40.7512, lng:-73.9779, time:"30min", link:"https://parkavenueli.com", petFriendly:false, publicBathroom:false, season:"sempre", rep:"Paraiso para fas de whisky.", repEN:"Paradise for whisky lovers." },
  { id:"md011", category:"Mercados & Delis", name:"DeKalb Market Hall", nameEN:"DeKalb Market Hall", emoji:"🍱", desc:"Food hall no subsolo do City Point em Brooklyn com 40 bancas de comida.", descEN:"Food hall in the basement of City Point in Brooklyn with 40 food stalls.", price:"$", lat:40.6908, lng:-73.9832, time:"1h", petFriendly:false, publicBathroom:true, season:"sempre", rep:"O melhor food hall de Brooklyn.", repEN:"The best food hall in Brooklyn." },
  { id:"md012", category:"Mercados & Delis", name:"Brooklyn Flea", nameEN:"Brooklyn Flea", emoji:"🛺", desc:"Mercado de pulgas e vintage aos fins de semana. Comida, antiguidades e artesanato.", descEN:"Flea and vintage market on weekends. Food, antiques and crafts.", price:"$", lat:40.7223, lng:-73.9572, time:"2h", link:"https://brooklynflea.com", petFriendly:true, publicBathroom:false, season:"verao", rep:"O mercado de pulgas mais cool de NYC.", repEN:"The coolest flea market in NYC." },
  { id:"t021", category:"Livrarias", name:"The Strand", nameEN:"The Strand", emoji:"📖", desc:"4 andares e 18 milhas de livros na Union Square.", descEN:"4 floors and 18 miles of books at Union Square.", price:"$", lat:40.7330, lng:-73.9910, time:"1h", link:"https://www.strandbooks.com", petFriendly:false, publicBathroom:false, season:"sempre", rep:"Uma das livrarias mais famosas do mundo.", repEN:"One of the most famous bookstores in the world.", hours:"Seg-Sab 10h-22h30, Dom 11h-22h30" },
  { id:"t022", category:"Livrarias", name:"The Ripped Bodice", nameEN:"The Ripped Bodice", emoji:"💘", desc:"Livraria especializada em romance em Park Slope, Brooklyn.", descEN:"Romance specialty bookstore in Park Slope, Brooklyn.", price:"$", lat:40.6761, lng:-73.9810, time:"1h", link:"https://www.therippedbodicebklyn.com", petFriendly:false, publicBathroom:false, season:"sempre", rep:"Joia de Park Slope.", repEN:"Gem of Park Slope." },
  { id:"t023", category:"Lojas", name:"Nintendo NY", nameEN:"Nintendo NY", emoji:"🎮", desc:"No Rockefeller Plaza, com merchandise exclusivo e demos de jogos.", descEN:"At Rockefeller Plaza, with exclusive merchandise and game demos.", price:"$", lat:40.7582, lng:-73.9796, time:"1h", petFriendly:false, publicBathroom:false, season:"sempre", rep:"Paraiso para gamers.", repEN:"Paradise for gamers." },
  { id:"t024", category:"Lojas", name:"Disney Store", nameEN:"Disney Store", emoji:"✨", desc:"Na area da Times Square, dois andares de tudo que e Disney, Marvel e Pixar.", descEN:"In the Times Square area, two floors of Disney, Marvel and Pixar everything.", price:"$", lat:40.7574, lng:-73.9857, time:"1h", petFriendly:false, publicBathroom:false, season:"sempre", rep:"Maior Disney Store do mundo.", repEN:"Largest Disney Store in the world." },
  { id:"t025", category:"Lojas", name:"Hershey's + M&M + Lego", nameEN:"Hershey's + M&M + Lego", emoji:"🍫", desc:"As tres gigantes na Times Square.", descEN:"The three giants at Times Square.", price:"$", lat:40.7580, lng:-73.9845, time:"1h", petFriendly:false, publicBathroom:false, season:"sempre", rep:"Mais pela experiencia visual.", repEN:"More for the visual experience." },
  { id:"t026", category:"Entretenimento", name:"SPYSCAPE", nameEN:"SPYSCAPE", emoji:"🕵️", desc:"Museu interativo de espionagem: quebra codigos e descobre seu perfil de espiao.", descEN:"Interactive spy museum: crack codes and discover your spy profile.", price:"$$", lat:40.7634, lng:-73.9863, time:"2h", link:"https://spyscape.com", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Super interativo e surpreendente.", repEN:"Super interactive and surprising." },
  { id:"t027", category:"Entretenimento", name:"Show no Madison Square Garden", nameEN:"Show at Madison Square Garden", emoji:"🎵", desc:"O maior e mais famoso venue indoor de NY.", descEN:"The largest and most famous indoor venue in NY.", price:"$$$", lat:40.7505, lng:-73.9934, time:"3h+", link:"https://www.msg.com", petFriendly:false, publicBathroom:true, season:"sempre", rep:"O Garden e uma lenda.", repEN:"The Garden is a legend." },
  { id:"t028", category:"Entretenimento", name:"PARAISO - Westlight Rooftop", nameEN:"PARAISO - Westlight Rooftop", emoji:"🎉", desc:"Festa semanal aos domingos no rooftop do William Vale, Williamsburg.", descEN:"Weekly Sunday party on the William Vale rooftop, Williamsburg.", price:"$$", lat:40.7181, lng:-73.9566, time:"3h+", link:"https://www.paraisonyc.com", petFriendly:false, publicBathroom:true, season:"verao", rep:"Um dos melhores rooftops de NYC.", repEN:"One of the best rooftops in NYC." },
  { id:"t029", category:"Entretenimento", name:"Ellen's Stardust Diner", nameEN:"Ellen's Stardust Diner", emoji:"🎤", desc:"Restaurante dos garcons que cantam na Broadway, tematico dos anos 50.", descEN:"Restaurant with singing waiters on Broadway, 1950s themed.", price:"$$", lat:40.7614, lng:-73.9848, time:"2h", link:"https://www.ellensstardustdiner.com", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Experiencia unica em NYC.", repEN:"Unique experience in NYC." },
  { id:"t030", category:"Bares", name:"Bares Speakeasy", nameEN:"Speakeasy Bars", emoji:"🤫", desc:"Bares secretos escondidos atras de cafeterias e cabines telefonicas.", descEN:"Secret bars hidden behind cafeterias and phone booths.", price:"$$", lat:40.7282, lng:-74.0076, time:"2h", petFriendly:false, publicBathroom:true, season:"sempre", rep:"PDT e Please Don't Tell sao os mais famosos.", repEN:"PDT and Please Don't Tell are the most famous.", link:"https://pdtnyc.com" },
  { id:"t031", category:"Entretenimento", name:"Brooklyn Mirage", nameEN:"Brooklyn Mirage", emoji:"🎧", desc:"O maior venue de musica eletronica dos EUA, em Queens.", descEN:"The largest electronic music venue in the US, in Queens.", price:"$$", lat:40.6985, lng:-73.9318, time:"3h+", link:"https://www.avant-gardner.com", petFriendly:false, publicBathroom:true, season:"verao", rep:"O melhor venue de eletronico dos EUA.", repEN:"The best electronic music venue in the US." },
  { id:"t032", category:"Entretenimento", name:"Comedy Cellar", nameEN:"Comedy Cellar", emoji:"😂", desc:"O clube de stand-up mais lendario de NY no Village.", descEN:"The most legendary stand-up club in NY in the Village.", price:"$$", lat:40.7302, lng:-74.0005, time:"2h", link:"https://www.comedycellar.com", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Dave Chappelle e Louis CK aparecem sem aviso.", repEN:"Dave Chappelle and Louis CK show up unannounced." },
  { id:"t033", needsReservation:true, category:"Entretenimento", name:"Sleep No More", nameEN:"Sleep No More", emoji:"👻", desc:"Peca imersiva de teatro noir onde voce vaga por um hotel de 5 andares.", descEN:"Immersive noir theater piece where you roam a 5-floor hotel.", price:"$$$", lat:40.7467, lng:-74.0014, time:"3h+", link:"https://www.sleepnomorenyc.com", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Uma das experiencias mais unicas do mundo.", repEN:"One of the most unique experiences in the world." },
  { id:"t034", category:"Entretenimento", name:"Karaoke em Koreatown", nameEN:"Koreatown Karaoke", emoji:"🎙️", desc:"32nd St. Karaoke privativo (norebang) disponivel ate de madrugada.", descEN:"32nd St. Private karaoke (norebang) available until late at night.", price:"$$", lat:40.7484, lng:-73.9878, time:"2h", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Norebang privativo e muito melhor que karaoke comum.", repEN:"Private norebang is much better than regular karaoke." },
  { id:"t035", needsReservation:true, category:"Entretenimento", name:"Ver um show na Broadway", nameEN:"See a Broadway Show", emoji:"🎟️", desc:"Um classico que nao pode faltar. A experiencia mais nova-iorquina que existe.", descEN:"A classic not to miss. The most New York experience there is.", price:"$$$", lat:40.7590, lng:-73.9845, time:"3h+", link:"https://www.broadway.com", petFriendly:false, publicBathroom:true, season:"sempre", rep:"TKTS na Times Square tem ingressos com ate 50% de desconto.", repEN:"TKTS at Times Square has tickets up to 50% off." },
  { id:"t036", category:"Comida", name:"Joe's Pizza", nameEN:"Joe's Pizza", emoji:"🍕", desc:"A fatia de pizza mais classica de NY desde 1975.", descEN:"The most classic NY pizza slice since 1975.", price:"$", lat:40.7306, lng:-74.0022, time:"30min", link:"https://www.joespizzanyc.com", petFriendly:false, publicBathroom:false, season:"sempre", rep:"A pizza perfeita de NYC.", repEN:"The perfect NYC pizza." },
  { id:"t037", category:"Comida", name:"Di Fara Pizza", nameEN:"Di Fara Pizza", emoji:"🫓", desc:"A pizza mais famosa de Brooklyn, feita a mao pelo mesmo dono ha decadas.", descEN:"Brooklyn's most famous pizza, handmade by the same owner for decades.", price:"$", lat:40.6249, lng:-73.9612, time:"1h", petFriendly:false, publicBathroom:false, season:"sempre", rep:"Peregrinacao obrigatoria para fas de pizza.", repEN:"Mandatory pilgrimage for pizza lovers." },
  { id:"t038", category:"Comida", name:"Levain Bakery", nameEN:"Levain Bakery", emoji:"🍪", desc:"O cookie de chocolate mais famoso de NY. Enorme, cremoso e quente.", descEN:"NY's most famous chocolate cookie. Enormous, creamy and warm.", price:"$", lat:40.7812, lng:-73.9803, time:"30min", link:"https://levainbakery.com", petFriendly:false, publicBathroom:false, season:"sempre", rep:"O cookie mais famoso de NYC.", repEN:"NYC's most famous cookie." },
  { id:"t039", needsReservation:true, category:"Comida", name:"Peter Luger Steak House", nameEN:"Peter Luger Steak House", emoji:"🥩", desc:"A churrascaria mais famosa de NY, em Williamsburg desde 1887. So aceita dinheiro.", descEN:"NY's most famous steakhouse, in Williamsburg since 1887. Cash only.", price:"$$$", lat:40.7099, lng:-73.9625, time:"2h", link:"https://peterluger.com", petFriendly:false, publicBathroom:true, season:"sempre", rep:"A melhor churrascaria dos EUA. Reserve meses antes.", repEN:"The best steakhouse in the US. Book months ahead." },
  { id:"t040", category:"Comida", name:"Momofuku Noodle Bar", nameEN:"Momofuku Noodle Bar", emoji:"🍜", desc:"O restaurante original do David Chang no East Village. Ramen e buns lendarios.", descEN:"David Chang's original restaurant in the East Village. Legendary ramen and buns.", price:"$$", lat:40.7285, lng:-73.9842, time:"1h", link:"https://momofuku.com", petFriendly:false, publicBathroom:false, season:"sempre", rep:"Imprescindivel para fas de gastronomia.", repEN:"Essential for food lovers." },
  { id:"t041", category:"Compras", name:"American Dream Outlet", nameEN:"American Dream Outlet", emoji:"🛍️", desc:"O maior outlet de NJ com parque de diversoes, pista de esqui indoor e aquario.", descEN:"NJ's largest outlet with amusement park, indoor ski slope and aquarium.", price:"$$", lat:40.8135, lng:-74.0669, time:"dia inteiro", link:"https://www.americandream.com", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Muito alem de um outlet.", repEN:"Way more than an outlet." },
  { id:"s001", bestTime:"Manha de domingo quando abre, antes do pico", category:"Bairros", name:"Governors Island", nameEN:"Governors Island", emoji:"⛵", desc:"Ilha sem carros na baia com arte, piquenique e vista pro Downtown.", descEN:"Car-free island in the bay with art, picnics and Downtown views.", price:"gratis", lat:40.6895, lng:-74.0165, time:"3h+", link:"https://govisland.com", petFriendly:true, publicBathroom:true, season:"verao", rep:"Esconderijo perfeito no verao.", repEN:"Perfect summer hideaway." },
  { id:"s002", category:"Bairros", name:"Roosevelt Island", nameEN:"Roosevelt Island", emoji:"🌉", desc:"Ilhinha no East River com tramway iconico saindo da 2nd Ave.", descEN:"Small island in the East River with an iconic tramway from 2nd Ave.", price:"gratis", lat:40.7614, lng:-73.9506, time:"2h", petFriendly:true, publicBathroom:false, season:"sempre", rep:"Muito subestimado. O tramway e uma experiencia unica.", repEN:"Very underrated. The tramway is a unique experience." },
  { id:"s003", category:"Bairros", name:"Harlem", nameEN:"Harlem", emoji:"🎷", desc:"Berco do jazz e da cultura negra americana. Gospel, soul food e murais.", descEN:"Birthplace of jazz and Black American culture. Gospel, soul food and murals.", price:"$", lat:40.8116, lng:-73.9465, time:"3h+", petFriendly:true, publicBathroom:false, season:"sempre", rep:"Visita cultural essencial.", repEN:"Essential cultural visit." },
  { id:"s004", category:"Bairros", name:"Astoria, Queens", nameEN:"Astoria, Queens", emoji:"🇬🇷", desc:"Bairro grego com otimos restaurantes, museu de cinema e atmosfera europeia.", descEN:"Greek neighborhood with great restaurants, film museum and European atmosphere.", price:"$", lat:40.7721, lng:-73.9302, time:"3h+", petFriendly:true, publicBathroom:false, season:"sempre", rep:"A melhor comida grega fora da Grecia.", repEN:"The best Greek food outside of Greece." },
  { id:"s005", category:"Bairros", name:"Flushing, Queens", nameEN:"Flushing, Queens", emoji:"🥟", desc:"A melhor gastronomia asiatica fora da Asia. Chinatown gigante com dim sum.", descEN:"The best Asian cuisine outside of Asia. Giant Chinatown with dim sum.", price:"$", lat:40.7675, lng:-73.8330, time:"3h+", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Para os amantes de comida asiatica e um paraiso.", repEN:"A paradise for Asian food lovers." },
  { id:"s006", category:"Bairros", name:"Little Italy & Chinatown", nameEN:"Little Italy & Chinatown", emoji:"🍝", desc:"Dois bairros historicos em Lower Manhattan. Cannoli, dumplings e historia.", descEN:"Two historic neighborhoods in Lower Manhattan. Cannoli, dumplings and history.", price:"$", lat:40.7188, lng:-73.9973, time:"2h", petFriendly:true, publicBathroom:false, season:"sempre", rep:"Little Italy e pequena mas charmosa.", repEN:"Little Italy is small but charming." },
  { id:"s007", category:"Bairros", name:"Greenpoint, Brooklyn", nameEN:"Greenpoint, Brooklyn", emoji:"🇵🇱", desc:"Bairro polones com cafes independentes, galerias e vista da skyline.", descEN:"Polish neighborhood with independent cafes, galleries and skyline views.", price:"$", lat:40.7242, lng:-73.9480, time:"2h", petFriendly:true, publicBathroom:false, season:"sempre", rep:"O bairro mais charmoso de Brooklyn.", repEN:"Brooklyn's most charming neighborhood." },
  { id:"s008", category:"Bairros", name:"Red Hook, Brooklyn", nameEN:"Red Hook, Brooklyn", emoji:"⚓", desc:"Antigo bairro industrial na beira d'agua com galerias e cervejarias.", descEN:"Former industrial waterfront neighborhood with galleries and breweries.", price:"$", lat:40.6759, lng:-74.0109, time:"2h", petFriendly:true, publicBathroom:false, season:"verao", rep:"Off the beaten path mas vale muito.", repEN:"Off the beaten path but well worth it." },
  { id:"s009", category:"Bairros", name:"Jackson Heights, Queens", nameEN:"Jackson Heights, Queens", emoji:"🇮🇳", desc:"Bairro mais diverso do mundo. Culinaria sul-asiatica, latina e muito mais.", descEN:"World's most diverse neighborhood. South Asian, Latin cuisine and much more.", price:"$", lat:40.7498, lng:-73.8831, time:"2h", petFriendly:true, publicBathroom:false, season:"sempre", rep:"Uma volta ao mundo em alguns quarteiroes.", repEN:"A trip around the world in a few blocks." },
  { id:"s010", category:"Museus", name:"Whitney Museum", nameEN:"Whitney Museum", emoji:"🖌️", desc:"Arte americana contemporanea no Meatpacking District com terraco incrivel.", descEN:"Contemporary American art in the Meatpacking District with an incredible terrace.", price:"$$", lat:40.7396, lng:-74.0089, time:"2h", link:"https://whitney.org", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Colecao americana extraordinaria.", repEN:"Extraordinary American collection." },
  { id:"s011", bestTime:"Manha cedo ou tarde da tarde, evite fins de semana", category:"Museus", name:"The Met", nameEN:"The Met", emoji:"🏛️", desc:"Um dos maiores museus do mundo. Egito, armaduras medievais, impressionismo.", descEN:"One of the world's greatest museums. Egypt, medieval armor, Impressionism.", price:"$$", lat:40.7794, lng:-73.9632, time:"dia inteiro", link:"https://www.metmuseum.org", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Poderia passar uma semana e nao ver tudo.", repEN:"You could spend a week and not see everything.", hours:"Seg-Qui e Dom 10h-17h, Sex-Sab 10h-21h" },
  { id:"s012", category:"Museus", name:"Guggenheim", nameEN:"Guggenheim", emoji:"🌀", desc:"O predio em espiral de Frank Lloyd Wright ja e arte.", descEN:"Frank Lloyd Wright's spiral building is itself a work of art.", price:"$$", lat:40.7830, lng:-73.9590, time:"2h", link:"https://www.guggenheim.org", petFriendly:false, publicBathroom:true, season:"sempre", rep:"O edificio sozinho ja justifica a visita.", repEN:"The building alone justifies the visit." },
  { id:"s013", category:"Museus", name:"Tenement Museum", nameEN:"Tenement Museum", emoji:"🏚️", desc:"Visita guiada a apartamentos de imigrantes preservados do seculo XIX.", descEN:"Guided tour of preserved 19th-century immigrant apartments.", price:"$$", lat:40.7183, lng:-73.9898, time:"2h", link:"https://www.tenement.org", petFriendly:false, publicBathroom:false, season:"sempre", rep:"Uma das experiencias mais tocantes de NYC.", repEN:"One of the most moving experiences in NYC." },
  { id:"s014", category:"Museus", name:"Brooklyn Museum", nameEN:"Brooklyn Museum", emoji:"🖼️", desc:"Segundo maior museu de arte dos EUA com colecao egipcia impressionante.", descEN:"Second largest art museum in the US with an impressive Egyptian collection.", price:"$$", lat:40.6712, lng:-73.9636, time:"3h+", link:"https://www.brooklynmuseum.org", petFriendly:false, publicBathroom:true, season:"sempre", rep:"A colecao egipcia rivaliza com o Met.", repEN:"The Egyptian collection rivals the Met." },
  { id:"s015", category:"Museus", name:"Frick Collection", nameEN:"Frick Collection", emoji:"🎻", desc:"Mansao do seculo XIX transformada em museu com Vermeer, Rembrandt e Renoir.", descEN:"19th-century mansion turned museum with Vermeer, Rembrandt and Renoir.", price:"$$", lat:40.7713, lng:-73.9672, time:"2h", link:"https://www.frick.org", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Experiencia unica de ver arte numa mansao.", repEN:"Unique experience of seeing art in a mansion." },
  { id:"s016", needsReservation:true, category:"Monumentos", name:"Estatua da Liberdade", nameEN:"Statue of Liberty", emoji:"🗽", desc:"Balsa de Battery Park pra Liberty Island. Reserve com antecedencia pra subir.", descEN:"Ferry from Battery Park to Liberty Island. Book ahead to climb to the crown.", price:"$$", lat:40.6892, lng:-74.0445, time:"3h+", link:"https://www.nps.gov/stli", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Reserve para subir na coroa com meses de antecedencia.", repEN:"Book months ahead to climb to the crown." },
  { id:"s017", category:"Monumentos", name:"Grand Central Terminal", nameEN:"Grand Central Terminal", emoji:"🚂", desc:"A estacao de trem mais bela do mundo com teto estrelado e o Whispering Gallery.", descEN:"The world's most beautiful train station with a star ceiling and Whispering Gallery.", price:"gratis", lat:40.7527, lng:-73.9772, time:"30min", petFriendly:false, publicBathroom:true, season:"sempre", rep:"O Whispering Gallery e magico.", repEN:"The Whispering Gallery is magical." },
  { id:"s018", category:"Monumentos", name:"Washington Square Park", nameEN:"Washington Square Park", emoji:"🌸", desc:"O parque mais vivo de Manhattan com musicos, xadrez e skatistas.", descEN:"Manhattan's most vibrant park with musicians, chess players and skaters.", price:"gratis", lat:40.7308, lng:-74.0002, time:"1h", petFriendly:true, publicBathroom:true, season:"primavera", rep:"O coracao do Greenwich Village.", repEN:"The heart of Greenwich Village." },
  { id:"s019", bestTime:"Sabado de manha, chega cedo antes das 11h", category:"Monumentos", name:"Little Island", nameEN:"Little Island", emoji:"🌺", desc:"Parque flutuante no Hudson River no Meatpacking, inaugurado em 2021.", descEN:"Floating park on the Hudson River in the Meatpacking District, opened in 2021.", price:"gratis", lat:40.7438, lng:-74.0094, time:"1h", link:"https://littleisland.org", petFriendly:true, publicBathroom:true, season:"primavera", rep:"O projeto de parque mais bonito do seculo em NYC.", repEN:"The most beautiful park project of the century in NYC." },
  { id:"s020", category:"Monumentos", name:"Flatiron Building", nameEN:"Flatiron Building", emoji:"🏢", desc:"O predio em formato de ferro de passar roupa. Recentemente reaberto apos reforma.", descEN:"The iron-shaped building. Recently reopened after renovation.", price:"gratis", lat:40.7411, lng:-73.9897, time:"30min", petFriendly:true, publicBathroom:false, season:"sempre", rep:"Icone arquitetonico de NYC.", repEN:"NYC architectural icon." },
  { id:"s021", category:"Monumentos", name:"Staten Island Ferry", nameEN:"Staten Island Ferry", emoji:"⛴️", desc:"Balsa gratuita com vista frontal da Estatua da Liberdade.", descEN:"Free ferry with a front-row view of the Statue of Liberty.", price:"gratis", lat:40.6437, lng:-74.0735, time:"1h", petFriendly:true, publicBathroom:true, season:"sempre", rep:"A melhor vista gratuita de NYC.", repEN:"The best free view in NYC." },
  { id:"s022", category:"Museus", name:"The Cloisters", nameEN:"The Cloisters", emoji:"🏰", desc:"Museu de arte medieval dentro de um mosteiro reconstruido no norte de Manhattan.", descEN:"Medieval art museum inside a reconstructed monastery in upper Manhattan.", price:"$$", lat:40.8648, lng:-73.9317, time:"2h", link:"https://www.metmuseum.org/visit/met-cloisters", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Parece que voce saiu de NYC completamente.", repEN:"Feels like you've completely left NYC." },
  { id:"d001", category:"Dispensaries", name:"Housing Works Cannabis", nameEN:"Housing Works Cannabis", emoji:"🍀", desc:"O primeiro dispensario com fins sociais de NY, em Soho.", descEN:"NY's first social-purpose dispensary, in Soho.", price:"$$", lat:40.7243, lng:-74.0030, time:"30min", link:"https://housingworkscannabis.com", petFriendly:false, publicBathroom:false, season:"sempre", rep:"O melhor dispensario de NYC.", repEN:"NYC's best dispensary." },
  { id:"d002", category:"Dispensaries", name:"The Travel Agency", nameEN:"The Travel Agency", emoji:"✈️", desc:"Dispensario tematico de viagem em Manhattan.", descEN:"Travel-themed dispensary in Manhattan.", price:"$$", lat:40.7589, lng:-73.9851, time:"30min", petFriendly:false, publicBathroom:false, season:"sempre", rep:"O mais instagramavel de todos.", repEN:"The most Instagrammable of them all." },
  { id:"d003", category:"Dispensaries", name:"Gotham", nameEN:"Gotham", emoji:"🦇", desc:"Dispensario premium no Midtown com enfase em educacao do consumidor.", descEN:"Premium dispensary in Midtown with emphasis on consumer education.", price:"$$", lat:40.7549, lng:-73.9840, time:"30min", petFriendly:false, publicBathroom:false, season:"sempre", rep:"Elegante e sofisticado.", repEN:"Elegant and sophisticated." },
  { id:"d004", category:"Dispensaries", name:"Smacked Village", nameEN:"Smacked Village", emoji:"🌱", desc:"Dispensario bem avaliado no West Village com ambiente aconchegante.", descEN:"Highly rated dispensary in the West Village with a cozy atmosphere.", price:"$$", lat:40.7335, lng:-74.0030, time:"30min", petFriendly:false, publicBathroom:false, season:"sempre", rep:"Favorito dos moradores do West Village.", repEN:"West Village residents' favorite." },
  { id:"d005", category:"Dispensaries", name:"Terp Bros", nameEN:"Terp Bros", emoji:"🍃", desc:"Um dos primeiros dispensarios licenciados de NY no Bronx.", descEN:"One of NY's first licensed dispensaries in the Bronx.", price:"$", lat:40.8448, lng:-73.8648, time:"30min", petFriendly:false, publicBathroom:false, season:"sempre", rep:"Pioneiro licenciado do Bronx.", repEN:"Bronx licensed pioneer." },
  { id:"dt001", category:"Daytrips", name:"Cold Spring, NY", nameEN:"Cold Spring, NY", emoji:"🏔️", desc:"Cidade historica as margens do Hudson River com trilhas e antiquarios.", descEN:"Historic town on the Hudson River with trails and antique shops.", price:"$", lat:41.4209, lng:-73.9557, time:"dia inteiro", link:"https://coldspringny.gov", petFriendly:true, publicBathroom:true, season:"outono", rep:"Um dos melhores daytrips de NYC. Metro-North de Grand Central, 1h20.", repEN:"One of the best daytrips from NYC. Metro-North from Grand Central, 1h20." },
  { id:"dt002", category:"Daytrips", name:"Hudson, NY", nameEN:"Hudson, NY", emoji:"🏡", desc:"Cidade de arte e antiquarios com restaurantes excelentes e arquitetura vitoriana.", descEN:"Art and antiques town with excellent restaurants and Victorian architecture.", price:"$$", lat:42.2529, lng:-73.7935, time:"dia inteiro", petFriendly:true, publicBathroom:true, season:"outono", rep:"A cidade mais charmosa do Hudson Valley.", repEN:"The most charming town in the Hudson Valley." },
  { id:"dt003", category:"Daytrips", name:"Princeton, NJ", nameEN:"Princeton, NJ", emoji:"🎓", desc:"Campus universitario historico com museu de arte de classe mundial.", descEN:"Historic university campus with a world-class art museum.", price:"$", lat:40.3573, lng:-74.6672, time:"dia inteiro", petFriendly:true, publicBathroom:true, season:"sempre", rep:"O Princeton University Art Museum e de graca.", repEN:"The Princeton University Art Museum is free." },
  { id:"dt004", category:"Daytrips", name:"Catskills, NY", nameEN:"Catskills, NY", emoji:"🏕️", desc:"Montanhas com cachoeiras, trilhas e cidades artisticas a 2h de NYC.", descEN:"Mountains with waterfalls, trails and artistic towns 2h from NYC.", price:"$$", lat:42.0987, lng:-74.2179, time:"dia inteiro", petFriendly:true, publicBathroom:true, season:"outono", rep:"O destino favorito dos nova-iorquinos.", repEN:"New Yorkers' favorite destination." },
  { id:"dt005", category:"Daytrips", name:"Asbury Park, NJ", nameEN:"Asbury Park, NJ", emoji:"🎸", desc:"Cidade costeira vibrante com cena musical, boardwalk historico e bares incriveis.", descEN:"Vibrant coastal town with music scene, historic boardwalk and great bars.", price:"$", lat:40.2204, lng:-74.0121, time:"dia inteiro", petFriendly:true, publicBathroom:true, season:"verao", rep:"A cidade mais cool de NJ.", repEN:"NJ's coolest town." },
  { id:"dt006", category:"Daytrips", name:"Philadelphia, PA", nameEN:"Philadelphia, PA", emoji:"🔔", desc:"Cidade historica com Liberty Bell, Reading Terminal Market e restaurantes.", descEN:"Historic city with Liberty Bell, Reading Terminal Market and great food.", price:"$$", lat:39.9526, lng:-75.1652, time:"dia inteiro", petFriendly:true, publicBathroom:true, season:"sempre", rep:"A 1h15 de trem. O cheesesteak e o Reading Terminal Market sao imperdíveis.", repEN:"1h15 by train. The cheesesteak and Reading Terminal Market are unmissable." },
  { id:"dt007", category:"Daytrips", name:"Ski - Mountain Creek, NJ", nameEN:"Ski - Mountain Creek, NJ", emoji:"⛷️", desc:"Resort de ski mais proximo de NYC, a menos de 1h de carro.", descEN:"Closest ski resort to NYC, less than 1h by car.", price:"$$$", lat:41.1812, lng:-74.5099, time:"dia inteiro", link:"https://mountaincreek.com", petFriendly:false, publicBathroom:true, season:"inverno", rep:"Menor que resorts de Vermont mas acessivel e divertido.", repEN:"Smaller than Vermont resorts but accessible and fun." },
  { id:"dt008", category:"Daytrips", name:"Storm King Art Center", nameEN:"Storm King Art Center", emoji:"🗿", desc:"Museu de escultura ao ar livre em 500 acres de paisagem natural no Hudson Valley.", descEN:"Outdoor sculpture museum on 500 acres of natural landscape in the Hudson Valley.", price:"$$", lat:41.4096, lng:-74.0046, time:"dia inteiro", link:"https://stormking.org", petFriendly:false, publicBathroom:true, season:"outono", rep:"Uma das experiencias artisticas mais unicas do mundo.", repEN:"One of the most unique artistic experiences in the world." },
{ id:"b001", bestTime:"Quinta a sabado apos 20h, reserve com antecedencia", category:"Bares", name:"Death & Co", nameEN:"Death & Co", emoji:"💀", desc:"Um dos bares de coqueteis mais influentes do mundo, no East Village. Ambiente escuro e sofisticado, menu de drinques inovador.", descEN:"One of the world's most influential cocktail bars in the East Village. Dark and sophisticated atmosphere.", price:"$$", lat:40.7265, lng:-73.9822, time:"2h", link:"https://deathandcompany.com", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Lendario. Reserve com antecedencia ou chegue cedo.", repEN:"Legendary. Reserve ahead or arrive early.", hours:"Dom-Qui 18h-0h, Sex-Sab 18h-2h" },
  { id:"b002", needsReservation:true, category:"Bares", name:"Please Don't Tell (PDT)", nameEN:"Please Don't Tell (PDT)", emoji:"📞", desc:"Speakeasy escondido atras de uma cabine telefonica em uma lanchonete no East Village. Um dos bares mais exclusivos de NYC.", descEN:"Speakeasy hidden behind a phone booth in an East Village hot dog joint. One of NYC's most exclusive bars.", price:"$$", lat:40.7267, lng:-73.9838, time:"2h", link:"https://pdtnyc.com", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Reserve pelo site - so 45 lugares. A experiencia de entrar ja vale.", repEN:"Reserve online - only 45 seats. The entry experience alone is worth it." },
  { id:"b003", category:"Bares", name:"Employees Only", nameEN:"Employees Only", emoji:"🎩", desc:"Bar de coqueteis de era proibicao no West Village com excelente menu de comida tardia.", descEN:"Prohibition-era cocktail bar in the West Village with an excellent late-night food menu.", price:"$$", lat:40.7341, lng:-74.0059, time:"2h", petFriendly:false, publicBathroom:true, season:"sempre", rep:"O Late Night Food aqui e tao bom quanto os drinks. Abre ate 4am.", repEN:"The late night food here is as good as the drinks. Open until 4am.", link:"https://employeesonly.com" },
  { id:"b004", needsReservation:true, category:"Bares", name:"The Dead Rabbit", nameEN:"The Dead Rabbit", emoji:"🐰", desc:"Considerado um dos melhores bares do mundo, no Financial District. Tematica irlandesa, coqueteis historicos.", descEN:"Considered one of the world's best bars in the Financial District. Irish themed, historical cocktails.", price:"$$$", lat:40.7033, lng:-74.0133, time:"2h", link:"https://deadrabbitnyc.com", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Top 10 mundial. Os Irish Coffee e punch bowls sao lendarios.", repEN:"World top 10. The Irish Coffee and punch bowls are legendary." },
  { id:"b005", category:"Bares", name:"Attaboy", nameEN:"Attaboy", emoji:"🥂", desc:"Sem menu - o bartender cria um drink personalizado baseado no seu humor e preferencias. No Lower East Side.", descEN:"No menu - the bartender creates a personalized drink based on your mood and preferences. In the Lower East Side.", price:"$$", lat:40.7202, lng:-73.9875, time:"2h", petFriendly:false, publicBathroom:false, season:"sempre", rep:"Experiencia unica. Chegue cedo - so aceita quem aparece.", repEN:"Unique experience. Arrive early - walk-ins only.", link:"https://attaboy.us" },
  { id:"b006", category:"Bares", name:"Dante", nameEN:"Dante", emoji:"🍹", desc:"Bar italiano classico no West Village, eleito o melhor bar do mundo em 2019. Negronis lendarios.", descEN:"Classic Italian bar in the West Village, voted world's best bar in 2019. Legendary Negronis.", price:"$$", lat:40.7313, lng:-74.0021, time:"2h", link:"https://dante-nyc.com", petFriendly:true, publicBathroom:true, season:"sempre", rep:"Melhor Negroni de NYC. Excelente para brunch tambem.", repEN:"Best Negroni in NYC. Excellent for brunch too.", hours:"Ter-Dom 11h-2h, Sab brunch 11h-15h" },
  { id:"b007", needsReservation:true, category:"Bares", name:"Maison Premiere", nameEN:"Maison Premiere", emoji:"🦪", desc:"Ostras e coqueteis estilo New Orleans em Williamsburg. Jardim externo lindo no verao.", descEN:"Oysters and New Orleans-style cocktails in Williamsburg. Beautiful outdoor garden in summer.", price:"$$$", lat:40.7142, lng:-73.9609, time:"2h", link:"https://maisonpremiere.com", petFriendly:false, publicBathroom:true, season:"primavera", rep:"O jardim no verao e perfeito. Absinthe e ostras - combinacao infalivel.", repEN:"The garden in summer is perfect. Absinthe and oysters - unbeatable combo." },
  { id:"b008", category:"Bares", name:"McSorley's Old Ale House", nameEN:"McSorley's Old Ale House", emoji:"🍺", desc:"O bar mais antigo de NYC, aberto desde 1854. Serve so dois tipos de cerveja: light e dark. Historia viva.", descEN:"NYC's oldest bar, open since 1854. Serves only two types of beer: light and dark. Living history.", price:"$", lat:40.7281, lng:-73.9889, time:"1h", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Imprescindivel por historia. Sawdust no chao, fotos do seculo XIX nas paredes.", repEN:"Essential for history. Sawdust on the floor, 19th century photos on the walls.", hours:"Seg-Sab 11h-1h, Dom 13h-1h", link:"https://mcsorleysoldalehouse.nyc" },
  { id:"b009", category:"Bares", name:"White Horse Tavern", nameEN:"White Horse Tavern", emoji:"🐴", desc:"Bar historico do West Village frequentado por Dylan Thomas, Jack Kerouac e Jim Morrison. Desde 1880.", descEN:"Historic West Village bar frequented by Dylan Thomas, Jack Kerouac and Jim Morrison. Since 1880.", price:"$", lat:40.7339, lng:-74.0069, time:"1h", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Um dos bares mais literarios do mundo. Muito charme.", repEN:"One of the world's most literary bars. Very charming.", link:"https://www.whitehorsetavernnyc.com" },
  { id:"b010", category:"Bares", name:"Nowadays", nameEN:"Nowadays", emoji:"🎊", desc:"Bar e clube ao ar livre em Queens com jardim enorme. Musica eletronica, vibes descontraidas e boa comida.", descEN:"Outdoor bar and club in Queens with a huge garden. Electronic music, relaxed vibes and good food.", price:"$$", lat:40.7138, lng:-73.9088, time:"3h+", link:"https://now-a-days.com", petFriendly:false, publicBathroom:true, season:"verao", rep:"O melhor bar ao ar livre de NYC. Noites de domingo sao lendarias.", repEN:"NYC's best outdoor bar. Sunday nights are legendary." },
  { id:"b011", category:"Bares", name:"Amor y Amargo", nameEN:"Amor y Amargo", emoji:"🍸", desc:"Minusculo bar especializado em bitters e amargos no East Village. 20 lugares, 100% foco em craft.", descEN:"Tiny bar specializing in bitters and amaro in the East Village. 20 seats, 100% craft focused.", price:"$$", lat:40.7261, lng:-73.9814, time:"1h", petFriendly:false, publicBathroom:false, season:"sempre", rep:"Para quem curte bitter e amaro. Ambiente intimo e especializado.", repEN:"For lovers of bitter and amaro. Intimate and specialized atmosphere.", link:"https://amoryamargo.com" },
  { id:"b012", category:"Bares", name:"Westlight", nameEN:"Westlight", emoji:"🌅", desc:"Rooftop bar no 22o andar do William Vale em Williamsburg. Vista 360 de Manhattan e Brooklyn.", descEN:"Rooftop bar on the 22nd floor of the William Vale in Williamsburg. 360 view of Manhattan and Brooklyn.", price:"$$$", lat:40.7181, lng:-73.9566, time:"2h", link:"https://www.westlightnyc.com", petFriendly:false, publicBathroom:true, season:"verao", rep:"A melhor vista de Manhattan a partir de Brooklyn. Va no por do sol.", repEN:"Best view of Manhattan from Brooklyn. Go at sunset." },
  { id:"b013", category:"Bares", name:"Hotel Delmano", nameEN:"Hotel Delmano", emoji:"🕯️", desc:"Bar estilo Belle Epoque em Williamsburg com ambiente romantico, espelhos, madeira e drinques classicos.", descEN:"Belle Epoque style bar in Williamsburg with romantic atmosphere, mirrors, wood and classic drinks.", price:"$$", lat:40.7161, lng:-73.9588, time:"2h", petFriendly:false, publicBathroom:true, season:"sempre", rep:"O bar mais romantico de Brooklyn. Perfeito para uma data especial.", repEN:"Brooklyn's most romantic bar. Perfect for a special date.", link:"https://www.hoteldelmano.com" },
  { id:"b014", category:"Bares", name:"Mission Dolores", nameEN:"Mission Dolores", emoji:"🍻", desc:"Beer garden descontraido em Park Slope com cerveja artesanal e ambiente casual. Cachorros bem-vindos.", descEN:"Relaxed beer garden in Park Slope with craft beer and casual atmosphere. Dogs welcome.", price:"$", lat:40.6741, lng:-73.9780, time:"2h", petFriendly:true, publicBathroom:true, season:"verao", rep:"O melhor beer garden de Brooklyn. Leva o cachorro.", repEN:"Brooklyn's best beer garden. Bring the dog.", link:"https://missiondoloresbar.com" },
  { id:"b015", category:"Bares", name:"The Ear Inn", nameEN:"The Ear Inn", emoji:"👂", desc:"Um dos bares mais antigos de NYC, desde 1817 em SoHo. Ambiente autentico sem pretensao.", descEN:"One of NYC's oldest bars, since 1817 in SoHo. Authentic atmosphere without pretension.", price:"$", lat:40.7255, lng:-74.0098, time:"1h", petFriendly:false, publicBathroom:true, season:"sempre", rep:"Historia pura. Um dos pubs mais autênticos que NYC tem.", repEN:"Pure history. One of the most authentic pubs NYC has to offer.", link:"https://www.earinn.com" },
];

const CATEGORIES = [...new Set(INITIAL_PLACES.map(p => p.category))].sort();

const REGIONS = {
  Manhattan:    { minLat:40.700, maxLat:40.882, minLng:-74.020, maxLng:-73.907 },
  Brooklyn:     { minLat:40.570, maxLat:40.740, minLng:-74.042, maxLng:-73.833 },
  Queens:       { minLat:40.541, maxLat:40.800, minLng:-73.962, maxLng:-73.700 },
  Bronx:        { minLat:40.785, maxLat:40.917, minLng:-73.933, maxLng:-73.765 },
  "New Jersey": { minLat:40.460, maxLat:40.820, minLng:-74.260, maxLng:-74.050 },
};

let _pullStartY = 0;
let _pullStartX = 0;

function initPullToRefresh() {
  if (window._ptrInit) return;
  window._ptrInit = true;
  document.addEventListener("touchstart", e => {
    _pullStartY = e.touches[0].clientY;
    _pullStartX = e.touches[0].clientX;
  }, { passive:true });
  document.addEventListener("touchend", e => {
    const dy = e.changedTouches[0].clientY - _pullStartY;
    const dx = Math.abs(e.changedTouches[0].clientX - _pullStartX);
    // Only reload if: mostly vertical (dx<40), pulled down >130px, page at top
    if (dy > 130 && dx < 40 && window.scrollY === 0) { window.location.reload(); }
  }, { passive:true });
}


function FilterSection({ label, options, selected, onToggle, renderLabel }) {
  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:6 }}>{label}</div>
      <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
        {options.map(opt=>(
          <button key={opt} onClick={()=>onToggle(opt)} style={{ padding:"5px 10px",borderRadius:20,background:selected.includes(opt)?"#ff2d5515":"#f8f7f4",border:"1px solid "+(selected.includes(opt)?"#ff2d55":"#e8e6e0"),color:selected.includes(opt)?"#ff2d55":"#8a8a9a",fontSize:11,cursor:"pointer" }}>
            {renderLabel(opt)}
          </button>
        ))}
      </div>
    </div>
  );
}

function SeasonalBanner({ places, entries, onSelect }) {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const currentSeason = month>=2&&month<=4?"primavera":month>=5&&month<=7?"verao":month>=8&&month<=10?"outono":"inverno";
  const seasonal = places.filter(p=>{
    const e=entries[p.id]||{};
    if(e.status==="fui") return false;
    const s=e.season||p.season;
    return s===currentSeason;
  });
  if(!seasonal.length) return null;
  const pick = seasonal[Math.floor(Math.random()*Math.min(seasonal.length,3))];
  if(!pick) return null;
  const SEASON_COLORS = { primavera:["#f5fff0","#4a8a00","#4a8a00"], verao:["#e8f9ff","#0088aa","#0088aa"], outono:["#fff8f0","#c05a00","#c05a00"], inverno:["#f0f5ff","#0044bb","#0044bb"] };
  const [bg,border,text] = SEASON_COLORS[currentSeason]||["#ffffff","#e8e6e0","#1a1a1a"];
  const SEASON_LABEL = { primavera:isEN?"Spring":"Primavera", verao:isEN?"Summer":"Verao", outono:isEN?"Fall":"Outono", inverno:isEN?"Winter":"Inverno" };
  return (
    <div onClick={()=>onSelect(pick)} style={{ background:"linear-gradient(135deg,"+bg+",#f8f7f4)",border:"1px solid "+border,borderRadius:14,padding:"12px 16px",marginBottom:10,cursor:"pointer",position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:text }}/>
      <div style={{ fontSize:10,color:text,letterSpacing:"0.15em",marginBottom:6,opacity:0.8 }}>
        {SEASON_EMOJI[currentSeason]} {isEN?"PERFECT FOR THIS SEASON":"PERFEITO PARA ESSA EPOCA"} · {SEASON_LABEL[currentSeason].toUpperCase()}
      </div>
      <div style={{ display:"flex",gap:12,alignItems:"center" }}>
        <div style={{ fontSize:28 }}>{pick.emoji}</div>
        <div>
          <div style={{ fontSize:14,fontWeight:700,color:"#1a1a1a" }}>{isEN&&pick.nameEN?pick.nameEN:pick.name}</div>
          <div style={{ fontSize:11,color:"#8a8a9a",marginTop:2 }}>{catLabel(pick.category)} · {PRICE_EMOJI[pick.price]||"?"} · {pick.time}</div>
        </div>
        <div style={{ marginLeft:"auto",fontSize:11,color:text,background:text+"20",borderRadius:20,padding:"4px 10px",whiteSpace:"nowrap" }}>
          {seasonal.length} {isEN?"this season":"nessa epoca"}
        </div>
      </div>
    </div>
  );
}

function useDragToDismiss(onDismiss) {
  const startY = useRef(0);
  const active = useRef(false);
  const onTouchStart = e => {
    if(e.touches.length > 1) { active.current = false; return; } // ignore pinch/zoom
    active.current = true;
    startY.current = e.touches[0].clientY;
  };
  const onTouchEnd = e => {
    if(!active.current) return;
    active.current = false;
    const dy = e.changedTouches[0].clientY - startY.current;
    if(dy > 160) {
      let el = e.target;
      while(el && el !== document.body) { if(el.scrollTop > 5) return; el = el.parentElement; }
      onDismiss();
    }
  };
  return { onTouchStart, onTouchEnd };
}

const TAB_KEYS = ["explorar","planejar","mapa","memorias"];

function useSwipeTabs(tab, setTab) {
  const startX = useRef(0);
  const startY = useRef(0);
  const startTarget = useRef(null);
  useEffect(() => {
    const onStart = e => {
      startX.current=e.touches[0].clientX;
      startY.current=e.touches[0].clientY;
      startTarget.current=e.target;
    };
    const onEnd = e => {
      const target = startTarget.current;
      // Ignore if started on map or any horizontally scrollable container
      if(target&&target.closest&&(
        target.closest(".leaflet-container") ||
        target.closest(".leaflet-pane") ||
        target.closest("[data-hscroll]") ||
        target.closest(".swipe-card")
      )) return;
      const dx = e.changedTouches[0].clientX - startX.current;
      const dy = Math.abs(e.changedTouches[0].clientY - startY.current);
      if(Math.abs(dx)>70&&dy<30) {
        const idx = TAB_KEYS.indexOf(tab);
        if(dx<0&&idx<TAB_KEYS.length-1) setTab(TAB_KEYS[idx+1]);
        if(dx>0&&idx>0) setTab(TAB_KEYS[idx-1]);
      }
    };
    document.addEventListener("touchstart",onStart,{passive:true});
    document.addEventListener("touchend",onEnd,{passive:true});
    return()=>{document.removeEventListener("touchstart",onStart);document.removeEventListener("touchend",onEnd);};
  },[tab,setTab]);
}

const injectCSS = () => {
  if (document.getElementById("nyc-css")) return;
  initPullToRefresh();
  const s = document.createElement("style");
  s.id = "nyc-css";
  s.textContent = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #f8f7f4; font-family: 'Inter', system-ui, sans-serif; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-thumb { background: #d8d5ce; border-radius: 2px; }
    input, textarea, select, button { font-family: inherit; }
    input:focus, textarea:focus { outline: none; }
    .card:hover { background: #f5f4f1 !important; }
    .card { transition: background 0.12s ease; }
    .btn { transition: all 0.12s ease; cursor: pointer; border: none; }
    .hdr-btn:hover { background: #e8e6e0 !important; }
    .hdr-btn { transition: background 0.12s ease; }
    .hdr-btn:active { transform: scale(0.92); opacity: 0.8; }
    .card:active { transform: scale(0.98); background: #f0eeeb !important; }
    .pill-btn:active { opacity: 0.7; transform: scale(0.95); }
    .tab-btn:active { opacity: 0.8; }
    .bottom-nav { position:fixed; bottom:0; left:0; right:0; background:#ffffff; border-top:1px solid #e8e6e0; display:flex; z-index:150; padding-bottom:env(safe-area-inset-bottom); box-shadow:0 -1px 0 #e8e6e0; }
    .nav-item { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px; padding:10px 4px 8px; cursor:pointer; border:none; background:none; color:#b0aebb; transition:color 0.15s; font-family:inherit; }
    .nav-item.active { color:#ff2d55; }
    .nav-item:active { opacity:0.7; transform:scale(0.92); }
    .card-want { border-color:#007aff !important; background:linear-gradient(to right,#007aff08,#ffffff) !important; }
    .card-been { background:linear-gradient(to right,var(--cc,#ff2d55)12,#ffffff) !important; }
    .swipe-card { touch-action: pan-y; user-select: none; transition: transform 0.15s ease; }
    .swipe-card.swiping { transition: none; }
    .swipe-hint-right { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#007aff; font-size:20px; opacity:0; transition:opacity 0.15s; pointer-events:none; }
    .swipe-hint-left { position:absolute; right:12px; top:50%; transform:translateY(-50%); color:#30d158; font-size:20px; opacity:0; transition:opacity 0.15s; pointer-events:none; }
    .quick-actions-overlay { position:fixed; inset:0; background:#000000c0; z-index:250; display:flex; align-items:flex-end; justify-content:center; }
    .mood-chip { padding:8px 14px; border-radius:22px; border:1.5px solid #e8e6e0; background:#ffffff; color:#8a8a9a; font-size:12px; font-family:inherit; cursor:pointer; white-space:nowrap; display:flex; align-items:center; gap:5px; transition:all 0.15s; box-shadow:0 1px 3px #00000010; }
    .mood-chip.active { border-color:#ff2d5560; background:#ff2d5508; color:#ff2d55; }
    .mood-chip:active { transform:scale(0.94); }
    .nearby-banner { position:fixed; bottom:80px; left:50%; transform:translateX(-50%); background:#ffffff; border:1px solid #30d15840; border-radius:20px; padding:10px 16px; display:flex; align-items:center; gap:10px; z-index:140; box-shadow:0 4px 20px #00000020; max-width:340px; cursor:pointer; animation:slideUp 0.3s ease; }
    .cat-bar { position:sticky; top:0; z-index:80; background:#f8f7f4; padding:0 0 8px; margin:0 -16px; padding-left:16px; }
    .modal-drag { cursor: grab; }
    @keyframes slideUp { from { transform:translateY(30px); opacity:0; } to { transform:translateY(0); opacity:1; } }
    .slide-up { animation: slideUp 0.22s ease forwards; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
    @keyframes slideIn { from { transform:translateY(100%); } to { transform:translateY(0); } }
    @keyframes toastIn { from { opacity:0; transform:translateX(60px); } to { opacity:1; transform:translateX(0); } }
    .fade-up { animation: fadeUp 0.2s ease forwards; }
    .pulsing { animation: pulse 1.5s ease infinite; }
    .modal { animation: slideIn 0.28s ease forwards; }
    .leaflet-container, .leaflet-pane { z-index: 1 !important; }
    .leaflet-top, .leaflet-bottom { z-index: 2 !important; }
  `;
  document.head.appendChild(s);
};

function haversineKm(lat1,lng1,lat2,lng2){const R=6371,dLat=(lat2-lat1)*Math.PI/180,dLng=(lng2-lng1)*Math.PI/180;const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}

const _osrmCache = {};
async function walkingMins(fromLat,fromLng,toLat,toLng){
  const key = [fromLat.toFixed(4),fromLng.toFixed(4),toLat.toFixed(4),toLng.toFixed(4)].join(",");
  if(_osrmCache[key]!==undefined) return _osrmCache[key];try{
    const r=await fetch("https://router.project-osrm.org/route/v1/foot/"+fromLng+","+fromLat+";"+toLng+","+toLat+"?overview=false",{signal:AbortSignal.timeout(4000)});
    const d=await r.json();
    if(d.routes?.[0]){const m=Math.round(d.routes[0].duration/60);_osrmCache[key]={mins:m,estimated:false};return{mins:m,estimated:false};}
  }catch{}
  // NYC grid correction: real walking ~40% longer than straight line + 80m/min pace
  const fb=Math.round(haversineKm(fromLat,fromLng,toLat,toLng)*1.4/80*1000);
  _osrmCache[key]={mins:fb,estimated:true};
  return{mins:fb,estimated:true};
}

function citymapperUrl(place, userLat, userLng) {
  if (!place.lat || !place.lng) return null;
  let url = "https://citymapper.com/directions?endcoord="+place.lat+"%2C"+place.lng+"&endname="+encodeURIComponent(isEN&&place.nameEN?place.nameEN:place.name);
  if (userLat && userLng) url += "&startcoord="+userLat+"%2C"+userLng;
  return url;
}

async function geocodeAddress(address) {
  try {
    const r = await fetch("https://nominatim.openstreetmap.org/search?q="+encodeURIComponent(address+", New York")+"&format=json&limit=1");
    const d = await r.json();
    if (d[0]) return { lat: parseFloat(d[0].lat), lng: parseFloat(d[0].lon) };
  } catch {}
  return null;
}

const Icons = {
  Dice: ()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="3"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/><circle cx="16" cy="8" r="1.5" fill="currentColor"/><circle cx="8" cy="16" r="1.5" fill="currentColor"/><circle cx="16" cy="16" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>,
  MapPin: ()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Bot: ()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>,
  Share: ()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>,
  Walk: ()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="4" r="2"/><path d="M10 8l-2 6 4 2-1 6"/><path d="M10 12l-3 3"/></svg>,
  Edit: ()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Link: ()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  Sparkles: ()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  Route: ()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="6" r="2"/><path d="M7 6h4a1 1 0 010 2H9a1 1 0 000 2h6a1 1 0 010 2H9"/><circle cx="19" cy="18" r="2"/></svg>,
};

function HdrBtn({ icon, label, onClick }) {
  return <button onClick={onClick} className="hdr-btn" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"6px 8px", background:"#ffffff", border:"1px solid #e8e6e0", borderRadius:10, color:"#8a8a9a", cursor:"pointer", minWidth:48 }}>{icon}<span style={{ fontSize:9, letterSpacing:"0.04em", whiteSpace:"nowrap" }}>{label}</span></button>;
}

function Toast({ message, type, onDone, onUndo }) {
  const firedRef = useRef(false);
  const safeDone = useCallback(()=>{ if(!firedRef.current){firedRef.current=true;onDone();} },[onDone]);
  useEffect(()=>{const t=setTimeout(safeDone,onUndo?5500:2500);return()=>clearTimeout(t);},[]);
  const colors={success:["#1a3a1a","#30d158"],error:["#3a1a1a","#ff2d55"],info:["#1a1a3a","#007aff"]};
  const [bg,border]=colors[type]||colors.info;
  return <div style={{ position:"fixed",top:18,right:16,zIndex:9999,background:bg,border:"1px solid "+border,borderRadius:12,padding:"11px 14px",color:"#1a1a1a",fontSize:13,fontWeight:600,boxShadow:"0 4px 20px #00000060",animation:"toastIn 0.25s ease",maxWidth:290,display:"flex",alignItems:"center",gap:10 }}><span style={{ flex:1 }}>{message}</span>{onUndo&&<button onClick={()=>{onUndo();safeDone();}} style={{ background:"#ffffff20",border:"none",borderRadius:8,padding:"4px 10px",color:"#fff",fontSize:12,cursor:"pointer",whiteSpace:"nowrap" }}>{T.undoBtn}</button>}</div>;
}

let _weatherCache = null;
function WeatherWidget() {
  const [w,setW]=useState(_weatherCache);
  useEffect(()=>{
    if(_weatherCache){setW(_weatherCache);return;}
    fetch("https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current=temperature_2m,weather_code&daily=precipitation_sum,temperature_2m_max,temperature_2m_min&temperature_unit=celsius&timezone=America/New_York&forecast_days=1")
      .then(r=>r.json()).then(d=>{
        const code=d.current.weather_code,tempC=Math.round(d.current.temperature_2m),tempF=Math.round(tempC*9/5+32);
        const maxC=Math.round(d.daily.temperature_2m_max[0]),minC=Math.round(d.daily.temperature_2m_min[0]),rain=d.daily.precipitation_sum[0];
        let icon="☀️",desc=isEN?T.weather.sunny:T.weather.ensolarado;
        if(code>=71){icon="❄️";desc=isEN?T.weather.snowy:T.weather.nevando;}else if(code>=61){icon="🌧️";desc=isEN?T.weather.rainy:T.weather.chovendo;}else if(code>=51){icon="🌦️";desc=isEN?T.weather.drizzle:T.weather.garoa;}else if(code>=45){icon="🌫️";desc=isEN?T.weather.foggy:T.weather.nebuloso;}else if(code>=3){icon="☁️";desc=isEN?T.weather.cloudy:T.weather.nublado;}else if(code>=1){icon="⛅";desc=isEN?T.weather.partCloud:T.weather.parcNublado;}
        const wData={tempC,tempF,maxC,minC,icon,desc,outdoor:rain<2&&code<61};
        _weatherCache=wData;
        setW(wData);
        window._nycWeather=wData;
      }).catch(()=>{});
  },[]);
  if(!w) return null;
  return <div style={{ background:w.outdoor?"#f0fff5":"#fff5f7",border:"1px solid "+(w.outdoor?"#30d15830":"#ff2d5530"),borderRadius:12,padding:"10px 14px",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"space-between" }}><div style={{ display:"flex",alignItems:"center",gap:10 }}><span style={{ fontSize:24 }}>{w.icon}</span><div><div style={{ fontSize:15,fontWeight:700,color:"#1a1a1a" }}>{w.tempC}°C <span style={{ fontSize:12,color:"#8a8a9a" }}>/ {w.tempF}°F · {w.desc}</span></div><div style={{ fontSize:11,color:"#a0a0b0" }}>Min {w.minC}°C / Max {w.maxC}°C</div></div></div><div style={{ fontSize:11,fontWeight:600,color:w.outdoor?"#30d158":"#ff2d55",background:(w.outdoor?"#30d158":"#ff2d55")+"20",borderRadius:20,padding:"4px 10px" }}>{w.outdoor?T.goodOutdoor:T.indoorDay}</div></div>;
}

function MapTab({ places, entries, onSelect }) {
  const mapRef = useRef(null);
  const inst = useRef(null);
  const markers = useRef([]);
  const userMarker = useRef(null);
  const [ready, setReady] = useState(false);

  // Load Leaflet once
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

  // Init map once Leaflet is ready
  useEffect(() => {
    if (!ready || !mapRef.current || inst.current) return;
    inst.current = window.L.map(mapRef.current, { center:[40.730,-73.990], zoom:12, zoomControl:true });
    window.L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", { attribution:"© CartoDB" }).addTo(inst.current);
    // User location dot - separate from markers
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        if (!inst.current) return;
        const dot = window.L.circleMarker([pos.coords.latitude, pos.coords.longitude], {
          radius: 8, fillColor:"#ff2d55", color:"#fff", weight:2, opacity:1, fillOpacity:1
        }).addTo(inst.current);
        userMarker.current = dot;
      }, () => {}, { enableHighAccuracy: false, timeout: 5000 });
    }
  }, [ready]);

  // Update markers when places change
  useEffect(() => {
    if (!inst.current) return;
    markers.current.forEach(m => m.remove());
    markers.current = [];
    places.forEach(p => {
      if (!p.lat || !p.lng) return;
      const meta = CAT_META[p.category] || { color:"#ff2d55" };
      const html = "<div style='width:28px;height:28px;border-radius:50%;background:"+meta.color+"30;border:2px solid "+meta.color+";display:flex;align-items:center;justify-content:center;font-size:13px;box-shadow:0 2px 8px rgba(0,0,0,0.5)'>"+p.emoji+"</div>";
      const icon = window.L.divIcon({ html, className:"", iconSize:[28,28], iconAnchor:[14,14] });
      const m = window.L.marker([p.lat, p.lng], { icon }).addTo(inst.current);
      m.on("click", () => onSelect(p));
      markers.current.push(m);
    });
  }, [ready, places]);

  if (!ready) return <div style={{ height:"60vh", display:"flex", alignItems:"center", justifyContent:"center", color:"#a0a0b0" }}>Carregando mapa...</div>;
  return (
    <div style={{ padding:"0 16px 16px" }}>
      <div style={{ fontSize:11, color:"#a0a0b0", marginBottom:8, letterSpacing:"0.08em" }}>TOQUE EM UM PIN PARA DETALHES</div>
      <div style={{ borderRadius:14, border:"1px solid #e8e6e0", overflow:"hidden" }}>
        <div ref={mapRef} style={{ height:"62vh", width:"100%" }}/>
      </div>
    </div>
  );
}

function TimelineTab({ places, entries, onSelect }) {
  const visited=places.filter(p=>(entries[p.id]||{}).status==="fui").map(p=>({...p,entry:entries[p.id]})).sort((a,b)=>(b.entry.date||"").localeCompare(a.entry.date||""));
  if(!visited.length)return<div style={{ textAlign:"center",padding:"60px 20px",color:"#a0a0b0" }}><div style={{ fontSize:40,marginBottom:12 }}>📖</div><div style={{ fontSize:14 }}>{isEN?"No places visited yet.":"Nenhum lugar visitado ainda."}</div></div>;
  let lastMonth="";
  return <div style={{ padding:"0 16px 80px" }}>{visited.map((p,i)=>{const meta=CAT_META[p.category]||{color:"#ff2d55"},month=p.entry.date?p.entry.date.slice(0,7):"sem-data",showMonth=month!==lastMonth;lastMonth=month;const fp=p.entry.photos?p.entry.photos[0]:null;return<div key={p.id} className="fade-up">{showMonth&&<div style={{ display:"flex",alignItems:"center",gap:10,marginTop:i>0?24:0,marginBottom:14 }}><div style={{ height:1,flex:1,background:"#e8e6e0" }}/><div style={{ fontSize:11,color:"#a0a0b0",letterSpacing:"0.12em",whiteSpace:"nowrap" }}>{month!=="sem-data"?new Date(month+"-01").toLocaleDateString(isEN?"en-US":"pt-BR",{month:"long",year:"numeric"}).toUpperCase():"NO DATE"}</div><div style={{ height:1,flex:1,background:"#e8e6e0" }}/></div>}<div onClick={()=>onSelect(p)} style={{ display:"flex",gap:12,marginBottom:10,background:"#ffffff",borderRadius:14,padding:"12px",border:"1px solid #e8e6e0",cursor:"pointer" }} className="card"><div style={{ display:"flex",flexDirection:"column",alignItems:"center" }}><div style={{ width:2,flex:1,background:meta.color+"40",minHeight:16 }}/><div style={{ width:10,height:10,borderRadius:"50%",background:meta.color,flexShrink:0 }}/><div style={{ width:2,flex:1,background:meta.color+"15",minHeight:16 }}/></div>{fp?<img src={fp} alt="" style={{ width:58,height:58,borderRadius:10,objectFit:"cover",flexShrink:0 }}/>:<div style={{ width:58,height:58,borderRadius:10,background:meta.color+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0 }}>{p.emoji}</div>}<div style={{ flex:1,minWidth:0 }}><div style={{ fontSize:14,fontWeight:600,color:"#1a1a1a" }}>{isEN&&p.nameEN?p.nameEN:p.name}</div><div style={{ fontSize:11,color:"#a0a0b0",marginTop:2 }}>{p.entry.date&&new Date(p.entry.date+"T12:00:00").toLocaleDateString(isEN?"en-US":"pt-BR")}{p.entry.who&&" · "+WHO_EMOJI[p.entry.who]+" "+WHO_LABELS[p.entry.who]}</div>{p.entry.stars>0&&<div style={{ fontSize:13,color:"#ff9f0a",marginTop:3 }}>{"★".repeat(p.entry.stars)}</div>}{p.entry.note&&<div style={{ fontSize:12,color:"#8a8a9a",marginTop:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{p.entry.note}</div>}</div></div></div>;})}</div>;
}

function CuradoriaTab({ places, lists, onSaveLists, onSelectPlace }) {
  const [view, setView] = useState("home");
  const [editId, setEditId] = useState(null);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("📋");
  const [newDesc, setNewDesc] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const toArr = val => Array.isArray(val) ? val : (val && typeof val === "object" ? Object.values(val) : []);
  const normLists = lists.map(l => ({...l, placeIds: toArr(l.placeIds)}));

  try {
    const editList = normLists.find(l => l.id === editId) || null;

    const create = () => {
      if (!newName.trim()) return;
      const nl = { id:"l"+Date.now(), name:newName.trim(), emoji:newEmoji, desc:newDesc.trim(), placeIds:[] };
      onSaveLists([...normLists, nl]);
      setEditId(nl.id); setNewName(""); setNewEmoji("📋"); setNewDesc(""); setView("edit");
    };

    const del = id => { onSaveLists(normLists.filter(l => l.id !== id)); setView("home"); setEditId(null); };

    const toggle = (lid, pid) => onSaveLists(normLists.map(l => l.id===lid ? {...l, placeIds:l.placeIds.includes(pid)?l.placeIds.filter(x=>x!==pid):[...l.placeIds,pid]} : l));

    const share = list => { const lp=list.placeIds.map(pid=>places.find(p=>p.id===pid)).filter(Boolean); navigator.clipboard.writeText(list.emoji+" "+list.name+(list.desc?"\n"+list.desc:"")+"\n\n"+lp.map(p=>p.emoji+" "+(isEN&&p.nameEN?p.nameEN:p.name)).join("\n")+"\n\nApp: "+window.location.href); };

    const filtered = places.filter(p => { if(!search)return true; const q=search.toLowerCase(); return normalize(p.name).includes(normalize(q))||normalize(isEN&&p.nameEN?p.nameEN:p.name).includes(normalize(q))||normalize(p.category).includes(normalize(q)); });

    if (view==="create") return (
      <div style={{ padding:"0 16px 80px" }}>
        <button onClick={()=>setView("home")} style={{ background:"none",border:"none",color:"#8a8a9a",fontSize:13,cursor:"pointer",marginBottom:16 }}>{T.back}</button>
        <div style={{ fontSize:16,fontWeight:700,color:"#1a1a1a",marginBottom:16 }}>{isEN?"New curadoria":"Nova curadoria"}</div>
        <div style={{ display:"flex",gap:10,marginBottom:10 }}>
          <input value={newEmoji} onChange={e=>setNewEmoji(e.target.value)} maxLength={2} style={{ width:52,background:"#ffffff",border:"1px solid #e8e6e0",borderRadius:10,padding:"10px",color:"#1a1a1a",fontSize:22,textAlign:"center" }}/>
          <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder={T.curadoriaName} autoFocus style={{ flex:1,background:"#ffffff",border:"1px solid #e8e6e0",borderRadius:10,padding:"10px 14px",color:"#1a1a1a",fontSize:14 }}/>
        </div>
        <input value={newDesc} onChange={e=>setNewDesc(e.target.value)} placeholder={T.curadoriaDesc} style={{ width:"100%",background:"#ffffff",border:"1px solid #e8e6e0",borderRadius:10,padding:"10px 14px",color:"#1a1a1a",fontSize:13,marginBottom:14 }}/>
        <button onClick={create} disabled={!newName.trim()} style={{ width:"100%",padding:"14px",background:newName.trim()?"#ff2d55":"#e8e6e0",border:"none",borderRadius:12,color:newName.trim()?"#fff":"#a0a0b0",fontSize:14,fontWeight:700,cursor:newName.trim()?"pointer":"default" }}>{T.create}</button>
      </div>
    );

    if (view==="edit" && editList) return (
      <div style={{ padding:"0 16px 80px" }}>
        <button onClick={()=>setView("home")} style={{ background:"none",border:"none",color:"#8a8a9a",fontSize:13,cursor:"pointer",marginBottom:12 }}>{T.myCuradorias}</button>
        <div style={{ background:"#ffffff",border:"1px solid #e8e6e0",borderRadius:14,padding:"14px",marginBottom:14 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
            <div><div style={{ fontSize:18,fontWeight:700,color:"#1a1a1a" }}>{editList.emoji} {editList.name}</div>{editList.desc&&<div style={{ fontSize:12,color:"#8a8a9a",marginTop:2 }}>{editList.desc}</div>}<div style={{ fontSize:11,color:"#a0a0b0",marginTop:4 }}>{editList.placeIds.length} {T.places}</div></div>
            <div style={{ display:"flex",gap:6 }}>
              <button onClick={()=>share(editList)} style={{ padding:"6px 10px",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,color:"#8a8a9a",fontSize:12,cursor:"pointer" }}>{T.shareBtn}</button>
              <button onClick={()=>del(editList.id)} style={{ padding:"6px 8px",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,color:"#8a8a9a",fontSize:12,cursor:"pointer" }}>🗑</button>
            </div>
          </div>
          {editList.placeIds.length>0&&<div style={{ marginTop:12,borderTop:"1px solid #e8e6e0",paddingTop:10,display:"flex",flexWrap:"wrap",gap:6 }}>
            {editList.placeIds.map(pid=>{const p=places.find(x=>x.id===pid);if(!p)return null;return<div key={pid} style={{ display:"flex",alignItems:"center",gap:5,padding:"4px 10px",background:"#ff2d5515",border:"1px solid #ff2d5540",borderRadius:20 }}><span style={{ fontSize:13 }}>{p.emoji}</span><span style={{ fontSize:12,color:"#1a1a1a" }}>{isEN&&p.nameEN?p.nameEN:p.name}</span><button onClick={()=>toggle(editList.id,pid)} style={{ background:"none",border:"none",color:"#ff2d55",cursor:"pointer",fontSize:14 }}>×</button></div>;})}
          </div>}
        </div>
        <div style={{ fontSize:13,color:"#8a8a9a",marginBottom:8 }}>{T.selectPlaces}</div>
        <div style={{ position:"relative",marginBottom:10 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={T.filterPlaces} style={{ width:"100%",background:"#ffffff",border:"1px solid #e8e6e0",borderRadius:10,padding:"9px 14px",color:"#1a1a1a",fontSize:13 }}/>
        </div>
        <div style={{ maxHeight:"50vh",overflowY:"auto" }}>
          {filtered.map(p=>{const inList=editList.placeIds.includes(p.id),meta=CAT_META[p.category]||{color:"#ff2d55"};return<div key={p.id} onClick={()=>toggle(editList.id,p.id)} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:inList?"#ff2d5508":"#ffffff",border:"1px solid "+(inList?"#ff2d5540":"#e8e6e0"),borderRadius:10,marginBottom:6,cursor:"pointer",transition:"all 0.15s" }}><span style={{ fontSize:20 }}>{p.emoji}</span><div style={{ flex:1 }}><div style={{ fontSize:13,color:"#1a1a1a",fontWeight:inList?600:400 }}>{isEN&&p.nameEN?p.nameEN:p.name}</div><div style={{ fontSize:11,color:"#a0a0b0" }}>{catLabel(p.category)}</div></div><div style={{ width:22,height:22,borderRadius:"50%",background:inList?"#ff2d55":"none",border:"2px solid "+(inList?"#ff2d55":"#e8e6e0"),display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff",flexShrink:0 }}>{inList?"✓":""}</div></div>;})}
        </div>
      </div>
    );

    return (
      <div style={{ padding:"0 16px 80px" }}>
        <button onClick={()=>setView("create")} style={{ width:"100%",padding:"13px",background:"#ff2d5515",border:"1px dashed #ff2d5550",borderRadius:12,color:"#ff2d55",fontSize:14,cursor:"pointer",marginBottom:14,fontFamily:"inherit" }}>{T.createCuradoria}</button>
        {!normLists.length&&<div style={{ textAlign:"center",padding:"40px 0",color:"#a0a0b0" }}><div style={{ fontSize:32,marginBottom:8 }}>📋</div><div style={{ fontSize:13 }}>{T.curadoriaEmpty}</div><div style={{ fontSize:12,marginTop:4,color:"#3a3a50" }}>{T.curadoriaEx}</div></div>}
        {normLists.map(list=>{const lp=list.placeIds.map(pid=>places.find(p=>p.id===pid)).filter(Boolean);return<div key={list.id} onClick={()=>{setEditId(list.id);setView("edit");}} style={{ background:"#ffffff",border:"1px solid #e8e6e0",borderRadius:14,marginBottom:10,padding:"14px",cursor:"pointer" }} className="card"><div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:lp.length?8:0 }}><div><div style={{ fontSize:15,fontWeight:600,color:"#1a1a1a" }}>{list.emoji} {list.name}</div>{list.desc&&<div style={{ fontSize:12,color:"#8a8a9a",marginTop:2 }}>{list.desc}</div>}<div style={{ fontSize:11,color:"#a0a0b0",marginTop:4 }}>{list.placeIds.length} {T.places} · {T.tapToEdit}</div></div><button onClick={e=>{e.stopPropagation();share(list);}} style={{ padding:"5px 10px",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,color:"#8a8a9a",fontSize:12,cursor:"pointer" }}>↗</button></div>{lp.length>0&&<div style={{ display:"flex",flexWrap:"wrap",gap:4 }}>{lp.slice(0,4).map(p=><span key={p.id} style={{ fontSize:11,color:"#8a8a9a",background:"#f8f7f4",borderRadius:20,padding:"3px 8px" }}>{p.emoji} {isEN&&p.nameEN?p.nameEN:p.name}</span>)}{lp.length>4&&<span style={{ fontSize:11,color:"#a0a0b0",padding:"3px 8px" }}>+{lp.length-4}</span>}</div>}</div>;})}
      </div>
    );
  } catch(err) {
    return <div style={{ padding:"40px 16px", textAlign:"center", color:"#a0a0b0" }}><div style={{ fontSize:32, marginBottom:8 }}>📋</div><div style={{ fontSize:13, color:"#ff2d55", marginBottom:12 }}>{isEN?"Error loading curadoria":"Erro ao carregar curadoria"}</div><button onClick={()=>{setError(null);setView("home");}} style={{ padding:"10px 20px", background:"#ff2d55", border:"none", borderRadius:10, color:"#fff", cursor:"pointer" }}>Reload</button></div>;
  }
}

function PhotoGallery({ photos, onChange }) {
  const fileRef=useRef();
  const [uploading,setUploading]=useState(false),[progress,setProgress]=useState(0);
  const handleAdd=ev=>{const files=Array.from(ev.target.files);if(!files.length)return;setUploading(true);setProgress(0);let loaded=0;files.forEach(file=>{const reader=new FileReader();reader.onprogress=e=>{if(e.lengthComputable)setProgress(Math.round((e.loaded/e.total)*100));};reader.onload=e=>{onChange(prev=>prev.length<4?[...prev,e.target.result]:prev);loaded++;if(loaded===files.length){setUploading(false);setProgress(0);}};reader.readAsDataURL(file);});ev.target.value="";};
  return <div>
    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
      {photos.map((p,i)=><div key={i} style={{ position:"relative",aspectRatio:"4/3" }}><img src={p} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",borderRadius:10 }}/><button onClick={()=>onChange(prev=>prev.filter((_,j)=>j!==i))} style={{ position:"absolute",top:6,right:6,background:"#000c",border:"none",borderRadius:"50%",width:22,height:22,color:"#fff",cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center" }}>×</button></div>)}
      {photos.length<4&&<div onClick={()=>!uploading&&fileRef.current.click()} style={{ aspectRatio:"4/3",background:"#f8f7f4",border:"1px dashed "+(uploading?"#ff2d55":"#e8e6e0"),borderRadius:10,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:uploading?"default":"pointer",color:"#a0a0b0",fontSize:12,gap:6,position:"relative",overflow:"hidden",transition:"border-color 0.2s" }}>
        {uploading?<>
          <div style={{ fontSize:22 }}>📸</div>
          <div style={{ fontSize:13,color:"#1a1a1a",fontWeight:700 }}>{progress}%</div>
          <div style={{ width:"70%",height:6,background:"#e8e6e0",borderRadius:3,overflow:"hidden" }}>
            <div style={{ height:"100%",width:progress+"%",background:"linear-gradient(90deg,#ff2d55,#ff6b35)",borderRadius:3,transition:"width 0.15s ease" }}/>
          </div>
          <div style={{ fontSize:10,color:"#8a8a9a" }}>{isEN?"Loading photo...":"Carregando foto..."}</div>
        </>:<>
          <span style={{ fontSize:24 }}>+</span>
          <span style={{ fontSize:11 }}>{isEN?"Photo":"Foto"} {photos.length+1}/4</span>
        </>}
      </div>}
    </div>
    <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleAdd} style={{ display:"none" }}/>
  </div>;
}

function NearbyInModal({ place, places, entries, onSelect }) {
  const [nearby,setNearby]=useState([]);
  useEffect(()=>{if(!place.lat||!place.lng)return;const cands=places.filter(p=>p.id!==place.id&&p.lat&&p.lng&&(entries[p.id]||{}).status!=="fui").map(p=>({...p,distKm:haversineKm(place.lat,place.lng,p.lat,p.lng)})).sort((a,b)=>a.distKm-b.distKm).slice(0,4);setNearby(cands.map(p=>({...p,mins:null,estimated:false})));cands.forEach(async(p,i)=>{const res=await walkingMins(place.lat,place.lng,p.lat,p.lng);setNearby(prev=>prev.map((x,j)=>j===i?{...x,mins:res.mins,estimated:res.estimated}:x));});},[place.id]);
  if(!nearby.length) return null;
  return <div style={{ marginBottom:16 }}><div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.12em",marginBottom:8 }}>{T.nearbyWalk}</div><div style={{ display:"flex",flexDirection:"column",gap:6 }}>{nearby.map(p=>{const meta=CAT_META[p.category]||{color:"#ff2d55"};return<div key={p.id} onClick={()=>onSelect(p)} style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:10,cursor:"pointer" }}><div style={{ width:36,height:36,borderRadius:8,background:meta.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>{p.emoji}</div><div style={{ flex:1 }}><div style={{ fontSize:13,color:"#1a1a1a",fontWeight:500 }}>{isEN&&p.nameEN?p.nameEN:p.name}</div><div style={{ fontSize:11,color:"#a0a0b0" }}>{catLabel(p.category)}</div></div><div style={{ textAlign:"right",flexShrink:0 }}>{p.mins!==null?<div style={{ display:"flex",alignItems:"center",gap:4,color:p.estimated?"#ff9f0a":"#30d158",fontSize:12,fontWeight:600 }}><Icons.Walk/>{p.estimated?"~":""}{p.mins} {T.walkMin}</div>:<div className="pulsing" style={{ fontSize:11,color:"#a0a0b0" }}>{T.calc}</div>}<div style={{ fontSize:10,color:"#a0a0b0" }}>{p.distKm<1?(p.distKm*1000).toFixed(0)+"m":(p.distKm.toFixed(1)+"km")}{p.estimated&&p.mins!==null?" ~est":""}</div></div></div>;})} </div></div>;
}

function CheckInModal({ place, onClose, onSave, addToast }) {
  const handle=async()=>{
    if(navigator.vibrate) navigator.vibrate([50,30,100]);
    await onSave({status:"fui",date:new Date().toISOString().split("T")[0],who:"juntos",note:isEN?"Quick check-in!":"Check-in rapido!",photos:[],stars:0,thumb:null,vibes:[],price:place.price||null,petFriendly:place.petFriendly||false,publicBathroom:place.publicBathroom||false,link:place.link||"",season:place.season||"sempre"});
    addToast(T.checkinToast+" "+(isEN&&place.nameEN?place.nameEN:place.name)+"!","success");
    onClose();
  };
  return <div style={{ position:"fixed",inset:0,background:"#000000f0",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }} onClick={onClose}><div style={{ background:"#ffffff",border:"1px solid #e8e6e0",borderRadius:20,padding:"28px 24px",maxWidth:320,width:"100%",textAlign:"center" }} onClick={e=>e.stopPropagation()}><div style={{ fontSize:40,marginBottom:12 }}>{place.emoji}</div><div style={{ fontSize:17,fontWeight:700,color:"#1a1a1a",marginBottom:6 }}>{isEN&&place.nameEN?place.nameEN:place.name}</div><div style={{ fontSize:13,color:"#8a8a9a",marginBottom:24 }}>{T.checkinQuestion}</div><button onClick={handle} style={{ width:"100%",padding:"14px",background:"#30d158",border:"none",borderRadius:12,color:"#000",fontSize:14,fontWeight:700,cursor:"pointer",marginBottom:10 }}>{T.checkinNow}</button><button onClick={onClose} style={{ width:"100%",padding:"12px",background:"none",border:"1px solid #e8e6e0",borderRadius:12,color:"#8a8a9a",fontSize:13,cursor:"pointer" }}>{T.cancel}</button></div></div>;
}

function NearbyDrawer({ userLat, userLng, places, entries, onSelect, onClose }) {
  const [nearby,setNearby]=useState([]);
  useEffect(()=>{const cands=places.filter(p=>p.lat&&p.lng&&(entries[p.id]||{}).status!=="fui").map(p=>({...p,distKm:haversineKm(userLat,userLng,p.lat,p.lng)})).filter(p=>p.distKm<3).sort((a,b)=>a.distKm-b.distKm).slice(0,10);setNearby(cands.map(p=>({...p,mins:null,estimated:false})));cands.forEach(async(p,i)=>{const res=await walkingMins(userLat,userLng,p.lat,p.lng);setNearby(prev=>prev.map((x,j)=>j===i?{...x,mins:res.mins,estimated:res.estimated}:x));});},[]);
  return <div style={{ position:"fixed",inset:0,background:"#000000f0",zIndex:400,display:"flex",alignItems:"flex-end",justifyContent:"center" }} onClick={onClose}><div className="modal" style={{ background:"#ffffff",borderTop:"1px solid #e8e6e0",borderRadius:"20px 20px 0 0",padding:"20px 16px 40px",maxWidth:560,width:"100%",maxHeight:"75vh",overflowY:"auto" }} onClick={e=>e.stopPropagation()}><div style={{ width:36,height:3,background:"#e8e6e0",borderRadius:2,margin:"0 auto 16px" }}/><div style={{ fontSize:15,fontWeight:700,color:"#1a1a1a",marginBottom:4 }}>{T.nearbyTitle}</div><div style={{ fontSize:12,color:"#8a8a9a",marginBottom:14 }}>{T.nearbyRadius}</div>{!nearby.length?<div style={{ color:"#a0a0b0",fontSize:13,textAlign:"center",padding:"30px 0" }}>{T.noneNearby}</div>:<div style={{ display:"flex",flexDirection:"column",gap:8 }}>{nearby.map(p=>{const meta=CAT_META[p.category]||{color:"#ff2d55"};return<div key={p.id} onClick={()=>{onClose();setTimeout(()=>onSelect(p),150);}} style={{ display:"flex",alignItems:"center",gap:12,padding:"12px",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:12,cursor:"pointer" }}><div style={{ width:40,height:40,borderRadius:10,background:meta.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{p.emoji}</div><div style={{ flex:1 }}><div style={{ fontSize:14,color:"#1a1a1a",fontWeight:600 }}>{isEN&&p.nameEN?p.nameEN:p.name}</div><div style={{ fontSize:11,color:"#a0a0b0",marginTop:2 }}>{catLabel(p.category)} · {PRICE_EMOJI[p.price]||"?"}</div></div><div style={{ textAlign:"right",flexShrink:0 }}>{p.mins!==null?<div style={{ display:"flex",alignItems:"center",gap:4,color:p.estimated?"#ff9f0a":"#30d158",fontSize:13,fontWeight:600 }}><Icons.Walk/>{p.estimated?"~":""}{p.mins} {T.walkMin}</div>:<div className="pulsing" style={{ fontSize:11,color:"#a0a0b0" }}>{T.calc}</div>}<div style={{ fontSize:10,color:"#a0a0b0",marginTop:2 }}>{p.distKm<1?(p.distKm*1000).toFixed(0)+"m":(p.distKm.toFixed(1)+"km")}{p.estimated&&p.mins!==null?" est.":""}</div></div></div>;})} </div>}</div></div>;
}

function PlannerChatModal({ places, entries, onClose, addToast, userLat, userLng }) {
  const MAX_INTERACTIONS = 4;
  const [msgs,setMsgs]=useState([{role:"assistant",content:T.chatGreeting,linkedPlaces:[]}]);
  const [previewPlace,setPreviewPlace]=useState(null);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [selected,setSelected]=useState([]);
  const [planResult,setPlanResult]=useState("");
  const [planLoading,setPlanLoading]=useState(false);
  const [showPlan,setShowPlan]=useState(false);
  const [filterQ,setFilterQ]=useState("");
  const [startLoc,setStartLoc]=useState("Jersey City, NJ");
  const [locLoading,setLocLoading]=useState(false);
  const userMsgCount = msgs.filter(m=>m.role==="user").length;
  const bottomRef=useRef(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);

  useEffect(()=>{
    if(userLat&&userLng){
      fetch("https://nominatim.openstreetmap.org/reverse?lat="+userLat+"&lon="+userLng+"&format=json").then(r=>r.json()).then(d=>{const loc=(d.address.neighbourhood||d.address.suburb||d.address.city||"my location")+", "+(d.address.state||"NY");setStartLoc(loc);}).catch(()=>{});
    }
  },[userLat,userLng]);

  const available = places.filter(p=>{const e=entries[p.id]||{};return e.status!=="fui";});
  const visitedPlaces = places.filter(p=>(entries[p.id]||{}).status==="fui");

  const buildCatalog = () => {
    const lines = available.map(p=>{
      const e=entries[p.id]||{};
      const name=isEN&&p.nameEN?p.nameEN:p.name;
      const status=e.status==="quero"?"♥ wishlist":"disponivel";
      const region=p.lat>41?"Daytrip":p.lat>40.75?"Upper Manhattan/Bronx":p.lat>40.72?"Manhattan/Brooklyn Norte":p.lat>40.69?"Brooklyn/LES/Downtown":"Brooklyn Sul/Queens";
      return name+" | "+catLabel(p.category)+" | "+p.price+" | "+(p.time||"?")+" | "+status;
    });
    return lines.join("\n");
  };

  const parseLinkedPlaces = (text) => {
    const match = text.match(/\[lugares:\s*([^\]]+)\]/i);
    if(!match) return [];
    return match[1].split(",").map(n=>n.trim()).map(name=>{
      return places.find(p=>(isEN&&p.nameEN?p.nameEN:p.name).toLowerCase()===name.toLowerCase())||null;
    }).filter(Boolean);
  };

  const buildContextSummary = () => {
    const conv=msgs.map(m=>(m.role==="user"?"Voce: ":"IA: ")+m.content).join("\n");
    return (isEN?"Context from NYC Bucket List:\n":"Contexto do NYC Bucket List:\n")+conv+"\n\nLugares disponiveis:\n"+buildCatalog();
  };

  const send=async()=>{
    if(!input.trim()||loading||userMsgCount>=MAX_INTERACTIONS)return;
    const userMsg=input.trim();setInput("");
    const newMsgs=[...msgs,{role:"user",content:userMsg,linkedPlaces:[]}];
    setMsgs(newMsgs);setLoading(true);
    const selNames=selected.map(id=>{const p=places.find(x=>x.id===id);return p?(isEN&&p.nameEN?p.nameEN:p.name):"";}).filter(Boolean).join(", ");
    const lang=isEN?"English":"portugues brasileiro";
    const visitedNames=visitedPlaces.map(p=>isEN&&p.nameEN?p.nameEN:p.name).join(", ");
    const catalog=buildCatalog();
    const isLast=userMsgCount+1>=MAX_INTERACTIONS;
    const ctx="Voce e assistente pessoal de Gui e Gabriel para o NYC Bucket List.\n"+
      "REGRAS:\n"+
      "1. SOMENTE sugira lugares da LISTA ABAIXO. Nunca invente lugares.\n"+
      "2. NUNCA sugira: "+( visitedNames||"nenhum visitado ainda")+".\n"+
      "3. Use o NOME EXATO da lista ao citar um lugar.\n"+
      "4. Prefira metro + caminhada a pe.\n"+
      "5. No final liste os lugares citados: [lugares: Nome1, Nome2]\n"+
      (isLast?"6. ULTIMA INTERACAO: Gere um prompt resumido e compacto para continuar essa conversa em outro chat de IA. Formato: PROMPT PARA CONTINUAR: [contexto em 3-4 linhas com os principais pontos discutidos, preferencias de Gui e Gabriel, e lugares mais relevantes mencionados. Escreva como se fosse a primeira mensagem numa nova conversa de IA]\n":"")+
      "Partida: "+startLoc+".\n"+
      (selNames?"Selecionados: "+selNames+".\n":"")+
      "LISTA:\n"+catalog;
    try{
      const r=await fetch(AI_PROXY,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:ctx+"\n\nPergunta: "+userMsg}]})});
      const d=await r.json();
      const text=d.content?.[0]?.text||"Erro.";
      const linked=parseLinkedPlaces(text);
      const display=text.replace(/\[lugares:[^\]]+\]/gi,"").trim();
      setMsgs([...newMsgs,{role:"assistant",content:display,linkedPlaces:linked}]);
    }catch{setMsgs([...newMsgs,{role:"assistant",content:isEN?"Connection error.":"Erro ao conectar.",linkedPlaces:[]}]);}
    setLoading(false);
  };

  const detectLoc=()=>{setLocLoading(true);navigator.geolocation.getCurrentPosition(async pos=>{try{const r=await fetch("https://nominatim.openstreetmap.org/reverse?lat="+pos.coords.latitude+"&lon="+pos.coords.longitude+"&format=json");const d=await r.json();setStartLoc((d.address.neighbourhood||d.address.suburb||d.address.city||"my location")+", "+(d.address.state||"NY"));}catch{setStartLoc(pos.coords.latitude.toFixed(4)+","+pos.coords.longitude.toFixed(4));}setLocLoading(false);},()=>setLocLoading(false));};

  const genPlan=async()=>{setShowPlan(true);setPlanLoading(true);const chosen=places.filter(p=>selected.includes(p.id));const lang=isEN?"English":"portugues brasileiro";const prompt="I am in "+startLoc+" and want to visit in NYC: "+chosen.map(p=>(isEN&&p.nameEN?p.nameEN:p.name)+" ("+catLabel(p.category)+", "+p.time+", "+p.price+")").join("; ")+". Build a detailed route with times, specific transport (subway/walking), where to eat, and practical tips. Answer in "+lang+".";try{const r=await fetch(AI_PROXY,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:prompt}]})});const d=await r.json();setPlanResult(d.content?.[0]?.text||"Error.");}catch{setPlanResult(isEN?"Connection error.":"Erro ao conectar.");}setPlanLoading(false);};

  const toggleSel=id=>setSelected(prev=>prev.includes(id)?prev.filter(x=>x!==id):prev.length<8?[...prev,id]:prev);

  const filtPlaces=places.filter(p=>{if(!filterQ)return true;const q=normalize(filterQ);const name=normalize(isEN&&p.nameEN?p.nameEN:p.name);const cat=normalize(catLabel(p.category));return name.includes(q)||cat.includes(q)||(q==="free"&&p.price==="gratis")||(q==="gratis"&&p.price==="gratis");});

  if(showPlan)return <div style={{ position:"fixed",inset:0,background:"#000000f0",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center" }} onClick={()=>setShowPlan(false)}><div className="modal" style={{ background:"#ffffff",borderTop:"1px solid #e8e6e0",borderRadius:"20px 20px 0 0",padding:"20px 16px 40px",maxWidth:560,width:"100%",height:"88vh",display:"flex",flexDirection:"column" }} onClick={e=>e.stopPropagation()}><div style={{ width:36,height:3,background:"#e8e6e0",borderRadius:2,margin:"0 auto 14px" }}/><div style={{ fontSize:15,fontWeight:700,color:"#1a1a1a",marginBottom:2 }}>{T.routeTitle}</div><div style={{ fontSize:12,color:"#8a8a9a",marginBottom:12 }}>{T.departingFrom} {startLoc}</div>{planLoading?<div style={{ textAlign:"center",padding:"40px 0" }}><div className="pulsing" style={{ fontSize:36,marginBottom:12 }}>🤖</div><div style={{ fontSize:13,color:"#8a8a9a" }}>{T.generating}</div></div>:<><div style={{ flex:1,overflowY:"auto",background:"#f8f7f4",borderRadius:12,padding:"14px",fontSize:13,color:"#1a1a1a",lineHeight:1.7,whiteSpace:"pre-wrap",marginBottom:14 }}>{planResult}</div><div style={{ display:"flex",gap:8 }}><button onClick={()=>{navigator.clipboard.writeText(planResult);addToast(T.routeCopied,"success");}} style={{ flex:1,padding:"12px",background:"#ff2d55",border:"none",borderRadius:10,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer" }}>{T.copyRoute}</button><button onClick={()=>setShowPlan(false)} style={{ flex:1,padding:"12px",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:10,color:"#8a8a9a",fontSize:13,cursor:"pointer" }}>{T.newRoute}</button></div></>}</div></div>;

  return <>
    {previewPlace&&(
      <div style={{ position:"fixed",inset:0,background:"#000000c0",zIndex:500,display:"flex",alignItems:"flex-end",justifyContent:"center" }} onClick={()=>setPreviewPlace(null)}>
        <div className="modal" style={{ background:"#ffffff",borderTop:"1px solid #e8e6e0",borderRadius:"20px 20px 0 0",padding:"20px 16px 40px",maxWidth:560,width:"100%",maxHeight:"80vh",overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
          <div style={{ width:36,height:3,background:"#e8e6e0",borderRadius:2,margin:"0 auto 16px" }}/>
          <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:14 }}>
            <span style={{ fontSize:32 }}>{previewPlace.emoji}</span>
            <div>
              <div style={{ fontSize:17,fontWeight:700,color:"#1a1a1a" }}>{isEN&&previewPlace.nameEN?previewPlace.nameEN:previewPlace.name}</div>
              <div style={{ display:"flex",gap:6,marginTop:4,flexWrap:"wrap" }}>
                <span style={{ fontSize:11,color:(CAT_META[previewPlace.category]||{color:"#ff2d55"}).color,background:(CAT_META[previewPlace.category]||{color:"#ff2d55"}).color+"20",borderRadius:6,padding:"2px 8px" }}>{catLabel(previewPlace.category)}</span>
                {previewPlace.price&&<span style={{ fontSize:11,color:"#8a8a9a",background:"#f8f7f4",borderRadius:6,padding:"2px 8px" }}>{PRICE_EMOJI[previewPlace.price]}</span>}
                {previewPlace.time&&<span style={{ fontSize:11,color:"#a0a0b0",background:"#f8f7f4",borderRadius:6,padding:"2px 8px" }}>⏱ {previewPlace.time}</span>}
              </div>
            </div>
          </div>
          <div style={{ fontSize:13,color:"#8a8a9a",lineHeight:1.6,marginBottom:10,padding:"10px 12px",background:"#f8f7f4",borderRadius:10,borderLeft:"2px solid "+(CAT_META[previewPlace.category]||{color:"#ff2d55"}).color }}>
            {isEN&&previewPlace.descEN?previewPlace.descEN:previewPlace.desc}
          </div>
          {(isEN&&previewPlace.repEN?previewPlace.repEN:previewPlace.rep)&&(
            <div style={{ fontSize:12,color:"#ff9f0a",lineHeight:1.5,marginBottom:16,padding:"8px 12px",background:"#ff9f0a10",borderRadius:10,borderLeft:"2px solid #ff9f0a" }}>
              ⭐ {isEN&&previewPlace.repEN?previewPlace.repEN:previewPlace.rep}
            </div>
          )}
          <div style={{ display:"flex",gap:8 }}>
            <button onClick={()=>{setSelected(prev=>prev.includes(previewPlace.id)?prev.filter(x=>x!==previewPlace.id):prev.length<8?[...prev,previewPlace.id]:prev);}} style={{ flex:1,padding:"12px",background:selected.includes(previewPlace.id)?"#30d15820":"#ff2d5515",border:"1px solid "+(selected.includes(previewPlace.id)?"#30d158":"#ff2d55"),borderRadius:10,color:selected.includes(previewPlace.id)?"#30d158":"#ff2d55",fontSize:13,fontWeight:600,cursor:"pointer" }}>
              {selected.includes(previewPlace.id)?"✓ "+(isEN?"In route":"No roteiro"):"+ "+(isEN?"Add to route":"Adicionar ao roteiro")}
            </button>
            <button onClick={()=>setPreviewPlace(null)} style={{ padding:"12px 16px",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:10,color:"#8a8a9a",fontSize:13,cursor:"pointer" }}>
              {isEN?"Close":"Fechar"}
            </button>
          </div>
        </div>
      </div>
    )}
    <div style={{ position:"fixed",inset:0,background:"#000000f0",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center" }} onClick={onClose}><div className="modal" onTouchStart={e=>{window._chatDragY=e.touches[0].clientY;}} onTouchEnd={e=>{if(e.changedTouches[0].clientY-window._chatDragY>90)onClose();}} style={{ background:"#ffffff",borderTop:"1px solid #e8e6e0",borderRadius:"20px 20px 0 0",maxWidth:560,width:"100%",height:"90vh",display:"flex",flexDirection:"column" }} onClick={e=>e.stopPropagation()}>
    <div style={{ padding:"14px 16px 12px",borderBottom:"1px solid #e8e6e0" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
        <div><div style={{ fontSize:15,fontWeight:700,color:"#1a1a1a" }}>{T.chatTitle}</div><div style={{ fontSize:11,color:"#8a8a9a" }}>{T.chatSub}</div></div>
        <button onClick={onClose} style={{ background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,width:32,height:32,color:"#8a8a9a",cursor:"pointer",fontSize:16 }}>×</button>
      </div>
      <div style={{ display:"flex",gap:8 }}>
        <input value={startLoc} onChange={e=>setStartLoc(e.target.value)} style={{ flex:1,background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"7px 10px",color:"#1a1a1a",fontSize:12 }} placeholder={T.departure}/>
        <button onClick={detectLoc} style={{ padding:"7px 10px",background:"#ff2d5515",border:"1px solid #ff2d5540",borderRadius:8,color:"#ff2d55",fontSize:11,cursor:"pointer" }}>{locLoading?"...":"📍 "+T.gps}</button>
      </div>
    </div>
    <div style={{ flex:1,overflowY:"auto",padding:"12px 16px" }}>
      {/* Interaction counter */}
      <div style={{ textAlign:"center",marginBottom:10 }}>
        <span style={{ fontSize:10,color:"#a0a0b0",background:"#ffffff",borderRadius:20,padding:"3px 10px" }}>
          {userMsgCount}/{MAX_INTERACTIONS} {isEN?"interactions":"interacoes"} · {MAX_INTERACTIONS-userMsgCount} {isEN?"remaining":"restantes"}
        </span>
      </div>
      {msgs.map((m,i)=>(
        <div key={i} style={{ marginBottom:12,display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",flexDirection:"column",alignItems:m.role==="user"?"flex-end":"flex-start" }}>
          <div style={{ display:"flex",alignItems:"flex-end",gap:8,justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
            {m.role==="assistant"&&<div style={{ width:28,height:28,borderRadius:"50%",background:"#ff2d5515",border:"1px solid #ff2d5540",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0 }}>🤖</div>}
            <div style={{ maxWidth:"80%",padding:"10px 14px",borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:m.role==="user"?"#ff2d55":"#f8f7f4",border:m.role==="user"?"none":"1px solid #e8e6e0",color:"#1a1a1a",fontSize:13,lineHeight:1.6,whiteSpace:"pre-wrap" }}>{m.content}</div>
          </div>
          {/* Linked place chips */}
          {m.linkedPlaces&&m.linkedPlaces.length>0&&(
            <div style={{ marginTop:6,marginLeft:36,display:"flex",flexWrap:"wrap",gap:5 }}>
              {m.linkedPlaces.map(p=>{
                const meta=CAT_META[p.category]||{color:"#ff2d55"};
                const inSel=selected.includes(p.id);
                return <div key={p.id} style={{ display:"flex",alignItems:"center",background:meta.color+"15",border:"1px solid "+meta.color+"40",borderRadius:20,overflow:"hidden" }}>
                  <button onClick={()=>setPreviewPlace(p)} style={{ display:"flex",alignItems:"center",gap:5,padding:"4px 10px",background:"none",border:"none",color:meta.color,fontSize:11,cursor:"pointer",fontFamily:"inherit" }}>
                    <span>{p.emoji}</span><span>{isEN&&p.nameEN?p.nameEN:p.name}</span><span style={{ opacity:0.6 }}>↗</span>
                  </button>
                  <button onClick={()=>setSelected(prev=>inSel?prev.filter(x=>x!==p.id):prev.length<8?[...prev,p.id]:prev)} style={{ padding:"4px 8px 4px 4px",background:inSel?meta.color+"40":"none",border:"none",color:inSel?meta.color:"#8a8a9a",fontSize:13,cursor:"pointer",fontFamily:"inherit",borderLeft:"1px solid "+meta.color+"30" }}>
                    {inSel?"✓":"+"}
                  </button>
                </div>;
              })}
            </div>
          )}
          {/* Last message: copy context button */}
          {m.role==="assistant"&&userMsgCount>=MAX_INTERACTIONS&&i===msgs.length-1&&(
            <div style={{ marginTop:10,marginLeft:36,background:"#ffffff",border:"1px solid #e8e6e0",borderRadius:12,padding:"12px" }}>
              <div style={{ fontSize:12,color:"#8a8a9a",marginBottom:8 }}>{isEN?"Continue this conversation in a full AI chat:":"Continue essa conversa num chat de IA completo:"}</div>
              <button onClick={()=>{navigator.clipboard.writeText(buildContextSummary());addToast(isEN?"Context copied!":"Contexto copiado!","success");}} style={{ width:"100%",padding:"9px",background:"#ff2d55",border:"none",borderRadius:8,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
                {isEN?"Copy context to paste in Claude / ChatGPT":"Copiar contexto para colar no Claude / ChatGPT"}
              </button>
            </div>
          )}
        </div>
      ))}
      {loading&&<div style={{ display:"flex",alignItems:"flex-end",gap:8,marginBottom:10 }}><div style={{ width:28,height:28,borderRadius:"50%",background:"#ff2d5515",border:"1px solid #ff2d5540",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14 }}>🤖</div><div style={{ padding:"10px 14px",borderRadius:"18px 18px 18px 4px",background:"#f8f7f4",border:"1px solid #e8e6e0" }}><span className="pulsing" style={{ color:"#8a8a9a",fontSize:13 }}>{T.typing}</span></div></div>}
      <div ref={bottomRef}/>
    </div>
    <div style={{ borderTop:"1px solid #e8e6e0",padding:"10px 16px 16px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6 }}>
        <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em" }}>{T.placesCount} ({selected.length}/8)</div>
        {selected.length>0&&<button onClick={()=>setSelected([])} style={{ background:"none",border:"none",color:"#a0a0b0",fontSize:11,cursor:"pointer" }}>{T.clearSel}</button>}
      </div>
      <input value={filterQ} onChange={e=>setFilterQ(e.target.value)} placeholder={T.filterPlaces} style={{ width:"100%",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"6px 10px",color:"#1a1a1a",fontSize:12,marginBottom:8 }}/>
      <div style={{ display:"flex",gap:5,overflowX:"auto",scrollbarWidth:"none",paddingBottom:8 }}>
        {filtPlaces.map(p=>{const on=selected.includes(p.id),meta=CAT_META[p.category]||{color:"#ff2d55"};return<div key={p.id} onClick={()=>toggleSel(p.id)} style={{ display:"flex",alignItems:"center",gap:5,padding:"5px 10px",background:on?meta.color+"20":"#f8f7f4",border:"1px solid "+(on?meta.color:"#e8e6e0"),borderRadius:20,cursor:"pointer",flexShrink:0,transition:"all 0.12s" }}><span style={{ fontSize:13 }}>{p.emoji}</span><span style={{ fontSize:11,color:on?"#1a1a1a":"#8a8a9a",whiteSpace:"nowrap" }}>{isEN&&p.nameEN?p.nameEN:p.name}</span>{on&&<span style={{ fontSize:11,color:meta.color }}>✓</span>}</div>;})}
      </div>
      {selected.length>0&&<button onClick={genPlan} style={{ width:"100%",padding:"10px",background:"#ff2d55",border:"none",borderRadius:10,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:8 }}>{T.genRoute} ({selected.length}) →</button>}
      <div style={{ display:"flex",gap:8 }}>
        <input autoFocus value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder={userMsgCount>=MAX_INTERACTIONS?(isEN?"Limit reached - copy context above":"Limite atingido - copie o contexto acima"):T.askNYC} disabled={userMsgCount>=MAX_INTERACTIONS} style={{ flex:1,background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:20,padding:"9px 14px",color:userMsgCount>=MAX_INTERACTIONS?"#a0a0b0":"#1a1a1a",fontSize:13,opacity:userMsgCount>=MAX_INTERACTIONS?0.5:1 }}/>
        <button onClick={send} disabled={!input.trim()||loading||userMsgCount>=MAX_INTERACTIONS} style={{ background:input.trim()&&!loading&&userMsgCount<MAX_INTERACTIONS?"#ff2d55":"#e8e6e0",border:"none",borderRadius:20,padding:"9px 14px",color:input.trim()&&!loading&&userMsgCount<MAX_INTERACTIONS?"#fff":"#a0a0b0",cursor:input.trim()&&!loading&&userMsgCount<MAX_INTERACTIONS?"pointer":"default",fontSize:14,fontWeight:600,transition:"all 0.15s" }}>↑</button>
      </div>
    </div>
  </div></div>
  </>;
}

function EditNameModal({ place, onClose, onSave }) {
  const [name,setName]=useState(isEN&&place.nameEN?place.nameEN:place.name);
  const [emoji,setEmoji]=useState(place.emoji);
  const [desc,setDesc]=useState(isEN&&place.descEN?place.descEN:place.desc||"");
  const handle=()=>{if(!name.trim())return;const updated={...place};if(isEN){updated.nameEN=name.trim();updated.descEN=desc.trim();}else{updated.name=name.trim();updated.desc=desc.trim();}updated.emoji=emoji;onSave(updated);onClose();};
  return <div style={{ position:"fixed",inset:0,background:"#000000f0",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }} onClick={onClose}><div style={{ background:"#ffffff",border:"1px solid #e8e6e0",borderRadius:16,padding:"20px",maxWidth:400,width:"100%" }} onClick={e=>e.stopPropagation()}><div style={{ fontSize:15,fontWeight:700,color:"#1a1a1a",marginBottom:14 }}>{T.editPlace}</div><div style={{ display:"flex",gap:10,marginBottom:12 }}><input value={emoji} onChange={e=>setEmoji(e.target.value)} maxLength={2} style={{ width:50,background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"8px",color:"#1a1a1a",fontSize:22,textAlign:"center" }}/><input value={name} onChange={e=>setName(e.target.value)} style={{ flex:1,background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"8px 12px",color:"#1a1a1a",fontSize:14 }}/></div><textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder={T.descLabel} rows={3} style={{ width:"100%",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"8px 12px",color:"#1a1a1a",fontSize:13,resize:"none",marginBottom:14 }}/><div style={{ display:"flex",gap:8 }}><button onClick={handle} style={{ flex:1,padding:"11px",background:"#ff2d55",border:"none",borderRadius:10,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer" }}>{T.save}</button><button onClick={onClose} style={{ flex:1,padding:"11px",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:10,color:"#8a8a9a",fontSize:13,cursor:"pointer" }}>{T.cancel}</button></div></div></div>;
}

function DetailModal({ place, entry, places, entries, onClose, onSave, onDelete, onSelectNearby, onEditPlace, addToast, userLat, userLng }) {
  const drag = useDragToDismiss(onClose);
  const e=entry||{};
  const [note,setNote]=useState(e.note||"");
  const [date,setDate]=useState(e.date||new Date().toISOString().split("T")[0]);
  const [photos,setPhotos]=useState(e.photos||(e.photo?[e.photo]:[]));
  const [status,setStatus]=useState(e.status||"quero");
  const [stars,setStars]=useState(e.stars||0);
  const [thumb,setThumb]=useState(e.thumb||null);
  const [vibes,setVibes]=useState(e.vibes||[]);
  const [price,setPrice]=useState(e.price||place.price||null);
  const [who,setWho]=useState(e.who||"juntos");
  const [link,setLink]=useState(e.link||place.link||"");
  const [petFriendly,setPetFriendly]=useState(e.petFriendly!==undefined?e.petFriendly:(place.petFriendly||false));
  const [publicBathroom,setPublicBathroom]=useState(e.publicBathroom!==undefined?e.publicBathroom:(place.publicBathroom||false));
  const [season,setSeason]=useState(e.season||place.season||"sempre");
  const [saving,setSaving]=useState(false);
  const [confirmDel,setConfirmDel]=useState(false);
  const [showEdit,setShowEdit]=useState(false);
  const [improving,setImproving]=useState(false);
  const [spent,setSpent]=useState(e.spent||"");
  const [needsRes,setNeedsRes]=useState(e.needsReservation!==undefined?e.needsReservation:(place.needsReservation||false));
  const [hours,setHours]=useState(e.hours||place.hours||"");
  const meta=CAT_META[place.category]||{color:"#ff2d55"};
  const STATUS={quero:{label:T.wantGo,icon:"♡",sel:"♥",color:"#007aff"},fui:{label:T.beenThere,icon:"○",sel:"✓",color:"#30d158"}};
  const mapsUrl="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent((isEN&&place.nameEN?place.nameEN:place.name)+" New York");
  const cityUrl=citymapperUrl(place, userLat, userLng);
  const displayName=isEN&&place.nameEN?place.nameEN:place.name;
  const displayDesc=isEN&&place.descEN?place.descEN:place.desc;
  const displayRep=isEN&&place.repEN?place.repEN:place.rep;

  const handleSave=async()=>{setSaving(true);await onSave({status,note,date,photos,stars,thumb,vibes,price,who,link,petFriendly,publicBathroom,season,spent:spent?parseFloat(spent)||0:null,needsReservation:needsRes,hours});setSaving(false);addToast(T.savedToast,"success");};
  const handleDelete=async()=>{await onDelete();};

  const improveNote=async()=>{
    if(!note.trim())return;
    setImproving(true);
    const lang=isEN?"English":"portugues brasileiro";
    const prompt="Improve this note about "+displayName+" keeping the personal tone and style. Note: "+note+". Return only the improved note, no quotes, in "+lang+".";
    try{const r=await fetch(AI_PROXY,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:prompt}]})});const d=await r.json();if(d.content?.[0]?.text)setNote(d.content[0].text);}catch{}
    setImproving(false);
  };

  return <>
    <div style={{ position:"fixed",inset:0,background:"#000000f0",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center" }} onClick={onClose}>
      <div className="modal" onTouchStart={drag.onTouchStart} onTouchEnd={drag.onTouchEnd} style={{ background:"#ffffff",borderTop:"1px solid #e8e6e0",borderRadius:"20px 20px 0 0",padding:"20px 16px 48px",maxWidth:560,width:"100%",maxHeight:"94vh",overflowY:"auto" }} onClick={ev=>ev.stopPropagation()}>
        <div style={{ width:44,height:4,background:"#d0cdc8",borderRadius:2,margin:"0 auto 16px",cursor:"grab" }}/>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:6 }}>
              <span style={{ fontSize:28 }}>{place.emoji}</span>
              <div>
                <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                  <div style={{ fontSize:17,fontWeight:700,color:"#1a1a1a",lineHeight:1.2 }}>{displayName}</div>
                  <button onClick={()=>setShowEdit(true)} style={{ background:"none",border:"none",color:"#a0a0b0",cursor:"pointer",padding:"2px",display:"flex" }}><Icons.Edit/></button>
                </div>
                <div style={{ display:"flex",gap:5,marginTop:4,flexWrap:"wrap" }}>
                  <span style={{ fontSize:11,color:meta.color,background:meta.color+"20",borderRadius:6,padding:"2px 8px" }}>{catLabel(place.category)}</span>
                  {price&&<span style={{ fontSize:11,color:"#8a8a9a",background:"#f8f7f4",borderRadius:6,padding:"2px 8px" }}>{PRICE_EMOJI[price]}</span>}
                  {place.time&&<span style={{ fontSize:11,color:"#a0a0b0",background:"#f8f7f4",borderRadius:6,padding:"2px 8px" }}>⏱ {place.time}</span>}
                  {petFriendly&&<span style={{ fontSize:11,color:"#4ade80",background:"#4ade8020",borderRadius:6,padding:"2px 8px" }}>🐾</span>}
                  {publicBathroom&&<span style={{ fontSize:11,color:"#60a5fa",background:"#60a5fa20",borderRadius:6,padding:"2px 8px" }}>🚻</span>}
                  {needsRes&&<span style={{ fontSize:11,color:"#f59e0b",background:"#f59e0b20",borderRadius:6,padding:"2px 8px" }}>📋 {isEN?"Reserve":"Reservar"}</span>}
                  {hours&&<span style={{ fontSize:11,color:"#8a8a9a",background:"#f8f7f4",borderRadius:6,padding:"2px 8px" }}>🕐 {hours.split(",")[0]}</span>}
                </div>
              </div>
            </div>
          </div>
          <div style={{ display:"flex",gap:5,flexWrap:"wrap" }}>
            <a href={mapsUrl} target="_blank" rel="noreferrer" style={{ background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"0 10px",height:34,color:"#8a8a9a",display:"flex",alignItems:"center",gap:5,textDecoration:"none",fontSize:11,whiteSpace:"nowrap" }}>📍 Maps</a>
            {cityUrl&&<a href={cityUrl} target="_blank" rel="noreferrer" style={{ background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"0 10px",height:34,color:"#8a8a9a",display:"flex",alignItems:"center",gap:5,textDecoration:"none",fontSize:11,whiteSpace:"nowrap" }}>🗺 Rota</a>}
            {link&&<a href={link} target="_blank" rel="noreferrer" style={{ background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"0 10px",height:34,color:"#8a8a9a",display:"flex",alignItems:"center",gap:5,textDecoration:"none",fontSize:11,whiteSpace:"nowrap" }}>🔗 Site</a>}
            {status==="quero"&&(()=>{const gcName=encodeURIComponent(isEN&&place.nameEN?place.nameEN:place.name);const gcLoc=encodeURIComponent("New York, NY");const gcUrl="https://calendar.google.com/calendar/render?action=TEMPLATE&text="+gcName+"&location="+gcLoc+"&details="+encodeURIComponent((isEN&&place.descEN?place.descEN:place.desc)||"");return<a href={gcUrl} target="_blank" rel="noreferrer" style={{ background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"0 10px",height:34,color:"#8a8a9a",display:"flex",alignItems:"center",gap:5,textDecoration:"none",fontSize:11,whiteSpace:"nowrap" }}>📅 {isEN?"Calendar":"Agenda"}</a>;})()} 
            <button onClick={onClose} style={{ background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,width:34,height:34,color:"#8a8a9a",cursor:"pointer",fontSize:18 }}>×</button>
          </div>
        </div>
        <div style={{ fontSize:13,color:"#8a8a9a",lineHeight:1.6,marginBottom:10,padding:"10px 12px",background:"#f8f7f4",borderRadius:10,borderLeft:"2px solid "+meta.color }}>{displayDesc}</div>
        {displayRep&&<div style={{ fontSize:12,color:"#ff9f0a",lineHeight:1.5,marginBottom:14,padding:"8px 12px",background:"#ff9f0a10",borderRadius:10,borderLeft:"2px solid #ff9f0a" }}>⭐ {displayRep}</div>}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.12em",marginBottom:8 }}>{T.status}</div>
          <div style={{ display:"flex",gap:8 }}>{Object.entries(STATUS).map(([key,cfg])=><button key={key} onClick={()=>setStatus(key)} style={{ flex:1,padding:"10px 4px",borderRadius:10,background:status===key?cfg.color+"18":"#f8f7f4",border:"1px solid "+(status===key?cfg.color+"60":"#e8e6e0"),color:status===key?cfg.color:"#a0a0b0",fontSize:14,cursor:"pointer",transition:"all 0.15s" }}><div>{status===key?cfg.sel:cfg.icon}</div><div style={{ fontSize:10,marginTop:3 }}>{cfg.label}</div></button>)}</div>
        </div>
        {status==="fui"&&<>
          <div style={{ marginBottom:14 }}><div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.12em",marginBottom:8 }}>{T.whoWent}</div><div style={{ display:"flex",gap:8 }}>{WHO_OPTIONS.map(w=><button key={w} onClick={()=>setWho(w)} style={{ flex:1,padding:"10px 4px",borderRadius:10,background:who===w?"#ff9f0a18":"#f8f7f4",border:"1px solid "+(who===w?"#ff9f0a60":"#e8e6e0"),color:who===w?"#ff9f0a":"#a0a0b0",fontSize:13,cursor:"pointer",transition:"all 0.15s" }}><div>{WHO_EMOJI[w]}</div><div style={{ fontSize:10,marginTop:3 }}>{WHO_LABELS[w]}</div></button>)}</div></div>
          <div style={{ marginBottom:14 }}><div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.12em",marginBottom:8 }}>{T.when}</div><input type="date" value={date} onChange={ev=>setDate(ev.target.value)} style={{ width:"100%",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:10,padding:"10px 14px",color:"#1a1a1a",fontSize:14 }}/></div>
        </>}
        <div style={{ marginBottom:14 }}><div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.12em",marginBottom:8 }}>{T.price}</div><div style={{ display:"flex",gap:6 }}>{PRICE_LEVELS.map(p=><button key={p} onClick={()=>setPrice(price===p?null:p)} style={{ flex:1,padding:"8px 4px",borderRadius:10,background:price===p?"#ff9f0a18":"#f8f7f4",border:"1px solid "+(price===p?"#ff9f0a60":"#e8e6e0"),color:price===p?"#ff9f0a":"#a0a0b0",fontSize:13,cursor:"pointer",transition:"all 0.15s" }}>{PRICE_EMOJI[p]}</button>)}</div></div>
        <div style={{ marginBottom:14 }}><div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.12em",marginBottom:8 }}>{T.bestSeason}</div><div style={{ display:"flex",gap:5,flexWrap:"wrap" }}>{SEASONS.map(s=><button key={s} onClick={()=>setSeason(s)} style={{ padding:"6px 10px",borderRadius:20,background:season===s?"#ff9f0a18":"#f8f7f4",border:"1px solid "+(season===s?"#ff9f0a60":"#e8e6e0"),color:season===s?"#ff9f0a":"#a0a0b0",fontSize:12,cursor:"pointer",transition:"all 0.15s" }}>{SEASON_EMOJI[s]} {SEASON_LABELS[s]}</button>)}</div></div>
        <div style={{ marginBottom:14 }}><div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.12em",marginBottom:8 }}>{T.vibe}</div><div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>{VIBES.map(v=><button key={v} onClick={()=>setVibes(prev=>prev.includes(v)?prev.filter(x=>x!==v):[...prev,v])} style={{ padding:"6px 12px",borderRadius:20,background:vibes.includes(v)?"#ff2d5518":"#f8f7f4",border:"1px solid "+(vibes.includes(v)?"#ff2d5560":"#e8e6e0"),color:vibes.includes(v)?"#ff2d55":"#a0a0b0",fontSize:12,cursor:"pointer",transition:"all 0.15s" }}>{VIBE_EMOJI[v]} {VIBE_LABELS[v]}</button>)}</div></div>
        <div style={{ marginBottom:14 }}><div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.12em",marginBottom:8 }}>{T.facilities}</div><div style={{ display:"flex",gap:8 }}><button onClick={()=>setPetFriendly(!petFriendly)} style={{ flex:1,padding:"9px",borderRadius:10,background:petFriendly?"#4ade8018":"#f8f7f4",border:"1px solid "+(petFriendly?"#4ade8060":"#e8e6e0"),color:petFriendly?"#4ade80":"#a0a0b0",fontSize:12,cursor:"pointer",transition:"all 0.15s" }}>{T.pet}</button><button onClick={()=>setPublicBathroom(!publicBathroom)} style={{ flex:1,padding:"9px",borderRadius:10,background:publicBathroom?"#60a5fa18":"#f8f7f4",border:"1px solid "+(publicBathroom?"#60a5fa60":"#e8e6e0"),color:publicBathroom?"#60a5fa":"#a0a0b0",fontSize:12,cursor:"pointer",transition:"all 0.15s" }}>{T.bathroom}</button></div></div>
        {status==="fui"&&<div style={{ marginBottom:14 }}><div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.12em",marginBottom:8 }}>{T.rating}</div><div style={{ display:"flex",gap:4,marginBottom:10 }}>{[1,2,3,4,5].map(n=><span key={n} onClick={()=>setStars(stars===n?0:n)} style={{ fontSize:26,cursor:"pointer",color:n<=stars?"#ff9f0a":"#a0a0b0",transition:"color 0.1s" }}>★</span>)}</div><div style={{ display:"flex",gap:8 }}><button onClick={()=>setThumb(thumb==="up"?null:"up")} style={{ flex:1,padding:"10px",borderRadius:10,background:thumb==="up"?"#30d15820":"#f8f7f4",border:"1px solid "+(thumb==="up"?"#30d158":"#e8e6e0"),fontSize:20,cursor:"pointer",transition:"all 0.15s" }}>👍</button><button onClick={()=>setThumb(thumb==="down"?null:"down")} style={{ flex:1,padding:"10px",borderRadius:10,background:thumb==="down"?"#ff2d5515":"#f8f7f4",border:"1px solid "+(thumb==="down"?"#ff2d55":"#e8e6e0"),fontSize:20,cursor:"pointer",transition:"all 0.15s" }}>👎</button></div></div>}
        {status==="fui"&&<div style={{ marginBottom:14 }}>
          <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.12em",marginBottom:8 }}>{T.spending}</div>
          <div style={{ display:"flex",alignItems:"center",gap:10,background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:10,padding:"10px 14px" }}>
            <span style={{ fontSize:18 }}>💸</span>
            <span style={{ fontSize:16,color:"#a0a0b0",fontWeight:600 }}>$</span>
            <input type="number" min="0" step="0.01" value={spent} onChange={ev=>setSpent(ev.target.value)} placeholder={T.spendingPlaceholder} style={{ flex:1,background:"none",border:"none",color:"#1a1a1a",fontSize:16,fontWeight:600 }}/>
            {spent&&<span style={{ fontSize:12,color:"#30d158" }}>${parseFloat(spent)||0} USD</span>}
          </div>
        </div>}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.12em",marginBottom:8 }}>{T.needsReservation}</div>
          <div style={{ display:"flex",gap:8 }}>
            <button onClick={()=>setNeedsRes(true)} style={{ flex:1,padding:"10px",borderRadius:10,background:needsRes?"#f59e0b20":"#f8f7f4",border:"1px solid "+(needsRes?"#f59e0b60":"#e8e6e0"),color:needsRes?"#f59e0b":"#a0a0b0",fontSize:13,cursor:"pointer",transition:"all 0.15s",display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
              <span>📋</span><span>{isEN?"Yes, reserve":"Sim, reservar"}</span>
            </button>
            <button onClick={()=>setNeedsRes(false)} style={{ flex:1,padding:"10px",borderRadius:10,background:!needsRes?"#f8f7f480":"#f8f7f4",border:"1px solid "+((!needsRes)?"#e8e6e0":"#e8e6e0"),color:!needsRes?"#8a8a9a":"#a0a0b0",fontSize:13,cursor:"pointer",transition:"all 0.15s",display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
              <span>✓</span><span>{isEN?"No need":"Nao precisa"}</span>
            </button>
          </div>
        </div>
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.12em",marginBottom:8 }}>{T.openingHours}</div>
          <input value={hours} onChange={ev=>setHours(ev.target.value)} placeholder={T.hoursPlaceholder} style={{ width:"100%",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:10,padding:"10px 14px",color:"#1a1a1a",fontSize:13 }}/>
        </div>
        <div style={{ marginBottom:14 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
            <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.12em" }}>{status==="fui"?T.howWasIt:T.notes}</div>
            <button onClick={improveNote} disabled={!note.trim()||improving} style={{ background:"none",border:"1px solid #e8e6e0",borderRadius:8,padding:"3px 8px",color:note.trim()&&!improving?"#8a8a9a":"#3a3a50",fontSize:11,cursor:note.trim()&&!improving?"pointer":"default" }}>{improving?<span className="pulsing">{T.improving}</span>:T.improveBtn}</button>
          </div>
          <textarea value={note} onChange={ev=>setNote(ev.target.value)} placeholder={status==="fui"?T.notePlaceholder:T.reminderPlaceholder} rows={3} style={{ width:"100%",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:10,padding:"10px 14px",color:"#1a1a1a",fontSize:14,resize:"none" }}/>
        </div>
        <div style={{ marginBottom:14 }}><div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.12em",marginBottom:8 }}>{T.link}</div><input value={link} onChange={ev=>setLink(ev.target.value)} placeholder="https://..." style={{ width:"100%",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:10,padding:"10px 14px",color:"#1a1a1a",fontSize:13 }}/></div>
        <div style={{ marginBottom:14 }}><div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.12em",marginBottom:8 }}>{T.photos}</div><PhotoGallery photos={photos} onChange={setPhotos}/></div>
        <NearbyInModal place={place} places={places} entries={entries} onSelect={p=>{onClose();setTimeout(()=>onSelectNearby(p),150);}}/>
        <button onClick={handleSave} disabled={saving} style={{ width:"100%",padding:"14px",background:saving?"#e8e6e0":"#ff2d55",border:"none",borderRadius:12,color:saving?"#a0a0b0":"#fff",fontSize:14,fontWeight:700,cursor:saving?"default":"pointer",marginBottom:10,transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>{saving?<><span className="pulsing">●</span> {T.saving2}</>:T.save}</button>
        {confirmDel?<div style={{ display:"flex",gap:8 }}><button onClick={()=>setConfirmDel(false)} style={{ flex:1,padding:"11px",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:10,color:"#8a8a9a",fontSize:13,cursor:"pointer" }}>{T.cancel}</button><button onClick={handleDelete} style={{ flex:1,padding:"11px",background:"#4a0000",border:"1px solid #883333",borderRadius:10,color:"#ff8888",fontSize:13,cursor:"pointer" }}>{T.confirm}</button></div>:<button onClick={()=>setConfirmDel(true)} style={{ width:"100%",padding:"11px",background:"none",border:"1px solid #e8e6e0",borderRadius:10,color:"#a0a0b0",fontSize:13,cursor:"pointer" }}>{T.remove}</button>}
      </div>
    </div>
    {showEdit&&<EditNameModal place={place} onClose={()=>setShowEdit(false)} onSave={updated=>{onEditPlace(place.id,{name:updated.name,nameEN:updated.nameEN,emoji:updated.emoji,desc:updated.desc,descEN:updated.descEN});setShowEdit(false);}}/>}
  </>;
}

function AddModal({ onClose, onAdd, addToast }) {
  const [name,setName]=useState(""),[desc,setDesc]=useState(""),[emoji,setEmoji]=useState("📍");
  const [category,setCategory]=useState(CATEGORIES[0]),[price,setPrice]=useState("$"),[time,setTime]=useState("2h"),[link,setLink]=useState("");
  const [address,setAddress]=useState(""),[geocoding,setGeocoding]=useState(false),[saving,setSaving]=useState(false);
  const [status,setStatus]=useState(null); // null | "quero" | "fui"
  const [visitDate,setVisitDate]=useState(new Date().toISOString().split("T")[0]);
  const [who,setWho]=useState("juntos");
  const handle=async()=>{
    if(!name.trim())return;setSaving(true);
    let lat=null,lng=null;
    if(address.trim()){setGeocoding(true);const coords=await geocodeAddress(address);if(coords){lat=coords.lat;lng=coords.lng;}setGeocoding(false);}
    const place={id:"u"+Date.now(),name:name.trim(),nameEN:name.trim(),desc:desc.trim(),descEN:desc.trim(),emoji,category,price,time,link,custom:true,season:"sempre",lat,lng};
    const entry=status?{status,date:status==="fui"?visitDate:null,who:status==="fui"?who:null}:null;
    await onAdd(place,entry);
    addToast(name+" "+T.addedToast,"success");setSaving(false);onClose();
  };
  return <div style={{ position:"fixed",inset:0,background:"#000000f0",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center" }} onClick={onClose}><div className="modal" style={{ background:"#ffffff",borderTop:"1px solid #e8e6e0",borderRadius:"20px 20px 0 0",padding:"20px 16px 48px",maxWidth:560,width:"100%",maxHeight:"85vh",overflowY:"auto" }} onClick={ev=>ev.stopPropagation()}>
    <div style={{ width:36,height:3,background:"#e8e6e0",borderRadius:2,margin:"0 auto 16px" }}/>
    <div style={{ fontSize:15,fontWeight:700,color:"#1a1a1a",marginBottom:16 }}>{T.addNew}</div>
    <div style={{ display:"flex",gap:10,marginBottom:12 }}><input value={emoji} onChange={ev=>setEmoji(ev.target.value)} maxLength={2} style={{ width:50,background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"8px",color:"#1a1a1a",fontSize:22,textAlign:"center" }}/><input value={name} onChange={ev=>setName(ev.target.value)} placeholder={isEN?"Place name...":"Nome do lugar..."} style={{ flex:1,background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"8px 12px",color:"#1a1a1a",fontSize:14 }}/></div>
    <div style={{ display:"flex",gap:8,marginBottom:12 }}><select value={category} onChange={ev=>setCategory(ev.target.value)} style={{ flex:1,background:"#ffffff",border:"1px solid #e8e6e0",borderRadius:8,padding:"8px 10px",color:"#1a1a1a",fontSize:13 }}>{CATEGORIES.map(c=><option key={c} value={c}>{catLabel(c)}</option>)}</select><div style={{ display:"flex",gap:4 }}>{PRICE_LEVELS.map(p=><button key={p} onClick={()=>setPrice(p)} style={{ padding:"8px",borderRadius:8,background:price===p?"#ff2d5515":"#f8f7f4",border:"1px solid "+(price===p?"#ff2d55":"#e8e6e0"),color:price===p?"#ff2d55":"#a0a0b0",fontSize:12,cursor:"pointer" }}>{PRICE_EMOJI[p]}</button>)}</div></div>
    <div style={{ display:"flex",gap:5,flexWrap:"wrap",marginBottom:12 }}>{TIME_OPTIONS.map(t=><button key={t} onClick={()=>setTime(t)} style={{ padding:"5px 10px",borderRadius:20,background:time===t?"#ff2d5515":"#f8f7f4",border:"1px solid "+(time===t?"#ff2d55":"#e8e6e0"),color:time===t?"#ff2d55":"#a0a0b0",fontSize:11,cursor:"pointer" }}>{t}</button>)}</div>
    <textarea value={desc} onChange={ev=>setDesc(ev.target.value)} placeholder={T.descLabel} rows={2} style={{ width:"100%",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"8px 12px",color:"#1a1a1a",fontSize:13,resize:"none",marginBottom:10 }}/>
    <input value={address} onChange={ev=>setAddress(ev.target.value)} placeholder={T.addressOptional} style={{ width:"100%",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"8px 12px",color:"#1a1a1a",fontSize:13,marginBottom:10 }}/>
    <input value={link} onChange={ev=>setLink(ev.target.value)} placeholder={T.linkOptional} style={{ width:"100%",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"8px 12px",color:"#1a1a1a",fontSize:13,marginBottom:14 }}/>

    {/* Status */}
    <div style={{ marginBottom:14 }}>
      <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:8 }}>{isEN?"HAVE YOU BEEN?":"JA FORAM?"}</div>
      <div style={{ display:"flex",gap:6 }}>
        {[{v:null,label:isEN?"Not yet":"Ainda nao",color:"#a0a0b0"},{v:"quero",label:isEN?"Want to go":"Quero ir",color:"#ff2d55"},{v:"fui",label:isEN?"Been there!":"Ja fui!",color:"#30d158"}].map(({v,label,color})=>(
          <button key={String(v)} onClick={()=>setStatus(v)} style={{ flex:1,padding:"9px 4px",borderRadius:10,background:status===v?color+"20":"#f8f7f4",border:"1px solid "+(status===v?color:"#e8e6e0"),color:status===v?color:"#a0a0b0",fontSize:12,cursor:"pointer",fontWeight:status===v?700:400 }}>{label}</button>
        ))}
      </div>
    </div>

    {/* Date + who — only when "fui" */}
    {status==="fui"&&<div style={{ background:"#f8f7f480",border:"1px solid #e8e6e0",borderRadius:10,padding:"12px",marginBottom:14 }}>
      <div style={{ display:"flex",gap:10,marginBottom:10 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:6 }}>{isEN?"DATE":"DATA"}</div>
          <input type="date" value={visitDate} onChange={ev=>setVisitDate(ev.target.value)} style={{ width:"100%",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"8px 10px",color:"#1a1a1a",fontSize:13 }}/>
        </div>
      </div>
      <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:6 }}>{isEN?"WHO WENT?":"QUEM FOI?"}</div>
      <div style={{ display:"flex",gap:6 }}>{WHO_OPTIONS.map(w=><button key={w} onClick={()=>setWho(w)} style={{ flex:1,padding:"8px 4px",borderRadius:8,background:who===w?"#007aff20":"#f8f7f4",border:"1px solid "+(who===w?"#007aff":"#e8e6e0"),color:who===w?"#007aff":"#8a8a9a",fontSize:12,cursor:"pointer" }}>{WHO_EMOJI[w]} {WHO_LABELS[w]}</button>)}</div>
    </div>}

    <button onClick={handle} disabled={saving||geocoding} style={{ width:"100%",padding:"13px",background:saving||geocoding?"#e8e6e0":"#ff2d55",border:"none",borderRadius:10,color:saving||geocoding?"#a0a0b0":"#fff",fontSize:14,fontWeight:700,cursor:saving||geocoding?"default":"pointer" }}>{geocoding?isEN?"Getting location...":"Buscando localizacao...":saving?T.adding:T.add}</button>
  </div></div>;
}

function ShareModal({ places, entries, onClose, addToast }) {
  const recs=places.filter(p=>{const e=entries[p.id]||{};return e.thumb==="up"||(e.stars&&e.stars>=4);});
  const url=window.location.href;
  const copy=t=>{navigator.clipboard.writeText(t);addToast(T.copiedToast,"success");};
  return <div style={{ position:"fixed",inset:0,background:"#000000f0",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center" }} onClick={onClose}><div className="modal" style={{ background:"#ffffff",borderTop:"1px solid #e8e6e0",borderRadius:"20px 20px 0 0",padding:"20px 16px 40px",maxWidth:560,width:"100%",maxHeight:"80vh",overflowY:"auto" }} onClick={ev=>ev.stopPropagation()}>
    <div style={{ width:36,height:3,background:"#e8e6e0",borderRadius:2,margin:"0 auto 16px" }}/>
    <div style={{ fontSize:15,fontWeight:700,color:"#1a1a1a",marginBottom:6 }}>{T.shareTitle}</div>
    <div style={{ fontSize:12,color:"#8a8a9a",marginBottom:14 }}>{recs.length} {T.shareWith}</div>
    {!recs.length?<div style={{ color:"#a0a0b0",fontSize:13,textAlign:"center",padding:"20px 0" }}>{T.rateFirst}</div>:<>
      <div style={{ background:"#f8f7f4",borderRadius:10,padding:"12px",marginBottom:14,maxHeight:160,overflowY:"auto" }}>{recs.map(p=>{const e=entries[p.id]||{};return<div key={p.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"6px 0",borderBottom:"1px solid #e8e6e0" }}><span style={{ fontSize:16 }}>{p.emoji}</span><div style={{ flex:1 }}><div style={{ fontSize:13,color:"#1a1a1a" }}>{isEN&&p.nameEN?p.nameEN:p.name}</div><div style={{ fontSize:11,color:"#a0a0b0" }}>{e.stars>0&&"★".repeat(e.stars)} {e.thumb==="up"?"👍":""}</div></div></div>;})}</div>
      <button onClick={()=>copy(T.favoritesList+"\n\n"+recs.map(p=>{const e=entries[p.id]||{};return p.emoji+" "+(isEN&&p.nameEN?p.nameEN:p.name)+(e.stars?" "+"★".repeat(e.stars):"");}).join("\n")+"\n\n"+url)} style={{ width:"100%",padding:"13px",background:"#ff2d55",border:"none",borderRadius:10,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",marginBottom:8 }}>{T.copyWhatsApp}</button>
      <button onClick={()=>copy(url)} style={{ width:"100%",padding:"13px",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:10,color:"#1a1a1a",fontSize:13,cursor:"pointer" }}>{T.copyLink}</button>
          <div style={{ height:1,background:"#e8e6e0",margin:"14px 0" }}/>
          <a href={"mailto:guibrandao.pagamentos@gmail.com?subject="+encodeURIComponent("Feedback - NYC Bucket List")+"&body="+encodeURIComponent(isEN?"Describe your bug or suggestion:\n\n":"Descreva seu bug ou sugestao:\n\n")} style={{ width:"100%",padding:"11px",background:"none",border:"1px solid #e8e6e0",borderRadius:10,color:"#a0a0b0",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,textDecoration:"none",boxSizing:"border-box" }}>🐛 {isEN?"Report bug / suggestion":"Reportar bug ou sugestao"}</a>
    </>}
  </div></div>;
}





function SurpresaModal({ places, entries, weather, onClose, addToast, onSaveLists, lists }) {
  const [step, setStep] = useState("form");
  const [result, setResult] = useState("");
  const [linkedPlaces, setLinkedPlaces] = useState([]);
  const [previewPlace, setPreviewPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startLoc, setStartLoc] = useState("Jersey City, NJ");
  const [locLoading, setLocLoading] = useState(false);
  const [params, setParams] = useState({
    horas: null, horaSaida: null, humor: null,
    ambiente: null, budget: null, quem: null,
    ocasiao: null, raio: null, refeicao: null,
    exclusoes: []
  });

  const setP = (key, val) => setParams(prev => ({...prev, [key]: val}));
  const toggleExclusao = cat => setParams(prev => ({...prev, exclusoes: prev.exclusoes.includes(cat)?prev.exclusoes.filter(x=>x!==cat):[...prev.exclusoes,cat]}));

  const detectLoc = () => {
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(async pos=>{
      try{
        const r=await fetch("https://nominatim.openstreetmap.org/reverse?lat="+pos.coords.latitude+"&lon="+pos.coords.longitude+"&format=json");
        const d=await r.json();
        setStartLoc((d.address.neighbourhood||d.address.suburb||d.address.city||"minha loc")+", "+(d.address.state||"NY"));
      }catch{setStartLoc(pos.coords.latitude.toFixed(4)+","+pos.coords.longitude.toFixed(4));}
      setLocLoading(false);
    },()=>setLocLoading(false));
  };

  const parseLinked = (text) => {
    const match = text.match(/\[lugares:\s*([^\]]+)\]/i);
    if(!match) return [];
    return match[1].split(",").map(n=>n.trim()).map(name=>places.find(p=>(isEN&&p.nameEN?p.nameEN:p.name).toLowerCase()===name.toLowerCase())||null).filter(Boolean);
  };

  const generate = async () => {
    if(!params.horas||!params.ambiente||!params.budget) return;
    setStep("loading"); setLoading(true);
    const available = places.filter(p=>{
      const e=entries[p.id]||{};
      if(e.status==="fui") return false;
      if(params.exclusoes.includes(p.category)) return false;
      if(params.quem==="cachorro"&&!p.petFriendly&&p.category!=="Daytrips") return false;
      if(params.raio==="manhattan"&&p.lat&&(p.lat<40.70||p.lat>40.88)) return false;
      if(params.raio==="nodaytrip"&&p.category==="Daytrips") return false;
      return true;
    });
    const catalog = available.map(p=>(isEN&&p.nameEN?p.nameEN:p.name)+" | "+catLabel(p.category)+" | "+p.price+" | "+(p.time||"?")).join("\n");
    const weatherInfo = weather ? weather.desc+" "+weather.tempC+"C, "+(weather.outdoor?"bom para outdoor":"melhor ficar indoor") : "";
    const prompt = "Monte um roteiro surpresa perfeito para Gui e Gabriel com base nos parametros abaixo.\n"+
      "REGRAS:\n"+
      "1. Use SOMENTE lugares da LISTA. Nunca invente lugares.\n"+
      "2. Use o NOME EXATO da lista.\n"+
      "3. Prefira metro + caminhada a pe entre os lugares.\n"+
      "4. No final: [lugares: Nome1, Nome2, Nome3]\n\n"+
      "PARAMETROS:\n"+
      "- Saindo de: "+startLoc+"\n"+
      "- Hora de saida: "+(params.horaSaida||"agora")+"\n"+
      "- Tempo disponivel: "+params.horas+"\n"+
      "- Humor: "+(params.humor||"normal")+"\n"+
      "- Ambiente: "+params.ambiente+"\n"+
      "- Budget: "+params.budget+"\n"+
      "- Quem vai: "+(params.quem||"Gui e Gabriel")+"\n"+
      "- Ocasiao: "+(params.ocasiao||"dia normal")+"\n"+
      "- Raio: "+(params.raio||"qualquer bairro")+"\n"+
      "- Incluir refeicao: "+(params.refeicao||"sim")+"\n"+
      (weatherInfo?"- Clima agora: "+weatherInfo+"\n":"")+
      "\nLISTA DISPONIVEL:\n"+catalog+"\n\n"+
      "Monte um roteiro detalhado com: lugares na ordem geografica ideal, horarios, como ir de um para outro (metro especifico + caminhada), onde comer, estimativa de gasto total e uma frase de clima do dia.\n"+
      "Responda em "+(isEN?"English":"portugues brasileiro")+".";
    try{
      const r=await fetch(AI_PROXY,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"user",content:prompt}]})});
      const d=await r.json();
      const text=d.content?.[0]?.text||"Erro.";
      const linked=parseLinked(text);
      const display=text.replace(/\[lugares:[^\]]+\]/gi,"").trim();
      setResult(display); setLinkedPlaces(linked);
    }catch{setResult(isEN?"Connection error.":"Erro ao conectar.");}
    setLoading(false); setStep("result");
  };

  const saveAsCuradoria = () => {
    if(!linkedPlaces.length) return;
    const nova = {id:"l"+Date.now(),name:isEN?"Surprise Day":"Dia Surpresa",emoji:"🎲",desc:new Date().toLocaleDateString(isEN?"en-US":"pt-BR"),placeIds:linkedPlaces.map(p=>p.id)};
    onSaveLists([...lists,nova]);
    addToast(isEN?"Saved as curadoria!":"Salvo como curadoria!","success");
  };

  const CHIP = (label, active, onClick, color="#ff2d55") => (
    <button onClick={onClick} style={{ padding:"7px 14px",borderRadius:20,background:active?color+"20":"#f8f7f4",border:"1px solid "+(active?color+"60":"#e8e6e0"),color:active?color:"#8a8a9a",fontSize:12,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s" }}>{label}</button>
  );

  if(step==="loading") return (
    <div style={{ position:"fixed",inset:0,background:"#000000f0",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ textAlign:"center" }}>
        <div className="pulsing" style={{ fontSize:52,marginBottom:16 }}>🎲</div>
        <div style={{ fontSize:15,color:"#1a1a1a",fontWeight:600,marginBottom:6 }}>{isEN?"Building your surprise day...":"Montando seu dia surpresa..."}</div>
        <div style={{ fontSize:12,color:"#8a8a9a" }}>{isEN?"Claude is thinking...":"Claude esta pensando..."}</div>
      </div>
    </div>
  );

  if(step==="result") return (
    <>
      {previewPlace&&(
        <div style={{ position:"fixed",inset:0,background:"#000000c0",zIndex:500,display:"flex",alignItems:"flex-end",justifyContent:"center" }} onClick={()=>setPreviewPlace(null)}>
          <div className="modal" style={{ background:"#ffffff",borderTop:"1px solid #e8e6e0",borderRadius:"20px 20px 0 0",padding:"20px 16px 40px",maxWidth:560,width:"100%",maxHeight:"70vh",overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
            <div style={{ width:36,height:3,background:"#e8e6e0",borderRadius:2,margin:"0 auto 16px" }}/>
            <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:12 }}>
              <span style={{ fontSize:32 }}>{previewPlace.emoji}</span>
              <div><div style={{ fontSize:17,fontWeight:700,color:"#1a1a1a" }}>{isEN&&previewPlace.nameEN?previewPlace.nameEN:previewPlace.name}</div>
              <div style={{ fontSize:12,color:"#8a8a9a",marginTop:2 }}>{catLabel(previewPlace.category)} · {PRICE_EMOJI[previewPlace.price]||"?"} · {previewPlace.time}</div></div>
            </div>
            <div style={{ fontSize:13,color:"#8a8a9a",lineHeight:1.6,padding:"10px 12px",background:"#f8f7f4",borderRadius:10,marginBottom:12,borderLeft:"2px solid "+(CAT_META[previewPlace.category]||{color:"#ff2d55"}).color }}>{isEN&&previewPlace.descEN?previewPlace.descEN:previewPlace.desc}</div>
            {(isEN&&previewPlace.repEN?previewPlace.repEN:previewPlace.rep)&&<div style={{ fontSize:12,color:"#ff9f0a",padding:"8px 12px",background:"#ff9f0a10",borderRadius:10,borderLeft:"2px solid #ff9f0a",marginBottom:12 }}>⭐ {isEN&&previewPlace.repEN?previewPlace.repEN:previewPlace.rep}</div>}
            <button onClick={()=>setPreviewPlace(null)} style={{ width:"100%",padding:"11px",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:10,color:"#8a8a9a",fontSize:13,cursor:"pointer" }}>{isEN?"Close":"Fechar"}</button>
          </div>
        </div>
      )}
      <div style={{ position:"fixed",inset:0,background:"#000000f0",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center" }} onClick={onClose}>
        <div className="modal" style={{ background:"#ffffff",borderTop:"1px solid #e8e6e0",borderRadius:"20px 20px 0 0",padding:"20px 16px 40px",maxWidth:560,width:"100%",height:"88vh",display:"flex",flexDirection:"column" }} onClick={e=>e.stopPropagation()}>
          <div style={{ width:36,height:3,background:"#e8e6e0",borderRadius:2,margin:"0 auto 14px" }}/>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
            <div style={{ fontSize:16,fontWeight:700,color:"#1a1a1a" }}>🎲 {isEN?"Your surprise day!":"Seu dia surpresa!"}</div>
            <button onClick={onClose} style={{ background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,width:32,height:32,color:"#8a8a9a",cursor:"pointer",fontSize:16 }}>×</button>
          </div>
          {linkedPlaces.length>0&&(
            <div style={{ marginBottom:10 }}>
              <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:6 }}>{isEN?"PLACES IN THIS ROUTE":"LUGARES NESTE ROTEIRO"}</div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>
                {linkedPlaces.map(p=>{const meta=CAT_META[p.category]||{color:"#ff2d55"};return<button key={p.id} onClick={()=>setPreviewPlace(p)} style={{ display:"flex",alignItems:"center",gap:5,padding:"5px 10px",background:meta.color+"18",border:"1px solid "+meta.color+"40",borderRadius:20,color:meta.color,fontSize:11,cursor:"pointer",fontFamily:"inherit" }}>{p.emoji} {isEN&&p.nameEN?p.nameEN:p.name} ↗</button>;})}
              </div>
            </div>
          )}
          <div style={{ flex:1,overflowY:"auto",background:"#f8f7f4",borderRadius:12,padding:"14px",fontSize:13,color:"#1a1a1a",lineHeight:1.7,whiteSpace:"pre-wrap",marginBottom:12 }}>{result}</div>
          <div style={{ display:"flex",gap:8 }}>
            <button onClick={()=>{navigator.clipboard.writeText(result);addToast(isEN?"Copied!":"Copiado!","success");}} style={{ flex:1,padding:"11px",background:"#ff2d55",border:"none",borderRadius:10,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer" }}>{isEN?"Copy":"Copiar"}</button>
            {linkedPlaces.length>0&&<button onClick={saveAsCuradoria} style={{ flex:1,padding:"11px",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:10,color:"#8a8a9a",fontSize:13,cursor:"pointer" }}>💾 {isEN?"Save curadoria":"Salvar curadoria"}</button>}
            <button onClick={()=>{setStep("form");setResult("");setLinkedPlaces([]);}} style={{ padding:"11px 14px",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:10,color:"#8a8a9a",fontSize:13,cursor:"pointer" }}>🎲</button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div style={{ position:"fixed",inset:0,background:"#000000f0",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center" }} onClick={onClose}>
      <div className="modal" style={{ background:"#ffffff",borderTop:"1px solid #e8e6e0",borderRadius:"20px 20px 0 0",padding:"20px 16px 40px",maxWidth:560,width:"100%",maxHeight:"92vh",overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
        <div style={{ width:36,height:3,background:"#e8e6e0",borderRadius:2,margin:"0 auto 14px" }}/>
        <div style={{ fontSize:16,fontWeight:700,color:"#1a1a1a",marginBottom:4 }}>🎲 {isEN?"Surprise me!":"Me surpreenda!"}</div>
        <div style={{ fontSize:12,color:"#8a8a9a",marginBottom:16 }}>{isEN?"Answer a few questions and Claude builds your perfect day.":"Responda algumas perguntas e o Claude monta seu dia perfeito."}</div>

        <div style={{ marginBottom:16 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
            <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em" }}>{isEN?"DEPARTURE":"SAINDO DE"}</div>
            <button onClick={detectLoc} style={{ fontSize:11,color:"#ff2d55",background:"none",border:"none",cursor:"pointer" }}>{locLoading?"...":"📍 GPS"}</button>
          </div>
          <input value={startLoc} onChange={e=>setStartLoc(e.target.value)} style={{ width:"100%",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:10,padding:"9px 12px",color:"#1a1a1a",fontSize:13 }}/>
        </div>

        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:8 }}>{isEN?"WHAT TIME ARE YOU LEAVING?":"QUE HORAS VAO SAIR?"}</div>
          <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
            {[["agora",isEN?"Now":"Agora"],["manha",isEN?"Morning":"Manha"],["tarde",isEN?"Afternoon":"Tarde"],["noite",isEN?"Evening":"Noite"]].map(([v,l])=>CHIP(l,params.horaSaida===v,()=>setP("horaSaida",v)))}
          </div>
        </div>

        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:8 }}>{isEN?"HOW MUCH TIME DO YOU HAVE?":"QUANTO TEMPO VOCES TEM?"} *</div>
          <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
            {[["2h","2h"],["4h","4h"],["manha inteira",isEN?"Half day":"Meio dia"],["dia inteiro",isEN?"Full day":"Dia inteiro"]].map(([v,l])=>CHIP(l,params.horas===v,()=>setP("horas",v)))}
          </div>
        </div>

        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:8 }}>{isEN?"HOW ARE YOU FEELING?":"QUAL O HUMOR DE HOJE?"}</div>
          <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
            {[["animados","⚡ "+(isEN?"Energetic":"Animados")],["tranquilos","😌 "+(isEN?"Chill":"Tranquilos")],["cansados","😴 "+(isEN?"Tired":"Cansados")],["romantico","💑 "+(isEN?"Romantic":"Romantico")]].map(([v,l])=>CHIP(l,params.humor===v,()=>setP("humor",v)))}
          </div>
        </div>

        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:8 }}>{isEN?"INDOOR OR OUTDOOR?":"INDOOR OU OUTDOOR?"} *</div>
          <div style={{ display:"flex",gap:6 }}>
            {[["indoor",isEN?"Indoor":"Indoor"],["outdoor",isEN?"Outdoor":"Outdoor"],["tanto faz",isEN?"Either":"Tanto faz"]].map(([v,l])=>CHIP(l,params.ambiente===v,()=>setP("ambiente",v),"#007aff"))}
          </div>
        </div>

        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:8 }}>{isEN?"BUDGET FOR THE DAY?":"BUDGET DO DIA?"} *</div>
          <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
            {[["gratis",isEN?"Free only":"So gratis"],["barato","< $30"],["moderado","< $80"],["sem limite",isEN?"No limit":"Sem limite"]].map(([v,l])=>CHIP(l,params.budget===v,()=>setP("budget",v),"#ff9f0a"))}
          </div>
        </div>

        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:8 }}>{isEN?"WHO IS GOING?":"QUEM VAI?"}</div>
          <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
            {[["so eu","🧘 "+(isEN?"Just me":"So eu")],["nos dois","👫 "+(isEN?"Both of us":"Nos dois")],["amigos","👯 "+(isEN?"With friends":"Com amigos")],["cachorro","🐾 "+(isEN?"With dog":"Com o dog")]].map(([v,l])=>CHIP(l,params.quem===v,()=>setP("quem",v)))}
          </div>
        </div>

        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:8 }}>{isEN?"SPECIAL OCCASION?":"E UMA OCASIAO ESPECIAL?"}</div>
          <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
            {[["dia normal",isEN?"Normal day":"Dia normal"],["date night","💑 Date night"],["aniversario","🎂 "+(isEN?"Anniversary":"Aniversario")],["amigos visitando","✈️ "+(isEN?"Friends visiting":"Amigos visitando")]].map(([v,l])=>CHIP(l,params.ocasiao===v,()=>setP("ocasiao",v)))}
          </div>
        </div>

        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:8 }}>{isEN?"HOW FAR ARE YOU WILLING TO GO?":"ATE ONDE TOPAM IR?"}</div>
          <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
            {[["manhattan",isEN?"Manhattan only":"So Manhattan"],["nodaytrip",isEN?"Any neighborhood":"Qualquer bairro"],["topam tudo",isEN?"Including daytrips":"Topam daytrip"]].map(([v,l])=>CHIP(l,params.raio===v,()=>setP("raio",v)))}
          </div>
        </div>

        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:8 }}>{isEN?"INCLUDE MEAL IN THE ROUTE?":"INCLUIR REFEICAO NO ROTEIRO?"}</div>
          <div style={{ display:"flex",gap:6 }}>
            {[["sim",isEN?"Yes please":"Sim, com fome"],["nao",isEN?"Already eaten":"Ja comemos"]].map(([v,l])=>CHIP(l,params.refeicao===v,()=>setP("refeicao",v)))}
          </div>
        </div>

        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:8 }}>{isEN?"EXCLUDE CATEGORIES?":"EXCLUIR CATEGORIAS?"}</div>
          <div style={{ display:"flex",gap:5,flexWrap:"wrap" }}>
            {CATEGORIES.map(cat=>{const meta=CAT_META[cat]||{color:"#ff2d55"};const excluded=params.exclusoes.includes(cat);return<button key={cat} onClick={()=>toggleExclusao(cat)} style={{ padding:"5px 10px",borderRadius:20,background:excluded?"#ff2d5515":"#f8f7f4",border:"1px solid "+(excluded?"#ff2d5560":"#e8e6e0"),color:excluded?"#ff2d55":"#8a8a9a",fontSize:11,cursor:"pointer",fontFamily:"inherit",textDecoration:excluded?"line-through":"none" }}>{catLabel(cat)}</button>;})}
          </div>
        </div>

        <button onClick={generate} disabled={!params.horas||!params.ambiente||!params.budget} style={{ width:"100%",padding:"14px",background:params.horas&&params.ambiente&&params.budget?"#ff2d55":"#e8e6e0",border:"none",borderRadius:12,color:params.horas&&params.ambiente&&params.budget?"#fff":"#a0a0b0",fontSize:14,fontWeight:700,cursor:params.horas&&params.ambiente&&params.budget?"pointer":"default",transition:"all 0.2s" }}>
          {isEN?"Surprise me! 🎲":"Me surpreenda! 🎲"}
        </button>
        <div style={{ fontSize:11,color:"#a0a0b0",textAlign:"center",marginTop:8 }}>* {isEN?"Required fields":"Campos obrigatorios"}</div>
      </div>
    </div>
  );
}



// ─── EVENTS ───────────────────────────────────────────────────────────────────
const EVENT_CATS = ["show","exposicao","festival","esporte","teatro","outro"];
const EVENT_CAT_EMOJI = { show:"🎸", exposicao:"🎨", festival:"🎪", esporte:"🏆", teatro:"🎭", outro:"📅" };
const EVENT_CAT_LABEL_PT = { show:"Show", exposicao:"Exposicao", festival:"Festival", esporte:"Esporte", teatro:"Teatro", outro:"Outro" };
const EVENT_CAT_LABEL_EN = { show:"Concert", exposicao:"Exhibition", festival:"Festival", esporte:"Sports", teatro:"Theater", outro:"Other" };
const evCatLabel = cat => isEN ? (EVENT_CAT_LABEL_EN[cat]||cat) : (EVENT_CAT_LABEL_PT[cat]||cat);

function daysUntil(dateStr) {
  const today = new Date(); today.setHours(0,0,0,0);
  const evt = new Date(dateStr+"T12:00:00");
  return Math.round((evt-today)/(1000*60*60*24));
}

function EventCard({ ev, onSave, onDelete, addToast }) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const days = daysUntil(ev.date);
  const isPast = days < 0;
  const isToday = days === 0;
  const isSoon = days > 0 && days <= 3;
  const color = isPast?"#a0a0b0":isToday?"#30d158":isSoon?"#ff9f0a":"#007aff";
  const catEmoji = EVENT_CAT_EMOJI[ev.category]||"📅";

  const gcUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(ev.name)+(ev.location?"&location="+encodeURIComponent(ev.location):"")+(ev.desc?"&details="+encodeURIComponent(ev.desc):"")+"&dates="+ev.date.replace(/-/g,"")+"/"+(ev.date.replace(/-/g,""));

  const cityUrl = ev.location ? "https://citymapper.com/directions?endname="+encodeURIComponent(ev.location)+"&endaddress="+encodeURIComponent(ev.location+", New York, NY") : null;

  return (
    <div style={{ background:"#ffffff", border:"1px solid "+(isToday?"#30d15840":isSoon?"#ff9f0a40":"#e8e6e0"), borderRadius:14, marginBottom:10, overflow:"hidden", opacity:isPast?0.6:1 }}>
      {(isToday||isSoon)&&<div style={{ height:2, background:isToday?"#30d158":"#ff9f0a" }}/>}
      <div onClick={()=>setExpanded(!expanded)} style={{ padding:"12px 14px", cursor:"pointer", display:"flex", gap:12, alignItems:"center" }}>
        <div style={{ width:48, height:48, borderRadius:12, background:color+"20", border:"1px solid "+color+"40", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{ev.emoji||catEmoji}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:14, fontWeight:600, color:"#1a1a1a", lineHeight:1.3 }}>{ev.name}</div>
          <div style={{ fontSize:11, color:"#8a8a9a", marginTop:3 }}>
            {new Date(ev.date+"T12:00:00").toLocaleDateString(isEN?"en-US":"pt-BR",{weekday:"short",month:"short",day:"numeric"})}
            {ev.time&&" · "+ev.time}
            {ev.location&&" · 📍 "+ev.location}
          </div>
          <div style={{ fontSize:11, color:ev.price==="gratis"?"#30d158":"#8a8a9a", marginTop:2 }}>{ev.price==="gratis"?"🆓 Gratis":ev.price?"💰 "+ev.price:""}</div>
        </div>
        <div style={{ textAlign:"center", flexShrink:0 }}>
          {isPast ? <div style={{ fontSize:11, color:"#a0a0b0" }}>{isEN?"Past":"Passou"}</div>
          : isToday ? <div style={{ fontSize:12, fontWeight:700, color:"#30d158" }}>{isEN?"TODAY":"HOJE!"}</div>
          : <><div style={{ fontSize:20, fontWeight:800, color }}>{days}</div><div style={{ fontSize:9, color:"#a0a0b0" }}>{isEN?"days":"dias"}</div></>}
        </div>
      </div>
      {expanded&&(
        <div style={{ padding:"0 14px 14px", borderTop:"1px solid #e8e6e0" }}>
          {ev.desc&&<div style={{ fontSize:13, color:"#8a8a9a", lineHeight:1.6, marginTop:10, marginBottom:10 }}>{ev.desc}</div>}
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
            <a href={gcUrl} target="_blank" rel="noreferrer" style={{ padding:"6px 12px", background:"#f8f7f4", border:"1px solid #e8e6e0", borderRadius:8, color:"#8a8a9a", fontSize:11, textDecoration:"none" }}>📅 {isEN?"Add to Calendar":"Adicionar ao Google Calendar"}</a>
            {cityUrl&&<a href={cityUrl} target="_blank" rel="noreferrer" style={{ padding:"6px 12px", background:"#f8f7f4", border:"1px solid #e8e6e0", borderRadius:8, color:"#8a8a9a", fontSize:11, textDecoration:"none" }}>🗺 {isEN?"Get directions":"Como chegar"}</a>}
            {ev.ticketLink&&<a href={ev.ticketLink} target="_blank" rel="noreferrer" style={{ padding:"6px 12px", background:"#ff2d5515", border:"1px solid #ff2d5540", borderRadius:8, color:"#ff2d55", fontSize:11, textDecoration:"none" }}>🎟 {isEN?"Buy ticket":"Comprar ingresso"}</a>}
          </div>
          {!isPast&&<div style={{ display:"flex", gap:8 }}>
            {!confirmDel
              ? <button onClick={()=>setConfirmDel(true)} style={{ padding:"7px 12px", background:"none", border:"1px solid #e8e6e0", borderRadius:8, color:"#a0a0b0", fontSize:11, cursor:"pointer" }}>{isEN?"Remove":"Remover"}</button>
              : <>
                  <button onClick={()=>setConfirmDel(false)} style={{ flex:1, padding:"7px", background:"none", border:"1px solid #e8e6e0", borderRadius:8, color:"#8a8a9a", fontSize:11, cursor:"pointer" }}>{isEN?"Cancel":"Cancelar"}</button>
                  <button onClick={()=>onDelete(ev.id)} style={{ flex:1, padding:"7px", background:"#4a0000", border:"1px solid #883333", borderRadius:8, color:"#ff8888", fontSize:11, cursor:"pointer" }}>{isEN?"Confirm":"Confirmar"}</button>
                </>}
          </div>}
        </div>
      )}
    </div>
  );
}

function AddEventModal({ onClose, onSave, addToast }) {
  const [name,setName]=useState("");
  const [emoji,setEmoji]=useState("📅");
  const [category,setCategory]=useState("show");
  const [date,setDate]=useState("");
  const [time,setTime]=useState("");
  const [location,setLocation]=useState("");
  const [price,setPrice]=useState("");
  const [desc,setDesc]=useState("");
  const [ticketLink,setTicketLink]=useState("");
  const [saving,setSaving]=useState(false);

  const handle = async () => {
    if(!name.trim()||!date) return;
    setSaving(true);
    const ev = { id:"ev"+Date.now(), name:name.trim(), emoji, category, date, time, location:location.trim(), price:price.trim(), desc:desc.trim(), ticketLink:ticketLink.trim(), archived:false, createdAt:new Date().toISOString() };
    await onSave(ev);
    setSaving(false);
  };

  return (
    <div style={{ position:"fixed",inset:0,background:"#000000f0",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center" }} onClick={onClose}>
      <div className="modal" style={{ background:"#ffffff",borderTop:"1px solid #e8e6e0",borderRadius:"20px 20px 0 0",padding:"20px 16px 48px",maxWidth:560,width:"100%",maxHeight:"90vh",overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
        <div style={{ width:36,height:3,background:"#e8e6e0",borderRadius:2,margin:"0 auto 16px" }}/>
        <div style={{ fontSize:15,fontWeight:700,color:"#1a1a1a",marginBottom:14 }}>{isEN?"New Event":"Novo Evento"}</div>
        <div style={{ display:"flex",gap:10,marginBottom:12 }}>
          <input value={emoji} onChange={e=>setEmoji(e.target.value)} maxLength={2} style={{ width:50,background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"8px",color:"#1a1a1a",fontSize:22,textAlign:"center" }}/>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder={isEN?"Event name...":"Nome do evento..."} style={{ flex:1,background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"8px 12px",color:"#1a1a1a",fontSize:14 }}/>
        </div>
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:6 }}>{isEN?"CATEGORY":"CATEGORIA"}</div>
          <div style={{ display:"flex",gap:5,flexWrap:"wrap" }}>
            {EVENT_CATS.map(cat=><button key={cat} onClick={()=>setCategory(cat)} style={{ padding:"6px 12px",borderRadius:20,background:category===cat?"#ff2d5515":"#f8f7f4",border:"1px solid "+(category===cat?"#ff2d55":"#e8e6e0"),color:category===cat?"#ff2d55":"#8a8a9a",fontSize:12,cursor:"pointer",fontFamily:"inherit" }}>{EVENT_CAT_EMOJI[cat]} {evCatLabel(cat)}</button>)}
          </div>
        </div>
        <div style={{ display:"flex",gap:8,marginBottom:12 }}>
          <div style={{ flex:2 }}>
            <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:6 }}>{isEN?"DATE *":"DATA *"}</div>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ width:"100%",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"8px 12px",color:"#1a1a1a",fontSize:14 }}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:6 }}>{isEN?"TIME":"HORA"}</div>
            <input type="time" value={time} onChange={e=>setTime(e.target.value)} style={{ width:"100%",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"8px 12px",color:"#1a1a1a",fontSize:14 }}/>
          </div>
        </div>
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:6 }}>{isEN?"LOCATION":"LOCAL"}</div>
          <input value={location} onChange={e=>setLocation(e.target.value)} placeholder={isEN?"Venue name or address...":"Nome do local ou endereco..."} style={{ width:"100%",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"8px 12px",color:"#1a1a1a",fontSize:13 }}/>
        </div>
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:6 }}>{isEN?"PRICE":"PRECO"}</div>
          <div style={{ display:"flex",gap:6 }}>
            {["gratis","$","$$","$$$"].map(p=><button key={p} onClick={()=>setPrice(price===p?"":p)} style={{ flex:1,padding:"8px 4px",borderRadius:8,background:price===p?"#ff9f0a18":"#f8f7f4",border:"1px solid "+(price===p?"#ff9f0a":"#e8e6e0"),color:price===p?"#ff9f0a":"#8a8a9a",fontSize:12,cursor:"pointer",fontFamily:"inherit" }}>{p==="gratis"?"🆓":p}</button>)}
          </div>
        </div>
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:6 }}>{isEN?"DESCRIPTION":"DESCRICAO"}</div>
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder={isEN?"Notes about this event...":"Notas sobre o evento..."} rows={2} style={{ width:"100%",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"8px 12px",color:"#1a1a1a",fontSize:13,resize:"none" }}/>
        </div>
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:6 }}>🎟 {isEN?"TICKET LINK":"LINK DO INGRESSO"}</div>
          <input value={ticketLink} onChange={e=>setTicketLink(e.target.value)} placeholder="https://..." style={{ width:"100%",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"8px 12px",color:"#1a1a1a",fontSize:13 }}/>
        </div>
        <button onClick={handle} disabled={!name.trim()||!date||saving} style={{ width:"100%",padding:"13px",background:name.trim()&&date&&!saving?"#ff2d55":"#e8e6e0",border:"none",borderRadius:10,color:name.trim()&&date&&!saving?"#fff":"#a0a0b0",fontSize:14,fontWeight:700,cursor:name.trim()&&date&&!saving?"pointer":"default" }}>
          {saving?(isEN?"Saving...":"Salvando..."):(isEN?"Add Event":"Adicionar Evento")}
        </button>
      </div>
    </div>
  );
}

function EventsTab({ events, onAdd, onSave, onDelete, addToast }) {
  const today = new Date().toISOString().split("T")[0];
  const upcoming = events.filter(e=>!e.archived&&e.date>=today).sort((a,b)=>a.date.localeCompare(b.date));
  const archived = events.filter(e=>e.archived||e.date<today).sort((a,b)=>b.date.localeCompare(a.date));
  const [showArchived, setShowArchived] = useState(false);

  return (
    <div style={{ padding:"0 16px 80px" }}>
      <button onClick={onAdd} style={{ width:"100%",padding:"13px",background:"#ff2d5515",border:"1px dashed #ff2d5550",borderRadius:12,color:"#ff2d55",fontSize:14,cursor:"pointer",marginBottom:14,fontFamily:"inherit" }}>
        + {isEN?"Add Event":"Adicionar Evento"}
      </button>
      {!upcoming.length&&!archived.length&&(
        <div style={{ textAlign:"center",padding:"40px 0",color:"#a0a0b0" }}>
          <div style={{ fontSize:40,marginBottom:12 }}>🎟</div>
          <div style={{ fontSize:14 }}>{isEN?"No events yet":"Nenhum evento ainda"}</div>
          <div style={{ fontSize:12,marginTop:6,color:"#3a3a50" }}>{isEN?"Add shows, exhibitions, sports...":"Adicione shows, exposicoes, esportes..."}</div>
        </div>
      )}
      {upcoming.map(ev=><EventCard key={ev.id} ev={ev} onSave={onSave} onDelete={onDelete} addToast={addToast}/>)}
      {archived.length>0&&(
        <>
          <button onClick={()=>setShowArchived(!showArchived)} style={{ width:"100%",padding:"10px",background:"none",border:"1px solid #e8e6e0",borderRadius:10,color:"#a0a0b0",fontSize:12,cursor:"pointer",marginBottom:10,fontFamily:"inherit" }}>
            {showArchived?(isEN?"Hide archived":"Ocultar arquivados"):(isEN?"Show archived ("+archived.length+")":"Ver arquivados ("+archived.length+")")}
          </button>
          {showArchived&&archived.map(ev=><EventCard key={ev.id} ev={ev} onSave={onSave} onDelete={onDelete} addToast={addToast}/>)}
        </>
      )}
    </div>
  );
}


// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
function BottomNav({ tab, setTab }) {
  const NavItem = ({ id, icon, label }) => (
    <button className={"nav-item"+(tab===id?" active":"")} onClick={()=>setTab(id)}>
      {icon}
      <span style={{ fontSize:9,fontWeight:tab===id?700:500,letterSpacing:"0.02em" }}>{label}</span>
    </button>
  );

  const ExplorarIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
  const PlanejIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
  const MapIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>;
  const MemoriasIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;

  return (
    <nav className="bottom-nav">
      <NavItem id="explorar" icon={<ExplorarIcon/>} label={isEN?"Explore":"Explorar"}/>
      <NavItem id="planejar" icon={<PlanejIcon/>} label={isEN?"Plan":"Planejar"}/>
      <NavItem id="mapa" icon={<MapIcon/>} label={isEN?"Map":"Mapa"}/>
      <NavItem id="memorias" icon={<MemoriasIcon/>} label={isEN?"Memories":"Memorias"}/>
    </nav>
  );
}

function StatsTab({ places, entries }) {
  const visited = places.filter(p=>(entries[p.id]||{}).status==="fui");
  const total = places.length;
  const pct = total>0?Math.round((visited.length/total)*100):0;

  // Total spent
  const totalSpent = visited.reduce((sum,p)=>{
    const e=entries[p.id]||{};
    return sum+(e.spent||0);
  },0);

  // By category
  const byCategory = {};
  CATEGORIES.forEach(cat=>{
    const catPlaces = places.filter(p=>p.category===cat);
    const catVisited = catPlaces.filter(p=>(entries[p.id]||{}).status==="fui");
    const catSpent = catVisited.reduce((s,p)=>s+((entries[p.id]||{}).spent||0),0);
    byCategory[cat] = { total:catPlaces.length, visited:catVisited.length, spent:catSpent };
  });

  // By month
  const byMonth = {};
  visited.forEach(p=>{
    const e=entries[p.id]||{};
    if(e.date){
      const m=e.date.slice(0,7);
      byMonth[m]=(byMonth[m]||0)+1;
    }
  });
  const months = Object.entries(byMonth).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,6);
  const maxMonth = Math.max(...months.map(([,v])=>v),1);

  // Who went more
  const guiOnly = visited.filter(p=>(entries[p.id]||{}).who==="gui").length;
  const gabOnly = visited.filter(p=>(entries[p.id]||{}).who==="gabriel").length;
  const together = visited.filter(p=>(entries[p.id]||{}).who==="juntos"||(!(entries[p.id]||{}).who)).length;

  if(!visited.length) return (
    <div style={{ textAlign:"center",padding:"60px 20px",color:"#a0a0b0" }}>
      <div style={{ fontSize:40,marginBottom:12 }}>📊</div>
      <div style={{ fontSize:14 }}>{isEN?"Visit places to see your stats!":"Visitem lugares para ver as estatisticas!"}</div>
      <div style={{ fontSize:12,color:"#3a3a50",marginTop:8 }}>{isEN?"Mark places as visited to start tracking":"Marque lugares como Ja fui para comecar"}</div>
    </div>
  );

  return (
    <div style={{ padding:"0 16px 80px" }}>

      {/* Overview */}
      <div style={{ background:"linear-gradient(135deg,#fff5f7,#f5f0ff)",border:"1px solid #ffccd5",borderRadius:14,padding:"16px",marginBottom:12,position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,#ff2d55,#ff6b35,#ff9f0a)" }}/>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
          <div>
            <div style={{ fontSize:11,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:4 }}>{isEN?"EXPLORED":"EXPLORADO"}</div>
            <div style={{ fontSize:36,fontWeight:800,background:"linear-gradient(90deg,#ff2d55,#ff9f0a)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>{pct}%</div>
            <div style={{ fontSize:12,color:"#8a8a9a",marginTop:2 }}>{visited.length} {isEN?"of":"de"} {total} {isEN?"places":"lugares"}</div>
          </div>
          {totalSpent>0&&<div style={{ textAlign:"right" }}>
            <div style={{ fontSize:11,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:4 }}>{isEN?"TOTAL SPENT":"TOTAL GASTO"}</div>
            <div style={{ fontSize:28,fontWeight:700,color:"#30d158" }}>${totalSpent.toFixed(0)}</div>
            <div style={{ fontSize:11,color:"#8a8a9a",marginTop:2 }}>{isEN?"avg":"media"} ${visited.length>0?(totalSpent/visited.filter(p=>(entries[p.id]||{}).spent).length||1).toFixed(0):0}/{isEN?"visit":"visita"}</div>
          </div>}
        </div>
      </div>

      {/* Who went */}
      <div style={{ background:"#ffffff",border:"1px solid #e8e6e0",borderRadius:14,padding:"14px",marginBottom:12 }}>
        <div style={{ fontSize:11,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:10 }}>{isEN?"WHO WENT MORE":"QUEM FOI MAIS"}</div>
        <div style={{ display:"flex",gap:8 }}>
          {[["🧔","Gui",guiOnly,"#ff2d55"],["👨","Gabriel",gabOnly,"#007aff"],["👫",isEN?"Together":"Juntos",together,"#30d158"]].map(([emoji,name,count,color])=>(
            <div key={name} style={{ flex:1,background:color+"15",border:"1px solid "+color+"30",borderRadius:10,padding:"10px",textAlign:"center" }}>
              <div style={{ fontSize:22 }}>{emoji}</div>
              <div style={{ fontSize:20,fontWeight:700,color,marginTop:4 }}>{count}</div>
              <div style={{ fontSize:10,color:"#8a8a9a",marginTop:2 }}>{name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* By category */}
      <div style={{ background:"#ffffff",border:"1px solid #e8e6e0",borderRadius:14,padding:"14px",marginBottom:12 }}>
        <div style={{ fontSize:11,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:10 }}>{isEN?"BY CATEGORY":"POR CATEGORIA"}</div>
        {CATEGORIES.filter(cat=>byCategory[cat]?.total>0).sort((a,b)=>(byCategory[b]?.visited||0)-(byCategory[a]?.visited||0)).map(cat=>{
          const { total:ct, visited:cv, spent:cs } = byCategory[cat]||{total:0,visited:0,spent:0};
          const meta = CAT_META[cat]||{color:"#ff2d55"};
          const pctCat = ct>0?Math.round((cv/ct)*100):0;
          return (
            <div key={cat} style={{ marginBottom:10 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4 }}>
                <div style={{ fontSize:12,color:"#1a1a1a",fontWeight:500 }}>{catLabel(cat)}</div>
                <div style={{ display:"flex",gap:10,alignItems:"center" }}>
                  {cs>0&&<span style={{ fontSize:11,color:"#30d158" }}>${cs.toFixed(0)}</span>}
                  <span style={{ fontSize:11,color:"#8a8a9a" }}>{cv}/{ct}</span>
                  <span style={{ fontSize:11,color:meta.color,fontWeight:600 }}>{pctCat}%</span>
                </div>
              </div>
              <div style={{ height:5,background:"#e8e6e0",borderRadius:3 }}>
                <div style={{ height:"100%",width:pctCat+"%",background:meta.color,borderRadius:3,transition:"width 0.6s ease" }}/>
              </div>
            </div>
          );
        })}
      </div>

      {/* By month */}
      {months.length>0&&<div style={{ background:"#ffffff",border:"1px solid #e8e6e0",borderRadius:14,padding:"14px",marginBottom:12 }}>
        <div style={{ fontSize:11,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:14 }}>{isEN?"VISITS BY MONTH":"VISITAS POR MES"}</div>
        <div style={{ display:"flex",gap:6,alignItems:"flex-end",height:80 }}>
          {months.reverse().map(([month,count])=>{
            const h = Math.round((count/maxMonth)*100);
            return (
              <div key={month} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
                <div style={{ fontSize:10,color:"#ff9f0a",fontWeight:600 }}>{count}</div>
                <div style={{ width:"100%",height:h+"%",minHeight:4,background:"linear-gradient(180deg,#ff2d55,#ff6b35)",borderRadius:"4px 4px 0 0",transition:"height 0.6s ease" }}/>
                <div style={{ fontSize:9,color:"#a0a0b0",textAlign:"center" }}>{new Date(month+"-01").toLocaleDateString(isEN?"en-US":"pt-BR",{month:"short"})}</div>
              </div>
            );
          })}
        </div>
      </div>}

    </div>
  );
}


function QuickActionSheet({ place, entry, onClose, onToggleWant, onCheckIn, onSaveToCuradoria }) {
  const status = entry?.status;
  const meta = CAT_META[place.category]||{color:"#ff2d55"};
  const isWant = status==="quero";
  const isBeen = status==="fui";
  const actions = [
    !isBeen && [isWant?"💔":"♥", isWant?(isEN?"Remove from wishlist":"Tirar da wishlist"):(isEN?"Add to wishlist":"Quero ir"), ()=>{ onToggleWant(place); onClose(); }],
    !isBeen && ["✓", isEN?"Check-in now":"Check-in agora", ()=>{ onCheckIn(place); onClose(); }],
    ["📋", isEN?"Save to curadoria":"Salvar em curadoria", ()=>{ onSaveToCuradoria(place); onClose(); }],
    ["↗", isEN?"Share":"Compartilhar", ()=>{ navigator.share?navigator.share({title:isEN&&place.nameEN?place.nameEN:place.name,url:window.location.href}):navigator.clipboard.writeText(window.location.href); onClose(); }],
  ].filter(Boolean);

  return (
    <div style={{ position:"fixed",inset:0,background:"#000000c0",zIndex:250,display:"flex",alignItems:"flex-end",justifyContent:"center" }} onClick={onClose}>
      <div className="modal slide-up" style={{ background:"#ffffff",borderTop:"1px solid #e8e6e0",borderRadius:"20px 20px 0 0",padding:"16px 16px 48px",maxWidth:560,width:"100%" }} onClick={e=>e.stopPropagation()}>
        <div style={{ width:44,height:4,background:"#d0cdc8",borderRadius:2,margin:"0 auto 16px" }}/>
        <div style={{ display:"flex",alignItems:"center",gap:12,padding:"0 4px 14px",borderBottom:"1px solid #e8e6e0",marginBottom:12 }}>
          <div style={{ width:44,height:44,borderRadius:10,background:meta.color+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22 }}>{place.emoji}</div>
          <div>
            <div style={{ fontSize:14,fontWeight:700,color:"#1a1a1a" }}>{isEN&&place.nameEN?place.nameEN:place.name}</div>
            <div style={{ fontSize:11,color:meta.color }}>{catLabel(place.category)}</div>
          </div>
        </div>
        {actions.map(([icon,label,fn],i)=>(
          <button key={i} onClick={fn} style={{ width:"100%",display:"flex",alignItems:"center",gap:14,padding:"14px 8px",background:"none",border:"none",borderRadius:10,color:"#1a1a1a",fontSize:14,cursor:"pointer",fontFamily:"inherit",textAlign:"left" }}>
            <span style={{ fontSize:22,width:32,textAlign:"center" }}>{icon}</span>{label}
          </button>
        ))}
      </div>
    </div>
  );
}

const PlaceCard = memo(function PlaceCard({ place, entry, onSelect, onCheckIn, isEN, onToggleWant, onQuickAction }) {
  const status = entry?.status;
  const meta = CAT_META[place.category]||{color:"#ff2d55"};
  const displayPrice = entry?.price||place.price;
  const fp = entry?.photos?.[0]||null;
  const pc = entry?.photos?.length||0;
  const isPet = entry?.petFriendly!==undefined?entry.petFriendly:place.petFriendly;
  const needsRes = entry?.needsReservation||place.needsReservation;
  const displayName = isEN&&place.nameEN?place.nameEN:place.name;
  const isBeen = status==="fui";
  const isWant = status==="quero";

  // Swipe + long press state
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartT = useRef(0);
  const longPressTimer = useRef(null);
  const cardRef = useRef(null);
  const [swipeDx, setSwipeDx] = useState(0);
  const [swiping, setSwiping] = useState(false);

  const onTouchStart = e => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartT.current = Date.now();
    longPressTimer.current = setTimeout(() => {
      if(navigator.vibrate) navigator.vibrate(40);
      onQuickAction(place);
    }, 500);
  };
  const onTouchMove = e => {
    clearTimeout(longPressTimer.current);
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    if(dy > 10) { setSwipeDx(0); setSwiping(false); return; }
    if(Math.abs(dx) > 12 && dy < 15) { setSwiping(true); setSwipeDx(Math.max(-80, Math.min(80, dx))); }
  };
  const onTouchEnd = e => {
    clearTimeout(longPressTimer.current);
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dt = Date.now() - touchStartT.current;
    if(Math.abs(dx) > 60) {
      if(dx > 0 && !isBeen) { onToggleWant(place); if(navigator.vibrate) navigator.vibrate([30,20,60]); }
      else if(dx < 0 && !isBeen) { onCheckIn(place); if(navigator.vibrate) navigator.vibrate(50); }
    }
    setSwipeDx(0); setSwiping(false);
  };

  return (
    <div style={{ position:"relative", marginBottom:10, overflow:"hidden", borderRadius:14 }}>
      {/* Swipe hint left - ♥ */}
      <div style={{ position:"absolute",left:0,top:0,bottom:0,width:60,background:"#007aff20",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"14px 0 0 14px",opacity:swipeDx>20?Math.min(1,(swipeDx-20)/40):0,transition:swiping?"none":"opacity 0.2s" }}>
        <span style={{ fontSize:22 }}>♥</span>
      </div>
      {/* Swipe hint right - check-in */}
      <div style={{ position:"absolute",right:0,top:0,bottom:0,width:60,background:"#30d15820",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"0 14px 14px 0",opacity:swipeDx<-20?Math.min(1,(-swipeDx-20)/40):0,transition:swiping?"none":"opacity 0.2s" }}>
        <span style={{ fontSize:22 }}>✓</span>
      </div>
      <div
        ref={cardRef}
        className="card swipe-card"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={()=>{ if(Math.abs(swipeDx)<5) onSelect(place); }}
        style={{
          background: isBeen ? meta.color+"0a" : "#ffffff",
          border: "1px solid "+(isBeen?meta.color+"50":isWant?"#007aff30":"#e8e6e0"),
          borderLeft: "3px solid "+(isBeen?meta.color:isWant?"#007aff":"#e8e6e0"),
          borderRadius:14, padding:"14px 14px 14px 13px", cursor:"pointer", display:"flex", gap:14,
          transform: swipeDx ? `translateX(${swipeDx}px)` : "none",
          transition: swiping ? "none" : "transform 0.2s ease"
        }}
      >
        <div style={{ position:"relative", flexShrink:0 }}>
          {fp ? <img src={fp} alt="" style={{ width:62,height:62,borderRadius:10,objectFit:"cover" }}/>
              : <div style={{ width:62,height:62,borderRadius:10,background:meta.color+(isBeen?"25":"15"),display:"flex",alignItems:"center",justifyContent:"center",fontSize:26 }}>{place.emoji}</div>}
          {isBeen&&<div style={{ position:"absolute",bottom:-4,right:-4,width:18,height:18,borderRadius:"50%",background:meta.color,border:"2px solid #ffffff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",fontWeight:700 }}>✓</div>}
          {isWant&&!isBeen&&<div style={{ position:"absolute",bottom:-4,right:-4,width:18,height:18,borderRadius:"50%",background:"#007aff",border:"2px solid #ffffff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff" }}>♥</div>}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:6, marginBottom:4 }}>
            <div style={{ fontSize:14,fontWeight:600,color:"#1a1a1a",lineHeight:1.25,flex:1 }}>{displayName}</div>
            <div style={{ display:"flex",gap:3,flexShrink:0,alignItems:"center" }}>
              {needsRes&&<span style={{ fontSize:10 }}>📋</span>}
              {entry?.thumb==="up"&&<span style={{ fontSize:11 }}>👍</span>}
              {entry?.stars>0&&<span style={{ fontSize:10,color:"#ff9f0a" }}>{"★".repeat(entry.stars)}</span>}
              {pc>0&&<span style={{ fontSize:10,color:"#a0a0b0" }}>📷</span>}
            </div>
          </div>
          <div style={{ display:"flex",gap:5,alignItems:"center",flexWrap:"wrap" }}>
            <span style={{ fontSize:10,color:meta.color,background:meta.color+"18",borderRadius:6,padding:"2px 7px",fontWeight:500 }}>{catLabel(place.category)}</span>
            {displayPrice&&<span style={{ fontSize:10,color:"#8a8a9a" }}>{PRICE_EMOJI[displayPrice]}</span>}
            {place.time&&<span style={{ fontSize:10,color:"#a0a0b0" }}>· {place.time}</span>}
            {isPet&&<span style={{ fontSize:10 }}>🐾</span>}
          </div>
          {entry?.note&&<div style={{ fontSize:11,color:"#8a8a9a",marginTop:5,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontStyle:"italic" }}>"{entry.note}"</div>}
          {isBeen&&entry?.date&&<div style={{ fontSize:10,color:meta.color+"aa",marginTop:3 }}>Visitado {new Date(entry.date+"T12:00:00").toLocaleDateString(isEN?"en-US":"pt-BR",{month:"short",day:"numeric",year:"numeric"})}</div>}
        </div>
      </div>
      {!isBeen&&swipeDx===0&&<button onClick={ev=>{ev.stopPropagation();onCheckIn(place);}} style={{ position:"absolute",bottom:14,right:12,background:"#30d15815",border:"1px solid #30d15840",borderRadius:20,padding:"4px 10px",color:"#30d158",fontSize:10,cursor:"pointer",fontFamily:"inherit",fontWeight:600 }}>✓ check-in</button>}
    </div>
  );
}, (prev, next) => prev.place===next.place && prev.entry===next.entry && prev.isEN===next.isEN);


// ─── AI ADD MODAL ─────────────────────────────────────────────────────────────
function AIAddModal({ onClose, onSavePlace, onSaveEvent, addToast }) {
  const [mode, setMode] = useState("input"); // input | loading | preview
  const [inputText, setInputText] = useState("");
  const [imageBase64, setImageBase64] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [editResult, setEditResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imageMediaType, setImageMediaType] = useState("image/jpeg");
  const [addStatus, setAddStatus] = useState(null); // null | "quero" | "fui"
  const [addDate, setAddDate] = useState(new Date().toISOString().split("T")[0]);
  const [addWho, setAddWho] = useState("juntos");
  const fileRef = useRef(null);
  const drag = useDragToDismiss(onClose);

  const CATEGORIES_LIST = ["Museus","Monumentos","Observatorios","Natureza","Praias","Livrarias","Lojas","Entretenimento","Compras","Bairros","Comida","Mercados & Delis","Dispensaries","Bares","Daytrips"];

  const compressImage = (dataUrl) => new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1024;
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });

  const handleImage = e => {
    const file = e.target.files[0];
    if(!file) return;
    if(!file.type.startsWith("image/")) {
      addToast(isEN?"Select an image file":"Selecione um arquivo de imagem","error");
      return;
    }
    const reader = new FileReader();
    reader.onload = async ev => {
      const compressed = await compressImage(ev.target.result);
      setImageBase64(compressed.split(",")[1]);
      setImageMediaType("image/jpeg");
      setImagePreview(compressed);
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if(!inputText.trim() && !imageBase64) return;
    setMode("loading");

    const systemPrompt = `Voce e um assistente que ajuda adicionar lugares e eventos a um app de bucket list de NYC.
Dado um nome, descricao ou foto, extraia as informacoes e retorne APENAS JSON valido, sem texto adicional.

Categorias disponiveis: Museus, Monumentos, Observatorios, Natureza, Praias, Livrarias, Lojas, Entretenimento, Compras, Bairros, Comida, Mercados & Delis, Dispensaries, Bares, Daytrips.
Precos: gratis, $, $$, $$$.
Tempo: 30min, 1h, 2h, 3h+.
Estacoes: sempre, verao, inverno, primavera, outono.
Tipo de evento: show, exposicao, festival, esporte, teatro, outro.

Retorne este JSON (type = "place" ou "event"):
{
  "type": "place",
  "name": "Nome em portugues",
  "nameEN": "Name in English",
  "category": "categoria da lista acima",
  "emoji": "emoji unico e relevante",
  "desc": "descricao curta em portugues (max 120 chars)",
  "descEN": "short description in English (max 120 chars)",
  "price": "gratis|$|$$|$$$",
  "time": "30min|1h|2h|3h+",
  "season": "sempre|verao|inverno|primavera|outono",
  "petFriendly": false,
  "publicBathroom": false,
  "needsReservation": false,
  "hours": "horarios de funcionamento ou vazio",
  "link": "URL oficial ou vazio",
  "rep": "dica em portugues (max 80 chars) ou vazio",
  "repEN": "tip in English (max 80 chars) or empty",
  "eventDate": "YYYY-MM-DD se for evento com data especifica, senao vazio",
  "eventTime": "HH:MM se for evento, senao vazio",
  "location": "endereco ou nome do local se for evento",
  "eventCategory": "show|exposicao|festival|esporte|teatro|outro se for evento",
  "ticketLink": "link do ingresso se existir"
}`;

    const userText = systemPrompt + "\n\n" + (inputText.trim() || "Analise o que foi fornecido e preencha os dados para adicionar ao bucket list de NYC.");
    const userContent = imageBase64 ? [
      { type:"image", source:{ type:"base64", media_type:imageMediaType, data:imageBase64 } },
      { type:"text", text:userText }
    ] : userText;

    try {
      const r = await fetch(AI_PROXY, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          messages:[{ role:"user", content:userContent }],
          max_tokens:1000
        })
      });
      const d = await r.json();
      if(d.error) throw new Error(d.error.message||JSON.stringify(d.error));
      const text = d.content?.[0]?.text||"";
      if(!text) throw new Error("empty response");
      const clean = text.replace(/```json\n?|```/g,"").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
      setEditResult({...parsed});
      setMode("preview");
    } catch(err) {
      console.error("AI Add error:", err);
      addToast((isEN?"Error: ":"Erro: ")+(err.message||"tente novamente"),"error");
      setMode("input");
    }
  };

  const confirm = async () => {
    setSaving(true);
    const r = editResult;
    const isEvent = r.type==="event" || (r.eventDate&&r.eventDate.length>0);

    if(isEvent) {
      const ev = {
        id:"ev"+Date.now(),
        name:r.name||r.nameEN||"Evento",
        emoji:r.emoji||"📅",
        category:r.eventCategory||"outro",
        date:r.eventDate||new Date().toISOString().split("T")[0],
        time:r.eventTime||"",
        location:r.location||"",
        price:r.price||"",
        desc:r.desc||"",
        ticketLink:r.ticketLink||"",
        archived:false,
        createdAt:new Date().toISOString()
      };
      await onSaveEvent(ev);
      addToast(isEN?"Event added!":"Evento adicionado!","success");
    } else {
      const place = {
        id:"ai"+Date.now(),
        name:r.name||r.nameEN||"Lugar",
        nameEN:r.nameEN||r.name||"Place",
        category:CATEGORIES_LIST.includes(r.category)?r.category:"Entretenimento",
        emoji:r.emoji||"📍",
        desc:r.desc||"",
        descEN:r.descEN||"",
        price:r.price||"$",
        time:r.time||"2h",
        season:r.season||"sempre",
        petFriendly:r.petFriendly||false,
        publicBathroom:r.publicBathroom||false,
        needsReservation:r.needsReservation||false,
        hours:r.hours||"",
        link:r.link||"",
        rep:r.rep||"",
        repEN:r.repEN||"",
        lat:null, lng:null
      };
      await onSavePlace(place);
      if(addStatus) await set(ref(db,"entries/"+place.id),{status:addStatus,date:addStatus==="fui"?addDate:null,who:addStatus==="fui"?addWho:null});
      addToast(isEN?"Place added!":"Lugar adicionado!","success");
    }
    setSaving(false);
    onClose();
  };

  if(mode==="loading") return (
    <div style={{ position:"fixed",inset:0,background:"#000000f0",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ textAlign:"center" }}>
        <div className="pulsing" style={{ fontSize:52,marginBottom:16 }}>🤖</div>
        <div style={{ fontSize:15,color:"#1a1a1a",fontWeight:600,marginBottom:6 }}>Analisando...</div>
        <div style={{ fontSize:12,color:"#8a8a9a" }}>Claude esta pensando</div>
      </div>
    </div>
  );

  if(mode==="preview"&&editResult) return (
    <div style={{ position:"fixed",inset:0,background:"#000000f0",zIndex:400,display:"flex",alignItems:"flex-end",justifyContent:"center" }}>
      <div className="modal" style={{ background:"#ffffff",borderTop:"1px solid #e8e6e0",borderRadius:"20px 20px 0 0",padding:"20px 16px 48px",maxWidth:560,width:"100%",maxHeight:"92vh",overflowY:"auto" }}>
        <div style={{ width:44,height:4,background:"#d0cdc8",borderRadius:2,margin:"0 auto 14px" }}/>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
          <div style={{ fontSize:15,fontWeight:700,color:"#1a1a1a" }}>✨ {isEN?"Claude found this":"Claude encontrou isso"}</div>
          <div style={{ display:"flex",gap:6 }}>
            <button onClick={()=>setMode("input")} style={{ background:"none",border:"1px solid #e8e6e0",borderRadius:8,padding:"4px 10px",color:"#a0a0b0",fontSize:12,cursor:"pointer" }}>← {isEN?"Edit":"Editar"}</button>
            <button onClick={onClose} style={{ background:"none",border:"1px solid #e8e6e0",borderRadius:8,padding:"4px 10px",color:"#a0a0b0",fontSize:16,cursor:"pointer",lineHeight:1 }}>×</button>
          </div>
        </div>

        {/* Type badge */}
        <div style={{ display:"flex",gap:8,marginBottom:14 }}>
          {["place","event"].map(t=><button key={t} onClick={()=>setEditResult(p=>({...p,type:t}))} style={{ flex:1,padding:"8px",borderRadius:10,background:editResult.type===t||(!editResult.type&&t==="place")?"#ff2d5515":"#f8f7f4",border:"1px solid "+(editResult.type===t?"#ff2d55":"#e8e6e0"),color:editResult.type===t?"#ff2d55":"#a0a0b0",fontSize:12,cursor:"pointer" }}>
            {t==="place"?(isEN?"📍 Place":"📍 Lugar"):(isEN?"📅 Event":"📅 Evento")}
          </button>)}
        </div>

        {/* Emoji + Name */}
        <div style={{ display:"flex",gap:10,marginBottom:12 }}>
          <input value={editResult.emoji||""} onChange={e=>setEditResult(p=>({...p,emoji:e.target.value}))} maxLength={2} style={{ width:52,background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"8px",color:"#1a1a1a",fontSize:22,textAlign:"center" }}/>
          <input value={editResult.name||""} onChange={e=>setEditResult(p=>({...p,name:e.target.value}))} style={{ flex:1,background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"8px 12px",color:"#1a1a1a",fontSize:14,fontWeight:600 }}/>
        </div>

        {/* Category */}
        {(editResult.type==="place"||!editResult.eventDate) && <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:6 }}>CATEGORIA</div>
          <div style={{ display:"flex",gap:5,flexWrap:"wrap" }}>
            {CATEGORIES_LIST.map(cat=><button key={cat} onClick={()=>setEditResult(p=>({...p,category:cat}))} style={{ padding:"5px 10px",borderRadius:20,background:editResult.category===cat?"#ff2d5515":"#f8f7f4",border:"1px solid "+(editResult.category===cat?"#ff2d55":"#e8e6e0"),color:editResult.category===cat?"#ff2d55":"#8a8a9a",fontSize:11,cursor:"pointer" }}>{catLabel(cat)}</button>)}
          </div>
        </div>}

        {/* Event date/time */}
        {(editResult.type==="event"||editResult.eventDate) && <div style={{ display:"flex",gap:8,marginBottom:12 }}>
          <div style={{ flex:2 }}>
            <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:6 }}>DATA</div>
            <input type="date" value={editResult.eventDate||""} onChange={e=>setEditResult(p=>({...p,eventDate:e.target.value}))} style={{ width:"100%",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"8px 12px",color:"#1a1a1a",fontSize:13 }}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:6 }}>HORA</div>
            <input type="time" value={editResult.eventTime||""} onChange={e=>setEditResult(p=>({...p,eventTime:e.target.value}))} style={{ width:"100%",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"8px 12px",color:"#1a1a1a",fontSize:13 }}/>
          </div>
        </div>}

        {/* Desc */}
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:6 }}>DESCRICAO</div>
          <textarea value={editResult.desc||""} onChange={e=>setEditResult(p=>({...p,desc:e.target.value}))} rows={2} style={{ width:"100%",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"8px 12px",color:"#1a1a1a",fontSize:13,resize:"none" }}/>
        </div>

        {/* Price + Time row */}
        <div style={{ display:"flex",gap:8,marginBottom:12 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:6 }}>PRECO</div>
            <div style={{ display:"flex",gap:4 }}>
              {["gratis","$","$$","$$$"].map(p=><button key={p} onClick={()=>setEditResult(prev=>({...prev,price:p}))} style={{ flex:1,padding:"7px 4px",borderRadius:8,background:editResult.price===p?"#ff9f0a18":"#f8f7f4",border:"1px solid "+(editResult.price===p?"#ff9f0a":"#e8e6e0"),color:editResult.price===p?"#ff9f0a":"#8a8a9a",fontSize:11,cursor:"pointer" }}>{p==="gratis"?"🆓":p}</button>)}
            </div>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:6 }}>TEMPO</div>
            <div style={{ display:"flex",gap:4 }}>
              {["30min","1h","2h","3h+"].map(t=><button key={t} onClick={()=>setEditResult(prev=>({...prev,time:t}))} style={{ flex:1,padding:"7px 2px",borderRadius:8,background:editResult.time===t?"#007aff18":"#f8f7f4",border:"1px solid "+(editResult.time===t?"#007aff":"#e8e6e0"),color:editResult.time===t?"#007aff":"#8a8a9a",fontSize:11,cursor:"pointer" }}>{t}</button>)}
            </div>
          </div>
        </div>

        {/* Rep tip */}
        {editResult.rep&&<div style={{ marginBottom:12,padding:"10px 12px",background:"#ff9f0a10",border:"1px solid #ff9f0a30",borderRadius:10 }}>
          <div style={{ fontSize:10,color:"#ff9f0a",marginBottom:4 }}>⭐ DICA DO CLAUDE</div>
          <input value={editResult.rep||""} onChange={e=>setEditResult(p=>({...p,rep:e.target.value}))} style={{ width:"100%",background:"none",border:"none",color:"#1a1a1a",fontSize:13 }}/>
        </div>}

        {/* Hours + Link */}
        {editResult.hours&&<div style={{ marginBottom:12 }}>
          <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:6 }}>HORARIOS</div>
          <input value={editResult.hours||""} onChange={e=>setEditResult(p=>({...p,hours:e.target.value}))} style={{ width:"100%",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"8px 12px",color:"#1a1a1a",fontSize:13 }}/>
        </div>}
        {editResult.link&&<div style={{ marginBottom:14 }}>
          <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:6 }}>LINK</div>
          <input value={editResult.link||""} onChange={e=>setEditResult(p=>({...p,link:e.target.value}))} style={{ width:"100%",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"8px 12px",color:"#1a1a1a",fontSize:13 }}/>
        </div>}

        {/* Flags */}
        <div style={{ display:"flex",gap:8,marginBottom:16 }}>
          {[["needsReservation","📋","Reserva"],["petFriendly","🐾","Pet"],["publicBathroom","🚻","Banheiro"]].map(([k,emoji,label])=>(
            <button key={k} onClick={()=>setEditResult(p=>({...p,[k]:!p[k]}))} style={{ flex:1,padding:"8px 4px",borderRadius:10,background:editResult[k]?"#ff2d5518":"#f8f7f4",border:"1px solid "+(editResult[k]?"#ff2d55":"#e8e6e0"),color:editResult[k]?"#ff2d55":"#a0a0b0",fontSize:11,cursor:"pointer" }}>
              {emoji} {label}
            </button>
          ))}
        </div>

        {/* Status */}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:8 }}>{isEN?"HAVE YOU BEEN?":"JA FORAM?"}</div>
          <div style={{ display:"flex",gap:6 }}>
            {[{v:null,label:isEN?"Not yet":"Ainda nao",color:"#a0a0b0"},{v:"quero",label:isEN?"Want to go":"Quero ir",color:"#ff2d55"},{v:"fui",label:isEN?"Been there!":"Ja fui!",color:"#30d158"}].map(({v,label,color})=>(
              <button key={String(v)} onClick={()=>setAddStatus(v)} style={{ flex:1,padding:"9px 4px",borderRadius:10,background:addStatus===v?color+"20":"#f8f7f4",border:"1px solid "+(addStatus===v?color:"#e8e6e0"),color:addStatus===v?color:"#a0a0b0",fontSize:12,cursor:"pointer",fontWeight:addStatus===v?700:400 }}>{label}</button>
            ))}
          </div>
        </div>
        {addStatus==="fui"&&<div style={{ background:"#f8f7f480",border:"1px solid #e8e6e0",borderRadius:10,padding:"12px",marginBottom:14 }}>
          <div style={{ marginBottom:10 }}>
            <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:6 }}>{isEN?"DATE":"DATA"}</div>
            <input type="date" value={addDate} onChange={e=>setAddDate(e.target.value)} style={{ width:"100%",background:"#f8f7f4",border:"1px solid #e8e6e0",borderRadius:8,padding:"8px 10px",color:"#1a1a1a",fontSize:13 }}/>
          </div>
          <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:6 }}>{isEN?"WHO WENT?":"QUEM FOI?"}</div>
          <div style={{ display:"flex",gap:6 }}>{WHO_OPTIONS.map(w=><button key={w} onClick={()=>setAddWho(w)} style={{ flex:1,padding:"8px 4px",borderRadius:8,background:addWho===w?"#007aff20":"#f8f7f4",border:"1px solid "+(addWho===w?"#007aff":"#e8e6e0"),color:addWho===w?"#007aff":"#8a8a9a",fontSize:12,cursor:"pointer" }}>{WHO_EMOJI[w]} {WHO_LABELS[w]}</button>)}</div>
        </div>}

        <button onClick={confirm} disabled={saving} style={{ width:"100%",padding:"14px",background:saving?"#e8e6e0":"#ff2d55",border:"none",borderRadius:12,color:saving?"#a0a0b0":"#fff",fontSize:14,fontWeight:700,cursor:saving?"default":"pointer" }}>
          {saving?"Salvando...":(isEN?"Add to my list ✓":"Adicionar à minha lista ✓")}
        </button>
      </div>
    </div>
  );

  // Input mode
  return (
    <div style={{ position:"fixed",inset:0,background:"#000000f0",zIndex:400,display:"flex",alignItems:"flex-end",justifyContent:"center" }} onClick={onClose}>
      <div className="modal" {...drag} onClick={e=>e.stopPropagation()} style={{ background:"#ffffff",borderTop:"1px solid #e8e6e0",borderRadius:"20px 20px 0 0",padding:"20px 16px 48px",maxWidth:560,width:"100%" }}>
        <div style={{ width:44,height:4,background:"#d0cdc8",borderRadius:2,margin:"0 auto 16px" }}/>
        <div style={{ fontSize:15,fontWeight:700,color:"#1a1a1a",marginBottom:4 }}>✨ {isEN?"Add with AI":"Adicionar com IA"}</div>
        <div style={{ fontSize:12,color:"#8a8a9a",marginBottom:16 }}>{isEN?"Send a photo or describe the place/event":"Mande uma foto ou descreva o lugar/evento"}</div>

        {/* Image upload */}
        <div onClick={()=>fileRef.current.click()} style={{ border:"1.5px dashed "+(imagePreview?"#ff2d5560":"#e8e6e0"),borderRadius:12,padding:"16px",textAlign:"center",cursor:"pointer",marginBottom:12,background:imagePreview?"#ff2d5508":"none",transition:"all 0.2s",position:"relative",overflow:"hidden" }}>
          {imagePreview ? <>
            <img src={imagePreview} alt="" style={{ maxHeight:140,borderRadius:8,objectFit:"contain" }}/>
            <button onClick={e=>{e.stopPropagation();setImageBase64(null);setImagePreview(null);}} style={{ position:"absolute",top:8,right:8,background:"#000c",border:"none",borderRadius:"50%",width:24,height:24,color:"#fff",cursor:"pointer",fontSize:14 }}>×</button>
          </> : <>
            <div style={{ fontSize:32,marginBottom:6 }}>📸</div>
            <div style={{ fontSize:13,color:"#8a8a9a" }}>{isEN?"Tap to upload photo or screenshot":"Toque para enviar foto ou print"}</div>
            <div style={{ fontSize:11,color:"#a0a0b0",marginTop:4 }}>{isEN?"Story, flyer, Google Maps screenshot...":"Story, flyer, print do Google Maps..."}</div>
          </>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display:"none" }}/>

        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
          <div style={{ flex:1,height:1,background:"#e8e6e0" }}/>
          <span style={{ fontSize:11,color:"#a0a0b0" }}>{isEN?"or type":"ou escreva"}</span>
          <div style={{ flex:1,height:1,background:"#e8e6e0" }}/>
        </div>

        <input value={inputText} onChange={e=>setInputText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&analyze()} placeholder={isEN?"e.g. Roberta's Pizza Brooklyn, or describe an event...":"ex: Roberta's Pizza Brooklyn, ou descreva um evento..."} style={{ width:"100%",background:"#f8f7f4",border:"1.5px solid "+(inputText?"#ff2d5550":"#e8e6e0"),borderRadius:12,padding:"12px 14px",color:"#1a1a1a",fontSize:14,marginBottom:14,transition:"border-color 0.2s" }}/>

        <button onClick={analyze} disabled={!inputText.trim()&&!imageBase64} style={{ width:"100%",padding:"14px",background:inputText.trim()||imageBase64?"#ff2d55":"#e8e6e0",border:"none",borderRadius:12,color:inputText.trim()||imageBase64?"#fff":"#a0a0b0",fontSize:14,fontWeight:700,cursor:inputText.trim()||imageBase64?"pointer":"default",transition:"all 0.2s" }}>
          {isEN?"Analyze with Claude ✨":"Analisar com Claude ✨"}
        </button>
      </div>
    </div>
  );
}

function MemoriasTab({ places, entries, onSelect }) {
  const visited = places.filter(p=>(entries[p.id]||{}).status==="fui");
  const want = places.filter(p=>(entries[p.id]||{}).status==="quero");
  const totalSpent = visited.reduce((s,p)=>s+((entries[p.id]||{}).spent||0),0);
  const pct = places.length>0?Math.round((visited.length/places.length)*100):0;

  const byCategory = {};
  CATEGORIES.forEach(cat=>{
    const cv=places.filter(p=>p.category===cat&&(entries[p.id]||{}).status==="fui");
    if(cv.length>0) byCategory[cat]=cv.length;
  });
  const catSorted = Object.entries(byCategory).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const maxCat = catSorted[0]?catSorted[0][1]:1;

  const byMonth = {};
  visited.forEach(p=>{
    const e=entries[p.id]||{};
    if(!e.date)return;
    const d=new Date(e.date);
    const key=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0");
    if(!byMonth[key])byMonth[key]=[];
    byMonth[key].push(p);
  });
  const months = Object.keys(byMonth).sort((a,b)=>b.localeCompare(a));
  const MONTH_NAMES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

  return (
    <div style={{ padding:"16px 16px 120px" }}>
      {/* Stats header */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20 }}>
        {[
          [visited.length,isEN?"visited":"visitados","#ff2d55"],
          [want.length,isEN?"want to go":"quero ir","#007aff"],
          [totalSpent>0?"$"+Math.round(totalSpent):"-",isEN?"spent":"gasto","#30d158"],
        ].map(([val,label,color])=>(
          <div key={label} style={{ background:"#ffffff",borderRadius:14,padding:"14px 10px",textAlign:"center",boxShadow:"0 1px 4px #00000010",border:"1px solid #e8e6e0" }}>
            <div style={{ fontSize:22,fontWeight:800,color }}>{val}</div>
            <div style={{ fontSize:10,color:"#8a8a9a",marginTop:2,letterSpacing:"0.05em" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ background:"#ffffff",borderRadius:14,padding:"14px 16px",marginBottom:20,boxShadow:"0 1px 4px #00000010",border:"1px solid #e8e6e0" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
          <span style={{ fontSize:12,fontWeight:600,color:"#1a1a1a" }}>{isEN?"Progress":"Progresso"}</span>
          <span style={{ fontSize:13,fontWeight:800,color:"#ff2d55" }}>{pct}%</span>
        </div>
        <div style={{ height:6,background:"#f0eeeb",borderRadius:4 }}>
          <div style={{ height:"100%",width:pct+"%",background:"linear-gradient(90deg,#ff2d55,#ff6b35)",borderRadius:4,transition:"width 0.6s ease" }}/>
        </div>
        <div style={{ fontSize:11,color:"#8a8a9a",marginTop:6 }}>{visited.length} de {places.length} {isEN?"places":"lugares"}</div>
      </div>

      {/* By category */}
      {catSorted.length>0&&<div style={{ background:"#ffffff",borderRadius:14,padding:"14px 16px",marginBottom:20,boxShadow:"0 1px 4px #00000010",border:"1px solid #e8e6e0" }}>
        <div style={{ fontSize:11,fontWeight:700,color:"#8a8a9a",letterSpacing:"0.1em",marginBottom:12 }}>{isEN?"BY CATEGORY":"POR CATEGORIA"}</div>
        {catSorted.map(([cat,count])=>(
          <div key={cat} style={{ marginBottom:10 }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
              <span style={{ fontSize:12,color:"#1a1a1a" }}>{catLabel(cat)}</span>
              <span style={{ fontSize:12,fontWeight:700,color:CAT_META[cat]?.color||"#ff2d55" }}>{count}</span>
            </div>
            <div style={{ height:4,background:"#f0eeeb",borderRadius:2 }}>
              <div style={{ height:"100%",width:(count/maxCat*100)+"%",background:CAT_META[cat]?.color||"#ff2d55",borderRadius:2 }}/>
            </div>
          </div>
        ))}
      </div>}

      {/* Timeline */}
      <div style={{ fontSize:11,fontWeight:700,color:"#8a8a9a",letterSpacing:"0.1em",marginBottom:12 }}>{isEN?"TIMELINE":"LINHA DO TEMPO"}</div>
      {months.length===0&&<div style={{ textAlign:"center",padding:"40px 20px",color:"#8a8a9a" }}>
        <div style={{ fontSize:32,marginBottom:8 }}>📖</div>
        <div style={{ fontSize:14,color:"#1a1a1a" }}>{isEN?"No check-ins yet":"Nenhum check-in ainda"}</div>
      </div>}
      {months.map(m=>{
        const [yr,mo]=m.split("-");
        const label=MONTH_NAMES[parseInt(mo)-1]+" "+yr;
        const mplaces=byMonth[m];
        return (
          <div key={m} style={{ marginBottom:16 }}>
            <div style={{ fontSize:11,fontWeight:700,color:"#8a8a9a",letterSpacing:"0.1em",marginBottom:8 }}>{label.toUpperCase()} · {mplaces.length} {isEN?"visits":"visitas"}</div>
            {mplaces.map(p=>{
              const e=entries[p.id]||{};
              return (
                <div key={p.id} onClick={()=>onSelect(p)} style={{ background:"#ffffff",borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",gap:12,alignItems:"center",cursor:"pointer",border:"1px solid #e8e6e0",boxShadow:"0 1px 3px #00000008" }}>
                  <div style={{ fontSize:26,flexShrink:0 }}>{p.emoji}</div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontSize:14,fontWeight:600,color:"#1a1a1a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{isEN&&p.nameEN?p.nameEN:p.name}</div>
                    <div style={{ fontSize:11,color:"#8a8a9a",marginTop:2 }}>{e.date||""} {e.who?("· "+WHO_LABELS[e.who]):""}</div>
                  </div>
                  {e.stars>0&&<div style={{ fontSize:12,color:"#ff9f0a",flexShrink:0 }}>{"★".repeat(e.stars)}</div>}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function PlanejArTab({ events, onAddEvent, onSaveEvent, onDeleteEvent, onOpenPlanner, addToast }) {
  const upcoming = (events||[]).filter(ev=>{
    if(!ev.date)return false;
    return new Date(ev.date+"T23:59:59")>=new Date();
  }).sort((a,b)=>a.date.localeCompare(b.date));
  const past = (events||[]).filter(ev=>{
    if(!ev.date)return true;
    return new Date(ev.date+"T23:59:59")<new Date();
  }).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);

  const today = new Date().toISOString().split("T")[0];
  const dayNames = isEN?["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]:["Dom","Seg","Ter","Qua","Qui","Sex","Sab"];

  const formatDate = (d)=>{
    if(!d)return "";
    const dt=new Date(d+"T12:00:00");
    const diff=Math.round((dt-new Date())/(1000*60*60*24));
    if(diff===0)return isEN?"Today":"Hoje";
    if(diff===1)return isEN?"Tomorrow":"Amanha";
    if(diff>0&&diff<=6)return isEN?("In "+diff+" days"):("Em "+diff+" dias");
    return dt.toLocaleDateString(isEN?"en-US":"pt-BR",{day:"numeric",month:"short"});
  };

  return (
    <div style={{ padding:"16px 16px 120px" }}>
      {/* AI Planner CTA */}
      <div onClick={onOpenPlanner} style={{ background:"linear-gradient(135deg,#ff2d55,#ff6b35)",borderRadius:16,padding:"18px 20px",marginBottom:20,cursor:"pointer",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",right:-10,top:-10,fontSize:60,opacity:0.15 }}>🤖</div>
        <div style={{ fontSize:11,color:"#ffffff",opacity:0.8,letterSpacing:"0.1em",marginBottom:4 }}>{isEN?"AI GUIDE":"GUIA IA"}</div>
        <div style={{ fontSize:18,fontWeight:800,color:"#ffffff",marginBottom:4 }}>{isEN?"Plan your day in NYC":"Planeje seu dia em NYC"}</div>
        <div style={{ fontSize:12,color:"#ffffff",opacity:0.85 }}>{isEN?"Chat, select places, generate a route":"Converse, selecione lugares, gere um roteiro"}</div>
        <div style={{ marginTop:12,background:"#ffffff20",borderRadius:10,padding:"8px 14px",display:"inline-block",fontSize:12,color:"#ffffff",fontWeight:600 }}>{isEN?"Open AI Planner →":"Abrir Planejador →"}</div>
      </div>

      {/* Upcoming events */}
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
        <div style={{ fontSize:11,fontWeight:700,color:"#8a8a9a",letterSpacing:"0.1em" }}>{isEN?"UPCOMING":"PROXIMOS EVENTOS"}</div>
        <button onClick={onAddEvent} style={{ background:"#ff2d55",border:"none",borderRadius:20,padding:"6px 14px",color:"#ffffff",fontSize:12,fontWeight:700,cursor:"pointer" }}>+ {isEN?"Add":"Adicionar"}</button>
      </div>

      {upcoming.length===0&&<div style={{ background:"#ffffff",borderRadius:14,padding:"24px 20px",textAlign:"center",marginBottom:20,border:"1px solid #e8e6e0" }}>
        <div style={{ fontSize:32,marginBottom:8 }}>📅</div>
        <div style={{ fontSize:13,color:"#1a1a1a",marginBottom:4 }}>{isEN?"No upcoming events":"Nenhum evento proximo"}</div>
        <div style={{ fontSize:12,color:"#8a8a9a" }}>{isEN?"Add events like concerts, shows or reservations":"Adicione eventos como shows, pecas ou reservas"}</div>
      </div>}

      {upcoming.map(ev=>(
        <div key={ev.id} style={{ background:"#ffffff",borderRadius:14,padding:"14px 16px",marginBottom:10,border:"1px solid #e8e6e0",boxShadow:"0 1px 3px #00000008",display:"flex",gap:12,alignItems:"flex-start" }}>
          <div style={{ background:ev.date===today?"#ff2d5515":"#f8f7f4",borderRadius:10,padding:"8px 10px",textAlign:"center",minWidth:44,flexShrink:0,border:"1px solid "+(ev.date===today?"#ff2d5530":"#e8e6e0") }}>
            <div style={{ fontSize:11,fontWeight:800,color:ev.date===today?"#ff2d55":"#8a8a9a" }}>{ev.date?new Date(ev.date+"T12:00:00").getDate():"-"}</div>
            <div style={{ fontSize:9,color:ev.date===today?"#ff2d55":"#b0aebb",textTransform:"uppercase" }}>{ev.date?new Date(ev.date+"T12:00:00").toLocaleDateString(isEN?"en-US":"pt-BR",{month:"short"}):""}</div>
          </div>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontSize:14,fontWeight:700,color:"#1a1a1a",marginBottom:2 }}>{ev.emoji||"📅"} {ev.name}</div>
            {ev.desc&&<div style={{ fontSize:12,color:"#8a8a9a",marginBottom:2 }}>{ev.desc}</div>}
            <div style={{ fontSize:11,color:"#ff2d55",fontWeight:600 }}>{formatDate(ev.date)}</div>
          </div>
          <button onClick={async()=>{if(onDeleteEvent)await onDeleteEvent(ev.id);}} style={{ background:"none",border:"none",color:"#b0aebb",fontSize:18,cursor:"pointer",flexShrink:0,padding:"0 4px" }}>×</button>
        </div>
      ))}

      {past.length>0&&<>
        <div style={{ fontSize:11,fontWeight:700,color:"#8a8a9a",letterSpacing:"0.1em",marginBottom:12,marginTop:8 }}>{isEN?"PAST EVENTS":"EVENTOS PASSADOS"}</div>
        {past.map(ev=>(
          <div key={ev.id} style={{ background:"#ffffff",borderRadius:14,padding:"12px 14px",marginBottom:8,border:"1px solid #e8e6e0",opacity:0.65,display:"flex",gap:10,alignItems:"center" }}>
            <div style={{ fontSize:20,flexShrink:0 }}>{ev.emoji||"📅"}</div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontSize:13,fontWeight:600,color:"#1a1a1a" }}>{ev.name}</div>
              {ev.date&&<div style={{ fontSize:11,color:"#b0aebb" }}>{new Date(ev.date+"T12:00:00").toLocaleDateString(isEN?"en-US":"pt-BR",{day:"numeric",month:"short",year:"numeric"})}</div>}
            </div>
          </div>
        ))}
      </>}
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState({});
  const [customPlaces, setCustomPlaces] = useState([]);
  const [lists, setLists] = useState([]);
  const [removedIds, setRemovedIds] = useState([]);
  const [customEdits, setCustomEdits] = useState({});
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [tab, setTab] = useState("explorar");
  // useSwipeTabs disabled — tab switching is intentional only via bottom nav
  const [activeFilter, setActiveFilter] = useState("todos");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [filterVibes, setFilterVibes] = useState([]);
  const [filterPrices, setFilterPrices] = useState([]);
  const [filterSeasons, setFilterSeasons] = useState([]);
  const [filterStars, setFilterStars] = useState(0);
  const [filterThumb, setFilterThumb] = useState(null);
  const [filterPet, setFilterPet] = useState(false);
  const [filterBathroom, setFilterBathroom] = useState(false);
  const [filterRegion, setFilterRegion] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const searchDebounce = useRef(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showPlanner, setShowPlanner] = useState(false);
  const [showNearby, setShowNearby] = useState(false);
  const [showSurpresa, setShowSurpresa] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAIAdd, setShowAIAdd] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [placeOfDay, setPlaceOfDay] = useState(null);
  const placeOfDayFixed = useRef(false);
  const [toasts, setToasts] = useState([]);
  const removeTimers = useRef({});
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);
  const [quickAction, setQuickAction] = useState(null);
  const [activeMood, setActiveMood] = useState(null);
  const [nearbyAlert, setNearbyAlert] = useState(null);
  const scrollPosRef = useRef(0);
  const alertedRef = useRef(new Set());
  const visiblePlacesRef = useRef([]);
  const entriesRef = useRef({});
  const currentWeather = window._nycWeather||null;

  const openModal = (place) => { scrollPosRef.current = window.scrollY; setSelected(place); };
  const closeModal = () => { setSelected(null); requestAnimationFrame(()=>window.scrollTo(0,scrollPosRef.current)); };

  useEffect(() => {
    const timers = removeTimers.current;
    return () => { Object.values(timers).forEach(t=>clearTimeout(t)); };
  }, []);

  useEffect(() => {
    injectCSS();
    const u1=onValue(ref(db,"entries"),snap=>{if(snap.val())setEntries(snap.val());setLoading(false);});
    const u2=onValue(ref(db,"customPlaces"),snap=>{if(snap.val())setCustomPlaces(Object.values(snap.val()));else setCustomPlaces([]);});
    const u3=onValue(ref(db,"lists"),snap=>{if(snap.val())setLists(Object.values(snap.val()));});
    const u4=onValue(ref(db,"removedIds"),snap=>{if(snap.val())setRemovedIds(Object.keys(snap.val()));else setRemovedIds([]);});
    const u5=onValue(ref(db,"customEdits"),snap=>{if(snap.val())setCustomEdits(snap.val());});
    const u6=onValue(ref(db,"events"),snap=>{
      if(snap.val()){
        const evs=Object.values(snap.val());
        const today=new Date().toISOString().split("T")[0];
        evs.forEach(async ev=>{if(ev.date<today&&!ev.archived)await set(ref(db,"events/"+ev.id),{...ev,archived:true});});
        setEvents(evs);
      } else setEvents([]);
    });
    setTimeout(()=>setLoading(false),3000);
    return()=>{u1();u2();u3();u4();u5();u6();};
  }, []);

  useEffect(()=>{
    if(!navigator.geolocation) return;
    const wid=navigator.geolocation.watchPosition(
      pos=>{
        const {latitude:lat,longitude:lng}=pos.coords;
        setUserLat(lat); setUserLng(lng);
        const RADIUS=0.2;
        const near=visiblePlacesRef.current.find(p=>{
          if(!p.lat||!p.lng) return false;
          if(alertedRef.current.has(p.id)) return false;
          const e=entriesRef.current[p.id]||{};
          if(e.status==="fui") return false;
          return haversineKm(lat,lng,p.lat,p.lng)<RADIUS;
        });
        if(near){alertedRef.current.add(near.id);setNearbyAlert(near);}
      },
      ()=>{},
      {enableHighAccuracy:true,maximumAge:30000}
    );
    return()=>navigator.geolocation.clearWatch(wid);
  },[]);

  const places = useMemo(()=>[...INITIAL_PLACES,...customPlaces],[customPlaces]);
  const effectivePlaces = useMemo(()=>places.map(p=>{const ed=customEdits[p.id];return ed?{...p,...ed}:p;}),[places,customEdits]);
  const visiblePlaces = useMemo(()=>effectivePlaces.filter(p=>!removedIds.includes(p.id)),[effectivePlaces,removedIds]);
  visiblePlacesRef.current = visiblePlaces;
  entriesRef.current = entries;

  useEffect(()=>{
    if(placeOfDayFixed.current)return;
    const visible=visiblePlaces.filter(p=>!removedIds.includes(p.id));
    if(!visible.length)return;
    const candidates=visible.filter(p=>{const e=entries[p.id];return!e||!e.status||e.status==="quero";});
    if(!candidates.length)return;
    const seed=new Date().toDateString();let h=0;
    for(let i=0;i<seed.length;i++)h=((h<<5)-h)+seed.charCodeAt(i);
    setPlaceOfDay(candidates[Math.abs(h)%candidates.length]);
    placeOfDayFixed.current=true;
  },[visiblePlaces,entries,removedIds]);

  const addToast = useCallback((message,type,onUndo)=>{
    const id=Date.now();
    setToasts(prev=>[...prev,{id,message,type,onUndo}]);
  },[]);

  const handleSave = async(placeId,data)=>{
    setSyncing(true);
    const prev_entry=entries[placeId];
    setEntries(prev=>({...prev,[placeId]:data}));
    try{ await set(ref(db,"entries/"+placeId),data); }
    catch(err){ setEntries(prev=>({...prev,[placeId]:prev_entry})); addToast(isEN?"Save failed. Check connection.":"Erro ao salvar.","error"); }
    setSyncing(false);
  };

  const handleDelete = useCallback(async(placeId,placeName)=>{
    setRemovedIds(prev=>[...prev,placeId]); setSelected(null);
    let undone=false;
    const undo=()=>{undone=true;setRemovedIds(prev=>prev.filter(x=>x!==placeId));if(removeTimers.current[placeId])clearTimeout(removeTimers.current[placeId]);};
    addToast(placeName+" "+T.removedToast,"error",undo);
    removeTimers.current[placeId]=setTimeout(async()=>{
      if(undone)return;
      setEntries(prev=>{const ne={...prev};delete ne[placeId];return ne;});
      try{await remove(ref(db,"customPlaces/"+placeId));await remove(ref(db,"entries/"+placeId));await set(ref(db,"removedIds/"+placeId),true);}
      catch{addToast(isEN?"Remove failed.":"Erro ao remover.","error");}
      setRemovedIds(prev=>prev.filter(x=>x!==placeId));
    },5000);
  },[addToast]);

  const handleEditPlace = useCallback(async(placeId,edits)=>{
    setCustomEdits(prev=>({...prev,[placeId]:edits}));
    await set(ref(db,"customEdits/"+placeId),edits);
  },[]);

  const handleToggleWant = useCallback(async(place)=>{
    const e=entries[place.id]||{};
    const newStatus=e.status==="quero"?null:"quero";
    await handleSave(place.id,{...e,status:newStatus});
  },[entries]);

  const handleSaveToCuradoria = useCallback((place)=>{
    if(!lists.length){addToast(isEN?"Create a curadoria first":"Crie uma curadoria primeiro","error");return;}
    const first=lists[0];
    const pids=Array.isArray(first.placeIds)?first.placeIds:Object.values(first.placeIds||{});
    if(!pids.includes(place.id)){
      saveLists(lists.map(l=>l.id===first.id?{...l,placeIds:[...pids,place.id]}:l));
      addToast((isEN&&place.nameEN?place.nameEN:place.name)+" → "+first.name,"success");
    }
  },[lists,addToast]);

  const saveLists = useCallback(async(newLists)=>{
    setLists(newLists);
    const obj={};newLists.forEach(l=>obj[l.id]=l);
    await set(ref(db,"lists"),obj);
  },[]);

  const getSurprise = useCallback(()=>{
    const candidates=visiblePlaces.filter(p=>{const e=entries[p.id]||{};return!e.status||e.status==="quero";});
    if(!candidates.length)return;
    const pick=candidates[Math.floor(Math.random()*candidates.length)];
    openModal(pick);
  },[visiblePlaces,entries]);

  const handleNearby = useCallback(()=>{
    if(userLat&&userLng){setShowNearby(true);return;}
    navigator.geolocation?.getCurrentPosition(pos=>{setUserLat(pos.coords.latitude);setUserLng(pos.coords.longitude);setShowNearby(true);},()=>addToast(T.gpsError,"error"));
  },[userLat,userLng,addToast]);

  // Geofencing
  useEffect(()=>{
    if(!userLat||!userLng)return;
    const nearby=visiblePlaces.find(p=>{
      if(!p.lat||!p.lng)return false;
      const e=entries[p.id]||{};
      if(e.status==="fui")return false;
      return haversineKm(userLat,userLng,p.lat,p.lng)<0.2;
    });
    setNearbyAlert(nearby||null);
  },[userLat,userLng,visiblePlaces,entries]);

  const MOODS = [
    {id:"2h",label:"⚡ 2h livres",filter:p=>["30min","1h","2h"].includes(p.time)},
    {id:"rain",label:"☔ Chovendo",filter:p=>["Museus","Observatorios","Entretenimento","Bares","Livrarias","Lojas","Dispensaries"].includes(p.category)},
    {id:"date",label:"💑 Date night",filter:p=>["Bares","Comida","Entretenimento"].includes(p.category)},
    {id:"free",label:"🆓 Sem grana",filter:p=>p.price==="gratis"},
    {id:"dog",label:"🐾 Com o dog",filter:p=>p.petFriendly},
  ];
  const activeMoodFilter = activeMood?MOODS.find(m=>m.id===activeMood):null;
  const moodFilteredPlaces = useMemo(()=>activeMoodFilter?visiblePlaces.filter(activeMoodFilter.filter):visiblePlaces,[visiblePlaces,activeMood]);

  const hasAnyFilter = activeFilter!=="todos"||activeCategory!=="Todos"||search||filterVibes.length||filterPrices.length||filterSeasons.length||filterStars>0||filterThumb||filterPet||filterBathroom||filterRegion||activeMood;
  const clearFilters = ()=>{setActiveFilter("todos");setActiveCategory("Todos");setSearch("");setSearchInput("");setFilterVibes([]);setFilterPrices([]);setFilterSeasons([]);setFilterStars(0);setFilterThumb(null);setFilterPet(false);setFilterBathroom(false);setFilterRegion(null);setActiveMood(null);};

  const filteredPlaces = useMemo(()=>moodFilteredPlaces.filter(p=>{
    const e=entries[p.id]||{};
    if(activeFilter==="quero"&&e.status!=="quero")return false;
    if(activeFilter==="fui"&&e.status!=="fui")return false;
    if(activeCategory!=="Todos"&&p.category!==activeCategory)return false;
    if(filterRegion){
      const r=REGIONS[filterRegion];
      if(!r)return false;
      if(p.lat&&p.lng){if(p.lat<r.minLat||p.lat>r.maxLat||p.lng<r.minLng||p.lng>r.maxLng)return false;}
      else return false;
    }
    if(search){
      const q=normalize(search);
      const nm=normalize(isEN&&p.nameEN?p.nameEN:p.name);
      const nm2=normalize(p.name);
      const nm3=normalize(p.nameEN||"");
      if(!nm.includes(q)&&!nm2.includes(q)&&!nm3.includes(q))return false;
    }
    if(filterVibes.length&&(!e.vibes||!filterVibes.some(v=>e.vibes.includes(v))))return false;
    if(filterPrices.length){const dp=e.price||p.price;if(!filterPrices.includes(dp))return false;}
    if(filterSeasons.length){const ds=e.season||p.season;if(!filterSeasons.includes(ds))return false;}
    if(filterStars>0&&(e.stars||0)<filterStars)return false;
    if(filterThumb&&e.thumb!==filterThumb)return false;
    if(filterPet&&!p.petFriendly)return false;
    if(filterBathroom&&!p.publicBathroom)return false;
    return true;
  }).sort((a,b)=>{
    if(sortBy==="az")return(isEN&&a.nameEN?a.nameEN:a.name).localeCompare(isEN&&b.nameEN?b.nameEN:b.name);
    if(sortBy==="cat")return a.category.localeCompare(b.category);
    return 0;
  }),[moodFilteredPlaces,search,activeCategory,activeFilter,filterVibes,filterPrices,filterSeasons,filterStars,filterThumb,filterPet,filterBathroom,filterRegion,sortBy,entries,activeMood]);

  const visitedCount = useMemo(()=>visiblePlaces.filter(p=>(entries[p.id]||{}).status==="fui").length,[visiblePlaces,entries]);
  const total = visiblePlaces.length;
  const pct = total>0?Math.round((visitedCount/total)*100):0;
  const activeFiltersCount = [activeCategory!=="Todos",activeFilter!=="todos",filterVibes.length>0,filterPrices.length>0,filterSeasons.length>0,filterStars>0,filterThumb,filterPet,filterBathroom,filterRegion].filter(Boolean).length;

  if(loading)return(
    <div style={{ minHeight:"100vh",background:"#f8f7f4",fontFamily:"'Inter',system-ui,sans-serif" }}>
      <div style={{ background:"#f8f7f4",borderBottom:"1px solid #e8e6e0",padding:"14px 16px" }}>
        <div style={{ height:12,width:100,background:"#e8e6e0",borderRadius:6,marginBottom:6 }}/>
        <div style={{ height:22,width:180,background:"#e0ddd8",borderRadius:8,marginBottom:10 }}/>
        <div style={{ height:6,background:"#e8e6e0",borderRadius:4 }}/>
      </div>
      <div style={{ maxWidth:600,margin:"0 auto",padding:"16px" }}>
        {[1,2,3,4,5,6].map(i=>(
          <div key={i} style={{ background:"#ffffff",borderRadius:14,marginBottom:10,padding:"14px",display:"flex",gap:12,opacity:1-(i*0.1),boxShadow:"0 1px 3px #00000008",border:"1px solid #e8e6e0" }}>
            <div style={{ width:50,height:50,borderRadius:10,background:"#f0eeeb",flexShrink:0 }}/>
            <div style={{ flex:1 }}>
              <div style={{ height:14,width:"60%",background:"#e8e6e0",borderRadius:6,marginBottom:8 }}/>
              <div style={{ height:10,width:"40%",background:"#f0eeeb",borderRadius:6 }}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh",background:"#f8f7f4",color:"#1a1a1a",fontFamily:"'Inter',system-ui,sans-serif",paddingBottom:80 }}>
      <div style={{ maxWidth:600,margin:"0 auto" }}>
        {/* Header */}
        <div style={{ padding:"14px 16px 10px",position:"sticky",top:0,background:"#f8f7f4",zIndex:100,borderBottom:"1px solid #e8e6e0" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
            <div onClick={()=>window.location.reload()} style={{ cursor:"pointer" }}>
              <div style={{ fontSize:10,color:"#b0aebb",letterSpacing:"0.12em",fontWeight:500 }}>{T.byGuiGab} {syncing&&<span className="pulsing" style={{ color:"#ff2d55" }}>·</span>}</div>
              <div style={{ fontSize:20,fontWeight:800,letterSpacing:"-0.02em",background:"linear-gradient(90deg,#ff2d55,#ff6b35,#ff9f0a)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1.2 }}>{T.appTitle} 🗽</div>
            </div>
            <div style={{ display:"flex",gap:6 }}>
              <button onClick={()=>setShowAIAdd(true)} style={{ background:"#ffffff",border:"1px solid #e8e6e0",borderRadius:20,padding:"8px 14px",cursor:"pointer",fontSize:12,color:"#8a8a9a",fontWeight:500,boxShadow:"0 1px 3px #00000010" }}>
                ✨ AI
              </button>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ marginBottom:tab==="explorar"?8:0 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5 }}>
              <div style={{ display:"flex",gap:10,alignItems:"center" }}>
                <span style={{ fontSize:11,color:"#30d158",fontWeight:700 }}>✓ {visitedCount} {isEN?"visited":"visitados"}</span>
                {hasAnyFilter&&filteredPlaces.length!==total&&<span style={{ fontSize:11,color:"#ff9f0a" }}>· {filteredPlaces.length} {isEN?"shown":"exibidos"}</span>}
              </div>
              <span style={{ fontSize:12,fontWeight:800,color:"#ff2d55" }}>{pct}%</span>
            </div>
            <div style={{ height:4,background:"#e8e6e0",borderRadius:4 }}>
              <div style={{ height:"100%",width:pct+"%",background:"linear-gradient(90deg,#ff2d55,#ff6b35,#ff9f0a)",borderRadius:4,transition:"width 0.6s ease" }}/>
            </div>
          </div>
          {/* Search — only in Explorar */}
          {tab==="explorar"&&<div style={{ position:"relative",marginTop:10 }}>
            <span style={{ position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"#b0aebb",fontSize:15 }}>🔍</span>
            <input value={searchInput} onChange={ev=>{setSearchInput(ev.target.value);clearTimeout(searchDebounce.current);searchDebounce.current=setTimeout(()=>setSearch(ev.target.value),200);}} placeholder={T.search} style={{ width:"100%",background:"#ffffff",border:"1.5px solid "+(searchInput?"#ff2d5550":"#e8e6e0"),borderRadius:12,padding:"10px 36px 10px 38px",color:"#1a1a1a",fontSize:14,transition:"border-color 0.2s",boxShadow:"0 1px 3px #00000008" }}/>
            {searchInput&&<button onClick={()=>{setSearchInput("");setSearch("");}} style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"#e8e6e0",border:"none",borderRadius:"50%",width:20,height:20,color:"#8a8a9a",cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center" }}>×</button>}
          </div>}
        </div>

        {/* Explorar Tab */}
        {tab==="explorar"&&<div style={{ padding:"10px 16px 140px" }}>
          {/* Quick moods */}
          <div style={{ display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none",paddingBottom:8 }}>
            {MOODS.map(m=><button key={m.id} className={"mood-chip"+(activeMood===m.id?" active":"")} onClick={()=>setActiveMood(activeMood===m.id?null:m.id)}>{m.label}</button>)}
          </div>
          {/* Category chips */}
          <div data-hscroll style={{ display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none",paddingBottom:10 }}>
            {["Todos",...CATEGORIES].map(cat=>{const meta=CAT_META[cat],active=activeCategory===cat;return<button key={cat} onClick={()=>{if(cat==="Todos"){setActiveCategory("Todos");setSortBy("default");}else{setActiveCategory(activeCategory===cat?"Todos":cat);if(activeCategory!==cat)setSortBy("az");}}} className="btn" style={{ padding:"6px 14px",borderRadius:22,background:active?(meta?meta.color:"#ff2d55")+"25":"#ffffff",border:"2px solid "+(active?(meta?meta.color:"#ff2d55")+"80":"#e8e6e0"),color:active?(meta?meta.color:"#ff2d55"):"#8a8a9a",fontSize:12,whiteSpace:"nowrap",fontWeight:active?600:400,transition:"all 0.15s" }}>{cat==="Todos"?T.all:catLabel(cat)}</button>;})}
          </div>
          {/* Filter row */}
          <div style={{ display:"flex",gap:6,alignItems:"center",marginBottom:10 }}>
            {[["todos",T.all],["quero","♥ "+T.want.replace("♥ ","")],["fui","✓ "+T.been.replace("✓ ","")]].map(([key,label])=><button key={key} onClick={()=>setActiveFilter(activeFilter===key&&key!=="todos"?"todos":key)} className="btn" style={{ padding:"7px 14px",borderRadius:20,background:activeFilter===key?key==="quero"?"#007aff":key==="fui"?"#30d158":"#ff2d55":"#ffffff",border:"1px solid "+(activeFilter===key?key==="quero"?"#007aff":key==="fui"?"#30d158":"#ff2d55":"#e8e6e0"),color:activeFilter===key?"#000":"#8a8a9a",fontSize:12,fontWeight:activeFilter===key?600:400,whiteSpace:"nowrap" }}>{label}</button>)}
            <div style={{ flex:1 }}/>
            <button onClick={()=>setShowFilters(!showFilters)} className="btn" style={{ padding:"5px 14px",borderRadius:20,background:activeFiltersCount>0?"#ff9f0a20":"#ffffff",border:"1px solid "+(activeFiltersCount>0?"#ff9f0a":"#e8e6e0"),color:activeFiltersCount>0?"#ff9f0a":"#a0a0b0",fontSize:12,whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:4 }}>{activeFiltersCount>0&&<span style={{ width:6,height:6,borderRadius:"50%",background:"#ff9f0a",display:"inline-block" }}/>}{activeFiltersCount>0?T.filters+" ("+activeFiltersCount+")":T.filters}</button>
            {hasAnyFilter&&<button onClick={clearFilters} style={{ background:"none",border:"none",color:"#a0a0b0",fontSize:11,cursor:"pointer",whiteSpace:"nowrap" }}>×{T.clearAll}</button>}
          </div>

          {/* Filter bottom sheet */}
          {showFilters&&<div style={{ position:"fixed",inset:0,background:"#000000c0",zIndex:200 }} onClick={()=>setShowFilters(false)}><div onClick={e=>e.stopPropagation()} style={{ position:"absolute",bottom:0,left:0,right:0,background:"#ffffff",borderTop:"1px solid #e8e6e0",borderRadius:"20px 20px 0 0",padding:"16px 16px 40px",maxHeight:"80vh",overflowY:"auto",maxWidth:600,margin:"0 auto" }}><div style={{ width:44,height:4,background:"#d0cdc8",borderRadius:2,margin:"0 auto 16px" }}/>
            <FilterSection label={T.filterVibe} options={VIBES} selected={filterVibes} onToggle={v=>setFilterVibes(prev=>prev.includes(v)?prev.filter(x=>x!==v):[...prev,v])} renderLabel={v=><span>{VIBE_EMOJI[v]} {VIBE_LABELS[v]}</span>}/>
            <FilterSection label={T.filterPrice} options={PRICES} selected={filterPrices} onToggle={v=>setFilterPrices(prev=>prev.includes(v)?prev.filter(x=>x!==v):[...prev,v])} renderLabel={v=><span>{PRICE_EMOJI[v]}</span>}/>
            <FilterSection label={T.filterSeason} options={SEASONS} selected={filterSeasons} onToggle={v=>setFilterSeasons(prev=>prev.includes(v)?prev.filter(x=>x!==v):[...prev,v])} renderLabel={v=><span>{SEASON_EMOJI[v]} {SEASON_LABELS[v]}</span>}/>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:8 }}>{T.filterStars}</div>
              <div style={{ display:"flex",gap:6 }}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setFilterStars(filterStars===n?0:n)} style={{ flex:1,padding:"6px",borderRadius:8,background:filterStars>=n?"#ff9f0a20":"#f8f7f4",border:"1px solid "+(filterStars>=n?"#ff9f0a":"#e8e6e0"),color:"#ff9f0a",fontSize:14,cursor:"pointer" }}>★</button>)}</div>
            </div>
            <div style={{ display:"flex",gap:8,marginBottom:14 }}>
              <button onClick={()=>setFilterPet(!filterPet)} style={{ flex:1,padding:"8px",borderRadius:10,background:filterPet?"#4ade8020":"#f8f7f4",border:"1px solid "+(filterPet?"#4ade80":"#e8e6e0"),color:filterPet?"#4ade80":"#a0a0b0",fontSize:12,cursor:"pointer" }}>🐾 {T.filterPet}</button>
              <button onClick={()=>setFilterBathroom(!filterBathroom)} style={{ flex:1,padding:"8px",borderRadius:10,background:filterBathroom?"#60a5fa20":"#f8f7f4",border:"1px solid "+(filterBathroom?"#60a5fa":"#e8e6e0"),color:filterBathroom?"#60a5fa":"#a0a0b0",fontSize:12,cursor:"pointer" }}>🚻 {T.filterBathroom}</button>
            </div>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:10,color:"#a0a0b0",letterSpacing:"0.1em",marginBottom:8 }}>{T.filterRegion}</div>
              <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>{Object.keys(REGIONS).map(r=><button key={r} onClick={()=>setFilterRegion(filterRegion===r?null:r)} style={{ padding:"6px 12px",borderRadius:20,background:filterRegion===r?"#007aff20":"#f8f7f4",border:"1px solid "+(filterRegion===r?"#007aff":"#e8e6e0"),color:filterRegion===r?"#007aff":"#8a8a9a",fontSize:11,cursor:"pointer" }}>{r}</button>)}</div>
            </div>
            <div style={{ display:"flex",gap:6,marginBottom:14 }}>
              {filterRegion&&<div style={{ padding:"6px 12px",background:"#007aff15",border:"1px solid #007aff30",borderRadius:20,fontSize:11,color:"#007aff" }}>📍 {filterRegion}</div>}
            </div>
            {activeFiltersCount>0&&<button onClick={clearFilters} style={{ width:"100%",padding:"10px",background:"none",border:"1px solid #e8e6e0",borderRadius:10,color:"#a0a0b0",fontSize:12,cursor:"pointer" }}>{T.clearFilters}</button>}
          </div></div>}

          <WeatherWidget/>
          {!search&&activeFilter==="todos"&&activeCategory==="Todos"&&!filterRegion&&<SeasonalBanner places={visiblePlaces} entries={entries} onSelect={openModal}/>}
          {placeOfDay&&!search&&activeFilter==="todos"&&activeCategory==="Todos"&&!filterRegion&&(
            <div onClick={()=>openModal(placeOfDay)} style={{ background:"linear-gradient(135deg,#fff5f7,#fff8f0)",border:"1px solid #ffccd5",borderRadius:14,padding:"14px 16px",marginBottom:10,cursor:"pointer",position:"relative",overflow:"hidden" }}>
              <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#ff2d55,#ff6b35,#ff9f0a)",borderRadius:"14px 14px 0 0" }}/>
              <div style={{ fontSize:10,color:"#ff2d55",letterSpacing:"0.15em",marginBottom:8,fontWeight:600 }}>{T.placeOfDay} 🎲</div>
              <div style={{ display:"flex",gap:12,alignItems:"center" }}>
                <div style={{ fontSize:32 }}>{placeOfDay.emoji}</div>
                <div>
                  <div style={{ fontSize:15,fontWeight:700,color:"#1a1a1a" }}>{isEN&&placeOfDay.nameEN?placeOfDay.nameEN:placeOfDay.name}</div>
                  <div style={{ fontSize:12,color:"#8a8a9a",marginTop:2 }}>{catLabel(placeOfDay.category)} · {PRICE_EMOJI[placeOfDay.price]||"?"} · {placeOfDay.time||"?"}</div>
                  {placeOfDay.bestTime&&<div style={{ fontSize:11,color:"#ff6b35",marginTop:4 }}>⏰ {placeOfDay.bestTime}</div>}
                </div>
              </div>
            </div>
          )}

          {!filteredPlaces.length&&<div style={{ textAlign:"center",padding:"60px 20px",color:"#a0a0b0" }}>
            <div style={{ fontSize:40,marginBottom:12 }}>🔍</div>
            <div style={{ fontSize:15,fontWeight:600,color:"#1a1a1a",marginBottom:8 }}>{isEN?"Nothing here":"Nada por aqui"}</div>
            <div style={{ fontSize:13,color:"#8a8a9a",marginBottom:16,lineHeight:1.5 }}>
              {activeMood?isEN?"This mood has no matches":"Esse mood nao tem resultados":search?isEN?"No places match your search":"Nenhum lugar encontrado":isEN?"Try removing some filters":"Tente remover alguns filtros"}
            </div>
            <div style={{ display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap" }}>
              {activeMood&&<button onClick={()=>setActiveMood(null)} style={{ padding:"8px 16px",background:"#ff2d5515",border:"1px solid #ff2d5540",borderRadius:20,color:"#ff2d55",fontSize:12,cursor:"pointer" }}>Limpar mood</button>}
              {search&&<button onClick={()=>{setSearch("");setSearchInput("");}} style={{ padding:"8px 16px",background:"#ff2d5515",border:"1px solid #ff2d5540",borderRadius:20,color:"#ff2d55",fontSize:12,cursor:"pointer" }}>Limpar busca</button>}
              {activeFilter!=="todos"&&<button onClick={()=>setActiveFilter("todos")} style={{ padding:"8px 16px",background:"#ff2d5515",border:"1px solid #ff2d5540",borderRadius:20,color:"#ff2d55",fontSize:12,cursor:"pointer" }}>Mostrar todos</button>}
              {activeCategory!=="Todos"&&<button onClick={()=>setActiveCategory("Todos")} style={{ padding:"8px 16px",background:"#ff2d5515",border:"1px solid #ff2d5540",borderRadius:20,color:"#ff2d55",fontSize:12,cursor:"pointer" }}>Todas categorias</button>}
            </div>
          </div>}
          {filteredPlaces.map(place=>(
            <PlaceCard key={place.id} place={place} entry={entries[place.id]} onSelect={openModal} onCheckIn={setCheckIn} isEN={isEN} entries={entries} onToggleWant={handleToggleWant} onQuickAction={setQuickAction}/>
          ))}
        </div>}

        {tab==="mapa"&&<MapTab places={filteredPlaces} entries={entries} onSelect={openModal}/>}
        {tab==="memorias"&&<MemoriasTab places={visiblePlaces} entries={entries} onSelect={openModal}/>}
        {tab==="planejar"&&<PlanejArTab events={events} onAddEvent={()=>setShowAddEvent(true)} onSaveEvent={async ev=>{await set(ref(db,"events/"+ev.id),ev);}} onDeleteEvent={async id=>{await remove(ref(db,"events/"+id));setEvents(prev=>prev.filter(e=>e.id!==id));}} onOpenPlanner={()=>setShowPlanner(true)} addToast={addToast}/>}
      </div>

      {/* Modals */}
      {selected&&<DetailModal place={selected} entry={entries[selected.id]} places={visiblePlaces} entries={entries} onClose={closeModal} onSave={async data=>{await handleSave(selected.id,data);}} onDelete={()=>handleDelete(selected.id,isEN&&selected.nameEN?selected.nameEN:selected.name)} onSelectNearby={openModal} onEditPlace={handleEditPlace} addToast={addToast} userLat={userLat} userLng={userLng}/>}
      {checkIn&&<CheckInModal place={checkIn} onClose={()=>setCheckIn(null)} onSave={async data=>{await handleSave(checkIn.id,data);}} addToast={addToast}/>}
      {showAIAdd&&<AIAddModal onClose={()=>setShowAIAdd(false)} onSavePlace={async place=>{await set(ref(db,"customPlaces/"+place.id),place);}} onSaveEvent={async ev=>{await set(ref(db,"events/"+ev.id),ev);setShowAIAdd(false);}} addToast={addToast}/>}
      {showAdd&&<AddModal onClose={()=>setShowAdd(false)} onAdd={async(place,entry)=>{await set(ref(db,"customPlaces/"+place.id),place);if(entry)await set(ref(db,"entries/"+place.id),entry);}} addToast={addToast}/>}
      {showShare&&<ShareModal places={visiblePlaces} entries={entries} onClose={()=>setShowShare(false)} addToast={addToast}/>}
      {showPlanner&&<PlannerChatModal places={visiblePlaces} entries={entries} onClose={()=>setShowPlanner(false)} addToast={addToast} userLat={userLat} userLng={userLng}/>}
      {showNearby&&userLat&&<NearbyDrawer userLat={userLat} userLng={userLng} places={visiblePlaces} entries={entries} onSelect={openModal} onClose={()=>setShowNearby(false)}/>}
      {showSurpresa&&<SurpresaModal places={visiblePlaces} entries={entries} weather={currentWeather} onClose={()=>setShowSurpresa(false)} addToast={addToast} onSaveLists={saveLists} lists={lists}/>}
      {showAddEvent&&<AddEventModal onClose={()=>setShowAddEvent(false)} onSave={async ev=>{await set(ref(db,"events/"+ev.id),ev);addToast(isEN?"Event added!":"Evento adicionado!","success");setShowAddEvent(false);}} addToast={addToast}/>}
      {quickAction&&<QuickActionSheet place={quickAction} entry={entries[quickAction.id]} onClose={()=>setQuickAction(null)} onToggleWant={handleToggleWant} onCheckIn={p=>{setCheckIn(p);setQuickAction(null);}} onSaveToCuradoria={handleSaveToCuradoria}/>}
      {nearbyAlert&&<div onClick={()=>{openModal(nearbyAlert);setNearbyAlert(null);}} style={{ position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",background:"#ffffff",border:"1px solid #30d15850",borderRadius:20,padding:"10px 16px",display:"flex",alignItems:"center",gap:10,zIndex:140,boxShadow:"0 4px 20px #00000060",maxWidth:"calc(100% - 32px)",cursor:"pointer" }}>
        <span style={{ fontSize:24 }}>{nearbyAlert.emoji}</span>
        <div><div style={{ fontSize:12,fontWeight:600,color:"#30d158" }}>{isEN?"You're nearby!":"Voce esta perto!"}</div><div style={{ fontSize:11,color:"#8a8a9a" }}>{isEN&&nearbyAlert.nameEN?nearbyAlert.nameEN:nearbyAlert.name}</div></div>
        <button onClick={e=>{e.stopPropagation();setNearbyAlert(null);}} style={{ marginLeft:"auto",background:"none",border:"none",color:"#a0a0b0",fontSize:18,cursor:"pointer" }}>×</button>
      </div>}

      {/* Toasts */}
      <div style={{ position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",zIndex:300,display:"flex",flexDirection:"column",gap:8,width:"calc(100% - 32px)",maxWidth:400 }}>
        {toasts.map(t=><Toast key={t.id} message={t.message} type={t.type} onDone={()=>setToasts(prev=>prev.filter(x=>x.id!==t.id))} onUndo={t.onUndo}/>)}
      </div>

      <BottomNav tab={tab} setTab={setTab}/>
      {/* FAB — always visible */}
      <div style={{ position:"fixed",bottom:80,right:16,display:"flex",flexDirection:"column",gap:10,zIndex:140 }}>
        <button onClick={()=>setShowSurpresa(true)} style={{ width:48,height:48,borderRadius:24,background:"#ffffff",border:"1px solid #e8e6e0",boxShadow:"0 2px 12px #00000020",fontSize:22,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }} title={isEN?"Surprise me":"Me surpreender"}>🎲</button>
        <button onClick={()=>setShowAdd(true)} style={{ width:56,height:56,borderRadius:28,background:"#ff2d55",border:"none",boxShadow:"0 4px 16px #ff2d5540",fontSize:24,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#ffffff",fontWeight:700 }}>+</button>
      </div>
    </div>
  );
}
