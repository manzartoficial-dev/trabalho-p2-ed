// Simulador BFS x DFS. A lógica espelha o algoritmo.py:
// primeiro calculamos TODOS os passos do algoritmo; depois só "reproduzimos" um por vez.

const CENARIOS = {
  labirinto: [
    "S..#......", ".#.#.####.", ".#...#....", ".#####.##.",
    ".....#..#.", ".###.#.##.", "...#...#.E",
  ],
  comparativo: [".......", ".......", "S......", "E......", "......."],
  custom: [
    "S...........", "............", "............", "............",
    "............", "............", "............", "...........E",
  ],
};
const DIRS = [[-1, 0], [0, 1], [1, 0], [0, -1]]; // cima, direita, baixo, esquerda

let linhas = [];          // grade atual (matriz de caracteres)
let algo = "bfs";         // "bfs" ou "dfs"
let passos = [];          // todos os passos pré-calculados
let idx = -1;             // passo atual (-1 = ainda não começou)
let timer = null;
let resultados = {};      // tamanho do caminho achado por cada algoritmo

const $ = (id) => document.getElementById(id);
const chave = (r, c) => r + "," + c;
const posicao = (k) => k.split(",").map(Number);

function vizinhos(k) {
  const [r, c] = posicao(k);
  return DIRS.map(([dr, dc]) => [r + dr, c + dc])
    .filter(([a, b]) => linhas[a] && linhas[a][b] !== undefined && linhas[a][b] !== "#")
    .map(([a, b]) => chave(a, b));
}

function achar(letra) {
  for (let r = 0; r < linhas.length; r++) {
    const c = linhas[r].indexOf(letra);
    if (c >= 0) return chave(r, c);
  }
}

function caminhoAte(pai, destino) {
  const cam = [];
  for (let n = destino; n !== null; n = pai[n]) cam.push(n);
  return cam.reverse();
}

function gerarPassos() {
  const origem = achar("S"), destino = achar("E");
  const lista = [], vis = new Set(), pai = { [origem]: null };
  const est = [origem];
  let ops = 0;

  const foto = (atual, msg, caminho = null) => lista.push({
    atual, msg, caminho, ops, vis: [...vis], est: [...est],
    fim: caminho !== null || msg.startsWith("Fim"),
    tam: caminho ? caminho.length - 1 : null,
  });

  const achou = (a) => foto(a, `(${a}) é o destino! Caminho com ${caminhoAte(pai, destino).length - 1} passos.`, caminhoAte(pai, destino));

  if (algo === "bfs") {
    vis.add(origem);
    foto(null, "Início: a origem entra na fila e é marcada como visitada.");
    while (est.length) {
      const a = est.shift(); // sai da FRENTE
      if (a === destino) { achou(a); return lista; }
      const novos = [];
      for (const v of vizinhos(a)) {
        ops++;
        if (!vis.has(v)) { vis.add(v); pai[v] = a; est.push(v); novos.push(v); }
      }
      foto(a, `Sai da frente: (${a}). Entram no fim: ${novos.length ? novos.map((n) => "(" + n + ")").join(" ") : "nenhum vizinho novo"}.`);
    }
  } else {
    foto(null, "Início: a origem entra na pilha.");
    while (est.length) {
      const a = est.pop(); // sai do TOPO
      if (vis.has(a)) { foto(a, `Sai do topo: (${a}), mas já foi visitado. Descarta.`); continue; }
      vis.add(a);
      if (a === destino) { achou(a); return lista; }
      const novos = [];
      for (const v of vizinhos(a).reverse()) { // reverse: o 1º vizinho fica no topo
        ops++;
        if (!vis.has(v)) { pai[v] = a; est.push(v); novos.push(v); }
      }
      foto(a, `Visita (${a}). Empilha: ${novos.length ? novos.map((n) => "(" + n + ")").join(" ") : "nenhum vizinho novo"}.`);
    }
  }
  foto(null, "Fim: estrutura vazia, não existe caminho até o destino.");
  return lista;
}

