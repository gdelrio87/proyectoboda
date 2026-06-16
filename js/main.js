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

(function () {
    const monthsElement = document.getElementById('months');
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const weddingRsvpForm = document.getElementById('weddingRsvpForm');
    const googleFormResponseFrame = document.getElementById('googleFormResponseFrame');
    const formStatus = document.getElementById('formStatus');
    const weddingRsvpSubmit = document.getElementById('weddingRsvpSubmit');
    const FORM_ERROR_MESSAGE = 'No se ha podido enviar el formulario. Intentalo de nuevo en unos minutos.';
    const FORM_SUCCESS_MESSAGE = 'Se ha enviado un correo de confirmación al email. En caso de error, puede modificar la respuesta siguiendo las instrucciones del mismo.';
    const FORM_SUBMISSION_TIMEOUT_MS = 10000;
    let formSubmissionInProgress = false;
    let formSubmissionTimeoutId = null;

    function updateCountdown() {
        if (!monthsElement || !daysElement || !hoursElement || !minutesElement || !secondsElement) {
            return;
        }

        const wedding = new Date('November 21, 2026 12:00:00');
        const now = new Date();

        // Calcular meses completos restantes
        let months = (wedding.getFullYear() - now.getFullYear()) * 12 + (wedding.getMonth() - now.getMonth());

        // Fecha futura avanzando 'months' meses desde ahora
        const futureDate = new Date(now);
        futureDate.setMonth(futureDate.getMonth() + months);

        // Si nos pasamos, retroceder un mes
        if (futureDate > wedding) {
            months--;
            futureDate.setMonth(futureDate.getMonth() - 1);
        }

        // Milisegundos restantes tras restar los meses completos
        const remaining = wedding - futureDate;

        const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

        monthsElement.textContent = months;
        daysElement.textContent = days;
        hoursElement.textContent = hours;
        minutesElement.textContent = minutes;
        secondsElement.textContent = seconds;
    }

    function clearSubmissionTimeout() {
        if (formSubmissionTimeoutId) {
            clearTimeout(formSubmissionTimeoutId);
            formSubmissionTimeoutId = null;
        }
    }

    function resetSubmissionState() {
        formSubmissionInProgress = false;
        clearSubmissionTimeout();

        if (weddingRsvpSubmit) {
            weddingRsvpSubmit.disabled = false;
            weddingRsvpSubmit.textContent = 'Enviar Confirmacion';
        }
    }

    function showFormStatus(message, isError) {
        if (!formStatus) {
            return;
        }

        formStatus.textContent = message;
        formStatus.hidden = false;
        formStatus.classList.toggle('is-error', isError);
        formStatus.classList.toggle('is-success', !isError);
    }

    if (monthsElement && daysElement && hoursElement && minutesElement && secondsElement) {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    if (weddingRsvpForm && googleFormResponseFrame && formStatus && weddingRsvpSubmit) {
        googleFormResponseFrame.addEventListener('load', () => {
            if (!formSubmissionInProgress) {
                return;
            }

            clearSubmissionTimeout();
            weddingRsvpForm.reset();
            weddingRsvpForm.hidden = true;
            showFormStatus(FORM_SUCCESS_MESSAGE, false);
            resetSubmissionState();

            // Centrar la sección de confirmación en el viewport
            var seccionConfirmacion = document.getElementById('confirmacion');
            if (seccionConfirmacion) {
                seccionConfirmacion.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            // Ocultar mensaje y mostrar de nuevo el formulario tras 4 segundos
            setTimeout(() => {
                formStatus.hidden = true;
                formStatus.classList.remove('is-success', 'is-error');
                weddingRsvpForm.hidden = false;
                // Restablecer visibilidad condicional: ocultar todos los grupos opcionales
                weddingRsvpForm.querySelectorAll('.form-group--visible').forEach(function (el) {
                    el.classList.remove('form-group--visible');
                    el.classList.add('form-group--hidden');
                });
                // Ocultar fieldsets condicionales
                ['fieldset-comida', 'fieldset-transporte', 'fieldset-adicionales'].forEach(function (id) {
                    var fs = document.getElementById(id);
                    if (fs) fs.classList.add('form-fieldset--hidden');
                });
            }, 30000);
        });

        weddingRsvpForm.addEventListener('submit', (event) => {
            if (!weddingRsvpForm.checkValidity()) {
                event.preventDefault();
                showFormStatus(FORM_ERROR_MESSAGE, true);
                return;
            }

            if (!window.navigator.onLine) {
                event.preventDefault();
                showFormStatus(FORM_ERROR_MESSAGE, true);
                return;
            }

            formSubmissionInProgress = true;
            clearSubmissionTimeout();
            formStatus.hidden = true;
            weddingRsvpSubmit.disabled = true;
            weddingRsvpSubmit.textContent = 'Enviando...';
            formSubmissionTimeoutId = window.setTimeout(() => {
                if (!formSubmissionInProgress) {
                    return;
                }

                resetSubmissionState();
                showFormStatus(FORM_ERROR_MESSAGE, true);
            }, FORM_SUBMISSION_TIMEOUT_MS);
        });

        weddingRsvpForm.addEventListener('invalid', () => {
            showFormStatus(FORM_ERROR_MESSAGE, true);
        }, true);

        window.addEventListener('offline', () => {
            if (!formSubmissionInProgress) {
                return;
            }

            resetSubmissionState();
            showFormStatus(FORM_ERROR_MESSAGE, true);
        });
    }
})();

/* ── Visibilidad condicional del formulario ── */
(function () {
    function show(id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.remove('form-group--hidden');
        el.classList.add('form-group--visible');
    }
    function hide(id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.remove('form-group--visible');
        el.classList.add('form-group--hidden');
        // Limpiar valores al ocultar
        el.querySelectorAll('input').forEach(function (inp) {
            if (inp.type === 'radio' || inp.type === 'checkbox') {
                inp.checked = false;
            } else {
                inp.value = '';
            }
        });
    }
    function showFieldset(id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.remove('form-fieldset--hidden');
    }
    function hideFieldset(id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.add('form-fieldset--hidden');
    }

    const gruposAsistencia = [
        'group-acompanante', 'group-hijos',
        'group-alergias', 'group-vegano', 'group-bus-ida', 'group-bus-vuelta',
        'group-cancion', 'group-comentario'
    ];
    const fieldsetsAsistencia = ['fieldset-comida', 'fieldset-transporte', 'fieldset-adicionales'];

    // Radios de asistencia
    document.querySelectorAll('input[name="entry.877086558"]').forEach(function (radio) {
        radio.addEventListener('change', function () {
            if (this.value === 'Sí') {
                gruposAsistencia.forEach(show);
                fieldsetsAsistencia.forEach(showFieldset);
            } else {
                gruposAsistencia.forEach(hide);
                hide('group-nombre-acompanante');
                hide('group-hijos-detalle');
                hide('group-bus-vuelta-cual');
                fieldsetsAsistencia.forEach(hideFieldset);
            }
        });
    });

    // Radios de acompañante
    document.querySelectorAll('input[name="entry.1899259683"]').forEach(function (radio) {
        radio.addEventListener('change', function () {
            if (this.value === 'Sí') { show('group-nombre-acompanante'); }
            else { hide('group-nombre-acompanante'); }
        });
    });

    // Radios de hijos
    document.querySelectorAll('input[name="entry.186004565"]').forEach(function (radio) {
        radio.addEventListener('change', function () {
            if (this.value === 'Sí') { show('group-hijos-detalle'); }
            else { hide('group-hijos-detalle'); }
        });
    });

    // Radios de bus de vuelta
    document.querySelectorAll('input[name="entry.303435702"]').forEach(function (radio) {
        radio.addEventListener('change', function () {
            if (this.value === 'Sí') { show('group-bus-vuelta-cual'); }
            else { hide('group-bus-vuelta-cual'); }
        });
    });

    // Validación visual en campos requeridos
    var form = document.getElementById('weddingRsvpForm');
    if (!form) return;

    function clearError(inputEl, errorId) {
        inputEl.classList.remove('input--invalid');
        var err = document.getElementById(errorId);
        if (err) err.classList.remove('field-error--visible');
    }

    var inputNombre = document.getElementById('input-nombre');
    if (inputNombre) {
        inputNombre.addEventListener('input', function () { clearError(this, 'error-nombre'); });
    }

    var inputEmail = document.getElementById('input-email');
    if (inputEmail) {
        inputEmail.addEventListener('input', function () { clearError(this, 'error-email'); });
    }

    document.querySelectorAll('input[name="entry.877086558"]').forEach(function (radio) {
        radio.addEventListener('change', function () {
            var err = document.getElementById('error-asistencia');
            if (err) err.classList.remove('field-error--visible');
        });
    });

    // Limpiar errores de campos condicionales al interactuar
    ['entry.1899259683', 'entry.186004565', 'entry.1679883743', 'entry.303435702'].forEach(function (name) {
        var errorMap = {
            'entry.1899259683': 'error-acompanante',
            'entry.186004565': 'error-hijos',
            'entry.1679883743': 'error-bus-ida',
            'entry.303435702': 'error-bus-vuelta'
        };
        document.querySelectorAll('input[name="' + name + '"]').forEach(function (radio) {
            radio.addEventListener('change', function () {
                var err = document.getElementById(errorMap[name]);
                if (err) err.classList.remove('field-error--visible');
            });
        });
    });

    var inputAlergias = document.getElementById('input-alergias');
    if (inputAlergias) {
        inputAlergias.addEventListener('input', function () { clearError(this, 'error-alergias'); });
    }
    var inputVegano = document.getElementById('input-vegano');
    if (inputVegano) {
        inputVegano.addEventListener('input', function () { clearError(this, 'error-vegano'); });
    }
    var inputNombreAcompanante = document.getElementById('input-nombre-acompanante');
    if (inputNombreAcompanante) {
        inputNombreAcompanante.addEventListener('input', function () { clearError(this, 'error-nombre-acompanante'); });
    }
    var inputHijosDetalle = document.getElementById('input-hijos-detalle');
    if (inputHijosDetalle) {
        inputHijosDetalle.addEventListener('input', function () { clearError(this, 'error-hijos-detalle'); });
    }
    document.querySelectorAll('input[name="entry.595612430"]').forEach(function (radio) {
        radio.addEventListener('change', function () {
            var err = document.getElementById('error-bus-vuelta-cual');
            if (err) err.classList.remove('field-error--visible');
        });
    });

    form.addEventListener('submit', function (e) {
        var valid = true;

        // Validar nombre
        if (inputNombre && !inputNombre.value.trim()) {
            inputNombre.classList.add('input--invalid');
            var errNombre = document.getElementById('error-nombre');
            if (errNombre) errNombre.classList.add('field-error--visible');
            valid = false;
        }

        // Validar email
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (inputEmail && (!inputEmail.value.trim() || !emailRegex.test(inputEmail.value.trim()))) {
            inputEmail.classList.add('input--invalid');
            var errEmail = document.getElementById('error-email');
            if (errEmail) errEmail.classList.add('field-error--visible');
            valid = false;
        }

        // Validar asistencia
        var asistenciaSeleccionada = form.querySelector('input[name="entry.877086558"]:checked');
        if (!asistenciaSeleccionada) {
            var errAsistencia = document.getElementById('error-asistencia');
            if (errAsistencia) errAsistencia.classList.add('field-error--visible');
            valid = false;
        }

        // Validar campos obligatorios cuando asistencia = Sí
        if (asistenciaSeleccionada && asistenciaSeleccionada.value === 'Sí') {
            var camposRadioCondicionales = [
                { name: 'entry.1899259683', errorId: 'error-acompanante' },
                { name: 'entry.186004565', errorId: 'error-hijos' },
                { name: 'entry.1679883743', errorId: 'error-bus-ida' },
                { name: 'entry.303435702', errorId: 'error-bus-vuelta' }
            ];
            camposRadioCondicionales.forEach(function (campo) {
                if (!form.querySelector('input[name="' + campo.name + '"]:checked')) {
                    var err = document.getElementById(campo.errorId);
                    if (err) err.classList.add('field-error--visible');
                    valid = false;
                }
            });

            if (inputAlergias && !inputAlergias.value.trim()) {
                inputAlergias.classList.add('input--invalid');
                var errAlergias = document.getElementById('error-alergias');
                if (errAlergias) errAlergias.classList.add('field-error--visible');
                valid = false;
            }
            if (inputVegano && !inputVegano.value.trim()) {
                inputVegano.classList.add('input--invalid');
                var errVegano = document.getElementById('error-vegano');
                if (errVegano) errVegano.classList.add('field-error--visible');
                valid = false;
            }

            // Validar nombre acompañante si viene con acompañante
            var acompananteSi = form.querySelector('input[name="entry.1899259683"]:checked');
            if (acompananteSi && acompananteSi.value === 'Sí') {
                if (inputNombreAcompanante && !inputNombreAcompanante.value.trim()) {
                    inputNombreAcompanante.classList.add('input--invalid');
                    var errNombreAcomp = document.getElementById('error-nombre-acompanante');
                    if (errNombreAcomp) errNombreAcomp.classList.add('field-error--visible');
                    valid = false;
                }
            }

            // Validar detalle hijos si viene con hijos
            var hijosSi = form.querySelector('input[name="entry.186004565"]:checked');
            if (hijosSi && hijosSi.value === 'Sí') {
                if (inputHijosDetalle && !inputHijosDetalle.value.trim()) {
                    inputHijosDetalle.classList.add('input--invalid');
                    var errHijosDetalle = document.getElementById('error-hijos-detalle');
                    if (errHijosDetalle) errHijosDetalle.classList.add('field-error--visible');
                    valid = false;
                }
            }

            // Validar qué bus de vuelta si necesita bus de vuelta
            var busVueltaSi = form.querySelector('input[name="entry.303435702"]:checked');
            if (busVueltaSi && busVueltaSi.value === 'Sí') {
                if (!form.querySelector('input[name="entry.595612430"]:checked')) {
                    var errBusVueltaCual = document.getElementById('error-bus-vuelta-cual');
                    if (errBusVueltaCual) errBusVueltaCual.classList.add('field-error--visible');
                    valid = false;
                }
            }

        } // fin if asistencia === 'Sí'

        if (!valid) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var primerError = form.querySelector('.input--invalid, .field-error--visible');
            if (primerError) primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, true); // capture: true para ejecutar antes del listener existente
})();

/* ── Menú de navegación (sección 0) ── */
(function () {
    const toggle = document.getElementById('navToggle');
    const nav = document.getElementById('heroNav');
    if (!toggle || !nav) return;

    function openMenu() {
        nav.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        nav.setAttribute('aria-hidden', 'false');
    }

    function closeMenu() {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        nav.setAttribute('aria-hidden', 'true');
    }

    toggle.addEventListener('click', () => {
        nav.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    // Cerrar al pulsar un enlace
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Cerrar al pulsar fuera del menú
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !toggle.contains(e.target)) {
            closeMenu();
        }
    });
})();

/* ── Slideshow sección 0 ── */
(function () {
    const slides = document.querySelectorAll('.hero-slideshow .slide');
    if (slides.length < 2) return;

    let current = 0;
    const NORMAL_INTERVAL = 3000;
    let intervalId = null;

    function goTo(index) {
        slides[current].classList.remove('active');
        current = index;
        slides[current].classList.add('active');
        updateDots();
    }

    function next() {
        goTo((current + 1) % slides.length);
    }

    function startInterval(delay) {
        clearInterval(intervalId);
        intervalId = setInterval(next, delay);
    }

    function updateDots() {
        document.querySelectorAll('.slideshow-dot').forEach(function (dot, i) {
            dot.classList.toggle('slideshow-dot--active', i === current);
        });
    }

    // Crear dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slideshow-dots';
    slides.forEach(function (_, i) {
        const dot = document.createElement('button');
        dot.className = 'slideshow-dot' + (i === 0 ? ' slideshow-dot--active' : '');
        dot.setAttribute('aria-label', 'Foto ' + (i + 1));
        dot.addEventListener('click', function () {
            goTo(i);
            startInterval(NORMAL_INTERVAL);
        });
        dotsContainer.appendChild(dot);
    });
    slides[0].closest('.hero-slideshow').appendChild(dotsContainer);

    // Primera transición rápida (1.5s), luego ritmo normal
    setTimeout(function () {
        next();
        startInterval(NORMAL_INTERVAL);
    }, 1500);
})();

/* ── Lightbox para imágenes del cronograma ── */
(function () {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Imagen ampliada');

    const img = document.createElement('img');
    img.alt = '';
    overlay.appendChild(img);
    document.body.appendChild(overlay);

    function open(src, alt) {
        img.src = src;
        img.alt = alt || '';
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
        // Limpiar src tras la transición para liberar memoria
        setTimeout(function () { img.src = ''; }, 300);
    }

    overlay.addEventListener('click', close);

    document.querySelectorAll('.step-painting').forEach(function (painting) {
        painting.addEventListener('click', function () {
            open(this.src || this.currentSrc, this.alt);
        });

        // Envolver imagen + lupa en un bloque vertical
        var wrap = document.createElement('div');
        wrap.className = 'step-painting-block';
        painting.parentNode.insertBefore(wrap, painting);
        wrap.appendChild(painting);

        var hint = document.createElement('span');
        hint.className = 'step-painting-hint';
        hint.setAttribute('aria-hidden', 'true');
        hint.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="16" y1="16" x2="21" y2="21"/></svg>';
        wrap.appendChild(hint);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
            close();
        }
    });
})();

/* ── Scroll reveal con IntersectionObserver ── */
(function () {
    if (!('IntersectionObserver' in window)) {
        // Fallback: mostrar todo de golpe si no hay soporte
        document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
            el.classList.add('is-visible');
        });
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                // Quitar la clase al salir para que vuelva a animar al hacer scroll de vuelta
                entry.target.classList.remove('is-visible');
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
        observer.observe(el);
    });
})();

