// player.js - Reproductor universal flotante (versión única, sin condicionales)

(function() {
  if (document.getElementById('playerUniversal')) return; // Evitar duplicados

  // --- HTML del reproductor (inyectado al body) ---
  const playerHTML = `
  <div id="playerUniversal" class="player-universal" style="display: none;">
    <div id="playerExpanded" class="player-expanded" style="display: none;">
      <div class="complex1 top-controls">
        <button id="mediaModeToggle" class="media-mode-toggle">
          <span class="mode-left">Audio</span>
          <span class="mode-right">Video</span>
        </button>
        <button id="minimizeBtn" class="minimize-btn">
          <img src="https://marca1.odoo.com/web/image/490-b15e1d52/minimizar.svg" alt="Minimize" loading="lazy">
        </button>
      </div>
      <div class="content-wrapper">
        <div class="complex2">
          <div id="mediaContainer" class="media-container">
            <video id="mediaElement" style="display: none;" controlsList="nodownload nofullscreen noremoteplayback" disablePictureInPicture preload="metadata"></video>
            <img id="mediaCover" style="display: block;" src="" loading="lazy">
            <div class="overlay-gradient" id="overlayGradient">
              <div class="media-controls-center">
                <button id="playPauseMedia" class="control-btn">
                  <img id="playPauseIconMedia" src="https://nikichitonjesus.odoo.com/web/image/1140-f876320c/play.svg" alt="Play" loading="lazy">
                </button>
              </div>
              <div class="media-controls-bottom">
                <button id="volumeBtn" class="volume-btn">
                  <img id="volumeIcon" src="https://marca1.odoo.com/web/image/505-b00aeb8e/volumen.svg" alt="Volume" loading="lazy">
                </button>
                <button id="fullscreenBtn" class="fullscreen-btn">
                  <img src="https://marca1.odoo.com/web/image/499-48202209/full.svg" alt="Fullscreen" loading="lazy">
                </button>
              </div>
            </div>
            <div class="seek-indicator-left" id="seekIndicatorLeft">
              <span id="seekSecondsLeft">15s</span>
              <img src="https://marca1.odoo.com/web/image/506-1607e7a0/retroceder%2015.svg" alt="Rewind" loading="lazy">
            </div>
            <div class="seek-indicator-right" id="seekIndicatorRight">
              <img src="https://marca1.odoo.com/web/image/504-db1a8f7a/avanzar%2015s.svg" alt="Forward" loading="lazy">
              <span id="seekSecondsRight">15s</span>
            </div>
            <div id="fullscreenControls" class="fullscreen-controls" style="display: none;">
              <div class="fullscreen-title" id="fullscreenTitle"></div>
              <div class="fullscreen-center-controls">
                <button id="previousFullscreen" class="control-btn">
                  <img src="https://nikichitonjesus.odoo.com/web/image/1072-2fba0e95/ant.webp" alt="Previous" loading="lazy">
                </button>
                <button id="rewindFullscreen" class="control-btn">
                  <img src="https://marca1.odoo.com/web/image/503-ed98d111/retroceder15.svg" alt="Rewind" loading="lazy">
                </button>
                <button id="playPauseFullscreen" class="control-btn">
                  <img id="playPauseIconFullscreen" src="https://nikichitonjesus.odoo.com/web/image/1140-f876320c/play.svg" alt="Play" loading="lazy">
                </button>
                <button id="forwardFullscreen" class="control-btn">
                  <img src="https://marca1.odoo.com/web/image/507-089c3773/avanzar15.svg" alt="Forward" loading="lazy">
                </button>
                <button id="nextFullscreen" class="control-btn">
                  <img src="https://nikichitonjesus.odoo.com/web/image/1068-bc302591/sig.webp" alt="Next" loading="lazy">
                </button>
              </div>
              <div class="fullscreen-bottom-bar">
                <span id="currentTimeFullscreen">00:00</span>
                <div class="video-progress-container-fullscreen" id="progressContainerFullscreen">
                  <div class="progress-bar-fullscreen" id="progressBarFullscreen"></div>
                </div>
                <span id="durationFullscreen">00:00</span>
                <button id="volumeFullscreen" class="volume-btn">
                  <img id="volumeIconFullscreen" src="https://marca1.odoo.com/web/image/505-b00aeb8e/volumen.svg" alt="Volume" loading="lazy">
                </button>
                <button id="exitFullscreenBtn" class="fullscreen-btn">
                  <img src="https://marca1.odoo.com/web/image/501-7b0e44ac/Exitfull.svg" alt="Exit Fullscreen" loading="lazy">
                </button>
              </div>
            </div>
            <div id="muteIndicator" class="mute-indicator" style="display: none;">Silenciado</div>
          </div>
        </div>
        <div class="complex3">
          <div class="episode-info" id="episodeInfo">
            <div class="left-section">
              <img src="" alt="Portada" loading="lazy">
            </div>
            <div class="center-section">
              <span id="episodeTitle"></span>
              <span class="author" id="episodeAuthor"></span>
            </div>
            <div class="right-section">
              <button id="addToPlaylistBtn">
                <img id="addToPlaylistIcon" src="https://nikichitonjesus.odoo.com/web/image/772-ea85aa4b/a%C3%B1adir%20a.png" alt="Add to Playlist" loading="lazy">
              </button>
            </div>
          </div>
          <div class="video-progress-container-expanded" id="progressContainerExpanded">
            <div class="progress-bar-expanded" id="progressBarExpanded">
              <div class="progress-knob-expanded"></div>
            </div>
          </div>
          <div class="time-info">
            <span id="currentTimeExpanded">00:00</span>
            <span id="durationExpanded">00:00</span>
          </div>
          <div class="controls">
            <div class="speed-container">
              <img id="speedIcon" src="https://nikichitonjesus.odoo.com/web/image/1113-9a93ad3a/speed.png" alt="Velocidad" loading="lazy">
            </div>
            <button id="previousExpanded">
              <img src="https://marca1.odoo.com/web/image/502-e1f7bc1b/ant.svg" alt="Previous" loading="lazy">
            </button>
            <button id="rewindExpanded">
              <img src="https://marca1.odoo.com/web/image/503-ed98d111/retroceder15.svg" alt="Rewind" loading="lazy">
            </button>
            <button id="playPauseExpanded">
              <img id="playPauseIconExpanded" src="https://nikichitonjesus.odoo.com/web/image/984-ba35a699/play.webp" alt="Play" loading="lazy">
            </button>
            <button id="forwardExpanded">
              <img src="https://marca1.odoo.com/web/image/507-089c3773/avanzar15.svg" alt="Forward" loading="lazy">
            </button>
            <button id="nextExpanded">
              <img src="https://marca1.odoo.com/web/image/500-1957f422/sig.svg" alt="Next" loading="lazy">
            </button>
            <div class="timer-container">
              <img id="timerIcon" src="https://marca1.odoo.com/web/image/512-4489ad50/tempo.svg" alt="Timer" loading="lazy">
            </div>
          </div>
          <div class="action-buttons-container">
            <div class="action-buttons" id="actionButtons">
              <button id="likesBtn" class="action-btn">
                <img id="likesIcon" src="https://marca1.odoo.com/web/image/511-0363beb5/meg.svg" alt="Me gusta" loading="lazy">
                <span>Me gusta</span>
              </button>
              <button id="downloadBtn" class="action-btn">
                <img id="downloadIcon" src="https://nikichitonjesus.odoo.com/web/image/624-ec376d7f/descargar.png" alt="Download" loading="lazy">
                <span>Descargar</span>
              </button>
              <button id="shareBtn" class="action-btn">
                <img src="https://nikichitonjesus.odoo.com/web/image/585-036b7961/cpmartir.png" alt="Share" loading="lazy">
                <span>Compartir</span>
              </button>
              <button id="repeatBtn" class="action-btn">
                <img src="https://nikichitonjesus.odoo.com/web/image/771-e8de83ec/repetir-.png" alt="Repeat" loading="lazy">
                <span>Repetir</span>
              </button>
              <button id="colaBtn" class="action-btn">
                <img src="https://marca1.odoo.com/web/image/515-2e6082a5/cola.svg" alt="Cola" loading="lazy">
                <span>Cola</span>
              </button>
              <button id="detallesBtn" class="action-btn">
                <img src="https://nikichitonjesus.odoo.com/web/image/995-7301139c/trasncrip.webp" alt="Detalles" loading="lazy">
                <span>Detalles</span>
              </button>
              <button id="bibliotecaBtn" class="action-btn">
                <img src="https://marca1.odoo.com/web/image/517-7bde9b69/Archive.svg" alt="Biblioteca" loading="lazy">
                <span>Biblioteca</span>
              </button>
            </div>
          </div>
          <div class="program-container">
            <button id="programBtn" class="full-width-btn">
              <img src="https://nikichitonjes-home.odoo.com/web/image/478-0e3df8d3/reanudar.gif" alt="Program" loading="lazy">
              <span>Programa del Día</span>
            </button>
          </div>
          <div class="tabs-text">
            <a id="linkCola"><b><span style="color: white;">A continuación</span></b></a>
            <a id="linkDetalles"><b><span style="color: white;">Detalles</span></b></a>
            <a id="linkBiblioteca"><b><span style="color: white;">Biblioteca</span></b></a>
          </div>
        </div>
      </div>
      <div class="panel-container" id="panelContainer" style="display: none;">
        <div class="panel-header">
          <div class="tabs">
            <a id="tabCola" class="tab-content active">Cola</a>
            <a id="tabDetalles" class="tab-content">Detalles</a>
            <a id="tabBiblioteca" class="tab-content">Biblioteca</a>
            <a id="tabVelocidad" class="tab-speed">Velocidad</a>
            <a id="tabTemporizador" class="tab-timer">Temporizador</a>
          </div>
          <div class="panel-controls">
            <button id="togglePanelHeightBtn">
              <img src="https://marca1.odoo.com/web/image/513-e0bcd17f/maz.svg" alt="Ampliar/Minimizar" loading="lazy">
            </button>
            <button id="closePanelBtn">
              <img src="https://marca1.odoo.com/web/image/518-a62b303e/cierra.svg" alt="Cerrar" loading="lazy">
            </button>
          </div>
        </div>
        <div class="panel-content">
          <div id="colaContent" class="panel-section active">
            <div class="next-items" id="nextItems"></div>
            <div class="separator" id="recomendadosSeparator" style="display: none;">
              <hr>
              <h4>Recomendados</h4>
            </div>
            <div class="recomendados-items" id="recomendadosItems"></div>
          </div>
          <div id="detallesContent" class="panel-section">
            <div class="text-content" id="textContent"></div>
          </div>
          <div id="bibliotecaContent" class="panel-section">
            <div class="likes-section">
              <h4>Tus me gusta</h4>
              <button id="viewAllLikes">Ver todo</button>
              <div id="likesView" class="likes-view carousel">
                <div class="likes-carousel" id="likesCarousel"></div>
              </div>
            </div>
            <div class="playlist-section">
              <h4>Tu lista</h4>
              <div class="playlist-items" id="playlistItems"></div>
              <button id="playUserPlaylistBtn">Reproducir esta lista</button>
            </div>
          </div>
          <div id="velocidadContent" class="panel-section">
            <div class="options-panel">
              <span id="currentSpeed">1x</span>
              <input type="range" id="speedSlider" min="0.25" max="2" step="0.25" value="1">
              <div class="speed-labels">
                <span>0.25x</span><span>0.5x</span><span>0.75x</span><span>1x</span><span>1.25x</span><span>1.5x</span><span>1.75x</span><span>2x</span>
              </div>
            </div>
          </div>
          <div id="temporizadorContent" class="panel-section">
            <div id="timerCountdown" style="display: none;">
              <span id="countdownDisplay"></span>
              <button id="deactivateTimer">Desactivar temporizador</button>
            </div>
            <div id="timerOptions" class="options-panel timer-options">
              <button data-value="5">5 min</button>
              <button data-value="10">10 min</button>
              <button data-value="15">15 min</button>
              <button data-value="30">30 min</button>
              <button data-value="45">45 min</button>
              <button data-value="60">1 hora</button>
              <button data-value="end">Fin del episodio</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="playerMinimized" class="player-minimized">
      <div class="video-progress-container-minimized" id="progressContainerMinimized">
        <div class="progress-bar-minimized" id="progressBarMinimized">
          <div class="progress-knob-minimized"></div>
        </div>
      </div>
      <div class="minimized-content">
        <div class="minimized-cover">
          <img id="minimizedCover" src="" alt="Portada" loading="lazy">
        </div>
        <div class="minimized-title-container">
          <span id="episodeTitleMinimized" class="minimized-title"></span>
        </div>
        <div class="minimized-controls">
          <button id="rewindMinimized">
            <img src="https://marca1.odoo.com/web/image/503-ed98d111/retroceder15.svg" alt="Rewind" loading="lazy">
          </button>
          <button id="playPauseMinimized">
            <img id="playPauseIconMinimized" src="https://marca1.odoo.com/web/image/508-f876320c/play.svg" alt="Play" loading="lazy">
          </button>
          <button id="forwardMinimized">
            <img src="https://marca1.odoo.com/web/image/507-089c3773/avanzar15.svg" alt="Fast Forward" loading="lazy">
          </button>
          <button id="expandBtn">
            <img src="https://marca1.odoo.com/web/image/516-3ecd56b1/full-2.svg" alt="Expand" loading="lazy">
          </button>
        </div>
      </div>
    </div>
  </div>
  `;

  // Insertar el reproductor en el body
  document.body.insertAdjacentHTML('beforeend', playerHTML);

  // --- Variables globales y referencias ---
  let specialPlayer = null;
  let playlist = JSON.parse(localStorage.getItem('playlist')) || [];
  let likes = JSON.parse(localStorage.getItem('likes')) || [];
  let historyList = JSON.parse(localStorage.getItem('history')) || [];
  let currentIndex = -1;
  let nextList = [];
  let recomendados = window.RECOMENDADOS || [];
  let cachedRecomendados = [];
  let episodeText = '';
  let episodeAuthor = 'Roberto';
  let activeList = 'next';
  let userPlaylistAutoPlay = false;
  let timerValue = 0;
  let timerId = null;
  let timerCountdownInterval = null;
  let tapCount = 0;
  let tapSide = '';
  let lastTapTime = 0;
  let tapTimeout = null;
  let isAudioMode = true;
  let isFullscreenMode = false;
  let repeatMode = 0;
  let currentEpisodeId = null;
  let showControls = false;
  let isAutoMuted = false;
  let isUserMuted = false;
  let likesViewMode = 'carousel';
  let playerBgColor = '#6a8caf'; // Color por defecto (azul marino pálido)

  // Elementos del DOM
  const playerUniversal = document.getElementById('playerUniversal');
  const playerExpanded = document.getElementById('playerExpanded');
  const playerMinimized = document.getElementById('playerMinimized');
  let mediaElement = document.getElementById('mediaElement');
  const mediaCover = document.getElementById('mediaCover');
  const mediaContainer = document.getElementById('mediaContainer');
  const minimizeBtn = document.getElementById('minimizeBtn');
  const mediaModeToggle = document.getElementById('mediaModeToggle');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const volumeBtn = document.getElementById('volumeBtn');
  const volumeIcon = document.getElementById('volumeIcon');
  const expandBtn = document.getElementById('expandBtn');
  const episodeInfo = document.getElementById('episodeInfo');
  const episodeTitle = document.getElementById('episodeTitle');
  const episodeTitleMinimized = document.getElementById('episodeTitleMinimized');
  const episodeAuthorElem = document.getElementById('episodeAuthor');
  const minimizedCover = document.getElementById('minimizedCover');
  const progressContainerExpanded = document.getElementById('progressContainerExpanded');
  const progressBarExpanded = document.getElementById('progressBarExpanded');
  const progressContainerMinimized = document.getElementById('progressContainerMinimized');
  const progressBarMinimized = document.getElementById('progressBarMinimized');
  const currentTimeExpanded = document.getElementById('currentTimeExpanded');
  const durationExpanded = document.getElementById('durationExpanded');
  const playPauseExpanded = document.getElementById('playPauseExpanded');
  const playPauseIconExpanded = document.getElementById('playPauseIconExpanded');
  const playPauseMinimized = document.getElementById('playPauseMinimized');
  const playPauseIconMinimized = document.getElementById('playPauseIconMinimized');
  const rewindExpanded = document.getElementById('rewindExpanded');
  const forwardExpanded = document.getElementById('forwardExpanded');
  const previousExpanded = document.getElementById('previousExpanded');
  const nextExpanded = document.getElementById('nextExpanded');
  const rewindMinimized = document.getElementById('rewindMinimized');
  const forwardMinimized = document.getElementById('forwardMinimized');
  const speedIcon = document.getElementById('speedIcon');
  const speedSlider = document.getElementById('speedSlider');
  const currentSpeed = document.getElementById('currentSpeed');
  const timerIcon = document.getElementById('timerIcon');
  const timerOptions = document.getElementById('timerOptions');
  const timerCountdown = document.getElementById('timerCountdown');
  const countdownDisplay = document.getElementById('countdownDisplay');
  const deactivateTimer = document.getElementById('deactivateTimer');
  const downloadBtn = document.getElementById('downloadBtn');
  const downloadIcon = document.getElementById('downloadIcon');
  const shareBtn = document.getElementById('shareBtn');
  const programBtn = document.getElementById('programBtn');
  const repeatBtn = document.getElementById('repeatBtn');
  const addToPlaylistBtn = document.getElementById('addToPlaylistBtn');
  const addToPlaylistIcon = document.getElementById('addToPlaylistIcon');
  const colaBtn = document.getElementById('colaBtn');
  const detallesBtn = document.getElementById('detallesBtn');
  const bibliotecaBtn = document.getElementById('bibliotecaBtn');
  const likesBtn = document.getElementById('likesBtn');
  const likesIcon = document.getElementById('likesIcon');
  const panelContainer = document.getElementById('panelContainer');
  const likesCarousel = document.getElementById('likesCarousel');
  const playlistItems = document.getElementById('playlistItems');
  const closePanelBtn = document.getElementById('closePanelBtn');
  const togglePanelHeightBtn = document.getElementById('togglePanelHeightBtn');
  const nextItems = document.getElementById('nextItems');
  const recomendadosItems = document.getElementById('recomendadosItems');
  const recomendadosSeparator = document.getElementById('recomendadosSeparator');
  const textContent = document.getElementById('textContent');
  const tabCola = document.getElementById('tabCola');
  const tabDetalles = document.getElementById('tabDetalles');
  const tabBiblioteca = document.getElementById('tabBiblioteca');
  const tabVelocidad = document.getElementById('tabVelocidad');
  const tabTemporizador = document.getElementById('tabTemporizador');
  const colaContent = document.getElementById('colaContent');
  const detallesContent = document.getElementById('detallesContent');
  const bibliotecaContent = document.getElementById('bibliotecaContent');
  const velocidadContent = document.getElementById('velocidadContent');
  const temporizadorContent = document.getElementById('temporizadorContent');
  const linkCola = document.getElementById('linkCola');
  const linkDetalles = document.getElementById('linkDetalles');
  const linkBiblioteca = document.getElementById('linkBiblioteca');
  const speedContainer = document.querySelector('.speed-container');
  const timerContainer = document.querySelector('.timer-container');
  const overlayGradient = document.getElementById('overlayGradient');
  const playPauseMedia = document.getElementById('playPauseMedia');
  const playPauseIconMedia = document.getElementById('playPauseIconMedia');
  const seekIndicatorLeft = document.getElementById('seekIndicatorLeft');
  const seekSecondsLeft = document.getElementById('seekSecondsLeft');
  const seekIndicatorRight = document.getElementById('seekIndicatorRight');
  const seekSecondsRight = document.getElementById('seekSecondsRight');
  const fullscreenControls = document.getElementById('fullscreenControls');
  const fullscreenTitle = document.getElementById('fullscreenTitle');
  const progressContainerFullscreen = document.getElementById('progressContainerFullscreen');
  const progressBarFullscreen = document.getElementById('progressBarFullscreen');
  const currentTimeFullscreen = document.getElementById('currentTimeFullscreen');
  const durationFullscreen = document.getElementById('durationFullscreen');
  const playPauseFullscreen = document.getElementById('playPauseFullscreen');
  const playPauseIconFullscreen = document.getElementById('playPauseIconFullscreen');
  const rewindFullscreen = document.getElementById('rewindFullscreen');
  const forwardFullscreen = document.getElementById('forwardFullscreen');
  const previousFullscreen = document.getElementById('previousFullscreen');
  const nextFullscreen = document.getElementById('nextFullscreen');
  const volumeFullscreen = document.getElementById('volumeFullscreen');
  const volumeIconFullscreen = document.getElementById('volumeIconFullscreen');
  const exitFullscreenBtn = document.getElementById('exitFullscreenBtn');
  const muteIndicator = document.getElementById('muteIndicator');
  const viewAllLikes = document.getElementById('viewAllLikes');
  const likesView = document.getElementById('likesView');
  const progressKnobFullscreen = document.createElement('div');
  progressKnobFullscreen.className = 'progress-knob-fullscreen';
  progressBarFullscreen.appendChild(progressKnobFullscreen);

  let currentMedia = null;
  let isExpanded = false;
  let isHidden = false;
  let isLooping = false;
  let isMuted = false;
  let isDraggingExpanded = false;
  let isDraggingMinimized = false;
  let isDraggingFullscreen = false;
  let touchStartY = 0;
  let touchEndY = 0;
  let swipeThreshold = 100;
  let isSwiping = false;
  let isPanelFullHeight = false;

  // Grupos de pestañas (se mantienen por compatibilidad, pero ya no se usa para responsive)
  const groups = {
    content: ['cola', 'detalles', 'biblioteca'],
    speed: ['velocidad'],
    timer: ['temporizador']
  };

  const getGroup = (tab) => {
    for (let g in groups) {
      if (groups[g].includes(tab)) return g;
    }
    return 'content';
  };

  const updateVisibleTabs = (group) => {
    document.querySelectorAll('.tabs a').forEach(t => {
      t.classList.remove('visible');
      const tabName = t.id.replace('tab', '').toLowerCase();
      if (groups[group].includes(tabName)) {
        t.classList.add('visible');
      }
    });
  };

  // --- Funciones de utilidad ---
  const throttle = (func, limit) => {
    let lastCall = null;
    return (...args) => {
      const now = Date.now();
      if (!lastCall || now - lastCall > limit) {
        lastCall = now;
        return func(...args);
      }
    };
  };
  const throttledSaveState = throttle(saveState, 500);

  const loadImageWithFallback = (imgElement, src, alt, fallbackSrc) => {
    imgElement.src = src;
    imgElement.alt = alt;
    imgElement.onerror = () => {
      imgElement.src = fallbackSrc || 'https://via.placeholder.com/24';
      imgElement.onerror = null;
    };
  };

  const cleanEvents = () => {
    mediaElement.removeEventListener('timeupdate', updateProgress);
    mediaElement.removeEventListener('loadedmetadata', updateProgress);
    mediaElement.removeEventListener('volumechange', checkMute);
    mediaElement.removeEventListener('ended', handleMediaEnd);
    const newMediaElement = mediaElement.cloneNode(true);
    mediaElement.parentNode.replaceChild(newMediaElement, mediaElement);
    mediaElement = newMediaElement;
    mediaElement.addEventListener('timeupdate', updateProgress);
    mediaElement.addEventListener('loadedmetadata', updateProgress);
    mediaElement.addEventListener('volumechange', checkMute);
    mediaElement.addEventListener('ended', handleMediaEnd);
  };

  const mapEpisodeToMedia = (item) => {
    return {
      mediaUrl: item.mediaUrl || '',
      mediaType: item.type || 'audio',
      coverUrlContainer: item.coverUrl || '',
      coverUrlInfo: item.series?.portada_serie || item.coverUrl || '',
      title: item.title || '',
      detailUrl: item.detailUrl || '',
      author: item.series?.titulo_serie || 'Unknown',
      next: [],
      text: item.description || '',
      allowDownload: true
    };
  };

  // --- Persistencia ---
  function saveState() {
    const state = {
      mediaUrl: currentMedia?.mediaUrl,
      mediaType: currentMedia?.mediaType,
      coverUrlContainer: currentMedia?.coverUrlContainer,
      coverUrlInfo: currentMedia?.coverUrlInfo,
      title: currentMedia?.title,
      detailUrl: currentMedia?.detailUrl,
      author: currentMedia?.author,
      next: currentMedia?.next,
      text: currentMedia?.text,
      allowDownload: currentMedia?.allowDownload,
      currentTime: mediaElement.currentTime,
      isPlaying: !mediaElement.paused,
      playbackRate: mediaElement.playbackRate,
      isExpanded: isExpanded,
      isHidden: isHidden,
      isLooping: isLooping,
      isMuted: mediaElement.muted,
      isAudioMode: isAudioMode,
      activeList: activeList,
      userPlaylistAutoPlay: userPlaylistAutoPlay,
      timerValue: timerValue,
      repeatMode: repeatMode,
      bgColor: playerBgColor
    };
    localStorage.setItem('playerState', JSON.stringify(state));
    localStorage.setItem('playlist', JSON.stringify(playlist));
    localStorage.setItem('likes', JSON.stringify(likes));
    localStorage.setItem('history', JSON.stringify(historyList));
  }

  function loadState() {
    const state = JSON.parse(localStorage.getItem('playerState')) || {};
    if (state.bgColor) {
      playerBgColor = state.bgColor;
      applyBgColor();
    }
    if (state.mediaUrl) {
      loadMedia(
        state.mediaUrl,
        state.mediaType,
        state.coverUrlContainer,
        state.coverUrlInfo,
        state.title,
        state.detailUrl,
        state.author || 'Roberto',
        state.next || [],
        state.text || '',
        state.allowDownload || true
      );
      mediaElement.addEventListener('canplay', () => {
        mediaElement.currentTime = state.currentTime || 0;
        mediaElement.playbackRate = state.playbackRate || 1;
        mediaElement.muted = state.isMuted || false;
        isAudioMode = state.isAudioMode || true;
        updateMediaMode();
        if (state.isPlaying) {
          playWithFallback();
          updateIcons(true);
          updateOpenPlayerButton(true);
        } else {
          mediaElement.pause();
          updateIcons(false);
          updateOpenPlayerButton(false);
        }
      }, { once: true });
      updateSpeedButtons(state.playbackRate || 1);
      repeatMode = state.repeatMode || 0;
      updateRepeatButton();
      activeList = state.activeList || 'next';
      userPlaylistAutoPlay = state.userPlaylistAutoPlay || false;
      timerValue = state.timerValue || 0;
      if (timerValue !== 0) {
        setupTimer();
      }
      showMinimized();
      updatePlaylist();
      updateLikes();
      updateModeToggleState();
      cachedRecomendados = [...window.RECOMENDADOS];
    } else {
      const programa = window.PROGRAMA_DEL_DIA || {
        mediaUrl: 'https://awscdn.podcasts.com/audio-vhhlggMJNysHnLYW8KXAQwu4w.mp3',
        mediaType: 'audio',
        coverUrlContainer: 'https://s3.amazonaws.com/podcasts-image-uploads/el-populismo-y-la-democracia-jesus-huerta-de-soto-1400x1400.png',
        coverUrlInfo: 'https://www.edu.balta.lat/web/image/415-8ae27244/media.png',
        title: 'El populismo y la democracia',
        detailUrl: '#',
        author: "Jesús Huerta de Soto",
        text: "No disponible",
        allowDownload: true
      };
      loadMedia(programa.mediaUrl, programa.mediaType, programa.coverUrlContainer, programa.coverUrlInfo, programa.title, programa.detailUrl, programa.author, [], programa.text, programa.allowDownload);
      showMinimized();
      cachedRecomendados = [...window.RECOMENDADOS];
    }
    updateMediaSession();
  }

  // --- Aplicar color de fondo dinámico ---
  function applyBgColor() {
    playerExpanded.style.backgroundColor = playerBgColor;
    playerMinimized.style.backgroundColor = playerBgColor;
    // El degradado oscuro se aplica mediante CSS con pseudo-elemento
  }

  // --- Funciones del reproductor (play, pause, etc.) ---
  const playWithFallback = () => {
    mediaElement.muted = isMuted;
    mediaElement.play().then(() => {
      updateIcons(true);
      updateAllItemIcons(true);
      isAutoMuted = false;
      updateMediaSession();
      updateOpenPlayerButton(true);
    }).catch((error) => {
      console.log("Autoplay blocked, trying muted:", error);
      mediaElement.muted = true;
      isMuted = true;
      isAutoMuted = true;
      isUserMuted = false;
      mediaElement.play().then(() => {
        updateIcons(true);
        updateAllItemIcons(true);
        showMuteIndicator();
        updateMediaSession();
        updateOpenPlayerButton(true);
      }).catch((err) => {
        console.log("Play failed:", err);
      });
    });
  };

  const showMuteIndicator = () => {
    if (isAutoMuted && !isUserMuted) {
      muteIndicator.style.display = 'block';
    } else {
      muteIndicator.style.display = 'none';
    }
  };

  const updateMediaMode = () => {
    mediaModeToggle.classList.toggle('audio', isAudioMode);
    mediaModeToggle.classList.toggle('video', !isAudioMode);
    if (isAudioMode) {
      mediaElement.style.display = 'none';
      mediaCover.style.display = 'block';
      mediaModeToggle.querySelector('.mode-right').classList.add('disabled');
    } else {
      if (currentMedia.mediaType === 'video') {
        mediaElement.style.display = 'block';
        mediaCover.style.display = 'none';
        mediaModeToggle.querySelector('.mode-right').classList.remove('disabled');
      } else {
        mediaElement.style.display = 'none';
        mediaCover.style.display = 'block';
        mediaModeToggle.querySelector('.mode-right').classList.add('disabled');
      }
    }
  };

  const toggleMediaMode = () => {
    if (currentMedia.mediaType === 'video') {
      isAudioMode = !isAudioMode;
      updateMediaMode();
      updateModeToggleState();
      throttledSaveState();
    }
  };

  const updateModeToggleState = () => {
    const toggle = document.getElementById('mediaModeToggle');
    if (!toggle) return;
    const left = toggle.querySelector('.mode-left');
    const right = toggle.querySelector('.mode-right');
    toggle.classList.remove('disabled', 'audio', 'video', 'active-left', 'active-right');
    left.classList.remove('active');
    right.classList.remove('active');
    if (!currentMedia || currentMedia.mediaType !== 'video') {
      toggle.classList.add('disabled');
      toggle.classList.add('audio');
      left.classList.add('active');
    } else {
      toggle.classList.remove('disabled');
      if (isAudioMode) {
        toggle.classList.add('audio', 'active-left');
        left.classList.add('active');
      } else {
        toggle.classList.add('video', 'active-right');
        right.classList.add('active');
      }
    }
  };

  const updateDownloadButton = () => {
    if (currentMedia.allowDownload) {
      downloadBtn.classList.remove('disabled');
      loadImageWithFallback(downloadIcon, 'https://nikichitonjesus.odoo.com/web/image/624-ec376d7f/descargar.png', 'Download', 'https://via.placeholder.com/20');
    } else {
      downloadBtn.classList.add('disabled');
      loadImageWithFallback(downloadIcon, 'https://nikichitonjesus.odoo.com/web/image/1051-622a3db3/no-desc.webp', 'Download Disabled', 'https://via.placeholder.com/20');
    }
  };

  const updateAddButton = () => {
    if (playlist.some(item => item.mediaUrl === currentMedia?.mediaUrl)) {
      loadImageWithFallback(addToPlaylistIcon, 'https://nikichitonjesus.odoo.com/web/image/1112-d141b3eb/a%C3%B1adido.png', 'Added', 'https://via.placeholder.com/20');
    } else {
      loadImageWithFallback(addToPlaylistIcon, 'https://nikichitonjesus.odoo.com/web/image/772-ea85aa4b/a%C3%B1adir%20a.png', 'Add to Playlist', 'https://via.placeholder.com/20');
    }
  };

  const updateLikesButton = () => {
    if (likes.some(item => item.mediaUrl === currentMedia?.mediaUrl)) {
      loadImageWithFallback(likesIcon, 'https://nikichitonjesus.odoo.com/web/image/1069-2ad205f2/megus.webp', 'Liked', 'https://via.placeholder.com/20');
      likesBtn.querySelector('span').textContent = 'Te gusta';
    } else {
      loadImageWithFallback(likesIcon, 'https://marca1.odoo.com/web/image/511-0363beb5/meg.svg', 'Me gusta', 'https://via.placeholder.com/20');
      likesBtn.querySelector('span').textContent = 'Me gusta';
    }
  };

  const toggleLikes = () => {
    if (!currentMedia) return;
    const index = likes.findIndex(item => item.mediaUrl === currentMedia.mediaUrl);
    if (index > -1) {
      likes.splice(index, 1);
    } else {
      likes.unshift({ ...currentMedia, addedDate: Date.now() });
    }
    localStorage.setItem('likes', JSON.stringify(likes));
    updateLikes();
    updateLikesButton();
    throttledSaveState();
  };

  const updateLikes = () => {
    likesCarousel.innerHTML = '';
    likes.sort((a, b) => b.addedDate - a.addedDate);
    likesView.className = 'likes-view ' + likesViewMode;
    if (likes.length > 0) {
      likes.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'likes-item';
        div.innerHTML = `
          <img src="${item.coverUrlInfo || 'https://via.placeholder.com/80'}" alt="Cover" loading="lazy">
          <span>${item.title}</span>
        `;
        div.addEventListener('click', (e) => {
          e.stopPropagation();
          loadMedia(item.mediaUrl, item.mediaType, item.coverUrlContainer, item.coverUrlInfo, item.title, item.detailUrl, item.author, item.next, item.text, item.allowDownload);
          togglePlayPause(true);
          throttledSaveState();
        });
        likesCarousel.appendChild(div);
      });
    } else {
      likesCarousel.innerHTML = '<div class="no-items">No hay me gusta</div>';
    }
  };

  const toggleLikesView = () => {
    likesViewMode = likesViewMode === 'carousel' ? 'grid' : 'carousel';
    updateLikes();
    viewAllLikes.textContent = likesViewMode === 'grid' ? 'Ver carrusel' : 'Ver todo';
  };

  const updatePlaylist = () => {
    playlistItems.innerHTML = '';
    if (playlist.length > 0) {
      playlist.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'playlist-item';
        div.draggable = true;
        div.dataset.index = index;
        if (item.mediaUrl === currentMedia?.mediaUrl) {
          div.classList.add('active');
        }
        div.innerHTML = `
          <img class="cover" src="${item.coverUrlInfo || 'https://via.placeholder.com/30'}" alt="Cover" loading="lazy">
          <span>${item.title}</span>
          <div class="item-controls">
            <button class="item-play-pause">
              <img src="${(item.mediaUrl === currentMedia?.mediaUrl) ? (mediaElement.paused ? 'https://marca1.odoo.com/web/image/508-f876320c/play.svg' : 'https://nikichitonjesus.odoo.com/web/image/983-5c0bffd9/Pause.webp') : 'https://marca1.odoo.com/web/image/508-f876320c/play.svg'}" alt="Play/Pause" loading="lazy">
            </button>
            <button class="remove-playlist-item" data-index="${index}">
              <img src="https://niki-chiton-jesus.odoo.com/web/image/457-5d13d269/remove.webp" alt="Remove" loading="lazy">
            </button>
            <div class="drag-handle">
              <img src="https://nikichitonjesus.odoo.com/web/image/813-b2644056/listbtn.webp" alt="Drag" loading="lazy">
            </div>
          </div>
        `;
        div.addEventListener('click', (e) => {
          if (!e.target.closest('.remove-playlist-item') && !e.target.closest('.drag-handle') && !e.target.closest('.item-play-pause')) {
            e.stopPropagation();
            currentIndex = index;
            loadMedia(item.mediaUrl, item.mediaType, item.coverUrlContainer, item.coverUrlInfo, item.title, item.detailUrl, item.author, playlist, item.text, item.allowDownload);
            togglePlayPause(true);
            throttledSaveState();
          }
        });
        div.querySelector('.item-play-pause').addEventListener('click', (e) => {
          e.stopPropagation();
          if (item.mediaUrl !== currentMedia?.mediaUrl) {
            currentIndex = index;
            loadMedia(item.mediaUrl, item.mediaType, item.coverUrlContainer, item.coverUrlInfo, item.title, item.detailUrl, item.author, playlist, item.text, item.allowDownload);
          }
          togglePlayPause();
        });
        playlistItems.appendChild(div);
      });
      document.querySelectorAll('.remove-playlist-item').forEach(button => {
        button.addEventListener('click', (e) => {
          e.stopPropagation();
          const index = parseInt(e.target.closest('button').dataset.index);
          playlist.splice(index, 1);
          localStorage.setItem('playlist', JSON.stringify(playlist));
          if (index <= currentIndex) {
            currentIndex--;
          }
          updatePlaylist();
          updateAddButton();
        });
      });
      setupPlaylistDrag();
    } else {
      playlistItems.innerHTML = '<div class="no-items">No has agregado tus episodios</div>';
    }
  };

  const setupPlaylistDrag = () => {
    const items = playlistItems.querySelectorAll('.playlist-item');
    items.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', item.dataset.index);
        item.classList.add('dragging');
      });
      item.addEventListener('dragend', (e) => {
        item.classList.remove('dragging');
      });
      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        const dragging = playlistItems.querySelector('.dragging');
        if (dragging !== item) {
          const from = parseInt(dragging.dataset.index);
          const to = parseInt(item.dataset.index);
          if (from < to) {
            item.after(dragging);
          } else {
            item.before(dragging);
          }
          const newItems = playlistItems.querySelectorAll('.playlist-item');
          newItems.forEach((it, idx) => it.dataset.index = idx);
          const temp = playlist[from];
          playlist.splice(from, 1);
          playlist.splice(to, 0, temp);
          localStorage.setItem('playlist', JSON.stringify(playlist));
          currentIndex = playlist.findIndex(p => p.mediaUrl === currentMedia.mediaUrl);
        }
      });
      item.addEventListener('drop', (e) => {
        e.preventDefault();
      });
      item.addEventListener('touchstart', (e) => {
        if (e.target.closest('.drag-handle')) {
          item.classList.add('dragging');
        }
      });
      item.addEventListener('touchmove', (e) => {
        if (item.classList.contains('dragging')) {
          e.preventDefault();
        }
      });
      item.addEventListener('touchend', (e) => {
        item.classList.remove('dragging');
      });
    });
  };

  const updateNextList = () => {
    nextItems.innerHTML = '';
    if (nextList.length > 0) {
      nextList.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'next-item';
        if (item.mediaUrl === currentMedia?.mediaUrl) {
          div.classList.add('active');
        }
        div.innerHTML = `
          <img class="cover" src="${item.coverUrlInfo || 'https://via.placeholder.com/30'}" alt="Cover" loading="lazy">
          <span>${item.title}</span>
          <div class="item-controls">
            <button class="item-play-pause">
              <img src="${(item.mediaUrl === currentMedia?.mediaUrl) ? (mediaElement.paused ? 'https://marca1.odoo.com/web/image/508-f876320c/play.svg' : 'https://nikichitonjesus.odoo.com/web/image/983-5c0bffd9/Pause.webp') : 'https://marca1.odoo.com/web/image/508-f876320c/play.svg'}" alt="Play/Pause" loading="lazy">
            </button>
          </div>
        `;
        div.addEventListener('click', (e) => {
          e.stopPropagation();
          currentIndex = index;
          loadMedia(item.mediaUrl, item.mediaType, item.coverUrlContainer, item.coverUrlInfo, item.title, item.detailUrl, item.author, nextList, item.text, item.allowDownload);
          togglePlayPause(true);
          throttledSaveState();
        });
        div.querySelector('.item-play-pause').addEventListener('click', (e) => {
          e.stopPropagation();
          if (item.mediaUrl !== currentMedia?.mediaUrl) {
            currentIndex = index;
            loadMedia(item.mediaUrl, item.mediaType, item.coverUrlContainer, item.coverUrlInfo, item.title, item.detailUrl, item.author, nextList, item.text, item.allowDownload);
          }
          togglePlayPause();
        });
        nextItems.appendChild(div);
      });
    } else {
      nextItems.innerHTML = '<div class="no-items">Episodio único</div>';
    }
  };

  const updateRecomendadosList = () => {
    if (cachedRecomendados.length === 0) {
      cachedRecomendados = [...window.RECOMENDADOS];
    }
    recomendadosItems.innerHTML = '';
    if (cachedRecomendados.length > 0) {
      recomendadosSeparator.style.display = 'block';
      cachedRecomendados.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'next-item';
        div.innerHTML = `
          <img class="cover" src="${item.coverUrl || 'https://via.placeholder.com/30'}" alt="Cover" loading="lazy">
          <span>${item.title}</span>
          <div class="item-controls">
            <button class="item-play-pause">
              <img src="${(item.mediaUrl === currentMedia?.mediaUrl) ? (mediaElement.paused ? 'https://marca1.odoo.com/web/image/508-f876320c/play.svg' : 'https://nikichitonjesus.odoo.com/web/image/983-5c0bffd9/Pause.webp') : 'https://marca1.odoo.com/web/image/508-f876320c/play.svg'}" alt="Play/Pause" loading="lazy">
            </button>
          </div>
        `;
        div.addEventListener('click', (e) => {
          e.stopPropagation();
          const mappedItem = mapEpisodeToMedia(item);
          loadMedia(
            mappedItem.mediaUrl,
            mappedItem.mediaType,
            mappedItem.coverUrlContainer,
            mappedItem.coverUrlInfo,
            mappedItem.title,
            mappedItem.detailUrl,
            mappedItem.author,
            mappedItem.next,
            mappedItem.text,
            mappedItem.allowDownload,
            true,
            index
          );
          togglePlayPause(true);
          throttledSaveState();
        });
        div.querySelector('.item-play-pause').addEventListener('click', (e) => {
          e.stopPropagation();
          if (item.mediaUrl !== currentMedia?.mediaUrl) {
            const mappedItem = mapEpisodeToMedia(item);
            loadMedia(
              mappedItem.mediaUrl,
              mappedItem.mediaType,
              mappedItem.coverUrlContainer,
              mappedItem.coverUrlInfo,
              mappedItem.title,
              mappedItem.detailUrl,
              mappedItem.author,
              mappedItem.next,
              mappedItem.text,
              mappedItem.allowDownload,
              true,
              index
            );
          }
          togglePlayPause();
        });
        recomendadosItems.appendChild(div);
      });
    } else {
      recomendadosSeparator.style.display = 'none';
    }
  };

  const updateTextContent = () => {
    textContent.innerHTML = `<h4>${currentMedia?.title || ''}</h4><p>${episodeText || 'No hay texto disponible'}</p>`;
  };

  const showExpanded = () => {
    isExpanded = true;
    isHidden = false;
    playerExpanded.style.display = 'flex';
    playerMinimized.style.display = 'none';
    throttledSaveState();
    updatePlaylist();
    updateLikes();
    updateNextList();
    updateRecomendadosList();
    updateTextContent();
    checkTitleOverflow();
    checkMinimizedTitleOverflow();
  };

  const showMinimized = () => {
    isExpanded = false;
    isHidden = false;
    playerExpanded.style.display = 'none';
    playerMinimized.style.display = 'flex';
    panelContainer.style.display = 'none';
    throttledSaveState();
    checkTitleOverflow();
    checkMinimizedTitleOverflow();
  };

  const hidePlayer = () => {
    isHidden = true;
    playerExpanded.style.display = 'none';
    playerMinimized.style.display = 'none';
    panelContainer.style.display = 'none';
    throttledSaveState();
  };

  const togglePanel = (tab = 'cola') => {
    const wasVisible = panelContainer.style.display === 'flex';
    panelContainer.style.display = wasVisible ? 'none' : 'flex';
    if (panelContainer.style.display === 'flex') {
      const group = getGroup(tab);
      updateVisibleTabs(group);
      switchTab(tab);
      closePanelBtn.classList.add('visible');
      isPanelFullHeight = false;
      panelContainer.classList.remove('full-height');
      togglePanelHeightBtn.querySelector('img').src = 'https://marca1.odoo.com/web/image/513-e0bcd17f/maz.svg';
      minimizeBtn.style.position = 'fixed';
      minimizeBtn.style.bottom = 'auto';
      minimizeBtn.style.top = 'max(12px, env(safe-area-inset-top))';
    } else {
      closePanelBtn.classList.remove('visible');
    }
  };

  const togglePanelHeight = () => {
    isPanelFullHeight = !isPanelFullHeight;
    panelContainer.classList.toggle('full-height', isPanelFullHeight);
    togglePanelHeightBtn.querySelector('img').src = isPanelFullHeight ? 'https://marca1.odoo.com/web/image/514-efa5e8dd/minimizar.svg' : 'https://marca1.odoo.com/web/image/513-e0bcd17f/maz.svg';
    if (isPanelFullHeight) {
      minimizeBtn.style.position = 'absolute';
      minimizeBtn.style.bottom = '10px';
      minimizeBtn.style.top = 'auto';
    } else {
      minimizeBtn.style.position = 'fixed';
      minimizeBtn.style.bottom = 'auto';
      minimizeBtn.style.top = 'max(12px, env(safe-area-inset-top))';
    }
  };

  const switchTab = (tab) => {
    document.querySelectorAll('.tabs a').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel-section').forEach(s => s.classList.remove('active'));
    if (tab === 'cola') {
      tabCola.classList.add('active');
      colaContent.classList.add('active');
    } else if (tab === 'detalles') {
      tabDetalles.classList.add('active');
      detallesContent.classList.add('active');
    } else if (tab === 'biblioteca') {
      tabBiblioteca.classList.add('active');
      bibliotecaContent.classList.add('active');
    } else if (tab === 'velocidad') {
      tabVelocidad.classList.add('active');
      velocidadContent.classList.add('active');
    } else if (tab === 'temporizador') {
      tabTemporizador.classList.add('active');
      temporizadorContent.classList.add('active');
      updateTimerView();
    }
  };

  const updateTimerView = () => {
    if (timerValue !== 0 && timerValue !== '0') {
      timerCountdown.style.display = 'flex';
      timerOptions.style.display = 'none';
    } else {
      timerCountdown.style.display = 'none';
      timerOptions.style.display = 'block';
    }
  };

  const updateIcons = (isPlaying) => {
    const playIcon = 'https://marca1.odoo.com/web/image/508-f876320c/play.svg';
    const pauseIcon = 'https://nikichitonjesus.odoo.com/web/image/983-5c0bffd9/Pause.webp';
    loadImageWithFallback(playPauseIconExpanded, isPlaying ? pauseIcon : playIcon, isPlaying ? 'Pause' : 'Play', 'https://via.placeholder.com/24');
    loadImageWithFallback(playPauseIconMinimized, isPlaying ? pauseIcon : playIcon, isPlaying ? 'Pause' : 'Play', 'https://via.placeholder.com/24');
    loadImageWithFallback(playPauseIconMedia, isPlaying ? pauseIcon : playIcon, isPlaying ? 'Pause' : 'Play', 'https://via.placeholder.com/24');
    loadImageWithFallback(playPauseIconFullscreen, isPlaying ? pauseIcon : playIcon, isPlaying ? 'Pause' : 'Play', 'https://via.placeholder.com/24');
  };

  const updateAllItemIcons = (isPlaying) => {
    document.querySelectorAll('.item-play-pause img').forEach(icon => {
      const item = icon.closest('.playlist-item, .next-item');
      const isCurrent = item.classList.contains('active');
      loadImageWithFallback(icon, isCurrent ? (isPlaying ? 'https://nikichitonjesus.odoo.com/web/image/983-5c0bffd9/Pause.webp' : 'https://nikichitonjesus.odoo.com/web/image/984-ba35a699/play.webp') : 'https://marca1.odoo.com/web/image/508-f876320c/play.svg', isPlaying ? 'Pause' : 'Play', 'https://via.placeholder.com/20');
    });
  };

  const togglePlayPause = (forcePlay = false) => {
    if (mediaElement.dataset.isToggling === 'true') return;
    mediaElement.dataset.isToggling = 'true';
    if (forcePlay || mediaElement.paused) {
      playWithFallback();
      updateOpenPlayerButton(true);
    } else {
      mediaElement.pause();
      updateIcons(false);
      updateAllItemIcons(false);
      updateOpenPlayerButton(false);
    }
    checkMute();
    throttledSaveState();
    setTimeout(() => {
      mediaElement.dataset.isToggling = 'false';
    }, 100);
  };

  const rewind = (seconds = 15) => {
    if (isNaN(mediaElement.duration)) return;
    mediaElement.currentTime = Math.max(0, mediaElement.currentTime - seconds);
    showSeekIndicator('left', seconds);
    throttledSaveState();
  };

  const forward = (seconds = 15) => {
    if (isNaN(mediaElement.duration)) return;
    mediaElement.currentTime = Math.min(mediaElement.duration, mediaElement.currentTime + seconds);
    showSeekIndicator('right', seconds);
    throttledSaveState();
  };

  const previous = () => {
    if (repeatMode !== 0) return;
    if (activeList === 'playlist' && userPlaylistAutoPlay && currentIndex > 0) {
      currentIndex--;
      const item = playlist[currentIndex];
      loadMedia(item.mediaUrl, item.mediaType, item.coverUrlContainer, item.coverUrlInfo, item.title, item.detailUrl, item.author, playlist, item.text, item.allowDownload);
      togglePlayPause(true);
    } else if (activeList === 'next' && currentIndex > 0) {
      currentIndex--;
      const item = nextList[currentIndex];
      loadMedia(item.mediaUrl, item.mediaType, item.coverUrlContainer, item.coverUrlInfo, item.title, item.detailUrl, item.author, nextList, item.text, item.allowDownload);
      togglePlayPause(true);
    } else if (historyList.length > 0) {
      const prevItem = historyList.pop();
      loadMedia(prevItem.mediaUrl, prevItem.mediaType, prevItem.coverUrlContainer, prevItem.coverUrlInfo, prevItem.title, prevItem.detailUrl, prevItem.author, prevItem.next, prevItem.text, prevItem.allowDownload);
      togglePlayPause(true);
    } else {
      mediaElement.currentTime = 0;
    }
    throttledSaveState();
  };

  const next = () => {
    if (repeatMode !== 0) return;
    if (activeList === 'next' && currentIndex < nextList.length - 1) {
      currentIndex++;
      const item = nextList[currentIndex];
      loadMedia(item.mediaUrl, item.mediaType, item.coverUrlContainer, item.coverUrlInfo, item.title, item.detailUrl, item.author, nextList, item.text, item.allowDownload);
      togglePlayPause(true);
    } else if (activeList === 'playlist' && userPlaylistAutoPlay && currentIndex < playlist.length - 1) {
      currentIndex++;
      const item = playlist[currentIndex];
      loadMedia(item.mediaUrl, item.mediaType, item.coverUrlContainer, item.coverUrlInfo, item.title, item.detailUrl, item.author, playlist, item.text, item.allowDownload);
      togglePlayPause(true);
    } else if (userPlaylistAutoPlay && playlist.length > 0) {
      activeList = 'playlist';
      currentIndex = 0;
      const item = playlist[currentIndex];
      loadMedia(item.mediaUrl, item.mediaType, item.coverUrlContainer, item.coverUrlInfo, item.title, item.detailUrl, item.author, playlist, item.text, item.allowDownload);
      togglePlayPause(true);
    } else if (cachedRecomendados.length > 0) {
      const nextRecItem = cachedRecomendados.shift();
      const mappedRec = mapEpisodeToMedia(nextRecItem);
      loadMedia(
        mappedRec.mediaUrl,
        mappedRec.mediaType,
        mappedRec.coverUrlContainer,
        mappedRec.coverUrlInfo,
        mappedRec.title,
        mappedRec.detailUrl,
        mappedRec.author,
        cachedRecomendados.map(mapEpisodeToMedia),
        mappedRec.text,
        mappedRec.allowDownload,
        true,
        0
      );
      togglePlayPause(true);
    }
    throttledSaveState();
  };

  const handleMediaEnd = () => {
    if (repeatMode === 2) {
      mediaElement.play();
    } else if (repeatMode === 1) {
      mediaElement.play();
      repeatMode = 0;
      updateRepeatButton();
    } else {
      if (activeList === 'next' && currentIndex < nextList.length - 1) {
        currentIndex++;
        const nextItem = nextList[currentIndex];
        loadMedia(nextItem.mediaUrl, nextItem.mediaType, nextItem.coverUrlContainer, nextItem.coverUrlInfo, nextItem.title, nextItem.detailUrl, nextItem.author, nextList, nextItem.text, nextItem.allowDownload);
        togglePlayPause(true);
      } else if (activeList === 'playlist' && userPlaylistAutoPlay && currentIndex < playlist.length - 1) {
        currentIndex++;
        const nextItem = playlist[currentIndex];
        loadMedia(nextItem.mediaUrl, nextItem.mediaType, nextItem.coverUrlContainer, nextItem.coverUrlInfo, nextItem.title, nextItem.detailUrl, nextItem.author, playlist, nextItem.text, nextItem.allowDownload);
        togglePlayPause(true);
      } else if (userPlaylistAutoPlay && playlist.length > 0) {
        activeList = 'playlist';
        currentIndex = 0;
        const nextItem = playlist[currentIndex];
        loadMedia(nextItem.mediaUrl, nextItem.mediaType, nextItem.coverUrlContainer, nextItem.coverUrlInfo, nextItem.title, nextItem.detailUrl, nextItem.author, playlist, nextItem.text, nextItem.allowDownload);
        togglePlayPause(true);
      } else if (cachedRecomendados.length > 0) {
        const nextRecItem = cachedRecomendados.shift();
        const mappedRec = mapEpisodeToMedia(nextRecItem);
        loadMedia(
          mappedRec.mediaUrl,
          mappedRec.mediaType,
          mappedRec.coverUrlContainer,
          mappedRec.coverUrlInfo,
          mappedRec.title,
          mappedRec.detailUrl,
          mappedRec.author,
          cachedRecomendados.map(mapEpisodeToMedia),
          mappedRec.text,
          mappedRec.allowDownload,
          true,
          0
        );
        togglePlayPause(true);
      }
    }
    throttledSaveState();
  };

  const handleMediaTap = (e) => {
    if (e.target.closest('button')) return;
    e.preventDefault();
    e.stopPropagation();
    const now = Date.now();
    if (now - lastTapTime < 250) {
      tapCount++;
    } else {
      tapCount = 1;
    }
    lastTapTime = now;
    const rect = mediaContainer.getBoundingClientRect();
    let x;
    if (e.changedTouches) {
      x = e.changedTouches[0].clientX - rect.left;
    } else {
      x = e.clientX - rect.left;
    }
    tapSide = x < rect.width / 2 ? 'left' : 'right';
    if (tapTimeout) clearTimeout(tapTimeout);
    tapTimeout = setTimeout(() => {
      if (tapCount === 1) {
        showControls = !showControls;
        mediaContainer.classList.toggle('show-controls', showControls);
        if (showControls) {
          muteIndicator.style.display = 'none';
        } else if (isAutoMuted && !isUserMuted) {
          showMuteIndicator();
        }
      } else if (tapCount > 1) {
        const seconds = 15 * (tapCount - 1);
        if (tapSide === 'left') {
          rewind(seconds);
        } else {
          forward(seconds);
        }
      }
      tapCount = 0;
    }, 250);
  };

  let autoHideTimer = null;
  const handleFullscreenTap = (e) => {
    if (!isFullscreenMode || e.target.closest('button')) return;
    e.preventDefault();
    e.stopPropagation();
    const isShown = fullscreenControls.classList.toggle('show-controls');
    if (isShown) {
      startAutoHideTimer();
    }
  };

  const startAutoHideTimer = () => {
    clearTimeout(autoHideTimer);
    autoHideTimer = setTimeout(() => {
      if (isFullscreenMode) {
        fullscreenControls.classList.remove('show-controls');
      } else {
        mediaContainer.classList.remove('show-controls');
      }
    }, 3000);
  };

  const showSeekIndicator = (side, seconds) => {
    const indicator = side === 'left' ? seekIndicatorLeft : seekIndicatorRight;
    const secondsElem = side === 'left' ? seekSecondsLeft : seekSecondsRight;
    secondsElem.textContent = `${seconds}s`;
    indicator.classList.add('show');
    setTimeout(() => indicator.classList.remove('show'), 1000);
  };

  const updateProgress = () => {
    if (!mediaElement.duration) return;
    const percentage = (mediaElement.currentTime / mediaElement.duration) * 100;
    progressBarExpanded.style.width = percentage + '%';
    progressBarMinimized.style.width = percentage + '%';
    progressBarFullscreen.style.width = percentage + '%';
    currentTimeExpanded.textContent = formatTime(mediaElement.currentTime);
    durationExpanded.textContent = formatTime(mediaElement.duration);
    currentTimeFullscreen.textContent = formatTime(mediaElement.currentTime);
    durationFullscreen.textContent = formatTime(mediaElement.duration);
    throttledSaveState();
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const updateProgressDrag = (clientX, container, progressBar) => {
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    let percentage = (x / width) * 100;
    percentage = Math.max(0, Math.min(100, percentage));
    progressBar.style.width = percentage + '%';
    if (mediaElement.duration) {
      mediaElement.currentTime = (percentage / 100) * mediaElement.duration;
    }
    throttledSaveState();
  };

  const updateSpeedButtons = (value) => {
    currentSpeed.textContent = `${value}x`;
    if (value !== 1) {
      speedContainer.classList.add('active');
    } else {
      speedContainer.classList.remove('active');
    }
  };

  const setupTimer = () => {
    if (timerId) clearTimeout(timerId);
    if (timerCountdownInterval) clearInterval(timerCountdownInterval);
    if (timerValue === 'end') {
      currentEpisodeId = currentMedia.mediaUrl;
      const updateEndTimer = () => {
        const remaining = mediaElement.duration - mediaElement.currentTime;
        if (remaining <= 0 && currentEpisodeId === currentMedia.mediaUrl) {
          mediaElement.pause();
          resetTimer();
        }
      };
      mediaElement.addEventListener('timeupdate', updateEndTimer);
      timerCountdownInterval = setInterval(() => {
        countdownDisplay.textContent = formatTime(mediaElement.duration - mediaElement.currentTime);
      }, 1000);
    } else if (timerValue !== '0') {
      const minutes = parseInt(timerValue);
      let remaining = minutes * 60;
      timerId = setTimeout(() => {
        mediaElement.pause();
        resetTimer();
      }, remaining * 1000);
      timerCountdownInterval = setInterval(() => {
        remaining--;
        countdownDisplay.textContent = formatTime(remaining);
        if (remaining <= 0) clearInterval(timerCountdownInterval);
      }, 1000);
    }
    updateTimerButtons(timerValue);
    if (timerValue !== '0') timerContainer.classList.add('active');
  };

  const resetTimer = () => {
    if (timerId) clearTimeout(timerId);
    if (timerCountdownInterval) clearInterval(timerCountdownInterval);
    timerValue = 0;
    timerId = null;
    timerCountdownInterval = null;
    currentEpisodeId = null;
    timerContainer.classList.remove('active');
    timerCountdown.style.display = 'none';
    timerOptions.style.display = 'block';
    updateTimerButtons(0);
    throttledSaveState();
  };

  const updateTimerButtons = (value) => {
    timerOptions.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
    const btn = timerOptions.querySelector(`button[data-value="${value}"]`);
    if (btn) btn.classList.add('selected');
  };

  const checkTitleOverflow = () => {
    [episodeTitle].forEach(title => {
      if (!title) return;
      const parent = title.parentElement;
      if (!parent) return;
      title.classList.remove('scrolling-title');
      title.style.animation = 'none';
      requestAnimationFrame(() => {
        const availableWidth = parent.offsetWidth;
        if (title.scrollWidth > availableWidth) {
          title.classList.add('scrolling-title');
          title.style.animation = 'scrollTitle 40s linear infinite';
        }
      });
    });
  };

  const checkMinimizedTitleOverflow = () => {
    const title = episodeTitleMinimized;
    const parent = title.parentElement;
    if (!parent) return;
    title.classList.remove('scrolling');
    title.style.animation = 'none';
    requestAnimationFrame(() => {
      const availableWidth = parent.offsetWidth;
      if (title.scrollWidth > availableWidth) {
        title.classList.add('scrolling');
        title.style.animation = 'scrollMinimizedTitle 20s linear infinite';
      }
    });
  };

  const checkMute = () => {
    isMuted = mediaElement.muted;
    isUserMuted = !isAutoMuted && isMuted;
    const volumeIconSrc = isMuted ? 'https://nikichitonjesus.odoo.com/web/image/584-d2f5c35f/mute.png' : 'https://nikichitonjesus.odoo.com/web/image/587-e4437449/volumen.png';
    loadImageWithFallback(volumeIcon, volumeIconSrc, isMuted ? 'Muted' : 'Volume', 'https://via.placeholder.com/24');
    loadImageWithFallback(volumeIconFullscreen, volumeIconSrc, isMuted ? 'Muted' : 'Volume', 'https://via.placeholder.com/24');
    showMuteIndicator();
    throttledSaveState();
  };

  const updateRepeatButton = () => {
    const span = repeatBtn.querySelector('span');
    if (repeatMode === 0) {
      span.textContent = 'Repetir';
    } else if (repeatMode === 1) {
      span.textContent = 'Repetir una vez';
    } else {
      span.textContent = 'Repetir infinito';
    }
    repeatBtn.classList.toggle('repeat-active', repeatMode > 0);
  };

  // Actualiza ícono y texto del botón externo #openPlayerBtn
  const updateOpenPlayerButton = (isPlaying) => {
    const openPlayerBtn = document.querySelector('#openPlayerBtn');
    if (!openPlayerBtn) return;
    const img = openPlayerBtn.querySelector('img');
    const textSpan = openPlayerBtn.querySelector('span');
    if (img && textSpan) {
      if (isPlaying) {
        img.src = 'https://nikichitonjes-home.odoo.com/web/image/477-973a1ff8/Escuchar.gif';
        img.alt = 'Escuchando';
        textSpan.textContent = 'Escuchando';
      } else {
        img.src = 'https://nikichitonjes-home.odoo.com/web/image/478-0e3df8d3/reanudar.gif';
        img.alt = 'Escuchar';
        textSpan.textContent = 'Escuchar';
      }
    }
  };

  // Event listeners
  mediaContainer.addEventListener('mouseenter', () => {
    if (isFullscreenMode) return;
    mediaContainer.classList.add('show-controls');
    startAutoHideTimer();
  });
  mediaContainer.addEventListener('mousemove', startAutoHideTimer);
  mediaContainer.addEventListener('click', handleFullscreenTap);
  mediaContainer.addEventListener('touchend', handleFullscreenTap);
  mediaElement.addEventListener('timeupdate', updateProgress);
  mediaElement.addEventListener('loadedmetadata', updateProgress);
  mediaElement.addEventListener('ended', handleMediaEnd);
  mediaElement.addEventListener('play', () => { 
    updateIcons(true); 
    updateAllItemIcons(true); 
    updateOpenPlayerButton(true);
  });
  mediaElement.addEventListener('pause', () => { 
    updateIcons(false); 
    updateAllItemIcons(false); 
    updateOpenPlayerButton(false);
  });
  mediaContainer.addEventListener('touchend', handleMediaTap);
  mediaContainer.addEventListener('click', handleMediaTap);
  speedContainer.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePanel('velocidad');
  });
  speedContainer.addEventListener('touchend', (e) => {
    e.stopPropagation();
    e.preventDefault();
    togglePanel('velocidad');
  });
  timerContainer.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePanel('temporizador');
    setTimeout(updateTimerView, 100);
  });
  timerContainer.addEventListener('touchend', (e) => {
    e.stopPropagation();
    e.preventDefault();
    togglePanel('temporizador');
    setTimeout(updateTimerView, 100);
  });
  speedSlider.addEventListener('input', () => {
    const value = parseFloat(speedSlider.value);
    mediaElement.playbackRate = value;
    updateSpeedButtons(value);
    throttledSaveState();
  });
  timerOptions.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      timerValue = btn.dataset.value;
      setupTimer();
      togglePanel();
      throttledSaveState();
      updateTimerView();
    });
  });
  deactivateTimer.addEventListener('click', (e) => {
    e.stopPropagation();
    resetTimer();
    togglePanel();
    updateTimerView();
  });
  minimizeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    showMinimized();
  });
  minimizeBtn.addEventListener('touchend', (e) => {
    e.stopPropagation();
    e.preventDefault();
    showMinimized();
  });
  expandBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    showExpanded();
  });
  expandBtn.addEventListener('touchend', (e) => {
    e.stopPropagation();
    e.preventDefault();
    showExpanded();
  });
  playerMinimized.addEventListener('click', (e) => {
    if (!progressContainerMinimized.contains(e.target) && !e.target.closest('.minimized-controls')) {
      showExpanded();
    }
  });
  episodeInfo.addEventListener('click', (e) => {
    if (e.target.closest('#addToPlaylistBtn')) return;
    if (currentMedia?.detailUrl) {
      window.location.href = currentMedia.detailUrl;
    }
  });
  mediaModeToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMediaMode();
  });
  fullscreenBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      mediaContainer.requestFullscreen().then(() => {
        isFullscreenMode = true;
        fullscreenControls.style.display = 'flex';
        loadImageWithFallback(fullscreenBtn.querySelector('img'), 'https://nikichitonjesus.odoo.com/web/image/623-e47eb360/Exitfull.png', 'Exit Fullscreen', 'https://via.placeholder.com/24');
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock('landscape').catch(() => {});
        }
        overlayGradient.style.display = 'none';
        mediaContainer.classList.remove('show-controls');
        startAutoHideTimer();
      }).catch(err => console.log('Fullscreen error:', err));
    } else {
      document.exitFullscreen().then(() => {
        isFullscreenMode = false;
        fullscreenControls.style.display = 'none';
        loadImageWithFallback(fullscreenBtn.querySelector('img'), 'https://media.baltaanay.org/web/image/883-49c31be4/full.png', 'Fullscreen', 'https://via.placeholder.com/24');
        overlayGradient.style.display = 'flex';
      });
    }
  });
  exitFullscreenBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  });
  exitFullscreenBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  });
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      isFullscreenMode = false;
      fullscreenControls.style.display = 'none';
      loadImageWithFallback(fullscreenBtn.querySelector('img'), 'https://media.baltaanay.org/web/image/883-49c31be4/full.png', 'Fullscreen', 'https://via.placeholder.com/24');
      overlayGradient.style.display = 'flex';
      clearTimeout(autoHideTimer);
    } else {
      fullscreenControls.style.display = 'flex';
      overlayGradient.style.display = 'none';
      startAutoHideTimer();
    }
  });
  previousFullscreen.addEventListener('click', (e) => {
    e.stopPropagation();
    previous();
  });
  rewindFullscreen.addEventListener('click', (e) => {
    e.stopPropagation();
    rewind();
  });
  playPauseFullscreen.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlayPause();
  });
  forwardFullscreen.addEventListener('click', (e) => {
    e.stopPropagation();
    forward();
  });
  nextFullscreen.addEventListener('click', (e) => {
    e.stopPropagation();
    next();
  });
  volumeFullscreen.addEventListener('click', (e) => {
    e.stopPropagation();
    mediaElement.muted = !mediaElement.muted;
    checkMute();
  });
  volumeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    mediaElement.muted = !mediaElement.muted;
    checkMute();
  });
  playPauseMedia.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlayPause();
  });
  downloadBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!currentMedia.allowDownload) return;
    downloadBtn.classList.add('active');
    setTimeout(() => downloadBtn.classList.remove('active'), 200);
    if (currentMedia?.mediaUrl) {
      const link = document.createElement('a');
      link.href = currentMedia.mediaUrl;
      link.target = '_blank';
      link.download = currentMedia.title || 'media';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No hay archivo para descargar.');
    }
  });
  shareBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    shareBtn.classList.add('active');
    setTimeout(() => shareBtn.classList.remove('active'), 200);
    if (currentMedia?.title && currentMedia?.detailUrl) {
      if (navigator.share && typeof navigator.share === 'function') {
        navigator.share({
          title: currentMedia.title,
          url: currentMedia.detailUrl,
        }).catch((error) => {
          console.log('Error al compartir:', error);
        });
      } else {
        navigator.clipboard.writeText(`${currentMedia.title}: ${currentMedia.detailUrl}`)
          .then(() => alert('Enlace copiado al portapapeles'))
          .catch(() => alert('Error al copiar el enlace'));
      }
    } else {
      alert('No hay contenido para compartir.');
    }
  });
  programBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const programa = window.PROGRAMA_DEL_DIA || {
      mediaUrl: 'https://awscdn.podcasts.com/audio-vhhlggMJNysHnLYW8KXAQwu4w.mp3',
      mediaType: 'audio',
      coverUrlContainer: 'https://s3.amazonaws.com/podcasts-image-uploads/el-populismo-y-la-democracia-jesus-huerta-de-soto-1400x1400.png',
      coverUrlInfo: 'https://www.edu.balta.lat/web/image/415-8ae27244/media.png',
      title: 'El populismo y la democracia',
      detailUrl: '#',
      author: "Jesús Huerta de Soto",
      text: "No disponible",
      allowDownload: true
    };
    loadMedia(programa.mediaUrl, programa.mediaType, programa.coverUrlContainer, programa.coverUrlInfo, programa.title, programa.detailUrl, programa.author, [], programa.text, programa.allowDownload);
    showExpanded();
    togglePlayPause(true);
    throttledSaveState();
  });
  repeatBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    repeatBtn.classList.add('active');
    setTimeout(() => repeatBtn.classList.remove('active'), 200);
    repeatMode = (repeatMode + 1) % 3;
    mediaElement.loop = repeatMode === 2;
    updateRepeatButton();
    throttledSaveState();
  });
  addToPlaylistBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    addToPlaylistBtn.classList.add('active');
    setTimeout(() => addToPlaylistBtn.classList.remove('active'), 200);
    if (currentMedia && !playlist.some(item => item.mediaUrl === currentMedia.mediaUrl)) {
      playlist.push(currentMedia);
      localStorage.setItem('playlist', JSON.stringify(playlist));
      updatePlaylist();
      updateAddButton();
    } else if (currentMedia) {
      const index = playlist.findIndex(item => item.mediaUrl === currentMedia.mediaUrl);
      if (index > -1) {
        playlist.splice(index, 1);
        localStorage.setItem('playlist', JSON.stringify(playlist));
        updatePlaylist();
        updateAddButton();
      }
    } else {
      alert('No hay episodio cargado.');
    }
    throttledSaveState();
  });
  likesBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleLikes();
  });
  colaBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePanel('cola');
  });
  detallesBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePanel('detalles');
  });
  bibliotecaBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePanel('biblioteca');
  });
  linkCola.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    togglePanel('cola');
  });
  linkCola.addEventListener('touchend', (e) => {
    e.stopPropagation();
    e.preventDefault();
    togglePanel('cola');
  });
  linkDetalles.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    togglePanel('detalles');
  });
  linkDetalles.addEventListener('touchend', (e) => {
    e.stopPropagation();
    e.preventDefault();
    togglePanel('detalles');
  });
  linkBiblioteca.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    togglePanel('biblioteca');
  });
  linkBiblioteca.addEventListener('touchend', (e) => {
    e.stopPropagation();
    e.preventDefault();
    togglePanel('biblioteca');
  });
  closePanelBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePanel();
  });
  togglePanelHeightBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePanelHeight();
  });
  tabCola.addEventListener('click', (e) => {
    e.stopPropagation();
    switchTab('cola');
  });
  tabDetalles.addEventListener('click', (e) => {
    e.stopPropagation();
    switchTab('detalles');
  });
  tabBiblioteca.addEventListener('click', (e) => {
    e.stopPropagation();
    switchTab('biblioteca');
  });
  tabVelocidad.addEventListener('click', (e) => {
    e.stopPropagation();
    switchTab('velocidad');
  });
  tabTemporizador.addEventListener('click', (e) => {
    e.stopPropagation();
    switchTab('temporizador');
  });
  viewAllLikes.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleLikesView();
  });
  playUserPlaylistBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    userPlaylistAutoPlay = !userPlaylistAutoPlay;
    playUserPlaylistBtn.classList.toggle('active', userPlaylistAutoPlay);
    if (userPlaylistAutoPlay && playlist.length > 0) {
      activeList = 'playlist';
      currentIndex = 0;
      const item = playlist[currentIndex];
      loadMedia(item.mediaUrl, item.mediaType, item.coverUrlContainer, item.coverUrlInfo, item.title, item.detailUrl, item.author, playlist, item.text, item.allowDownload);
      togglePlayPause(true);
    } else if (!userPlaylistAutoPlay) {
      activeList = 'next';
    }
    throttledSaveState();
  });
  mediaElement.addEventListener('volumechange', checkMute);
  rewindExpanded.addEventListener('click', (e) => {
    e.stopPropagation();
    rewind();
  });
  rewindExpanded.addEventListener('touchend', (e) => {
    e.stopPropagation();
    e.preventDefault();
    rewind();
  });
  forwardExpanded.addEventListener('click', (e) => {
    e.stopPropagation();
    forward();
  });
  forwardExpanded.addEventListener('touchend', (e) => {
    e.stopPropagation();
    e.preventDefault();
    forward();
  });
  previousExpanded.addEventListener('click', (e) => {
    e.stopPropagation();
    previous();
  });
  previousExpanded.addEventListener('touchend', (e) => {
    e.stopPropagation();
    e.preventDefault();
    previous();
  });
  nextExpanded.addEventListener('click', (e) => {
    e.stopPropagation();
    next();
  });
  nextExpanded.addEventListener('touchend', (e) => {
    e.stopPropagation();
    e.preventDefault();
    next();
  });
  playPauseExpanded.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlayPause();
  });
  playPauseExpanded.addEventListener('touchend', (e) => {
    e.stopPropagation();
    e.preventDefault();
    togglePlayPause();
  });
  rewindMinimized.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    rewind();
  });
  rewindMinimized.addEventListener('touchend', (e) => {
    e.stopPropagation();
    e.preventDefault();
    rewind();
  });
  forwardMinimized.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    forward();
  });
  forwardMinimized.addEventListener('touchend', (e) => {
    e.stopPropagation();
    e.preventDefault();
    forward();
  });
  playPauseMinimized.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    togglePlayPause();
  });
  playPauseMinimized.addEventListener('touchend', (e) => {
    e.stopPropagation();
    e.preventDefault();
    togglePlayPause();
  });

  // Drag events for progress bars
  progressContainerExpanded.addEventListener('mousedown', (e) => {
    isDraggingExpanded = true;
    progressContainerExpanded.classList.add('dragging');
    updateProgressDrag(e.clientX, progressContainerExpanded, progressBarExpanded);
    e.stopPropagation();
  });
  document.addEventListener('mousemove', (e) => {
    if (isDraggingExpanded) {
      updateProgressDrag(e.clientX, progressContainerExpanded, progressBarExpanded);
    }
  });
  document.addEventListener('mouseup', () => {
    if (isDraggingExpanded) {
      isDraggingExpanded = false;
      progressContainerExpanded.classList.remove('dragging');
    }
  });
  progressContainerExpanded.addEventListener('touchstart', (e) => {
    isDraggingExpanded = true;
    progressContainerExpanded.classList.add('dragging');
    updateProgressDrag(e.touches[0].clientX, progressContainerExpanded, progressBarExpanded);
    e.preventDefault();
    e.stopPropagation();
  });
  document.addEventListener('touchmove', (e) => {
    if (isDraggingExpanded) {
      updateProgressDrag(e.touches[0].clientX, progressContainerExpanded, progressBarExpanded);
      e.preventDefault();
    }
  });
  document.addEventListener('touchend', () => {
    if (isDraggingExpanded) {
      isDraggingExpanded = false;
      progressContainerExpanded.classList.remove('dragging');
    }
  });

  progressContainerMinimized.addEventListener('mousedown', (e) => {
    isDraggingMinimized = true;
    progressContainerMinimized.classList.add('dragging');
    updateProgressDrag(e.clientX, progressContainerMinimized, progressBarMinimized);
    e.stopPropagation();
  });
  document.addEventListener('mousemove', (e) => {
    if (isDraggingMinimized) {
      updateProgressDrag(e.clientX, progressContainerMinimized, progressBarMinimized);
    }
  });
  document.addEventListener('mouseup', () => {
    if (isDraggingMinimized) {
      isDraggingMinimized = false;
      progressContainerMinimized.classList.remove('dragging');
    }
  });
  progressContainerMinimized.addEventListener('touchstart', (e) => {
    isDraggingMinimized = true;
    progressContainerMinimized.classList.add('dragging');
    updateProgressDrag(e.touches[0].clientX, progressContainerMinimized, progressBarMinimized);
    e.preventDefault();
    e.stopPropagation();
  });
  document.addEventListener('touchmove', (e) => {
    if (isDraggingMinimized) {
      updateProgressDrag(e.touches[0].clientX, progressContainerMinimized, progressBarMinimized);
      e.preventDefault();
    }
  });
  document.addEventListener('touchend', () => {
    if (isDraggingMinimized) {
      isDraggingMinimized = false;
      progressContainerMinimized.classList.remove('dragging');
    }
  });

  progressContainerFullscreen.addEventListener('mousedown', (e) => {
    isDraggingFullscreen = true;
    updateProgressDrag(e.clientX, progressContainerFullscreen, progressBarFullscreen);
  });
  progressContainerFullscreen.addEventListener('touchstart', (e) => {
    isDraggingFullscreen = true;
    updateProgressDrag(e.touches[0].clientX, progressContainerFullscreen, progressBarFullscreen);
    e.preventDefault();
  });
  document.addEventListener('mousemove', (e) => {
    if (isDraggingFullscreen) {
      updateProgressDrag(e.clientX, progressContainerFullscreen, progressBarFullscreen);
    }
  });
  document.addEventListener('touchmove', (e) => {
    if (isDraggingFullscreen) {
      updateProgressDrag(e.touches[0].clientX, progressContainerFullscreen, progressBarFullscreen);
      e.preventDefault();
    }
  });
  document.addEventListener('mouseup', () => {
    if (isDraggingFullscreen) isDraggingFullscreen = false;
  });
  document.addEventListener('touchend', () => {
    if (isDraggingFullscreen) isDraggingFullscreen = false;
  });

  // Swipe to close/expand
  playerExpanded.addEventListener('touchstart', (e) => {
    const target = e.target;
    if (target.closest('.media-container') || target.closest('.controls') || target.closest('.video-progress-container-expanded') || target.closest('.action-buttons') || target.closest('.episode-info') || target.closest('.panel-container') || target.closest('button')) {
      return;
    }
    touchStartY = e.touches[0].clientY;
    isSwiping = true;
  });
  playerExpanded.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    touchEndY = e.touches[0].clientY;
  });
  playerExpanded.addEventListener('touchend', (e) => {
    if (!isSwiping) return;
    const deltaY = touchStartY - touchEndY;
    if (deltaY > swipeThreshold) {
      showMinimized();
    }
    isSwiping = false;
  });

  playerMinimized.addEventListener('touchstart', (e) => {
    if (e.target.closest('.minimized-controls') || progressContainerMinimized.contains(e.target)) {
      return;
    }
    touchStartY = e.touches[0].clientY;
    isSwiping = true;
  });
  playerMinimized.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    touchEndY = e.touches[0].clientY;
  });
  playerMinimized.addEventListener('touchend', (e) => {
    if (!isSwiping) return;
    const deltaY = touchStartY - touchEndY;
    if (deltaY > swipeThreshold) {
      showExpanded();
    }
    isSwiping = false;
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !isAudioMode && currentMedia?.mediaType === 'video') {
      mediaElement.pause();
      updateIcons(false);
      updateAllItemIcons(false);
      updateOpenPlayerButton(false);
    }
  });

  panelContainer.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  panelContainer.addEventListener('touchend', (e) => {
    e.stopPropagation();
  });

  window.addEventListener('popstate', () => {
    throttledSaveState();
    showMinimized();
  });

  window.addEventListener('beforeunload', throttledSaveState);

  // --- Estilos CSS (inyectados directamente) ---
  const style = document.createElement('style');
  style.textContent = `
    /* Reset y estilos base */
    #playerUniversal * {
      box-sizing: border-box;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }
    #playerUniversal {
      font-family: Arial, sans-serif;
      color: white;
    }
    .player-universal {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: 1001;
    }
    /* Reproductor expandido */
    .player-expanded {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100vh;
      padding: max(12px, env(safe-area-inset-top)) 10px max(20px, env(safe-area-inset-bottom)) 10px;
      background: #6a8caf; /* color dinámico */
      z-index: 2147483647;
      overflow-y: auto;
      overscroll-behavior: contain;
      display: flex;
      flex-direction: column;
      gap: 5px;
      position: relative;
    }
    /* Degradado oscuro desde abajo hacia la mitad */
    .player-expanded::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 50%;
      background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%);
      pointer-events: none;
      z-index: 1;
    }
    .content-wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 500px;
      margin: 0 auto;
      flex-grow: 1;
      position: relative;
      z-index: 2;
    }
    .complex2, .complex3 {
      width: 100%;
    }
    /* Contenedor multimedia siempre cuadrado */
    .media-container {
      width: 100%;
      aspect-ratio: 1 / 1;
      background: #000;
      position: relative;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      -webkit-tap-highlight-color: transparent;
    }
    .media-container video, .media-container img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      z-index: 1000;
      border-radius: 10px;
    }
    .overlay-gradient {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.3) 100%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 1001;
    }
    .media-container.show-controls .overlay-gradient { opacity: 1; }
    /* Reproductor minimizado */
    .player-minimized {
      background: #6a8caf; /* color dinámico */
      height: 70px;
      display: flex;
      align-items: center;
      padding: 10px;
      justify-content: space-between;
      box-sizing: border-box;
      position: relative;
      cursor: pointer;
      width: 100%;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
    }
    .minimized-content {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
    }
    .minimized-cover {
      flex: 0 0 50px;
      margin-right: 10px;
    }
    .minimized-cover img {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 5px;
    }
    .minimized-title-container {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
    }
    .minimized-title {
      font-size: 16px;
      font-weight: bold;
      color: white;
    }
    .minimized-controls {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .minimized-controls button {
      background: transparent;
      border: none;
      padding: 0;
      cursor: pointer;
    }
    .minimized-controls img {
      width: 24px;
      height: 24px;
    }
    /* Barras de progreso */
    .video-progress-container-expanded,
    .video-progress-container-minimized,
    .video-progress-container-fullscreen {
      width: 100%;
      height: 6px;
      background: #555;
      border-radius: 3px;
      position: relative;
      cursor: pointer;
      transition: height 0.2s ease;
    }
    .video-progress-container-expanded:hover,
    .video-progress-container-minimized:hover,
    .video-progress-container-fullscreen:hover {
      height: 8px;
    }
    .progress-bar-expanded,
    .progress-bar-minimized,
    .progress-bar-fullscreen {
      height: 100%;
      background: #ff0000;
      width: 0;
      border-radius: 3px;
      position: relative;
    }
    .progress-knob-expanded,
    .progress-knob-minimized,
    .progress-knob-fullscreen {
      position: absolute;
      right: -8px;
      top: 50%;
      width: 16px;
      height: 16px;
      background: #ff0000;
      border-radius: 50%;
      transform: translateY(-50%) scale(0);
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      transition: transform 0.2s ease, opacity 0.2s ease;
      opacity: 0;
      pointer-events: none;
    }
    .video-progress-container-expanded:hover .progress-knob-expanded,
    .video-progress-container-expanded.dragging .progress-knob-expanded,
    .video-progress-container-minimized:hover .progress-knob-minimized,
    .video-progress-container-minimized.dragging .progress-knob-minimized,
    .video-progress-container-fullscreen:hover .progress-knob-fullscreen,
    .video-progress-container-fullscreen.dragging .progress-knob-fullscreen {
      transform: translateY(-50%) scale(1);
      opacity: 1;
    }
    /* Panel */
    .panel-container {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 60vh;
      background: rgba(0, 0, 0, 0.9);
      z-index: 1004;
      display: none;
      flex-direction: column;
      padding: 10px;
      box-sizing: border-box;
      overflow: hidden;
    }
    .panel-container.full-height {
      height: 100vh;
    }
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 20px 10px 20px;
      position: relative;
      z-index: 1004;
    }
    .tabs {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }
    .tabs a {
      color: white;
      font-size: 20px;
      font-weight: bold;
      text-decoration: none;
      padding: 8px 12px;
      border-radius: 8px;
      transition: background 0.2s;
      cursor: pointer;
    }
    .tabs a.active {
      color: #ff0000;
      background: rgba(255, 0, 0, 0.2);
    }
    .panel-controls {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    #togglePanelHeightBtn,
    #closePanelBtn {
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(10px);
      border-radius: 50%;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    #togglePanelHeightBtn:hover,
    #closePanelBtn:hover {
      transform: scale(1.1);
    }
    #togglePanelHeightBtn img,
    #closePanelBtn img {
      width: 28px;
      height: 28px;
    }
    /* Ajustes para móvil (opcional, puedes eliminarlo si quieres que sea idéntico) */
    @media (max-width: 600px) {
      .panel-header {
        padding: 10px 10px 5px 10px;
      }
      .tabs {
        gap: 10px;
      }
      .tabs a {
        font-size: 14px;
        padding: 6px 8px;
      }
      .panel-controls button {
        width: 36px;
        height: 36px;
      }
      .panel-controls button img {
        width: 20px;
        height: 20px;
      }
    }
    /* Otros estilos (se mantienen igual) */
    .top-controls {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 10px;
      z-index: 2;
    }
    .media-mode-toggle {
      background: #444;
      border: none;
      border-radius: 20px;
      padding: 8px 12px;
      color: white;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      white-space: nowrap;
      transition: all 0.3s ease;
    }
    .media-mode-toggle.disabled {
      opacity: 0.5;
      background: #333;
      cursor: not-allowed;
      pointer-events: none;
    }
    .minimize-btn {
      background: rgba(0, 0, 0, 0.5);
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 1003;
    }
    .minimize-btn img { width: 24px; height: 24px; }
    .episode-info {
      display: flex;
      align-items: center;
      color: white;
      background: transparent;
      margin: 10px 0 5px 0;
      cursor: pointer;
      width: 100%;
      position: relative;
    }
    .left-section { flex: 0 0 50px; }
    .center-section { flex: 1; overflow: hidden; padding: 0 10px; }
    .right-section { flex: 0 0 50px; text-align: right; }
    .episode-info img { width: 40px; height: 40px; z-index: 3; }
    .episode-info .center-section span { font-size: 18px; font-weight: bold; white-space: nowrap; color: white; display: block; }
    .episode-info .center-section .author { font-size: 14px; font-weight: normal; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: white; }
    .controls {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      margin: 2px 0;
      gap: 5px;
    }
    .controls button, .minimized-controls button, #minimizeBtn {
      background: transparent;
      border: none;
      padding: 0;
      margin: 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
    .controls img, .minimized-controls img, .action-buttons img { width: 24px; height: 24px; user-select: none; }
    #rewindExpanded img, #forwardExpanded img { width: 35px; height: 35px; }
    #previousExpanded img, #nextExpanded img { width: 33px; height: 33px; }
    #playPauseExpanded img { width: 49px; height: 49px; }
    .time-info {
      display: flex;
      justify-content: space-between;
      width: 100%;
      color: white;
      margin: 0 0 5px 0;
      font-size: 12px;
    }
    .action-buttons-container {
      width: 100%;
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
      margin-bottom: 5px;
    }
    .action-buttons {
      display: flex;
      gap: 10px;
      padding: 5px 0;
    }
    .action-btn {
      background: #444;
      color: white;
      border: none;
      border-radius: 15px;
      padding: 6px 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      white-space: nowrap;
      min-width: fit-content;
      transition: transform 0.2s ease;
    }
    .action-btn:active { transform: scale(0.95); }
    .action-btn img { width: 15px; height: 15px; }
    .action-btn.disabled { opacity: 0.5; cursor: not-allowed; }
    .full-width-btn {
      width: 100%;
      display: flex;
      align-items: center;
      background: #666;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 6px;
      cursor: pointer;
    }
    .full-width-btn img { width: 20px; height: 20px; }
    .full-width-btn span { margin-left: 10px; font-size: 16px; }
    .tabs-text {
      width: 100%;
      display: flex;
      justify-content: space-around;
      margin-top: 5px;
      margin-bottom: 5px;
    }
    .tabs-text a {
      color: #edebeb;
      font-weight: bold;
      text-decoration: none;
      cursor: pointer;
      font-size: 14px;
      padding: 8px 12px;
      border-radius: 8px;
    }
    .speed-container, .timer-container {
      position: relative;
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
    }
    .speed-container.active, .timer-container.active { background: #ff0000; border-radius: 5px; padding: 2px; }
    .fullscreen-controls {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: none;
      flex-direction: column;
      justify-content: space-between;
      z-index: 1002;
      background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 20%, transparent 30%, transparent 70%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,0.7) 100%);
    }
    .fullscreen-title { color: white; font-size: 18px; font-weight: bold; text-align: center; padding: 10px; }
    .fullscreen-center-controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      height: 100%;
    }
    .fullscreen-bottom-bar {
      display: flex;
      align-items: center;
      padding: 10px;
      background: transparent;
    }
    .volume-btn, .fullscreen-btn, .control-btn {
      background: rgba(0,0,0,0.5);
      border: none;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .mute-indicator {
      position: absolute;
      bottom: 20px;
      right: 60px;
      background: rgba(255,0,0,0.7);
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
      z-index: 1003;
    }
    .seek-indicator-left, .seek-indicator-right {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0,0,0,0.7);
      padding: 10px;
      border-radius: 5px;
      color: white;
      display: flex;
      align-items: center;
      gap: 5px;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 1003;
    }
    .seek-indicator-left { left: 10px; }
    .seek-indicator-right { right: 10px; }
    .seek-indicator-left.show, .seek-indicator-right.show { opacity: 1; }
    .timer-options {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 10px;
    }
    .timer-options button {
      width: 100%;
      padding: 12px;
      border-radius: 8px;
      font-size: 18px;
      color: white;
      border: none;
      cursor: pointer;
      transition: background 0.2s;
    }
    .timer-options button:nth-child(odd) { background: #444; }
    .timer-options button:nth-child(even) { background: #555; }
    .timer-options button.selected { background: #ff0000; }
    #timerCountdown {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
      padding: 20px;
    }
    #countdownDisplay { font-size: 48px; font-weight: bold; color: white; }
    #deactivateTimer { background: white; color: #111; padding: 12px 20px; border-radius: 8px; font-size: 16px; border: none; cursor: pointer; }
    #velocidadContent .options-panel {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
      padding: 20px;
    }
    #currentSpeed { font-size: 32px; font-weight: bold; color: white; }
    #speedSlider { width: 100%; height: 4px; background: #ccc; appearance: none; border-radius: 2px; cursor: pointer; }
    #speedSlider::-webkit-slider-thumb { appearance: none; width: 20px; height: 20px; background: white; border-radius: 50%; border: 2px solid #ff0000; transition: transform 0.2s; }
    #speedSlider::-webkit-slider-thumb:hover { transform: scale(1.2); }
    .speed-labels { display: flex; justify-content: space-between; width: 100%; font-size: 14px; color: #ddd; }
    .panel-content { flex-grow: 1; overflow-y: auto; }
    .panel-section { display: none; }
    .panel-section.active { display: block; }
    .next-items, .recomendados-items { overflow-y: auto; }
    .next-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 5px;
      cursor: pointer;
      border-bottom: 1px solid #555;
      height: 50px;
    }
    .next-item:hover { background: #555; }
    .next-item.active { background: #555; }
    .next-item img.cover { width: 40px; height: 40px; margin-right: 10px; object-fit: cover; }
    .next-item span { flex-grow: 1; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #edebeb; }
    .next-item .item-controls { display: flex; gap: 5px; }
    .next-item button { background: transparent; border: none; cursor: pointer; }
    .next-item button img { width: 20px; height: 20px; }
    .likes-view.carousel .likes-carousel { display: flex; overflow-x: auto; gap: 10px; scrollbar-width: none; }
    .likes-view.grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 10px;
      overflow-y: auto;
    }
    .likes-item {
      flex: 0 0 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      padding: 5px;
      border-radius: 8px;
    }
    .likes-item img { width: 80px; height: 80px; border-radius: 8px; object-fit: cover; }
    .likes-item span { color: #edebeb; font-size: 12px; text-align: center; margin-top: 5px; }
    .playlist-items { overflow-y: auto; }
    .playlist-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 5px;
      cursor: pointer;
      border-bottom: 1px solid #555;
      height: 50px;
    }
    .playlist-item.active { background: #555; }
    .playlist-item img.cover { width: 40px; height: 40px; margin-right: 10px; object-fit: cover; }
    .playlist-item span { flex-grow: 1; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #edebeb; }
    .playlist-item .item-controls { display: flex; gap: 8px; align-items: center; }
    .playlist-item button { background: transparent; border: none; cursor: pointer; }
    .playlist-item button img { width: 20px; height: 20px; }
    .drag-handle { cursor: grab; }
    .drag-handle img { width: 18px; height: 18px; opacity: 0.8; }
    .separator { margin: 10px 0; }
    .separator h4 { color: #edebeb; font-size: 16px; }
    .text-content { overflow-y: auto; color: #edebeb; font-size: 14px; }
    .no-items { color: #edebeb; text-align: center; margin-top: 20px; }
    #playUserPlaylistBtn { background: #0c5db3; color: #edebeb; border: none; padding: 8px; border-radius: 5px; cursor: pointer; margin-top: 10px; width: 100%; }
    #playUserPlaylistBtn.active { background: #006400; }
  `;
  document.head.appendChild(style);

  // --- Funciones globales expuestas ---
  window.togglePlayer = () => {
    if (!currentMedia) {
      const programa = window.PROGRAMA_DEL_DIA || {
        mediaUrl: 'https://awscdn.podcasts.com/audio-vhhlggMJNysHnLYW8KXAQwu4w.mp3',
        mediaType: 'audio',
        coverUrlContainer: 'https://s3.amazonaws.com/podcasts-image-uploads/el-populismo-y-la-democracia-jesus-huerta-de-soto-1400x1400.png',
        coverUrlInfo: 'https://www.edu.balta.lat/web/image/415-8ae27244/media.png',
        title: 'El populismo y la democracia',
        detailUrl: '#',
        author: "Jesús Huerta de Soto",
        text: "No disponible",
        allowDownload: true
      };
      loadMedia(programa.mediaUrl, programa.mediaType, programa.coverUrlContainer, programa.coverUrlInfo, programa.title, programa.detailUrl, programa.author, [], programa.text, programa.allowDownload);
      togglePlayPause(true);
      showExpanded();
      throttledSaveState();
    } else {
      showExpanded();
    }
  };

  window.playEpisode = (mediaUrl, mediaType = 'audio', coverUrlContainer = '', coverUrlInfo = '', title = '', detailUrl = '', author = 'Roberto', next = [], text = '', allowDownload = true) => {
    if (currentMedia && currentMedia.mediaUrl === mediaUrl && !mediaElement.paused) {
      togglePlayPause();
    } else {
      loadMedia(mediaUrl, mediaType, coverUrlContainer, coverUrlInfo, title, detailUrl, author, next, text, allowDownload);
      togglePlayPause(true);
      throttledSaveState();
    }
  };

  window.playEpisodeExpanded = (mediaUrl, mediaType = 'audio', coverUrlContainer = '', coverUrlInfo = '', title = '', detailUrl = '', author = 'Roberto', next = [], text = '', allowDownload = true, bgColor = null) => {
    if (bgColor) {
      playerBgColor = bgColor;
      applyBgColor();
    }
    window.playEpisode(mediaUrl, mediaType, coverUrlContainer, coverUrlInfo, title, detailUrl, author, next, text, allowDownload);
    showExpanded();
  };

  window.playEpisodeMinimized = (mediaUrl, mediaType = 'audio', coverUrlContainer = '', coverUrlInfo = '', title = '', detailUrl = '', author = 'Roberto', next = [], text = '', allowDownload = true, bgColor = null) => {
    if (bgColor) {
      playerBgColor = bgColor;
      applyBgColor();
    }
    window.loadEpisode(
      mediaUrl,
      mediaType,
      coverUrlContainer,
      coverUrlInfo,
      title,
      detailUrl,
      author,
      next,
      text,
      allowDownload
    );
    togglePlayPause(true);
    showMinimized();
  };

  window.loadEpisode = loadMedia;

  window.setPlayerBgColor = (color) => {
    playerBgColor = color;
    applyBgColor();
    throttledSaveState();
  };

  window.addToUserPlaylist = (obj) => {
    if (!obj || !obj.mediaUrl) return false;
    if (!playlist.some(p => p.mediaUrl === obj.mediaUrl)) {
      playlist.unshift(obj);
      localStorage.setItem('playlist', JSON.stringify(playlist));
      if (typeof updatePlaylist === 'function') updatePlaylist();
      if (typeof updateAddButton === 'function') updateAddButton();
      return true;
    }
    return false;
  };

  // --- Inicialización ---
  window.addEventListener('load', () => {
    const programa = window.PROGRAMA_DEL_DIA || { title: 'Programa del Día' };
    document.querySelector('.full-width-btn span').textContent = programa.title;
    loadState();
    updatePlaylist();
    updateLikes();
    updateNextList();
    updateRecomendadosList();
    updateTextContent();
    checkTitleOverflow();
    checkMinimizedTitleOverflow();
    updateOpenPlayerButton(!mediaElement.paused);
    applyBgColor(); // Aplicar color por defecto
  });
})();
