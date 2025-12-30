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
                    document.body.classList.add('news-page');
                    // mainElement.classList.add('transparent'); NO - Keep white background for News
                    mainElement.classList.remove('transparent'); // Restore white background
                    initTowerScroll();

                    // Show Header Counter ONLY for News
                    if (headerCounter) headerCounter.style.display = 'block';
                } else {
                    document.body.classList.remove('news-page');
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
            title: "Leyenda Neón",
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
                resistencia: 15,
                velocidad: 80,
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
                velocidad: 70,
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
                resistencia: 85,
                velocidad: 60,
                maxLevels: "20-22"
            }
        },
        {
            level: 6,
            title: "Fabian - Grande",
            desc: "Buena resistencia y un ímpetu considerable, logra pasar canciones difíciles obteniendo scores de S y SS.",
            photo: "images/fotos/grande.jpg",
            stats: {
                impetu: 40,
                resistencia: 70,
                velocidad: 55,
                maxLevels: "20-22"
            }
        },
        {
            level: 5,
            title: "Cecilia - Sexylia",
            desc: "Famosa por pasar niveles 22 con pura maña, un Ímpetu alto y velocidad muy buena.",
            photo: "images/fotos/cecilia.jpg",
            stats: {
                impetu: 50,
                resistencia: 60,
                velocidad: 70,
                maxLevels: "18-22"
            }
        },
        {
            level: 4,
            title: "Fernando - Ferna",
            desc: "Resistencia muy buena, logra conseguir niveles 21 con rango S, buena energía.",
            photo: "images/fotos/fernando.jpg",
            stats: {
                impetu: 55,
                resistencia: 50,
                velocidad: 65,
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
                resistencia: 70,
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
                impetu: 60,
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
                impetu: 70,
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

        const template = document.getElementById('tower-card-template');
        if (!template) {
            console.error('Template #tower-card-template not found!');
            return;
        }

        levelsData.forEach(level => {
            const clone = template.content.cloneNode(true);
            const levelDiv = clone.querySelector('.tower-level');

            // 1. Level Classes
            levelDiv.classList.add(...(level.specialClass || '').split(' ').filter(c => c));
            if (level.level === 1) levelDiv.classList.add('level-bottom');

            // 2. Player Slot (Image or Placeholder)
            const playerSlot = clone.querySelector('.player-slot');
            if (level.photo) {
                const img = document.createElement('img');
                img.src = level.photo;
                img.alt = level.title;
                img.className = 'player-photo';
                playerSlot.appendChild(img);
            } else {
                const placeholder = document.createElement('div');
                placeholder.className = 'placeholder-photo';
                placeholder.textContent = '?';
                playerSlot.appendChild(placeholder);
            }

            // 3. Info (Title, Rank, Desc)
            // Title
            const titleNode = document.createTextNode(props_title(level.title));
            const levelTitle = clone.querySelector('.level-title');
            levelTitle.prepend(titleNode);

            // Helper to get just the name part if needed, but here simple prepend works 
            // if we assume structure is text + <br> + span. 
            // Actually, innerHTML is safer for the <br> structure or we reconstruct it.
            // Let's reconstruction for safety to avoid losing the span.
            levelTitle.innerHTML = `${level.title}<br>`;

            // Re-append the rank label span (it was wiped by innerHTML)
            const rankLabelSpan = document.createElement('span');
            rankLabelSpan.className = 'level-rank-label';
            rankLabelSpan.style.cssText = "font-size: 0.8em; color: #eee;";
            rankLabelSpan.textContent = "Posición en la torre: ";

            const rankValueSpan = document.createElement('span');
            rankValueSpan.className = 'level-rank';

            // Calculate Rank
            const rank = 11 - level.level;
            rankValueSpan.textContent = `#${rank}`;

            if (rank !== 1) {
                rankValueSpan.style.color = '#00ffff';
            }

            rankLabelSpan.appendChild(rankValueSpan);
            levelTitle.appendChild(rankLabelSpan);


            // Description
            clone.querySelector('.level-desc').textContent = level.desc;

            // 4. Stats
            const statsContainer = clone.querySelector('.player-stats');
            if (level.stats) {
                statsContainer.style.display = 'block';

                // Set widths
                clone.querySelector('.stat-impetu').style.width = `${level.stats.impetu}%`;
                clone.querySelector('.stat-resistencia').style.width = `${level.stats.resistencia}%`;
                clone.querySelector('.stat-velocidad').style.width = `${level.stats.velocidad}%`;

                // Max Levels Text
                clone.querySelector('.stat-max-levels').textContent = level.stats.maxLevels;
            }

            towerContainer.appendChild(clone);
        });
    }

    // Helper just in case, though logically I did it inline
    function props_title(t) { return t; }


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
                startBannerSequence();
            }
        });
    }

    function startBannerSequence() {
        const towerContainer = document.querySelector('.tower-scroll-container');
        if (!towerContainer) return;

        // Add class to container to remove mask/adjust height (reused from previous implementation)
        towerContainer.classList.add('cta-mode');

        const banners = [
            { templateId: 'banner-whatsapp' },
            { templateId: 'banner-pricing' },
            { templateId: 'banner-memberships' },
            { templateId: 'banner-drinks' }
        ];

        let currentBannerIndex = 0;

        function showBanner(index) {
            if (index >= banners.length) {
                // Sequence finished, restart tower
                const ctaElement = towerContainer.querySelector('.tower-cta');
                if (ctaElement) {
                    ctaElement.classList.add('fade-out');

                    // Fade out title too
                    const title = document.querySelector('.tower-title');
                    if (title) {
                        title.classList.remove('fade-in');
                        title.classList.add('fade-out');
                    }

                    setTimeout(restartTower, 500); // Wait 0.5s (snappier transition)
                } else {
                    restartTower();
                }
                return;
            }

            // Get template
            const templateId = banners[index].templateId;
            const template = document.getElementById(templateId);

            if (template) {
                // Clear container and clone template
                towerContainer.innerHTML = '';
                const clone = template.content.cloneNode(true);
                towerContainer.appendChild(clone);
            } else {
                console.error(`Template ${templateId} not found`);
                // Fallback to avoid breaking loop
                towerContainer.innerHTML = `<p>Error: Banner not found</p>`;
            }


            // Update Title Text dynamically
            const title = document.querySelector('.tower-title');
            if (title && title.firstChild) {
                // Remove previous fade classes and ensure visible
                title.classList.remove('fade-out');
                title.classList.add('fade-in');
                title.style.display = 'block';

                // Update text based on index
                if (index === 0) {
                    title.firstChild.textContent = "Torre de los Campeones";
                } else if (index === 1) {
                    title.firstChild.textContent = "Precios Pump It Up";
                } else if (index === 2) {
                    title.firstChild.textContent = "Membresías";
                } else if (index === 3) {
                    title.firstChild.textContent = "";
                }
            }

            // Custom timeout for specific banners
            let displayTime = 6000;
            if (index === 0) { // WhatsApp Banner
                displayTime = 9000; // Increased to 9s
            }

            // Wait display time then Fade out
            setTimeout(() => {
                const ctaElement = towerContainer.querySelector('.tower-cta');
                if (ctaElement) {
                    ctaElement.classList.add('fade-out');

                    // Synchronize title fade out
                    const title = document.querySelector('.tower-title');
                    if (title) {
                        title.classList.remove('fade-in');
                        title.classList.add('fade-out');
                    }
                }

                // Next banner (wait 2s for fade)
                setTimeout(() => {
                    showBanner(index + 1);
                }, 2000);

            }, displayTime);
        }

        // Start with first banner
        showBanner(0);

        // Hide Logos for cleaner look
        const logos = document.querySelector('.tower-logos');
        if (logos) logos.style.display = 'none';

        // Ensure Title is visible initially (Banner 0)
        const title = document.querySelector('.tower-title');
        if (title) title.style.display = 'block';
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

        // Restore Title
        const title = document.querySelector('.tower-title');
        if (title && title.firstChild) {
            title.classList.remove('fade-out'); // Ensure fade-out is removed
            title.classList.add('fade-in');     // Animate entrance
            title.style.display = 'block';
            title.firstChild.textContent = "Torre de los Campeones";
        }

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