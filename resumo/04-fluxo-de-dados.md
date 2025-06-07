# Fluxo de Dados da Aplicação

## Visão Geral do Fluxo

A aplicação segue um fluxo de dados unidirecional, onde o backend serve como fonte única de verdade para os dados do grafo, e o frontend processa e visualiza essas informações com colorização baseada nas propriedades dos nós.

## 1. Fluxo de Inicialização da Aplicação

### Sequência de Carregamento:

```
1. Usuário acessa aplicação
   ↓
2. React renderiza App.jsx
   ↓
3. App.jsx renderiza VisualizadorDeGrafo
   ↓
4. VisualizadorDeGrafo usa hook useDadosDoGrafo
   ↓
5. useDadosDoGrafo executa buscarDadosDaRede()
   ↓
6. cliente_api faz GET /api/rede
   ↓
7. Backend (rotas_do_grafo.py) recebe requisição
   ↓
8. Rota chama ServicoDoGrafo.obter_rede_completa()
   ↓
9. Serviço executa query Cypher no Neo4j
   ↓
10. Neo4j retorna nós e relacionamentos
    ↓
11. Serviço transforma dados para JSON
    ↓
12. API retorna dados formatados
    ↓
13. Frontend recebe dados e cria instância Graphology
    ↓
14. Hook aplica sistema de cores baseado em propriedades
    ↓
15. Grafo.jsx renderiza visualização
```

### Detalhamento por Camada:

#### Backend (Neo4j → API):
1. **Neo4j Database**
   - Armazena nós e relacionamentos da rede societária
   - Estrutura: `(nó)-[relacionamento]->(nó)`
   - Nós contêm propriedades como `stakeholder` e `label`

2. **ConectorNeo4j**
   - Estabelece conexão com banco
   - Gerencia sessões e transações

3. **ServicoDoGrafo**
   - Executa query: `MATCH (n)-[r]->(m) RETURN n, r, m`
   - Transforma registros Neo4j em estrutura JSON
   - Formata nós: `{id, label, properties}`
   - Formata arestas: `{id, source, target, label, properties}`

4. **API FastAPI**
   - Valida dados com modelos Pydantic
   - Retorna JSON estruturado

#### Frontend (API → Visualização):
1. **cliente_api.js**
   - Faz requisição HTTP para backend
   - Trata erros de rede

2. **useDadosDoGrafo Hook**
   - Recebe dados da API
   - Cria instância Graph (graphology)
   - Adiciona nós e arestas ao grafo
   - Aplica função `determinarCorDoNo()` para colorização
   - Atribui cores baseadas em propriedades dos nós

3. **Grafo.jsx**
   - Converte Graphology para formato react-force-graph
   - Renderiza visualização com D3-Force

## 2. Fluxo de Colorização Baseada em Propriedades

### Sistema de Cores Inteligente:

```
1. useDadosDoGrafo recebe dados da API
   ↓
2. Para cada nó, executa determinarCorDoNo()
   ↓
3. Verifica hierarquia de propriedades:
   - stakeholder=true → Vermelho (#EF4444/#DC2626) com tamanho 50% maior
   - label="Empresa" → Azul (#3B82F6/#1D4ED8)
   - label="Pessoa" → Verde (#10B981/#059669)
   - label="Advogado" → Laranja (#F97316/#EA580C)
   - Padrão → Cinza (#9CA3AF/#6B7280)
   ↓
4. **NOVO** - Verifica Instagram para contornos e tons:
   - Instagram válido → Cor mais escura + contorno preto
   - Sem Instagram → Cor padrão sem contorno
   ↓
5. **NOVO** - Determina tamanho do nó:
   - Stakeholder → 1.5x o tamanho base (22.5px)
   - Outros → Tamanho base (15px)
   ↓
6. Atribui cor, tamanho e indicador de contorno ao nó no grafo
   ↓
7. Visualização renderiza nós com diferenciações visuais apropriadas
```

### Lógica de Prioridade Atualizada:
A colorização segue uma hierarquia clara onde:
- **Stakeholder** tem prioridade máxima (sempre vermelho) e **50% maior**
- **Instagram válido** aplica cor mais escura e **contorno preto**
- **Tipo de entidade** (label) determina cor base
- **Cor padrão** para casos não cobertos

