import { useState, useEffect, useRef } from “react”;

// ─── DADOS INICIAIS ────────────────────────────────────────────────────────────
const INITIAL_PLACES = [
// Já na lista principal
{ id: “t001”, category: “Museus”, name: “NY Transit Museum”, emoji: “🚇”, desc: “Museu dentro de uma estação de metrô desativada em Brooklyn Heights, com vagões vintage dos anos 1900 até hoje.” },
{ id: “t002”, category: “Museus”, name: “American Museum of Natural History”, emoji: “🦕”, desc: “O museu do ‘Uma Noite no Museu’: dinossauros, baleia azul gigante, planetário, antropologia.” },
{ id: “t003”, category: “Museus”, name: “MoMA”, emoji: “🎨”, desc: “Arte moderna e contemporânea. Van Gogh, Picasso, Dalí, Warhol. Um dos melhores museus do mundo.” },
{ id: “t004”, category: “Museus”, name: “9/11 Memorial & Museum”, emoji: “🕊️”, desc: “No local exato das Torres Gêmeas, com as piscinas reflexivas enormes. Depoimentos de sobreviventes e famílias.” },
{ id: “t005”, category: “Museus”, name: “Intrepid Museum”, emoji: “✈️”, desc: “Porta-aviões real ancorado no Hudson River, com 30 aeronaves, o ônibus espacial Enterprise e o Concorde.” },
{ id: “t006”, category: “Museus”, name: “Building 92 / Brooklyn Navy Yard”, emoji: “⚓”, desc: “Centro de visitantes gratuito com 200 anos de história do estaleiro naval, num prédio de 1857.” },
{ id: “t007”, category: “Museus”, name: “Museum of Broadway”, emoji: “🎭”, desc: “Três andares com figurinos e adereços originais de Hamilton, Phantom, Rent e Wicked. Na Times Square.” },
{ id: “t008”, category: “Monumentos”, name: “NY Public Library”, emoji: “📚”, desc: “A biblioteca dos leões, clássica de filme. A sala de leitura principal é de cair o queixo. Grátis.” },
{ id: “t009”, category: “Monumentos”, name: “St. Patrick’s Cathedral”, emoji: “⛪”, desc: “Catedral neogótica no meio da 5th Ave, impressionante por dentro com os vitrais. Grátis.” },
{ id: “t010”, category: “Monumentos”, name: “NYSE + Charging Bull”, emoji: “🐂”, desc: “Fachada neoclássica da bolsa na Wall Street e o touro de bronze icônico do FiDi.” },
{ id: “t011”, category: “Monumentos”, name: “Brooklyn Heights Promenade”, emoji: “🌆”, desc: “Calçadão suspenso em Brooklyn Heights com vista panorâmica da skyline de Manhattan. Muito mais tranquilo que a ponte.” },
{ id: “t012”, category: “Monumentos”, name: “Central Park (norte e leste)”, emoji: “🌳”, desc: “Bethesda Fountain, The Ramble, Belvedere Castle, Reservoir e Conservatory Garden. A parte menos turística.” },
{ id: “t013”, category: “Observatórios”, name: “SUMMIT One Vanderbilt”, emoji: “🔮”, desc: “Instalações de arte com espelhos e vidro, vistas deslumbrantes. Abre até meia-noite. O favorito da lista.” },
{ id: “t014”, category: “Observatórios”, name: “Top of the Rock”, emoji: “🏙️”, desc: “No Rockefeller Center, com a view clássica com o Empire State no meio da foto. Vai no pôr do sol.” },
{ id: “t015”, category: “Observatórios”, name: “Empire State Building”, emoji: “🌃”, desc: “O ícone absoluto de Nova York. Abre até 11:30pm, ótimo pra ir ao anoitecer.” },
{ id: “t016”, category: “Observatórios”, name: “The Edge”, emoji: “🫧”, desc: “Terraço de vidro em Hudson Yards que parece que você tá voando sobre a cidade. O mais moderno.” },
{ id: “t017”, category: “Observatórios”, name: “One World Observatory”, emoji: “🌍”, desc: “No topo do World Trade Center, o prédio mais alto do hemisfério ocidental. Vista pro Downtown e Hudson River.” },
{ id: “t018”, category: “Natureza”, name: “Prospect Park”, emoji: “🌿”, desc: “O grande parque de Brooklyn, projetado pelos mesmos criadores do Central Park. Trilhas, lago e zoológico.” },
{ id: “t019”, category: “Natureza”, name: “Bronx Zoo”, emoji: “🦁”, desc: “Um dos maiores zoológicos urbanos do mundo, no Bronx. Reserve o dia inteiro.” },
{ id: “t020”, category: “Natureza”, name: “Coney Island”, emoji: “🎡”, desc: “Praia icônica com o parque Luna Park, o cachorro-quente do Nathan’s Famous e o calçadão histórico.” },
{ id: “t021”, category: “Livrarias”, name: “The Strand”, emoji: “📖”, desc: “4 andares e 18 milhas de livros na Union Square. Uma das livrarias mais famosas dos EUA.” },
{ id: “t022”, category: “Livrarias”, name: “The Ripped Bodice”, emoji: “💘”, desc: “Livraria especializada em romance em Park Slope, Brooklyn. Atmosfera aconchegante.” },
{ id: “t023”, category: “Lojas”, name: “Nintendo NY”, emoji: “🎮”, desc: “No Rockefeller Plaza, com merchandise exclusivo, demos de jogos e história da Nintendo.” },
{ id: “t024”, category: “Lojas”, name: “Disney Store”, emoji: “✨”, desc: “Na área da Times Square, dois andares de tudo que é Disney, Marvel e Pixar.” },
{ id: “t025”, category: “Lojas”, name: “Hershey’s + M&M + Lego”, emoji: “🍫”, desc: “As três gigantes na Times Square. Visuais, caóticas e divertidas pra uma passada rápida.” },
{ id: “t026”, category: “Entretenimento”, name: “SPYSCAPE”, emoji: “🕵️”, desc: “Museu interativo de espionagem: quebra códigos, esquiva de lasers e descobre seu perfil de espião.” },
{ id: “t027”, category: “Entretenimento”, name: “Show no Madison Square Garden”, emoji: “🎸”, desc: “O maior e mais famoso venue indoor de NY. Uma experiência à parte independente do show.” },
{ id: “t028”, category: “Entretenimento”, name: “PARAÏSO (Westlight Rooftop)”, emoji: “🌅”, desc: “Festa semanal aos domingos no rooftop do William Vale, Williamsburg. Sensibilidade mediterrânea e soul norte-africano.” },
{ id: “t029”, category: “Entretenimento”, name: “Paradise Sunset NYC”, emoji: “🌇”, desc: “Day party de rooftop animada. Próxima edição em 19 de junho (Juneteenth).” },
{ id: “t030”, category: “Entretenimento”, name: “Ellen’s Stardust Diner”, emoji: “🎤”, desc: “Restaurante dos garçons que cantam na Broadway, temático dos anos 50. Super divertido no Midtown.” },
{ id: “t031”, category: “Entretenimento”, name: “Bares Speakeasy”, emoji: “🥃”, desc: “Bares secretos escondidos atrás de cafeterias, cabines telefônicas ou geladeiras. Vibe proibição anos 20.” },
{ id: “t032”, category: “Entretenimento”, name: “Joe’s Pizza”, emoji: “🍕”, desc: “A fatia de pizza mais clássica de NY desde 1975. Original no West Village, várias filiais pela cidade.” },
{ id: “t033”, category: “Compras”, name: “American Dream Outlet”, emoji: “🛍️”, desc: “O maior outlet de NJ em East Rutherford, com parque de diversões, pista de esqui indoor e aquário.” },

// Sugeridos no app
{ id: “s001”, category: “Bairros”, name: “Governors Island”, emoji: “⛵”, desc: “Ilha sem carros na baía, com arte, piquenique e vista pro Downtown. Só acessível de balsa.” },
{ id: “s002”, category: “Bairros”, name: “Roosevelt Island”, emoji: “🌉”, desc: “Ilhinha no East River com tramway icônico saindo da 2nd Ave. Silenciosa e pitoresca.” },
{ id: “s003”, category: “Bairros”, name: “Harlem”, emoji: “🎷”, desc: “Berço do jazz e da cultura negra americana. Igrejas gospel, comida soul food e murais incríveis.” },
{ id: “s004”, category: “Bairros”, name: “Astoria, Queens”, emoji: “🇬🇷”, desc: “Bairro grego com ótimos restaurantes, museu de cinema e atmosfera europeia.” },
{ id: “s005”, category: “Bairros”, name: “Flushing, Queens”, emoji: “🥟”, desc: “A melhor gastronomia asiática fora da Ásia. Chinatown gigante com dim sum, hot pot e boba.” },
{ id: “s006”, category: “Bairros”, name: “Little Italy & Chinatown”, emoji: “🍝”, desc: “Dois bairros históricos em Lower Manhattan. Cannoli, dumplings e muita história.” },
{ id: “s007”, category: “Bairros”, name: “The High Line”, emoji: “🌿”, desc: “Parque linear suspenso numa ferrovia desativada no West Side. Arte, jardins e vista pro Hudson.” },
{ id: “s008”, category: “Bairros”, name: “Greenpoint, Brooklyn”, emoji: “🇵🇱”, desc: “Bairro polonês com cafés independentes, galerias e vista da skyline pela Transmitter Park.” },
{ id: “s009”, category: “Bairros”, name: “Red Hook, Brooklyn”, emoji: “⚓”, desc: “Antigo bairro industrial na beira d’água, com galerias, cervejarias e vista pra Estátua da Liberdade.” },
{ id: “s010”, category: “Bairros”, name: “Jackson Heights, Queens”, emoji: “🇮🇳”, desc: “Bairro mais diverso do mundo. Culinária sul-asiática, latina e muito mais.” },
{ id: “s011”, category: “Museus”, name: “Whitney Museum”, emoji: “🎨”, desc: “Arte americana contemporânea no Meatpacking District, com terraço de dar inveja.” },
{ id: “s012”, category: “Museus”, name: “The Met”, emoji: “🏛️”, desc: “Um dos maiores museus do mundo. Egito, armaduras medievais, impressionismo. O dia inteiro não é suficiente.” },
{ id: “s013”, category: “Museus”, name: “Guggenheim”, emoji: “🌀”, desc: “O prédio em espiral de Frank Lloyd Wright já é arte. Por dentro, coleção de arte moderna de alto nível.” },
{ id: “s014”, category: “Museus”, name: “Museum of the City of NY”, emoji: “🗽”, desc: “A história completa de Nova York do século XVII até hoje. Fotos, mapas e objetos fascinantes.” },
{ id: “s015”, category: “Museus”, name: “New York Hall of Science”, emoji: “🔬”, desc: “Museu de ciências interativo em Queens, com playground científico ao ar livre.” },
{ id: “s016”, category: “Museus”, name: “Tenement Museum”, emoji: “🏚️”, desc: “Visita guiada a apartamentos de imigrantes preservados do século XIX no Lower East Side. Muito imersivo.” },
{ id: “s017”, category: “Museus”, name: “Brooklyn Museum”, emoji: “🖼️”, desc: “Segundo maior museu de arte dos EUA, com coleção egípcia impressionante e arte feminista icônica.” },
{ id: “s018”, category: “Museus”, name: “Frick Collection”, emoji: “🎻”, desc: “Mansão do século XIX transformada em museu com Vermeer, Rembrandt e Renoir. Intimista e elegante.” },
{ id: “s019”, category: “Comida”, name: “Smorgasburg”, emoji: “🍜”, desc: “Maior mercado de comida ao ar livre dos EUA, todo sábado em Williamsburg e domingo em Prospect Park.” },
{ id: “s020”, category: “Comida”, name: “Chelsea Market”, emoji: “🥐”, desc: “Mercado gourmet coberto numa antiga fábrica de biscoitos. Ótimo pra almoço e specialty food.” },
{ id: “s021”, category: “Comida”, name: “Katz’s Delicatessen”, emoji: “🥪”, desc: “O deli mais famoso de NY, desde 1888. O sanduíche de pastrami é lendário.” },
{ id: “s022”, category: “Comida”, name: “Di Fara Pizza”, emoji: “🍕”, desc: “A pizza mais famosa de Brooklyn, feita à mão pelo mesmo dono há décadas. Em Midwood.” },
{ id: “s023”, category: “Comida”, name: “Russ & Daughters”, emoji: “🐟”, desc: “Salmão defumado, cream cheese, bagel no Lower East Side desde 1914. Patrimônio cultural.” },
{ id: “s024”, category: “Comida”, name: “Levain Bakery”, emoji: “🍪”, desc: “O cookie de chocolate mais famoso de NY. Enorme, cremoso e quente.” },
{ id: “s025”, category: “Comida”, name: “Peter Luger Steak House”, emoji: “🥩”, desc: “A churrascaria mais famosa de NY, em Williamsburg desde 1887. Só aceita dinheiro. O porterhouse é épico.” },
{ id: “s026”, category: “Natureza”, name: “Staten Island Ferry”, emoji: “⛴️”, desc: “Balsa gratuita de Manhattan pra Staten Island com vista frontal da Estátua da Liberdade. 100% de graça.” },
{ id: “s027”, category: “Natureza”, name: “Rockaway Beach”, emoji: “🏄”, desc: “Praia em Queens acessível de metrô. Boa pra surfe, tem bares e restaurantes na orla.” },
{ id: “s028”, category: “Natureza”, name: “The Cloisters”, emoji: “🏰”, desc: “Museu de arte medieval dentro de um mosteiro reconstruído no extremo norte de Manhattan, com jardim.” },
{ id: “s029”, category: “Entretenimento”, name: “Ver um show na Broadway”, emoji: “🎭”, desc: “Um clássico que não pode faltar. A experiência mais nova-iorquina que existe.” },
{ id: “s030”, category: “Entretenimento”, name: “Comedy Cellar”, emoji: “😂”, desc: “O clube de stand-up mais lendário de NY no Village. Grandes nomes aparecem sem aviso.” },
{ id: “s031”, category: “Entretenimento”, name: “Sleep No More”, emoji: “🎭”, desc: “Peça imersiva de teatro noir onde você vaga por um hotel de 5 andares sem roteiro fixo. Único.” },
{ id: “s032”, category: “Entretenimento”, name: “Brooklyn Mirage”, emoji: “🎧”, desc: “O maior venue de música eletrônica dos EUA, em Queens. Line-ups incríveis de maio a outubro.” },
{ id: “s033”, category: “Entretenimento”, name: “Karaoke em Koreatown”, emoji: “🎤”, desc: “32nd St. Karaokê privativo (norebang) disponível até de madrugada.” },
{ id: “s034”, category: “Monumentos”, name: “Estátua da Liberdade”, emoji: “🗽”, desc: “Balsa de Battery Park pra Liberty Island. Reserve com antecedência pra subir.” },
{ id: “s035”, category: “Monumentos”, name: “Grand Central Terminal”, emoji: “🚂”, desc: “A estação de trem mais bela do mundo, com teto estrelado e o Whispering Gallery embaixo.” },
{ id: “s036”, category: “Monumentos”, name: “Washington Square Park”, emoji: “🎨”, desc: “O parque mais vivo de Manhattan, com músicos, xadrez, skatistas e o arco no centro. Greenwich Village.” },
{ id: “s037”, category: “Monumentos”, name: “Little Island”, emoji: “🌺”, desc: “Parque flutuante no Hudson River no Meatpacking, inaugurado em 2021. Design futurista e muito verde.” },
{ id: “s038”, category: “Monumentos”, name: “Flatiron Building”, emoji: “🏢”, desc: “O prédio em formato de ferro de passar roupa. Recentemente reaberto após reforma.” },
];

