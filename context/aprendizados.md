# Aprendizados

## Vite e a extensão .jsx

**Problema:** Ao seguir a estrutura de arquivos que definia um componente React como `App.js`, o servidor de desenvolvimento do Vite (`npm run dev`) falhou com o erro `The JSX syntax extension is not currently enabled`.

**Causa:** O Vite, por padrão, não processa a sintaxe JSX (ex: `<>...</>`) dentro de arquivos com a extensão `.js`. Ele espera que essa sintaxe exista apenas em arquivos `.jsx` ou `.tsx`.

**Solução:** A solução mais limpa e alinhada com as convenções do ecossistema React foi renomear o arquivo `App.js` para `App.jsx` e atualizar a declaração de importação correspondente em `main.jsx`. Isso resolve o problema sem a necessidade de adicionar configurações de build complexas.

---

## Gerenciamento de Credenciais com .env em Python

**Problema:** O script Python precisava de credenciais para acessar o Neo4j, mas por segurança, essas chaves não devem ser salvas diretamente no código-fonte (`hardcoded`) ou enviadas para o repositório Git. Passá-las como variáveis de ambiente na linha de comando a cada execução era impraticável.

**Causa:** A necessidade de separar as configurações (credenciais, URLs de serviços) do código, uma prática recomendada para segurança e portabilidade entre diferentes ambientes (desenvolvimento, produção).

**Solução:** A abordagem adotada foi:
1.  **Arquivo `.env`:** Criar um arquivo chamado `.env` na raiz do diretório do serviço (`backend/.env`) para armazenar as variáveis, como `NEO4J_URI`, `NEO4J_USERNAME` e `NEO4J_PASSWORD`.
2.  **Biblioteca `python-dotenv`:** Utilizar a biblioteca `python-dotenv` para carregar automaticamente as variáveis definidas no arquivo `.env` para o ambiente de execução do script. Para isso, foi adicionada a dependência ao `requirements.txt`.
3.  **Carregamento no Código:** No início do script, a função `load_dotenv()` foi chamada. Para garantir que o arquivo `.env` fosse encontrado independentemente de onde o script fosse executado, o caminho até ele foi construído dinamicamente: `dotenv_path = os.path.join(os.path.dirname(__file__), '..', '..', '.env')`.
4.  **Segurança com `.gitignore`:** O arquivo `.gitignore` foi verificado para garantir que a entrada `.env` estava presente, impedindo que o arquivo com as credenciais fosse rastreado pelo Git.

---

## Execução de Scripts e o Ambiente Virtual Python

**Problema:** Ao tentar executar um script de teste (`python app/db/conector_neo4j.py`) a partir do diretório `backend`, ocorreu o erro `ModuleNotFoundError: No module named 'neo4j'`, mesmo com as dependências corretamente listadas no `requirements.txt`.

**Causa:** O comando estava sendo executado usando o interpretador Python padrão do sistema, e não o do ambiente virtual (`venv`) do projeto, onde as dependências (`neo4j`, `python-dotenv`, etc.) foram de fato instaladas. O ambiente virtual não havia sido ativado para a sessão do terminal.

**Solução:** A solução foi ativar explicitamente o ambiente virtual antes de executar o script.
1.  **Navegar até a pasta raiz do serviço:** `cd backend`
2.  **Ativar o ambiente virtual:** O comando `source venv/bin/activate` foi executado para carregar o interpretador e as bibliotecas do `venv` na sessão atual do terminal.
3.  **Executar o script:** O script foi então executado com `python app/db/conector_neo4j.py`.

A execução combinada (`source venv/bin/activate && python app/db/conector_neo4j.py`) garante que o ambiente correto seja usado, resolvendo o `ModuleNotFoundError` e permitindo que o script encontre suas dependências.
# Aprendizados do Projeto

Este arquivo documenta lições aprendidas durante o desenvolvimento, especialmente aquelas relacionadas a erros, configurações e boas práticas que podem ser úteis para futuras manutenções ou projetos similares.

---

### 1. Execução de Módulos Python e `ModuleNotFoundError`

**Problema:** Ao tentar executar o script de teste `servico_do_grafo.py` diretamente, ocorreu o erro `ModuleNotFoundError: No module named 'app'`.

**Causa:** O script está dentro de uma estrutura de pacotes (`backend/app/`) e depende de importações relativas a essa estrutura (ex: `from app.db.conector_neo4j import ...`). Executar o script diretamente do seu próprio diretório ou de um local inadequado faz com que o Python não reconheça o diretório `app` como um pacote no `sys.path`.

