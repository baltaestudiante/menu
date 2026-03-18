// show.js - Vistas del feed, episodio, serie, etc. - VERSIÓN MEJORADA
import { getAllEpisodios, getSerieById, getEpisodiosBySerieId, getEpisodiosConSerie } from './episodios.js';
import { userStorage } from './storage.js';
import './player.js';

// ---------- CONSTANTES ----------
const ICONS = {
    play: 'https://marca1.odoo.com/web/image/508-f876320c/play.svg',
    pause: 'https://marca1.odoo.com/web/image/508-f876320c/pause.svg',
    add: 'https://marca1.odoo.com/web/image/509-c555b4ef/a%C3%B1adir%20a.svg',
    added: 'https://nikichitonjesus.odoo.com/web/image/1112-d141b3eb/a%C3%B1adido.png',
    dl: 'https://marca1.odoo.com/web/image/510-7a9035c1/descargar.svg',
    noDl: 'https://nikichitonjesus.odoo.com/web/image/1051-622a3db3/no-desc.webp',
    share: 'https://nikichitonjesus.odoo.com/web/image/585-036b7961/cpmartir.png'
};

const CATEGORIES = [
    "Todos", "Derecho", "Física y Astronomía", "Matemáticas", "Historia",
    "Filosofía", "Economía y Finanzas", "Ciencias Sociales", "Arte y Cultura",
    "Literatura y Audiolibros", "Cine y TV", "Documentales", "Ciencias Naturales",
    "Tecnología e Informática", "Otras Ciencias"
];

// ---------- ESTILOS GLOBALES ----------
const GLOBAL_STYLES = `
    <style>
        body {
            background: linear-gradient(135deg, #1a2639 0%, #0f172a 50%, #1e293b 100%);
            min-height: 100vh;
        }
        .bg-custom-dark {
            background: linear-gradient(135deg, #1a2639 0%, #0f172a 50%, #1e293b 100%);
        }
        .card-std, .card-video, .grid-card, .list-item, .detail-view, .serie-header {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(2px);
        }
    </style>
`;