const CATEGORIES = […new Set(INITIAL_PLACES.map(p => p.category))];

const CAT_COLORS = {
“Museus”:        { accent: “#60a5fa”, dim: “#1e3a5f” },
“Monumentos”:    { accent: “#a78bfa”, dim: “#2d1b6e” },
“Observatórios”: { accent: “#f472b6”, dim: “#5b1a3a” },
“Natureza”:      { accent: “#34d399”, dim: “#064e3b” },
“Livrarias”:     { accent: “#fbbf24”, dim: “#451a03” },
“Lojas”:         { accent: “#fb923c”, dim: “#431407” },
“Entretenimento”:{ accent: “#e879f9”, dim: “#4a044e” },
“Compras”:       { accent: “#2dd4bf”, dim: “#042f2e” },
“Bairros”:       { accent: “#f87171”, dim: “#450a0a” },
“Comida”:        { accent: “#facc15”, dim: “#422006” },
};

const STATUS_CONFIG = {
quero:  { label: “Quero ir”,  icon: “♡”, activeIcon: “♥”, color: “#60a5fa” },
fui:    { label: “Já fui!”,   icon: “○”, activeIcon: “✓”, color: “#34d399” },
skip:   { label: “Pular”,     icon: “−”, activeIcon: “−”, color: “#6b7280” },
};

function compress(dataUrl) { return dataUrl; }

// ─── MODAL DE DETALHES ─────────────────────────────────────────────────────────
function DetailModal({ place, entry, onClose, onSave }) {
const [note, setNote] = useState(entry?.note || “”);
const [date, setDate] = useState(entry?.date || new Date().toISOString().split(“T”)[0]);
const [photo, setPhoto] = useState(entry?.photo || null);
const [status, setStatus] = useState(entry?.status || “quero”);
const fileRef = useRef();

const col = CAT_COLORS[place.category] || CAT_COLORS[“Museus”];

const handlePhoto = (e) => {
const file = e.target.files[0];
if (!file) return;
const reader = new FileReader();
reader.onload = ev => setPhoto(ev.target.result);
reader.readAsDataURL(file);
};

return (
<div style={{
position: “fixed”, inset: 0, background: “#000000dd”, zIndex: 300,
display: “flex”, alignItems: “flex-end”, justifyContent: “center”,
}} onClick={onClose}>
<div style={{
background: “#0e0e1a”,
border: `1px solid ${col.accent}30`,
borderRadius: “24px 24px 0 0”,
padding: “28px 24px 44px”,
maxWidth: 560,
width: “100%”,
maxHeight: “88vh”,
overflowY: “auto”,
}} onClick={e => e.stopPropagation()}>

```
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
      <div>
        <div style={{ fontSize: 32, marginBottom: 6 }}>{place.emoji}</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "0.01em" }}>{place.name}</div>
        <div style={{ fontSize: 12, color: col.accent, letterSpacing: "0.12em", marginTop: 2 }}>{place.category.toUpperCase()}</div>
      </div>
      <button onClick={onClose} style={{ background: "#ffffff10", border: "none", borderRadius: 20, width: 36, height: 36, color: "#fff", cursor: "pointer", fontSize: 18 }}>×</button>
    </div>

    <div style={{ fontSize: 14, color: "#ffffff80", lineHeight: 1.6, marginBottom: 24 }}>{place.desc}</div>

    {/* Status */}
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 10 }}>STATUS</div>
      <div style={{ display: "flex", gap: 8 }}>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <button key={key} onClick={() => setStatus(key)} style={{
            flex: 1, padding: "10px 4px", borderRadius: 12,
            background: status === key ? cfg.color + "25" : "#ffffff08",
            border: `1px solid ${status === key ? cfg.color : "#ffffff15"}`,
            color: status === key ? cfg.color : "#ffffff50",
            fontSize: 12, cursor: "pointer", fontFamily: "inherit",
            letterSpacing: "0.05em", transition: "all 0.15s",
          }}>
            {status === key ? cfg.activeIcon : cfg.icon}<br />
            <span style={{ fontSize: 11 }}>{cfg.label}</span>
          </button>
        ))}
      </div>
    </div>

    {/* Data */}
    {status === "fui" && (
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 8 }}>QUANDO FORAM?</div>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{
          width: "100%", background: "#ffffff08", border: "1px solid #ffffff20",
          borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14,
          fontFamily: "inherit", boxSizing: "border-box",
        }} />
      </div>
    )}

    {/* Nota */}
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 8 }}>
        {status === "fui" ? "COMO FOI? DEIXA UMA NOTA" : "OBSERVAÇÕES"}
      </div>
      <textarea value={note} onChange={e => setNote(e.target.value)}
        placeholder={status === "fui" ? "Amamos demais! A fila valeu..." : "Lembrete, dica, horário..."}
        rows={3} style={{
          width: "100%", background: "#ffffff08", border: "1px solid #ffffff20",
          borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14,
          fontFamily: "inherit", resize: "none", boxSizing: "border-box",
        }} />
    </div>

    {/* Foto */}
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 8 }}>FOTO</div>
      {photo ? (
        <div style={{ position: "relative" }}>
          <img src={photo} alt="" style={{ width: "100%", borderRadius: 12, maxHeight: 220, objectFit: "cover" }} />
          <button onClick={() => setPhoto(null)} style={{
            position: "absolute", top: 8, right: 8, background: "#000000cc",
            border: "none", borderRadius: 20, width: 32, height: 32, color: "#fff", cursor: "pointer", fontSize: 16,
          }}>×</button>
        </div>
      ) : (
        <button onClick={() => fileRef.current.click()} style={{
          width: "100%", padding: "20px", background: "#ffffff05",
          border: "1px dashed #ffffff25", borderRadius: 12, color: "#ffffff50",
          cursor: "pointer", fontFamily: "inherit", fontSize: 14,
        }}>
          📷 Adicionar foto
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
    </div>

    <button onClick={() => onSave({ status, note, date, photo })} style={{
      width: "100%", padding: "16px", background: col.accent,
      border: "none", borderRadius: 14, color: "#000", fontSize: 15,
      fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.05em",
    }}>
      Salvar
    </button>
  </div>
</div>
```

);
}

// ─── MODAL DE NOVO LUGAR ───────────────────────────────────────────────────────
function AddModal({ onClose, onAdd }) {
const [name, setName] = useState(””);
const [desc, setDesc] = useState(””);
const [emoji, setEmoji] = useState(“📍”);
const [category, setCategory] = useState(CATEGORIES[0]);

const handle = () => {
if (!name.trim()) return;
onAdd({ id: “u” + Date.now(), name: name.trim(), desc: desc.trim(), emoji, category, custom: true });
onClose();
};

return (
<div style={{ position: “fixed”, inset: 0, background: “#000000dd”, zIndex: 300, display: “flex”, alignItems: “flex-end”, justifyContent: “center” }} onClick={onClose}>
<div style={{ background: “#0e0e1a”, border: “1px solid #ffffff20”, borderRadius: “24px 24px 0 0”, padding: “28px 24px 44px”, maxWidth: 560, width: “100%”, maxHeight: “80vh”, overflowY: “auto” }} onClick={e => e.stopPropagation()}>
<div style={{ display: “flex”, justifyContent: “space-between”, marginBottom: 24 }}>
<div style={{ fontSize: 16, fontWeight: 700, letterSpacing: “0.08em”, color: “#fff” }}>NOVO LUGAR</div>
<button onClick={onClose} style={{ background: “#ffffff10”, border: “none”, borderRadius: 20, width: 36, height: 36, color: “#fff”, cursor: “pointer”, fontSize: 18 }}>×</button>
</div>

```
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 8 }}>EMOJI</div>
      <input value={emoji} onChange={e => setEmoji(e.target.value)} maxLength={2} style={{ width: 60, background: "#ffffff08", border: "1px solid #ffffff20", borderRadius: 10, padding: "10px", color: "#fff", fontSize: 22, textAlign: "center", fontFamily: "inherit" }} />
    </div>

    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 8 }}>NOME *</div>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Yankee Stadium" style={{ width: "100%", background: "#ffffff08", border: "1px solid #ffffff20", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
    </div>

    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 8 }}>CATEGORIA</div>
      <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", background: "#0e0e1a", border: "1px solid #ffffff20", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14, fontFamily: "inherit" }}>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>

    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, color: "#ffffff40", letterSpacing: "0.12em", marginBottom: 8 }}>DESCRIÇÃO</div>
      <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Uma linha sobre o que é..." rows={2} style={{ width: "100%", background: "#ffffff08", border: "1px solid #ffffff20", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14, fontFamily: "inherit", resize: "none", boxSizing: "border-box" }} />
    </div>

    <button onClick={handle} style={{ width: "100%", padding: "16px", background: "#60a5fa", border: "none", borderRadius: 14, color: "#000", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
      Adicionar à lista
    </button>
  </div>
</div>
```

);
}

// ─── APP PRINCIPAL ─────────────────────────────────────────────────────────────
export default function App() {
const [places, setPlaces] = useState(INITIAL_PLACES);
const [entries, setEntries] = useState({});
const [activeCategory, setActiveCategory] = useState(“Todos”);
const [activeFilter, setActiveFilter] = useState(“todos”);
const [selected, setSelected] = useState(null);
const [showAdd, setShowAdd] = useState(false);
const [loading, setLoading] = useState(true);
const [syncing, setSyncing] = useState(false);
const [showStats, setShowStats] = useState(false);

const allCategories = [“Todos”, …CATEGORIES];

// ── Load from shared storage ─────────────────────────────────────────────────
useEffect(() => {
(async () => {
try {
const r1 = await window.storage.get(“nyc-entries”, true);
if (r1?.value) setEntries(JSON.parse(r1.value));
const r2 = await window.storage.get(“nyc-custom-places”, true);
if (r2?.value) {
const custom = JSON.parse(r2.value);
setPlaces(prev => {
const ids = new Set(prev.map(p => p.id));
return […prev, …custom.filter(p => !ids.has(p.id))];
});
}
} catch (e) { /* first visit */ }
setLoading(false);
})();
}, []);

// ── Poll for updates every 15s ───────────────────────────────────────────────
useEffect(() => {
const interval = setInterval(async () => {
try {
const r = await window.storage.get(“nyc-entries”, true);
if (r?.value) setEntries(JSON.parse(r.value));
} catch (e) {}
}, 15000);
return () => clearInterval(interval);
}, []);

const saveEntries = async (newEntries) => {
setSyncing(true);
setEntries(newEntries);
try {
await window.storage.set(“nyc-entries”, JSON.stringify(newEntries), true);
} catch (e) {}
setTimeout(() => setSyncing(false), 800);
};

const saveCustomPlaces = async (newPlaces) => {
const custom = newPlaces.filter(p => p.custom);
try {
await window.storage.set(“nyc-custom-places”, JSON.stringify(custom), true);
} catch (e) {}
};

const handleSave = (placeId, data) => {
const newEntries = { …entries, [placeId]: data };
saveEntries(newEntries);
setSelected(null);
};

const handleAdd = (place) => {
const newPlaces = […places, place];
setPlaces(newPlaces);
saveCustomPlaces(newPlaces);
};

const filteredPlaces = places.filter(p => {
const catOk = activeCategory === “Todos” || p.category === activeCategory;
const status = entries[p.id]?.status;
const filterOk =
activeFilter === “todos” ? true :
activeFilter === “quero” ? status === “quero” || !status :
activeFilter === “fui” ? status === “fui” :
activeFilter === “skip” ? status === “skip” : true;
return catOk && filterOk;
});

const stats = {
total: places.length,
fui: Object.values(entries).filter(e => e.status === “fui”).length,
quero: places.filter(p => entries[p.id]?.status === “quero”).length,
noStatus: places.filter(p => !entries[p.id]?.status).length,
};

if (loading) return (
<div style={{ minHeight: “100vh”, background: “#080810”, display: “flex”, alignItems: “center”, justifyContent: “center” }}>
<div style={{ textAlign: “center”, color: “#ffffff40” }}>
<div style={{ fontSize: 32, marginBottom: 12 }}>🗽</div>
<div style={{ fontSize: 13, letterSpacing: “0.15em” }}>CARREGANDO…</div>
</div>
</div>
);

return (
<div style={{ minHeight: “100vh”, background: “#080810”, color: “#fff”, fontFamily: “‘Georgia’, ‘Times New Roman’, serif”, paddingBottom: 100 }}>

```
  {/* HEADER */}
  <div style={{ background: "#080810", borderBottom: "1px solid #ffffff10", position: "sticky", top: 0, zIndex: 100, padding: "20px 16px 0" }}>
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase", margin: 0, color: "#fff" }}>
            NYC 🗽
          </h1>
          <div style={{ fontSize: 11, color: "#ffffff35", letterSpacing: "0.12em", marginTop: 2 }}>
            GUI & GABRIEL {syncing ? "· SALVANDO..." : "· COMPARTILHADO"}
          </div>
        </div>
        <button onClick={() => setShowStats(!showStats)} style={{ background: "none", border: "1px solid #ffffff20", borderRadius: 20, padding: "6px 14px", color: "#ffffff80", fontSize: 12, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.08em" }}>
          {stats.fui}/{stats.total} ✓
        </button>
      </div>

      {/* Stats bar */}
      {showStats && (
        <div style={{ display: "flex", gap: 12, padding: "14px 0 12px", borderTop: "1px solid #ffffff10", marginTop: 12 }}>
          {[
            { label: "Já fui", val: stats.fui, color: "#34d399" },
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

      {/* Progress bar */}
      <div style={{ height: 2, background: "#ffffff08", marginBottom: 14 }}>
        <div style={{ height: "100%", width: `${(stats.fui / stats.total) * 100}%`, background: "linear-gradient(90deg, #34d399, #60a5fa)", transition: "width 0.5s" }} />
      </div>

      {/* Filtro status */}
      <div style={{ display: "flex", gap: 6, marginBottom: 10, overflowX: "auto", scrollbarWidth: "none" }}>
        {[["todos", "Todos"], ["quero", "♥ Quero ir"], ["fui", "✓ Já fui"], ["skip", "− Pulados"]].map(([key, label]) => (
          <button key={key} onClick={() => setActiveFilter(key)} style={{
            background: activeFilter === key ? "#ffffff15" : "none",
            border: `1px solid ${activeFilter === key ? "#ffffff40" : "#ffffff15"}`,
            borderRadius: 20, padding: "5px 12px", color: activeFilter === key ? "#fff" : "#ffffff50",
            fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", letterSpacing: "0.05em",
          }}>{label}</button>
        ))}
      </div>

      {/* Categorias */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 14 }}>
        {allCategories.map(cat => {
          const col = CAT_COLORS[cat];
          return (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              background: activeCategory === cat ? (col?.accent || "#fff") + "20" : "none",
              border: `1px solid ${activeCategory === cat ? (col?.accent || "#fff") + "60" : "#ffffff12"}`,
              borderRadius: 20, padding: "5px 12px",
              color: activeCategory === cat ? (col?.accent || "#fff") : "#ffffff40",
              fontSize: 11, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", letterSpacing: "0.08em",
            }}>{cat.toUpperCase()}</button>
          );
        })}
      </div>
    </div>
  </div>

  {/* LISTA */}
  <div style={{ maxWidth: 600, margin: "0 auto", padding: "16px" }}>
    {filteredPlaces.length === 0 && (
      <div style={{ textAlign: "center", color: "#ffffff25", padding: "60px 0", fontSize: 14 }}>
        Nenhum lugar nessa categoria ainda
      </div>
    )}

    {filteredPlaces.map(place => {
      const entry = entries[place.id];
      const status = entry?.status;
      const col = CAT_COLORS[place.category] || { accent: "#60a5fa", dim: "#1e3a5f" };

      return (
        <div key={place.id} onClick={() => setSelected(place)}
          style={{
            background: status === "fui" ? "#0a1a12" : status === "quero" ? "#0a0f1a" : "#0c0c18",
            border: `1px solid ${status === "fui" ? col.accent + "35" : status === "quero" ? "#ffffff18" : "#ffffff0a"}`,
            borderLeft: `3px solid ${status === "fui" ? col.accent : status === "quero" ? "#ffffff25" : "#ffffff08"}`,
            borderRadius: 14,
            marginBottom: 10,
            padding: "14px 16px",
            cursor: "pointer",
            opacity: status === "skip" ? 0.3 : 1,
            transition: "all 0.15s",
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 24, flexShrink: 0 }}>{place.emoji}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: status === "fui" ? "#fff" : "#ffffffcc", letterSpacing: "0.01em" }}>
                  {place.name}
                  {place.custom && <span style={{ fontSize: 10, color: "#ffffff30", marginLeft: 6 }}>+ seu lugar</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  {entry?.photo && <span style={{ fontSize: 12 }}>📷</span>}
                  <span style={{ fontSize: 16, color: status === "fui" ? col.accent : status === "quero" ? "#60a5fa" : "#ffffff20" }}>
                    {status === "fui" ? "✓" : status === "quero" ? "♥" : status === "skip" ? "−" : "○"}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: 11, color: col.accent + "80", letterSpacing: "0.1em", marginTop: 1 }}>{place.category.toUpperCase()}</div>
              {entry?.note && <div style={{ fontSize: 12, color: "#ffffff40", marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{entry.note}</div>}
              {status === "fui" && entry?.date && <div style={{ fontSize: 11, color: "#ffffff30", marginTop: 2 }}>Visitado em {entry.date}</div>}
            </div>
          </div>
        </div>
      );
    })}
  </div>

  {/* FAB ADICIONAR */}
  <button onClick={() => setShowAdd(true)} style={{
    position: "fixed", bottom: 28, right: 20, width: 56, height: 56,
    background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
    border: "none", borderRadius: "50%", color: "#000", fontSize: 26,
    cursor: "pointer", boxShadow: "0 4px 24px #60a5fa40", zIndex: 200,
    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
  }}>+</button>

  {/* MODAIS */}
  {selected && (
    <DetailModal
      place={selected}
      entry={entries[selected.id]}
      onClose={() => setSelected(null)}
      onSave={(data) => handleSave(selected.id, data)}
    />
  )}
  {showAdd && <AddModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
</div>
```

);
}
    
