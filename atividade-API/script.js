const URL = "https://jsonplaceholder.typicode.com/posts?_limit=6";
let publicacoes = [];

// Textos em português para traduzir/substituir o conteúdo em latim da API
const textosEmPortugues = {
  1: {
    title: "Primeiros passos com JavaScript e Fetch",
    body: "Aprender a consumir APIs utilizando o método fetch() é fundamental para criar aplicações web modernas e dinâmicas."
  },
  2: {
    title: "Como funciona a manipulação do DOM",
    body: "O DOM permite que o JavaScript crie, altere e remova elementos HTML diretamente na tela de forma interativa."
  },
  3: {
    title: "Vantagens de usar requisições assíncronas",
    body: "Requisições assíncronas evitam que a página trave enquanto aguarda a resposta do servidor ou da API pública."
  },
  4: {
    title: "Filtrando dados diretamente na memória",
    body: "Com um array salvo localmente, podemos filtrar elementos instantaneamente sem precisar fazer novas requisições à rede."
  },
  5: {
    title: "Tratamento de erros e boas práticas",
    body: "Informar o usuário sobre estados de carregamento e falhas melhora muito a experiência de uso da aplicação."
  },
  6: {
    title: "Construindo layouts responsivos com CSS Grid",
    body: "O uso de Grid e Flexbox garante que os cartões de publicações se ajustem perfeitamente a celulares, tablets e computadores."
  }
};

const botao = document.querySelector("#btn-carregar");
const filtro = document.querySelector("#filtro");
const mensagem = document.querySelector("#mensagem");
const painel = document.querySelector("#lista-posts");

botao.addEventListener("click", () => {
  carregarPublicacoes();
});

filtro.addEventListener("input", () => {
  const termo = filtro.value.trim().toLowerCase();

  const encontradas = publicacoes.filter((item) => {
    return item.title.toLowerCase().includes(termo);
  });

  renderizarPublicacoes(encontradas);

  if (encontradas.length === 0 && publicacoes.length > 0) {
    mensagem.textContent = "Nenhuma publicação encontrada com esse título.";
  } else if (publicacoes.length > 0) {
    mensagem.textContent = "";
  }
});

function carregarPublicacoes() {
  mensagem.textContent = "Carregando publicações...";
  botao.disabled = true;
  painel.replaceChildren();

  fetch(URL)
    .then((resposta) => {
      if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
      }
      return resposta.json();
    })
    .then((dados) => {
    
      publicacoes = dados.map((post) => {
        if (textosEmPortugues[post.id]) {
          return {
            ...post,
            title: textosEmPortugues[post.id].title,
            body: textosEmPortugues[post.id].body
          };
        }
        return post;
      });

      renderizarPublicacoes(publicacoes);
      mensagem.textContent = "";
    })
    .catch((erro) => {
      console.error("Falha ao buscar publicações:", erro);
      mensagem.textContent = "Ops! Não foi possível carregar as publicações";
      painel.replaceChildren();
    })
    .finally(() => {
      botao.disabled = false;
    });
}

function renderizarPublicacoes(lista) {
  painel.replaceChildren();

  if (lista.length === 0) {
    return;
  }

  lista.forEach((publicacao) => {
    const cartao = document.createElement("article");
    cartao.classList.add("cartao");

    const idTag = document.createElement("span");
    idTag.textContent = `PUBLICAÇÃO #${publicacao.id}`;

    const titulo = document.createElement("h2");
    titulo.textContent = publicacao.title;

    const conteudo = document.createElement("p");
    conteudo.textContent = publicacao.body;

    cartao.append(idTag, titulo, conteudo);
    painel.append(cartao);
  });
}