**Solução:**
A execução deve ser feita como um módulo a partir do diretório pai que contém o pacote `app`.
1.  Navegar para o diretório `backend`: `cd backend`
2.  Executar o script como um módulo, o que adiciona o diretório atual ao `sys.path`: `python -m app.services.servico_do_grafo`

---

### 2. Gerenciamento de Dependências com `requirements.txt`

**Problema:** Após corrigir o primeiro erro, surgiu um novo: `ModuleNotFoundError: No module named 'neo4j'`.

**Causa:** O ambiente virtual (`venv`) existia, mas as dependências listadas no arquivo `requirements.txt` não haviam sido instaladas nele.

**Solução:**
É crucial sempre ativar o ambiente virtual correto e instalar as dependências antes de executar a aplicação.
1.  Ativar o ambiente virtual (estando no diretório `backend`): `source venv/bin/activate`
2.  Instalar as dependências: `pip install -r requirements.txt`

---

### 3. Atualização da API do Driver Neo4j: `id` vs. `element_id`

**Problema:** Durante a execução dos testes, foram exibidos `DeprecationWarning`s informando que o uso de `.id` para nós e relacionamentos está obsoleto.

**Causa:** O driver do `neo4j` para Python está em transição para uma nova forma de identificar elementos do grafo. O antigo atributo `.id` (um inteiro) está sendo substituído pelo `.element_id` (uma string).

**Solução:**
Para garantir a compatibilidade futura e eliminar os avisos, o código foi refatorado para usar `.element_id` em todos os locais onde um identificador único de nó ou aresta era necessário.

**Exemplo (antes):**
```python
{
    "id": str(no.id),
    "source": str(aresta.start_node.id),
    "target": str(aresta.end_node.id),
}
```

**Exemplo (depois):**
```python
{
    "id": no.element_id,
    "source": aresta.start_node.element_id,
    "target": aresta.end_node.element_id,
}
```
*Observação: `element_id` já é uma string, então a conversão `str()` não é mais necessária.*

---

### 4. Inicialização do Servidor Uvicorn e o Contexto de Execução

**Problema:** Ao tentar testar os novos endpoints da API, as rotas como `/api/rede` retornavam `404 Not Found`, embora o servidor Uvicorn estivesse rodando.

**Causa:** O servidor `uvicorn` estava sendo executado a partir do diretório raiz do projeto. Nesse contexto, ele não conseguia carregar corretamente a estrutura do módulo `app` (localizado em `backend/app`) onde as rotas foram definidas. O comando `uvicorn main:app --app-dir backend` também se mostrou ineficaz para resolver as importações relativas (`from app.api...`).

**Solução:**
A execução do servidor deve ser feita de dentro do diretório que é a raiz do pacote Python, neste caso, o diretório `backend`.
1.  Navegar para o diretório `backend`: `cd backend`
2.  Ativar o ambiente virtual: `source venv/bin/activate`
3.  Executar o Uvicorn a partir dali, referenciando o `main.py` e o objeto `app`: `uvicorn main:app --reload`

Isso garante que o `sys.path` do Python inclua o diretório `backend`, permitindo que o `main` encontre e carregue os módulos de `app/` sem erros.

---

### 5. Diagnóstico de Requisições Lentas (Timeouts)

**Problema:** Após corrigir a inicialização do servidor, as chamadas para o endpoint `GET /api/rede` ficavam "penduradas" (hanging), eventualmente resultando em timeout.

**Causa:** A consulta Cypher (`MATCH (n)-[r]->(m) RETURN n, r, m`) no `servico_do_grafo.py` estava tentando carregar a totalidade do banco de dados Neo4j para a memória. Em um banco de dados com muitos nós e relacionamentos, essa operação é extremamente lenta e consome muitos recursos.

**Solução:**
Para fins de teste e desenvolvimento, a consulta foi modificada para retornar apenas um subconjunto dos dados, validando o fluxo da API sem sobrecarregar o sistema.
1.  **Limitar a Consulta:** A consulta foi alterada para `MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 100`.
2.  **Validação:** Com a limitação, o endpoint respondeu instantaneamente, confirmando que a rota, o serviço e a serialização dos dados estavam funcionando corretamente.
3.  **Conclusão:** A lentidão não era um erro no código da API, mas sim uma questão de performance da consulta. A limitação foi removida posteriormente para restaurar a funcionalidade completa, deixando a otimização da consulta ou o tratamento de longos tempos de carregamento no frontend como um próximo passo.

