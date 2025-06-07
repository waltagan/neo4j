# Documentação da Aplicação de Visualização de Rede Societária

## Índice dos Documentos

Esta pasta contém a documentação completa da aplicação, organizada em arquivos temáticos:

### 📋 [01 - Resumo Geral](./01-resumo-geral.md)
**Visão geral da aplicação**
- Arquitetura da aplicação
- Stack tecnológica (Backend e Frontend)
- Funcionalidades principais
- Estrutura de dados
- Padrões de desenvolvimento
- Objetivos da aplicação

### 🔧 [02 - Resumo do Backend](./02-resumo-backend.md)
**Análise detalhada do backend**
- Estrutura em camadas (API, Services, Models, DB)
- Componentes principais e suas responsabilidades
- Endpoints da API REST
- Lógica de negócio e algoritmos
- Conexão com Neo4j
- Modelos de dados (Pydantic)
- Padrões e boas práticas

### 🎨 [03 - Resumo do Frontend](./03-resumo-frontend.md)
**Análise detalhada do frontend**
- Arquitetura baseada em componentes React
- Componentes principais e funcionalidades
- Hooks customizados
- Gerenciamento de estado
- Visualização de grafos
- Controles de interface
- Dependências e bibliotecas
- Performance e otimizações
- **NOVO** - Design moderno estilo AdminDek

### 🔄 [04 - Fluxo de Dados](./04-fluxo-de-dados.md)
**Fluxo completo de dados na aplicação**
- Inicialização da aplicação
- Comunicação Backend ↔ Frontend
- Processamento de dados do grafo
- Colorização baseada em propriedades
- Persistência de configurações
- Estruturas de dados em trânsito
- Tratamento de erros
- Otimizações de performance

### 👤 [05 - Fluxo do Usuário](./05-fluxo-do-usuario.md)
**Jornada completa do usuário**
- Acesso inicial e primeira experiência
- Exploração básica do grafo
- Interação com nós e visualização de detalhes
- Personalização da visualização
- Análise visual por tipos de entidades
- Fluxos de uso avançados
- Padrões de comportamento
- Casos de uso típicos

## Como Usar Esta Documentação

### Para Desenvolvedores:
1. Comece com o **Resumo Geral** para entender a arquitetura
2. Leia o **Resumo do Backend** ou **Frontend** conforme sua área
3. Consulte o **Fluxo de Dados** para entender as integrações

### Para Product Managers:
1. Leia o **Resumo Geral** para visão estratégica
2. Foque no **Fluxo do Usuário** para entender a experiência
3. Use os casos de uso para planejamento de features

### Para Designers/UX:
1. Comece com o **Fluxo do Usuário**
2. Consulte o **Resumo do Frontend** para entender componentes
3. Analise pontos de fricção e oportunidades de melhoria

### Para Analistas de Negócio:
1. Foque no **Resumo Geral** e **Fluxo do Usuário**
2. Estude os casos de uso típicos
3. Identifique oportunidades de expansão

## Tecnologias Principais

### Backend:
- **FastAPI** - Framework web Python
- **Neo4j** - Banco de dados de grafos
- **Pydantic** - Validação de dados
- **Uvicorn** - Servidor ASGI

### Frontend:
- **React 19** - Biblioteca de interface
- **Vite** - Build tool
- **Graphology** - Manipulação de grafos
- **D3-Force** - Simulação física
- **React-Force-Graph-2D** - Visualização

### Visualização:
- **Force-directed layout** - Posicionamento de nós
- **Colorização por propriedades** - Identificação visual de tipos de entidades

## Funcionalidades Principais

1. **Visualização Interativa de Grafos**
   - Renderização de nós e arestas representando empresas e relacionamentos
   - Interação através de cliques nos nós
   - Simulação física com forças configuráveis

2. **Sistema de Cores Inteligente**
   - **Stakeholders** (stakeholder=true) → Vermelho
   - **Empresas** (label="Empresa") → Azul
   - **Pessoas** (label="Pessoa") → Preto
   - **Advogados** (label="Advogado") → Amarelo

3. **Sistema de Busca Avançado**
   - Busca em tempo real com autocomplete
   - Filtros por nome (pessoas), razão_social ou nome_fantasia (empresas)
   - Navegação por teclado (setas, Enter, Escape)
   - Priorização de resultados que começam com o termo

4. **Painel de Detalhes Expandido**
   - Modal centralizado com overlay
   - Formatação inteligente de todas as propriedades
   - CPF/CNPJ formatados, datas em formato brasileiro
   - Links clicáveis para Instagram com detecção automática
   - Sistema de badges por tipo de entidade

5. **Controles de Visualização Aprimorados**
   - Controles toggleáveis (mostrar/ocultar)
   - Ajustes em tempo real da simulação física
   - Configuração de aparência dos nós e arestas
   - Persistência de configurações no localStorage
   - Interface mais limpa e focada

