# Resumo do Frontend

## Arquitetura e Estrutura

O frontend é desenvolvido em **React 19** com **Vite** como build tool e segue uma arquitetura baseada em componentes:

```
frontend/src/
├── App.jsx                 # Componente principal da aplicação
├── App.css                 # Estilos globais da aplicação
├── main.jsx                # Ponto de entrada React
├── index.css               # Estilos base
├── components/             # Componentes reutilizáveis
│   ├── VisualizadorDeGrafo/
│   ├── PainelDeDetalhes/
│   ├── ControlesDeExibicao/
│   └── BarraDeBusca/       # **NOVO** - Busca com autocomplete
├── services/               # Serviços de comunicação com API
└── assets/                 # Recursos estáticos
```

## Componentes Principais

### 1. App.jsx - Componente Principal
**Objetivo:** Componente raiz que orquestra toda a aplicação
**Estado Gerenciado:**
- `noSelecionado`: Nó atualmente selecionado pelo usuário
- `controlesVisiveis`: **NOVO** - Controla visibilidade dos controles de simulação
- `painelDetalhesVisivel`: **NOVO** - Controla visibilidade do painel expandido
- `settings`: Configurações de visualização (persistidas no localStorage)

**Funcionalidades:**
- Gerenciamento de estado global da aplicação
- Persistência de configurações no localStorage
- Coordenação entre componentes filhos
- Layout responsivo da interface
- **NOVO** - Controle de visibilidade de painéis
- **NOVO** - Integração com busca de nós

**Configurações Padrão (SETTINGS_INICIAIS):**
- Tamanhos de nós e arestas
- Configurações de simulação física (força, repulsão, etc.)
- Configurações visuais (cores, fontes, etc.)

### 2. components/BarraDeBusca/ - **NOVO COMPONENTE**

#### BarraDeBusca.jsx
**Objetivo:** Sistema de busca com autocomplete para localizar nós específicos
**Funcionalidades:**
- Busca em tempo real por nome (pessoas), razão_social ou nome_fantasia (empresas)
- Autocomplete com sugestões filtradas
- Navegação por teclado (setas, Enter, Escape)
- Seleção visual de sugestões
- **ATUALIZADO** - Integração com filtro de comunidade (não abre painel de detalhes)

**Tipos de Busca Suportados:**
- **Pessoas:** firstname + lastname
- **Empresas:** razao_social e nome_fantasia
- **Advogados:** firstname + lastname

**Estados Gerenciados:**
- `termoBusca`: Texto digitado pelo usuário
- `sugestoes`: Lista de sugestões filtradas
- `mostrarSugestoes`: Controla visibilidade das sugestões
- `indiceSelecionado`: Navegação por teclado

**Métodos Principais:**
- `extrairDadosBusca()`: Extrai dados de busca dos nós do grafo
- `filtrarSugestoes()`: Filtra e ordena sugestões baseadas no termo
- `selecionarSugestao()`: **ATUALIZADO** - Seleciona um nó e filtra sua comunidade
- `handleKeyDown()`: Manipula navegação por teclado

### 3. components/VisualizadorDeGrafo/

#### VisualizadorDeGrafo.jsx
**Objetivo:** Componente wrapper para o visualizador
**Funcionalidade:** Encapsula a lógica de visualização

#### Grafo.jsx - Renderização do Grafo
**Objetivo:** Renderizar o grafo usando react-force-graph-2d
**Funcionalidades:**
- Conversão de dados do Graphology para formato do react-force-graph
- **ATUALIZADO** - Renderização customizada de nós com tamanhos diferenciados
- **NOVO** - Contornos pretos para nós com Instagram
- **NOVO** - Filtro de comunidade baseado em algoritmo de busca em largura
- **NOVO** - Legenda interativa no canto inferior direito
- Configuração de simulação física D3
- Manipulação de eventos de clique
- Aplicação dinâmica de configurações de visualização

