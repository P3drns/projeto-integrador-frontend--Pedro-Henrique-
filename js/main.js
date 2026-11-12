// ===== main.js =====
// Aula 4: qual formato de vídeo o navegador vai usar (canPlayType)
// Aula 5: gráfico de barras em Canvas, animado com requestAnimationFrame
//
// Aula 11: main.js e catalogo.js dividem o MESMO escopo global. Se eu declarar
// uma const com o mesmo nome nos dois, dá "Identifier has already been
// declared". Por isso tudo aqui fica dentro de funções.


/* ---------- Aula 4: formato de vídeo ---------- */
function mostrarFormatoSuportado() {
  const video = document.querySelector("video");
  const aviso = document.querySelector(".aviso-formato");

  // Aula 11, erro 5: se o seletor devolver null, não posso usar o resultado
  if (video === null || aviso === null) {
    console.warn("Vídeo ou aviso de formato não encontrado na página.");
    return;
  }

  // Mesma ordem dos <source> do HTML (WebM primeiro, MP4 de fallback).
  // Informo o codecs de propósito: sem ele o navegador só responde "maybe"
  // (Aula 4, seção 4.2).
  const formatos = [
    { label: "WebM (VP9/Opus)", tipo: 'video/webm; codecs="vp9, opus"' },
    { label: "MP4 (H.264/AAC)", tipo: 'video/mp4; codecs="avc1.64001E, mp4a.40.2"' }
  ];

  // Aula 4, erro 2: canPlayType devolve TEXTO ("", "maybe" ou "probably"),
  // não um booleano. Por isso comparo cada valor com ===.
  const provavel = formatos.find((f) => video.canPlayType(f.tipo) === "probably");
  const talvez = formatos.find((f) => video.canPlayType(f.tipo) === "maybe");

  if (provavel) {
    aviso.textContent = `Seu navegador provavelmente vai reproduzir este vídeo em ${provavel.label}.`;
  } else if (talvez) {
    aviso.textContent = `Seu navegador pode conseguir reproduzir este vídeo em ${talvez.label}.`;
  } else {
    aviso.textContent = "Não foi possível confirmar suporte a nenhum dos formatos de vídeo oferecidos.";
  }
}


/* ---------- Aula 5: gráfico em Canvas ---------- */
// "dados" é um array de objetos: [{ categoria: "Entrada", media: 8.2 }, ...]
// Quem monta esse array é o catalogo.js, e a função fica aqui porque é de desenho.
function desenharGrafico(dados) {
  const canvas = document.getElementById("grafico-categorias");

  if (canvas === null || !Array.isArray(dados) || dados.length === 0) {
    console.warn("Não deu pra desenhar o gráfico (canvas ou dados ausentes).");
    return;
  }

  const ctx = canvas.getContext("2d");
  const cores = ["#166534", "#dc2626", "#eab308"];
  const chao = canvas.height - 30;   // linha de base das barras
  const escala = 14;                 // pixels por ponto de nota (10 pontos = 140px)
  const larguraBarra = 60;
  const espaco = 40;

  // Canvas é "immediate mode" (Aula 5): ele não lembra o que foi desenhado.
  // Por isso a cada quadro eu limpo tudo (clearRect) e desenho de novo.
  // Sem o clearRect cada quadro ficaria em cima do anterior e criaria rastro (erro 2).
  function desenharQuadro(progresso) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#4b5563";
    ctx.fillRect(10, chao, canvas.width - 20, 2);   // linha do chão

    ctx.font = "13px sans-serif";
    ctx.textAlign = "center";

    dados.forEach((item, i) => {
      const x = 30 + i * (larguraBarra + espaco);
      const altura = item.media * escala * progresso;

      ctx.fillStyle = cores[i % cores.length];
      ctx.fillRect(x, chao - altura, larguraBarra, altura);

      ctx.fillStyle = "#1f2937";
      ctx.fillText(item.categoria, x + larguraBarra / 2, chao + 18);
      ctx.fillText(item.media.toFixed(1), x + larguraBarra / 2, chao - altura - 6);
    });
  }

  // Respeita quem configurou "reduzir movimento" no sistema: desenha direto
  const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduzirMovimento) {
    desenharQuadro(1);
  } else {
    let progresso = 0;
    function animar() {
      progresso = Math.min(progresso + 0.03, 1);
      desenharQuadro(progresso);
      if (progresso < 1) {
        requestAnimationFrame(animar);   // agenda o próximo quadro
      }
    }
    requestAnimationFrame(animar);
  }

  // Acessibilidade (Aula 5, seção 7): o canvas vira só pixels, então o texto
  // de fallback dentro da tag precisa dizer os mesmos números do gráfico.
  const resumo = document.getElementById("grafico-resumo");
  if (resumo !== null) {
    const partes = dados.map((item) => `${item.categoria} ${item.media.toFixed(1)}`);
    resumo.textContent = `Nota média: ${partes.join(", ")}.`;
  }
}


mostrarFormatoSuportado();