6. **Links Sociais Clicáveis**
   - Instagram com links automáticos para https://instagram.com/username
   - Design especial com gradiente e ícone do Instagram
   - Tratamento de casos especiais ("None", "Não encontrado")
   - Abertura em nova aba com segurança

## Estrutura do Projeto

```
projeto/
├── backend/                 # API Python + FastAPI
│   ├── main.py             # Ponto de entrada
│   ├── app/
│   │   ├── api/            # Rotas REST
│   │   ├── services/       # Lógica de negócio
│   │   ├── models/         # Modelos Pydantic
│   │   ├── db/             # Conexão Neo4j
│   │   └── core/           # Configurações
│   └── requirements.txt    # Dependências Python
├── frontend/               # Interface React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── services/       # Cliente API
│   │   └── assets/         # Recursos estáticos
│   └── package.json        # Dependências Node.js
├── fixes/                  # Documentação de correções
└── resumo/                 # Esta documentação
    ├── 01-resumo-geral.md
    ├── 02-resumo-backend.md
    ├── 03-resumo-frontend.md
    ├── 04-fluxo-de-dados.md
    ├── 05-fluxo-do-usuario.md
    └── README.md           # Este arquivo
```

## Próximos Passos

Para continuar o desenvolvimento ou manutenção da aplicação:

1. **Configuração do Ambiente:**
   - Configure variáveis de ambiente (.env)
   - Instale dependências do backend e frontend
   - Configure conexão com Neo4j

2. **Desenvolvimento:**
   - Siga os padrões documentados
   - Mantenha a separação de responsabilidades
   - Atualize esta documentação conforme mudanças

3. **Deploy:**
   - Configure ambiente de produção
   - Ajuste configurações de CORS
   - Configure monitoramento e logs

## Mudanças Recentes

### Janeiro 2025 - Redesign Completo da Interface 🎨
- ✅ **Interface AdminDek-Style** com sidebar escura e header moderno
- ✅ **Sistema de Cores Profissional** com paleta azul moderna (#3b82f6)
- ✅ **Tipografia Inter** importada do Google Fonts para melhor legibilidade
- ✅ **Layout Responsivo** com três zonas no header e sidebar colapsável
- ✅ **Cards de Métricas** com ícones e estatísticas visuais
- ✅ **Design System** com CSS variables e tokens de design
- ✅ **Animações Modernas** com micro-interações e hover effects
- ✅ **Componentes Redesenhados** - busca, modal, controles estilizados
- ✅ **Brandização NetAnalytics** com logo e identidade visual própria
- ✅ **UX Aprimorada** com navegação intuitiva e feedback visual

### Janeiro 2025 - Melhorias de Interação e UX 🚀
- ✅ **Separação de Estados** - Filtro de comunidade independente dos detalhes do nó
- ✅ **Gráfico Estático ao Clicar** - Clique no nó apenas abre detalhes, sem reprocessar o gráfico
- ✅ **Tooltip Inteligente** - Mostra nome/razão_social ao passar o mouse sobre nós
- ✅ **Performance Melhorada** - Eliminação de reprocessamento desnecessário do gráfico
- ✅ **Interação Mais Intuitiva** - Busca filtra comunidade, clique apenas mostra detalhes
- ✅ **Estados de Aplicação Otimizados** - Dois estados separados para melhor controle
- ✅ **Tooltip Responsivo** - Formatação automática baseada no tipo de nó
- ✅ **CSS Customizado** - Estilos modernos para tooltip com tema escuro
- ✅ **UX Refinada** - Eliminação de comportamentos inesperados na interface

## Características do Design Moderno

### 🎨 Visual
- **Cores Modernas**: Paleta azul profissional (#3b82f6, #2563eb)
- **Gradientes**: Elementos visuais com depth e profissionalismo
- **Sombras Suaves**: Box shadows para elevação hierárquica
- **Border Radius**: 8px-16px para elementos modernos

### 🏗️ Layout
- **Sidebar**: 280px expandida, 70px colapsada
- **Header**: Três zonas (controles, busca central, métricas)
- **Cards**: Métricas com ícones e hover effects
- **Modal**: Backdrop blur e animações de entrada

### ✨ Interações
- **Hover Effects**: Transform translateY(-2px) para elevação
- **Transitions**: 0.2s ease para smoothness
- **Feedback Visual**: Estados claros para todas as interações
- **Keyboard Navigation**: Suporte completo para navegação

### 📱 Responsividade
- **Breakpoints**: 1200px, 1024px, 768px
- **Mobile First**: Layout adaptativo inteligente
- **Touch Friendly**: Tamanhos de toque apropriados
- **Performance**: Mantida em todos os dispositivos

---

*Documentação atualizada em: Janeiro 2025*
*Versão da aplicação: 1.3.0 - Design Moderno* 