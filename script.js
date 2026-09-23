const vTubers = [
  {
    id: 2,
    name: 'mih_estelar',
    pais: 'brasil',
    founder: true,
    description: 'Fundadora e VTuber principal',
    tiktok: 'https://www.tiktok.com/@mih_estelar',
    youtube: 'https://www.youtube.com/@mih_estelar',
    twitch: 'https://www.twitch.tv/mih_estelar',
    kick: '',
    avatar: 'oriel.jpeg'
  },

  {
    id: 3,
    name: 'Kiyomi Suzuri',
    pais: 'brasil',
    founder: false,
    description: 'VTuber PNG',
    tiktok: 'https://www.tiktok.com/@kiyomisazuri123iu9',
    youtube: 'https://youtube.com/@kiyomisuzuri',
    twitch: '',
    kick: '',
    avatar: 'Kiyomi Suzuri.jpeg'
  },

  {
    id: 4,
    name: 'Fumi',
    pais: 'brasil',
    founder: false,
    description: 'VTuber',
    tiktok: '',
    youtube: 'https://www.youtube.com/channel/UClJDPLqgC_hcWexhemRtGFQ',
    twitch: 'https://www.twitch.tv/fumi_vtuber',
    kick: '',
    avatar: 'fumi.jpeg'
  }
];

/* Remove acentos e deixa o texto em minúsculo para pesquisar melhor */
function normalizarTexto(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function nomePlataforma(platform) {
  const plataformas = {
    tiktok: 'TikTok',
    youtube: 'YouTube',
    twitch: 'Twitch',
    kick: 'Kick'
  };

  return plataformas[platform] || platform;
}

/* ABRIR ABA CLICANDO NO MENU */
function openTab(event, tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  document.querySelectorAll('.tab-btn').forEach(botao => {
    botao.classList.remove('active');
  });

  const aba = document.getElementById(tabName);

  if (aba) {
    aba.classList.add('active');
  }

  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  }
}

/* ABRIR ABA PELO CÓDIGO, QUANDO CLICA NA PESQUISA */
function abrirAbaPorId(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  document.querySelectorAll('.tab-btn').forEach(botao => {
    botao.classList.remove('active');

    const onclick = botao.getAttribute('onclick') || '';

    if (onclick.includes(`'${tabName}'`)) {
      botao.classList.add('active');
    }
  });

  const aba = document.getElementById(tabName);

  if (aba) {
    aba.classList.add('active');
  }
}

