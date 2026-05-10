import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, get } from "firebase/database";

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

const INITIAL_PLACES = [
  { id: "t001", category: "Museus", name: "NY Transit Museum", emoji: "🚇", desc: "Museu dentro de uma estacao de metro desativada em Brooklyn Heights, com vagoes vintage dos anos 1900 ate hoje." },
  { id: "t002", category: "Museus", name: "American Museum of Natural History", emoji: "🦕", desc: "O museu do Uma Noite no Museu: dinossauros, baleia azul gigante, planetario, antropologia." },
  { id: "t003", category: "Museus", name: "MoMA", emoji: "🎨", desc: "Arte moderna e contemporanea. Van Gogh, Picasso, Dali, Warhol. Um dos melhores museus do mundo." },
  { id: "t004", category: "Museus", name: "9/11 Memorial & Museum", emoji: "🕊️", desc: "No local exato das Torres Gemeas, com as piscinas reflexivas enormes. Depoimentos de sobreviventes e familias." },
  { id: "t005", category: "Museus", name: "Intrepid Museum", emoji: "✈️", desc: "Porta-avioes real ancorado no Hudson River, com 30 aeronaves, o onibus espacial Enterprise e o Concorde." },
  { id: "t006", category: "Museus", name: "Building 92 / Brooklyn Navy Yard", emoji: "⚓", desc: "Centro de visitantes gratuito com 200 anos de historia do estaleiro naval, num predio de 1857." },
  { id: "t007", category: "Museus", name: "Museum of Broadway", emoji: "🎭", desc: "Tres andares com figurinos e aderecos originais de Hamilton, Phantom, Rent e Wicked. Na Times Square." },
  { id: "t008", category: "Monumentos", name: "NY Public Library", emoji: "📚", desc: "A biblioteca dos leoes, classica de filme. A sala de leitura principal e de cair o queixo. Gratis." },
  { id: "t009", category: "Monumentos", name: "St. Patrick's Cathedral", emoji: "⛪", desc: "Catedral neogotica no meio da 5th Ave, impressionante por dentro com os vitrais. Gratis." },
  { id: "t010", category: "Monumentos", name: "NYSE + Charging Bull", emoji: "🐂", desc: "Fachada neoclassica da bolsa na Wall Street e o touro de bronze iconico do FiDi." },
  { id: "t011", category: "Monumentos", name: "Brooklyn Heights Promenade", emoji: "🌆", desc: "Calcadao suspenso em Brooklyn Heights com vista panoramica da skyline de Manhattan." },
  { id: "t012", category: "Monumentos", name: "Central Park (norte e leste)", emoji: "🌳", desc: "Bethesda Fountain, The Ramble, Belvedere Castle, Reservoir e Conservatory Garden." },
  { id: "t013", category: "Observatorios", name: "SUMMIT One Vanderbilt", emoji: "🔮", desc: "Instalacoes de arte com espelhos e vidro, vistas deslumbrantes. Abre ate meia-noite." },
  { id: "t014", category: "Observatorios", name: "Top of the Rock", emoji: "🏙️", desc: "No Rockefeller Center, com a view classica com o Empire State no meio da foto." },
  { id: "t015", category: "Observatorios", name: "Empire State Building", emoji: "🌃", desc: "O icone absoluto de Nova York. Abre ate 11:30pm, otimo pra ir ao anoitecer." },
  { id: "t016", category: "Observatorios", name: "The Edge", emoji: "🫧", desc: "Terraco de vidro em Hudson Yards que parece que voce ta voando sobre a cidade." },
  { id: "t017", category: "Observatorios", name: "One World Observatory", emoji: "🌍", desc: "No topo do World Trade Center, o predio mais alto do hemisferio ocidental." },
  { id: "t018", category: "Natureza", name: "Prospect Park", emoji: "🌿", desc: "O grande parque de Brooklyn, projetado pelos mesmos criadores do Central Park." },
  { id: "t019", category: "Natureza", name: "Bronx Zoo", emoji: "🦁", desc: "Um dos maiores zoologicos urbanos do mundo, no Bronx. Reserve o dia inteiro." },
  { id: "t020", category: "Natureza", name: "Coney Island", emoji: "🎡", desc: "Praia iconica com o parque Luna Park, o cachorro-quente do Nathan's Famous e o calcadao historico." },
  { id: "t021", category: "Livrarias", name: "The Strand", emoji: "📖", desc: "4 andares e 18 milhas de livros na Union Square. Uma das livrarias mais famosas dos EUA." },
  { id: "t022", category: "Livrarias", name: "The Ripped Bodice", emoji: "💘", desc: "Livraria especializada em romance em Park Slope, Brooklyn. Atmosfera aconchegante." },
  { id: "t023", category: "Lojas", name: "Nintendo NY", emoji: "🎮", desc: "No Rockefeller Plaza, com merchandise exclusivo, demos de jogos e historia da Nintendo." },
  { id: "t024", category: "Lojas", name: "Disney Store", emoji: "✨", desc: "Na area da Times Square, dois andares de tudo que e Disney, Marvel e Pixar." },
  { id: "t025", category: "Lojas", name: "Hershey's + M&M + Lego", emoji: "🍫", desc: "As tres gigantes na Times Square. Visuais, caoticas e divertidas pra uma passada rapida." },
  { id: "t026", category: "Entretenimento", name: "SPYSCAPE", emoji: "🕵️", desc: "Museu interativo de espionagem: quebra codigos, esquiva de lasers e descobre seu perfil de espiao." },
  { id: "t027", category: "Entretenimento", name: "Show no Madison Square Garden", emoji: "🎸", desc: "O maior e mais famoso venue indoor de NY. Uma experiencia a parte independente do show." },
  { id: "t028", category: "Entretenimento", name: "PARAISO (Westlight Rooftop)", emoji: "🌅", desc: "Festa semanal aos domingos no rooftop do William Vale, Williamsburg." },
  { id: "t029", category: "Entretenimento", name: "Paradise Sunset NYC", emoji: "🌇", desc: "Day party de rooftop animada. Proxima edicao em 19 de junho (Juneteenth)." },
  { id: "t030", category: "Entretenimento", name: "Ellen's Stardust Diner", emoji: "🎤", desc: "Restaurante dos garcons que cantam na Broadway, tematico dos anos 50." },
  { id: "t031", category: "Entretenimento", name: "Bares Speakeasy", emoji: "🥃", desc: "Bares secretos escondidos atras de cafeterias, cabines telefonicas ou geladeiras." },
  { id: "t032", category: "Comida", name: "Joe's Pizza", emoji: "🍕", desc: "A fatia de pizza mais classica de NY desde 1975. Original no West Village." },
  { id: "t033", category: "Compras", name: "American Dream Outlet", emoji: "🛍️", desc: "O maior outlet de NJ em East Rutherford, com parque de diversoes, pista de esqui indoor e aquario." },
  { id: "s001", category: "Bairros", name: "Governors Island", emoji: "⛵", desc: "Ilha sem carros na baia, com arte, piquenique e vista pro Downtown. So acessivel de balsa." },
  { id: "s002", category: "Bairros", name: "Roosevelt Island", emoji: "🌉", desc: "Ilhinha no East River com tramway iconico saindo da 2nd Ave. Silenciosa e pitoresca." },
  { id: "s003", category: "Bairros", name: "Harlem", emoji: "🎷", desc: "Berco do jazz e da cultura negra americana. Igrejas gospel, comida soul food e murais incriveis." },
  { id: "s004", category: "Bairros", name: "Astoria, Queens", emoji: "🇬🇷", desc: "Bairro grego com otimos restaurantes, museu de cinema e atmosfera europeia." },
  { id: "s005", category: "Bairros", name: "Flushing, Queens", emoji: "🥟", desc: "A melhor gastronomia asiatica fora da Asia. Chinatown gigante com dim sum, hot pot e boba." },
  { id: "s006", category: "Bairros", name: "Little Italy & Chinatown", emoji: "🍝", desc: "Dois bairros historicos em Lower Manhattan. Cannoli, dumplings e muita historia." },
  { id: "s007", category: "Bairros", name: "The High Line", emoji: "🌿", desc: "Parque linear suspenso numa ferrovia desativada no West Side. Arte, jardins e vista pro Hudson." },
  { id: "s008", category: "Bairros", name: "Greenpoint, Brooklyn", emoji: "🇵🇱", desc: "Bairro polones com cafes independentes, galerias e vista da skyline." },
  { id: "s009", category: "Bairros", name: "Red Hook, Brooklyn", emoji: "⚓", desc: "Antigo bairro industrial na beira d'agua, com galerias, cervejarias e vista pra Estatua da Liberdade." },
  { id: "s010", category: "Bairros", name: "Jackson Heights, Queens", emoji: "🇮🇳", desc: "Bairro mais diverso do mundo. Culinaria sul-asiatica, latina e muito mais." },
  { id: "s011", category: "Museus", name: "Whitney Museum", emoji: "🎨", desc: "Arte americana contemporanea no Meatpacking District, com terraco de dar inveja." },
  { id: "s012", category: "Museus", name: "The Met", emoji: "🏛️", desc: "Um dos maiores museus do mundo. Egito, armaduras medievais, impressionismo." },
  { id: "s013", category: "Museus", name: "Guggenheim", emoji: "🌀", desc: "O predio em espiral de Frank Lloyd Wright ja e arte. Por dentro, colecao de arte moderna." },
  { id: "s014", category: "Museus", name: "Museum of the City of NY", emoji: "🗽", desc: "A historia completa de Nova York do seculo XVII ate hoje." },
  { id: "s015", category: "Museus", name: "New York Hall of Science", emoji: "🔬", desc: "Museu de ciencias interativo em Queens, com playground cientifico ao ar livre." },
  { id: "s016", category: "Museus", name: "Tenement Museum", emoji: "🏚️", desc: "Visita guiada a apartamentos de imigrantes preservados do seculo XIX no Lower East Side." },
  { id: "s017", category: "Museus", name: "Brooklyn Museum", emoji: "🖼️", desc: "Segundo maior museu de arte dos EUA, com colecao egipcia impressionante." },
  { id: "s018", category: "Museus", name: "Frick Collection", emoji: "🎻", desc: "Mansao do seculo XIX transformada em museu com Vermeer, Rembrandt e Renoir." },
  { id: "s019", category: "Comida", name: "Smorgasburg", emoji: "🍜", desc: "Maior mercado de comida ao ar livre dos EUA, todo sabado em Williamsburg." },
  { id: "s020", category: "Comida", name: "Chelsea Market", emoji: "🥐", desc: "Mercado gourmet coberto numa antiga fabrica de biscoitos." },
  { id: "s021", category: "Comida", name: "Katz's Delicatessen", emoji: "🥪", desc: "O deli mais famoso de NY, desde 1888. O sanduiche de pastrami e lendario." },
  { id: "s022", category: "Comida", name: "Di Fara Pizza", emoji: "🍕", desc: "A pizza mais famosa de Brooklyn, feita a mao pelo mesmo dono ha decadas." },
  { id: "s023", category: "Comida", name: "Russ & Daughters", emoji: "🐟", desc: "Salmao defumado, cream cheese, bagel no Lower East Side desde 1914." },
  { id: "s024", category: "Comida", name: "Levain Bakery", emoji: "🍪", desc: "O cookie de chocolate mais famoso de NY. Enorme, cremoso e quente." },
  { id: "s025", category: "Comida", name: "Peter Luger Steak House", emoji: "🥩", desc: "A churrascaria mais famosa de NY, em Williamsburg desde 1887. So aceita dinheiro." },
  { id: "s026", category: "Natureza", name: "Staten Island Ferry", emoji: "⛴️", desc: "Balsa gratuita de Manhattan pra Staten Island com vista frontal da Estatua da Liberdade." },
  { id: "s027", category: "Natureza", name: "Rockaway Beach", emoji: "🏄", desc: "Praia em Queens acessivel de metro. Boa pra surfe, tem bares e restaurantes na orla." },
  { id: "s028", category: "Natureza", name: "The Cloisters", emoji: "🏰", desc: "Museu de arte medieval dentro de um mosteiro reconstruido no extremo norte de Manhattan." },
  { id: "s029", category: "Entretenimento", name: "Ver um show na Broadway", emoji: "🎭", desc: "Um classico que nao pode faltar. A experiencia mais nova-iorquina que existe." },
  { id: "s030", category: "Entretenimento", name: "Comedy Cellar", emoji: "😂", desc: "O clube de stand-up mais lendario de NY no Village. Grandes nomes aparecem sem aviso." },
  { id: "s031", category: "Entretenimento", name: "Sleep No More", emoji: "🎭", desc: "Peca imersiva de teatro noir onde voce vaga por um hotel de 5 andares sem roteiro fixo." },
  { id: "s032", category: "Entretenimento", name: "Brooklyn Mirage", emoji: "🎧", desc: "O maior venue de musica eletronica dos EUA, em Queens. Line-ups incriveis de maio a outubro." },
  { id: "s033", category: "Entretenimento", name: "Karaoke em Koreatown", emoji: "🎤", desc: "32nd St. Karaoke privativo (norebang) disponivel ate de madrugada." },
  { id: "s034", category: "Monumentos", name: "Estatua da Liberdade", emoji: "🗽", desc: "Balsa de Battery Park pra Liberty Island. Reserve com antecedencia pra subir." },
  { id: "s035", category: "Monumentos", name: "Grand Central Terminal", emoji: "🚂", desc: "A estacao de trem mais bela do mundo, com teto estrelado e o Whispering Gallery embaixo." },
  { id: "s036", category: "Monumentos", name: "Washington Square Park", emoji: "🎨", desc: "O parque mais vivo de Manhattan, com musicos, xadrez, skatistas e o arco no centro." },
  { id: "s037", category: "Monumentos", name: "Little Island", emoji: "🌺", desc: "Parque flutuante no Hudson River no Meatpacking, inaugurado em 2021." },
  { id: "s038", category: "Monumentos", name: "Flatiron Building", emoji: "🏢", desc: "O predio em formato de ferro de passar roupa. Recentemente reaberto apos reforma." },
];

