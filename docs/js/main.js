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
loadHTML('header', 'header.html', function() {
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
}


// Agregar evento de clic en dispositivos táctiles
const flipCards = document.querySelectorAll('.card');

flipCards.forEach(card => {
    card.addEventListener('click', function() {
        this.querySelector('.card-inner').classList.toggle('is-flipped');
    });
});
