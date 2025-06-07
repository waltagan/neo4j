# Resumo Geral da Aplicação

## Visão Geral

Esta é uma aplicação de **Visualização de Rede Societária** que permite visualizar e analisar redes de empresas e sócios através de grafos interativos. A aplicação é composta por um backend em Python (FastAPI) conectado a um banco de dados Neo4j e um frontend em React.

## Arquitetura da Aplicação

### Stack Tecnológica

**Backend:**
- **FastAPI** - Framework web Python para APIs REST
- **Neo4j** - Banco de dados de grafos
- **Python-dotenv** - Gerenciamento de variáveis de ambiente
- **Uvicorn** - Servidor ASGI para FastAPI

**Frontend:**
- **React 19** - Biblioteca JavaScript para interfaces de usuário
- **Vite** - Build tool e servidor de desenvolvimento
- **Graphology** - Biblioteca para manipulação de grafos
- **React-Force-Graph-2D** - Componente para visualização de grafos
- **D3-Force** - Algoritmos de simulação física para grafos

## Funcionalidades Principais

1. **Visualização Interativa de Grafos**
   - Renderização de nós e arestas representando empresas e relacionamentos
   - Interação através de cliques nos nós
   - Simulação física com forças configuráveis
   - **NOVO:** Filtro de comunidade para visualizar subgrafos conectados

2. **Sistema de Cores e Tamanhos Inteligente**
   - Colorização automática baseada nas propriedades dos nós
   - **Stakeholders** (stakeholder=true) → Vermelho (#EF4444/#DC2626) - **50% maiores**
   - **Empresas** (label="Empresa") → Azul (#3B82F6/#1D4ED8)
   - **Pessoas** (label="Pessoa") → Verde (#10B981/#059669)
   - **Advogados** (label="Advogado") → Laranja (#F97316/#EA580C)
   - **Indicador Instagram:** Contorno preto para nós com Instagram cadastrado
   - **Tons diferenciados:** Cores mais escuras para entidades com Instagram
   - Hierarquia de prioridades para identificação visual clara

3. **Busca e Navegação Avançada**
   - Busca em tempo real com autocomplete
   - **NOVO:** Visualização de comunidade ao selecionar nó da busca
   - **NOVO:** Botão para limpar filtro e retornar à rede completa
   - Seleção inteligente que mostra apenas nós conectados

4. **Controles de Visualização**
   - Ajustes em tempo real da simulação física
   - Configuração de aparência dos nós e arestas
   - Persistência de configurações no localStorage
   - Interface toggle para ocultar/mostrar controles

5. **Painel de Detalhes**
   - Exibição de informações detalhadas dos nós selecionados
   - Interface responsiva e intuitiva
   - Links clicáveis para Instagram
   - Formatação inteligente de dados (CPF, CNPJ, datas, valores)

6. **Legenda Interativa**
   - **NOVO:** Legenda visual na parte inferior direita
   - Explicação de cores por tipo de entidade
   - Indicadores de Instagram e tamanhos
   - Status da visualização atual (comunidade filtrada)

## Estrutura de Dados

A aplicação trabalha com dados de rede societária onde:
- **Nós** representam entidades (empresas, pessoas, advogados, etc.)
- **Arestas** representam relacionamentos entre as entidades
- Cada nó e aresta possui propriedades específicas armazenadas no Neo4j
- As cores e tamanhos dos nós são determinados pelas propriedades `stakeholder`, `label` e `instagram`
- **Comunidades** são identificadas através de algoritmos de busca em largura

## Padrões de Desenvolvimento

- **Arquitetura em Camadas** no backend (API, Services, Models, DB)
- **Hooks Customizados** no frontend para gerenciamento de estado
- **Componentes Reutilizáveis** com responsabilidades bem definidas
- **Separação de Responsabilidades** entre visualização e lógica de negócio
- **Configuração Centralizadas** através de arquivos de ambiente
- **Algoritmos de Grafo** para análise de comunidades e conectividade

## Objetivo da Aplicação

A aplicação tem como objetivo facilitar a análise de redes societárias complexas, permitindo:
- Identificação visual de padrões e relacionamentos
- Classificação visual por tipos de entidades (stakeholders, empresas, pessoas, advogados)
- **Análise focada de comunidades** conectadas a entidades específicas
- **Identificação de presença digital** através de indicadores de Instagram
- Exploração interativa de grandes volumes de dados relacionais
- Configuração personalizada da visualização para diferentes casos de uso 