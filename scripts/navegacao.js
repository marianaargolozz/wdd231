const menuButton = document.querySelector('#menuButton');
const mainNav = document.querySelector('#mainNav');

menuButton.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  menuButton.querySelector('span').textContent = isOpen ? '✕' : '☰';
});