/* CARREGA OS CARDS DO PAÍS */
function carregarPlataforma(tabName, platform, pais, platformName, botaoClicado) {
  const grid = document.getElementById(`vtuber-grid-${platform}`);
  const searchLetras = document.getElementById(`search-letras-${platform}`);
  const searchResult = document.getElementById(`search-result-${platform}`);

  document.querySelectorAll(`#${tabName} .pais-btn`).forEach(botao => {
    botao.classList.remove('active');
  });

  if (botaoClicado) {
    botaoClicado.classList.add('active');
  }

  grid.innerHTML = '';

  grid.classList.add('mostrar');
  searchLetras.classList.add('mostrar');
  searchResult.classList.add('mostrar');

  const filtrados = vTubers.filter(vtuber => {
    return vtuber.pais === pais && vtuber[platform];
  });

  if (filtrados.length === 0) {
    grid.innerHTML = `
      <div class="aviso-vazio">
        Ainda não existem VTubers ou PNGTubers cadastrados neste país
        para a plataforma ${platformName}.
      </div>
    `;
  } else {
    filtrados.forEach(vtuber => {
      const card = document.createElement('article');

      card.className = 'vtuber-card';
      card.id = `vtuber-${platform}-${vtuber.id}`;

      card.innerHTML = `
        <img
          class="vtuber-avatar"
          src="${vtuber.avatar}"
          alt="Avatar de ${vtuber.name}"
        >

        <div class="vtuber-name">
          ${vtuber.name}${vtuber.founder ? ' ⭐ Fundadora' : ''}
        </div>

        <div class="vtuber-description">
          ${vtuber.description || ''}
        </div>

        <div class="social-links">
          <a
            href="${vtuber[platform]}"
            target="_blank"
            rel="noopener noreferrer"
          >
            ${platformName}
          </a>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  const nomesPais = {
    brasil: '🇧🇷 brasileiros',
    portugal: '🇵🇹 portugueses',
    inglaterra: '🇬🇧 ingleses',
    australia: '🇦🇺 australianos',
    indonesia: '🇮🇩 indonésios',
    franca: '🇫🇷 franceses',
    lituania: '🇱🇹 lituanos',
    usa: '🇺🇸 americanos'
  };

  searchResult.textContent =
    `${filtrados.length} VTubers ${nomesPais[pais] || 'encontrados'}`;

  criarBotoesLetras(
    `search-letras-${platform}`,
    `vtuber-grid-${platform}`
  );
}

/* CRIA OS BOTÕES A, B, C... */
function criarBotoesLetras(containerId, gridId) {
  const container = document.getElementById(containerId);

  container.innerHTML = '';

  const todas = document.createElement('button');

  todas.type = 'button';
  todas.className = 'letra-btn todas active';
  todas.textContent = 'TODAS';

  todas.addEventListener('click', event => {
    filtrarPorLetra(gridId, '', event);
  });

  container.appendChild(todas);

  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letra => {
    const botao = document.createElement('button');

    botao.type = 'button';
    botao.className = 'letra-btn';
    botao.textContent = letra;

    botao.addEventListener('click', event => {
      filtrarPorLetra(gridId, letra, event);
    });

    container.appendChild(botao);
  });
}

/* FILTRA OS CARDS PELO ALFABETO */
function filtrarPorLetra(gridId, letra, event) {
  const grid = document.getElementById(gridId);
  const cards = grid.querySelectorAll('.vtuber-card');
  const botoes = grid.parentElement.querySelectorAll('.letra-btn');

  botoes.forEach(botao => {
    botao.classList.remove('active');
  });

  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  }

  let quantidade = 0;

  cards.forEach(card => {
    const nome = normalizarTexto(
      card.querySelector('.vtuber-name').textContent
    );

    if (letra === '' || nome.charAt(0).toUpperCase() === letra) {
      card.style.display = 'flex';
      quantidade++;
    } else {
      card.style.display = 'none';
    }
  });

  const platform = gridId.replace('vtuber-grid-', '');

  document.getElementById(`search-result-${platform}`).textContent =
    letra === ''
      ? `Mostrando todos (${quantidade})`
      : `Letra "${letra}": ${quantidade}`;
}

/* PESQUISA ESTILO GOOGLE */
function pesquisarGoogleVTuber(platform) {
  const input = document.getElementById(`pesquisa-google-${platform}`);
  const resultados = document.getElementById(
    `resultados-google-${platform}`
  );

  if (!input || !resultados) {
    return;
  }

  const termo = normalizarTexto(input.value);

  resultados.innerHTML = '';

  /* Se não escreveu nada, fecha a lista */
  if (termo === '') {
    resultados.classList.remove('mostrar');
    return;
  }

  /* Procura o nome em toda a Biblioteca */
  const encontradosNaBiblioteca = vTubers.filter(vtuber => {
    return normalizarTexto(vtuber.name).includes(termo);
  });

  /* Não encontrou o VTuber/PNGTuber */
  if (encontradosNaBiblioteca.length === 0) {
    resultados.innerHTML = `
      <div class="search-google-nenhum">
        <strong>Não encontramos esse VTuber ou PNGTuber na Biblioteca.</strong>
        <br><br>
        Seu VTuber/PNGTuber talvez não tenha aceitado participar da
        Biblioteca VTuber ou ainda não saiba sobre o projeto.
      </div>
    `;

    resultados.classList.add('mostrar');
    return;
  }

  /* Encontrou o nome, mas não existe link dessa plataforma */
  const encontradosNaPlataforma = encontradosNaBiblioteca.filter(vtuber => {
    return vtuber[platform];
  });

  if (encontradosNaPlataforma.length === 0) {
    resultados.innerHTML = `
      <div class="search-google-nenhum">
        <strong>Esse VTuber foi encontrado na Biblioteca.</strong>
        <br><br>
        Porém, ainda não possui link cadastrado para
        ${nomePlataforma(platform)}.
      </div>
    `;

    resultados.classList.add('mostrar');
    return;
  }

  /* Cria os resultados encontrados */
  encontradosNaPlataforma.forEach(vtuber => {
    const opcao = document.createElement('button');

    opcao.type = 'button';
    opcao.className = 'search-google-opcao';

    opcao.innerHTML = `
      <img src="${vtuber.avatar}" alt="">

      <span>
        <span class="search-google-opcao-nome">
          ${vtuber.name}
        </span>

        <span class="search-google-opcao-info">
          ${vtuber.description || 'VTuber/PNGTuber da Biblioteca'}
          • ${nomePlataforma(platform)}
        </span>
      </span>
    `;

    opcao.addEventListener('click', () => {
      abrirCardPesquisado(vtuber, platform);
    });

    resultados.appendChild(opcao);
  });

  resultados.classList.add('mostrar');
}

/* CLICOU EM UM RESULTADO DA PESQUISA */
function abrirCardPesquisado(vtuber, platform) {
  const dadosPlataforma = {
    tiktok: {
      aba: 'TikTok',
      nome: 'TikTok'
    },

    youtube: {
      aba: 'YouTube',
      nome: 'YouTube'
    },

    twitch: {
      aba: 'Twitch',
      nome: 'Twitch'
    },

    kick: {
      aba: 'kick',
      nome: 'Kick'
    }
  };

  const dados = dadosPlataforma[platform];

  if (!dados) {
    return;
  }

  abrirAbaPorId(dados.aba);

  const aba = document.getElementById(dados.aba);

  const botaoPais = aba.querySelector(
    `.pais-btn.${vtuber.pais}`
  );

  carregarPlataforma(
    dados.aba,
    platform,
    vtuber.pais,
    dados.nome,
    botaoPais
  );

  const input = document.getElementById(`pesquisa-google-${platform}`);
  const resultados = document.getElementById(
    `resultados-google-${platform}`
  );

  input.value = vtuber.name;
  resultados.innerHTML = '';
  resultados.classList.remove('mostrar');

  setTimeout(() => {
    const card = document.getElementById(
      `vtuber-${platform}-${vtuber.id}`
    );

    if (!card) {
      return;
    }

    card.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    card.classList.remove('card-destacado');

    setTimeout(() => {
      card.classList.add('card-destacado');
    }, 300);
  }, 150);
}

/* Fecha os resultados se clicar fora da pesquisa */
document.addEventListener('click', event => {
  if (!event.target.closest('.search-google')) {
    document.querySelectorAll('.search-google-resultados').forEach(lista => {
      lista.classList.remove('mostrar');
    });
  }
});

/* Mostra o total na aba Início */
document.addEventListener('DOMContentLoaded', () => {
  const total = document.getElementById('total-vtubers');

  if (total) {
    total.textContent = `${vTubers.length} VTubers na Biblioteca`;
  }
});