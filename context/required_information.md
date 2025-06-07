# Status das Informações para o Desenvolvimento

Este documento acompanha o status das informações necessárias para o desenvolvimento.

---

### 1. Acesso e Detalhes do Banco de Dados Neo4j

- **Credenciais de Acesso:** <span style="color:green;font-weight:bold;">OBTIDO</span>
  - **URI:** `neo4j+s://f2c681cc.databases.neo4j.io`
  - **Usuário:** `neo4j`
  - **Senha:** Fornecida e configurada em ambiente local (arquivo `.env`).

- **Versão do Neo4j:** <span style="color:orange;font-weight:bold;">PENDENTE</span>
  - **Observação:** Sendo uma instância AuraDB, a versão é gerenciada pela Neo4j e geralmente é uma das mais recentes. Isso não deve ser um bloqueio, mas é bom confirmar.

- **Acesso ao Neo4j GDS:** <span style="color:orange;font-weight:bold;">PENDENTE</span>
  - **Observação:** Instâncias AuraDB geralmente vêm com o GDS pré-instalado. Precisamos confirmar a disponibilidade e a versão ao conectar.

### 2. Especificação do Schema de Dados

- **Modelo de Dados Detalhado:** <span style="color:green;font-weight:bold;">DEFINIDO</span>
  - O arquivo `context/neo4j_sample_data.md` contém um modelo de dados inicial com labels (`Empresa`, `Pessoa`, `Advogado`), relacionamentos e propriedades. Este modelo será usado como base.

### 3. Definições de Tecnologia (Stack)

- **Backend:** <span style="color:green;font-weight:bold;">DEFINIDO</span>
  - **Stack:** Python com FastAPI.

- **Frontend:** <span style="color:green;font-weight:bold;">DEFINIDO</span>
  - **Stack:** React com a biblioteca Sigma.js para visualização.

### 4. Requisitos de Performance

- **Limites Aceitáveis:** <span style="color:orange;font-weight:bold;">PENDENTE</span>
  - Qual é o tempo de carregamento inicial considerado aceitável para a rede (ex: < 5 segundos)?
  - Qual é o número esperado de nós e arestas que a aplicação deve suportar de forma fluida?

Com estas informações, a equipe de desenvolvimento poderá tomar decisões mais precisas sobre a arquitetura, as bibliotecas a serem utilizadas e as estratégias de otimização, reduzindo riscos e garantindo que o produto final atenda às expectativas. 