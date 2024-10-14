const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
});

// script.js

function adjustMainPadding() {
    const nav = document.querySelector('nav');
    const main = document.querySelector('main');
    const navHeight = nav.offsetHeight;
    main.style.paddingTop = navHeight + 20 + 'px'; // 20 es espacio adicional
}

// Ejecutar al cargar la página y al cambiar el tamaño de la ventana
window.addEventListener('load', adjustMainPadding);
window.addEventListener('resize', adjustMainPadding);

//Audio scripts
// Obtener referencias al audio y al botón
var myAudio = document.getElementById("myAudio");
var muteButton = document.getElementById("muteButton");

// Iniciar el audio automáticamente al cargar la página
window.onload = function() {
    myAudio.play().catch(function() {
        // Algunos navegadores requieren interacción del usuario para reproducir audio
        console.log("El usuario necesita interactuar con la página para iniciar el audio.");
    });
}

// Variable para llevar el control del estado del audio
var isPlaying = true;

// Función para pausar/reanudar el audio
muteButton.onclick = function() {
    if (isPlaying) {
        myAudio.pause();
        muteButton.src = "images/volume-off.png";
    } else {
        myAudio.play();
        muteButton.src = "images/volume-on.png";
    }
    isPlaying = !isPlaying;
}
