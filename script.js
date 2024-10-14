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

