let moedas = 0;
let inventario = [];
let bauAberto = false;

/* 🎒 INVENTÁRIO (SLOTS) */
let slots = [];

const lojas = {
  camisas: [
    { nome: "Camisa Anime", img: "img/camisa-anime.jpg", preco: 60 },
    { nome: "Camisa Idols", img: "img/camisa-idols.jpg", preco: 60 }
  ],
  canecas: [
    { nome: "Caneca Anime", img: "img/caneca-anime.jpg", preco: 30 },
    { nome: "Caneca DBZ", img: "img/caneca dbz.png", preco: 30 },
    { nome: "Caneca Pikachu", img: "img/caneca pikachu.png", preco: 30 },
    { nome: "Caneca Goku", img: "img/caneca goku.png", preco: 30 },
    { nome: "Caneca Goku4", img: "img/caneca goku4.png", preco: 30 },
    { nome: "Caneca Grupo bts", img: "img/caneca grupo bts.png", preco: 30 },
    { nome: "Caneca Naruto", img: "img/caneca naruto.png", preco: 30 },
    { nome: "Caneca Nico Robin", img: "img/caneca nico robin.png", preco: 30 },
    { nome: "Caneca One Piece", img: "img/caneca one piece.png", preco: 30 },
    { nome: "Caneca Pokebola", img: "img/caneca pokebola.png", preco: 30 },
    { nome: "Caneca Stray Kids", img: "img/caneca stray kids.png", preco: 30 },
    { nome: "Caneca Tripulantes One Piece", img: "img/caneca tripulantes one piece.png", preco: 30 },
    { nome: "Caneca Zoro", img: "img/caneca zoro.png", preco: 30 },
    
  ],
  chaveiros: [
    { nome: "Chaveiro Anime", img: "img/chaveiro-anime.jpg", preco: 10 }
  ],
  quadros: [
    { nome: "Harry Potter", img: "img/q_harry.png", preco: 45 },
    { nome: "Harry Potter", img: "img/q_harry2.png", preco: 45 },
    { nome: "Pokémon", img: "img/q_poke.png", preco: 60 },
  ],
  ecobags: [
    { nome: "Ecobag Anime", img: "img/ecobag-anime.jpg", preco: 30 }
  ],
  comidas: [
    { nome: "Doces Geek", img: "img/doces.jpg", preco: 20 }
  ]
};

/* 🔥 COMBOS */
const combos = {
  kits: [
    { nome: "Kit Gamer", img: "img/kit-gamer.jpg", preco: 150 },
    { nome: "Kit One Piece", img: "img/kit-onepiece.jpg", preco: 120 },
    { nome: "Kit Harry Potter", img: "img/kit-harry.jpg", preco: 100 }
  ]
};

/* 🔔 NOTIFICAÇÕES */
function mostrarNotificacao(texto) {
  const container = document.getElementById("notificacoes");
  const div = document.createElement("div");
  div.classList.add("notificacao");
  div.innerText = texto;
  container.appendChild(div);
  setTimeout(() => div.remove(), 2500);
}

/* 💰 MOEDAS */
function atualizarMoedas() {
  document.getElementById("moedasHUD").innerText = "💰 " + moedas;
}

/* 🏪 LOJAS COM PAGINAÇÃO */
let lojaAtual = "";
let paginaAtual = 1;
let produtosFiltrados = [];

function abrirLoja(nome) {
  document.getElementById("mapa").classList.add("blur");
  const menu = document.getElementById("menuLoja");
  const titulo = document.getElementById("tituloLoja");
  titulo.innerText = nome.toUpperCase();
  
  lojaAtual = nome;
  paginaAtual = 1;
  produtosFiltrados = [...lojas[nome]];
  
  renderizarPagina();
  menu.classList.add("ativo");
}

function renderizarPagina() {
  const opcoes = document.getElementById("opcoesLoja");
  const inicio = (paginaAtual - 1) * 3;
  const fim = inicio + 3;
  const produtosPagina = produtosFiltrados.slice(inicio, fim);
  
  opcoes.innerHTML = "";
  
  produtosPagina.forEach(produto => {
    const card = document.createElement("div");
    card.classList.add("produtoCard");
    card.innerHTML = `
      <img src="${produto.img}">
      <div class="produtoInfo">
        <span>${produto.nome}</span>
        <span>💰 ${produto.preco}</span>
      </div>
      <div class="produtoBotoes">
        <button class="btnAdd">Adicionar</button>
        <button class="btnVer">Ver</button>
      </div>
    `;
    card.querySelector(".btnAdd").onclick = () => comprarProduto(produto);
    card.querySelector(".btnVer").onclick = () => visualizarProduto(produto.img);
    opcoes.appendChild(card);
  });
  
  adicionarPaginacao();
}

