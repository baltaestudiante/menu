// player.js - Reproductor flotante tipo YouTube Music
import { userStorage } from './storage.js';
import { DATA } from './show.js'; // Importamos DATA para obtener episodios por ID

// ---------- CONSTANTES ----------
const ICONS = {
    play: 'https://marca1.odoo.com/web/image/508-f876320c/play.svg',
    pause: 'https://marca1.odoo.com/web/image/508-f876320c/pause.svg',
    next: 'https://cdn-icons-png.flaticon.com/512/545/545682.png', // Placeholder, reemplaza con tus iconos
    prev: 'https://cdn-icons-png.flaticon.com/512/545/545680.png',
    shuffle: 'https://cdn-icons-png.flaticon.com/512/727/727245.png',
    repeat: 'https://cdn-icons-png.flaticon.com/512/709/709790.png',
    repeatOne: 'https://cdn-icons-png.flaticon.com/512/727/727269.png',
    volume: 'https://cdn-icons-png.flaticon.com/512/727/727232.png',
    mute: 'https://cdn-icons-png.flaticon.com/512/727/727244.png',
    queue: 'https://cdn-icons-png.flaticon.com/512/565/565301.png',
    close: 'https://cdn-icons-png.flaticon.com/512/1828/1828778.png',
    download: 'https://marca1.odoo.com/web/image/510-7a9035c1/descargar.svg',
    add: 'https://marca1.odoo.com/web/image/509-c555b4ef/a%C3%B1adir%20a.svg',
    added: 'https://nikichitonjesus.odoo.com/web/image/1112-d141b3eb/a%C3%B1adido.png',
    share: 'https://nikichitonjesus.odoo.com/web/image/585-036b7961/cpmartir.png'
};

// ---------- ESTADO GLOBAL DEL REPRODUCTOR ----------
let currentQueue = [];                // Array de episodios en la cola actual
let currentIndex = -1;                // Índice del episodio actual en la cola
let isPlaying = false;
let isShuffled = false;
let repeatMode = 'off';               // 'off', 'all', 'one'
let audioElement = null;
let playerInitialized = false;

// Elementos DOM del reproductor (se crearán dinámicamente)
let playerContainer = null;
let progressBar = null;
let progressFill = null;
let currentTimeEl = null;
let durationEl = null;
let playPauseBtn = null;
let playPauseIcon = null;
let titleEl = null;
let authorEl = null;
let coverEl = null;
let volumeSlider = null;
let volumeIcon = null;
let shuffleBtn = null;
let repeatBtn = null;
let queueBtn = null;
let downloadBtn = null;
let addToPlaylistBtn = null;
let shareBtn = null;
let queuePanel = null;
let queueList = null;

// ---------- FUNCIONES AUXILIARES ----------
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