const CATEGORIES = [...new Set(INITIAL_PLACES.map(p => p.category))];

const CAT_COLORS = {
  "Museus":          { accent: "#60a5fa", dim: "#1e3a5f" },
  "Monumentos":      { accent: "#a78bfa", dim: "#2d1b6e" },
  "Observatorios":   { accent: "#f472b6", dim: "#5b1a3a" },
  "Natureza":        { accent: "#34d399", dim: "#064e3b" },
  "Livrarias":       { accent: "#fbbf24", dim: "#451a03" },
  "Lojas":           { accent: "#fb923c", dim: "#431407" },
  "Entretenimento":  { accent: "#e879f9", dim: "#4a044e" },
  "Compras":         { accent: "#2dd4bf", dim: "#042f2e" },
  "Bairros":         { accent: "#f87171", dim: "#450a0a" },
  "Comida":          { accent: "#facc15", dim: "#422006" },
};

function DetailModal({ place, entry, onClose, onSave }) {
  const [note, setNote] = useState(entry ? entry.note || "" : "");
  const [date, setDate] = useState(entry ? entry.date || new Date().toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
  const [photo, setPhoto] = useState(entry ? entry.photo || null : null);
  const [status, setStatus] = useState(entry ? entry.status || "quero" : "quero");
  const fileRef = useRef();
  const col = CAT_COLORS[place.category] || { accent: "#60a5fa" };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const STATUS_CONFIG = {
    quero: { label: "Quero ir", activeIcon: "♥", icon: "♡", color: "#60a5fa" },
    fui:   { label: "Ja fui!", activeIcon: "✓", icon: "○", color: "#34d399" },
    skip:  { label: "Pular",   activeIcon: "−", icon: "−", color: "#6b7280" },
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000dd", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "#0e0e1a", border: "1px solid " + col.accent + "30", borderRadius: "24px 24px 0 0", padding: "28px 24px 44px", maxWidth: 560, width: "100%", maxHeight: "88vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 32, marginBottom: 6 }}>{place.emoji}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{place.name}</div>
            <div style={{ fontSize: 12, color: col.accent, letterSpacing: "0.12em", marginTop: 2 }}>{place.category.toUpperCase()}</div>
          </div>
          <button onClick={onClose} style={{ background: "#ffffff10", border: "none", borderRadius: 20, width: 36, height: 36, color: "#fff", cursor: "pointer", fontSize: 18 }}>x</button>
        </div>
        <div style={{ fontSize: 14, color: "#ffffff80", lineHeight: 1.6, marginBottom: 24 }}>{place.desc}</div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 10 }}>STATUS</div>
          <div style={{ display: "flex", gap: 8 }}>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <button key={key} onClick={() => setStatus(key)} style={{ flex: 1, padding: "10px 4px", borderRadius: 12, background: status === key ? cfg.color + "25" : "#ffffff08", border: "1px solid " + (status === key ? cfg.color : "#ffffff15"), color: status === key ? cfg.color : "#ffffff50", fontSize: 12, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.05em", transition: "all 0.15s" }}>
                {status === key ? cfg.activeIcon : cfg.icon}<br />
                <span style={{ fontSize: 11 }}>{cfg.label}</span>
              </button>
            ))}
          </div>
        </div>
        {status === "fui" && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 8 }}>QUANDO FORAM?</div>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: "100%", background: "#ffffff08", border: "1px solid #ffffff20", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>
        )}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 8 }}>{status === "fui" ? "COMO FOI?" : "OBSERVACOES"}</div>
          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder={status === "fui" ? "Amamos demais! A fila valeu..." : "Lembrete, dica, horario..."} rows={3} style={{ width: "100%", background: "#ffffff08", border: "1px solid #ffffff20", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14, fontFamily: "inherit", resize: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 8 }}>FOTO</div>
          {photo ? (
            <div style={{ position: "relative" }}>
              <img src={photo} alt="" style={{ width: "100%", borderRadius: 12, maxHeight: 220, objectFit: "cover" }} />
              <button onClick={() => setPhoto(null)} style={{ position: "absolute", top: 8, right: 8, background: "#000000cc", border: "none", borderRadius: 20, width: 32, height: 32, color: "#fff", cursor: "pointer", fontSize: 16 }}>x</button>
            </div>
          ) : (
            <button onClick={() => fileRef.current.click()} style={{ width: "100%", padding: "20px", background: "#ffffff05", border: "1px dashed #ffffff25", borderRadius: 12, color: "#ffffff50", cursor: "pointer", fontFamily: "inherit", fontSize: 14 }}>
              Adicionar foto
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
        </div>
        <button onClick={() => onSave({ status, note, date, photo })} style={{ width: "100%", padding: "16px", background: col.accent, border: "none", borderRadius: 14, color: "#000", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.05em" }}>
          Salvar
        </button>
      </div>
    </div>
  );
}

function AddModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [emoji, setEmoji] = useState("📍");
  const [category, setCategory] = useState(CATEGORIES[0]);

  const handle = () => {
    if (!name.trim()) return;
    onAdd({ id: "u" + Date.now(), name: name.trim(), desc: desc.trim(), emoji, category, custom: true });
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000dd", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "#0e0e1a", border: "1px solid #ffffff20", borderRadius: "24px 24px 0 0", padding: "28px 24px 44px", maxWidth: 560, width: "100%", maxHeight: "80vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.08em", color: "#fff" }}>NOVO LUGAR</div>
          <button onClick={onClose} style={{ background: "#ffffff10", border: "none", borderRadius: 20, width: 36, height: 36, color: "#fff", cursor: "pointer", fontSize: 18 }}>x</button>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 8 }}>EMOJI</div>
          <input value={emoji} onChange={e => setEmoji(e.target.value)} maxLength={2} style={{ width: 60, background: "#ffffff08", border: "1px solid #ffffff20", borderRadius: 10, padding: "10px", color: "#fff", fontSize: 22, textAlign: "center", fontFamily: "inherit" }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 8 }}>NOME</div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Yankee Stadium" style={{ width: "100%", background: "#ffffff08", border: "1px solid #ffffff20", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 8 }}>CATEGORIA</div>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", background: "#0e0e1a", border: "1px solid #ffffff20", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14, fontFamily: "inherit" }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 8 }}>DESCRICAO</div>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Uma linha sobre o que e..." rows={2} style={{ width: "100%", background: "#ffffff08", border: "1px solid #ffffff20", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14, fontFamily: "inherit", resize: "none", boxSizing: "border-box" }} />
        </div>
        <button onClick={handle} style={{ width: "100%", padding: "16px", background: "#60a5fa", border: "none", borderRadius: 14, color: "#000", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          Adicionar a lista
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [places, setPlaces] = useState(INITIAL_PLACES);
  const [entries, setEntries] = useState({});
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [activeFilter, setActiveFilter] = useState("todos");
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const allCategories = ["Todos", ...CATEGORIES];

  useEffect(() => {
    const entriesRef = ref(db, "entries");
    const unsubEntries = onValue(entriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setEntries(data);
      setLoading(false);
    });

    const placesRef = ref(db, "customPlaces");
    const unsubPlaces = onValue(placesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const custom = Object.values(data);
        setPlaces(prev => {
          const ids = new Set(prev.map(p => p.id));
          return [...prev, ...custom.filter(p => !ids.has(p.id))];
        });
      }
    });

    return () => {
      unsubEntries();
      unsubPlaces();
    };
  }, []);

  const handleSave = async (placeId, data) => {
    setSyncing(true);
    const newEntries = { ...entries, [placeId]: data };
    setEntries(newEntries);
    await set(ref(db, "entries/" + placeId), data);
    setSyncing(false);
    setSelected(null);
  };

  const handleAdd = async (place) => {
    const newPlaces = [...places, place];
    setPlaces(newPlaces);
    await set(ref(db, "customPlaces/" + place.id), place);
  };

  const filteredPlaces = places.filter(p => {
    const catOk = activeCategory === "Todos" || p.category === activeCategory;
    const status = entries[p.id] ? entries[p.id].status : undefined;
    const filterOk =
      activeFilter === "todos" ? true :
      activeFilter === "quero" ? status === "quero" || !status :
      activeFilter === "fui" ? status === "fui" :
      activeFilter === "skip" ? status === "skip" : true;
    return catOk && filterOk;
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
      <div style={{ background: "#080810", borderBottom: "1px solid #ffffff10", position: "sticky", top: 0, zIndex: 100, padding: "20px 16px 0" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase", margin: 0, color: "#fff" }}>NYC 🗽</h1>
              <div style={{ fontSize: 11, color: "#ffffff35", letterSpacing: "0.12em", marginTop: 2 }}>
                GUI & GABRIEL {syncing ? "· SALVANDO..." : "· AO VIVO"}
              </div>
            </div>
            <button onClick={() => setShowStats(!showStats)} style={{ background: "none", border: "1px solid #ffffff20", borderRadius: 20, padding: "6px 14px", color: "#ffffff80", fontSize: 12, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.08em" }}>
              {stats.fui}/{stats.total} fui
            </button>
          </div>

          {showStats && (
            <div style={{ display: "flex", gap: 12, padding: "14px 0 12px", borderTop: "1px solid #ffffff10", marginTop: 12 }}>
              {[
                { label: "Ja fui", val: stats.fui, color: "#34d399" },
                { label: "Quero ir", val: stats.quero, color: "#60a5fa" },
                { label: "A decidir", val: stats.noStatus, color: "#ffffff30" },
              ].map(s => (
                <div key={s.label} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: "#ffffff40", letterSpacing: "0.1em" }}>{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ height: 2, background: "#ffffff08", marginBottom: 14 }}>
            <div style={{ height: "100%", width: ((stats.fui / stats.total) * 100) + "%", background: "linear-gradient(90deg, #34d399, #60a5fa)", transition: "width 0.5s" }} />
          </div>

          <div style={{ display: "flex", gap: 6, marginBottom: 10, overflowX: "auto", scrollbarWidth: "none" }}>
            {[["todos", "Todos"], ["quero", "♥ Quero ir"], ["fui", "✓ Ja fui"], ["skip", "− Pulados"]].map(([key, label]) => (
              <button key={key} onClick={() => setActiveFilter(key)} style={{ background: activeFilter === key ? "#ffffff15" : "none", border: "1px solid " + (activeFilter === key ? "#ffffff40" : "#ffffff15"), borderRadius: 20, padding: "5px 12px", color: activeFilter === key ? "#fff" : "#ffffff50", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", letterSpacing: "0.05em" }}>{label}</button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 14 }}>
            {allCategories.map(cat => {
              const col = CAT_COLORS[cat];
              return (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{ background: activeCategory === cat ? ((col ? col.accent : "#fff") + "20") : "none", border: "1px solid " + (activeCategory === cat ? ((col ? col.accent : "#fff") + "60") : "#ffffff12"), borderRadius: 20, padding: "5px 12px", color: activeCategory === cat ? (col ? col.accent : "#fff") : "#ffffff40", fontSize: 11, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", letterSpacing: "0.08em" }}>{cat.toUpperCase()}</button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "16px" }}>
        {filteredPlaces.length === 0 && (
          <div style={{ textAlign: "center", color: "#ffffff25", padding: "60px 0", fontSize: 14 }}>Nenhum lugar nessa categoria ainda</div>
        )}
        {filteredPlaces.map(place => {
          const entry = entries[place.id];
          const status = entry ? entry.status : undefined;
          const col = CAT_COLORS[place.category] || { accent: "#60a5fa" };
          return (
            <div key={place.id} onClick={() => setSelected(place)} style={{ background: status === "fui" ? "#0a1a12" : status === "quero" ? "#0a0f1a" : "#0c0c18", border: "1px solid " + (status === "fui" ? col.accent + "35" : status === "quero" ? "#ffffff18" : "#ffffff0a"), borderLeft: "3px solid " + (status === "fui" ? col.accent : status === "quero" ? "#ffffff25" : "#ffffff08"), borderRadius: 14, marginBottom: 10, padding: "14px 16px", cursor: "pointer", opacity: status === "skip" ? 0.3 : 1, transition: "all 0.15s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 24, flexShrink: 0 }}>{place.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: status === "fui" ? "#fff" : "#ffffffcc" }}>
                      {place.name}
                      {place.custom && <span style={{ fontSize: 10, color: "#ffffff30", marginLeft: 6 }}>+ seu lugar</span>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      {entry && entry.photo && <span style={{ fontSize: 12 }}>📷</span>}
                      <span style={{ fontSize: 16, color: status === "fui" ? col.accent : status === "quero" ? "#60a5fa" : "#ffffff20" }}>
                        {status === "fui" ? "✓" : status === "quero" ? "♥" : status === "skip" ? "−" : "○"}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: col.accent + "80", letterSpacing: "0.1em", marginTop: 1 }}>{place.category.toUpperCase()}</div>
                  {entry && entry.note && <div style={{ fontSize: 12, color: "#ffffff40", marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{entry.note}</div>}
                  {status === "fui" && entry && entry.date && <div style={{ fontSize: 11, color: "#ffffff30", marginTop: 2 }}>Visitado em {entry.date}</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={() => setShowAdd(true)} style={{ position: "fixed", bottom: 28, right: 20, width: 56, height: 56, background: "linear-gradient(135deg, #60a5fa, #a78bfa)", border: "none", borderRadius: "50%", color: "#000", fontSize: 26, cursor: "pointer", boxShadow: "0 4px 24px #60a5fa40", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>+</button>

      {selected && <DetailModal place={selected} entry={entries[selected.id]} onClose={() => setSelected(null)} onSave={(data) => handleSave(selected.id, data)} />}
      {showAdd && <AddModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
    </div>
  );
}