### **NOVO** - Sistema de Tamanhos e Contornos:
```
determinarTamanhoDoNo(no, tamanhoBase):
  if (stakeholder === true) return tamanhoBase * 1.5
  else return tamanhoBase

deveTemContornoPreto(no):
  return instagram !== null && 
         instagram !== "Não encontrado"
```

## 3. Fluxo de Interação do Usuário

### Seleção de Nó (Clique Direto):

```
1. Usuário clica em nó na visualização
   ↓
2. react-force-graph-2d captura evento
   ↓
3. Grafo.jsx executa handleNodeClick()
   ↓
4. Callback onNodeClick é chamado (props do App.jsx)
   ↓
5. App.jsx atualiza estado noSelecionado e painelDetalhesVisivel
   ↓
6. PainelDeDetalhes re-renderiza com dados do nó
   ↓
7. Usuário vê detalhes do nó selecionado
```

### **NOVO** - Seleção via Busca (Filtro de Comunidade):

```
1. Usuário digita na BarraDeBusca
   ↓
2. BarraDeBusca filtra sugestões em tempo real
   ↓
3. Usuário seleciona sugestão → onNodeSelect é chamado
   ↓
4. App.jsx atualiza noSelecionado mas NÃO abre painel
   ↓
5. Grafo.jsx recebe noSelecionado via props
   ↓
6. useEffect detecta mudança → executa encontrarComunidade()
   ↓
7. Algoritmo BFS encontra todos os nós conectados
   ↓
8. setComunidadeFiltrada atualiza estado local
   ↓
9. useMemo re-executa → filtra nodes e links
   ↓
10. Visualização mostra apenas subgrafo da comunidade
    ↓
11. Legenda atualiza com contador de nós
    ↓
12. Botão "Mostrar Rede Completa" aparece
```

### **NOVO** - Algoritmo de Comunidade (BFS):

```
encontrarComunidade(grafo, nodeId):
  1. Inicializa: visitados = Set(), fila = [nodeId], comunidade = Set()
     ↓
  2. Enquanto fila não vazia:
     a. Remove primeiro nó da fila
     b. Se já visitado, continua
     c. Marca como visitado e adiciona à comunidade
     d. Para cada vizinho não visitado: adiciona à fila
     ↓
  3. Retorna Set com IDs de todos os nós conectados
```

### Ajuste de Configurações:

```
1. Usuário move slider em ControlesDeExibicao
   ↓
2. onChange captura mudança de valor
   ↓
3. handleSettingChange atualiza configuração específica
   ↓
4. onSettingsChange callback é chamado (props do App.jsx)
   ↓
5. App.jsx atualiza estado settings
   ↓
6. Grafo.jsx recebe novas settings via props
   ↓
7. useEffect detecta mudança em settings
   ↓
8. Forças D3 são reconfiguradas
   ↓
9. Simulação é reaquecida (d3ReheatSimulation)
   ↓
10. Visualização se adapta às novas configurações
```

## 4. Fluxo de Persistência de Configurações

### Salvamento:

```
1. Usuário ajusta configurações
   ↓
2. Estado settings é atualizado em App.jsx
   ↓
3. Usuário clica "Salvar como Padrão"
   ↓
4. handleSaveDefaultSettings é executado
   ↓
5. JSON.stringify(settings) é salvo no localStorage
   ↓
6. Chave: 'visualizador-grafo-settings'
```

### Carregamento:

```
1. App.jsx é inicializado
   ↓
2. useState(() => {...}) executa função de inicialização
   ↓
3. localStorage.getItem('visualizador-grafo-settings')
   ↓
4. Se existe: JSON.parse() e usa configurações salvas
   ↓
5. Se não existe: usa SETTINGS_INICIAIS
   ↓
6. Estado settings é inicializado
```

## 5. Estrutura de Dados em Trânsito

### Formato Backend → Frontend (GET /api/rede):
```json
{
  "nodes": [
    {
      "id": "elemento_id_neo4j",
      "label": "Empresa|Pessoa|Advogado",
      "properties": {
        "nome": "Nome da Entidade",
        "stakeholder": true,
        "outros_atributos": "valores"
      }
    }
  ],
  "edges": [
    {
      "id": "elemento_id_aresta",
      "source": "id_no_origem",
      "target": "id_no_destino", 
      "label": "TIPO_RELACIONAMENTO",
      "properties": {
        "atributos_relacionamento": "valores"
      }
    }
  ]
}
```

