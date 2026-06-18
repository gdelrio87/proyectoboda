
const videoMobile = document.getElementById('introVideoMobile');
const videoDesktop = document.getElementById('introVideoDesktop');
const startOvl = document.getElementById('startOverlay');
const endOvl = document.getElementById('endOverlay');
const replayBtn = document.getElementById('replayBtn');

const mobileQuery = window.matchMedia('(max-width: 767px)');

function activeVideo() {
    return mobileQuery.matches ? videoMobile : videoDesktop;
}

// Muestra el primer fotograma de cada vídeo en cuanto haya metadatos
[videoMobile, videoDesktop].forEach(v => {
    v.addEventListener('loadedmetadata', () => {
        v.currentTime = 0.001;
    });
    v.addEventListener('ended', () => {
        endOvl.classList.remove('hidden');
    });
});

function playVideo() {
    const video = activeVideo();
    video.muted = false;
    video.currentTime = 0;
    const p = video.play();
    if (p !== undefined) {
        p.catch(() => {
            // Fallback: algunos navegadores bloquean audio en el primer intento
            video.muted = true;
            video.play();
        });
    }
}

document.getElementById('startBtn').addEventListener('click', () => {
    startOvl.style.display = 'none';
    playVideo();
});

replayBtn.addEventListener('click', () => {
    endOvl.classList.add('hidden');
    playVideo();
});