---

### 6. Processamento de Resultados de Consultas com Nós e Arestas

**Problema:** Uma chamada do frontend para a API (`GET /api/rede`) resultava em um erro `500 Internal Server Error`. A investigação no backend mostrou que uma exceção não tratada estava ocorrendo durante a serialização dos dados do Neo4j para JSON.

**Causa:** A consulta `MATCH (n)-[r]->(m) RETURN n, r, m` retorna um stream de registros (`Record`), onde cada registro contém `n`, `r` e `m`. A lógica original tentava, em uma etapa posterior, acessar `aresta.start_node` e `aresta.end_node` a partir do objeto de relacionamento (`aresta`). No entanto, o objeto `Relationship` do driver `neo4j` não contém os objetos `Node` completos; ele apenas contém os IDs dos nós. A tentativa de acessar propriedades dos nós (como `element_id`) a partir da aresta resultava em erro.

**Solução:**
A solução foi refatorar a função de transformação de dados para processar o `Record` de forma atômica, ou seja, para cada registro da resposta, extrair o nó de origem (`n`), o nó de destino (`m`) e a aresta (`r`) juntos.

1.  **Iteração Direta:** A função passou a iterar diretamente sobre os `records` retornados pela `session.run()`.
2.  **Mapeamento de Nós:** Um dicionário foi usado para armazenar os nós já processados, evitando duplicatas na lista final de nós de forma eficiente.
3.  **Passagem de IDs:** Ao formatar a aresta, os `element_id`s dos nós de origem e destino (que estão disponíveis no mesmo `record`) são passados explicitamente para a função de formatação da aresta.

**Exemplo (lógica corrigida em `_transformar_para_json`):**
```python
def _transformar_para_json(self, records):
    nos_dict = {}
    arestas = []

    for record in records:
        no_origem = record["n"]
        if no_origem.element_id not in nos_dict:
            nos_dict[no_origem.element_id] = self._formatar_no(no_origem)

        no_destino = record["m"]
        if no_destino.element_id not in nos_dict:
            nos_dict[no_destino.element_id] = self._formatar_no(no_destino)

        aresta = record["r"]
        # Passa os IDs corretos, que estão no escopo do record
        arestas.append(self._formatar_aresta(aresta, no_origem.element_id, no_destino.element_id))
    
    return {
        "nodes": list(nos_dict.values()),
        "edges": arestas
    }
```
Isso garante que cada aresta seja construída com os IDs de origem e destino corretos, resolvendo o erro 500.

---

### 7. Graphology e o Erro "UsageGraphError: edge already exists"

**Problema:** Ao carregar os dados da rede no frontend, a aplicação falhou com o erro `UsageGraphError: Graph.addEdge: an edge ... already exists`.

**Causa:** Por padrão, a biblioteca `graphology` cria um grafo "simples" (`simple graph`), que não permite a existência de múltiplas arestas entre os mesmos dois nós. A consulta no backend (`MATCH (n)-[r]->(m)`) pode retornar dados que incluem mais de uma relação entre as mesmas duas entidades, o que levava a uma tentativa de adicionar uma aresta duplicada no frontend.

**Solução:** A solução foi configurar o `graphology` para criar um "multigrafo" (`multigraph`), que explicitamente suporta múltiplas arestas. Isso foi feito passando a opção `{ multi: true }` durante a instanciação do objeto `Graph`.

**Antes:**
```javascript
const novoGrafo = new Graph();
```

**Depois:**
```javascript
const novoGrafo = new Graph({ multi: true });
```
Essa alteração permite que o grafo do frontend represente fielmente os dados do backend, mesmo quando existem múltiplas conexões entre os mesmos nós.

---

### 8. Vite e a Extensão .jsx para Componentes React

**Problema:** O servidor de desenvolvimento do Vite (`npm run dev`) falhou com o erro `Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension.` para múltiplos componentes.

**Causa:** O Vite, por padrão, exige que arquivos contendo sintaxe JSX (ex: `<div>...</div>`) utilizem a extensão `.jsx` ou `.tsx`. Vários componentes (`VisualizadorDeGrafo.js`, `PainelDeDetalhes.js`, etc.) foram criados com a extensão `.js`.

