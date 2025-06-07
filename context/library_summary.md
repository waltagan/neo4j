# Resumo das Bibliotecas e Tecnologias

Este documento fornece um resumo das principais bibliotecas e tecnologias definidas para o desenvolvimento da aplicação de visualização de rede societária.

---

### Backend

**1. Python**
- **Descrição:** Uma linguagem de programação de alto nível, conhecida por sua sintaxe clara e vasto ecossistema de bibliotecas, especialmente para ciência de dados e backend.
- **Uso:** Servirá como a base para a nossa API.

**2. FastAPI**
- **Descrição:** Um framework web moderno e de alta performance para Python, baseado em type hints. Ele gera documentação de API interativa (Swagger UI/ReDoc) automaticamente e oferece validação de dados robusta com Pydantic.
- **Uso:** Estruturar nosso servidor backend. Sua natureza assíncrona é ideal para lidar com I/O de banco de dados, como as consultas ao Neo4j. Definiremos os endpoints (ex: `/api/network`) e a lógica de negócios aqui, aproveitando a injeção de dependências para gerenciar a conexão com o banco de dados.

**3. Neo4j Driver (`neo4j`)**
- **Descrição:** A biblioteca oficial do Neo4j para Python. Ela permite a conexão segura com o banco de dados, execução de consultas Cypher, gerenciamento de transações e o processamento eficiente dos resultados.
- **Uso:** Executar todas as consultas Cypher a partir da nossa API FastAPI, incluindo a busca de dados da rede e a orquestração das chamadas para os algoritmos do GDS.

---

### Frontend

**1. React**
- **Descrição:** Uma biblioteca JavaScript para construir interfaces de usuário, mantida pelo Facebook. Utiliza um modelo de componentes, permitindo a criação de UIs complexas a partir de peças isoladas e reutilizáveis.
- **Uso:** Será a base da nossa aplicação frontend. Usaremos componentes React para estruturar a aplicação em partes lógicas: o visualizador do grafo, o painel de filtros, a exibição de detalhes do nó, etc. O gerenciamento de estado será feito com React Hooks (`useState`, `useEffect`, `useContext`) para controlar as interações do usuário e os dados da aplicação.

**2. Sigma.js**
- **Descrição:** Uma biblioteca de visualização de grafos focada em performance e customização, que utiliza WebGL para renderização. É ideal para exibir redes grandes e complexas de forma fluida e interativa.
- **Uso:** Será a principal ferramenta para renderizar a rede societária. Vamos encapsulá-la dentro de um componente React dedicado. Este componente será responsável por inicializar o Sigma.js, carregar os dados da rede (recebidos via API), e aplicar o layout de força ForceAtlas2. A comunicação entre React e Sigma.js permitirá que interações na visualização (ex: clique em um nó) atualizem o estado do React para exibir informações em outros componentes, e que mudanças no estado do React (ex: aplicação de um filtro) atualizem a visualização do Sigma.js.

---

### Banco de Dados

**1. Neo4j Graph Database**
- **Descrição:** O banco de dados de grafo que armazena os dados da rede societária. É o coração da nossa aplicação.
- **Uso:** Persistência e consulta dos dados de empresas, pessoas, advogados e seus relacionamentos.

**2. Neo4j Graph Data Science (GDS)**
- **Descrição:** Uma biblioteca para o Neo4j que fornece algoritmos de grafos otimizados para serem executados em escala.
- **Uso:** Especificamente para o algoritmo de detecção de comunidade **Louvain**, conforme requisito do PRD. A execução será orquestrada pelo nosso backend FastAPI, que enviará a consulta Cypher apropriada para o GDS. 