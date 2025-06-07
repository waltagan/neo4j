import React, { useState, useCallback } from "react";
import VisualizadorDeGrafo from "./components/VisualizadorDeGrafo/VisualizadorDeGrafo.jsx";
import PainelDeDetalhes from "./components/PainelDeDetalhes/PainelDeDetalhes.jsx";
import ControlesDeExibicao from "./components/ControlesDeExibicao/ControlesDeExibicao.jsx";
import BarraDeBusca from "./components/BarraDeBusca/BarraDeBusca.jsx";
import GerenciadorDeProjetos from "./components/GerenciadorDeProjetos/GerenciadorDeProjetos.jsx";
import "./App.css";

const CONFIG_STORAGE_KEY = 'visualizador-grafo-settings';

const SETTINGS_INICIAIS = {
  // Configs gerais de Nós
  defaultNodeSize: 15,
  labelSize: 14,
  labelWeight: "normal",
  labelFont: "Arial",
  
  // Configs gerais de Arestas
  defaultEdgeSize: 2,
  renderEdgeLabels: false,
  edgeLabelSize: 12,
  defaultEdgeType: "line",

  // Ajustes da Simulação
  charge: -20.00,
  chargeMaxDistance: 520,
  linkStrength: 1.00,
  linkDistance: 71,
  centerStrength: 0.20,
  collisionRadius: 35,
  alphaDecay: 0.0010,
  velocityDecay: 0.14,
};

/**
 * Componente principal da aplicação de visualização de rede societária.
 * 
 * Gerencia o estado global da aplicação e coordena a comunicação entre
 * os componentes filhos.
 */