function adicionarPaginacao() {
  const opcoes = document.getElementById("opcoesLoja");
  const totalPaginas = Math.ceil(produtosFiltrados.length / 3);
  
  const paginacaoAntiga = document.querySelector(".paginacao");
  if (paginacaoAntiga) paginacaoAntiga.remove();
  
  const divPaginacao = document.createElement("div");
  divPaginacao.classList.add("paginacao");
  
  const btnAnterior = document.createElement("button");
  btnAnterior.innerText = "◀ Anterior";
  btnAnterior.disabled = (paginaAtual === 1);
  btnAnterior.onclick = () => {
    if (paginaAtual > 1) {
      paginaAtual--;
      renderizarPagina();
    }
  };
  
  const paginaInfo = document.createElement("span");
  paginaInfo.id = "paginaInfo";
  paginaInfo.innerText = `Página ${paginaAtual} de ${totalPaginas}`;
  
  const btnProximo = document.createElement("button");
  btnProximo.innerText = "Próximo ▶";
  btnProximo.disabled = (paginaAtual === totalPaginas || totalPaginas === 0);
  btnProximo.onclick = () => {
    if (paginaAtual < totalPaginas) {
      paginaAtual++;
      renderizarPagina();
    }
  };
  
  divPaginacao.appendChild(btnAnterior);
  divPaginacao.appendChild(paginaInfo);
  divPaginacao.appendChild(btnProximo);
  opcoes.appendChild(divPaginacao);
}

/* 🛒 COMPRA + INVENTÁRIO */
function comprarProduto(produto) {
  if (moedas < produto.preco) {
    mostrarNotificacao("Moedas insuficientes! Abra o báu.");
    return;
  }
  moedas -= produto.preco;
  inventario.push(produto);
  atualizarMoedas();
  atualizarInventario();
  adicionarAoSlot(produto);
  mostrarNotificacao(`🛒 Comprou: ${produto.nome}`);
}

/* 🧱 SISTEMA DE SLOTS (SEM LIMITE) */
function adicionarAoSlot(produto) {
  let item = slots.find(i => i.nome === produto.nome);
  if (item) {
    item.qtd++;
  } else {
    slots.push({ nome: produto.nome, img: produto.img, qtd: 1 });
  }
  renderSlots();
}

function renderSlots() {
  const container = document.getElementById("inventarioSlots");
  if (!container) return;
  container.innerHTML = "";
  slots.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("slot");
    div.innerHTML = `<img src="${item.img}"><div class="qtd">x${item.qtd}</div>`;
    container.appendChild(div);
  });
}

/* ❌ FECHAR LOJA */
function fecharLoja() {
  document.getElementById("menuLoja").classList.remove("ativo");
  document.getElementById("mapa").classList.remove("blur");
}

/* 🎒 INVENTÁRIO (PEDIDOS) */
function atualizarInventario() {
  const lista = document.getElementById("listaInventario");
  const totalDiv = document.getElementById("totalPedido");
  lista.innerHTML = "";
  let total = 0;
  inventario.forEach((item, index) => {
    total += item.preco;
    const div = document.createElement("div");
    div.classList.add("itemInventario");
    div.innerHTML = `<span>${item.nome} - 💰 ${item.preco}</span><button onclick="removerItem(${index})">❌</button>`;
    lista.appendChild(div);
  });
  totalDiv.innerText = "Total: 💰 " + total;
}

function removerItem(index) {
  const itemRemovido = inventario[index];
  moedas += itemRemovido.preco;
  const nome = itemRemovido.nome;
  inventario.splice(index, 1);
  const slotIndex = slots.findIndex(s => s.nome === nome);
  if (slotIndex !== -1) {
    slots[slotIndex].qtd--;
    if (slots[slotIndex].qtd <= 0) slots.splice(slotIndex, 1);
  }
  atualizarMoedas();
  atualizarInventario();
  renderSlots();
  mostrarNotificacao(`💰 Removeu: ${nome}`);
}

/* 🧑 MODAL DE NOME PERSONALIZADO - VERSÃO SIMPLIFICADA E DIRETA */
let pedidoPendente = false; // Flag para saber se estamos aguardando nome para enviar o pedido

