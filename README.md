# Catálogo de Comida

Projeto Integrador da disciplina **Desenvolvimento Front-end para Web** (professor Jeofton Costa).

É um catálogo simples com alguns dos meus pratos favoritos. Cada prato tem categoria, a minha nota e a nota dos meus amigos. O JavaScript calcula a média, classifica o prato em uma faixa (Imperdível, Muito bom, Regular ou Evitar) e monta um resumo do catálogo.

## Como rodar

1. Clone o repositório.
2. Abra a pasta no VS Code e rode o **Live Server** no `index.html`.
3. Abra o console (F12) para ver o ranking impresso com `console.table`.

## Estrutura de pastas

```
catalogo-de-comida/
├── index.html
├── css/
│   ├── reset.css
│   └── style.css
├── js/
│   ├── main.js        (vídeo com canPlayType e gráfico em Canvas)
│   └── catalogo.js    (funções, arrays e DOM)
└── assets/
    ├── images/        (feijoada.svg, poster-preparo.svg)
    └── videos/        (preparo.webm, preparo.mp4 e a legenda .vtt)
```

> Os arquivos `preparo.webm` e `preparo.mp4` não estão no repositório. É preciso gravar o vídeo e salvar os dois formatos em `assets/videos/`. Enquanto eles não existirem, o navegador mostra o poster e o texto alternativo do `<video>`, e o Network do DevTools mostra 404 para os dois.

## O que foi usado de cada aula

| Aula | Tema | Onde aparece |
|------|------|--------------|
| 1 | Git e GitHub | `.gitignore` desde o início, branches e Conventional Commits |
| 2 | Conceitos da web | estrutura de pastas em minúsculas e sem espaços, tags básicas, tabela, links e imagem com `alt` |
| 3 | HTML semântico e formulários | `header`, `nav`, `main` único, `section`, `article`, `footer`, hierarquia de headings, `label for/id`, `fieldset`, validação nativa |
| 4 | Multimídia | `<video>` com `poster`, `preload="metadata"`, dois `<source>`, `<track>` e `canPlayType()` |
| 5 | Canvas e SVG | selo SVG acessível e gráfico de barras animado em Canvas com `clearRect` |
| 6 | CSS base | reset, variáveis, seletores, box model, links LVHA, tabela |
| 7 | Flexbox, Grid e pseudo-classes | grade de cards com `auto-fit`/`minmax`, layout com `grid-template-areas`, `:nth-child`, `::before` |
| 8 | Menus e navegação | navbar com Flexbox, item ativo, dropdown, sticky e estrutura do hambúrguer |
| 9 | Lógica em JavaScript | `const`/`let`, conversão com `Number()`, `if`/`switch`/ternário, laços e teste de mesa |
| 11 | Funções e DOM | funções puras, `map`/`filter`/`reduce`, `querySelector`, `dataset`, `classList`, `createElement` |

## Erros comuns que eu tentei evitar

- **CSS:** `box-sizing: border-box` no reset, `rem` nos textos, nenhum `!important`.
- **Navbar:** o `position: relative` está no `<li>` do dropdown, não existe espaço vazio entre o item e o menu, e o `z-index` foi aplicado no `<header>` sticky (quem cria o contexto de empilhamento).
- **Sticky:** o `body` é flex e não grid, porque um item de grid usa a própria área como bloco de contêiner e o sticky não grudaria.
- **JavaScript:** `canPlayType()` comparado como texto, `sort` feito em uma cópia do array e checagem de `null` depois de cada `querySelector`.
- **Canvas:** tamanho definido pelos atributos `width`/`height` e `clearRect` a cada quadro.

## Ainda falta

- O botão hambúrguer ainda não abre o menu (só a estrutura visual está pronta). Em telas de até 640px o menu fica escondido até eu implementar o clique.

## Fluxo no Git

```bash
git switch -c feature/refazer-catalogo
git add .gitignore README.md
git commit -m "chore: adiciona .gitignore e README"
git add index.html css/reset.css
git commit -m "feat: estrutura semântica do catálogo e reset de CSS"
git add css/style.css
git commit -m "style: navbar sticky, grid de cards e formulário"
git add js/main.js js/catalogo.js assets/
git commit -m "feat: gráfico em canvas, resumo e pontuação dos pratos"
git push -u origin feature/refazer-catalogo
```

Depois é só abrir o Pull Request no GitHub com título e descrição do que mudou.
