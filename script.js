
/* =========================
   🎮 ESTADO DO JOGO
========================= */

let moedas = 0;
let inventario = [];
let bauAberto = false;

/* =========================
   🏪 CATÁLOGO DAS LOJAS
========================= */

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

/* =========================
   💰 MOEDAS HUD
========================= */

function atualizarMoedas(){
  const hud = document.getElementById("moedasHUD");
  if(hud){
    hud.innerText = "💰 " + moedas;
  }
}

/* =========================
   🏪 ABRIR LOJA
========================= */

function abrirLoja(nome){

  const menu = document.getElementById("menuLoja");
  const titulo = document.getElementById("tituloLoja");
  const opcoes = document.getElementById("opcoesLoja");

  if(!menu || !titulo || !opcoes) return;

  titulo.innerText = nome.toUpperCase();
  opcoes.innerHTML = "";

  const preview = document.getElementById("produtoPreview");
  if(preview) preview.style.display = "none";

  lojas[nome].forEach(produto => {

    const btn = document.createElement("button");

    btn.innerHTML = `
      <img src="${produto.img}">
      <span>${produto.nome} - 💰 ${produto.preco}</span>
    `;

    btn.onclick = () => comprarProduto(produto);

    opcoes.appendChild(btn);
  });

  menu.style.display = "block";
}

/* =========================
   🛒 COMPRA
========================= */

function comprarProduto(produto){

  if(moedas < produto.preco){
    alert("💸 Você não tem moedas suficientes!");
    return;
  }

  moedas -= produto.preco;
  inventario.push(produto);

  atualizarMoedas();
  atualizarInventario();

  const preview = document.getElementById("produtoPreview");

  if(preview){
    preview.style.display = "block";
    document.getElementById("nomeProduto").innerText = produto.nome;
    document.getElementById("imagemProduto").src = produto.img;
  }
}

/* =========================
   ❌ FECHAR LOJA
========================= */

function fecharLoja(){
  const menu = document.getElementById("menuLoja");
  if(menu) menu.style.display = "none";
}

/* =========================
   🎒 INVENTÁRIO
========================= */

function atualizarInventario(){

  const lista = document.getElementById("listaInventario");
  if(!lista) return;

  lista.innerHTML = "";

  inventario.forEach((item, index) => {

    const div = document.createElement("div");

    div.innerHTML = `
      <span>${item.nome} - 💰 ${item.preco}</span>
      <button onclick="removerItem(${index})">❌</button>
    `;

    lista.appendChild(div);
  });
}

/* =========================
   ❌ REMOVER ITEM
========================= */

function removerItem(index){

  moedas += inventario[index].preco;
  inventario.splice(index, 1);

  atualizarMoedas();
  atualizarInventario();
}

/* =========================
   🎒 INVENTÁRIO ABRIR / FECHAR
========================= */

function abrirInventario(){
  const box = document.getElementById("inventarioBox");
  if(box){
    box.style.display = "block";
    atualizarInventario();
  }
}

function fecharInventario(){
  const box = document.getElementById("inventarioBox");
  if(box) box.style.display = "none";
}

/* =========================
   🎁 BAÚ
========================= */

function abrirBau(){

  if(!bauAberto){
    moedas += 200;
    bauAberto = true;
    atualizarMoedas();
    alert("🎁 Você ganhou 200 moedas!");
  } else {
    alert("🪙 Baú já foi aberto!");
  }
}

/* =========================
   🚀 ENTRAR NO JOGO
========================= */

function entrarJogo(){
  const tela = document.getElementById("telaInicial");
  if(tela) tela.style.display = "none";
}

/* =========================
   🎯 INICIALIZAÇÃO SEGURA
========================= */

window.addEventListener("DOMContentLoaded", () => {

  atualizarMoedas();
  atualizarInventario();

  /* 🏪 LOJAS (GRID CLICK) */
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

  /* 🎁 BAÚ */
  const bau = document.getElementById("bau");
  if(bau) bau.onclick = abrirBau;

  /* 🎒 INVENTÁRIO */
  const inv = document.getElementById("inventarioHUD");
  if(inv) inv.onclick = abrirInventario;
});