# Fluxo do Usuário

## Visão Geral

Este documento descreve a jornada completa do usuário na aplicação de Visualização de Rede Societária, desde o acesso inicial até as funcionalidades avançadas de análise com sistema de cores baseado em propriedades e **novas funcionalidades** de busca, painel expandido e links clicáveis.

## 1. Acesso Inicial à Aplicação

### Primeira Experiência:

```
1. Usuário acessa a URL da aplicação
   ↓
2. Página carrega com título "Visualização de Rede Societária"
   ↓
3. **NOVO** - Barra de busca aparece no header
   ↓
4. Tela mostra "Carregando rede..." enquanto busca dados
   ↓
5. Grafo aparece com nós coloridos por tipo de entidade
   ↓
6. Interface completa é exibida com controles toggleáveis
```

### Layout da Interface Atualizada:

```
┌─────────────────────────────────────────────────────────┐
│                 Visualização de Rede Societária         │
│           ┌─────────────────────────────────┐           │
│           │    🔍 Busca por nome, razão...  │           │ **NOVO**
│           └─────────────────────────────────┘           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────┐  ┌──────────────┐  │
│  │                                 │  │ [Mostrar     │  │ **NOVO**
│  │     Visualização do Grafo       │  │  Controles]  │  │
│  │                                 │  └──────────────┘  │
│  │                                 │                    │
│  │                                 │  ┌──────────────┐  │
│  │                                 │  │ Controles de │  │ **TOGGLE**
│  └─────────────────────────────────┘  │ Simulação    │  │
│                                       │ (Opcional)   │  │
│                                       └──────────────┘  │
└─────────────────────────────────────────────────────────┘

        ┌─────────────────────────────────┐
        │      **NOVO** - Modal de        │
        │     Detalhes Expandido          │
        │   (Aparece ao clicar no nó)     │
        └─────────────────────────────────┘
```

## 2. **NOVO** - Sistema de Busca Inteligente

### Funcionalidade de Busca:

#### 2.1 Acesso à Busca
```
Usuário vê barra de busca no header → Clica no campo → 
Placeholder mostra: "Buscar por nome, razão social ou nome fantasia..."
```

#### 2.2 Busca em Tempo Real
```
Usuário digita "João" → Sistema filtra nós → Sugestões aparecem → 
Mostra pessoas com nome "João" → Indica tipo: "Pessoa"
```

#### 2.3 Autocomplete Avançado
```
Digitação: "Constro" → Sistema encontra → Sugestão aparece:
┌─────────────────────────────────────┐
│ 📷 Constro Wins                     │ Empresa (Razão Social)
│ 📷 Constrowins LTDA                 │ Empresa (Nome Fantasia)
└─────────────────────────────────────┘
```

#### 2.4 Navegação por Teclado
```
Usuário usa ↑↓ para navegar → Enter para selecionar → 
Escape para fechar → Seleção visual destacada
```

#### 2.5 Tipos de Busca Suportados:
- **Pessoas/Advogados:** firstname + lastname
- **Empresas:** razao_social e nome_fantasia
- **Priorização:** Matches que começam com o termo

### Fluxo de Busca Completo:
```
1. Usuário digita termo
   ↓
2. Sistema filtra em tempo real
   ↓
3. Sugestões aparecem ordenadas
   ↓
4. Usuário navega ou clica
   ↓
5. Nó é selecionado automaticamente
   ↓
6. **NOVO - Filtro de comunidade aplicado** (apenas nós conectados)
   ↓
7. **Botão "Mostrar Rede Completa" aparece**
```

## 3. Exploração Básica do Grafo

### Visualização Inicial:
- **Nós coloridos por tipo:** 
  - **Vermelho:** Stakeholders (entidades chave) - **50% maiores**
  - **Azul:** Empresas  
  - **Verde:** Pessoas
  - **Laranja:** Advogados
  - **Cinza:** Outros tipos
- **Contornos pretos:** Nós com Instagram cadastrado
- **Tons diferenciados:** Cores mais escuras para nós com redes sociais
- **Simulação física:** Nós se movem e se organizam automaticamente
- **Arestas:** Linhas conectando entidades relacionadas
- **Layout dinâmico:** Grafo se reorganiza continuamente
- **NOVO** - Legenda interativa no canto inferior direito
- **NOVO** - Controles opcionais e toggleáveis