/* ── Fix posición elementos fixed en móvil (iOS Safari / Chrome dynamic toolbar) ──
   Cuando la barra de URL del navegador aparece o desaparece durante el scroll,
   el visualViewport.offsetTop cambia y los elementos fixed saltan.
   Compensamos manualmente ese desplazamiento. ── */
(function () {
    if (!window.visualViewport) return;

    var overlay = document.querySelector('.hero-text-overlay');
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('heroNav');

    var BASE_TOP = 14;   // px desde el borde superior
    var NAV_OFFSET = 60;   // px desde el borde superior para el menú desplegado

    function reposition() {
        var offsetY = window.visualViewport.offsetTop;
        if (overlay) overlay.style.top = (offsetY + BASE_TOP) + 'px';
        if (toggle) toggle.style.top = (offsetY + BASE_TOP) + 'px';
        if (nav) nav.style.top = (offsetY + NAV_OFFSET) + 'px';
    }

    window.visualViewport.addEventListener('scroll', reposition);
    window.visualViewport.addEventListener('resize', reposition);
})();

/* ── Hilo rojo: construcción de texto letra a letra al hacer scroll ── */
(function () {
    var container = document.getElementById('redThreadText');
    if (!container) return;

    var text = 'El hilo rojo conecta a quienes están destinados a estar juntos, no importa ni el tiempo ni el lugar, al final siempre se encontrarán... E&G';

    // Construir un <span> por carácter
    var hiloStart = text.indexOf('hilo rojo');
    var hiloEnd = hiloStart + 'hilo rojo'.length - 1;
    text.split('').forEach(function (ch, i) {
        var span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch;
        if (i >= hiloStart && i <= hiloEnd) {
            span.style.color = '#ff0000';
        }
        container.appendChild(span);
    });

    var chars = container.querySelectorAll('.char');
    var total = chars.length;
    var rafPending = false;
    var BLUR_ZONE = 10; // número de caracteres con efecto borroso en la frontera

    // Hilo SVG superior
    var threadPath = document.getElementById('redThreadPath');
    var threadLength = threadPath ? threadPath.getTotalLength() : 0;
    if (threadPath) {
        threadPath.style.strokeDasharray = threadLength;
        threadPath.style.strokeDashoffset = threadLength;
    }

    // Hilo SVG inferior
    var threadPathBottom = document.getElementById('redThreadPathBottom');
    var threadLengthBottom = threadPathBottom ? threadPathBottom.getTotalLength() : 0;
    if (threadPathBottom) {
        threadPathBottom.style.strokeDasharray = threadLengthBottom;
        threadPathBottom.style.strokeDashoffset = threadLengthBottom;
    }

    function update() {
        var section = container.closest('.red-thread-section');
        var rect = section.getBoundingClientRect();
        var wh = window.innerHeight;

        // Arranca cuando el top de la sección baja al 85% del viewport (casi entrado, no inmediatamente)
        // y termina cuando el top llega al 30% → sección centrada en pantalla = texto completo.
        var startPoint = wh * 0.85;
        var range = wh * 0.55;  // 0.85 - 0.30 = 0.55 → completo cuando rect.top ≈ 0.3*wh
        var progress = Math.max(0, Math.min(1, (startPoint - rect.top) / range));

        var visibleCount = Math.round(progress * total);
        var finished = progress >= 1;

        chars.forEach(function (ch, i) {
            if (i >= visibleCount) {
                ch.classList.remove('is-visible');
                ch.style.opacity = '';
                ch.style.filter = '';
            } else {
                ch.classList.add('is-visible');
                // Cuando el texto está completo, quitar cualquier blur residual
                if (finished) {
                    ch.style.filter = '';
                    ch.style.opacity = '';
                    return;
                }
                // Zona de desenfoque en la frontera (no aplica al último carácter)
                var distFromFrontier = visibleCount - 1 - i;
                if (distFromFrontier < BLUR_ZONE) {
                    var t = distFromFrontier / (BLUR_ZONE - 1);
                    var blurPx = (1 - t) * 5;
                    var opacVal = 0.15 + t * 0.85;
                    ch.style.filter = 'blur(' + blurPx.toFixed(2) + 'px)';
                    ch.style.opacity = opacVal.toFixed(3);
                } else {
                    ch.style.filter = '';
                    ch.style.opacity = '';
                }
            }
        });

        // Hilo superior: se dibuja durante la primera mitad del progress (0 → 0.65)
        if (threadPath) {
            var topP = Math.min(1, progress / 0.65);
            threadPath.style.strokeDashoffset = (threadLength * (1 - topP)).toFixed(2);
        }
        // Hilo inferior: empieza cuando el superior termina (progress 0.65 → 1)
        if (threadPathBottom) {
            var bottomP = Math.max(0, Math.min(1, (progress - 0.65) / 0.35));
            threadPathBottom.style.strokeDashoffset = (threadLengthBottom * (1 - bottomP)).toFixed(2);
        }

        rafPending = false;
    }

    function onScroll() {
        if (!rafPending) {
            rafPending = true;
            requestAnimationFrame(update);
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // Sin llamada inicial: la sección empieza completamente vacía
})();
