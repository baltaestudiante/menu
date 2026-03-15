// main.js - Router principal con soporte completo para SPA
import { DATA, renderFeed, renderGrid, renderEpisodio, renderSerie, renderCategoryPills } from './show.js';
import { getEpisodioByDetailUrl, getSerieByUrl } from './episodios.js';
import './player.js';

const PAGES = [
    { path: '/biblioteca', module: () => import('./biblioteca.js'), header: true },
    { path: '/explorar',   module: () => import('./explorar.js'),   header: true },
    { path: '/buscar',     module: () => import('./buscar.js'),     header: true }
];

let lastScrollTop = 0;

function updateActiveCategory() {
    const path = window.location.pathname;
    let activeCat = 'Todos';
    if (path.startsWith('/categoria/')) {
        activeCat = decodeURIComponent(path.replace('/categoria/', ''));
    }
    renderCategoryPills(activeCat);
}

function toggleHeaderAndCategories(show = true) {
    const header = document.getElementById('main-header');
    const categoryFilters = document.getElementById('category-filters');
    if (!header || !categoryFilters) return;

    if (show) {
        header.classList.remove('hidden');
        categoryFilters.classList.remove('hidden');
    } else {
        header.classList.add('hidden');
        categoryFilters.classList.add('hidden');
    }
}

async function router() {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const container = document.getElementById('content');

    try {
        // Reset scroll
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (path === '/') {
            renderFeed(container);
            document.title = 'Balta Media · Conocimiento en acción';
            toggleHeaderAndCategories(true);
        }

        else if (path === '/novedades') {
            const sorted = [...DATA].sort((a, b) => new Date(b.date) - new Date(a.date));
            const recientes = sorted.slice(0, 20);
            const aleatorios = [...DATA].sort(() => 0.5 - Math.random()).slice(0, 10);
            const combined = [...new Set([...recientes, ...aleatorios])];

            // Renderizamos grid con botón de cerrar
            container.innerHTML = `
                <div class="mb-6 flex items-center justify-between">
                    <h1 class="text-2xl font-bold">Novedades y Recomendaciones</h1>
                    <button id="closeNovedadesBtn" class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition">
                        Volver al inicio
                    </button>
                </div>
            `;
            const gridContainer = document.createElement('div');
            gridContainer.id = 'novedades-grid';
            container.appendChild(gridContainer);

            renderGrid(gridContainer, combined, '');

            document.title = 'Novedades · Balta Media';
            toggleHeaderAndCategories(true);

            // Listener para cerrar
            document.getElementById('closeNovedadesBtn')?.addEventListener('click', (e) => {
                e.preventDefault();
                window.history.pushState(null, null, '/');
                router();
            });
        }

        // Resto de rutas (mismo comportamiento que antes)
        else {
            const page = PAGES.find(p => p.path === path);
            if (page) {
                const module = await page.module();
                if (page.path === '/buscar' && searchParams.has('q')) {
                    const query = searchParams.get('q');
                    if (module.renderSearch) module.renderSearch(container, query);
                    else module.render(container);
                } else {
                    module.render(container);
                }
                document.title = `${path.slice(1).charAt(0).toUpperCase() + path.slice(2)} · Balta Media`;
                toggleHeaderAndCategories(page.header !== false);
            }
            else if (path.startsWith('/categoria/')) {
                const cat = decodeURIComponent(path.replace('/categoria/', ''));
                const buscarModule = await import('./buscar.js');
                if (buscarModule.renderCategory) {
                    buscarModule.renderCategory(container, cat);
                } else {
                    const categoryEpisodes = DATA.filter(ep => ep.categories?.includes(cat));
                    renderGrid(container, categoryEpisodes, cat);
                }
                document.title = `${cat} · Balta Media`;
                toggleHeaderAndCategories(true);
            }
            else {
                const serie = getSerieByUrl(path);
                if (serie) {
                    renderSerie(container, path);
                    document.title = `${serie.titulo_serie} · Balta Media`;
                    toggleHeaderAndCategories(true);
                } else {
                    const episodio = getEpisodioByDetailUrl(path);
                    if (episodio) {
                        renderEpisodio(container, episodio.id);
                        document.title = `${episodio.title} · Balta Media`;
                        toggleHeaderAndCategories(true);
                    } else if (path === '/novedades') {
                        // Ya manejado arriba
                    } else {
                        const module404 = await import('./404.js');
                        module404.render(container);
                        document.title = 'Página no encontrada · Balta Media';
                        toggleHeaderAndCategories(module404.header !== false);
                    }
                }
            }
        }

        updateActiveCategory();
        document.dispatchEvent(new Event('spa-navigation'));

        if (window.sidebarAPI) {
            if (path === '/' || path === '/novedades') window.sidebarAPI.refresh();
            window.sidebarAPI.setActive();
        }

        if (window.updatePlayerVisibility) {
            setTimeout(() => window.updatePlayerVisibility(), 50);
        }

    } catch (error) {
        console.error('Error en router:', error);
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                <span class="text-6xl mb-4">😵</span>
                <h2 class="text-2xl font-bold text-white mb-2">Algo salió mal</h2>
                <p class="text-gray-300 mb-6">${error.message || 'Error al cargar la página'}</p>
                <button onclick="window.history.pushState(null,null,'/'); router();"
                        class="bg-[#7b2eda] hover:bg-[#8f3ef0] text-white font-bold px-6 py-3 rounded-full transition">
                    Volver al inicio
                </button>
            </div>
        `;
    }
}

// Navegación SPA
document.addEventListener('click', e => {
    const link = e.target.closest('a[data-link]');
    if (link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
            window.history.pushState(null, null, href);
            router();
        } else if (href) {
            window.open(href, '_blank');
        }
    }
});

// Manejo de popstate (atrás/adelante del navegador)
window.addEventListener('popstate', router);

// Ocultar header al hacer scroll hacia abajo
window.addEventListener('scroll', () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    const header = document.getElementById('main-header');
    if (!header) return;

    if (st > lastScrollTop && st > 120) {
        header.classList.add('hidden');
    } else {
        header.classList.remove('hidden');
    }
    lastScrollTop = st <= 0 ? 0 : st;
});

// Observer para cambios dinámicos
const observer = new MutationObserver(() => {
    if (window.sidebarAPI) window.sidebarAPI.setActive();
    if (window.updatePlayerVisibility) window.updatePlayerVisibility();
});
const content = document.getElementById('content');
if (content) observer.observe(content, { childList: true, subtree: true });

// Inicializar
router();

console.log('✅ Main.js con SPA para novedades');
