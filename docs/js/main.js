document.addEventListener('DOMContentLoaded', () => {
    const headerContainer = document.getElementById('header');
    const footerContainer = document.getElementById('footer');
    const contentContainer = document.getElementById('content');

    // Cargar encabezado y pie de página
    Promise.all([
        loadHTML('header', 'header.html'),
        loadHTML('footer', 'footer.html')
    ]).then(() => {
        initHeaderScripts();
        // Cargar la sección inicial basada en el hash
        loadInitialSection();
    }).catch(error => {
        console.error('Error al cargar el encabezado o el pie de página:', error);
    });

    // Función para cargar HTML en un contenedor
    function loadHTML(elementId, url) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar ' + url);
                }
                return response.text();
            })
            .then(data => {
                document.getElementById(elementId).innerHTML = data;
            });
    }

    // Inicializar scripts después de cargar el encabezado
    function initHeaderScripts() {
        // Manejar el menú hamburguesa
        const burger = document.querySelector('.burger');
        const navLinks = document.querySelector('.nav-links');
        const navLinksElements = document.querySelectorAll('.nav-link');  // Selecciona todos los enlaces del menú
        const musicToggleButton = document.getElementById('music-toggle'); // Botón de la bocina

        if (burger && navLinks) {
            // Alternar el menú hamburguesa abierto/cerrado
            burger.addEventListener('click', () => {
                navLinks.classList.toggle('nav-active');
                burger.classList.toggle('toggle');
            });

            // Cerrar el menú cuando se haga clic en cualquier enlace
            navLinksElements.forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('nav-active');  // Cerrar el menú
                    burger.classList.remove('toggle');  // Revertir la animación de la hamburguesa
                });
            });

            // Music toggle logic moved to initMusic to centralize behavior

        }

        // Inicializar música
        initMusic();

        // Manejar la navegación
        navLinksElements.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const hash = e.target.getAttribute('href');
                navigateTo(hash);
            });
        });

        // Manejar eventos de historial
        window.addEventListener('popstate', () => {
            const hash = window.location.hash || '#home';
            loadSection(hash);
        });
    }


    // Función para manejar la navegación
    function navigateTo(hash) {
        // Actualizar el historial sin recargar la página
        history.pushState(null, null, hash);
        loadSection(hash);
    }

    // Función para cargar una sección específica
    function loadSection(hash) {
        // Mapea hashes a archivos HTML
        const routes = {
            '#home': 'home.html',
            '#rules': 'rules.html',
            '#contact': 'contact.html',
            '#news': 'news.html',
            '#memberships_information': 'memberships_information.html',
            '#data_recolection_especification': 'data_recolection_especification.html'
        };

        const page = routes[hash] || 'home.html';

        fetch(page)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar ' + page);
                }
                return response.text();
            })
            .then(data => {
                document.getElementById('content').innerHTML = data;

                // Selecciona el main correctamente
                const mainElement = document.querySelector('main');
                if (!mainElement) {
                    console.error('No se encontró el elemento main');
                    return;
                }

                const headerCounter = document.getElementById('header-counter');

                if (hash === '#news') {
                    // mainElement.classList.add('transparent'); NO - Keep white background for News
                    mainElement.classList.remove('transparent'); // Restore white background
                    initTowerScroll();

                    // Show Header Counter ONLY for News
                    if (headerCounter) headerCounter.style.display = 'block';
                } else {
                    // For other pages, remove transparent class (default white)
                    mainElement.classList.remove('transparent');
                    if (headerCounter) headerCounter.style.display = 'none';

                    // Only Home is transparent
                    if (hash === '#home' || hash === '') {
                        mainElement.classList.add('transparent');
                    }
                }
            })
            .catch(error => {
                console.error('Error al cargar la sección:', error);
            });
    }

    // Función para cargar la sección inicial basada en el hash
    function loadInitialSection() {
        const hash = window.location.hash || '#home';
        loadSection(hash);
    }

    // Función para inicializar la música
    function initMusic() {
        const musicContainer = document.querySelector('.music-container'); // Select parent container
        const musicIcon = document.getElementById('music-icon');
        const audio = document.getElementById('background-music');
        const musicLeyend = document.querySelector('.music-leyend');  // Referencia a la leyenda
        let isMuted = JSON.parse(localStorage.getItem('isMuted')) || true;  // Iniciar como mute por defecto

        // Configurar el estado inicial
        if (isMuted) {
            musicIcon.src = 'images/volume_mute.png';  // Icono de mute por defecto
            musicLeyend.textContent = '¡Dale play a la bocina para animar el ambiente! 🎶🌃🎶';  // Texto para cuando está muteado
            audio.pause();  // Asegurar que la música no se esté reproduciendo al principio
        } else {
            musicIcon.src = 'images/volume.png';
            musicLeyend.textContent = '¿Demasiado fuerte? Haz clic para mutear. 🙉';  // Texto para cuando está reproduciendo
            audio.play().catch(error => {
                console.log('Autoplay bloqueado:', error);
            });
        }

        if (musicContainer && musicIcon && audio) {
            // Attach event listener to the entire container so text is clickable too
            musicContainer.addEventListener('click', function () {
                if (isMuted) {
                    musicIcon.src = 'images/volume.png';
                    musicLeyend.textContent = '¿Demasiado fuerte? Haz clic para mutear. 🙉';  // Actualizar leyenda al reproducir
                    audio.play();
                    isMuted = false;
                } else {
                    musicIcon.src = 'images/volume_mute.png';
                    musicLeyend.textContent = '¡Dale play para animar el ambiente! 🎶🌃🎶';  // Actualizar leyenda al mutear
                    audio.pause();
                    isMuted = true;
                }
                localStorage.setItem('isMuted', JSON.stringify(isMuted));  // Guardar el estado en localStorage

                // Auto-close menu on music click (User Request)
                const navLinks = document.querySelector('.nav-links');
                const burger = document.querySelector('.burger');
                if (navLinks && burger) {
                    navLinks.classList.remove('nav-active');
                    burger.classList.remove('toggle');
                }
            });
        } else {
            console.error('El botón o el icono de la música no se encontraron en el DOM');
        }
    }


    // Llamar a loadSection según el hash actual al cargar la página
    window.addEventListener('hashchange', () => {
        loadSection(window.location.hash);
    });

    // Cargar la sección inicial al cargar la página
    loadInitialSection();

    // --- Dynamic Tower Generation ---

    const levelsData = [
        {
            level: 10,
            title: "Leyenda Neon",
            desc: "EN ESPERA DEL CAMPEÓN DE PUMP IT UP EN NEÓN ROOM",
            photo: "images/liu_kang.jpg", // Placeholder
            specialClass: "level-top"
        },
        {
            level: 9,
            title: "Pablo - Hulk",
            desc: "Poca resistencia pero muy bueno con la maña, logra conseguir SS en niveles 20-21 e incluso S en niveles 22.",
            photo: "images/fotos/hulk.jpg",
            stats: {
                impetu: 60,
                resistencia: 20,
                velocidad: 90,
                maxLevels: "22-23"
            }
        },
        {
            level: 8,
            title: "Dante",
            desc: "Buscador de PERFECTS, con gran ímpetu y buena velociadad, realizando todos los cambios posibles en las canciones, logra SSS en niveles 17, 18 y 19.",
            photo: "images/fotos/dante.jpg",
            stats: {
                impetu: 65,
                resistencia: 40,
                velocidad: 85,
                maxLevels: "19-21"
            }
        },
        {
            level: 7,
            title: "Emmanuel",
            desc: "Excelente resistencia y energía, logra pasar algunos niveles 20, 21 y 22 con rango S.",
            photo: "images/fotos/emma.jpg",
            stats: {
                impetu: 50,
                resistencia: 90,
                velocidad: 85,
                maxLevels: "20-22"
            }
        },
        {
            level: 6,
            title: "Fabian - El Grande",
            desc: "Buena resistencia y un ímpetu considerable, logra pasar canciones difíciles obteniendo scores de S y SS.",
            photo: "images/fotos/grande.jpg",
            stats: {
                impetu: 40,
                resistencia: 70,
                velocidad: 75,
                maxLevels: "20-22"
            }
        },
        {
            level: 5,
            title: "Cecilia - Sexylia",
            desc: "Famosa por pasar niveles 22 con pura maña, un Ímpetu alto y velocidad muy buena.",
            photo: "images/fotos/cecilia.jpg",
            stats: {
                impetu: 55,
                resistencia: 65,
                velocidad: 60,
                maxLevels: "18-22"
            }
        },
        {
            level: 4,
            title: "Fernando - El Ferna",
            desc: "Resistencia muy buena, logra conseguir niveles 21 con rango S, buena energía.",
            photo: "images/fotos/fernando.jpg",
            stats: {
                impetu: 60,
                resistencia: 75,
                velocidad: 70,
                maxLevels: "19-22"
            }
        },
        {
            level: 3,
            title: "Gustavo - El Gus",
            desc: "Equilibrado, supera niveles 17 y 18 con buenos scores y hasta SSS.",
            photo: "images/fotos/gustavo.jpg",
            stats: {
                impetu: 45,
                resistencia: 75,
                velocidad: 55,
                maxLevels: "18-22"
            }
        },
        {
            level: 2,
            title: "Erick - Gil",
            desc: "Muy buena resistencia, logra conseguir scores S y doble SS en niveles 16 y 17.",
            photo: "images/fotos/gil.jpeg",
            stats: {
                impetu: 65,
                resistencia: 45,
                velocidad: 40,
                maxLevels: "16-19"
            }
        },
        {
            level: 1,
            title: "Yanet - La Galle",
            desc: "Siempre se esfuerza al máximo! logrando scores S y SS en niveles intermedios.",
            photo: "images/fotos/yanet.jpg",
            stats: {
                impetu: 80,
                resistencia: 30,
                velocidad: 35,
                maxLevels: "15-18"
            }
        }
    ];

    function renderTower() {
        const towerContainer = document.querySelector('.tower');
        if (!towerContainer) return;

        towerContainer.innerHTML = ''; // Clear existing content

        levelsData.forEach(level => {
            const levelDiv = document.createElement('div');
            levelDiv.className = `tower-level ${level.specialClass || ''} ${level.level === 1 ? 'level-bottom' : ''}`;

            // Player Slot
            let playerSlotHTML = '';
            if (level.photo) {
                playerSlotHTML = `
                    <div class="player-slot">
                        <img src="${level.photo}" alt="${level.title}" class="player-photo">
                    </div>`;
            } else {
                playerSlotHTML = `
                    <div class="player-slot">
                        <div class="placeholder-photo">?</div>
                    </div>`;
            }

            // Stats HTML
            let statsHTML = '';
            if (level.stats) {
                statsHTML = `
                    <div class="player-stats">
                        <div class="stat-row">
                            <span class="stat-label">Ímpetu</span>
                            <div class="stat-bar"><div class="stat-fill" style="width: ${level.stats.impetu}%; background: #bd00ff; color: #bd00ff;"></div></div>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Resistencia</span>
                            <div class="stat-bar"><div class="stat-fill" style="width: ${level.stats.resistencia}%; background: #bd00ff; color: #bd00ff;"></div></div>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Velocidad</span>
                            <div class="stat-bar"><div class="stat-fill" style="width: ${level.stats.velocidad}%; background: #bd00ff; color: #bd00ff;"></div></div>
                        </div>
                        <div class="stat-info">Max Level Promedio: ${level.stats.maxLevels}</div>
                    </div>`;
            }

            // Calculate Rank (10 down to 1)
            const rank = 11 - level.level;

            // Only color the rank # number Blue if it's NOT the top rank (#1).
            // Rank #1 should inherit the card's text style (User request).
            const rankHtml = rank === 1
                ? `#${rank}`
                : `<span style="color: #00ffff;">#${rank}</span>`;

            levelDiv.innerHTML = `
                ${playerSlotHTML}
                <div class="challenge-info">
                    <h3>${level.title}<br><span style="font-size: 0.8em; color: #eee;">Posición en la torre: ${rankHtml}</span></h3>
                    <p>${level.desc}</p>
                    ${statsHTML}
                </div>
            `;

            towerContainer.appendChild(levelDiv);
        });
    }


    /* --- Animación de Scroll Infinito Vertical (Torre) --- */
    function initTowerScroll() {
        const tower = document.querySelector('.tower');
        if (!tower) return;

        // Render content first
        renderTower();

        const originalContent = tower.innerHTML;
        // Clonar el contenido para el efecto infinito
        tower.innerHTML += originalContent;

        // Logic for CTA after 2 loops
        let loopCount = 0;
        tower.addEventListener('animationiteration', () => {
            loopCount++;
            // The animation logic is tricky because 'infinite' usually means no iteration event until end? 
            // Actually animationiteration fires at the end of each cycle.
            // We want 1 full cycle.
            if (loopCount >= 1) {
                showTowerCTA();
            }
        });
    }

    function showTowerCTA() {
        const towerContainer = document.querySelector('.tower-scroll-container');
        if (!towerContainer) return;

        // Replace content with CTA
        towerContainer.innerHTML = `
            <div class="tower-cta">
                <div class="cta-header-row" style="display: flex; align-items: center; justify-content: center; gap: 15px; width: 100%;">
                    <img src="images/pump_logo.png" class="cta-logo pump">
                    <h2 style="flex: 1; margin: 0;">¿Quieres ser un Campeón?</h2>
                    <img src="images/dragon_neon.jpg" class="cta-logo dragon">
                </div>
                <p>¡Forma parte de la Torre de los​ Campeones retando a alguno de los challengers!​</p>
                <div class="cta-contact-box">
                    <p>Escanea el siguiente código QR o envia un WhatsApp y coordinemos una reta 🤙</p>
                    <div class="qr-row" style="display: flex; align-items: center; justify-content: center; gap: 20px;">
                        <div class="cta-decoration">🏆</div>
                        <div class="qr-code-container">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://wa.me/525525131883" alt="WhatsApp QR Code" class="cta-qr">
                        </div>
                        <div class="cta-decoration">🏆</div>
                    </div>
                    <a href="https://wa.me/525525131883" target="_blank" class="cta-phone">5525131883</a>
                </div>
            </div>
        `;

        // Add class to container to remove mask/adjust height
        towerContainer.classList.add('cta-mode');

        // Cycle Logic: Wait 6s, then fade out and restart
        setTimeout(() => {
            const ctaElement = towerContainer.querySelector('.tower-cta');
            if (ctaElement) {
                ctaElement.classList.add('fade-out');
                // Wait for fade out animation (2s) then restart
                setTimeout(restartTower, 2000);
            }
        }, 10000); // Display time: 6 seconds

        // Hide Logos for cleaner look
        const logos = document.querySelector('.tower-logos');
        if (logos) logos.style.display = 'none';

        // Hide Title text as well to make it cleaner? No user just said logos.
        // Actually, reducing the title or hiding it might help move things up too. 
        // User said: "elimina lo iconos... parta que se vea mas arriba"
    }

    function restartTower() {
        const towerContainer = document.querySelector('.tower-scroll-container');
        if (!towerContainer) return;

        // Remove CTA mode class
        towerContainer.classList.remove('cta-mode');

        // Restore basic structure
        towerContainer.innerHTML = '<div class="tower"></div>';

        // Restore Logos
        const logos = document.querySelector('.tower-logos');
        if (logos) logos.style.display = 'flex'; // Restore flex display

        // Re-initialize scroll animation
        initTowerScroll();
    }

    // Inicializar el scroll de la torre si estamos en la página correcta
    // Usamos un observer para detectar cuando la sección de noticias es visible (o cargada)
    const observer = new MutationObserver((mutations) => {
        if (document.querySelector('.tower')) {
            initTowerScroll();
            observer.disconnect(); // Dejar de observar una vez inicializado
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Intenta inicializar inmediatamente por si ya está cargado
    if (document.querySelector('.tower')) {
        initTowerScroll();
    }

});

//TODO: Agregar un contador de visitas a la pagina XD