function mostrarModalNome(valorInicial = "") {
  const modal = document.getElementById("modalNomeCliente");
  if (!modal) {
    console.error("Modal #modalNomeCliente não encontrado!");
    return;
  }
  const input = document.getElementById("inputNomeCliente");
  if (input) {
    input.value = valorInicial;
    input.focus();
  }
  modal.classList.add("ativo");
}

function fecharModalNome() {
  const modal = document.getElementById("modalNomeCliente");
  if (modal) modal.classList.remove("ativo");
}

function confirmarNome() {
  const input = document.getElementById("inputNomeCliente");
  let nome = input ? input.value.trim() : "";
  if (nome === "") nome = "Cliente";
  
  // Salva o nome
  localStorage.setItem("clienteNome", nome);
  mostrarNotificacao(`👋 Olá, ${nome}!`);
  
  // Fecha o modal
  fecharModalNome();
  
  // Se há pedido pendente, envia agora
  if (pedidoPendente) {
    enviarPedidoWhatsApp(nome);
    pedidoPendente = false;
  }
}

function cancelarNome() {
  fecharModalNome();
  pedidoPendente = false;
  mostrarNotificacao("Pedido cancelado.");
}

/* 🎒 ABRIR INVENTÁRIO */
function abrirInventario() {
  const nomeSalvo = localStorage.getItem("clienteNome");
  if (nomeSalvo) {
    document.getElementById("inventarioBox").classList.add("ativo");
    atualizarInventario();
  } else {
    pedidoPendente = false; // Não é pedido, só quer abrir o inventário
    mostrarModalNome();
    // Aguarda confirmação do nome para depois abrir o inventário
    // Vamos usar um listener temporário? Melhor: após confirmar nome, o modal fecha e chamamos uma função
    // Mas para simplificar, vamos reutilizar a flag de pendência de forma diferente.
    // Vou alterar: ao confirmar nome, se não for pedido pendente, abre inventário.
    // Para isso, modificar confirmarNome.
  }
}

// No confirmarNome, precisamos saber se o objetivo era abrir inventário. Vamos criar uma variável:
let aguardandoInventario = false;

function mostrarModalNomeParaInventario() {
  aguardandoInventario = true;
  mostrarModalNome();
}

// Modificar confirmarNome para tratar os dois casos
// Mas note que o código original tem a função confirmarNome. Vou reescrever tudo de forma única.

// Por simplicidade, vou reescrever completamente o fluxo de modal e pedido.

// Na verdade, o usuário só precisa que ao finalizar pedido, o WhatsApp abra. O resto pode ser mantido.

// Vou redefinir as funções de forma clara:

window.confirmarNome = function() {
  const input = document.getElementById("inputNomeCliente");
  let nome = input ? input.value.trim() : "";
  if (nome === "") nome = "Cliente";
  localStorage.setItem("clienteNome", nome);
  mostrarNotificacao(`👋 Olá, ${nome}!`);
  fecharModalNome();
  
  if (pedidoPendente) {
    enviarPedidoWhatsApp(nome);
    pedidoPendente = false;
  } else if (aguardandoInventario) {
    document.getElementById("inventarioBox").classList.add("ativo");
    atualizarInventario();
    aguardandoInventario = false;
  }
};

window.cancelarNome = function() {
  fecharModalNome();
  pedidoPendente = false;
  aguardandoInventario = false;
  mostrarNotificacao("Operação cancelada.");
};

function mostrarModalNome(valorInicial = "") {
  const modal = document.getElementById("modalNomeCliente");
  if (!modal) return;
  const input = document.getElementById("inputNomeCliente");
  if (input) input.value = valorInicial;
  modal.classList.add("ativo");
  if (input) input.focus();
}

function fecharModalNome() {
  const modal = document.getElementById("modalNomeCliente");
  if (modal) modal.classList.remove("ativo");
}

/* 📲 FINALIZAR PEDIDO - SEMPRE USA O MODAL */
function finalizarPedido() {
  if (inventario.length === 0) {
    mostrarNotificacao("🛒 Seu carrinho está vazio!");
    return;
  }
  // Marca que há pedido pendente
  pedidoPendente = true;
  aguardandoInventario = false;
  const nomeExistente = localStorage.getItem("clienteNome") || "";
  mostrarModalNome(nomeExistente);
}