### Primeiras Interações:

#### 3.1 Observação Passiva
```
Usuário observa o grafo → Identifica padrões por cores → Nota stakeholders (vermelhos) → 
Identifica empresas (azuis) e pessoas (pretos)
```

#### 3.2 Navegação Visual
```
Usuário move mouse sobre grafo → Visualiza diferentes áreas → 
Identifica nós de interesse por cor e posição
```

#### 3.3 **NOVO** - Controle de Interface
```
Usuário clica "Mostrar Controles" → Painel lateral aparece → 
Usuário clica "Ocultar Controles" → Interface fica mais limpa
```

## 4. **NOVO** - Painel de Detalhes Expandido

### Interação Aprimorada com Nós:

#### 4.1 Clique em Nó (Experiência Melhorada)
```
1. Usuário clica em qualquer nó
   ↓
2. **Modal expandido abre** no centro da tela
   ↓
3. **Overlay escuro** aparece atrás
   ↓
4. **Informações formatadas** são exibidas
   ↓
5. **Botão fechar (×)** disponível no canto
```

#### 4.2 **NOVO** - Formatação Inteligente de Dados

##### Para Pessoa:
```
┌─────────────────────────────────────────────┐
│  João Silva Santos                [×]       │
│  ────────────────────────────────────────   │
│  🏷️ Pessoa                                  │
│                                             │
│  CPF: 123.456.789-00                       │
│  Data de Nascimento: 15/03/1980            │
│  Idade: 44                                 │
│  Renda Estimada: R$ 50.000,00              │
│  📷 Instagram: @joaosilva123                │ **CLICÁVEL**
│  Em Prospecção: Não                        │
│  Stakeholder: Sim                          │
│                                             │
│  ⭐ Stakeholder                             │
└─────────────────────────────────────────────┘
```

##### Para Empresa:
```
┌─────────────────────────────────────────────┐
│  Constro Wins LTDA               [×]        │
│  ────────────────────────────────────────   │
│  🏷️ Empresa                                 │
│                                             │
│  CNPJ: 12.345.678/0001-90                  │
│  Razão Social: Constro Wins LTDA           │
│  Nome Fantasia: ConstroWins                │
│  Data de Fundação: 05/01/2009              │
│  📷 Instagram: @constrowins                 │ **CLICÁVEL**
│  Faixa de Faturamento: Até R$ 240,0 MIL    │
│  É Matriz: Sim                             │
│  Stakeholder: Sim                          │
│                                             │
│  ⭐ Stakeholder                             │
└─────────────────────────────────────────────┘
```

#### 4.3 **NOVO** - Links Clicáveis para Instagram

##### Detecção Automática:
```
Sistema verifica campo "instagram" → Se diferente de "None" ou "Não encontrado" → 
Gera link clicável → Formato: @username → Link: https://instagram.com/username
```

##### Experiência Visual:
```
📷 Instagram: @constrowins
     ↑            ↑
   Ícone      Link clicável
           (gradiente Instagram)
```

##### Comportamento:
- **Clique** → Abre Instagram em nova aba
- **Hover** → Efeito visual com animação
- **Segurança** → rel="noopener noreferrer"

#### 4.4 Sistema de Badges Aprimorado:
- **Pessoa** → Badge azul claro
- **Empresa** → Badge verde claro  
- **Advogado** → Badge laranja claro
- **Stakeholder** → Banner vermelho especial

## 5. Análise Visual por Tipos de Entidades

### Sistema de Cores Inteligente:

#### 5.1 Identificação de Stakeholders
```
Usuário observa nós vermelhos → Clica para ver detalhes → 
**Modal expandido** mostra formatação especial → **Banner "⭐ Stakeholder"**
```

#### 5.2 Mapeamento de Empresas
```
Usuário foca em nós azuis → Clica para detalhes → 
Vê **CNPJ formatado**, **Instagram clicável** → Identifica rede empresarial
```

#### 5.3 Identificação de Pessoas
```
Usuário observa nós pretos → Clica para detalhes → 
Vê **CPF formatado**, **data de nascimento**, **renda** → Mapeia pessoas físicas
```

