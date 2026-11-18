const botaoMenu = document.querySelector('#menu-button');
const navegacao = document.querySelector('#main-navigation');

function mudarMenu(aberto) {
  navegacao.classList.toggle('open', aberto);
  botaoMenu.setAttribute('aria-expanded', String(aberto));
  botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
}

botaoMenu.addEventListener('click', () => {
  mudarMenu(!navegacao.classList.contains('open'));
});

document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && navegacao.classList.contains('open')) {
    mudarMenu(false);
    botaoMenu.focus();
  }
});

document.querySelector('#current-year').textContent = new Date().getFullYear();
document.querySelector('#last-modified').textContent = document.lastModified;
