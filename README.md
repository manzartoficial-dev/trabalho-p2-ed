# BFS vs. DFS --- Travessias em Grafos

> **Vídeo explicativo:** \[https://drive.google.com/drive/folders/1hqkpzlXyAh8pKHBfyeSORvs-9djiLYPS?usp=sharing]

## 1. Identificação

-   **Nome:** Guilherme Manzano Dos Santos Souza
-   **RA:** 2840482521014
-   **Tema:** Tema D --- Travessias em grafos: Busca em Largura (BFS) e
    Busca em Profundidade (DFS)
-   **Linguagem utilizada:** Python
-   **Representação do grafo:** Lista de adjacência

## 2. Resumo teórico

Um grafo é uma estrutura formada por vértices (ou nós) e arestas, que
representam as conexões entre eles. Neste projeto, o grafo representa um
labirinto: cada posição livre corresponde a um vértice, enquanto as
ligações entre posições vizinhas correspondem às arestas. As paredes não
fazem parte do grafo.

O grafo é armazenado por meio de uma **lista de adjacência**,
implementada com um dicionário Python. Cada chave representa um vértice
e seu valor é uma lista com os vértices diretamente conectados a ele.

### 2.1 Busca em Largura --- BFS

A BFS (*Breadth-First Search*) explora o grafo por níveis: primeiro
visita os vértices mais próximos da origem, depois os vértices seguintes
e assim por diante.

A implementação utiliza uma **fila**, seguindo a regra FIFO (*First In,
First Out*): o primeiro elemento inserido é o primeiro a sair. No
código, `append()` adiciona um vértice ao final da fila e `popleft()`
remove o elemento que está na frente.

Em grafos sem pesos --- ou quando todas as arestas têm o mesmo custo ---
a BFS encontra um caminho com a menor quantidade de arestas entre a
origem e o destino. Isso acontece porque os vértices são explorados em
ordem crescente de distância a partir da origem.

### 2.2 Busca em Profundidade --- DFS

A DFS (*Depth-First Search*) explora um ramo do grafo em profundidade
antes de voltar e investigar outras possibilidades.

A implementação utiliza uma **pilha**, seguindo a regra LIFO (*Last In,
First Out*): o último elemento inserido é o primeiro a sair. No código,
`append()` insere um vértice e `pop()` remove o elemento do topo da
pilha.

A DFS encontra um caminho quando existe uma rota alcançável até o
destino, mas não garante que esse caminho seja o menor. O resultado
depende da estrutura do grafo e da ordem em que os vizinhos são
explorados.

### 2.3 Reconstrução do caminho e métricas

A função `reconstruir()` utiliza o dicionário `pai` para registrar de
qual vértice cada posição foi alcançada. Quando o destino é encontrado,
a função segue os pais do destino até a origem. Como essa sequência é
obtida de trás para frente, `caminho[::-1]` inverte a lista para
apresentar o percurso na ordem correta.

O projeto também conta operações por meio da variável `ops`. Ela é
incrementada cada vez que um vizinho é examinado. Portanto, esse
contador representa **verificações de vizinhos**, e não a quantidade de
caminhos completos ou de passos do caminho final.

As métricas exibidas têm significados diferentes:

-   **Operações (`ops`):** quantidade de vizinhos examinados.
-   **Nós visitados:** quantidade de vértices efetivamente processados e
    registrados na ordem de visita.
-   **Passos do caminho:** quantidade de arestas do caminho encontrado,
    calculada por `len(caminho) - 1`.

### 2.4 Aplicações no mundo real

A BFS pode ser utilizada em sistemas que precisam encontrar o menor
número de etapas ou conexões, como encontrar o menor número de relações
entre pessoas em uma rede social, calcular rotas com quantidade mínima
de trechos em uma rede não ponderada e explorar mapas em que cada
movimento possui o mesmo custo.

A DFS é útil em tarefas de exploração e análise de estruturas, como
percorrer diretórios, analisar componentes conectados, detectar ciclos,
resolver labirintos e realizar etapas de algoritmos de dependências e
ordenação topológica.

Quando as conexões possuem pesos diferentes, a BFS não garante o caminho
de menor custo. Para esse tipo de problema, podem ser utilizados
algoritmos como Dijkstra, desde que os pesos sejam não negativos.

## 3. Complexidade assintótica

Considere:

-   **V:** quantidade de vértices do grafo.
-   **E:** quantidade de arestas do grafo.

Com lista de adjacência, tanto BFS quanto DFS possuem complexidade de
tempo **O(V + E) no pior caso**, pois podem precisar visitar todos os
vértices alcançáveis e examinar suas arestas.

A tabela considera a implementação deste projeto, que mantém estruturas
auxiliares como conjunto de visitados, dicionário de pais, ordem de
visita e fila ou pilha. O espaço do próprio grafo não está incluído no
espaço auxiliar.

  -----------------------------------------------------------------------
  Caso         BFS --- Tempo BFS --- Espaço  DFS --- Tempo DFS --- Espaço
                                   auxiliar                      auxiliar
  ----------- -------------- -------------- -------------- --------------
  Melhor caso           O(1)           O(1)           O(1)           O(1)

  Caso médio        O(V + E)           O(V)       O(V + E)           O(V)

  Pior caso         O(V + E)           O(V)       O(V + E)           O(V)
  -----------------------------------------------------------------------

### Justificativa dos casos

-   **Melhor caso:** ocorre, por exemplo, quando a origem já é o
    destino. O algoritmo verifica essa condição logo no primeiro
    vértice, sem percorrer as conexões. As estruturas auxiliares começam
    com tamanho constante.
-   **Caso médio:** não existe uma única quantidade média de operações
    válida para todo grafo; ela depende da forma do grafo, da posição do
    destino e da ordem dos vizinhos. Como estimativa geral, a busca pode
    examinar uma parcela significativa dos vértices e arestas, chegando
    a O(V + E) de tempo e O(V) de espaço auxiliar.
-   **Pior caso:** ocorre quando o destino não é alcançável ou só é
    encontrado depois de explorar praticamente toda a parte alcançável
    do grafo. Nesse cenário, os algoritmos visitam até V vértices e
    examinam até E arestas. As estruturas auxiliares podem armazenar até
    O(V) vértices e registros.

**Observação:** as complexidades de tempo de BFS e DFS são iguais em
O(V + E) no pior caso, mas isso não significa que sempre examinem os
mesmos vértices ou realizem a mesma quantidade de operações em uma
execução específica. O comportamento depende da estrutura do grafo e da
posição do destino. A BFS também pode manter uma fronteira ampla na
fila; a DFS pode seguir profundamente por um ramo. Nenhuma delas é
universalmente mais rápida.

## 4. Diário de Engenharia com IA

### 4.1 Ferramentas utilizadas

-   **Claude:** utilizado como apoio inicial para gerar uma versão do
    código Python e do simulador visual.
-   **ChatGPT (GPT-6):** utilizado para estudar e compreender o código,
    esclarecer conceitos de grafos, BFS, DFS, filas, pilhas, lista de
    adjacência, dicionários, reconstrução de caminhos e complexidade
    assintótica; também foi utilizado para revisar e refinar partes da
    implementação e preparar a explicação do projeto.

### 4.2 Três prompts principais utilizados

Os prompts abaixo registram, de forma resumida, as solicitações centrais
feitas durante o desenvolvimento:

1.  **Geração inicial da implementação e do simulador:** \> Desenvolva o
    projeto do Tema D, implementando BFS e DFS em Python com grafo
    representado por lista de adjacência. Crie também um simulador
    visual em HTML, CSS e JavaScript para demonstrar os algoritmos em um
    labirinto, com controles de execução, avanço passo a passo, pausa,
    reinicialização e métricas.

2.  **Estudo e explicação do código:** \> Explique o código Python de
    BFS e DFS linha por linha, utilizando uma linguagem simples para
    iniciante. Detalhe principalmente a lista de adjacência, o uso de
    fila e pilha, o dicionário de pais, a reconstrução do caminho e o
    contador de operações.

3.  **Revisão e refinamento do DFS:** \> Revise a implementação de DFS e
    identifique possíveis problemas ou melhorias. Ajuste a função para
    marcar os vértices como visitados quando forem inseridos na pilha,
    evitando inserções duplicadas, sem alterar desnecessariamente o
    restante do código.

### 4.3 Erro, limitação e ajustes realizados

Durante a revisão do código gerado inicialmente pela IA, foi
identificado um ponto de melhoria na implementação do DFS. Na primeira
versão, um vértice era marcado como visitado somente quando era removido
da pilha. Assim, antes de ser processado, o mesmo vértice poderia ser
inserido mais de uma vez por diferentes vizinhos, gerando entradas
duplicadas e verificações desnecessárias.

A função foi ajustada para marcar o vértice como visitado no momento em
que ele é inserido na pilha. Dessa forma, ele não é adicionado novamente
por outro vértice. O registro do pai também é feito no momento dessa
descoberta, preservando o caminho utilizado para reconstruir a rota.

Outro cuidado foi diferenciar as métricas do programa: o contador `ops`
registra vizinhos examinados, enquanto a quantidade de vértices
processados e o número de passos do caminho são medidos separadamente.
Essa distinção evita interpretar o contador de operações como se
representasse caminhos percorridos.

A IA foi utilizada como ferramenta de apoio, mas o código e os conceitos
foram revisados para compreender o funcionamento e realizar os ajustes
necessários.

## 5. Como executar

1.  Certifique-se de ter o Python 3 instalado.

2.  Salve o código Python do projeto em um arquivo, por exemplo,
    `algoritmo.py`.

3.  Execute no terminal:

    ``` bash
    python algoritmo.py
    ```

4.  Para utilizar o simulador visual, abra o arquivo `index.html` em um
    navegador.

## 6. Considerações finais

O projeto demonstra que BFS e DFS resolvem problemas de travessia em
grafos utilizando estratégias diferentes. A BFS explora por níveis e
encontra caminhos com o menor número de arestas em grafos sem pesos. A
DFS explora em profundidade e pode encontrar uma rota sem garantir que
ela seja a menor.

A implementação em Python, os cenários de teste e o simulador visual
permitem observar essas diferenças na prática, relacionando o
comportamento dos algoritmos às estruturas de dados utilizadas e à sua
complexidade.