function App() {
  const [noSelecionado, setNoSelecionado] = useState(null); // Para filtrar a comunidade
  const [noParaDetalhes, setNoParaDetalhes] = useState(null); // Para mostrar detalhes apenas
  const [showControles, setShowControles] = useState(false);
  const [showStatusInstagram, setShowStatusInstagram] = useState(false);
  const [painelDetalhesVisivel, setPainelDetalhesVisivel] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [settings, setSettings] = useState(() => {
    try {
      const configSalva = window.localStorage.getItem(CONFIG_STORAGE_KEY);
      return configSalva ? JSON.parse(configSalva) : SETTINGS_INICIAIS;
    } catch (error) {
      console.error("Erro ao carregar configurações salvas:", error);
      return SETTINGS_INICIAIS;
    }
  });
  const [metricas, setMetricas] = useState({
    nodes: 0,
    links: 0,
    communities: 0
  });
  const [showAddStakeholderModal, setShowAddStakeholderModal] = useState(false);
  const [stakeholderData, setStakeholderData] = useState({
    documento: '',
    projeto: '',
    status: 'prospeccao'
  });

  const handleNodeClick = useCallback((node) => {
    // Apenas abre o painel de detalhes e define o nó para detalhes
    // NÃO modifica o filtro da comunidade
    setNoParaDetalhes(node);
    setPainelDetalhesVisivel(true);
  }, []);

  const handleNodeSelect = useCallback((node) => {
    // Função chamada quando um nó é selecionado pela busca
    // Filtra a comunidade, sem abrir o painel de detalhes
    setNoSelecionado(node);
    setNoParaDetalhes(null); // Limpa detalhes ao buscar
    setPainelDetalhesVisivel(false); // Garante que o painel não abra
    console.log('Nó selecionado pela busca - mostrando comunidade:', node);
  }, []);

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
  };

  const handleSaveDefaultSettings = useCallback(() => {
    try {
      window.localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(settings));
      alert("Configurações salvas como padrão!");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      alert("Não foi possível salvar as configurações.");
    }
  }, [settings]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const closePainelDetalhes = () => {
    setPainelDetalhesVisivel(false);
    // Apenas limpa os detalhes, mantém o filtro da comunidade se houver
    setNoParaDetalhes(null);
  };

  const limparFiltro = () => {
    setNoSelecionado(null); // Limpa o filtro da comunidade
    setNoParaDetalhes(null); // Limpa os detalhes
    setPainelDetalhesVisivel(false);
  };

  const handleMetricsUpdate = useCallback((newMetrics) => {
    setMetricas(prevMetrics => {
      // Só atualiza se houver mudança real
      if (prevMetrics.nodes === newMetrics.nodes &&
          prevMetrics.links === newMetrics.links &&
          prevMetrics.communities === newMetrics.communities) {
        return prevMetrics;
      }
      return newMetrics;
    });
  }, []);

  const handleAddStakeholder = (e) => {
    e.preventDefault();
    // Lógica para adicionar stakeholder
    console.log('Novo stakeholder:', stakeholderData);
    setShowAddStakeholderModal(false);
    setStakeholderData({ documento: '', projeto: '', status: 'prospeccao' });
  };

  return (
    <div className="App">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="3"/>
                <circle cx="6" cy="16" r="3"/>
                <circle cx="18" cy="16" r="3"/>
                <line x1="12" y1="11" x2="6" y2="13"/>
                <line x1="12" y1="11" x2="18" y2="13"/>
                <line x1="6" y1="16" x2="18" y2="16"/>
              </svg>
            </div>
            {!sidebarCollapsed && (
              <div className="logo-text">
                <h2>NetAgentic</h2>
                <span>Análise de redes B2B</span>
              </div>
            )}
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section">
            {!sidebarCollapsed && <span className="nav-section-title">Navegação</span>}
            <ul className="nav-list">
              <li className="nav-item active" onClick={() => setCurrentPage('dashboard')}>
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                {!sidebarCollapsed && <span className="nav-text">Rede Gráfica</span>}
              </li>
              <li className="nav-item">
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                {!sidebarCollapsed && <span className="nav-text">Análise</span>}
              </li>
              <li className="nav-item">
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                {!sidebarCollapsed && <span className="nav-text">Relatórios</span>}
              </li>
            </ul>
          </div>
          
          {!sidebarCollapsed && (
            <div className="nav-section">
              <span className="nav-section-title">Ferramentas</span>
              <ul className="nav-list">
                <li className="nav-item" onClick={() => setCurrentPage('projetos')}>
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3h18v18H3zM8 10h8M8 14h8M8 18h8"/>
                  </svg>
                  <span className="nav-text">Projetos</span>
                </li>
                <li className="nav-item">
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                  <span className="nav-text">Configurações</span>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-wrapper">
        {/* Header */}
        <header className="App-header">
          <div className="header-left">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <span>☰</span>
            </button>
            <div className="header-title">
              <h1>ABC Advise Network</h1>
              <span className="header-subtitle">Análise de conexões empresariais e societárias</span>
            </div>
            <button 
              className="add-stakeholder-btn"
              onClick={() => setShowAddStakeholderModal(true)}
              title="Adicionar Stakeholder"
            >
              +
            </button>
          </div>
          
          <div className="header-center">
            <BarraDeBusca onNodeSelect={handleNodeSelect} />
          </div>
          
          <div className="header-right">
            <div className="header-metrics">
              <div className="metric-card">
                <div className="metric-icon blue">⚫</div>
                <div className="metric-value">{metricas.nodes.toLocaleString()}</div>
                <div className="metric-label">Nós</div>
              </div>
              <div className="metric-card">
                <div className="metric-icon green">⭘</div>
                <div className="metric-value">{metricas.links.toLocaleString()}</div>
                <div className="metric-label">Conexões</div>
              </div>
              <div className="metric-card">
                <div className="metric-icon orange">⬟</div>
                <div className="metric-value">{metricas.communities.toLocaleString()}</div>
                <div className="metric-label">Comunidades</div>
              </div>
            </div>
            <div className="user-menu">
              <div className="user-avatar">👤</div>
              <span className="user-name">Analista</span>
            </div>
          </div>
        </header>

        {/* Modal movido para fora do header */}
        {showAddStakeholderModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Adicionar Stakeholder</h3>
              <form onSubmit={handleAddStakeholder}>
                <div className="form-group">
                  <label>CPF/CNPJ</label>
                  <input 
                    type="text" 
                    value={stakeholderData.documento}
                    onChange={(e) => setStakeholderData({...stakeholderData, documento: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Projeto</label>
                  <select 
                    value={stakeholderData.projeto}
                    onChange={(e) => setStakeholderData({...stakeholderData, projeto: e.target.value})}
                    required
                  >
                    <option value="">Selecione um projeto</option>
                    {/* Opções de projetos aqui */}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select 
                    value={stakeholderData.status}
                    onChange={(e) => setStakeholderData({...stakeholderData, status: e.target.value})}
                    required
                  >
                    <option value="prospeccao">Em Prospecção</option>
                    <option value="cliente">Cliente</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowAddStakeholderModal(false)}>Cancelar</button>
                  <button type="submit">Adicionar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="App-main">
          <div className="content-wrapper">
            {currentPage === 'dashboard' ? (
              <>
                <div className="visualizador-container" style={{ 
                  width: '100%', 
                  height: '100vh', 
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <VisualizadorDeGrafo 
                    onNodeClick={handleNodeClick}
                    settings={settings}
                    noSelecionado={noSelecionado}
                    onMetricsUpdate={handleMetricsUpdate}
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="action-buttons">
                  {noSelecionado && (
                    <button 
                      className="action-btn primary" 
                      onClick={limparFiltro}
                      title="Mostrar toda a rede"
                    >
                      🔄 Mostrar Rede Completa
                    </button>
                  )}
                  
                  <button 
                    className="action-btn secondary" 
                    onClick={() => setShowControles(!showControles)}
                    title={showControles ? 'Ocultar Controles' : 'Mostrar Controles'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                    {showControles ? 'Ocultar Controles' : 'Controles'}
                  </button>

                  <button 
                    className="action-btn secondary" 
                    onClick={() => setShowStatusInstagram(!showStatusInstagram)}
                    title={showStatusInstagram ? 'Ocultar Status Instagram' : 'Status Busca Instagram'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </button>
                </div>

                {/* Controles de simulação */}
                {showControles && (
                  <div className="controles-container">
                    <ControlesDeExibicao 
                      settings={settings} 
                      onSettingsChange={handleSettingsChange}
                      onSaveDefault={handleSaveDefaultSettings}
                    />
                  </div>
                )}

                {/* Painel de detalhes expandido */}
                {painelDetalhesVisivel && (
                  <PainelDeDetalhes 
                    noSelecionado={noParaDetalhes} 
                    onClose={closePainelDetalhes}
                    isExpanded={true}
                  />
                )}

                {/* Status Instagram */}
                {showStatusInstagram && (
                  <div className="status-instagram-container">
                    <div className="status-instagram-header">
                      <h3>Status Busca Instagram</h3>
                      <button className="fechar-btn" onClick={() => setShowStatusInstagram(false)}>×</button>
                    </div>
                    <div className="status-instagram-content">
                      {/* Exemplo de mensagens de status */}
                      <div className="status-message info">
                        Iniciando busca de perfis do Instagram...
                      </div>
                      <div className="status-message success">
                        Perfil encontrado: @exemplo_perfil
                      </div>
                      <div className="status-message warning">
                        Aguardando resposta da API do Instagram...
                      </div>
                      <div className="status-message error">
                        Limite de requisições atingido. Tentando novamente em 5 minutos.
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <GerenciadorDeProjetos />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