function updateMetaTags(ep) {
    // Actualiza los meta tags para compartir (llamado desde show.js también)
    document.title = ep.title + ' - App';
    let metaTitle = document.querySelector('meta[property="og:title"]');
    if (!metaTitle) {
        metaTitle = document.createElement('meta');
        metaTitle.setAttribute('property', 'og:title');
        document.head.appendChild(metaTitle);
    }
    metaTitle.setAttribute('content', ep.title);

    let metaDesc = document.querySelector('meta[property="og:description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('property', 'og:description');
        document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', ep.description || 'Escucha este episodio');

    let metaImage = document.querySelector('meta[property="og:image"]');
    if (!metaImage) {
        metaImage = document.createElement('meta');
        metaImage.setAttribute('property', 'og:image');
        document.head.appendChild(metaImage);
    }
    metaImage.setAttribute('content', ep.coverUrl || '');

    let metaUrl = document.querySelector('meta[property="og:url"]');
    if (!metaUrl) {
        metaUrl = document.createElement('meta');
        metaUrl.setAttribute('property', 'og:url');
        document.head.appendChild(metaUrl);
    }
    metaUrl.setAttribute('content', window.location.href.split('#')[0] + '#episodio-' + ep.id);
}

// ---------- CREACIÓN DE LA INTERFAZ DEL REPRODUCTOR ----------
function createPlayerUI() {
    if (document.getElementById('floating-player')) return;

    // Crear contenedor principal
    playerContainer = document.createElement('div');
    playerContainer.id = 'floating-player';
    playerContainer.className = 'fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 shadow-2xl transform translate-y-full transition-transform duration-300 z-50';
    playerContainer.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row items-center gap-4">
            <!-- Info del episodio actual -->
            <div class="flex items-center gap-3 w-full md:w-1/3">
                <img id="player-cover" src="" class="w-12 h-12 rounded-lg object-cover" alt="cover">
                <div class="flex-1 min-w-0">
                    <h4 id="player-title" class="text-white font-medium text-sm truncate">-</h4>
                    <p id="player-author" class="text-gray-400 text-xs truncate">-</p>
                </div>
                <div class="flex items-center gap-2 md:hidden">
                    <button id="player-add-mobile" class="text-white"><img src="${ICONS.add}" class="w-5 h-5 icon-white"></button>
                    <button id="player-download-mobile" class="text-white"><img src="${ICONS.download}" class="w-5 h-5 icon-white"></button>
                </div>
            </div>

            <!-- Controles principales -->
            <div class="flex flex-col items-center w-full md:w-1/3">
                <div class="flex items-center gap-4">
                    <button id="player-shuffle" class="text-gray-400 hover:text-white transition" title="Aleatorio">
                        <img src="${ICONS.shuffle}" class="w-5 h-5 icon-white">
                    </button>
                    <button id="player-prev" class="text-white" title="Anterior">
                        <img src="${ICONS.prev}" class="w-6 h-6 icon-white">
                    </button>
                    <button id="player-play-pause" class="bg-white rounded-full p-2 hover:scale-105 transition">
                        <img id="player-play-icon" src="${ICONS.play}" class="w-6 h-6">
                    </button>
                    <button id="player-next" class="text-white" title="Siguiente">
                        <img src="${ICONS.next}" class="w-6 h-6 icon-white">
                    </button>
                    <button id="player-repeat" class="text-gray-400 hover:text-white transition" title="Repetir">
                        <img src="${ICONS.repeat}" class="w-5 h-5 icon-white">
                    </button>
                </div>
                <!-- Barra de progreso -->
                <div class="flex items-center gap-2 w-full mt-2">
                    <span id="player-current-time" class="text-xs text-gray-400">0:00</span>
                    <div id="player-progress" class="flex-1 h-1 bg-zinc-700 rounded-full cursor-pointer">
                        <div id="player-progress-fill" class="h-1 bg-purple-600 rounded-full" style="width: 0%"></div>
                    </div>
                    <span id="player-duration" class="text-xs text-gray-400">0:00</span>
                </div>
            </div>

            <!-- Controles de volumen y extras -->
            <div class="hidden md:flex items-center gap-4 w-1/3 justify-end">
                <div class="flex items-center gap-2">
                    <button id="player-volume-icon" class="text-gray-400 hover:text-white">
                        <img src="${ICONS.volume}" class="w-5 h-5 icon-white">
                    </button>
                    <input id="player-volume" type="range" min="0" max="1" step="0.01" value="1" class="w-20 accent-purple-600">
                </div>
                <button id="player-add" class="text-gray-400 hover:text-white" title="Añadir a mi lista">
                    <img src="${ICONS.add}" class="w-5 h-5 icon-white">
                </button>
                <button id="player-download" class="text-gray-400 hover:text-white" title="Descargar">
                    <img src="${ICONS.download}" class="w-5 h-5 icon-white">
                </button>
                <button id="player-share" class="text-gray-400 hover:text-white" title="Compartir">
                    <img src="${ICONS.share}" class="w-5 h-5 icon-white">
                </button>
                <button id="player-queue" class="text-gray-400 hover:text-white" title="Cola">
                    <img src="${ICONS.queue}" class="w-5 h-5 icon-white">
                </button>
            </div>
        </div>

        <!-- Panel de cola (oculto inicialmente) -->
        <div id="player-queue-panel" class="hidden absolute bottom-full right-0 w-80 bg-zinc-800 rounded-t-lg border border-zinc-700 max-h-96 overflow-y-auto">
            <div class="p-3 border-b border-zinc-700 flex justify-between items-center">
                <h3 class="text-white font-bold">Cola de reproducción</h3>
                <button id="player-close-queue" class="text-gray-400 hover:text-white">
                    <img src="${ICONS.close}" class="w-4 h-4 icon-white">
                </button>
            </div>
            <div id="player-queue-list" class="p-2"></div>
        </div>
    `;

    document.body.appendChild(playerContainer);

    // Referencias a elementos
    coverEl = document.getElementById('player-cover');
    titleEl = document.getElementById('player-title');
    authorEl = document.getElementById('player-author');
    playPauseBtn = document.getElementById('player-play-pause');
    playPauseIcon = document.getElementById('player-play-icon');
    progressBar = document.getElementById('player-progress');
    progressFill = document.getElementById('player-progress-fill');
    currentTimeEl = document.getElementById('player-current-time');
    durationEl = document.getElementById('player-duration');
    volumeSlider = document.getElementById('player-volume');
    volumeIcon = document.getElementById('player-volume-icon');
    shuffleBtn = document.getElementById('player-shuffle');
    repeatBtn = document.getElementById('player-repeat');
    queueBtn = document.getElementById('player-queue');
    downloadBtn = document.getElementById('player-download');
    addToPlaylistBtn = document.getElementById('player-add');
    shareBtn = document.getElementById('player-share');
    queuePanel = document.getElementById('player-queue-panel');
    queueList = document.getElementById('player-queue-list');

    // Event listeners
    playPauseBtn.addEventListener('click', togglePlayPause);
    document.getElementById('player-prev').addEventListener('click', playPrevious);
    document.getElementById('player-next').addEventListener('click', playNext);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    volumeSlider.addEventListener('input', (e) => {
        if (audioElement) audioElement.volume = e.target.value;
        updateVolumeIcon();
    });
    volumeIcon.addEventListener('click', toggleMute);
    progressBar.addEventListener('click', seek);
    downloadBtn.addEventListener('click', handleDownload);
    addToPlaylistBtn.addEventListener('click', handleAddToPlaylist);
    shareBtn.addEventListener('click', handleShare);
    queueBtn.addEventListener('click', toggleQueuePanel);
    document.getElementById('player-close-queue').addEventListener('click', toggleQueuePanel);

    // Versión móvil
    document.getElementById('player-add-mobile')?.addEventListener('click', handleAddToPlaylist);
    document.getElementById('player-download-mobile')?.addEventListener('click', handleDownload);

    // Inicializar audio
    audioElement = new Audio();
    audioElement.addEventListener('timeupdate', updateProgress);
    audioElement.addEventListener('loadedmetadata', updateDuration);
    audioElement.addEventListener('ended', handleEnded);
    audioElement.addEventListener('error', handleAudioError);

    playerInitialized = true;
}

// ---------- FUNCIONES DE CONTROL ----------
function togglePlayPause() {
    if (!audioElement.src) return;
    if (isPlaying) {
        audioElement.pause();
        playPauseIcon.src = ICONS.play;
    } else {
        audioElement.play().catch(e => console.error('Error al reproducir:', e));
        playPauseIcon.src = ICONS.pause;
    }
    isPlaying = !isPlaying;
}

function playEpisode(ep, indexInQueue = -1) {
    if (!ep) return;
    if (!playerInitialized) createPlayerUI();

    // Si no se proporciona índice, buscamos en la cola actual
    if (indexInQueue === -1) {
        indexInQueue = currentQueue.findIndex(e => e.id === ep.id);
        if (indexInQueue === -1) {
            // Si no está en la cola, la reemplazamos con este episodio
            currentQueue = [ep];
            currentIndex = 0;
        } else {
            currentIndex = indexInQueue;
        }
    } else {
        currentIndex = indexInQueue;
    }

    const currentEp = currentQueue[currentIndex];
    if (!currentEp) return;

    // Actualizar UI
    coverEl.src = currentEp.coverUrl;
    titleEl.textContent = currentEp.title;
    authorEl.textContent = currentEp.author;
    updateMetaTags(currentEp);

    // Cargar audio
    audioElement.src = currentEp.mediaUrl;
    audioElement.load();
    audioElement.play().then(() => {
        isPlaying = true;
        playPauseIcon.src = ICONS.pause;
    }).catch(e => {
        console.error('Error al iniciar reproducción:', e);
        isPlaying = false;
        playPauseIcon.src = ICONS.play;
    });

    // Actualizar botón de añadir a playlist
    updateAddButtonState(currentEp.id);

    // Actualizar panel de cola
    renderQueuePanel();

    // Mostrar el reproductor si estaba oculto
    playerContainer.classList.remove('translate-y-full');
}

function playNext() {
    if (currentQueue.length === 0) return;
    let nextIndex;
    if (repeatMode === 'one') {
        // Repetir el mismo
        nextIndex = currentIndex;
    } else {
        nextIndex = currentIndex + 1;
        if (nextIndex >= currentQueue.length) {
            if (repeatMode === 'all') {
                nextIndex = 0;
            } else {
                // Fin de la cola, pausar
                audioElement.pause();
                isPlaying = false;
                playPauseIcon.src = ICONS.play;
                return;
            }
        }
    }
    playEpisode(currentQueue[nextIndex], nextIndex);
}

function playPrevious() {
    if (currentQueue.length === 0) return;
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
        if (repeatMode === 'all') {
            prevIndex = currentQueue.length - 1;
        } else {
            // Reiniciar actual si ha pasado más de 3 segundos
            if (audioElement.currentTime > 3) {
                audioElement.currentTime = 0;
                return;
            } else {
                return;
            }
        }
    }
    playEpisode(currentQueue[prevIndex], prevIndex);
}

function handleEnded() {
    playNext();
}

function toggleShuffle() {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle('text-purple-500', isShuffled);
    shuffleBtn.classList.toggle('text-gray-400', !isShuffled);
    if (isShuffled) {
        // Mezclar la cola (excepto el actual)
        const current = currentQueue[currentIndex];
        const rest = currentQueue.filter((_, i) => i !== currentIndex);
        for (let i = rest.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [rest[i], rest[j]] = [rest[j], rest[i]];
        }
        currentQueue = [current, ...rest];
        currentIndex = 0;
    } else {
        // Restaurar orden original (requiere guardar orden original)
        // Por simplicidad, no implementamos restauración del orden original
        // Podríamos guardar la cola original en otra variable
    }
    renderQueuePanel();
}

function toggleRepeat() {
    if (repeatMode === 'off') {
        repeatMode = 'all';
        repeatBtn.classList.add('text-purple-500');
        repeatBtn.querySelector('img').src = ICONS.repeat;
    } else if (repeatMode === 'all') {
        repeatMode = 'one';
        repeatBtn.querySelector('img').src = ICONS.repeatOne;
    } else {
        repeatMode = 'off';
        repeatBtn.classList.remove('text-purple-500');
        repeatBtn.querySelector('img').src = ICONS.repeat;
    }
}

function updateProgress() {
    if (!audioElement) return;
    const current = audioElement.currentTime;
    const duration = audioElement.duration || 0;
    const percent = (current / duration) * 100 || 0;
    progressFill.style.width = percent + '%';
    currentTimeEl.textContent = formatTime(current);
}

function updateDuration() {
    durationEl.textContent = formatTime(audioElement.duration);
}

function seek(e) {
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percent = clickX / width;
    if (audioElement.duration) {
        audioElement.currentTime = percent * audioElement.duration;
    }
}

function toggleMute() {
    if (audioElement.volume > 0) {
        audioElement.dataset.prevVolume = audioElement.volume;
        audioElement.volume = 0;
        volumeSlider.value = 0;
    } else {
        audioElement.volume = parseFloat(audioElement.dataset.prevVolume) || 1;
        volumeSlider.value = audioElement.volume;
    }
    updateVolumeIcon();
}

function updateVolumeIcon() {
    if (audioElement.volume === 0) {
        volumeIcon.querySelector('img').src = ICONS.mute;
    } else {
        volumeIcon.querySelector('img').src = ICONS.volume;
    }
}

function handleDownload() {
    const currentEp = currentQueue[currentIndex];
    if (!currentEp) return;
    if (!currentEp.allowDownload) {
        showCustomAlert(currentEp.title, 'no está disponible para descarga.');
        return;
    }
    // Intentar descarga directa
    const ext = currentEp.type === 'video' ? 'mp4' : 'mp3';
    const filename = `${currentEp.title.replace(/[^a-z0-9]/gi, '_').substring(0, 50)}.${ext}`;
    fetch(currentEp.mediaUrl, { mode: 'cors', cache: 'no-cache' })
        .then(res => {
            if (!res.ok) throw new Error('Error en respuesta');
            return res.blob();
        })
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        })
        .catch(() => {
            window.open(currentEp.mediaUrl, '_blank');
        });
}

function handleAddToPlaylist() {
    const currentEp = currentQueue[currentIndex];
    if (!currentEp) return;
    const alreadyIn = userStorage.playlist.has(currentEp.id);
    if (alreadyIn) {
        userStorage.playlist.remove(currentEp.id);
    } else {
        userStorage.playlist.add(currentEp);
    }
    updateAddButtonState(currentEp.id);
}

function updateAddButtonState(epId) {
    const inPlaylist = userStorage.playlist.has(epId);
    const icon = addToPlaylistBtn.querySelector('img');
    icon.src = inPlaylist ? ICONS.added : ICONS.add;
    icon.dataset.added = inPlaylist ? 'true' : 'false';
    // También actualizar botón móvil si existe
    const mobileAdd = document.getElementById('player-add-mobile');
    if (mobileAdd) {
        mobileAdd.querySelector('img').src = inPlaylist ? ICONS.added : ICONS.add;
    }
}

function handleShare() {
    const currentEp = currentQueue[currentIndex];
    if (!currentEp) return;
    const fullUrl = window.location.origin + currentEp.detailUrl;
    if (navigator.share) {
        navigator.share({
            title: currentEp.title,
            text: currentEp.description || 'Escucha este episodio',
            url: fullUrl
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(fullUrl).then(() => {
            showCustomAlert('', 'Enlace copiado al portapapeles');
        });
    }
}

function toggleQueuePanel() {
    queuePanel.classList.toggle('hidden');
}

function renderQueuePanel() {
    if (!queueList) return;
    let html = '';
    currentQueue.forEach((ep, idx) => {
        const isCurrent = idx === currentIndex;
        html += `
            <div class="flex items-center gap-2 p-2 ${isCurrent ? 'bg-purple-900/30' : 'hover:bg-zinc-700'} rounded cursor-pointer" data-queue-index="${idx}">
                <img src="${ep.coverUrl}" class="w-10 h-10 rounded object-cover">
                <div class="flex-1 min-w-0">
                    <h4 class="text-white text-sm truncate">${ep.title}</h4>
                    <p class="text-gray-400 text-xs truncate">${ep.author}</p>
                </div>
                ${isCurrent ? '<span class="text-purple-400 text-xs">▶</span>' : ''}
            </div>
        `;
    });
    queueList.innerHTML = html || '<p class="text-gray-400 p-4 text-center">Cola vacía</p>';
    // Agregar eventos para hacer clic en un item de la cola
    queueList.querySelectorAll('[data-queue-index]').forEach(item => {
        item.addEventListener('click', () => {
            const idx = parseInt(item.dataset.queueIndex);
            playEpisode(currentQueue[idx], idx);
            toggleQueuePanel(); // Opcional: cerrar panel al seleccionar
        });
    });
}

function handleAudioError(e) {
    console.error('Error de audio:', e);
    showCustomAlert('', 'Error al cargar el audio. Intenta de nuevo.');
    // Fallback: abrir en nueva pestaña
    const currentEp = currentQueue[currentIndex];
    if (currentEp) window.open(currentEp.mediaUrl, '_blank');
}

function showCustomAlert(title, message) {
    const fullMessage = title ? `"${title}" ${message}` : message;
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm';
    modal.innerHTML = `
        <div class="bg-zinc-900 rounded-2xl p-6 max-w-md w-[90%] border border-zinc-700 shadow-2xl">
            <h3 class="text-xl font-bold text-white mb-4">${fullMessage}</h3>
            <div class="flex justify-end">
                <button onclick="this.closest('.fixed').remove()" class="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition">Cerrar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

// ---------- EXPORTAR FUNCIÓN PRINCIPAL PARA SHOW.JS ----------
export function playEpisodeExpanded(mediaUrl, type, coverUrl, coverWide, title, detailUrl, author, categories, description, allowDownload) {
    // Crear objeto episodio compatible con DATA
    const ep = {
        id: Date.now() + Math.random(), // Generar ID temporal (idealmente debería ser el real)
        mediaUrl,
        type,
        coverUrl,
        coverWide,
        title,
        detailUrl,
        author,
        categories,
        description,
        allowDownload
    };
    // Buscar si ya existe en DATA para obtener el ID real (opcional, pero mejora consistencia)
    const realEp = DATA.find(e => e.mediaUrl === mediaUrl || e.title === title);
    if (realEp) ep.id = realEp.id;

    // Inicializar UI si no existe
    if (!playerInitialized) createPlayerUI();

    // Reemplazar cola con este episodio y reproducir
    currentQueue = [ep];
    currentIndex = 0;
    playEpisode(ep, 0);

    // Mostrar reproductor
    playerContainer.classList.remove('translate-y-full');
}

// Para compatibilidad con show.js (si usa window.playEpisodeExpanded)
window.playEpisodeExpanded = playEpisodeExpanded;

// Inicializar reproductor al cargar (oculto)
document.addEventListener('DOMContentLoaded', () => {
    createPlayerUI();
    // Ocultar inicialmente (ya tiene clase translate-y-full)
});

console.log('✅ player.js cargado - Reproductor YouTube Music listo');
