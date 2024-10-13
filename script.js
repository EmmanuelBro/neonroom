// Lógica para abrir/cerrar el menú hamburguesa y transformar el ícono en una "X"
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');

// Escuchar el clic en el ícono de hamburguesa
burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active'); // Desplegar el menú
    burger.classList.toggle('toggle'); // Cambiar el ícono de hamburguesa a tache
});