**Solução:** A solução foi renomear todos os arquivos de componentes React que utilizam JSX para que tivessem a extensão `.jsx`.

**Exemplo:**
- `PainelDeDetalhes.js` foi renomeado para `PainelDeDetalhes.jsx`.
- `VisualizadorDeGrafo.js` foi renomeado para `VisualizadorDeGrafo.jsx`.

Adicionalmente, as declarações de importação no `App.jsx` e em outros arquivos foram atualizadas para apontar para os novos nomes de arquivo, garantindo que o sistema de módulos pudesse localizá-los corretamente.

---

### 9. Erros de Pacote no Ecossistema React-Sigma

**Problema:** Após corrigir os nomes dos arquivos para `.jsx`, surgiram dois novos erros no console do Vite: `Missing "./lib/react-sigma.min.css" specifier` e `Failed to resolve import "@react-sigma/layout-forceatlas2"`.

**Causas e Soluções:**

1.  **Caminho de CSS Inválido:**
    *   **Causa:** O erro `Missing "./lib/react-sigma.min.css"` indicou que o caminho para importar os estilos da biblioteca estava incorreto. Isso geralmente acontece quando a estrutura de arquivos de um pacote é alterada em uma nova versão.
    *   **Solução:** Foi necessário consultar a documentação ou exemplos da biblioteca para encontrar o caminho correto. A importação foi corrigida de `import "@react-sigma/core/lib/react-sigma.min.css";` para `import "@react-sigma/core/styles.css";`.

2.  **Dependência Não Instalada:**
    *   **Causa:** O erro `Failed to resolve import "@react-sigma/layout-forceatlas2"` significava que um pacote necessário para uma funcionalidade específica (o layout de força) não estava instalado no projeto. O ecossistema `react-sigma` é modular, e funcionalidades como layouts precisam ser instaladas separadamente.
    *   **Solução:** A dependência foi adicionada ao projeto executando o comando: `npm install @react-sigma/layout-forceatlas2`.

**Aprendizado:** Ao usar bibliotecas modulares, é crucial verificar se todos os pacotes necessários para as funcionalidades desejadas estão instalados e se os caminhos de importação (especialmente para arquivos CSS ou outros ativos) estão atualizados com a versão em uso.

---

### 10. Depuração de Erros em Cascata no React-Sigma

**Problema:** Após resolver os problemas de build, a aplicação ainda falhava no navegador com uma série de erros em cascata, impedindo a renderização do grafo.

**Causas e Soluções (em ordem de resolução):**

1.  **Erro: `TypeError: kill is not a function` / `start is not a function`**
    *   **Causa:** A API do hook `useLayoutForceAtlas2` era inconsistente ou foi mal interpretada. Tentativas de chamar as funções `start`, `stop` ou `kill` diretamente do hook falhavam, pois elas não existiam ou não estavam disponíveis no momento da chamada.
    *   **Solução (Defensiva):** A solução final foi adotar uma programação defensiva. Em vez de assumir que as funções existiam, elas foram envolvidas em uma verificação `if (typeof start === 'function')`. Isso evitou que a aplicação falhasse e permitiu a depuração dos problemas subsequentes.

2.  **Erro: `Sigma: Container has no width`**
    *   **Causa:** A biblioteca tentou renderizar o grafo antes que o CSS (especificamente Flexbox) tivesse calculado o tamanho final do contêiner do grafo, resultando em um contêiner com largura zero.
    *   **Solução:** A configuração `allowInvalidContainer: true` foi adicionada às `settings` do componente `<SigmaContainer>`. Isso instrui a biblioteca a não gerar um erro e a esperar que o contêiner tenha dimensões válidas.

3.  **Erro: `Sigma: could not find a valid position (x, y) for node`**
    *   **Causa:** Os nós eram carregados no grafo sem coordenadas `x` e `y` iniciais. O layout de força é responsável por calcular essas posições, mas a biblioteca tentava renderizar os nós *antes* que o layout tivesse a chance de rodar.
    *   **Solução:** Foi instalado o pacote `graphology-layout`. No hook `useDadosDoGrafo`, a função `random.assign(novoGrafo)` foi chamada logo após o carregamento dos dados. Isso atribuiu uma posição aleatória a cada nó, satisfazendo o requisito inicial da biblioteca de renderização.

