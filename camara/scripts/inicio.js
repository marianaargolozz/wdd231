// Chave do OpenWeatherMap configurada para o projeto.
const chaveOpenWeather = 'e6a62ebe2b5419b3e5b745f55f20dc02';
const zonaDaCidade = 'America/Bahia';
const formatoDia = new Intl.DateTimeFormat('en-CA', {
  timeZone: zonaDaCidade, year: 'numeric', month: '2-digit', day: '2-digit'
});
const rotuloDia = new Intl.DateTimeFormat('pt-BR', {
  timeZone: zonaDaCidade, weekday: 'short', day: '2-digit', month: '2-digit'
});
const temperaturaAtual = document.querySelector('#tempo-atual');
const previsao = document.querySelector('#previsao');
const destaques = document.querySelector('#destaques');

function elemento(tag, texto, classe) {
  const novo = document.createElement(tag);
  if (texto) novo.textContent = texto;
  if (classe) novo.className = classe;
  return novo;
}

async function buscarJSON(url) {
  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error(`Resposta HTTP ${resposta.status}`);
  return resposta.json();
}

function rotuloTemperatura(valor) {
  return `${Math.round(valor)} °C`;
}

async function carregarClima() {
  if (chaveOpenWeather === 'SUA_CHAVE_AQUI' || !chaveOpenWeather.trim()) {
    temperaturaAtual.replaceChildren(elemento('p', 'Dados de tempo ainda não configurados.'));
    previsao.replaceChildren(elemento('p', 'Previsão indisponível no momento.'));
    return;
  }

  const parametros = new URLSearchParams({
    lat: '-12.9689',
    lon: '-39.2614',
    appid: chaveOpenWeather.trim(),
    units: 'metric',
    lang: 'pt_br'
  });
  const base = 'https://api.openweathermap.org/data/2.5';

  const [atual, futuro] = await Promise.allSettled([
    buscarJSON(`${base}/weather?${parametros}`),
    buscarJSON(`${base}/forecast?${parametros}`)
  ]);

  if (atual.status === 'fulfilled') {
    temperaturaAtual.replaceChildren(
      elemento('p', rotuloTemperatura(atual.value.main.temp), 'inicio-temperatura'),
      elemento('p', atual.value.weather[0].description)
    );
  } else {
    temperaturaAtual.replaceChildren(elemento('p', 'Não foi possível carregar as condições atuais.'));
  }

  if (futuro.status !== 'fulfilled') {
    previsao.replaceChildren(elemento('p', 'Não foi possível carregar a previsão.'));
    return;
  }

  const hoje = formatoDia.format(Date.now());
  const dias = new Map();
  const horarios = [...futuro.value.list].sort((a, b) => a.dt - b.dt);

  for (const horario of horarios) {
    const data = new Date(horario.dt * 1000);
    const dia = formatoDia.format(data);
    if (dia <= hoje) continue;

    const faixa = dias.get(dia) ?? { data, minima: Infinity, maxima: -Infinity };
    faixa.minima = Math.min(faixa.minima, horario.main.temp);
    faixa.maxima = Math.max(faixa.maxima, horario.main.temp);
    dias.set(dia, faixa);
  }

  const lista = elemento('ul', '', 'inicio-previsao');
  for (const { data, minima, maxima } of [...dias.values()].slice(0, 3)) {
    lista.append(elemento('li', `${rotuloDia.format(data)} · mín. ${rotuloTemperatura(minima)} / máx. ${rotuloTemperatura(maxima)}`));
  }
  previsao.replaceChildren(lista.childElementCount ? lista : elemento('p', 'Previsão indisponível no momento.'));
}

function sortearDestaques(membros) {
  const elegiveis = membros.filter(({ nivel }) => [2, 3].includes(Number(nivel)));
  for (let i = elegiveis.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [elegiveis[i], elegiveis[j]] = [elegiveis[j], elegiveis[i]];
  }
  return elegiveis.slice(0, 3);
}

function criarCartao(membro) {
  const nivel = Number(membro.nivel);
  const cartao = elemento('article', '', 'member-card');
  const imagem = elemento('img', '', 'member-image');
  const baseImagem = membro.imagem.replace(/\.[^.]+$/, '');
  imagem.src = membro.logo ? `imagens/${membro.logo}` : `imagens/destaques/${baseImagem}.webp`;
  imagem.alt = membro.logo ? `Logotipo de ${membro.nome}` : `Foto de ${membro.nome}`;
  imagem.width = 420;
  imagem.height = 230;
  imagem.loading = 'lazy';
  const conteudo = elemento('div', '', 'member-content');
  const link = elemento('a', membro.site.includes('google.com/maps') ? 'Ver no mapa' : 'Visitar site', 'member-site');
  link.href = membro.site;
  link.setAttribute('aria-label', `${link.textContent} — ${membro.nome}`);

  conteudo.append(
    elemento('h3', membro.nome),
    elemento('p', membro.categoria, 'member-category'),
    elemento('span', nivel === 3 ? 'Ouro' : 'Prata', `level level-${nivel}`),
    elemento('p', membro.endereco, 'member-info'),
    elemento('p', membro.telefone, 'member-info'),
    link
  );
  cartao.append(imagem, conteudo);
  return cartao;
}

async function carregarDestaques() {
  try {
    const membros = await buscarJSON('dados/membros.json');
    const selecionados = sortearDestaques(membros);
    if (selecionados.length < 2) throw new Error('Menos de dois membros Ouro ou Prata.');
    destaques.replaceChildren(...selecionados.map(criarCartao));
  } catch (erro) {
    destaques.replaceChildren(elemento('p', 'Não foi possível carregar os destaques.', 'status'));
    console.error('Destaques:', erro);
  }
}

carregarClima().catch(() => {
  temperaturaAtual.replaceChildren(elemento('p', 'Tempo indisponível no momento.'));
  previsao.replaceChildren(elemento('p', 'Previsão indisponível no momento.'));
});
carregarDestaques();
