let moedas = 0;
let inventario = [];
let bauAberto = false;

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
    { nome: "Quadro Geek", img: "img/quadro-geek.jpg", preco: 80 }
  ],
  ecobags: [
    { nome: "Ecobag Anime", img: "img/ecobag-anime.jpg", preco: 30 }
  ],
  comidas: [
    { nome: "Doces Geek", img: "img/doces.jpg", preco: 20 }
  ]
};

/* ================= 🔔 NOTIFICAÇÕES ================= */
function mostrarNotificacao(texto){
  const container = document.getElementById("notificacoes");
  const div = document.createElement("div");
  div.classList.add("notificacao");
  div.innerText = texto;

  container.appendChild(div);

  setTimeout(()=>{
    div.remove();
  }, 2500);
}

/* ================= 💰 MOEDAS ================= */
function atualizarMoedas(){
  document.getElementById("moedasHUD").innerText = "💰 " + moedas;
}

/* ================= 🏪 LOJAS ================= */
function abrirLoja(nome){

  document.getElementById("mapa").classList.add("blur");

  const menu = document.getElementById("menuLoja");
  const titulo = document.getElementById("tituloLoja");
  const opcoes = document.getElementById("opcoesLoja");

  titulo.innerText = nome.toUpperCase();
  opcoes.innerHTML = "";

  document.getElementById("produtoPreview").style.display = "none";

  lojas[nome].forEach(produto => {

    const btn = document.createElement("button");

    btn.innerHTML = `
      <img src="${produto.img}">
      <span>${produto.nome} - 💰 ${produto.preco}</span>
    `;

    btn.onclick = () => comprarProduto(produto);

    opcoes.appendChild(btn);
  });

  menu.classList.add("ativo");
}

function comprarProduto(produto){

  if(moedas < produto.preco){
    mostrarNotificacao("💸 Moedas insuficientes!");
    return;
  }

  moedas -= produto.preco;
  inventario.push(produto);

  atualizarMoedas();
  atualizarInventario();

  const preview = document.getElementById("produtoPreview");

  preview.style.display = "block";
  document.getElementById("nomeProduto").innerText = produto.nome;
  document.getElementById("imagemProduto").src = produto.img;

  mostrarNotificacao(`🛒 Comprou: ${produto.nome}`);
}

function fecharLoja(){
  document.getElementById("menuLoja").classList.remove("ativo");
  document.getElementById("mapa").classList.remove("blur");
}

/* ================= 🎒 INVENTÁRIO ================= */
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

function removerItem(index){

  moedas += inventario[index].preco;
  const nome = inventario[index].nome;

  inventario.splice(index, 1);

  atualizarMoedas();
  atualizarInventario();

  mostrarNotificacao(`💰 Removeu: ${nome}`);
}

function abrirInventario(){
  document.getElementById("inventarioBox").style.display = "block";
  atualizarInventario();
}

function fecharInventario(){
  document.getElementById("inventarioBox").style.display = "none";
}

/* ================= 📲 WHATSAPP ================= */
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

  const numero = "5599999999999"; // 👈 TROCAR

  const url = `https://wa.me/${numero}?text=${mensagem}`;

  window.open(url, "_blank");
}

/* ================= 🎁 BAÚ ================= */
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

/* ================= 🎮 JOGO ================= */
function entrarJogo(){
  document.getElementById("telaInicial").style.display = "none";
}

/* ================= 🚀 INIT ================= */
window.addEventListener("DOMContentLoaded", () => {

  atualizarMoedas();
  atualizarInventario();

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
});
