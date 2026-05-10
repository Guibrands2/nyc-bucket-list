import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

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
const VIBE_LABELS = { romantico: "💑 Romantico", amigos: "👯 Amigos", familia: "👨‍👩‍👧 Familia", solo: "🧘 Solo" };
const PRICE_LEVELS = ["gratis", "$", "$$", "$$$"];
const PRICE_LABELS = { gratis: "🆓 Gratis", "$": "$ Barato", "$$": "$$ Medio", "$$$": "$$$ Caro" };

const INITIAL_PLACES = [
  { id: "t001", category: "Museus", name: "NY Transit Museum", emoji: "🚇", desc: "Museu dentro de uma estacao de metro desativada em Brooklyn Heights, com vagoes vintage dos anos 1900 ate hoje.", price: "$", lat: 40.6906, lng: -73.9899 },
  { id: "t002", category: "Museus", name: "American Museum of Natural History", emoji: "🦕", desc: "O museu do Uma Noite no Museu: dinossauros, baleia azul gigante, planetario, antropologia.", price: "$$", lat: 40.7813, lng: -73.9740 },
  { id: "t003", category: "Museus", name: "MoMA", emoji: "🎨", desc: "Arte moderna e contemporanea. Van Gogh, Picasso, Dali, Warhol. Um dos melhores museus do mundo.", price: "$$", lat: 40.7614, lng: -73.9776 },
  { id: "t004", category: "Museus", name: "9/11 Memorial & Museum", emoji: "🕊️", desc: "No local exato das Torres Gemeas, com as piscinas reflexivas enormes. Depoimentos de sobreviventes e familias.", price: "$$", lat: 40.7115, lng: -74.0134 },
  { id: "t005", category: "Museus", name: "Intrepid Museum", emoji: "✈️", desc: "Porta-avioes real ancorado no Hudson River, com 30 aeronaves, o onibus espacial Enterprise e o Concorde.", price: "$$", lat: 40.7645, lng: -74.0017 },
  { id: "t006", category: "Museus", name: "Building 92 / Brooklyn Navy Yard", emoji: "⚓", desc: "Centro de visitantes gratuito com 200 anos de historia do estaleiro naval, num predio de 1857.", price: "gratis", lat: 40.6990, lng: -73.9718 },
  { id: "t007", category: "Museus", name: "Museum of Broadway", emoji: "🎭", desc: "Tres andares com figurinos e aderecos originais de Hamilton, Phantom, Rent e Wicked. Na Times Square.", price: "$$", lat: 40.7580, lng: -73.9855 },
  { id: "t008", category: "Monumentos", name: "NY Public Library", emoji: "📚", desc: "A biblioteca dos leoes, classica de filme. A sala de leitura principal e de cair o queixo. Gratis.", price: "gratis", lat: 40.7532, lng: -73.9822 },
  { id: "t009", category: "Monumentos", name: "St. Patrick's Cathedral", emoji: "⛪", desc: "Catedral neogotica no meio da 5th Ave, impressionante por dentro com os vitrais. Gratis.", price: "gratis", lat: 40.7586, lng: -73.9762 },
  { id: "t010", category: "Monumentos", name: "NYSE + Charging Bull", emoji: "🐂", desc: "Fachada neoclassica da bolsa na Wall Street e o touro de bronze iconico do FiDi.", price: "gratis", lat: 40.7069, lng: -74.0089 },
  { id: "t011", category: "Monumentos", name: "Brooklyn Heights Promenade", emoji: "🌆", desc: "Calcadao suspenso em Brooklyn Heights com vista panoramica da skyline de Manhattan.", price: "gratis", lat: 40.6962, lng: -73.9991 },
  { id: "t012", category: "Monumentos", name: "Central Park (norte e leste)", emoji: "🌳", desc: "Bethesda Fountain, The Ramble, Belvedere Castle, Reservoir e Conservatory Garden.", price: "gratis", lat: 40.7812, lng: -73.9665 },
  { id: "t013", category: "Observatorios", name: "SUMMIT One Vanderbilt", emoji: "🔮", desc: "Instalacoes de arte com espelhos e vidro, vistas deslumbrantes. Abre ate meia-noite.", price: "$$$", lat: 40.7527, lng: -73.9772 },
  { id: "t014", category: "Observatorios", name: "Top of the Rock", emoji: "🏙️", desc: "No Rockefeller Center, com a view classica com o Empire State no meio da foto.", price: "$$$", lat: 40.7593, lng: -73.9787 },
  { id: "t015", category: "Observatorios", name: "Empire State Building", emoji: "🌃", desc: "O icone absoluto de Nova York. Abre ate 11:30pm, otimo pra ir ao anoitecer.", price: "$$$", lat: 40.7484, lng: -73.9857 },
  { id: "t016", category: "Observatorios", name: "The Edge", emoji: "🫧", desc: "Terraco de vidro em Hudson Yards que parece que voce ta voando sobre a cidade.", price: "$$$", lat: 40.7534, lng: -74.0010 },
  { id: "t017", category: "Observatorios", name: "One World Observatory", emoji: "🌍", desc: "No topo do World Trade Center, o predio mais alto do hemisferio ocidental.", price: "$$$", lat: 40.7130, lng: -74.0134 },
  { id: "t018", category: "Natureza", name: "Prospect Park", emoji: "🌿", desc: "O grande parque de Brooklyn, projetado pelos mesmos criadores do Central Park.", price: "gratis", lat: 40.6602, lng: -73.9690 },
  { id: "t019", category: "Natureza", name: "Bronx Zoo", emoji: "🦁", desc: "Um dos maiores zoologicos urbanos do mundo, no Bronx. Reserve o dia inteiro.", price: "$$", lat: 40.8506, lng: -73.8770 },
  { id: "t020", category: "Natureza", name: "Coney Island", emoji: "🎡", desc: "Praia iconica com o parque Luna Park, o cachorro-quente do Nathan's Famous e o calcadao historico.", price: "$", lat: 40.5755, lng: -73.9707 },
  { id: "t021", category: "Livrarias", name: "The Strand", emoji: "📖", desc: "4 andares e 18 milhas de livros na Union Square. Uma das livrarias mais famosas dos EUA.", price: "$", lat: 40.7330, lng: -73.9910 },
  { id: "t022", category: "Livrarias", name: "The Ripped Bodice", emoji: "💘", desc: "Livraria especializada em romance em Park Slope, Brooklyn. Atmosfera aconchegante.", price: "$", lat: 40.6761, lng: -73.9810 },
  { id: "t023", category: "Lojas", name: "Nintendo NY", emoji: "🎮", desc: "No Rockefeller Plaza, com merchandise exclusivo, demos de jogos e historia da Nintendo.", price: "$", lat: 40.7582, lng: -73.9796 },
  { id: "t024", category: "Lojas", name: "Disney Store", emoji: "✨", desc: "Na area da Times Square, dois andares de tudo que e Disney, Marvel e Pixar.", price: "$", lat: 40.7574, lng: -73.9857 },
  { id: "t025", category: "Lojas", name: "Hershey's + M&M + Lego", emoji: "🍫", desc: "As tres gigantes na Times Square. Visuais, caoticas e divertidas pra uma passada rapida.", price: "$", lat: 40.7580, lng: -73.9845 },
  { id: "t026", category: "Entretenimento", name: "SPYSCAPE", emoji: "🕵️", desc: "Museu interativo de espionagem: quebra codigos, esquiva de lasers e descobre seu perfil de espiao.", price: "$$", lat: 40.7634, lng: -73.9863 },
  { id: "t027", category: "Entretenimento", name: "Show no Madison Square Garden", emoji: "🎸", desc: "O maior e mais famoso venue indoor de NY. Uma experiencia a parte independente do show.", price: "$$$", lat: 40.7505, lng: -73.9934 },
  { id: "t028", category: "Entretenimento", name: "PARAISO (Westlight Rooftop)", emoji: "🌅", desc: "Festa semanal aos domingos no rooftop do William Vale, Williamsburg.", price: "$$", lat: 40.7181, lng: -73.9566 },
  { id: "t029", category: "Entretenimento", name: "Paradise Sunset NYC", emoji: "🌇", desc: "Day party de rooftop animada.", price: "$$", lat: 40.7549, lng: -73.9840 },
  { id: "t030", category: "Entretenimento", name: "Ellen's Stardust Diner", emoji: "🎤", desc: "Restaurante dos garcons que cantam na Broadway, tematico dos anos 50.", price: "$$", lat: 40.7614, lng: -73.9848 },
  { id: "t031", category: "Entretenimento", name: "Bares Speakeasy", emoji: "🥃", desc: "Bares secretos escondidos atras de cafeterias, cabines telefonicas ou geladeiras.", price: "$$", lat: 40.7282, lng: -74.0076 },
  { id: "t032", category: "Comida", name: "Joe's Pizza", emoji: "🍕", desc: "A fatia de pizza mais classica de NY desde 1975. Original no West Village.", price: "$", lat: 40.7306, lng: -74.0022 },
  { id: "t033", category: "Compras", name: "American Dream Outlet", emoji: "🛍️", desc: "O maior outlet de NJ em East Rutherford, com parque de diversoes, pista de esqui indoor e aquario.", price: "$$", lat: 40.8135, lng: -74.0669 },
  { id: "s001", category: "Bairros", name: "Governors Island", emoji: "⛵", desc: "Ilha sem carros na baia, com arte, piquenique e vista pro Downtown.", price: "gratis", lat: 40.6895, lng: -74.0165 },
  { id: "s002", category: "Bairros", name: "Roosevelt Island", emoji: "🌉", desc: "Ilhinha no East River com tramway iconico saindo da 2nd Ave.", price: "gratis", lat: 40.7614, lng: -73.9506 },
  { id: "s003", category: "Bairros", name: "Harlem", emoji: "🎷", desc: "Berco do jazz e da cultura negra americana. Igrejas gospel, comida soul food e murais incriveis.", price: "$", lat: 40.8116, lng: -73.9465 },
  { id: "s004", category: "Bairros", name: "Astoria, Queens", emoji: "🇬🇷", desc: "Bairro grego com otimos restaurantes, museu de cinema e atmosfera europeia.", price: "$", lat: 40.7721, lng: -73.9302 },
  { id: "s005", category: "Bairros", name: "Flushing, Queens", emoji: "🥟", desc: "A melhor gastronomia asiatica fora da Asia. Chinatown gigante com dim sum e boba.", price: "$", lat: 40.7675, lng: -73.8330 },
  { id: "s006", category: "Bairros", name: "Little Italy & Chinatown", emoji: "🍝", desc: "Dois bairros historicos em Lower Manhattan. Cannoli, dumplings e muita historia.", price: "$", lat: 40.7188, lng: -73.9973 },
  { id: "s007", category: "Bairros", name: "The High Line", emoji: "🌿", desc: "Parque linear suspenso numa ferrovia desativada no West Side.", price: "gratis", lat: 40.7480, lng: -74.0048 },
  { id: "s008", category: "Bairros", name: "Greenpoint, Brooklyn", emoji: "🇵🇱", desc: "Bairro polones com cafes independentes, galerias e vista da skyline.", price: "$", lat: 40.7242, lng: -73.9480 },
  { id: "s009", category: "Bairros", name: "Red Hook, Brooklyn", emoji: "⚓", desc: "Antigo bairro industrial na beira d'agua, com galerias e cervejarias.", price: "$", lat: 40.6759, lng: -74.0109 },
  { id: "s010", category: "Bairros", name: "Jackson Heights, Queens", emoji: "🇮🇳", desc: "Bairro mais diverso do mundo. Culinaria sul-asiatica, latina e muito mais.", price: "$", lat: 40.7498, lng: -73.8831 },
  { id: "s011", category: "Museus", name: "Whitney Museum", emoji: "🎨", desc: "Arte americana contemporanea no Meatpacking District.", price: "$$", lat: 40.7396, lng: -74.0089 },
  { id: "s012", category: "Museus", name: "The Met", emoji: "🏛️", desc: "Um dos maiores museus do mundo. Egito, armaduras medievais, impressionismo.", price: "$$", lat: 40.7794, lng: -73.9632 },
  { id: "s013", category: "Museus", name: "Guggenheim", emoji: "🌀", desc: "O predio em espiral de Frank Lloyd Wright ja e arte.", price: "$$", lat: 40.7830, lng: -73.9590 },
  { id: "s014", category: "Museus", name: "Museum of the City of NY", emoji: "🗽", desc: "A historia completa de Nova York do seculo XVII ate hoje.", price: "$", lat: 40.7920, lng: -73.9519 },
  { id: "s015", category: "Museus", name: "New York Hall of Science", emoji: "🔬", desc: "Museu de ciencias interativo em Queens.", price: "$", lat: 40.7467, lng: -73.8467 },
  { id: "s016", category: "Museus", name: "Tenement Museum", emoji: "🏚️", desc: "Visita guiada a apartamentos de imigrantes preservados do seculo XIX.", price: "$$", lat: 40.7183, lng: -73.9898 },
  { id: "s017", category: "Museus", name: "Brooklyn Museum", emoji: "🖼️", desc: "Segundo maior museu de arte dos EUA, com colecao egipcia impressionante.", price: "$$", lat: 40.6712, lng: -73.9636 },
  { id: "s018", category: "Museus", name: "Frick Collection", emoji: "🎻", desc: "Mansao do seculo XIX transformada em museu com Vermeer, Rembrandt e Renoir.", price: "$$", lat: 40.7713, lng: -73.9672 },
  { id: "s019", category: "Comida", name: "Smorgasburg", emoji: "🍜", desc: "Maior mercado de comida ao ar livre dos EUA, todo sabado em Williamsburg.", price: "$", lat: 40.7223, lng: -73.9572 },
  { id: "s020", category: "Comida", name: "Chelsea Market", emoji: "🥐", desc: "Mercado gourmet coberto numa antiga fabrica de biscoitos.", price: "$$", lat: 40.7424, lng: -74.0048 },
  { id: "s021", category: "Comida", name: "Katz's Delicatessen", emoji: "🥪", desc: "O deli mais famoso de NY, desde 1888. O sanduiche de pastrami e lendario.", price: "$$", lat: 40.7223, lng: -73.9874 },
  { id: "s022", category: "Comida", name: "Di Fara Pizza", emoji: "🍕", desc: "A pizza mais famosa de Brooklyn, feita a mao pelo mesmo dono ha decadas.", price: "$", lat: 40.6249, lng: -73.9612 },
  { id: "s023", category: "Comida", name: "Russ & Daughters", emoji: "🐟", desc: "Salmao defumado, cream cheese, bagel no Lower East Side desde 1914.", price: "$$", lat: 40.7220, lng: -73.9876 },
  { id: "s024", category: "Comida", name: "Levain Bakery", emoji: "🍪", desc: "O cookie de chocolate mais famoso de NY. Enorme, cremoso e quente.", price: "$", lat: 40.7812, lng: -73.9803 },
  { id: "s025", category: "Comida", name: "Peter Luger Steak House", emoji: "🥩", desc: "A churrascaria mais famosa de NY, em Williamsburg desde 1887.", price: "$$$", lat: 40.7099, lng: -73.9625 },
  { id: "s026", category: "Natureza", name: "Staten Island Ferry", emoji: "⛴️", desc: "Balsa gratuita com vista frontal da Estatua da Liberdade.", price: "gratis", lat: 40.6437, lng: -74.0735 },
  { id: "s027", category: "Natureza", name: "Rockaway Beach", emoji: "🏄", desc: "Praia em Queens acessivel de metro. Boa pra surfe.", price: "gratis", lat: 40.5843, lng: -73.8351 },
  { id: "s028", category: "Natureza", name: "The Cloisters", emoji: "🏰", desc: "Museu de arte medieval dentro de um mosteiro reconstruido no norte de Manhattan.", price: "$$", lat: 40.8648, lng: -73.9317 },
  { id: "s029", category: "Entretenimento", name: "Ver um show na Broadway", emoji: "🎭", desc: "Um classico que nao pode faltar. A experiencia mais nova-iorquina que existe.", price: "$$$", lat: 40.7590, lng: -73.9845 },
  { id: "s030", category: "Entretenimento", name: "Comedy Cellar", emoji: "😂", desc: "O clube de stand-up mais lendario de NY no Village.", price: "$$", lat: 40.7302, lng: -74.0005 },
  { id: "s031", category: "Entretenimento", name: "Sleep No More", emoji: "🎭", desc: "Peca imersiva de teatro noir onde voce vaga por um hotel de 5 andares.", price: "$$$", lat: 40.7467, lng: -74.0014 },
  { id: "s032", category: "Entretenimento", name: "Brooklyn Mirage", emoji: "🎧", desc: "O maior venue de musica eletronica dos EUA, em Queens.", price: "$$", lat: 40.6985, lng: -73.9318 },
  { id: "s033", category: "Entretenimento", name: "Karaoke em Koreatown", emoji: "🎤", desc: "32nd St. Karaoke privativo disponivel ate de madrugada.", price: "$$", lat: 40.7484, lng: -73.9878 },
  { id: "s034", category: "Monumentos", name: "Estatua da Liberdade", emoji: "🗽", desc: "Balsa de Battery Park pra Liberty Island. Reserve com antecedencia pra subir.", price: "$$", lat: 40.6892, lng: -74.0445 },
  { id: "s035", category: "Monumentos", name: "Grand Central Terminal", emoji: "🚂", desc: "A estacao de trem mais bela do mundo, com teto estrelado.", price: "gratis", lat: 40.7527, lng: -73.9772 },
  { id: "s036", category: "Monumentos", name: "Washington Square Park", emoji: "🎨", desc: "O parque mais vivo de Manhattan, com musicos, xadrez e skatistas.", price: "gratis", lat: 40.7308, lng: -74.0002 },
  { id: "s037", category: "Monumentos", name: "Little Island", emoji: "🌺", desc: "Parque flutuante no Hudson River no Meatpacking, inaugurado em 2021.", price: "gratis", lat: 40.7438, lng: -74.0094 },
  { id: "s038", category: "Monumentos", name: "Flatiron Building", emoji: "🏢", desc: "O predio em formato de ferro de passar roupa. Recentemente reaberto apos reforma.", price: "gratis", lat: 40.7411, lng: -73.9897 },
];