4.  **Erro: `UsageGraphError: an edge linking "X" to "Y" already exists` (reincidente)**
    *   **Causa:** Mesmo com a opção `multi: true` no construtor do grafo, a forma como as arestas eram adicionadas (`.addEdge()`) não era suficiente para garantir o tratamento de múltiplas arestas quando os dados vêm de uma fonte como o Neo4j.
    *   **Solução Definitiva:** A lógica de adição de arestas foi alterada para usar `.addEdgeWithKey(aresta.element_id, ...)`. Ao usar o `element_id` único do Neo4j como a chave explícita para cada aresta, garantimos que a `graphology` trate cada relacionamento como uma entidade única, resolvendo o conflito de duplicatas.

**Aprendizado Técnico:** Ao trabalhar com bibliotecas de visualização que wrappam outras bibliotecas (react-sigma wrapping sigma.js + graphology), é importante entender como os dados fluem entre as camadas. O `useLoadGraph` pode não preservar todas as configurações do grafo original, sendo necessário às vezes trabalhar diretamente com a API de baixo nível da biblioteca subjacente para ter controle total sobre a configuração do grafo.

---

### 11. Otimização de Rerenders com `useCallback`

**Problema:** Após implementar a interatividade de *hover*, o console do navegador exibiu dois erros interligados:
1.  `The final argument passed to useEffect changed size between renders`: O array de dependências do `useEffect` no componente filho (`Grafo.jsx`) estava mudando a cada renderização.
2.  `Too many active WebGL contexts`: O componente `<SigmaContainer>` estava sendo recriado excessivamente, gerando um vazamento de contextos WebGL.

**Causa:** As funções de manipulação de eventos (`handleNodeClick`, `handleNodeEnter`, etc.) estavam sendo declaradas diretamente dentro do componente `App`. Em React, isso faz com que uma nova instância da função seja criada toda vez que o componente `App` é renderizado. Ao passar essas funções como `props` para os componentes filhos, o React as interpretava como `props` diferentes a cada renderização.

**Solução:**
A solução foi envolver a declaração dessas funções com o hook `useCallback`.

```javascript
// Em App.jsx

import React, { useState, useCallback } from "react";

// ...

const handleNodeClick = useCallback((node) => {
  setNoSelecionado(node);
}, []); // Array de dependências vazio significa que a função nunca será recriada.

const handleNodeEnter = useCallback((node) => {
  setNoEmDestaque(node);
}, []);
```

O `useCallback` memoíza a função, garantindo que a mesma instância seja mantida entre as renderizações (a menos que suas próprias dependências mudem). Isso estabiliza as `props` passadas para os componentes filhos, evitando renderizações desnecessárias e resolvendo tanto o aviso do `useEffect` quanto o vazamento de contextos WebGL.

---

### 12. Problema de Renderização de Arestas com React-Sigma e Multigraph (Tarefa 4.2)

**Problema:** Durante a execução da tarefa 4.2 (renderizar arestas no grafo), as arestas não apareciam na visualização. Investigando o console do navegador, foi descoberto que o erro `UsageGraphError: Graph.addDirectedEdgeWithKey: an edge linking "X" to "Y" already exists. If you really want to add multiple edges linking those nodes, you should create a multi graph by using the 'multi' option.` estava ocorrendo.

**Causa:** O problema tinha múltiplas camadas:

1. **Inconsistência de Campo:** O hook `useDadosDoGrafo` estava tentando usar `aresta.element_id` como chave única, mas a API retornava o campo como `aresta.id`.

2. **Importação CSS Incorreta:** A importação do CSS do react-sigma estava usando um caminho inexistente (`@react-sigma/core/styles.css`), quando o correto era `@react-sigma/core/lib/style.css`.

3. **Conflito com useLoadGraph:** O principal problema era que o `useLoadGraph` do react-sigma estava criando internamente um novo grafo sem a opção `multi: true`, mesmo que nosso grafo original fosse um multigraph. Isso causava erro ao tentar importar arestas duplicadas entre os mesmos nós.

**Solução:** A solução envolveu quatro correções:

1. **Correção do Campo da Aresta:**
   ```javascript
   // Em useDadosDoGrafo.js - ANTES (incorreto):
   novoGrafo.addEdgeWithKey(aresta.element_id, aresta.source, aresta.target, { ...aresta });
   
   // DEPOIS (correto):
   novoGrafo.addEdgeWithKey(aresta.id, aresta.source, aresta.target, { ...aresta });
   ```

