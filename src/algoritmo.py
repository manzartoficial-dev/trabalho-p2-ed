"""Tema D - Travessias em grafos: BFS (fila) vs DFS (pilha).

O grafo é uma Lista de Adjacência (dict: nó -> lista de vizinhos).
Cada nó é uma célula (linha, coluna) de um labirinto em grade.
Contador de operações = número de vizinhos examinados.
"""
from collections import deque
from typing import Dict, List, Optional, Tuple

No = Tuple[int, int]
Grafo = Dict[No, List[No]]
Resultado = Tuple[Optional[List[No]], List[No], int]  # (caminho, ordem de visita, operações)


def grade_para_grafo(linhas: List[str]) -> Tuple[Grafo, No, No]:
    """
    '#' = parede, 'S' = origem, 'E' = destino, '.' = livre.
    
    """
    grafo: Grafo = {}
    origem = destino = (0, 0)
    for r, linha in enumerate(linhas):
        for c, ch in enumerate(linha):
            if ch == "#":
                continue
            if ch == "S":
                origem = (r, c)
            elif ch == "E":
                destino = (r, c)
            grafo[(r, c)] = [
                (r + dr, c + dc)
                for dr, dc in ((-1, 0), (0, 1), (1, 0), (0, -1))
                if 0 <= r + dr < len(linhas)
                and 0 <= c + dc < len(linhas[r + dr])
                and linhas[r + dr][c + dc] != "#"
            ]
    return grafo, origem, destino


def reconstruir(pai: Dict[No, Optional[No]], destino: No) -> List[No]:
    
    caminho: List[No] = []
    no: Optional[No] = destino
    while no is not None:
        caminho.append(no)
        no = pai[no]
    return caminho[::-1]


def bfs(grafo: Grafo, origem: No, destino: No) -> Resultado:
    
    ops = 0
    fila = deque([origem])
    visitados = {origem}          
    pai: Dict[No, Optional[No]] = {origem: None}
    ordem: List[No] = []
    while fila:
        atual = fila.popleft()    
        ordem.append(atual)
        if atual == destino:
            return reconstruir(pai, destino), ordem, ops
        for viz in grafo[atual]:
            ops += 1
            if viz not in visitados:
                visitados.add(viz)
                pai[viz] = atual
                fila.append(viz)  
    return None, ordem, ops



def dfs(grafo: Grafo, origem: No, destino: No) -> Resultado:
    
    ops = 0
    pilha = [origem]
    visitados = {origem}
    pai: Dict[No, Optional[No]] = {origem: None}
    ordem: List[No] = []

    while pilha:
        atual = pilha.pop()
        ordem.append(atual)

        if atual == destino:
            return reconstruir(pai, destino), ordem, ops

        for viz in reversed(grafo[atual]):
            ops += 1

            if viz not in visitados:
                visitados.add(viz)
                pai[viz] = atual
                pilha.append(viz)

    return None, ordem, ops



def executar(titulo: str, linhas: List[str]) -> None:
    
    grafo, origem, destino = grade_para_grafo(linhas)
    print(f"\n=== {titulo} ===")
    for nome, algoritmo in (("BFS", bfs), ("DFS", dfs)):
        caminho, ordem, ops = algoritmo(grafo, origem, destino)
        passos = len(caminho) - 1 if caminho else "sem caminho"
        print(f"{nome}: passos do caminho = {passos} | nós visitados = {len(ordem)} | operações = {ops}")


if __name__ == "__main__":
    
    executar("Caso comum (labirinto)", [
        "S..#......",
        ".#.#.####.",
        ".#...#....",
        ".#####.##.",
        ".....#..#.",
        ".###.#.##.",
        "...#...#.E",
    ])

    
    executar("Borda (sem caminho)", [
        "S.#E",
        "..#.",
    ])

    
    executar("Comparativo (DFS não acha o menor caminho)", [
        ".......",
        ".......",
        "S......",
        "E......",
        ".......",
    ])
