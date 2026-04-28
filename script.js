let moedas = 0;
let inventario = [];
let bauAberto = false;

/* 🎒 NOVO INVENTÁRIO (SLOTS MINECRAFT) */
let slots = [];

const lojas = {
  camisas: [
    { nome: "Camisa Anime", img: "img/camisa-anime.jpg", preco: 60 },
    { nome: "Camisa Idols", img: "img/camisa-idols.jpg", preco: 60 }
  ],
  canecas: [
    { nome: "Caneca Anime", img: "img/caneca-anime.jpg", preco: 30 }
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

/* 🔔 NOTIFICAÇÕES */
function mostrarNotificacao(texto){
  const container = document.getElementById("notificacoes");

  const div = document.createElement("div");
  div.classList.add("notificacao");
  div.innerText = texto;

  container.appendChild(div);

  setTimeout(() => div.remove(), 2500);
}

/* 💰 MOEDAS */
function atualizarMoedas(){
  document.getElementById("moedasHUD").innerText = "💰 " + moedas;
}

/* 🏪 LOJAS (ATUALIZADA) */
function abrirLoja(nome){

  document.getElementById("mapa").classList.add("blur");

  const menu = document.getElementById("menuLoja");
  const titulo = document.getElementById("tituloLoja");
  const opcoes = document.getElementById("opcoesLoja");

  titulo.innerText = nome.toUpperCase();
  opcoes.innerHTML = "";

  lojas[nome].forEach(produto => {

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

  menu.classList.add("ativo");
}

/* 🛒 COMPRA + INVENTÁRIO */
function comprarProduto(produto){

  if(moedas < produto.preco){
    mostrarNotificacao("💸 Moedas insuficientes!");
    return;
  }

  moedas -= produto.preco;

  inventario.push(produto);

  atualizarMoedas();
  atualizarInventario();

  adicionarAoSlot(produto);

  mostrarNotificacao(`🛒 Comprou: ${produto.nome}`);
}

/* 🧱 SISTEMA DE SLOTS */
function adicionarAoSlot(produto){

  let item = slots.find(i => i.nome === produto.nome);

  if(item){
    item.qtd++;
  } else {

    if(slots.length >= 5){
      mostrarNotificacao("🎒 Inventário cheio!");
      return;
    }

    slots.push({
      nome: produto.nome,
      img: produto.img,
      qtd: 1
    });
  }

  renderSlots();
}

/* 🎨 RENDER DOS SLOTS */
function renderSlots(){

  const container = document.getElementById("inventarioSlots");
  if(!container) return;

  container.innerHTML = "";

  slots.forEach(item => {

    const div = document.createElement("div");
    div.classList.add("slot");

    div.innerHTML = `
      <img src="${item.img}">
      <div class="qtd">x${item.qtd}</div>
    `;

    container.appendChild(div);
  });
}

/* ❌ FECHAR LOJA */
function fecharLoja(){
  document.getElementById("menuLoja").classList.remove("ativo");
  document.getElementById("mapa").classList.remove("blur");
}

/* 🎒 INVENTÁRIO */
function atualizarInventario(){

  const lista = document.getElementById("listaInventario");
  const totalDiv = document.getElementById("totalPedido");

  lista.innerHTML = "";

  let total = 0;

  inventario.forEach((item, index) => {

    total += item.preco;

    const div = document.createElement("div");
    div.classList.add("itemInventario");

    div.innerHTML = `
      <span>${item.nome} - 💰 ${item.preco}</span>
      <button onclick="removerItem(${index})">❌</button>
    `;

    lista.appendChild(div);
  });

  totalDiv.innerText = "Total: 💰 " + total;
}

/* ❌ REMOVER ITEM */
function removerItem(index){

  const itemRemovido = inventario[index];

  moedas += itemRemovido.preco;
  const nome = itemRemovido.nome;

  inventario.splice(index, 1);

  const slotIndex = slots.findIndex(s => s.nome === nome);

  if(slotIndex !== -1){

    slots[slotIndex].qtd--;

    if(slots[slotIndex].qtd <= 0){
      slots.splice(slotIndex, 1);
    }
  }

  atualizarMoedas();
  atualizarInventario();
  renderSlots();

  mostrarNotificacao(`💰 Removeu: ${nome}`);
}

/* 🎒 INVENTÁRIO MODAL */
function abrirInventario(){
  document.getElementById("inventarioBox").classList.add("ativo");
  atualizarInventario();
}

function fecharInventario(){
  document.getElementById("inventarioBox").classList.remove("ativo");
}

/* 📲 FINALIZAR PEDIDO */
function finalizarPedido(){

  if(inventario.length === 0){
    mostrarNotificacao("🛒 Seu carrinho está vazio!");
    return;
  }

  let mensagem = "🧾 *Pedido Feira Geek*%0A%0A";
  let total = 0;

  inventario.forEach(item => {
    mensagem += `• ${item.nome} - R$ ${item.preco}%0A`;
    total += item.preco;
  });

  mensagem += `%0A💰 Total: R$ ${total}`;

  const numero = "5599999999999";
  const url = `https://wa.me/${numero}?text=${mensagem}`;

  window.open(url, "_blank");
}

/* 🎁 BAÚ */
function abrirBau(){

  if(!bauAberto){
    moedas += 200;
    bauAberto = true;

    atualizarMoedas();
    mostrarNotificacao("🎁 Você ganhou 200 moedas!");
  } else {
    mostrarNotificacao("🪙 Baú já foi aberto!");
  }
}

/* 👁️ VISUALIZADOR */
function visualizarProduto(img){
  const modal = document.getElementById("visualizadorProduto");
  const imagem = document.getElementById("imgVisualizador");

  if(!modal || !imagem) return;

  imagem.src = img;
  modal.classList.add("ativo");
}

function fecharVisualizador(){
  const modal = document.getElementById("visualizadorProduto");
  if(modal) modal.classList.remove("ativo");
}

/* 🎮 INICIAR JOGO */
function entrarJogo(){
  document.getElementById("telaInicial").style.display = "none";
}

/* 🚀 INIT */
window.addEventListener("DOMContentLoaded", () => {

  atualizarMoedas();
  atualizarInventario();
  renderSlots();

  const bind = (id, nome) => {
    const el = document.getElementById(id);
    if(el) el.onclick = () => abrirLoja(nome);
  };

  bind("lojaCamisas", "camisas");
  bind("lojaCanecas", "canecas");
  bind("lojaChaveiros", "chaveiros");
  bind("lojaQuadros", "quadros");
  bind("lojaEcobags", "ecobags");
  bind("lojaComidas", "comidas");

  document.getElementById("bau").onclick = abrirBau;
  document.getElementById("inventarioHUD").onclick = abrirInventario;
  document.getElementById("btnFinalizar").onclick = finalizarPedido;

  /* 👁️ FECHAR VISUALIZADOR */
  const fecharBtn = document.getElementById("fecharVisualizador");
  if(fecharBtn) fecharBtn.onclick = fecharVisualizador;
});