/* Função para enviar o pedido ao WhatsApp (garantida) */
function enviarPedidoWhatsApp(nomeCliente) {
  try {
    if (inventario.length === 0) {
      mostrarNotificacao("Carrinho vazio!");
      return;
    }
    // Agrupa itens
    const itensAgrupados = {};
    for (const item of inventario) {
      if (itensAgrupados[item.nome]) {
        itensAgrupados[item.nome].quantidade++;
      } else {
        itensAgrupados[item.nome] = {
          nome: item.nome,
          preco: item.preco,
          quantidade: 1
        };
      }
    }

    let mensagem = "━━━━━━━━━━━━━━━━━━━━%0A";
    mensagem += "*FEIRA GEEK - PEDIDO*%0A";
    mensagem += "━━━━━━━━━━━━━━━━━━━━%0A%0A";
    mensagem += `*Cliente:* ${nomeCliente}%0A`;
    mensagem += `*Data:* ${new Date().toLocaleDateString()}%0A`;
    mensagem += `*Hora:* ${new Date().toLocaleTimeString()}%0A%0A`;
    mensagem += "*ITENS DO PEDIDO:*%0A%0A";

    let total = 0;
    let contador = 1;
    for (const item of Object.values(itensAgrupados)) {
      const subtotal = item.preco * item.quantidade;
      total += subtotal;
      mensagem += `${contador}. ${item.nome}%0A`;
      mensagem += `Quantidade: ${item.quantidade}%0A`;
      mensagem += `Valor: R$ ${item.preco}%0A`;
      mensagem += `Subtotal: R$ ${subtotal}%0A`;
      mensagem += `─────────────────%0A`;
      contador++;
    }

    mensagem += "%0A━━━━━━━━━━━━━━━━━━━━%0A";
    mensagem += `*TOTAL DO PEDIDO:* R$ ${total}%0A`;
    mensagem += "━━━━━━━━━━━━━━━━━━━━%0A%0A";
    mensagem += "*Obrigado pela preferência!*%0A";
    mensagem += "Aguarde a confirmação do seu pedido.";

    const numero = "5562998549701"; // Altere para seu número
    const url = `https://wa.me/${numero}?text=${mensagem}`;
    window.open(url, "_blank");
    mostrarNotificacao("🔁 Abrindo WhatsApp...");
  } catch (erro) {
    console.error(erro);
    mostrarNotificacao("Erro ao gerar link.");
  }
}

/* 🎒 ABRIR INVENTÁRIO (com nome) */
function abrirInventario() {
  const nomeSalvo = localStorage.getItem("clienteNome");
  if (nomeSalvo) {
    document.getElementById("inventarioBox").classList.add("ativo");
    atualizarInventario();
  } else {
    aguardandoInventario = true;
    pedidoPendente = false;
    mostrarModalNome("");
  }
}

function fecharInventario() {
  document.getElementById("inventarioBox").classList.remove("ativo");
}

/* 🎁 BAÚ */
function abrirBau() {
  if (!bauAberto) {
    // Toca o som do baú
    const somBau = document.getElementById("somBau");
    if (somBau) {
      somBau.currentTime = 0;
      somBau.volume = 1.0;
      somBau.play().catch(() => {
        console.log("Som do baú não pôde tocar");
      });
    }
    
    moedas += 500;
    bauAberto = true;
    atualizarMoedas();
    mostrarNotificacao("Você ganhou 500 moedas!");
  } else {
    mostrarNotificacao("Baú já foi aberto!");
  }
}

/* 🔥 FUNÇÕES DOS COMBOS */
function abrirCombos() {
  document.getElementById("mapa").classList.add("blur");
  const menu = document.getElementById("menuLoja");
  const titulo = document.getElementById("tituloLoja");
  titulo.innerText = "COMBOS ESPECIAIS";
  
  produtosFiltrados = [...combos.kits];
  paginaAtual = 1;
  
  renderizarPaginaCombos();
  menu.classList.add("ativo");
}

function renderizarPaginaCombos() {
  const opcoes = document.getElementById("opcoesLoja");
  const inicio = (paginaAtual - 1) * 3;
  const fim = inicio + 3;
  const produtosPagina = produtosFiltrados.slice(inicio, fim);
  
  opcoes.innerHTML = "";
  
  produtosPagina.forEach(combo => {
    const card = document.createElement("div");
    card.classList.add("produtoCard");
    card.innerHTML = `
      <img src="${combo.img}">
      <div class="produtoInfo">
        <span>${combo.nome}</span>
        <span>💰 ${combo.preco}</span>
      </div>
      <div class="produtoBotoes">
        <button class="btnAdd">Adicionar Combo</button>
        <button class="btnVer">Ver Itens</button>
      </div>
    `;
    card.querySelector(".btnAdd").onclick = () => comprarCombo(combo);
    card.querySelector(".btnVer").onclick = () => visualizarProduto(combo.img);
    opcoes.appendChild(card);
  });
  
  adicionarPaginacao();
}