#### 5.4 Identificação de Advogados
```
Usuário localiza nós amarelos → Clica para detalhes → 
Vê **OAB**, **informações profissionais** → Mapeia representação legal
```

## 6. **NOVO** - Fluxos de Busca Avançados

### Busca por Stakeholders:
```
1. Usuário digita nome de stakeholder conhecido
   ↓
2. Autocomplete mostra sugestão com indicador "Pessoa" ou "Empresa"
   ↓
3. Usuário seleciona → Modal abre → **Banner stakeholder visível**
   ↓
4. Usuário vê **Instagram clicável** se disponível
```

### Busca por Empresas:
```
1. Usuário digita razão social parcial
   ↓
2. Sistema mostra opções de "Razão Social" e "Nome Fantasia"
   ↓
3. Seleção → Modal com **CNPJ formatado** e dados empresariais
   ↓
4. **Instagram da empresa** disponível como link
```

### Busca por Pessoas:
```
1. Usuário digita nome ou sobrenome
   ↓
2. Autocomplete filtra por firstname + lastname
   ↓
3. Seleção → Modal com **CPF formatado**, idades, rendas
   ↓
4. **Instagram pessoal** como link clicável
```

## 7. **NOVO** - Filtro de Comunidade e Legenda

### Visualização de Comunidade:

#### 7.1 Seleção por Busca
```
1. Usuário busca e seleciona nó
   ↓
2. **Algoritmo BFS** encontra todos os nós conectados
   ↓
3. **Visualização filtra** para mostrar apenas a comunidade
   ↓
4. **Legenda atualiza** mostrando quantidade de nós
   ↓
5. **Botão "Mostrar Rede Completa"** aparece
```

#### 7.2 Legenda Interativa
```
Posição: Canto inferior direito
Conteúdo:
┌─────────────────────────────────┐
│ 📋 Legenda                      │
│                                 │
│ Tipos:                          │
│ 🔴 Stakeholder                  │
│ 🔵 Empresa                      │
│ 🟢 Pessoa                       │
│ 🟠 Advogado                     │
│                                 │
│ Instagram:                      │
│ ⚫ Com Instagram (contorno)     │
│ ⚪ Sem Instagram               │
│                                 │
│ Tamanho:                        │
│ ⭕ Stakeholder (50% maior)     │
│ ⚪ Tamanho normal              │
│                                 │
│ 📊 Mostrando comunidade: 15 nós │
└─────────────────────────────────┘
```

#### 7.3 Fluxo de Análise de Comunidade
```
1. **Busca inicial** → Seleciona nó central
   ↓
2. **Filtro aplicado** → Mostra apenas conexões
   ↓
3. **Análise focada** → Examina subgrafo isolado
   ↓
4. **Clique em nós** → Detalhes sem perder filtro
   ↓
5. **Botão "Rede Completa"** → Retorna à visualização total
```

#### 7.4 Benefícios da Visualização Filtrada
```
- **Redução de ruído visual** → Foco apenas no relevante
- **Análise de conectividade** → Entende relacionamentos diretos
- **Performance melhorada** → Menos nós para renderizar
- **Contexto preservado** → Legenda mostra escopo atual
```

## 8. Personalização da Visualização

### **NOVO** - Controles Toggleáveis:

#### 8.1 Acesso aos Controles
```
Usuário vê botão "Mostrar Controles" → Clica → 
**Painel lateral aparece** com animação → **Botão muda para "Ocultar Controles"**
```

#### 8.2 Interface Limpa Opcional
```
Para análise focada → Usuário clica "Ocultar Controles" → 
**Painel desaparece** → **Mais espaço para o grafo** → **Botão reposicionado**
```

### Principais Ajustes do Usuário:

#### 8.3 Ajuste de Repulsão (Charge)
```
Problema: Nós muito próximos, difícil de distinguir cores
Ação: Usuário diminui valor (mais negativo)
Resultado: Nós se afastam, melhor visualização das cores
```

#### 8.4 Ajuste de Força dos Links
```
Problema: Conexões muito fracas ou muito fortes
Ação: Usuário ajusta "Força Link"
Resultado: Relacionamentos mais/menos evidentes
```

