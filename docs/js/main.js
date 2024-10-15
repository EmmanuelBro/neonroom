// main.js

// Función para cargar un archivo HTML en un elemento y ejecutar un callback después
function loadHTML(elementId, url, callback) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar ' + url);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            if (callback) callback();
        })
        .catch(error => {
            console.error('Hubo un problema con la solicitud Fetch:', error);
        });
}

// Cargar el encabezado y el pie de página
loadHTML('header', 'header.html', function () {
    // Aquí colocamos el código que depende del encabezado
    initHeaderScripts();
});

loadHTML('footer', 'footer.html');

// Función que contiene los scripts que dependen del encabezado
function initHeaderScripts() {
    // Código del menú hamburguesa
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');

    burger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
    });

    music();
}


function music() {
    // Código para alternar la imagen de la bocina
    const musicToggleButton = document.getElementById('music-toggle');
    const musicIcon = document.getElementById('music-icon');
    const audio = document.getElementById('background-music');  // Obtener el elemento de audio
    let isMuted = false;

    if (musicToggleButton && musicIcon && audio) {
        musicToggleButton.addEventListener('click', function () {
            // Obtener solo el nombre de archivo de la imagen actual (sin ruta)
            const currentSrc = musicIcon.src.split('/').pop();

            // Cambiar entre las imágenes y alternar el mute
            if (currentSrc === 'volume.png') {
                musicIcon.src = 'images/volume_mute.png';
                audio.pause();  // Pausar la música
                isMuted = true;
            } else {
                musicIcon.src = 'images/volume.png';
                audio.play();   // Reproducir la música
                isMuted = false;
            }
        });
        
        // Reproducir la música automáticamente cuando la página se cargue
        //audio.play();
    } else {
        console.error('El botón o el icono de la música no se encontraron en el DOM');
    }
}