### Formato Graphology (Interno Frontend):
```javascript
// Nós
grafo.addNode(nodeId, {
  id: "elemento_id",
  label: "TipoDoNo", 
  properties: {
    stakeholder: true,
    nome: "Nome",
    instagram: "@usuario"
  },
  color: "#DC2626",         // Determinado por propriedades e Instagram
  size: 22.5,              // NOVO: 50% maior para stakeholders
  hasInstagram: true       // NOVO: Indica se deve ter contorno preto
});

// Arestas  
grafo.addEdgeWithKey(edgeId, sourceId, targetId, {
  id: "elemento_id",
  label: "TIPO_RELACIONAMENTO",
  properties: {...},
  size: 1,
  color: "#CCCCCC"
});
```

### Formato react-force-graph (Renderização):
```javascript
{
  nodes: [
    {
      id: "node_id",
      // ... todos os atributos do nó
      color: "#DC2626",       // Cor baseada em propriedades e Instagram
      size: 22.5,            // NOVO: Tamanho diferenciado
      hasInstagram: true,    // NOVO: Indica contorno preto
      x: 100,               // Posição calculada pela simulação
      y: 200,               // Posição calculada pela simulação
      vx: 0.1,              // Velocidade X
      vy: -0.2              // Velocidade Y
    }
  ],
  links: [
    {
      source: "source_node_id",  // ou objeto do nó
      target: "target_node_id",  // ou objeto do nó
      // ... outros atributos da aresta
    }
  ]
}
```

## 6. Tratamento de Erros no Fluxo

### Erros de Conexão:
- **Backend:** ConectorNeo4j trata erros de autenticação e conectividade
- **Frontend:** cliente_api.js captura erros HTTP e de rede

### Erros de Dados:
- **Backend:** Validação com Pydantic, HTTPException para erros
- **Frontend:** Validação de nós source/target, prevenção de arestas duplicadas

### Erros de Estado:
- **Frontend:** Verificações de nulidade, estados de carregamento
- **Logging:** Console.log detalhado para debugging

## 7. Performance e Otimizações no Fluxo

### Prevenção de Carregamentos Duplicados:
- `useRef(carregamentoEmAndamento)` no hook
- Verificação antes de nova requisição

### Memoização:
- `useMemo` para conversão de dados pesados
- `useCallback` para callbacks estáveis
- **NOVO:** `useMemo` para filtro de comunidade (recalcula apenas quando necessário)

### Colorização e Renderização Eficiente:
- Cálculo de cores, tamanhos e contornos uma única vez durante carregamento
- Lógica simples baseada em propriedades sem processamento complexo
- **NOVO:** Renderização customizada com canvas para contornos Instagram

### **NOVO** - Otimizações de Filtro de Comunidade:
- **Algoritmo BFS eficiente:** Usa Set e Queue para performance O(V+E)
- **Filtro lazy:** useMemo só recalcula quando comunidadeFiltrada muda
- **Redução de dados:** Renderiza apenas subgrafo relevante
- **Estados locais:** comunidadeFiltrada gerenciado no componente Grafo

### **NOVO** - Otimizações de Busca:
- **Filtragem eficiente:** slice(0, 10) limita resultados
- **Priorização inteligente:** startsWith() primeiro, depois includes()
- **Estados reativos:** useEffect otimizado para mudanças de termo

### Simulação Eficiente:
- Configurações otimizadas do D3-Force
- Reaquecimento controlado da simulação

## 8. Arquitetura Aprimorada

A adição das novas funcionalidades manteve o fluxo direto com melhorias:

- **Complexidade Controlada:** Algoritmos eficientes sem impacto na performance
- **Performance Melhorada:** Filtros otimizados e renderização customizada
- **Manutenibilidade Preservada:** Separação clara de responsabilidades
- **Clareza Visual Aumentada:** Sistema visual mais rico e informativo
- **Funcionalidades Avançadas:** Busca inteligente e análise de comunidades 