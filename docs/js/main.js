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
    
            // Cerrar el menú cuando se haga clic en el botón de la bocina
            if (musicToggleButton) {
                musicToggleButton.addEventListener('click', () => {
                    navLinks.classList.remove('nav-active');  // Cerrar el menú
                    burger.classList.remove('toggle');  // Revertir la animación de la hamburguesa
                });
            }
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
    
                // Si estamos en home, añadimos la clase .transparent
                if (hash === '#home' || hash === '') {
                    mainElement.classList.add('transparent');
                } else {
                    // Para las otras páginas, quitamos la clase .transparent
                    mainElement.classList.remove('transparent');
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
        const musicToggleButton = document.getElementById('music-toggle');
        const musicIcon = document.getElementById('music-icon');
        const audio = document.getElementById('background-music');
        const musicLeyend = document.querySelector('.music-leyend');  // Referencia a la leyenda
        let isMuted = JSON.parse(localStorage.getItem('isMuted')) || true;  // Iniciar como mute por defecto
    
        // Configurar el estado inicial
        if (isMuted) {
            musicIcon.src = 'images/volume_mute.png';  // Icono de mute por defecto
            musicLeyend.textContent = '¡Dale play para animar el ambiente! 🎶🌃🎶';  // Texto para cuando está muteado
            audio.pause();  // Asegurar que la música no se esté reproduciendo al principio
        } else {
            musicIcon.src = 'images/volume.png';
            musicLeyend.textContent = '¿Demasiado fuerte? Haz clic para mutear. 🙉';  // Texto para cuando está reproduciendo
            audio.play().catch(error => {
                console.log('Autoplay bloqueado:', error);
            });
        }
    
        if (musicToggleButton && musicIcon && audio) {
            musicToggleButton.addEventListener('click', function () {
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
});

//TODO: Agregar un contador de visitas a la pagina XD