2. **Correção da Importação CSS:**
   ```javascript
   // Em VisualizadorDeGrafo.jsx - ANTES (incorreto):
   import "@react-sigma/core/styles.css";
   
   // DEPOIS (correto):
   import "@react-sigma/core/lib/style.css";
   ```

3. **Configuração do Multigraph no SigmaContainer:**
   ```javascript
   // Em VisualizadorDeGrafo.jsx:
   import Graph from "graphology";
   
   const VisualizadorDeGrafo = ({ onNodeClick, onNodeEnter, onNodeLeave }) => {
       // Cria um grafo multigraph vazio para inicializar o Sigma
       const grafoInicial = new Graph({ multi: true });
       
       return (
           <SigmaContainer 
               graph={grafoInicial}  // Passa um multigraph válido para inicialização
               settings={{ ... }}
           >
   ```

4. **Substituição do useLoadGraph por Importação Direta:**
   ```javascript
   // Em Grafo.jsx - ANTES (problemático):
   const loadGraph = useLoadGraph();
   useEffect(() => {
       if (grafo) {
           loadGraph(grafo);
       }
   }, [grafo, loadGraph]);
   
   // DEPOIS (solução):
   const sigma = useSigma();
   useEffect(() => {
       if (grafo && sigma) {
           sigma.getGraph().clear();
           sigma.getGraph().import(grafo);
           sigma.refresh();
       }
   }, [grafo, sigma]);
   ```

**Resultado:** Com essas correções, as arestas passaram a ser renderizadas corretamente no grafo, resolvendo a tarefa 4.2.

**Teste Realizado:** Verificação no console do navegador mostrando:
- Carregamento correto de 8701 nós e 30817 arestas
- Estrutura adequada das arestas com `id`, `source`, `target`, `label` e `properties`
- Criação bem-sucedida do grafo com todas as arestas adicionadas

**Aprendizado Técnico:** Ao trabalhar com bibliotecas de visualização que wrappam outras bibliotecas (react-sigma wrapping sigma.js + graphology), é importante entender como os dados fluem entre as camadas. O `useLoadGraph` pode não preservar todas as configurações do grafo original, sendo necessário às vezes trabalhar diretamente com a API de baixo nível da biblioteca subjacente para ter controle total sobre a configuração do grafo.

---

### 13. Problema de Contextos WebGL Excessivos e Renderização "Piscante" 

**Problema:** Ao passar o mouse sobre nós no grafo, o componente "piscava" e múltiplos avisos apareciam no console: `WARNING: Too many active WebGL contexts. Oldest context will be lost.` Isso indicava que o SigmaContainer estava sendo recriado constantemente, criando novos contextos WebGL desnecessariamente.

**Causa:** O problema tinha duas camadas:

1. **Criação de Graph a cada Renderização:** No `VisualizadorDeGrafo.jsx`, uma nova instância de `Graph` estava sendo criada a cada renderização do componente:
   ```javascript
   const VisualizadorDeGrafo = ({ onNodeClick, onNodeEnter, onNodeLeave }) => {
       const grafoInicial = new Graph({ multi: true }); // ❌ Nova instância a cada render
   ```

2. **Dependências Desnecessárias no useEffect:** No `Grafo.jsx`, as funções `start` e `stop` do layout ForceAtlas2 estavam nas dependências do `useEffect`, fazendo com que o efeito fosse executado desnecessariamente.

**Solução:** Foram implementadas duas correções principais:

1. **Uso de useMemo para o Graph Inicial:**
   ```javascript
   // VisualizadorDeGrafo.jsx - ANTES (problemático):
   const grafoInicial = new Graph({ multi: true });
   
   // DEPOIS (correto):
   const grafoInicial = useMemo(() => new Graph({ multi: true }), []);
   ```

2. **Otimização das Dependências e Memoização dos Handlers:**
   ```javascript
   // Grafo.jsx - ANTES (problemático):
   }, [grafo, sigma, start, stop]);
   
   const handleNodeClick = (event) => { ... }; // Recriado a cada render
   
   // DEPOIS (correto):
   }, [grafo, sigma]); // Removidas dependências desnecessárias
   
   const handleNodeClick = useCallback((event) => { ... }, [sigma, onNodeClick]); // Memoizado
   ```

**Resultado:** Com essas correções, o SigmaContainer passou a ser criado apenas uma vez, eliminando os avisos de contextos WebGL excessivos e o comportamento "piscante" do grafo.

