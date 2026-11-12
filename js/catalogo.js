
function calcularMedia(notaMinha, notaAmigos = notaMinha) {
  return (notaMinha + notaAmigos) / 2;
}

function classificarPrato(media) {
  if (media >= 9) {
    return "Imperdível";
  } else if (media >= 7) {
    return "Muito bom";
  } else if (media >= 5) {
    return "Regular";
  } else {
    return "Evitar";
  }
}

function classeDaFaixa(faixa) {
  switch (faixa) {
    case "Imperdível":
      return "faixa-imperdivel";
    case "Muito bom":
      return "faixa-muito-bom";
    case "Regular":
      return "faixa-regular";
    default:
      return "faixa-evitar";
  }
}


function notaValida(nota) {
  return !Number.isNaN(nota) && nota >= 0 && nota <= 10;
}

// Aula 9, seção 12: for...of com contador (acumulador dentro de um objeto)
function contarPorCategoria(pratos) {
  const contagem = {};
  for (const prato of pratos) {
    contagem[prato.categoria] = (contagem[prato.categoria] || 0) + 1;
  }
  return contagem;
}

// Aula 9: for clássico com dois acumuladores (soma e quantidade por categoria).
//
// Teste de mesa com os 3 primeiros pratos (coxinha 8.2, feijoada 9.2, moqueca 7.8):
//   volta | i | categoria        | soma da categoria | quantidade
//   ------|---|------------------|-------------------|-----------
//     1   | 0 | Entrada          | 0 + 8.2 = 8.2     | 1
//     2   | 1 | Prato principal  | 0 + 9.2 = 9.2     | 1
//     3   | 2 | Prato principal  | 9.2 + 7.8 = 17.0  | 2
// Final: média de "Prato principal" até aqui = 17.0 / 2 = 8.5
function mediaPorCategoria(pratos) {
  const categorias = [];   // guarda a ordem em que cada categoria apareceu
  const somas = {};
  const quantidades = {};

  for (let i = 0; i < pratos.length; i++) {   // i < length (e não <=), pra evitar off-by-one
    const categoria = pratos[i].categoria;

    if (somas[categoria] === undefined) {
      categorias.push(categoria);
      somas[categoria] = 0;
      quantidades[categoria] = 0;
    }

    somas[categoria] += pratos[i].media;
    quantidades[categoria] += 1;
  }

  return categorias.map((categoria) => ({
    categoria: categoria,
    media: somas[categoria] / quantidades[categoria]
  }));
}

// filter devolve um array NOVO, sem mexer no original
function filtrarPorCategoria(pratos, categoria) {
  return pratos.filter((prato) => prato.categoria === categoria);
}

// reduce junta tudo num valor só (começa em 0)
function somarMedias(pratos) {
  return pratos.reduce((total, prato) => total + prato.media, 0);
}

// Aula 11, erro 4: sort ALTERA o array em que é chamado. Uso [...pratos] pra
// ordenar uma CÓPIA e não embaralhar o array original.
function rankearPratos(pratos) {
  return [...pratos].sort((a, b) => b.media - a.media);
}

// Operador ternário (Aula 9): uma decisão simples com duas saídas
function pluralizar(quantidade, singular, plural) {
  return quantidade === 1 ? singular : plural;
}


/* =============================================================
   PARTE 2: funções que mexem na página (DOM)
   ============================================================= */

// Lê os cards do HTML e transforma cada um num objeto.
function lerPratosDaPagina() {
  const cards = document.querySelectorAll(".card-prato");

  // querySelectorAll devolve uma NodeList, que NÃO tem map/filter.
  // Por isso o Array.from antes (Aula 11, erro 5).
  return Array.from(cards)
    .map((card) => {
      // desestruturação: data-nota-minha vira dataset.notaMinha (camelCase)
      const { nome, categoria, notaMinha, notaAmigos, vegetariano } = card.dataset;

      const minha = Number(notaMinha);       // dataset é sempre texto, então converto
      const amigos = Number(notaAmigos);

      return {
        elemento: card,
        nome: nome,
        categoria: categoria,
        notaMinha: minha,
        notaAmigos: amigos,
        vegetariano: vegetariano === "true", // "true" (texto) -> true (boolean)
        media: calcularMedia(minha, amigos)
      };
    })
    .filter((prato) => notaValida(prato.notaMinha) && notaValida(prato.notaAmigos));
}

// Mostra "Média X: faixa" dentro do card e liga a classe da faixa.
// textContent trata tudo como texto puro (nada de innerHTML com dado de fora).
function exibirPontuacao(prato) {
  const faixa = classificarPrato(prato.media);

  const texto = document.createElement("p");
  texto.classList.add("pontuacao");
  texto.textContent = `Média ${prato.media.toFixed(1)}: ${faixa}`;

  prato.elemento.append(texto);
  prato.elemento.classList.add(classeDaFaixa(faixa));
}

function criarItemDeLista(texto) {
  const item = document.createElement("li");
  item.textContent = texto;
  return item;
}

// Monta o painel de resumo e coloca logo antes da grade de cards.
function exibirResumo(pratos) {
  const grade = document.querySelector(".grade-pratos");

  if (grade === null) {
    console.warn("Grade de pratos não encontrada, o resumo não foi criado.");
    return;
  }
  if (pratos.length === 0) {
    return;   // evita dividir por zero na média geral
  }

  const melhor = rankearPratos(pratos)[0];
  const mediaGeral = somarMedias(pratos) / pratos.length;
  const vegetarianos = pratos.filter((prato) => prato.vegetariano).length;
  const contagem = contarPorCategoria(pratos);

  const porCategoria = Object.entries(contagem)
    .map(([categoria, quantidade]) => `${categoria}: ${quantidade}`)
    .join(", ");

  const linhas = [
    `${pratos.length} ${pluralizar(pratos.length, "prato", "pratos")} no catálogo`,
    `Média geral: ${mediaGeral.toFixed(1)}`,
    `Melhor avaliado: ${melhor.nome} (${melhor.media.toFixed(1)})`,
    `Por categoria: ${porCategoria}`,
    `${vegetarianos} ${pluralizar(vegetarianos, "prato vegetariano", "pratos vegetarianos")}`
  ];

  const titulo = document.createElement("h3");
  titulo.textContent = "Resumo do catálogo";

  const lista = document.createElement("ul");
  lista.replaceChildren(...linhas.map(criarItemDeLista));

  const painel = document.createElement("div");
  painel.classList.add("resumo-catalogo");
  painel.append(titulo, lista);

  grade.before(painel);
}

function iniciarCatalogo() {
  const pratos = lerPratosDaPagina();

  if (pratos.length === 0) {
    console.warn("Nenhum prato válido encontrado nos cards.");
    return;
  }

  // Callback é o NOME da função, sem parênteses (Aula 11, erro 2)
  pratos.forEach(exibirPontuacao);
  exibirResumo(pratos);

  // desenharGrafico vem do main.js (os dois arquivos dividem o escopo global)
  if (typeof desenharGrafico === "function") {
    desenharGrafico(mediaPorCategoria(pratos));
  }

  // Pra conferir no console (Aula 9): ranking sem alterar o array original
  console.table(
    rankearPratos(pratos).map((prato) => ({
      prato: prato.nome,
      categoria: prato.categoria,
      media: prato.media.toFixed(1),
      faixa: classificarPrato(prato.media)
    }))
  );
}

iniciarCatalogo();
