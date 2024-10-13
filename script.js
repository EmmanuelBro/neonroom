// Menú hamburguesa (abrir/cerrar)
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
    burger.classList.toggle('toggle'); // Añade esta línea para animación y cambiar el estado
});
