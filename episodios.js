// episodios.js - Datos de episodios y series con URLs únicas y categorización inteligente
// ---------- FUNCIÓN AUXILIAR PARA CREAR SLUGS ----------
function slugify(text) {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // eliminar caracteres especiales
        .replace(/[\s_-]+/g, '-') // reemplazar espacios y guiones bajos por un guión
        .replace(/^-+|-+$/g, ''); // eliminar guiones al inicio o final
}

// ---------- LISTA DE SERIES ----------
export const series = [
    {
        seriesid: "teoria-del-proceso",
        portada_serie: 'https://media.baltaanay.org/web/image/658-redirect/960bc627aab97e6134955b4d5d1c99d0.jpg',
        titulo_serie: 'Teoría del proceso',
        descripcion_serie: 'Proceso en el derecho y la forma de poner en movimiento la maquinaria de Justicia',
        url_serie: '/teoria-del-proceso',
        color: "#0d47a1"   // azul oscuro elegante (puedes cambiarlo)
    },
    {
        seriesid: "ddhh",
        portada_serie: 'https://scout.es/wp-content/uploads/2021/12/186-01.jpg',
        titulo_serie: 'Derechos Humanos',
        descripcion_serie: 'Derechos Humanos',
        url_serie: '/ddhh',
        color: "#1976d2"   // azul medio
    },
    {
        seriesid: "procesal-constitucional",
        portada_serie: 'https://balta.odoo.com/web/image/417-e2fd48e0/media.webp',
        titulo_serie: 'Derecho Procesal Constitucional',
        descripcion_serie: 'Derecho Procesal Constitucional',
        url_serie: '/procesal-constitucional',
        color: "#1565c0"
    },
    {
        seriesid: "ddpp-3-clases",
        portada_serie: 'https://media.baltaanay.org/web/image/925-6ed84678/DERECHO%20PENAL%20III.png',
        titulo_serie: 'Derecho penal 3',
        descripcion_serie: 'Derecho Público',
        url_serie: '/ddpp-3/clases',
        color: "#b71c1c"   // rojo oscuro (por penal)
    },
    {
        seriesid: "dp-indigenas",
        portada_serie: 'https://media.baltaanay.org/web/image/927-edc793ab/Pueblos%20ind%C3%ADgenas.png',
        titulo_serie: 'Derecho de los pueblos indígenas',
        descripcion_serie: 'Los derechos de tercera generación. Desarrolla los derechos de los pueblos indígenas o también conocidos como derechos de solidaridad.',
        url_serie: '/dp-indigenas',
        color: "#2e7d32"   // verde (por pueblos indígenas / naturaleza)
    },
    {
        seriesid: "derecho-laboral-1",
        portada_serie: 'https://media.baltaanay.org/web/image/929-b905c3ef/DERECHO%20LABORAL.png',
        titulo_serie: 'Derecho Laboral',
        descripcion_serie: 'Un derecho humano por excelencia. Es la ciencia, una disciplina pública. Ciencias Sociales.',
        url_serie: '/derecho-laboral-1',
        color: "#e65100"   // naranja laboral / trabajo
    }
];

// Crear mapa para acceso rápido
const seriesMap = Object.fromEntries(series.map(s => [s.seriesid, s]));