**Métodos Principais:**
- `handleNodeClick()`: Processa cliques em nós
- `handleNodeCanvasObject()`: **ATUALIZADO** - Renderização customizada de nós com tamanhos e contornos
- `encontrarComunidade()`: **NOVO** - Algoritmo BFS para encontrar nós conectados
- `Legenda()`: **NOVO** - Componente de legenda visual
- Configuração de forças D3 (charge, link, center, collide)

#### useDadosDoGrafo.js - Hook Customizado
**Objetivo:** Gerenciar carregamento e processamento de dados do grafo
**Funcionalidades:**
- Busca dados da API backend
- Criação de instância Graphology
- **ATUALIZADO** - Sistema de colorização e tamanhos baseado em propriedades dos nós
- **NOVO** - Detecção de Instagram para contornos
- **NOVO** - Atribuição de tamanhos diferenciados
- Prevenção de carregamentos duplicados

**Sistema de Cores e Tamanhos:**
A função `determinarCorDoNo()` implementa a lógica de colorização com hierarquia de prioridades:
1. **Stakeholder=true** → Vermelho (#EF4444/#DC2626) - Prioridade máxima
2. **Label="Empresa"** → Azul (#3B82F6/#1D4ED8)
3. **Label="Pessoa"** → Verde (#10B981/#059669)
4. **Label="Advogado"** → Laranja (#F97316/#EA580C)
5. **Padrão** → Cinza (#9CA3AF/#6B7280) - Para casos não previstos

**NOVO - Sistema de Tamanhos:**
- `determinarTamanhoDoNo()`: Stakeholders são 50% maiores que nós normais
- Tamanho base: 15px, Stakeholders: 22.5px

**NOVO - Sistema de Contornos:**
- `deveTemContornoPreto()`: Detecta nós com Instagram válido
- Contorno preto aplicado para nós com Instagram não nulo e não "Não encontrado"
- Cores mais escuras aplicadas automaticamente para nós com Instagram

**Processo de Carregamento:**
1. Busca dados via `buscarDadosDaRede()`
2. Cria nova instância `Graph` (graphology)
3. **ATUALIZADO** - Adiciona nós com cores, tamanhos e indicadores de Instagram
4. Adiciona arestas ao grafo
5. Retorna instância do grafo processada

**Tratamento de Erros:**
- Validação de nós source/target
- Prevenção de arestas duplicadas
- Logging detalhado para debugging

### 4. components/PainelDeDetalhes/ - **ATUALIZADO**

#### PainelDeDetalhes.jsx
**Objetivo:** Exibir informações detalhadas do nó selecionado
**Funcionalidades Aprimoradas:**
- **NOVO** - Modo expandido com layout modal
- **NOVO** - Formatação inteligente de propriedades
- **NOVO** - Links clicáveis para Instagram
- **NOVO** - Botão de fechar com overlay
- **NOVO** - Design responsivo e moderno

**Modos de Exibição:**
- **Compacto:** Mensagem simples para clicar em um nó
- **Expandido:** Modal com todas as características formatadas

**Formatação Especial de Dados:**
- **CPF/CNPJ:** Formatação com pontos e traços
- **Datas:** Formatação brasileira (DD/MM/AAAA)
- **Valores monetários:** Formatação em R$ com separadores
- **Booleanos:** Sim/Não em português
- **Instagram:** **NOVO** - Links clicáveis com ícone e gradiente

**Sistema de Badges:**
- Identificação visual por tipo de entidade
- Badge especial para Stakeholders
- Cores consistentes com o sistema do grafo

### 5. components/ControlesDeExibicao/ - **SIMPLIFICADO**

#### ControlesDeExibicao.jsx
**Objetivo:** Interface para ajustar configurações de visualização
**Mudanças:**
- **REMOVIDO** - Painel de detalhes dos nós (movido para modal)
- **FOCADO** - Apenas controles de simulação e características visuais
- **MELHORADO** - Interface mais limpa e focada

**Categorias de Controles:**

##### Ajustes da Simulação:
- **Repulsão (Charge):** Força de repulsão entre nós
- **Alcance Repulsão:** Distância máxima da força de repulsão
- **Força Link:** Intensidade da atração entre nós conectados
- **Distância Link:** Distância preferida entre nós conectados
- **Força Central:** Atração para o centro da visualização
- **Raio Colisão:** Raio para evitar sobreposição de nós
- **Decaimento Alpha:** Taxa de resfriamento da simulação
- **Decaimento Velocidade:** Redução da velocidade dos nós

##### Características Visuais:
- **Tamanho do Nó:** Raio dos círculos dos nós
- **Tamanho da Aresta:** Espessura das linhas das arestas

**Funcionalidades:**
- Controles deslizantes (range inputs) para ajustes em tempo real
- Exibição dos valores atuais
- Botão para salvar configurações como padrão
- Aplicação imediata das mudanças na visualização

### 6. services/cliente_api.js - Cliente da API
**Objetivo:** Centralizar comunicação com o backend
**Métodos:**

#### buscarDadosDaRede()
- **Endpoint:** GET `/api/rede`
- **Objetivo:** Buscar todos os nós e arestas do grafo
- **Retorno:** Objeto com arrays `nodes` e `edges`
- **Tratamento de Erros:** Try/catch com logging

## Dependências Principais (package.json)

### Dependências de Produção:
- **react** & **react-dom** (19.1.0) - Biblioteca principal
- **graphology** (0.26.0) - Biblioteca de manipulação de grafos
- **react-force-graph-2d** (1.27.1) - Visualização de grafos 2D
- **d3-force** (3.0.0) - Simulação física

### Dependências de Desenvolvimento:
- **vite** (6.3.5) - Build tool e dev server
- **@vitejs/plugin-react** (4.4.1) - Plugin React para Vite
- **eslint** - Linting de código

## Padrões e Boas Práticas

1. **Hooks Customizados:** Encapsulamento de lógica complexa (useDadosDoGrafo)
2. **Componentes Funcionais:** Uso exclusivo de function components
3. **Estado Local vs Global:** Estado gerenciado no nível apropriado
4. **Memoização:** Uso de useMemo e useCallback para otimização
5. **Separação de Responsabilidades:** Cada componente tem função específica
6. **Tratamento de Erros:** Try/catch consistente com logging
7. **Persistência:** Configurações salvas no localStorage
8. **Responsividade:** Layout adaptável a diferentes tamanhos
9. **Acessibilidade:** **NOVO** - Links com rel="noopener noreferrer", navegação por teclado

## Fluxo de Dados no Frontend

### Carregamento Inicial:
1. **App.jsx** → Renderiza componentes
2. **BarraDeBusca** → **NOVO** - Carrega no header
3. **VisualizadorDeGrafo** → Usa hook useDadosDoGrafo
4. **useDadosDoGrafo** → Chama cliente_api.buscarDadosDaRede()
5. **cliente_api** → Faz requisição HTTP para backend
6. **Hook** → Processa dados, aplica cores e cria instância Graphology
7. **Grafo.jsx** → Renderiza visualização

### Interação do Usuário - Clique em Nó:
1. **Usuário clica em nó** → Grafo.jsx captura evento
2. **Grafo.jsx** → Chama onNodeClick (callback do App.jsx)
3. **App.jsx** → Atualiza estado noSelecionado e painelDetalhesVisivel
4. **PainelDeDetalhes** → **NOVO** - Abre modal expandido com formatação

### **ATUALIZADO** - Interação com Busca:
1. **Usuário digita na busca** → BarraDeBusca filtra sugestões
2. **Usuário seleciona sugestão** → onNodeSelect é chamado
3. **App.jsx** → Atualiza noSelecionado mas **NÃO abre painel de detalhes**
4. **Grafo.jsx** → **NOVO** - Filtra e mostra apenas a comunidade do nó selecionado
5. **Legenda** → **NOVO** - Mostra contador de nós na comunidade
6. **Botão "Mostrar Rede Completa"** → **NOVO** - Aparece para limpar filtro

### **NOVO** - Filtro de Comunidade:
1. **Nó selecionado** → Algoritmo BFS encontra todos os nós conectados
2. **Visualização filtrada** → Mostra apenas nós da comunidade e suas conexões
3. **Legenda atualizada** → Indica quantos nós estão sendo mostrados
4. **Botão de limpeza** → Permite voltar à rede completa

### **NOVO** - Toggle de Controles:
1. **Usuário clica em "Mostrar/Ocultar Controles"** → toggleControles é chamado
2. **App.jsx** → Alterna controlesVisiveis
3. **ControlesDeExibicao** → Mostra/oculta condicionalmente

### Ajuste de Configurações:
1. **Usuário ajusta controle** → ControlesDeExibicao captura mudança
2. **ControlesDeExibicao** → Chama onSettingsChange
3. **App.jsx** → Atualiza estado settings
4. **Grafo.jsx** → Recebe novas settings via props
5. **useEffect** → Aplica mudanças na simulação D3

## Performance e Otimizações

1. **Memoização:** useMemo para conversão de dados pesados
2. **Callbacks Estáveis:** useCallback para evitar re-renders
3. **Carregamento Único:** Ref para prevenir múltiplas chamadas da API
4. **Simulação Eficiente:** Configurações otimizadas do D3-Force
5. **Renderização Customizada:** Canvas para melhor performance visual
6. **Colorização Eficiente:** Cálculo de cores uma única vez durante carregamento
7. **Busca Otimizada:** **NOVO** - Filtros com slice para limitar resultados
8. **Componentes Condicionais:** **NOVO** - Renderização condicional de modais

## Novas Funcionalidades Implementadas

### 1. Sistema de Cores e Tamanhos Inteligente
- **Cores mais visíveis e modernas** com paleta atualizada
- **Stakeholders 50% maiores** para destaque visual
- **Contornos pretos** para nós com Instagram cadastrado
- **Tons diferenciados** (mais escuros) para nós com redes sociais
- **Hierarquia visual clara** baseada em propriedades dos dados

### 2. Legenda Interativa
- **Posicionamento estratégico** no canto inferior direito
- **Explicação completa** de cores por tipo de entidade
- **Indicadores de Instagram** e diferenciação de tamanhos
- **Status da visualização** (rede completa ou comunidade filtrada)
- **Design responsivo** com backdrop blur e sombras

### 3. Filtro de Comunidade Inteligente
- **Algoritmo BFS** para encontrar nós conectados direta ou indiretamente
- **Visualização focada** mostrando apenas subgrafos relevantes
- **Busca integrada** que filtra comunidades ao invés de abrir detalhes
- **Botão de limpeza** para retornar à rede completa
- **Contador dinâmico** de nós na comunidade atual

### 4. Sistema de Busca Inteligente
- **Autocomplete em tempo real** com filtros por tipo de entidade
- **Navegação por teclado** (setas, Enter, Escape)
- **Priorização de resultados** (matches que começam com o termo)
- **Indicadores visuais** de tipo de entidade
- **Integração com filtro de comunidade**

### 5. Painel de Detalhes Expandido
- **Layout modal** com overlay escuro
- **Formatação inteligente** de todas as propriedades
- **Sistema de badges** por tipo de entidade
- **Design responsivo** com scrollbar customizada

### 6. Links Clicáveis para Instagram
- **Detecção automática** de usernames válidos
- **Geração de links** para https://instagram.com/username
- **Design especial** com gradiente do Instagram e ícone
- **Tratamento de casos especiais** ("None", "Não encontrado")

### 7. Interface Reorganizada
- **Controles toggleáveis** com botão estilizado
- **Separação clara** entre busca, visualização e controles
- **Layout mais limpo** sem sobreposição de informações
- **Botões de ação** posicionados estrategicamente

### 8. Melhorias de UX
- **Estados visuais claros** (loading, selecionado, hover)
- **Feedback imediato** para todas as interações
- **Acessibilidade melhorada** com navegação por teclado
- **Design consistente** com gradientes e animações

## Arquitetura Simplificada

A arquitetura do frontend foi aprimorada mantendo a simplicidade com novas funcionalidades:

- **Código Mais Organizado:** Separação clara de responsabilidades
- **Performance Mantida:** Otimizações preservadas mesmo com novas funcionalidades
- **Manutenibilidade Melhorada:** Componentes focados e bem documentados
- **Experiência do Usuário Aprimorada:** Interface mais intuitiva e funcional

## Mudanças de Design Moderno - Janeiro 2025

### 🎨 Redesign Completo da Interface

#### Nova Arquitetura Visual AdminDek-Style
A interface foi completamente redesenhada seguindo padrões modernos de dashboard administrativo:

**Layout Reestruturado:**
- **Sidebar escura lateral**: Navegação principal com ícones e seções organizadas
- **Header moderno**: Três zonas (controles, busca, métricas/usuário)
- **Cards de métricas**: Estatísticas visuais com ícones e hover effects
- **Design responsivo**: Adaptação inteligente para diferentes tamanhos de tela

#### Sistema de Cores Profissional
**Paleta de Cores Atualizada:**
- **Cores primárias**: Azul moderno (#3b82f6, #2563eb, #1d4ed8)
- **Cores neutras**: Escala de cinzas profissional (#f8fafc → #0f172a)
- **Sidebar**: Gradiente escuro (#1e293b → #0f172a)
- **Acentos**: Verde para ações positivas (#10b981), laranja para alertas (#f59e0b)

**Variáveis CSS:**
```css
--primary-500: #3b82f6;
--primary-600: #2563eb;
--gray-50: #f8fafc;
--gray-800: #1e293b;
--gray-900: #0f172a;
```

#### Tipografia Moderna
**Fonte Inter:**
- Importação via Google Fonts
- Pesos: 300, 400, 500, 600, 700
- Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI'
- Melhor legibilidade e profissionalismo

### 🏗️ Componentes Redesenhados

#### 1. App.jsx - Layout Dashboard
**Reestruturação Completa:**
```jsx
<div className="App">
  <aside className="sidebar">
    <div className="sidebar-header">
      <div className="logo">
        <div className="logo-icon">📊</div>
        <div className="logo-text">
          <h2>NetAnalytics</h2>
          <span>Rede Societária</span>
        </div>
      </div>
    </div>
    <nav className="sidebar-nav">
      // Navegação organizada por seções
    </nav>
  </aside>
  
  <div className="main-wrapper">
    <header className="App-header">
      // Header com três zonas
    </header>
    <main className="App-main">
      // Conteúdo principal
    </main>
  </div>
</div>
```

**Estados Adicionados:**
- `sidebarCollapsed`: Controla colapso da sidebar
- Interface mais limpa com toggle states

#### 2. Sidebar de Navegação - **NOVO**
**Características:**
- **Largura**: 280px (expandida), 70px (colapsada)
- **Logo animado**: NetAnalytics com ícone de gráfico
- **Navegação por seções**: "Navegação" e "Ferramentas"
- **Item ativo**: Dashboard com indicador visual
- **Transições suaves**: Animações de 0.3s

**Itens de Navegação:**
- 🏠 Dashboard (ativo)
- 🔍 Análise
- 📈 Relatórios
- ⚙️ Configurações

#### 3. Header Moderno - **REDESIGN**
**Layout de Três Zonas:**

**Header Left:**
- Botão toggle sidebar (☰)
- Título principal e subtítulo
- Design flexível e responsivo

**Header Center:**
- Barra de busca expandida
- Centralizada e destacada
- Máximo 500px de largura

**Header Right:**
- **Cards de métricas** (3 cards com ícones)
- Menu do usuário com avatar
- Alinhamento à direita

**Cards de Métricas - **NOVO**:**
```jsx
<div className="metric-card">
  <div className="metric-value">1,563</div>
  <div className="metric-label">Nós</div>
  <div className="metric-icon blue">👥</div>
</div>
```

#### 4. BarraDeBusca - **REDESIGN**
**Estilos Modernos:**
- **Background**: #f8fafc com transição para white no foco
- **Bordas**: 2px solid #e2e8f0 → #3b82f6 no foco
- **Border radius**: 12px (mais arredondado)
- **Box shadow**: Azul sutil no foco com transform
- **Botão limpar**: Estilizado com hover effects

**Sugestões Melhoradas:**
- **Border left**: Azul no hover/seleção
- **Badges melhorados**: Cores modernas e uppercase
- **Scrollbar customizada**: Consistente com design geral

#### 5. PainelDeDetalhes - **REDESIGN**
**Modal Moderno:**
- **Header**: Gradiente escuro (#1e293b → #334155)
- **Backdrop**: Blur effect com rgba(15, 23, 42, 0.6)
- **Border radius**: 16px
- **Box shadow**: Mais pronunciada (0 25px 50px)
- **Botão fechar**: Estilizado com border e hover

**Badges Redesignados:**
- **Gradientes**: Linear gradients para cada tipo
- **Bordas**: 1px solid com cores complementares
- **Padding**: Mais generoso (8px 16px)
- **Typography**: Uppercase com letter-spacing

**Scrollbar**: Customizada para propriedades container

#### 6. ControlesDeExibicao - **REDESIGN**
**Cards de Configuração:**
- **Background**: #f8fafc para seções
- **Bordas**: #e2e8f0 com border-radius 12px
- **Padding**: Mais generoso (1rem)

**Controles Modernos:**
- **Range sliders**: Thumb com gradiente azul
- **Inputs**: Border focus com box-shadow azul
- **Botão salvar**: Gradiente azul com uppercase e letter-spacing
- **Hover effects**: Transform e box-shadow

### 🎯 Sistema de Design Tokens

#### Cores (CSS Variables)
```css
/* Primárias */
--primary-50: #eff6ff;
--primary-500: #3b82f6;
--primary-600: #2563eb;

/* Neutras */
--gray-50: #f8fafc;
--gray-100: #f1f5f9;
--gray-200: #e2e8f0;
--gray-800: #1e293b;
--gray-900: #0f172a;
```

#### Espaçamentos
- **Padding padrão**: 16px-24px
- **Gaps**: 12px-20px
- **Margens**: 20px-30px
- **Border radius**: 8px-16px

#### Sombras
```css
/* Sutis */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

/* Médias */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

/* Modais */
box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
```

### ✨ Animações e Micro-interações

#### Transições Padrão
```css
transition: all 0.2s ease;
```

#### Hover Effects
- **Transform**: translateY(-1px) para elevação
- **Box shadow**: Aumento da sombra
- **Scale**: 1.05-1.1 para botões pequenos

#### Animações de Entrada
```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 📱 Responsividade Melhorada

#### Breakpoints
- **1200px**: Oculta métricas do header
- **1024px**: Sidebar sempre colapsada
- **768px**: Layout mobile completo

#### Mobile First
- **Sidebar**: Overlay fixo fora da tela
- **Header**: Simplificado sem subtitle
- **Botões**: Reorganizados em linha
- **Controles**: Stack vertical

### 🎨 Melhorias de UX

#### Feedback Visual
- **Estados claros**: Hover, focus, active
- **Loading states**: Preparados para indicadores
- **Error states**: Cores e mensagens apropriadas

#### Acessibilidade
- **Contraste**: WCAG AA compliant
- **Focus indicators**: Visíveis em todos os elementos
- **Keyboard navigation**: Completa e intuitiva
- **Screen readers**: Aria labels apropriados

#### Performance
- **CSS otimizado**: Uso de CSS variables
- **Animações suaves**: Hardware acceleration
- **Lazy loading**: Componentes condicionais
- **Bundle size**: Mantido compacto

### 🔧 Implementação Técnica

#### Estrutura CSS
```
frontend/src/
├── index.css           # Reset global + CSS variables
├── App.css            # Layout principal + componentes
└── components/
    ├── BarraDeBusca.css      # Busca moderna
    ├── PainelDeDetalhes.css  # Modal redesignado
    └── ControlesDeExibicao.css # Controles modernos
```

#### Google Fonts Integration
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

#### Design System
- **Consistência**: Componentes seguem padrões únicos
- **Manutenibilidade**: CSS variables para mudanças globais
- **Escalabilidade**: Estrutura preparada para expansão
- **Profissionalismo**: Visual corporativo e moderno

### 📈 Resultados das Mudanças

#### Antes vs Depois
**Antes:**
- Interface básica com estilos genéricos
- Layout centralizado simples
- Cores primárias (#007bff)
- Componentes dispersos

**Depois:**
- Dashboard profissional estilo AdminDek
- Layout sidebar + header estruturado
- Paleta de cores moderna e consistente
- Componentes organizados e cohesivos

#### Benefícios Alcançados
1. **Visual Profissional**: Aparência de ferramenta enterprise
2. **UX Melhorada**: Navegação mais intuitiva e organizada
3. **Responsividade**: Funciona bem em todos os dispositivos
4. **Manutenibilidade**: Código CSS mais organizado e escalável
5. **Brandização**: Identidade visual própria (NetAnalytics)

### 🚀 Próximos Passos para Design

#### Melhorias Futuras Sugeridas
1. **Dark Mode**: Toggle entre temas claro/escuro
2. **Customização**: Personalização de cores pelo usuário
3. **Animações Avançadas**: Transições entre states
4. **Componentes Adicionais**: Cards, tabelas, formulários
5. **Design System Completo**: Documentação de componentes

#### Considerações de Performance
- **CSS crítico**: Inline para above-the-fold
- **Tree shaking**: Remoção de estilos não utilizados
- **Compression**: Minificação e gzip
- **Caching**: Headers apropriados para assets estáticos

## 🚀 Atualizações de Interação e UX (Janeiro 2025)

### Separação de Estados para Melhor Performance

#### Problema Resolvido
**Antes:** Um único estado (`noSelecionado`) controlava tanto o filtro da comunidade quanto os detalhes do nó, causando reprocessamento desnecessário do gráfico ao clicar nos nós.

**Depois:** Dois estados independentes:
- `noSelecionado` - Controla apenas o filtro da comunidade (busca)
- `noParaDetalhes` - Controla apenas a exibição do painel de detalhes (clique)

#### Implementação Técnica
```javascript
// App.jsx - Estados separados
const [noSelecionado, setNoSelecionado] = useState(null);     // Para filtrar comunidade
const [noParaDetalhes, setNoParaDetalhes] = useState(null);   // Para mostrar detalhes

// Clique apenas abre detalhes - SEM reprocessar gráfico
const handleNodeClick = useCallback((node) => {
  setNoParaDetalhes(node);
  setPainelDetalhesVisivel(true);
}, []);

// Busca filtra comunidade - COM reprocessamento
const handleNodeSelect = useCallback((node) => {
  setNoSelecionado(node);
  setNoParaDetalhes(null);
  setPainelDetalhesVisivel(false);
}, []);
```

#### Benefícios Alcançados
1. **Performance**: Gráfico permanece estático ao clicar nos nós
2. **UX Intuitiva**: Busca filtra, clique apenas mostra detalhes
3. **Responsividade**: Eliminação de lag na interface
4. **Previsibilidade**: Comportamento consistente e esperado

### Sistema de Tooltip Inteligente

#### Funcionalidade Implementada
**Tooltip dinâmico** que aparece ao passar o mouse sobre qualquer nó, mostrando informações contextuais baseadas no tipo:

- **Pessoa/Advogado**: `firstname + lastname`
- **Empresa**: `nome_fantasia` (prioridade) ou `razao_social`
- **Fallback**: `Tipo: ID` para casos não previstos

#### Implementação Técnica
```javascript
// Grafo.jsx - Função para obter texto do tooltip
const obterTextoTooltip = useCallback((node) => {
  const properties = node.properties || {};
  const label = node.label;

  if (label === 'Pessoa' || label === 'Advogado') {
    const nome = `${properties.firstname || ''} ${properties.lastname || ''}`.trim();
    return nome || `${label} sem nome`;
  }

  if (label === 'Empresa') {
    return properties.nome_fantasia || properties.razao_social || 'Empresa sem nome';
  }

  return `${label}: ${node.id}`;
}, []);

// ForceGraph2D - Configuração do tooltip
<ForceGraph2D
  // ... outras props
  nodeLabel={obterTextoTooltip}
/>
```

#### Estilos CSS Customizados
```css
.react-force-graph-tooltip {
  background: rgba(0, 0, 0, 0.9) !important;
  color: white !important;
  padding: 8px 12px !important;
  border-radius: 6px !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  font-family: 'Inter', 'Arial', sans-serif !important;
  border: none !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
  max-width: 250px !important;
  word-wrap: break-word !important;
  z-index: 1000 !important;
  pointer-events: none !important;
}
```

#### Benefícios do Tooltip
1. **Identificação Rápida**: Nome visível sem precisar clicar
2. **UX Melhorada**: Feedback imediato ao hover
3. **Performance**: Renderizado nativamente pela biblioteca
4. **Design Consistente**: Tema escuro alinhado com a interface
5. **Responsivo**: Quebra de linha automática para nomes longos

### Fluxo de Interação Otimizado

#### Comportamento Final
```
1. 🔍 Buscar nó → Filtra comunidade (reprocessa gráfico)
2. 🖱️ Hover no nó → Mostra tooltip com nome (sem reprocessar)
3. 👆 Clicar no nó → Abre painel de detalhes (gráfico fica estático)
4. ❌ Fechar painel → Mantém filtro da comunidade (gráfico estático)
5. 🔄 "Mostrar Rede Completa" → Remove filtro (reprocessa gráfico)
```

#### Estados da Aplicação
```javascript
// Estado 1: Sem filtro, sem detalhes
noSelecionado: null
noParaDetalhes: null
painelDetalhesVisivel: false

// Estado 2: Com filtro da busca, sem detalhes
noSelecionado: { id: "node123", ... }
noParaDetalhes: null
painelDetalhesVisivel: false

// Estado 3: Com filtro da busca, com detalhes de nó clicado
noSelecionado: { id: "node123", ... }      // Filtro mantido
noParaDetalhes: { id: "node456", ... }     // Detalhes independentes
painelDetalhesVisivel: true
```

### Impacto nas Funcionalidades Existentes

#### Componentes Afetados
1. **App.jsx**: Lógica de estado separada
2. **Grafo.jsx**: Simplificação do useEffect de filtro + tooltip
3. **PainelDeDetalhes.jsx**: Recebe `noParaDetalhes` em vez de `noSelecionado`
4. **App.css**: Estilos do tooltip adicionados

#### Funcionalidades Preservadas
✅ **Busca com autocomplete** - Funciona normalmente  
✅ **Filtro de comunidade** - Continua funcionando pela busca  
✅ **Painel de detalhes** - Funciona independentemente  
✅ **Controles de visualização** - Inalterados  
✅ **Sistema de cores** - Inalterado  
✅ **Legenda interativa** - Atualiza normalmente  

#### Novas Funcionalidades
🆕 **Tooltip inteligente** - Identificação rápida de nós  
🆕 **Gráfico estático** - Performance melhorada  
🆕 **Estados independentes** - Lógica mais clara  

### Arquitetura de Estados Melhorada

#### Responsabilidades Claramente Definidas
```javascript
// noSelecionado - APENAS para filtro de comunidade
- Setado por: handleNodeSelect (busca)
- Usado por: useEffect no Grafo.jsx para filtrar comunidade
- Limpo por: limparFiltro()

// noParaDetalhes - APENAS para detalhes do painel
- Setado por: handleNodeClick (clique no nó)
- Usado por: PainelDeDetalhes para mostrar informações
- Limpo por: closePainelDetalhes()

// painelDetalhesVisivel - Controla visibilidade do modal
- Setado por: handleNodeClick (true)
- Limpo por: closePainelDetalhes (false)
```

#### Benefícios Arquiteturais
1. **Separação de Responsabilidades**: Cada estado tem função específica
2. **Manutenibilidade**: Lógica mais clara e fácil de debugar
3. **Escalabilidade**: Fácil adicionar novos tipos de filtros
4. **Performance**: Evita re-renders desnecessários
5. **Testabilidade**: Estados independentes são mais fáceis de testar

---

*Frontend atualizado em: Janeiro 2025*  
*Inclui: Separação de estados, tooltip inteligente, performance melhorada* 