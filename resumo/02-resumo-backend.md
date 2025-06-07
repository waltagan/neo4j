# Resumo do Backend

## Arquitetura e Estrutura

O backend é desenvolvido em **Python** usando **FastAPI** e segue uma arquitetura em camadas bem definida:

```
backend/
├── main.py                 # Ponto de entrada da aplicação
├── requirements.txt        # Dependências do projeto
├── app/
│   ├── api/               # Camada de API/Rotas
│   ├── services/          # Camada de Serviços/Lógica de Negócio
│   ├── models/            # Modelos de Dados (Pydantic)
│   ├── db/                # Camada de Acesso a Dados
│   └── core/              # Configurações Centrais
```

## Componentes Principais

### 1. main.py - Aplicação Principal
**Objetivo:** Ponto de entrada da aplicação FastAPI
**Funcionalidades:**
- Configuração da aplicação FastAPI com metadados
- Configuração do middleware CORS para permitir requisições do frontend
- Inclusão das rotas da API
- Endpoint raiz para verificação de status

### 2. app/api/rotas_do_grafo.py - Rotas da API
**Objetivo:** Definir os endpoints REST da aplicação
**Métodos disponíveis:**

#### GET /api/rede
- **Objetivo:** Obter todos os nós e relacionamentos do grafo
- **Retorno:** Objeto Grafo com nós e arestas
- **Modelo de Resposta:** `Grafo`
- **Tratamento de Erros:** HTTPException com status 500 em caso de falha

### 3. app/services/servico_do_grafo.py - Lógica de Negócio
**Objetivo:** Implementar a lógica de negócio para manipulação de grafos

#### Métodos Principais:

##### obter_rede_completa()
- **Objetivo:** Buscar todos os nós e relacionamentos do Neo4j
- **Query Cypher:** `MATCH (n)-[r]->(m) RETURN n, r, m`
- **Processamento:** Transforma dados do Neo4j para formato JSON
- **Retorno:** Dicionário com arrays de "nodes" e "edges"

##### Métodos Auxiliares:
- `_transformar_para_json()`: Converte registros Neo4j para JSON
- `_formatar_no()`: Formata nós para estrutura esperada pelo frontend
- `_formatar_aresta()`: Formata arestas para estrutura esperada pelo frontend

### 4. app/db/conector_neo4j.py - Conexão com Banco
**Objetivo:** Gerenciar conexão com banco de dados Neo4j

#### Funcionalidades:
- **Inicialização:** Carrega variáveis de ambiente (.env) e cria driver Neo4j
- **get_session():** Retorna nova sessão para execução de queries
- **close():** Fecha conexão com o banco
- **testar_conexao():** Verifica conectividade e credenciais

#### Configuração:
- Utiliza variáveis de ambiente: `NEO4J_URI`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`
- Tratamento de erros específicos (autenticação, conectividade)

### 5. app/models/modelos_do_grafo.py - Modelos de Dados
**Objetivo:** Definir estruturas de dados usando Pydantic

#### Modelos Definidos:

##### No (BaseModel)
- `id: str` - Identificador único
- `label: str` - Rótulo do nó
- `properties: Dict[str, Any]` - Propriedades adicionais

##### Aresta (BaseModel)
- `id: str` - Identificador único
- `source: str` - ID do nó de origem
- `target: str` - ID do nó de destino
- `label: str` - Tipo/rótulo da aresta
- `properties: Dict[str, Any]` - Propriedades adicionais

##### Grafo (BaseModel)
- `nodes: List[No]` - Lista de nós
- `edges: List[Aresta]` - Lista de arestas

### 6. app/db/explore_schema.py - Exploração de Schema
**Objetivo:** Ferramenta para explorar e entender a estrutura do banco Neo4j
**Funcionalidades:**
- Listar labels de nós
- Listar tipos de relacionamentos
- Explorar propriedades
- Análise estatística do grafo

## Dependências (requirements.txt)

- **fastapi** - Framework web principal
- **uvicorn[standard]** - Servidor ASGI
- **python-dotenv** - Gerenciamento de variáveis de ambiente
- **neo4j** - Driver oficial do Neo4j

## Padrões e Boas Práticas

1. **Separação de Responsabilidades:** Cada camada tem responsabilidade específica
2. **Tratamento de Erros:** Uso consistente de try/catch e HTTPException
3. **Validação de Dados:** Uso do Pydantic para validação automática
4. **Configuração Externa:** Uso de variáveis de ambiente
5. **Logging:** Mensagens informativas para debugging
6. **Testes Integrados:** Blocos de teste nos próprios módulos
7. **Documentação Automática:** FastAPI gera documentação Swagger automaticamente

## Fluxo de Dados no Backend

1. **Requisição HTTP** → Rota FastAPI
2. **Rota** → Chama método do Serviço
3. **Serviço** → Usa Conector para acessar Neo4j
4. **Neo4j** → Retorna dados brutos
5. **Serviço** → Transforma dados para formato JSON
6. **Rota** → Valida com modelo Pydantic
7. **FastAPI** → Retorna resposta HTTP formatada

## Arquitetura Simplificada

A arquitetura atual foi simplificada para focar na funcionalidade principal de visualização da rede, removendo complexidades desnecessárias como processamento de comunidades. Isso resulta em:

- **Melhor Performance:** Menos processamento no backend
- **Código Mais Limpo:** Menos dependências e complexidade
- **Manutenibilidade:** Arquitetura mais direta e fácil de entender
- **Escalabilidade:** Foco nas funcionalidades essenciais 