#### 8.5 Ajuste de Tamanho dos Nós
```
Problema: Nós muito pequenos, cores difíceis de ver
Ação: Usuário ajusta "Tamanho do Nó"
Resultado: Melhor visibilidade das cores e identificação
```

### Fluxo de Personalização Aprimorado:
```
1. Usuário ativa controles se necessário
   ↓
2. Identifica problema visual
   ↓
3. Localiza controle relevante
   ↓
4. Ajusta valor com slider
   ↓
5. Observa mudança em tempo real nas cores e layout
   ↓
6. Refina ajuste até satisfação
   ↓
7. **Oculta controles** para interface limpa
   ↓
8. Salva configuração como padrão (opcional)
```

## 9. Padrões de Comportamento Observados

### Usuários Analistas:
1. **Começam com busca** por entidades conhecidas
2. **Usam modal expandido** para análise detalhada
3. **Seguem links do Instagram** para validação
4. **Exploram relacionamentos** visualmente

### Usuários Exploradores:
1. **Observam cores** para identificar padrões
2. **Clicam em stakeholders** (vermelhos) primeiro
3. **Ajustam controles** para melhor visualização
4. **Alternam entre controles visíveis/ocultos**

### Usuários Focados:
1. **Ocultam controles** imediatamente
2. **Usam busca** como ferramenta principal
3. **Focam no modal expandido** para informações
4. **Minimizam distrações** visuais

## 10. Casos de Uso Típicos Atualizados

### Caso 1: Análise de Stakeholder
```
Objetivo: Analisar stakeholder específico
1. Buscar por nome → Seleção → Modal detalhado
2. Verificar Instagram → Validar informações
3. Analisar propriedades formatadas
4. Explorar conexões visuais no grafo
```

### Caso 2: Mapeamento de Rede Empresarial
```
Objetivo: Mapear conexões empresariais
1. Identificar empresas (azuis) visualmente
2. Clicar para ver CNPJ e dados formatados
3. Seguir para Instagram corporativo
4. Mapear relacionamentos através do grafo
```

### Caso 3: Investigação Dirigida
```
Objetivo: Investigar pessoa ou empresa específica
1. Usar busca com autocomplete
2. Analisar detalhes no modal expandido
3. Verificar redes sociais (Instagram)
4. Expandir para entidades relacionadas
```

### Caso 4: Apresentação de Dados
```
Objetivo: Apresentar análise para terceiros
1. Ocultar controles para interface limpa
2. Usar busca para navegar rapidamente
3. Mostrar detalhes formatados no modal
4. Demonstrar links externos (Instagram)
```

## 11. Melhorias na Experiência do Usuário

### Interface Mais Intuitiva:
- **Busca prominence** no header
- **Controles opcionais** reduzem cluttering
- **Modal centralizado** para foco na informação
- **Formatação inteligente** facilita leitura

### Navegação Aprimorada:
- **Teclado completo** na busca (setas, Enter, Escape)
- **Links externos** abrem em nova aba
- **Overlay modal** com fechamento intuitivo
- **Estados visuais claros** (hover, seleção)

### Informações Mais Ricas:
- **Formatação brasileira** (CPF, CNPJ, datas)
- **Links sociais clicáveis** para validação
- **Badges visuais** por tipo de entidade
- **Hierarquia visual** clara (stakeholders destacados)

## 12. Atualizações de Interação (Janeiro 2025) 🚀

### Tooltip Inteligente ao Hover

#### 12.1 Funcionalidade Implementada
```
Usuário passa mouse sobre qualquer nó → 
**Tooltip aparece instantaneamente** → 
**Mostra nome/razão_social** baseado no tipo → 
**Design moderno** com tema escuro
```

#### 12.2 Comportamento por Tipo de Nó
```
🟢 Pessoa/Advogado → "João Silva Santos"
🔵 Empresa → "Nome Fantasia" (prioridade) ou "Razão Social Ltda"
❓ Outros → "Tipo: ID_do_nó"
```

#### 12.3 Características do Tooltip
```
┌─────────────────────────────┐
│ 🏢 Empresa Exemplo Ltda     │  ← Fundo escuro (rgba(0,0,0,0.9))
└─────────────────────────────┘  ← Bordas arredondadas + sombra
```