**Aprendizado Técnico:** O React pode causar re-renderizações excessivas quando objetos são criados desnecessariamente dentro de componentes funcionais. Para componentes que criam recursos pesados (como contextos WebGL), é crucial usar `useMemo` para objetos e `useCallback` para funções, garantindo que sejam criados apenas quando necessário.

---

### 14. Problema de Renderização de Arestas com React-Sigma e Multigraph (Tarefa 4.2)

**Problema:** Durante a execução da tarefa 4.2 (renderizar arestas no grafo), as arestas não apareciam na visualização. Investigando o console do navegador, foi descoberto que o erro `UsageGraphError: Graph.addDirectedEdgeWithKey: an edge linking "X" to "Y" already exists. If you really want to add multiple edges linking those nodes, you should create a multi graph by using the 'multi' option.` estava ocorrendo.

**Causa:** O problema tinha múltiplas camadas:

1. **Inconsistência de Campo:** O hook `useDadosDoGrafo` estava tentando usar `aresta.element_id` como chave única, mas a API retornava o campo como `aresta.id`.

2. **Importação CSS Incorreta:** A importação do CSS do react-sigma estava usando um caminho inexistente (`@react-sigma/core/styles.css`), quando o correto era `@react-sigma/core/lib/style.css`.

3. **Conflito com useLoadGraph:** O principal problema era que o `useLoadGraph` do react-sigma estava criando internamente um novo grafo sem a opção `multi: true`, mesmo que nosso grafo original fosse um multigraph. Isso causava erro ao tentar importar arestas duplicadas entre os mesmos nós.

**Solução:** A solução envolveu quatro correções:

1. **Correção do Campo da Aresta:**
   ```javascript
   // Em useDadosDoGrafo.js - ANTES (incorreto):
   novoGrafo.addEdgeWithKey(aresta.element_id, aresta.source, aresta.target, { ...aresta });
   
   // DEPOIS (correto):
   novoGrafo.addEdgeWithKey(aresta.id, aresta.source, aresta.target, { ...aresta });
   ```

2. **Correção da Importação CSS:**
   ```javascript
   // Em VisualizadorDeGrafo.jsx - ANTES (incorreto):
   import "@react-sigma/core/styles.css";
   
   // DEPOIS (correto):
   import "@react-sigma/core/lib/style.css";
   ```

3. **Configuração do Multigraph no SigmaContainer:**
   ```javascript
   // Em VisualizadorDeGrafo.jsx:
   import Graph from "graphology";
   
   const VisualizadorDeGrafo = ({ onNodeClick, onNodeEnter, onNodeLeave }) => {
       // Cria um grafo multigraph vazio para inicializar o Sigma
       const grafoInicial = new Graph({ multi: true });
       
       return (
           <SigmaContainer 
               graph={grafoInicial}  // Passa um multigraph válido para inicialização
               settings={{ ... }}
           >
   ```

4. **Substituição do useLoadGraph por Importação Direta:**
   ```javascript
   // Em Grafo.jsx - ANTES (problemático):
   const loadGraph = useLoadGraph();
   useEffect(() => {
       if (grafo) {
           loadGraph(grafo);
       }
   }, [grafo, loadGraph]);
   
   // DEPOIS (solução):
   const sigma = useSigma();
   useEffect(() => {
       if (grafo && sigma) {
           sigma.getGraph().clear();
           sigma.getGraph().import(grafo);
           sigma.refresh();
       }
   }, [grafo, sigma]);
   ```

**Resultado:** Com essas correções, as arestas passaram a ser renderizadas corretamente no grafo, resolvendo a tarefa 4.2.

**Teste Realizado:** Verificação no console do navegador mostrando:
- Carregamento correto de 8701 nós e 30817 arestas
- Estrutura adequada das arestas com `id`, `source`, `target`, `label` e `properties`
- Criação bem-sucedida do grafo com todas as arestas adicionadas

**Aprendizado Técnico:** Ao trabalhar com bibliotecas de visualização que wrappam outras bibliotecas (react-sigma wrapping sigma.js + graphology), é importante entender como os dados fluem entre as camadas. O `useLoadGraph` pode não preservar todas as configurações do grafo original, sendo necessário às vezes trabalhar diretamente com a API de baixo nível da biblioteca subjacente para ter controle total sobre a configuração do grafo. 