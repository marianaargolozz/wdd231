const membersContainer = document.querySelector('#members');
const gridButton = document.querySelector('#grid-view');
const listButton = document.querySelector('#list-view');
const menuButton = document.querySelector('#menu-button');
const navigation = document.querySelector('#main-navigation');

document.querySelector('#current-year').textContent = new Date().getFullYear();
document.querySelector('#last-modified').textContent = document.lastModified;

menuButton.addEventListener('click', () => {
  const opened = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(opened));
  menuButton.setAttribute('aria-label', opened ? 'Fechar menu' : 'Abrir menu');
});

function setView(view) {
  const showGrid = view === 'grid';
  membersContainer.classList.toggle('grid-view', showGrid);
  membersContainer.classList.toggle('list-view', !showGrid);
  gridButton.classList.toggle('selected', showGrid);
  listButton.classList.toggle('selected', !showGrid);
  gridButton.setAttribute('aria-pressed', String(showGrid));
  listButton.setAttribute('aria-pressed', String(!showGrid));
}

gridButton.addEventListener('click', () => setView('grid'));
listButton.addEventListener('click', () => setView('list'));

function createMemberCard(member) {
  const card = document.createElement('article');
  card.className = 'member-card';
  const image = document.createElement('img');
  image.className = 'member-image';
  image.src = `imagens/${member.imagem}`;
  image.alt = member.nome === 'Palácio das Frutas' ? 'Fotografia de frutas variadas' : `Fotografia associada a ${member.nome}`;
  image.loading = 'lazy';
  image.width = 600;
  image.height = 340;

  const content = document.createElement('div');
  content.className = 'member-content';
  const name = document.createElement('h3');
  name.textContent = member.nome;
  const category = document.createElement('p');
  category.className = 'member-category';
  category.textContent = member.categoria;
  const level = document.createElement('span');
  level.className = `level level-${member.nivel}`;
  level.textContent = ({1:'Membro',2:'Prata',3:'Ouro'})[member.nivel] || 'Membro';
  const address = document.createElement('p');
  address.className = 'member-info';
  address.textContent = `📍 ${member.endereco}`;
  const phone = document.createElement('p');
  phone.className = 'member-info';
  phone.textContent = `☎ ${member.telefone}`;
  const site = document.createElement('a');
  site.className = 'member-site';
  site.href = member.site;
  site.textContent = member.site.includes('google.com/maps') ? 'Ver localização ↗' : 'Visitar site ↗';
  site.target = '_blank';
  site.rel = 'noopener noreferrer';

  content.append(name, category, level, address, phone, site);
  card.append(image, content);
  return card;
}

async function loadMembers() {
  try {
    const response = await fetch('dados/membros.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const members = await response.json();
    membersContainer.replaceChildren(...members.map(createMemberCard));
  } catch (error) {
    console.error('Erro ao carregar empresas:', error);
    membersContainer.innerHTML = '<p class="status">Não foi possível carregar as empresas. Abra a página pelo Live Server e tente novamente.</p>';
  }
}

loadMembers();