// Aplicar estilos globales
if (!document.getElementById('global-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'global-styles';
    styleSheet.textContent = GLOBAL_STYLES.replace('<style>', '').replace('</style>', '');
    document.head.appendChild(styleSheet);
}

// ---------- UTILIDADES ----------
function determineCategories(ep) {
    const cats = new Set();
    const text = (ep.title + ' ' + ep.description + ' ' + (ep.series?.titulo_serie || '') + ' ' + (ep.series?.descripcion_serie || '')).toLowerCase();
    const patterns = {
        "Derecho": /\b(derecho|penal|civil|constitucional|procesal|delito|ley|jurisprudencia|código|tribunal|justicia|proceso|abogado|legal)\b/i,
        "Física y Astronomía": /\b(física|fisica|mecánica|mecanica|cuántica|cuantica|termodinámica|termodinamica|newton|einstein|astronomía|astronomia|planeta|cosmos|gravedad|universo)\b/i,
        "Matemáticas": /\b(matemática|matematicas|calculo|cálculo|algebra|álgebra|geometria|geometría|estadistica|estadística|probabilidad|ecuacion|ecuación|teorema|integral|función|funcion)\b/i,
        "Historia": /\b(historia|histórico|historico|siglo|época|epoca|imperio|guerra|revolución|revolucion|antiguo|medieval|edad media|antigüedad)\b/i,
        "Filosofía": /\b(filosofía|filosofia|kant|platon|platón|aristoteles|ética|etica|metafísica|metafisica|ontología|ontologia|epistemología|epistemologia|pensamiento|razón|razon)\b/i,
        "Economía y Finanzas": /\b(economía|economia|finanzas|inflación|inflacion|keynes|oferta|demanda|macroeconomía|macroeconomia|pib|mercado|dinero|banco|inversión|inversion|geopolítica|geopolitica|política|politica)\b/i,
        "Ciencias Sociales": /\b(sociología|sociologia|antropología|antropologia|psicología|psicologia|sociedad|cultura|identidad|género|genero|desigualdad|comunidad|social|humano)\b/i,
        "Arte y Cultura": /\b(arte|pintura|escultura|arquitectura|renacimiento|barroco|música|musica|cultura|artístico|artistico|artista|obra)\b/i,
        "Literatura y Audiolibros": /\b(audiolibro|libro|novela|cuento|poema|clásico|clasico|literatura|lectura|escritor|poesía|poesia)\b/i,
        "Cine y TV": /\b(cine|película|pelicula|serie|director|guion|ficción|ficcion|animación|animacion|actor|actriz|documental)\b/i,
        "Documentales": /\b(documental|bbc|naturaleza|espacio|universo|planeta|national geographic|descubrimiento|exploración|exploracion)\b/i,
        "Ciencias Naturales": /\b(biología|biologia|química|quimica|geología|geologia|ecología|ecologia|evolución|evolucion|genética|genetica|clima|botánica|botanica|animal|planta|ecosistema)\b/i,
        "Tecnología e Informática": /\b(tecnología|tecnologia|programación|programacion|python|ia|computación|computacion|algoritmo|software|desarrollo|hardware|informática|informatica)\b/i,
        "Investigación y Criminología": /\b(investigación|investigacion|criminalística|criminalistica|crimen|delito|forense|guerra|conflicto|violencia|seguridad|policía|policia|detective|asesinato|homicidio)\b/i
    };
    for (const [cat, regex] of Object.entries(patterns)) {
        if (regex.test(text)) cats.add(cat);
    }
    if (ep.type === 'video') {
        if (text.includes('documental')) cats.add("Documentales");
        else cats.add("Cine y TV");
    }
    if (cats.size === 0) cats.add("Otras Ciencias");
    return Array.from(cats);
}

export const DATA = getEpisodiosConSerie().map(ep => ({
    ...ep,
    categories: determineCategories(ep)
}));

// ---------- RENDERIZADO DE TARJETAS (con botón añadir/quitar mejorado) ----------
export function createStandardCard(ep) {
    const inPlaylist = userStorage.playlist.has(ep.id);
    const addIcon = inPlaylist ? ICONS.added : ICONS.add;
    const dlIcon = ep.allowDownload ? ICONS.dl : ICONS.noDl;
    return `<div class="card-std group" data-episodio-id="${ep.id}">
        <div class="relative w-full aspect-square rounded-xl overflow-hidden bg-zinc-800/50 cursor-pointer" onclick="window.goToDetail('${ep.detailUrl}')">
            <img src="${ep.coverUrl}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
            <div class="overlay-full">
                <img src="${addIcon}" class="action-icon" onclick="window.handleAdd(event, '${ep.id}'); return false;" data-episodio-id="${ep.id}" data-added="${inPlaylist}">
                <img src="${ICONS.play}" class="play-icon-lg" onclick="window.handlePlay(event, '${ep.id}'); return false;">
                <img src="${dlIcon}" class="action-icon" onclick="window.handleDl(event, '${ep.id}'); return false;" title="${ep.allowDownload ? 'Descargar' : 'Descarga no disponible'}">
            </div>
            <div class="mobile-play-button" onclick="window.handlePlay(event, '${ep.id}'); return false;">
                <img src="${ICONS.play}" alt="Play">
            </div>
        </div>
        <div onclick="window.goToDetail('${ep.detailUrl}')" class="cursor-pointer">
            <h3 class="font-bold text-white text-sm truncate hover:text-blue-400 transition-colors">${ep.title}</h3>
            <p class="text-xs text-gray-400 mt-1 truncate">${ep.author}</p>
        </div>
    </div>`;
}

export function createVerticalCard(ep) {
    const inPlaylist = userStorage.playlist.has(ep.id);
    const addIcon = inPlaylist ? ICONS.added : ICONS.add;
    const dlIcon = ep.allowDownload ? ICONS.dl : ICONS.noDl;
    return `<div class="card-std group" data-episodio-id="${ep.id}">
        <div class="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-zinc-800/50 cursor-pointer" onclick="window.goToDetail('${ep.detailUrl}')">
            <img src="${ep.coverUrl}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
            <div class="overlay-full">
                <img src="${addIcon}" class="action-icon" onclick="window.handleAdd(event, '${ep.id}'); return false;" data-episodio-id="${ep.id}" data-added="${inPlaylist}">
                <img src="${ICONS.play}" class="play-icon-lg" onclick="window.handlePlay(event, '${ep.id}'); return false;">
                <img src="${dlIcon}" class="action-icon" onclick="window.handleDl(event, '${ep.id}'); return false;" title="${ep.allowDownload ? 'Descargar' : 'Descarga no disponible'}">
            </div>
            <div class="mobile-play-button" onclick="window.handlePlay(event, '${ep.id}'); return false;">
                <img src="${ICONS.play}" alt="Play">
            </div>
        </div>
        <div onclick="window.goToDetail('${ep.detailUrl}')" class="cursor-pointer">
            <h3 class="font-bold text-white text-sm truncate hover:text-blue-400 transition-colors">${ep.title}</h3>
            <p class="text-xs text-gray-400 mt-1 truncate">${ep.author}</p>
        </div>
    </div>`;
}

export function createVideoExpand(ep) {
    const inPlaylist = userStorage.playlist.has(ep.id);
    const addIcon = inPlaylist ? ICONS.added : ICONS.add;
    const dlIcon = ep.allowDownload ? ICONS.dl : ICONS.noDl;
    // Usar coverWide si existe, sino fallback a coverUrl
    const coverWide = ep.coverWide && ep.coverWide !== ep.coverUrl ? ep.coverWide : ep.coverUrl;
    return `<div class="card-video group" data-episodio-id="${ep.id}">
        <img src="${ep.coverUrl}" class="absolute inset-0 w-full h-full object-cover z-10 group-hover:opacity-0 transition-opacity duration-300">
        <img src="${coverWide}" class="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div class="overlay-full z-20">
            <img src="${addIcon}" class="action-icon" onclick="window.handleAdd(event, '${ep.id}'); return false;" data-episodio-id="${ep.id}" data-added="${inPlaylist}">
            <img src="${ICONS.play}" class="play-icon-lg" onclick="window.handlePlay(event, '${ep.id}'); return false;">
            <img src="${dlIcon}" class="action-icon" onclick="window.handleDl(event, '${ep.id}'); return false;" title="${ep.allowDownload ? 'Descargar' : 'Descarga no disponible'}">
        </div>
        <div class="mobile-play-button z-30" onclick="window.handlePlay(event, '${ep.id}'); return false;">
            <img src="${ICONS.play}" alt="Play">
        </div>
        <div class="absolute bottom-2 left-2 z-20 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold border border-white/10">VIDEO</div>
    </div>`;
}

export function createListItem(ep, idx) {
    const inPlaylist = userStorage.playlist.has(ep.id);
    const addIcon = inPlaylist ? ICONS.added : ICONS.add;

    return `
        <div class="list-item group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors w-full"
             data-episodio-id="${ep.id}">
            
            <!-- Índice -->
            <span class="text-gray-400 font-semibold w-6 text-center text-sm flex-shrink-0">${idx + 1}</span>
            
            <!-- Cover -->
            <div class="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                 onclick="window.goToDetail('${ep.detailUrl}')">
                <img src="${ep.coverUrl}" class="w-full h-full object-cover" loading="lazy">
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                     onclick="window.handlePlay(event, '${ep.id}'); return false;">
                    <img src="${ICONS.play}" class="w-5 h-5">
                </div>
            </div>
            
            <!-- Título y autor (en línea) -->
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                    <h4 class="text-sm font-medium text-white truncate group-hover:text-blue-400 cursor-pointer"
                        onclick="window.goToDetail('${ep.detailUrl}')">${ep.title}</h4>
                    <span class="text-xs text-gray-400 truncate">${ep.author}</span>
                </div>
            </div>
            
            <!-- Botón añadir/quitar -->
            <button onclick="window.handleAdd(event, '${ep.id}'); return false;"
                    class="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center transition-colors">
                <img src="${addIcon}" class="w-5 h-5" data-episodio-id="${ep.id}" data-added="${inPlaylist}">
            </button>
        </div>`;
}

export function createGridCard(item) {
    const inPlaylist = userStorage.playlist.has(item.id);
    const addIcon = inPlaylist ? ICONS.added : ICONS.add;
    const dlIcon = item.allowDownload ? ICONS.dl : ICONS.noDl;
    return `
        <div class="grid-card group" data-episodio-id="${item.id}">
            <div class="aspect-square bg-zinc-800/50 relative rounded-xl overflow-hidden cursor-pointer" onclick="window.goToDetail('${item.detailUrl}')">
                <img src="${item.coverUrl}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
                <div class="overlay-full">
                    <img src="${addIcon}" class="action-icon" onclick="window.handleAdd(event, '${item.id}'); return false;" data-episodio-id="${item.id}" data-added="${inPlaylist}">
                    <img src="${ICONS.play}" class="play-icon-lg" onclick="window.handlePlay(event, '${item.id}'); return false;">
                    <img src="${dlIcon}" class="action-icon" onclick="window.handleDl(event, '${item.id}'); return false;" title="${item.allowDownload ? 'Descargar' : 'Descarga no disponible'}">
                </div>
                <div class="mobile-play-button" onclick="window.handlePlay(event, '${item.id}'); return false;">
                    <img src="${ICONS.play}" alt="Play">
                </div>
            </div>
            <div onclick="window.goToDetail('${item.detailUrl}')" class="cursor-pointer">
                <h4 class="font-bold text-sm text-white truncate hover:text-blue-400 transition-colors">${item.title}</h4>
                <p class="text-xs text-gray-500 truncate">${item.author}</p>
            </div>
        </div>
    `;
}

// ---------- CARRUSELES ----------
function createCarousel(title, type, items, categoryContext, viewAllType = 'category') {
    if (!items || items.length === 0) return '';
    const id = 'c-' + Math.random().toString(36).substr(2, 9);
    let content = '';
    
    if (type === 'double') {
        content = `<div id="${id}" class="flex flex-col flex-wrap h-[580px] gap-x-6 gap-y-6 overflow-x-auto no-scrollbar scroll-smooth">` +
            items.map(ep => createStandardCard(ep)).join('') +
            `</div>`;
    } else if (type === 'list') {
        content = `<div id="${id}" class="flex gap-4 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth pb-4">`;
        for (let i = 0; i < items.length; i += 4) {
            content += `<div class="card-list-group min-w-[300px] sm:min-w-[340px] space-y-3">` +
                (items[i] ? createListItem(items[i], i) : '') +
                (items[i+1] ? createListItem(items[i+1], i+1) : '') +
                (items[i+2] ? createListItem(items[i+2], i+2) : '') +
                (items[i+3] ? createListItem(items[i+3], i+3) : '') +
                `</div>`;
        }
        content += `</div>`;
    } else if (type === 'expand') {
        content = `<div id="${id}" class="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2 pl-1">` +
            items.map(ep => createVideoExpand(ep)).join('') +
            `</div>`;
    } else if (type === 'vertical') {
        content = `<div id="${id}" class="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-2 pl-1">` +
            items.map(ep => createVerticalCard(ep)).join('') +
            `</div>`;
    } else {
        content = `<div id="${id}" class="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-2 pl-1">` +
            items.map(ep => createStandardCard(ep)).join('') +
            `</div>`;
    }
    
    // Manejar clic en título y botón "Ver todo"
    let verTodoHandler;
    if (viewAllType === 'series') {
        verTodoHandler = `window.showSeriesGrid('${title}')`;
    } else if (categoryContext !== 'Todos') {
        verTodoHandler = `window.handleCategoryClick('${categoryContext}')`;
    } else {
        verTodoHandler = `window.showItemsGrid('${title}', ${JSON.stringify(items.map(ep => ep.id))})`;
    }
    
    return `<section class="carousel-wrapper relative group/section mb-8 sm:mb-12">
        <div class="flex items-end justify-between mb-3 sm:mb-5 px-1">
            <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors cursor-pointer" onclick="${verTodoHandler}">${title}</h2>
            <button onclick="${verTodoHandler}" class="text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-white transition-colors">Ver todo</button>
        </div>
        <div class="relative">
            <div class="nav-btn left" onclick="document.getElementById('${id}').scrollLeft -= 600"><button>❮</button></div>
            ${content}
            <div class="nav-btn right" onclick="document.getElementById('${id}').scrollLeft += 600"><button>❯</button></div>
        </div>
    </section>`;
}

function createSeriesCarousel() {
    const id = 'c-series-' + Math.random().toString(36).substr(2, 9);
    const seriesGroups = {};
    DATA.forEach(ep => {
        if (ep.series) {
            const serieKey = ep.series.url_serie;
            if (!seriesGroups[serieKey]) {
                seriesGroups[serieKey] = { episodes: [], seriesInfo: ep.series };
            }
            seriesGroups[serieKey].episodes.push(ep);
        }
    });
    
    // Convertir a array y mezclar aleatoriamente
    let seriesArray = Object.entries(seriesGroups).map(([key, value]) => ({
        key,
        ...value
    }));
    
    // Mezclar aleatoriamente (Fisher-Yates)
    for (let i = seriesArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [seriesArray[i], seriesArray[j]] = [seriesArray[j], seriesArray[i]];
    }
    
    if (seriesArray.length === 0) return '';
    
    let content = `<div id="${id}" class="flex gap-4 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth pb-4">`;
    seriesArray.forEach(group => {
        group.episodes.sort((a, b) => new Date(b.date) - new Date(a.date));
        const s = group.seriesInfo;
        if (!s || group.episodes.length < 1) return;
        content += `<div class="card-list-group min-w-[300px] sm:min-w-[340px]">
            <div class="mb-4 cursor-pointer group/serie" onclick="window.goToDetail('${s.url_serie}')">
                <div class="relative w-full aspect-square rounded-xl overflow-hidden bg-zinc-800/50">
                    <img src="${s.portada_serie}" class="w-full h-full object-cover group-hover/serie:scale-105 transition-transform duration-500" loading="lazy">
                </div>
                <h3 class="font-bold text-white text-sm truncate mt-2 group-hover/serie:text-blue-400 transition-colors">${s.titulo_serie}</h3>
                <p class="text-xs text-gray-400 flex items-center gap-1">
                    <span>ver serie</span>
                    <span class="text-blue-400">→</span>
                </p>
            </div>
            <div class="space-y-3">
                ${group.episodes.slice(0, 4).map((ep, i) => createListItem(ep, i)).join('')}
            </div>
        </div>`;
    });
    content += `</div>`;
    
    return `<section class="carousel-wrapper relative group/section mb-8 sm:mb-12">
        <div class="flex items-end justify-between mb-3 sm:mb-5 px-1">
            <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors cursor-pointer" onclick="window.showSeriesGrid('Series y Cursos Académicos')">Series y Cursos Académicos</h2>
            <button class="text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-white transition-colors" onclick="window.showSeriesGrid('Series y Cursos Académicos')">Ver todo</button>
        </div>
        <div class="relative">
            <div class="nav-btn left" onclick="document.getElementById('${id}').scrollLeft -= 600"><button>❮</button></div>
            ${content}
            <div class="nav-btn right" onclick="document.getElementById('${id}').scrollLeft += 600"><button>❯</button></div>
        </div>
    </section>`;
}

// ---------- VISTAS DE DETALLE ----------
export function renderEpisodio(container, episodioId) {
    try {
        const ep = DATA.find(e => e.id === episodioId);
        if (!ep) {
            import('./404.js').then(m => m.render(container));
            return;
        }
        const inPlaylist = userStorage.playlist.has(ep.id);
        const addIcon = inPlaylist ? ICONS.added : ICONS.add;
        const html = `
            <div class="detail-view w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div class="episode-header mb-8">
                    <div class="block lg:hidden">
                        <div class="relative w-full aspect-square max-w-[300px] mx-auto mb-6 rounded-3xl overflow-hidden shadow-2xl">
                            <img src="${ep.coverUrl}" class="w-full h-full object-cover" alt="${ep.title}">
                        </div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">${ep.title}</h1>
                        <p class="text-lg text-gray-300 mb-3">${ep.author}</p>
                        <p class="text-gray-400 mb-6 leading-relaxed">${ep.description}</p>
                        <div class="flex items-center gap-3 mb-8">
                            <button class="flex-1 bg-[#7b2eda] hover:bg-[#8f3ef0] rounded-2xl py-4 px-6 flex items-center justify-center gap-3 transition transform hover:scale-[1.02]" onclick="window.handlePlay(event, '${ep.id}')">
                                <img src="${ICONS.play}" class="w-6 h-6 icon-white">
                                <span class="font-bold">Reproducir</span>
                            </button>
                            <button class="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white/20 transition" onclick="window.handleAdd(event, '${ep.id}')">
                                <img src="${addIcon}" class="w-6 h-6 icon-white" data-episodio-id="${ep.id}" data-added="${inPlaylist}">
                            </button>
                            <button class="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white/20 transition" onclick="window.handleDl(event, '${ep.id}')">
                                <img src="${ep.allowDownload ? ICONS.dl : ICONS.noDl}" class="w-6 h-6 icon-white">
                            </button>
                            <button class="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white/20 transition" onclick="window.shareContent('${ep.title}', '${ep.detailUrl}')">
                                <img src="${ICONS.share}" class="w-6 h-6 icon-white">
                            </button>
                        </div>
                    </div>
                    <div class="hidden lg:block relative rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900/50 to-black/50 border border-white/10">
                        <div class="absolute inset-0 opacity-20">
                            <img src="${ep.coverUrl}" class="w-full h-full object-cover blur-3xl scale-110">
                        </div>
                        <div class="relative z-10 p-8 flex gap-8">
                            <img src="${ep.coverUrl}" class="w-48 h-48 rounded-3xl object-cover shadow-2xl border-2 border-white/20" alt="${ep.title}">
                            <div class="flex-1">
                                <h1 class="text-4xl font-extrabold text-white mb-2">${ep.title}</h1>
                                <p class="text-xl text-gray-300 mb-4">${ep.author}</p>
                                <p class="text-gray-400 max-w-3xl leading-relaxed">${ep.description}</p>
                                <div class="flex items-center gap-4 mt-8">
                                    <button class="bg-[#7b2eda] hover:bg-[#8f3ef0] rounded-2xl py-4 px-8 flex items-center gap-3 transition transform hover:scale-105" onclick="window.handlePlay(event, '${ep.id}')">
                                        <img src="${ICONS.play}" class="w-6 h-6 icon-white">
                                        <span class="font-bold text-lg">Reproducir</span>
                                    </button>
                                    <button class="w-14 h-14 rounded-2xl bg-black/40 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white/20 transition" onclick="window.handleAdd(event, '${ep.id}')" title="Añadir a lista">
                                        <img src="${addIcon}" class="w-6 h-6 icon-white" data-episodio-id="${ep.id}" data-added="${inPlaylist}">
                                    </button>
                                    <button class="w-14 h-14 rounded-2xl bg-black/40 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white/20 transition" onclick="window.handleDl(event, '${ep.id}')" title="${ep.allowDownload ? 'Descargar' : 'Descarga no disponible'}">
                                        <img src="${ep.allowDownload ? ICONS.dl : ICONS.noDl}" class="w-6 h-6 icon-white">
                                    </button>
                                    <button class="w-14 h-14 rounded-2xl bg-black/40 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white/20 transition" onclick="window.shareContent('${ep.title}', '${ep.detailUrl}')" title="Compartir">
                                        <img src="${ICONS.share}" class="w-6 h-6 icon-white">
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ${ep.series ? `
                <div class="part-of-program mt-8 lg:mt-12 p-6 lg:p-8 bg-white/5 backdrop-blur rounded-3xl border border-white/10">
                    <h3 class="text-xl lg:text-2xl font-bold mb-6">Parte del programa</h3>
                    <div class="program-card flex flex-col sm:flex-row items-start sm:items-center gap-6 cursor-pointer group" onclick="window.goToDetail('${ep.series.url_serie}')">
                        <img src="${ep.series.portada_serie}" class="w-24 h-24 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform" alt="${ep.series.titulo_serie}">
                        <div>
                            <h3 class="text-xl lg:text-2xl font-bold group-hover:text-blue-400 transition-colors">${ep.series.titulo_serie}</h3>
                            <p class="text-gray-400 mt-1 line-clamp-2">${ep.series.descripcion_serie}</p>
                            <p class="text-[#7b2eda] font-semibold mt-3 flex items-center gap-1">
                                Ver más episodios <span class="text-lg">→</span>
                            </p>
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
        container.innerHTML = html;
    } catch (error) {
        console.error('Error en renderEpisodio:', error);
        container.innerHTML = `<div class="error-container p-8 text-center">
            <p class="text-red-500 text-lg">Error al cargar el episodio. Intenta de nuevo.</p>
            <button onclick="window.location.href='/'" class="mt-4 bg-purple-600 px-4 py-2 rounded">Volver al inicio</button>
        </div>`;
    }
}

export function renderSerie(container, serieUrl) {
    try {
        const serie = DATA.find(e => e.series?.url_serie === serieUrl)?.series;
        if (!serie) {
            import('./404.js').then(m => m.render(container));
            return;
        }
        const episodiosSerie = DATA.filter(e => e.series?.url_serie === serieUrl);
        episodiosSerie.sort((a, b) => new Date(b.date) - new Date(a.date));
        const episodiosHtml = episodiosSerie.map(ep => {
            const inPlaylist = userStorage.playlist.has(ep.id);
            const addIcon = inPlaylist ? ICONS.added : ICONS.add;
            return `
                <div class="episode-card flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-white/5 backdrop-blur rounded-2xl sm:rounded-3xl border border-white/10 mb-4 hover:bg-white/10 transition-all group" data-episodio-id="${ep.id}">
                    <img src="${ep.coverUrl}" class="w-full sm:w-24 h-48 sm:h-24 rounded-xl sm:rounded-2xl object-cover" loading="lazy" onclick="window.goToDetail('${ep.detailUrl}')" style="cursor: pointer;">
                    <div class="flex-1 min-w-0 w-full">
                        <div onclick="window.goToDetail('${ep.detailUrl}')" class="cursor-pointer">
                            <h3 class="text-lg sm:text-xl font-bold truncate hover:text-blue-400 transition-colors">${ep.title}</h3>
                            <div class="flex items-center gap-2 mt-1">
                                <span class="text-gray-400 text-sm">${ep.author}</span>
                                <span class="bg-[#7b2eda]/30 px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#7b2eda]/30">${ep.type === 'video' ? 'VIDEO' : 'PODCAST'}</span>
                            </div>
                        </div>
                        <p class="text-gray-400 text-sm mt-2 line-clamp-2 hidden sm:block">${ep.description}</p>
                        <div class="flex items-center gap-2 mt-4">
                            <button class="episode-action-btn w-10 h
