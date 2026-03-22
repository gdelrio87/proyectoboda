(function () {
    const envelopeClosed = document.getElementById('envelopeClosed');
    const envelopeOpen = document.getElementById('envelopeOpen');
    const envelope = document.getElementById('envelope');
    const confettiContainer = document.getElementById('confetti-container');
    const envelopeActions = document.getElementById('envelopeActions');

    let isOpened = false;

    // Función para generar confeti
    function createConfetti() {
        const confettiPieces = 50;
        const colors = ['#667eea', '#764ba2', '#f3be63', '#ff6b9d', '#00d4ff', '#00ff88'];
        
        for (let i = 0; i < confettiPieces; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            confetti.appendChild(piece);
            confettiContainer.appendChild(confetti);
            
            const startX = Math.random() * window.innerWidth;
            const startY = -20;
            const endX = startX + (Math.random() - 0.5) * 300;
            const endY = window.innerHeight + 20;
            const duration = 2000 + Math.random() * 1000;
            const delay = Math.random() * 200;
            
            confetti.style.left = startX + 'px';
            confetti.style.top = startY + 'px';
            
            // Usar setTimeout para aplicar la animación después de que el elemento se añada al DOM
            setTimeout(() => {
                confetti.style.transition = `all ${duration}ms cubic-bezier(0.12, 0.74, 0.58, 0.99)`;
                confetti.style.transform = `translate(${endX - startX}px, ${endY - startY}px) rotate(${Math.random() * 720}deg)`;
                confetti.style.opacity = '0';
            }, 10);
            
            // Eliminar el confeti después de caer
            setTimeout(() => {
                confetti.remove();
            }, duration + delay + 100);
        }
    }

    // Hacer el sobre clickeable
    if (envelope) {
        envelope.style.cursor = 'pointer';
        envelope.addEventListener('click', openEnvelope);
    }

    function openEnvelope() {
        if (isOpened) return;
        isOpened = true;

        // Esconder el sobre cerrado
        if (envelopeClosed) {
            envelopeClosed.style.opacity = '0';
            envelopeClosed.style.pointerEvents = 'none';
        }

        // Mostrar la carta abierta
        if (envelopeOpen) {
            envelopeOpen.removeAttribute('hidden');
        }

        // Generar confeti después de una pequeña demora
        setTimeout(() => {
            createConfetti();
        }, 200);

        // Mostrar botón de continuar después de la animación
        setTimeout(() => {
            if (envelopeActions) {
                envelopeActions.removeAttribute('hidden');
            }
        }, 1800);
    }

    // Auto-open si se especifica en la URL o tras una demora
    const autoOpen = new URLSearchParams(window.location.search).get('autoopen');
    if (autoOpen === 'true') {
        setTimeout(openEnvelope, 1500);
    }
})();