const CATEGORIES = [...new Set(INITIAL_PLACES.map(p => p.category))];
const CAT_COLORS = {
  "Museus":          { accent: "#60a5fa" },
  "Monumentos":      { accent: "#a78bfa" },
  "Observatorios":   { accent: "#f472b6" },
  "Natureza":        { accent: "#34d399" },
  "Livrarias":       { accent: "#fbbf24" },
  "Lojas":           { accent: "#fb923c" },
  "Entretenimento":  { accent: "#e879f9" },
  "Compras":         { accent: "#2dd4bf" },
  "Bairros":         { accent: "#f87171" },
  "Comida":          { accent: "#facc15" },
};

function Stars({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1,2,3,4,5].map(n => (
        <span key={n} onClick={() => onChange(value === n ? 0 : n)} style={{ fontSize: 24, cursor: "pointer", color: n <= value ? "#fbbf24" : "#ffffff20", transition: "color 0.1s" }}>★</span>
      ))}
    </div>
  );
}

function MapView({ places, entries, onSelect }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current) return;
    const L = window.L;
    if (!L) return;

    const map = L.map(mapRef.current, { center: [40.7489, -73.9680], zoom: 12 });
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "OpenStreetMap"
    }).addTo(map);

    places.forEach(place => {
      if (!place.lat || !place.lng) return;
      const entry = entries[place.id] || {};
      const col = CAT_COLORS[place.category] || { accent: "#60a5fa" };
      const status = entry.status;
      const color = status === "fui" ? col.accent : status === "quero" ? "#60a5fa" : "#ffffff60";

      const icon = L.divIcon({
        html: "<div style='font-size:20px;filter:drop-shadow(0 2px 4px #000)'>" + place.emoji + "</div>",
        className: "",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      const marker = L.marker([place.lat, place.lng], { icon }).addTo(map);
      marker.on("click", () => onSelect(place));
    });
  }, [places, entries]);

  return (
    <div style={{ position: "relative" }}>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" onLoad={() => {}} />
      <div ref={mapRef} style={{ height: "calc(100vh - 200px)", width: "100%", borderRadius: 16, overflow: "hidden" }} />
    </div>
  );
}