// ---------- LISTA DE EPISODIOS (con seriesid) ----------
const episodiosBase = [
    {
        id: "la-excepcion",
        date: '2025-11-28',
        type: 'audio',
        mediaUrl: 'https://d3ctxlq1ktw2nl.cloudfront.net/staging/2025-10-29/413399242-44100-2-2f259e66aeac3.m4a',
        coverUrl: 'https://s3-us-west-2.amazonaws.com/anchor-generated-image-bank/staging/podcast_uploaded_nologo400/44500417/44500417-1759018829686-8b0dde55850ed.jpg',
        title: 'La excepción en el proceso de administración de Justicia',
        description: 'La excepción en el proceso de administración de Justicia',
        allowDownload: false,
        author: "Barahona",
        seriesid: "teoria-del-proceso",
        color: "#0d47a1"   // heredado de la serie o personalizado
    },
    {
        id: "principios-procesales",
        date: '2025-11-28',
        type: 'audio',
        mediaUrl: 'https://balta-derecho.odoo.com/documents/content/3L5vYn32Sq-M5sUKB96S1Ao9',
        coverUrl: 'https://s3-us-west-2.amazonaws.com/anchor-generated-image-bank/staging/podcast_uploaded_nologo400/44500417/44500417-1759018829686-8b0dde55850ed.jpg',
        title: 'Principios procesales',
        description: 'La excepción en el proceso de administración de Justicia',
        allowDownload: false,
        author: "Barahona",
        seriesid: "teoria-del-proceso",
        color: "#0d47a1"
    },
    {
        id: "responsabilidad-penal-adolecencia",
        date: '2025-11-01',
        type: 'video',
        mediaUrl: 'https://lb.s3.odysee.tv/vods2.odysee.live/odysee-replays/84515919a2e010fa2c381702a6777c1035c2deb3/1762812470.mp4',
        coverUrl: 'https://balta.odoo.com/web/image/417-e2fd48e0/media.webp',
        title: 'Responsabilidad penal en la adolecencia',
        description: 'Conferencia de Derechos Humanos. Sobre la responsabilidad penal de la adolecencia, las penas y las medidas de seguridad.',
        allowDownload: false,
        author: "Rony Eulalio",
        seriesid: "ddhh",
        detailUrl: '/ddhh/adolecencia',
        color: "#1976d2"
    },
    // ... (los demás episodios siguen el mismo patrón)

    // Ejemplo con color por defecto (sin especificar → se usaría el fallback en el código que lo consuma)
    {
        id: "veliz-franco-vs-guatemala",
        date: '2025-09-27',
        type: 'audio',
        mediaUrl: 'https://d3ctxlq1ktw2nl.cloudfront.net/staging/2025-8-28/408260699-44100-2-4b5edeb875805.m4a',
        coverUrl: 'https://s3-us-west-2.amazonaws.com/anchor-generated-image-bank/staging/podcast_uploaded_episode400/44500417/44500417-1759018710643-950caadc41ea7.jpg',
        title: 'Veliz Franco y Otros Vs. Guatemala - Exposición',
        description: 'Guatemala presentaba un alto índice de impunidad general, en cuyo marco la mayoría de los actos violentos que conllevaban la muerte de mujeres quedaban impunes.',
        allowDownload: true,
        author: "Melany y Laura",
        seriesid: "ddhh",
        detailUrl: '/dh/caso-veliz-franco-vs-guatemala',
        color: "#1976d2"   // o puedes dejarlo sin definir y usar fallback
    }
    // ... resto de episodios
];

// ---------- FUNCIÓN PARA ASIGNAR detailUrl Y color POR DEFECTO ----------
function procesarEpisodios(episodiosList, seriesMap) {
    const COLOR_DEFAULT = "#455a64"; // celeste oscuro / gris-azulado oscuro como fallback final

    return episodiosList.map(ep => {
        let color = ep.color;

        // 1. Si el episodio ya tiene color → se respeta
        // 2. Si no → intenta tomar el de la serie
        if (!color) {
            color = seriesMap[ep.seriesid]?.color;
        }
        // 3. Si aún no hay color (ni en episodio ni en serie) → default
        if (!color) {
            color = COLOR_DEFAULT;
        }

        // Asignación de detailUrl (lógica original)
        let detailUrl = ep.detailUrl;
        if (!detailUrl || detailUrl === seriesMap[ep.seriesid]?.url_serie) {
            const serieUrl = seriesMap[ep.seriesid]?.url_serie;
            if (serieUrl) {
                const slug = slugify(ep.title);
                detailUrl = slug ? `${serieUrl}/${slug}` : serieUrl;
            }
        }

        return {
            ...ep,
            color,           // siempre presente
            detailUrl
        };
    });
}

// Aplicamos el procesamiento
export const episodios = procesarEpisodios(episodiosBase, seriesMap);

// ---------- FUNCIONES DE ACCESO (sin cambios) ----------
export function getEpisodioById(id) {
    return episodios.find(ep => ep.id === id);
}

export function getEpisodioByDetailUrl(url) {
    return episodios.find(ep => ep.detailUrl === url);
}

export function getSerieByUrl(url) {
    return series.find(s => s.url_serie === url);
}

export function getSerieById(seriesid) {
    return seriesMap[seriesid];
}

export function getEpisodiosBySerieId(seriesid) {
    return episodios.filter(ep => ep.seriesid === seriesid);
}

export function getEpisodiosBySerieUrl(url) {
    const serie = getSerieByUrl(url);
    return serie ? getEpisodiosBySerieId(serie.seriesid) : [];
}

export function getAllEpisodios() {
    return episodios;
}

export function getEpisodiosConSerie() {
    return episodios.map(ep => ({
        ...ep,
        series: getSerieById(ep.seriesid) || null
    }));
}