**Especificações Técnicas:**
- **Fonte**: Inter 13px, peso 500
- **Padding**: 8px x 12px
- **Bordas**: 6px radius
- **Sombra**: 0 4px 12px rgba(0,0,0,0.3)
- **Z-index**: 1000 (sempre visível)
- **Quebra**: Automática para nomes longos (max 250px)

### Separação de Estados para Performance

#### 12.4 Problema Resolvido
```
ANTES:
Clique no nó → Atualiza estado → Reprocessa gráfico inteiro → Lag perceptível

DEPOIS:  
Clique no nó → Apenas abre modal → Gráfico permanece estático → Resposta imediata
```

#### 12.5 Estados Independentes
```javascript
noSelecionado    → Controla APENAS filtro de comunidade (busca)
noParaDetalhes   → Controla APENAS painel de detalhes (clique)
painelDetalhesVisivel → Controla visibilidade do modal
```

#### 12.6 Fluxo de Interação Atualizado
```
1. 🔍 **Buscar nó** → Filtra comunidade → Gráfico reprocessa (necessário)
   ↓
2. 🖱️ **Hover nó** → Tooltip aparece → Sem reprocessamento
   ↓
3. 👆 **Clicar nó** → Modal abre → Gráfico ESTÁTICO
   ↓
4. 📖 **Ler detalhes** → Navegação livre → Filtro preservado
   ↓
5. ❌ **Fechar modal** → Filtro mantido → Sem reprocessamento
   ↓
6. 🔄 **"Rede Completa"** → Remove filtro → Reprocessa (necessário)
```

### Benefícios de UX Alcançados

#### 12.7 Performance Perceptível
```
- **Resposta instantânea** ao clicar nos nós
- **Smooth hovering** com tooltip responsivo  
- **Zero lag** na navegação entre detalhes
- **Reprocessamento** apenas quando necessário
```

#### 12.8 Interação Mais Intuitiva
```
- **Identificação rápida** via tooltip (sem clicar)
- **Clique focado** apenas para detalhes completos
- **Filtro preservado** durante exploração
- **Comportamento previsível** em todas as ações
```

#### 12.9 Casos de Uso Aprimorados

**Análise Rápida:**
```
1. Buscar stakeholder → Comunidade filtrada
2. Hover nos nós → Identificação via tooltip  
3. Clicar interessantes → Detalhes completos
4. Fechar modal → Continuar análise sem perder filtro
```

**Exploração Eficiente:**
```
1. Hover em vários nós → Identificação rápida via tooltip
2. Clicar apenas nos relevantes → Economia de tempo
3. Modal focado → Informações detalhadas
4. Navegação fluida → Sem interrupções técnicas
```

**Apresentação Profissional:**
```
1. Interface responsiva → Sem lags visíveis
2. Tooltip informativo → Identificação sem cliques
3. Modal elegante → Apresentação de dados limpa
4. Performance confiável → Demonstrações sem problemas
```

### Arquitetura de Estados Melhorada

#### 12.10 Responsabilidades Claras
```
noSelecionado:
- ✅ Setado por busca (handleNodeSelect)
- ✅ Usado para filtrar comunidade
- ✅ Reprocessa gráfico quando necessário
- ❌ NÃO afetado por cliques nos nós

noParaDetalhes:
- ✅ Setado por clique (handleNodeClick)  
- ✅ Usado apenas para painel de detalhes
- ✅ Independente do filtro de comunidade
- ❌ NÃO reprocessa o gráfico

painelDetalhesVisivel:
- ✅ Controla apenas visibilidade do modal
- ✅ Toggled por clique/fechar
- ✅ Independente dos dados do nó
```

#### 12.11 Fluxo de Dados Otimizado
```
BUSCA:
Input → handleNodeSelect → noSelecionado → useEffect → Filtro aplicado

TOOLTIP:  
Hover → obterTextoTooltip → Renderização nativa → Sem state changes

CLIQUE:
Click → handleNodeClick → noParaDetalhes + painelDetalhesVisivel → Modal abre

FECHAR:
Close → closePainelDetalhes → Limpa noParaDetalhes → Preserva noSelecionado
```

---

*Fluxo do usuário atualizado em: Janeiro 2025*
*Inclui: Tooltip inteligente, separação de estados, performance otimizada* 