function comprarCombo(combo) {
  if (moedas < combo.preco) {
    mostrarNotificacao("Moedas insuficientes para o combo!");
    return;
  }
  
  moedas -= combo.preco;
  
  const produtoCombo = {
    nome: combo.nome,
    preco: combo.preco,
    img: combo.img,
    isCombo: true
  };
  
  inventario.push(produtoCombo);
  adicionarAoSlot(produtoCombo);
  
  atualizarMoedas();
  atualizarInventario();
  renderSlots();
  mostrarNotificacao(`🎁 Combo "${combo.nome}" adquirido!`);
}

/* 👁️ VISUALIZADOR DE PRODUTO */
function visualizarProduto(img) {
  const modal = document.getElementById("visualizadorProduto");
  const imagem = document.getElementById("imgVisualizador");
  if (!modal || !imagem) return;
  imagem.src = img;
  modal.classList.add("ativo");
}

function fecharVisualizador() {
  const modal = document.getElementById("visualizadorProduto");
  if (modal) modal.classList.remove("ativo");
}

/* 🎉 POP-UP DE BOAS-VINDAS */
function mostrarPopupBoasVindas() {
  const popup = document.getElementById("popupBoasVindas");
  if (popup) popup.classList.add("ativo");
}

function fecharPopupBoasVindas() {
  const popup = document.getElementById("popupBoasVindas");
  if (popup) popup.classList.remove("ativo");
}

/* 🎮 INICIAR JOGO */
function entrarJogo() {
  const som = document.getElementById("somInicio");

  if (som) {
    som.currentTime = 0; // reinicia o som se clicar rápido
    som.play().catch(() => {});
  }

  // aqui continua o que você já faz pra iniciar o jogo
  document.getElementById("telaInicial").style.display = "none";
  document.getElementById("game").style.display = "block";
}

/* 🚀 INICIALIZAÇÃO */
window.addEventListener("DOMContentLoaded", () => {
  // Vincular os botões do modal
  const btnConfirmar = document.getElementById("btnConfirmarNome");
  const btnCancelar = document.getElementById("btnCancelarNome");
  const inputNome = document.getElementById("inputNomeCliente");
  
  if (btnConfirmar) btnConfirmar.onclick = () => window.confirmarNome();
  if (btnCancelar) btnCancelar.onclick = () => window.cancelarNome();
  if (inputNome) {
    inputNome.addEventListener("keypress", (e) => {
      if (e.key === "Enter") window.confirmarNome();
    });
  }

  atualizarMoedas();
  atualizarInventario();
  renderSlots();

  // Bind das lojas
  const bind = (id, nome) => {
    const el = document.getElementById(id);
    if (el) el.onclick = () => abrirLoja(nome);
  };
  bind("lojaCamisas", "camisas");
  bind("lojaCanecas", "canecas");
  bind("lojaChaveiros", "chaveiros");
  bind("lojaQuadros", "quadros");
  bind("lojaEcobags", "ecobags");
  bind("lojaComidas", "comidas");

  // Bind do botão de combos
  const btnCombos = document.getElementById("btnCombos");
  if (btnCombos) btnCombos.onclick = abrirCombos;

  document.getElementById("bau").onclick = abrirBau;
  document.getElementById("inventarioHUD").onclick = abrirInventario;
  document.getElementById("btnFinalizar").onclick = finalizarPedido;

  // Fechar visualizador
  const fecharVis = document.getElementById("fecharVisualizador");
  if (fecharVis) fecharVis.onclick = fecharVisualizador;

  // Fechar pop-up de boas-vindas
  const fecharPopupX = document.getElementById("fecharPopup");
  if (fecharPopupX) fecharPopupX.onclick = fecharPopupBoasVindas;
  const btnEntendi = document.getElementById("btnEntendi");
  if (btnEntendi) btnEntendi.onclick = fecharPopupBoasVindas;
  const popupBg = document.getElementById("popupBoasVindas");
  if (popupBg) {
    popupBg.addEventListener("click", (e) => {
      if (e.target === popupBg) fecharPopupBoasVindas();
    });
  }
});