function DetailModal({ place, entry, onClose, onSave }) {
  const e = entry || {};
  const [note, setNote] = useState(e.note || "");
  const [date, setDate] = useState(e.date || new Date().toISOString().split("T")[0]);
  const [photo, setPhoto] = useState(e.photo || null);
  const [status, setStatus] = useState(e.status || "quero");
  const [stars, setStars] = useState(e.stars || 0);
  const [thumb, setThumb] = useState(e.thumb || null);
  const [vibes, setVibes] = useState(e.vibes || []);
  const [price, setPrice] = useState(e.price || place.price || null);
  const fileRef = useRef();
  const col = CAT_COLORS[place.category] || { accent: "#60a5fa" };
  const toggleVibe = (v) => setVibes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  const handlePhoto = (ev) => {
    const file = ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e2 => setPhoto(e2.target.result);
    reader.readAsDataURL(file);
  };
  const STATUS_CONFIG = {
    quero: { label: "Quero ir", activeIcon: "♥", icon: "♡", color: "#60a5fa" },
    fui:   { label: "Ja fui!", activeIcon: "✓", icon: "○", color: "#34d399" },
    skip:  { label: "Pular",   activeIcon: "−", icon: "−", color: "#6b7280" },
  };
  const mapsUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(place.name + " New York");

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000dd", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "#0e0e1a", border: "1px solid " + col.accent + "30", borderRadius: "24px 24px 0 0", padding: "28px 24px 44px", maxWidth: 560, width: "100%", maxHeight: "92vh", overflowY: "auto" }} onClick={ev => ev.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 32, marginBottom: 6 }}>{place.emoji}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{place.name}</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
              <div style={{ fontSize: 12, color: col.accent, letterSpacing: "0.12em" }}>{place.category.toUpperCase()}</div>
              {price && <div style={{ fontSize: 12, color: "#ffffff50", background: "#ffffff10", borderRadius: 10, padding: "2px 8px" }}>{PRICE_LABELS[price]}</div>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <a href={mapsUrl} target="_blank" rel="noreferrer" style={{ background: "#34d39920", border: "1px solid #34d39950", borderRadius: 20, width: 36, height: 36, color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 16 }}>📍</a>
            <button onClick={onClose} style={{ background: "#ffffff10", border: "none", borderRadius: 20, width: 36, height: 36, color: "#fff", cursor: "pointer", fontSize: 18 }}>x</button>
          </div>
        </div>
        <div style={{ fontSize: 14, color: "#ffffff80", lineHeight: 1.6, marginBottom: 24 }}>{place.desc}</div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 10 }}>STATUS</div>
          <div style={{ display: "flex", gap: 8 }}>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <button key={key} onClick={() => setStatus(key)} style={{ flex: 1, padding: "10px 4px", borderRadius: 12, background: status === key ? cfg.color + "25" : "#ffffff08", border: "1px solid " + (status === key ? cfg.color : "#ffffff15"), color: status === key ? cfg.color : "#ffffff50", fontSize: 12, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                {status === key ? cfg.activeIcon : cfg.icon}<br /><span style={{ fontSize: 11 }}>{cfg.label}</span>
              </button>
            ))}
          </div>
        </div>
        {status === "fui" && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 8 }}>QUANDO FORAM?</div>
            <input type="date" value={date} onChange={ev => setDate(ev.target.value)} style={{ width: "100%", background: "#ffffff08", border: "1px solid #ffffff20", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>
        )}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 10 }}>PRECO</div>
          <div style={{ display: "flex", gap: 6 }}>
            {PRICE_LEVELS.map(p => (
              <button key={p} onClick={() => setPrice(price === p ? null : p)} style={{ flex: 1, padding: "8px 4px", borderRadius: 12, background: price === p ? "#ffffff20" : "#ffffff08", border: "1px solid " + (price === p ? "#ffffff60" : "#ffffff15"), color: price === p ? "#fff" : "#ffffff50", fontSize: 11, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                {PRICE_LABELS[p]}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 10 }}>VIBE</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {VIBES.map(v => (
              <button key={v} onClick={() => toggleVibe(v)} style={{ padding: "7px 14px", borderRadius: 20, background: vibes.includes(v) ? "#ffffff20" : "#ffffff08", border: "1px solid " + (vibes.includes(v) ? "#ffffff60" : "#ffffff15"), color: vibes.includes(v) ? "#fff" : "#ffffff50", fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                {VIBE_LABELS[v]}
              </button>
            ))}
          </div>
        </div>
        {status === "fui" && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 10 }}>NOTA</div>
            <Stars value={stars} onChange={setStars} />
            <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
              <button onClick={() => setThumb(thumb === "up" ? null : "up")} style={{ flex: 1, padding: "12px", borderRadius: 12, background: thumb === "up" ? "#34d39930" : "#ffffff08", border: "1px solid " + (thumb === "up" ? "#34d399" : "#ffffff15"), color: thumb === "up" ? "#34d399" : "#ffffff50", fontSize: 20, cursor: "pointer" }}>👍</button>
              <button onClick={() => setThumb(thumb === "down" ? null : "down")} style={{ flex: 1, padding: "12px", borderRadius: 12, background: thumb === "down" ? "#f4727230" : "#ffffff08", border: "1px solid " + (thumb === "down" ? "#f47272" : "#ffffff15"), color: thumb === "down" ? "#f47272" : "#ffffff50", fontSize: 20, cursor: "pointer" }}>👎</button>
            </div>
          </div>
        )}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 8 }}>{status === "fui" ? "COMO FOI?" : "OBSERVACOES"}</div>
          <textarea value={note} onChange={ev => setNote(ev.target.value)} placeholder={status === "fui" ? "Amamos demais! A fila valeu..." : "Lembrete, dica, horario..."} rows={3} style={{ width: "100%", background: "#ffffff08", border: "1px solid #ffffff20", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14, fontFamily: "inherit", resize: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 8 }}>FOTO</div>
          {photo ? (
            <div style={{ position: "relative" }}>
              <img src={photo} alt="" style={{ width: "100%", borderRadius: 12, maxHeight: 220, objectFit: "cover" }} />
              <button onClick={() => setPhoto(null)} style={{ position: "absolute", top: 8, right: 8, background: "#000000cc", border: "none", borderRadius: 20, width: 32, height: 32, color: "#fff", cursor: "pointer", fontSize: 16 }}>x</button>
            </div>
          ) : (
            <button onClick={() => fileRef.current.click()} style={{ width: "100%", padding: "20px", background: "#ffffff05", border: "1px dashed #ffffff25", borderRadius: 12, color: "#ffffff50", cursor: "pointer", fontFamily: "inherit", fontSize: 14 }}>Adicionar foto</button>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
        </div>
        <button onClick={() => onSave({ status, note, date, photo, stars, thumb, vibes, price })} style={{ width: "100%", padding: "16px", background: col.accent, border: "none", borderRadius: 14, color: "#000", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Salvar</button>
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
  const handle = () => {
    if (!name.trim()) return;
    onAdd({ id: "u" + Date.now(), name: name.trim(), desc: desc.trim(), emoji, category, price, custom: true });
    onClose();
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000dd", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "#0e0e1a", border: "1px solid #ffffff20", borderRadius: "24px 24px 0 0", padding: "28px 24px 44px", maxWidth: 560, width: "100%", maxHeight: "80vh", overflowY: "auto" }} onClick={ev => ev.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.08em", color: "#fff" }}>NOVO LUGAR</div>
          <button onClick={onClose} style={{ background: "#ffffff10", border: "none", borderRadius: 20, width: 36, height: 36, color: "#fff", cursor: "pointer", fontSize: 18 }}>x</button>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 8 }}>EMOJI</div>
          <input value={emoji} onChange={ev => setEmoji(ev.target.value)} maxLength={2} style={{ width: 60, background: "#ffffff08", border: "1px solid #ffffff20", borderRadius: 10, padding: "10px", color: "#fff", fontSize: 22, textAlign: "center", fontFamily: "inherit" }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 8 }}>NOME</div>
          <input value={name} onChange={ev => setName(ev.target.value)} placeholder="Ex: Yankee Stadium" style={{ width: "100%", background: "#ffffff08", border: "1px solid #ffffff20", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 8 }}>CATEGORIA</div>
          <select value={category} onChange={ev => setCategory(ev.target.value)} style={{ width: "100%", background: "#0e0e1a", border: "1px solid #ffffff20", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14, fontFamily: "inherit" }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 8 }}>PRECO</div>
          <div style={{ display: "flex", gap: 6 }}>
            {PRICE_LEVELS.map(p => (
              <button key={p} onClick={() => setPrice(p)} style={{ flex: 1, padding: "8px 4px", borderRadius: 12, background: price === p ? "#ffffff20" : "#ffffff08", border: "1px solid " + (price === p ? "#ffffff60" : "#ffffff15"), color: price === p ? "#fff" : "#ffffff50", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
                {PRICE_LABELS[p]}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 8 }}>DESCRICAO</div>
          <textarea value={desc} onChange={ev => setDesc(ev.target.value)} placeholder="Uma linha sobre o que e..." rows={2} style={{ width: "100%", background: "#ffffff08", border: "1px solid #ffffff20", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14, fontFamily: "inherit", resize: "none", boxSizing: "border-box" }} />
        </div>
        <button onClick={handle} style={{ width: "100%", padding: "16px", background: "#60a5fa", border: "none", borderRadius: 14, color: "#000", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Adicionar a lista</button>
      </div>
    </div>
  );
}

function ShareModal({ places, entries, onClose }) {
  const recommended = places.filter(p => {
    const e = entries[p.id] || {};
    return e.thumb === "up" || (e.stars && e.stars >= 4);
  });
  const url = window.location.href;
  const text = "Nossos lugares favoritos em NYC:\n\n" + recommended.map(p => p.emoji + " " + p.name).join("\n") + "\n\n" + url;
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000dd", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "#0e0e1a", border: "1px solid #ffffff20", borderRadius: "24px 24px 0 0", padding: "28px 24px 44px", maxWidth: 560, width: "100%", maxHeight: "80vh", overflowY: "auto" }} onClick={ev => ev.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>COMPARTILHAR</div>
          <button onClick={onClose} style={{ background: "#ffffff10", border: "none", borderRadius: 20, width: 36, height: 36, color: "#fff", cursor: "pointer", fontSize: 18 }}>x</button>
        </div>
        <div style={{ fontSize: 13, color: "#ffffff50", marginBottom: 16 }}>{recommended.length} lugares com 👍 ou 4+ estrelas</div>
        {recommended.length === 0 ? (
          <div style={{ color: "#ffffff30", fontSize: 14, textAlign: "center", padding: "20px 0" }}>Ainda nao ha lugares recomendados. Avalie alguns lugares primeiro!</div>
        ) : (
          <>
            <div style={{ background: "#ffffff08", borderRadius: 12, padding: "16px", marginBottom: 20, maxHeight: 200, overflowY: "auto" }}>
              {recommended.map(p => {
                const e = entries[p.id] || {};
                return (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #ffffff08" }}>
                    <span style={{ fontSize: 20 }}>{p.emoji}</span>
                    <div>
                      <div style={{ fontSize: 13, color: "#fff" }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "#ffffff40" }}>
                        {e.stars > 0 && "★".repeat(e.stars)} {e.thumb === "up" ? "👍" : ""}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => { navigator.clipboard.writeText(text); }} style={{ width: "100%", padding: "14px", background: "#60a5fa", border: "none", borderRadius: 14, color: "#000", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginBottom: 10 }}>
              Copiar lista pra WhatsApp
            </button>
            <button onClick={() => { navigator.clipboard.writeText(url); }} style={{ width: "100%", padding: "14px", background: "#ffffff15", border: "1px solid #ffffff20", borderRadius: 14, color: "#fff", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
              Copiar link do app
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [places, setPlaces] = useState(INITIAL_PLACES);
  const [entries, setEntries] = useState({});
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
  const [showStats, setShowStats] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [placeOfDay, setPlaceOfDay] = useState(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => setLeafletLoaded(true);
    document.head.appendChild(script);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
  }, []);

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
    if (places.length === 0) return;
    const candidates = places.filter(p => {
      const e = entries[p.id];
      return !e || !e.status || e.status === "quero";
    });
    if (candidates.length > 0) {
      const seed = new Date().toDateString();
      let hash = 0;
      for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      const idx = Math.abs(hash) % candidates.length;
      setPlaceOfDay(candidates[idx]);
    }
  }, [places, entries]);

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

  const activeFiltersCount = [filterVibe, filterPrice, filterStars > 0, filterThumb].filter(Boolean).length;

  const filteredPlaces = places.filter(p => {
    const entry = entries[p.id] || {};
    const status = entry.status;
    const searchLower = search.toLowerCase();
    const searchOk = !search || p.name.toLowerCase().includes(searchLower) || p.desc.toLowerCase().includes(searchLower) || p.category.toLowerCase().includes(searchLower);
    const catOk = activeCategory === "Todos" || p.category === activeCategory;
    const statusOk = activeFilter === "todos" ? true : activeFilter === "quero" ? status === "quero" || !status : activeFilter === "fui" ? status === "fui" : activeFilter === "skip" ? status === "skip" : true;
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

  const stats = {
    total: places.length,
    fui: Object.values(entries).filter(e => e.status === "fui").length,
    quero: places.filter(p => entries[p.id] && entries[p.id].status === "quero").length,
    noStatus: places.filter(p => !entries[p.id] || !entries[p.id].status).length,
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#080810", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: "#ffffff40" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🗽</div>
        <div style={{ fontSize: 13, letterSpacing: "0.15em" }}>CARREGANDO...</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#080810", color: "#fff", fontFamily: "Georgia, Times New Roman, serif", paddingBottom: 100 }}>
      <div style={{ background: "#080810", borderBottom: "1px solid #ffffff10", position: "sticky", top: 0, zIndex: 100, padding: "16px 16px 0" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase", margin: 0, color: "#fff" }}>NYC 🗽</h1>
              <div style={{ fontSize: 11, color: "#ffffff35", letterSpacing: "0.12em", marginTop: 2 }}>GUI & GABRIEL {syncing ? "· SALVANDO..." : "· AO VIVO"}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowShare(true)} style={{ background: "none", border: "1px solid #ffffff20", borderRadius: 20, padding: "6px 12px", color: "#ffffff80", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>↗ Share</button>
              <button onClick={() => setShowStats(!showStats)} style={{ background: "none", border: "1px solid #ffffff20", borderRadius: 20, padding: "6px 12px", color: "#ffffff80", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{stats.fui}/{stats.total}</button>
            </div>
          </div>

          <div style={{ position: "relative", marginBottom: 10 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#ffffff40", fontSize: 14 }}>🔍</span>
            <input value={search} onChange={ev => setSearch(ev.target.value)} placeholder="Buscar por nome, categoria, descricao..." style={{ width: "100%", background: "#ffffff08", border: "1px solid #ffffff15", borderRadius: 20, padding: "10px 16px 10px 36px", color: "#fff", fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} />
            {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#ffffff50", cursor: "pointer", fontSize: 16 }}>x</button>}
          </div>

          {showStats && (
            <div style={{ display: "flex", gap: 12, padding: "12px 0", borderTop: "1px solid #ffffff10" }}>
              {[{ label: "Ja fui", val: stats.fui, color: "#34d399" }, { label: "Quero ir", val: stats.quero, color: "#60a5fa" }, { label: "A decidir", val: stats.noStatus, color: "#ffffff30" }].map(s => (
                <div key={s.label} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: "#ffffff40", letterSpacing: "0.1em" }}>{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ height: 2, background: "#ffffff08", marginBottom: 10 }}>
            <div style={{ height: "100%", width: ((stats.fui / stats.total) * 100) + "%", background: "linear-gradient(90deg, #34d399, #60a5fa)", transition: "width 0.5s" }} />
          </div>

          <div style={{ display: "flex", gap: 6, marginBottom: 8, overflowX: "auto", scrollbarWidth: "none" }}>
            <button onClick={() => setViewMode(viewMode === "list" ? "map" : "list")} style={{ background: viewMode === "map" ? "#34d39920" : "none", border: "1px solid " + (viewMode === "map" ? "#34d399" : "#ffffff15"), borderRadius: 20, padding: "5px 12px", color: viewMode === "map" ? "#34d399" : "#ffffff50", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>
              {viewMode === "map" ? "Lista" : "Mapa"}
            </button>
            {[["todos", "Todos"], ["quero", "♥ Quero"], ["fui", "✓ Fui"], ["skip", "− Skip"]].map(([key, label]) => (
              <button key={key} onClick={() => setActiveFilter(key)} style={{ background: activeFilter === key ? "#ffffff15" : "none", border: "1px solid " + (activeFilter === key ? "#ffffff40" : "#ffffff15"), borderRadius: 20, padding: "5px 12px", color: activeFilter === key ? "#fff" : "#ffffff50", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>{label}</button>
            ))}
            <button onClick={() => setShowFilters(!showFilters)} style={{ background: activeFiltersCount > 0 ? "#e879f920" : "none", border: "1px solid " + (activeFiltersCount > 0 ? "#e879f9" : "#ffffff15"), borderRadius: 20, padding: "5px 12px", color: activeFiltersCount > 0 ? "#e879f9" : "#ffffff50", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>
              {activeFiltersCount > 0 ? "Filtros (" + activeFiltersCount + ")" : "Filtros"}
            </button>
            <select value={sortBy} onChange={ev => setSortBy(ev.target.value)} style={{ background: "#ffffff08", border: "1px solid #ffffff15", borderRadius: 20, padding: "5px 12px", color: "#ffffff80", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
              <option value="default">Ordem padrao</option>
              <option value="stars">Maior nota</option>
              <option value="pending">Pendentes primeiro</option>
              <option value="date">Data de visita</option>
              <option value="category">Categoria</option>
            </select>
          </div>

          {showFilters && (
            <div style={{ background: "#0e0e1a", border: "1px solid #ffffff15", borderRadius: 16, padding: "16px", marginBottom: 10 }}>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 8 }}>VIBE</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {VIBES.map(v => (
                    <button key={v} onClick={() => setFilterVibe(filterVibe === v ? null : v)} style={{ padding: "5px 12px", borderRadius: 20, background: filterVibe === v ? "#ffffff20" : "#ffffff08", border: "1px solid " + (filterVibe === v ? "#ffffff60" : "#ffffff15"), color: filterVibe === v ? "#fff" : "#ffffff50", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{VIBE_LABELS[v]}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 8 }}>PRECO</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {PRICE_LEVELS.map(p => (
                    <button key={p} onClick={() => setFilterPrice(filterPrice === p ? null : p)} style={{ flex: 1, padding: "5px 4px", borderRadius: 12, background: filterPrice === p ? "#ffffff20" : "#ffffff08", border: "1px solid " + (filterPrice === p ? "#ffffff60" : "#ffffff15"), color: filterPrice === p ? "#fff" : "#ffffff50", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>{PRICE_LABELS[p]}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 8 }}>NOTA MINIMA</div>
                <div style={{ display: "flex", gap: 4 }}>
                  {[1,2,3,4,5].map(n => (
                    <span key={n} onClick={() => setFilterStars(filterStars === n ? 0 : n)} style={{ fontSize: 22, cursor: "pointer", color: n <= filterStars ? "#fbbf24" : "#ffffff20" }}>★</span>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 8 }}>POLEGAR</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {[["up", "👍 Recomendados"], ["down", "👎 Nao recomendados"]].map(([key, label]) => (
                    <button key={key} onClick={() => setFilterThumb(filterThumb === key ? null : key)} style={{ flex: 1, padding: "8px", borderRadius: 12, background: filterThumb === key ? "#ffffff20" : "#ffffff08", border: "1px solid " + (filterThumb === key ? "#ffffff60" : "#ffffff15"), color: filterThumb === key ? "#fff" : "#ffffff50", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{label}</button>
                  ))}
                </div>
              </div>
              {activeFiltersCount > 0 && (
                <button onClick={() => { setFilterVibe(null); setFilterPrice(null); setFilterStars(0); setFilterThumb(null); }} style={{ marginTop: 10, width: "100%", padding: "8px", background: "none", border: "1px solid #ffffff20", borderRadius: 10, color: "#ffffff50", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Limpar filtros</button>
              )}
            </div>
          )}

          <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 12 }}>
            {["Todos", ...CATEGORIES].map(cat => {
              const col = CAT_COLORS[cat];
              return (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{ background: activeCategory === cat ? ((col ? col.accent : "#fff") + "20") : "none", border: "1px solid " + (activeCategory === cat ? ((col ? col.accent : "#fff") + "60") : "#ffffff12"), borderRadius: 20, padding: "5px 12px", color: activeCategory === cat ? (col ? col.accent : "#fff") : "#ffffff40", fontSize: 11, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>{cat.toUpperCase()}</button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "12px 16px" }}>
        {viewMode === "map" ? (
          leafletLoaded ? <MapView places={filteredPlaces} entries={entries} onSelect={setSelected} /> : (
            <div style={{ textAlign: "center", color: "#ffffff40", padding: "60px 0" }}>Carregando mapa...</div>
          )
        ) : (
          <>
            {placeOfDay && !search && activeFilter === "todos" && activeCategory === "Todos" && (
              <div onClick={() => setSelected(placeOfDay)} style={{ background: "linear-gradient(135deg, #1a0a2e, #0a1a0e)", border: "1px solid #ffffff20", borderRadius: 16, padding: "16px", marginBottom: 16, cursor: "pointer" }}>
                <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.15em", marginBottom: 10 }}>LUGAR DO DIA 🎲</div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ fontSize: 32 }}>{placeOfDay.emoji}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{placeOfDay.name}</div>
                    <div style={{ fontSize: 12, color: "#ffffff50", marginTop: 2 }}>{placeOfDay.category} {placeOfDay.price && "· " + PRICE_LABELS[placeOfDay.price]}</div>
                  </div>
                </div>
              </div>
            )}

            {filteredPlaces.length === 0 && (
              <div style={{ textAlign: "center", color: "#ffffff25", padding: "60px 0", fontSize: 14 }}>Nenhum lugar com esses filtros</div>
            )}
            {filteredPlaces.map(place => {
              const entry = entries[place.id] || {};
              const status = entry.status;
              const col = CAT_COLORS[place.category] || { accent: "#60a5fa" };
              const displayPrice = entry.price || place.price;
              return (
                <div key={place.id} onClick={() => setSelected(place)} style={{ background: status === "fui" ? "#0a1a12" : status === "quero" ? "#0a0f1a" : "#0c0c18", border: "1px solid " + (status === "fui" ? col.accent + "35" : "#ffffff0a"), borderLeft: "3px solid " + (status === "fui" ? col.accent : "#ffffff08"), borderRadius: 14, marginBottom: 10, padding: "14px 16px", cursor: "pointer", opacity: status === "skip" ? 0.3 : 1, transition: "all 0.15s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ fontSize: 24, flexShrink: 0 }}>{place.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#ffffffcc" }}>{place.name}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                          {entry.thumb === "up" && <span style={{ fontSize: 13 }}>👍</span>}
                          {entry.thumb === "down" && <span style={{ fontSize: 13 }}>👎</span>}
                          {entry.stars > 0 && <span style={{ fontSize: 11, color: "#fbbf24" }}>{"★".repeat(entry.stars)}</span>}
                          {entry.photo && <span style={{ fontSize: 12 }}>📷</span>}
                          <span style={{ fontSize: 16, color: status === "fui" ? col.accent : status === "quero" ? "#60a5fa" : "#ffffff20" }}>
                            {status === "fui" ? "✓" : status === "quero" ? "♥" : status === "skip" ? "−" : "○"}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 2 }}>
                        <div style={{ fontSize: 11, color: col.accent + "80", letterSpacing: "0.1em" }}>{place.category.toUpperCase()}</div>
                        {displayPrice && <span style={{ fontSize: 10, color: "#ffffff30" }}>· {PRICE_LABELS[displayPrice]}</span>}
                      </div>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
                        {entry.vibes && entry.vibes.map(v => (
                          <span key={v} style={{ fontSize: 10, color: "#ffffff40", background: "#ffffff08", borderRadius: 10, padding: "2px 8px" }}>{VIBE_LABELS[v]}</span>
                        ))}
                      </div>
                      {entry.note && <div style={{ fontSize: 12, color: "#ffffff40", marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{entry.note}</div>}
                      {status === "fui" && entry.date && <div style={{ fontSize: 11, color: "#ffffff30", marginTop: 2 }}>Visitado em {entry.date}</div>}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      <button onClick={() => setShowAdd(true)} style={{ position: "fixed", bottom: 28, right: 20, width: 56, height: 56, background: "linear-gradient(135deg, #60a5fa, #a78bfa)", border: "none", borderRadius: "50%", color: "#000", fontSize: 26, cursor: "pointer", boxShadow: "0 4px 24px #60a5fa40", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>+</button>

      {selected && <DetailModal place={selected} entry={entries[selected.id]} onClose={() => setSelected(null)} onSave={(data) => handleSave(selected.id, data)} />}
      {showAdd && <AddModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
      {showShare && <ShareModal places={places} entries={entries} onClose={() => setShowShare(false)} />}
    </div>
  );
}