function preparar() {
  passos = gerarPassos();
  idx = -1;
  render();
}

function render() {
  const p = idx >= 0 ? passos[idx] : null;
  const vis = new Set(p ? p.vis : []);
  const est = new Set(p ? p.est : []);
  const cam = new Set(p && p.caminho ? p.caminho : []);
  const grade = $("grade");
  grade.style.gridTemplateColumns = `repeat(${linhas[0].length}, var(--cel))`;
  grade.innerHTML = "";

  linhas.forEach((linha, r) => linha.forEach((ch, c) => {
    const k = chave(r, c), d = document.createElement("div");
    d.className = "cel";
    if (ch === "#") d.classList.add("parede");
    else if (cam.has(k)) d.classList.add("caminho");
    else if (p && p.atual === k) d.classList.add("atual");
    else if (est.has(k) && !(algo === "dfs" && vis.has(k))) d.classList.add("fronteira");
    else if (vis.has(k)) d.classList.add("visitado");
    if (ch === "S" || ch === "E") { d.textContent = ch; d.classList.add("marca"); }
    d.onclick = () => alternarParede(r, c);
    grade.appendChild(d);
  }));

  if (p && p.fim) resultados[algo] = p.tam === null ? "sem caminho" : p.tam;

  $("m-passo").textContent = idx + 1;
  $("m-total").textContent = passos.length;
  $("m-ops").textContent = p ? p.ops : 0;
  $("m-vis").textContent = vis.size;
  $("r-bfs").textContent = resultados.bfs ?? "-";
  $("r-dfs").textContent = resultados.dfs ?? "-";

  const ehFila = algo === "bfs";
  $("est-titulo").textContent = ehFila ? "Fila (FIFO)" : "Pilha (LIFO)";
  $("est-dica").textContent = ehFila
    ? "O primeiro item (laranja) é o próximo a sair. Novos entram no fim."
    : "O último item (laranja) é o topo: é o próximo a sair e também onde entram os novos.";
  const e = $("estrutura");
  e.innerHTML = "";
  (p ? p.est : [chave(...posicao(achar("S")))]).forEach((k, i, arr) => {
    const s = document.createElement("span");
    s.className = "chip" + ((ehFila ? i === 0 : i === arr.length - 1) ? " chave" : "");
    s.textContent = "(" + k + ")";
    e.appendChild(s);
  });

  $("log").innerHTML = passos.slice(0, idx + 1).reverse()
    .map((x) => `<li>${x.msg}</li>`).join("") || "<li>Clique em Próximo passo ou Executar.</li>";
}

function proximo() {
  if (idx < passos.length - 1) idx++;
  if (idx >= passos.length - 1) pausar();
  render();
}
function executar() {
  if (idx >= passos.length - 1) idx = -1;
  pausar();
  timer = setInterval(proximo, 350);
}
function pausar() { clearInterval(timer); timer = null; }
function reiniciar() { pausar(); idx = -1; render(); }

function carregar(nome) {
  pausar();
  linhas = CENARIOS[nome].map((l) => l.split(""));
  resultados = {};
  preparar();
}
function alternarParede(r, c) {
  if (idx !== -1 || linhas[r][c] === "S" || linhas[r][c] === "E") return; // só edita antes de iniciar
  linhas[r][c] = linhas[r][c] === "#" ? "." : "#";
  resultados = {};
  preparar();
}
function escolher(a) {
  pausar();
  algo = a;
  $("btn-bfs").classList.toggle("ativo", a === "bfs");
  $("btn-dfs").classList.toggle("ativo", a === "dfs");
  preparar();
}

$("btn-bfs").onclick = () => escolher("bfs");
$("btn-dfs").onclick = () => escolher("dfs");
$("btn-play").onclick = executar;
$("btn-step").onclick = () => { pausar(); proximo(); };
$("btn-pause").onclick = pausar;
$("btn-reset").onclick = reiniciar;
document.querySelectorAll("[data-cenario]").forEach((b) => b.onclick = () => carregar(b.dataset.cenario));

carregar("labirinto");
