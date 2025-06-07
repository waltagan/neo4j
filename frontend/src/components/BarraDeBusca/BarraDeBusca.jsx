import React, { useState, useEffect, useRef } from 'react';
import { useDadosDoGrafo } from '../VisualizadorDeGrafo/useDadosDoGrafo';
import './BarraDeBusca.css';

const BarraDeBusca = ({ onNodeSelect }) => {
  const [termoBusca, setTermoBusca] = useState('');
  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [indiceSelecionado, setIndiceSelecionado] = useState(-1);
  const { grafo } = useDadosDoGrafo();
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Extrai dados de busca dos nós do grafo
  const extrairDadosBusca = () => {
    if (!grafo) return [];
    
    const dadosNos = [];
    grafo.forEachNode((nodeId, attributes) => {
      const properties = attributes.properties || {};
      const label = attributes.label;
      
      // Para pessoas, busca firstname + lastname
      if (label === 'Pessoa') {
        const nome = `${properties.firstname || ''} ${properties.lastname || ''}`.trim();
        if (nome) {
          dadosNos.push({
            id: nodeId,
            texto: nome,
            tipo: 'Pessoa',
            node: attributes
          });
        }
      }
      
      // Para empresas, busca razao_social e nome_fantasia
      if (label === 'Empresa') {
        if (properties.razao_social) {
          dadosNos.push({
            id: nodeId,
            texto: properties.razao_social,
            tipo: 'Empresa (Razão Social)',
            node: attributes
          });
        }
        if (properties.nome_fantasia && properties.nome_fantasia !== properties.razao_social) {
          dadosNos.push({
            id: nodeId,
            texto: properties.nome_fantasia,
            tipo: 'Empresa (Nome Fantasia)',
            node: attributes
          });
        }
      }

      // Para advogados, busca firstname + lastname
      if (label === 'Advogado') {
        const nome = `${properties.firstname || ''} ${properties.lastname || ''}`.trim();
        if (nome) {
          dadosNos.push({
            id: nodeId,
            texto: nome,
            tipo: 'Advogado',
            node: attributes
          });
        }
      }
    });
    
    return dadosNos;
  };

  // Filtra sugestões baseadas no termo de busca
  const filtrarSugestoes = (termo) => {
    if (!termo || termo.length < 2) return [];
    
    const dadosNos = extrairDadosBusca();
    const termoLower = termo.toLowerCase();
    
    return dadosNos
      .filter(item => item.texto.toLowerCase().includes(termoLower))
      .sort((a, b) => {
        // Prioriza matches que começam com o termo
        const aComeca = a.texto.toLowerCase().startsWith(termoLower);
        const bComeca = b.texto.toLowerCase().startsWith(termoLower);
        
        if (aComeca && !bComeca) return -1;
        if (!aComeca && bComeca) return 1;
        
        return a.texto.localeCompare(b.texto);
      })
      .slice(0, 10); // Limita a 10 sugestões
  };

  // Atualiza sugestões quando o termo muda
  useEffect(() => {
    const novasSugestoes = filtrarSugestoes(termoBusca);
    setSugestoes(novasSugestoes);
    setIndiceSelecionado(-1);
    setMostrarSugestoes(novasSugestoes.length > 0);
  }, [termoBusca, grafo]);

  // Manipula mudanças no input
  const handleInputChange = (e) => {
    setTermoBusca(e.target.value);
  };

  // Manipula teclas pressionadas
  const handleKeyDown = (e) => {
    if (!mostrarSugestoes || sugestoes.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setIndiceSelecionado(prev => 
          prev < sugestoes.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setIndiceSelecionado(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (indiceSelecionado >= 0) {
          selecionarSugestao(sugestoes[indiceSelecionado]);
        }
        break;
      case 'Escape':
        setMostrarSugestoes(false);
        setIndiceSelecionado(-1);
        break;
    }
  };

  // Seleciona uma sugestão
  const selecionarSugestao = (sugestao) => {
    setTermoBusca(sugestao.texto);
    setMostrarSugestoes(false);
    setIndiceSelecionado(-1);
    
    if (onNodeSelect) {
      onNodeSelect(sugestao.node);
    }
    
    // Opcional: focar no nó selecionado no grafo
    console.log('Nó selecionado:', sugestao);
  };

  // Limpa a busca
  const limparBusca = () => {
    setTermoBusca('');
    setMostrarSugestoes(false);
    setIndiceSelecionado(-1);
  };

  return (
    <div className="barra-busca">
      <div className="busca-container">
        <input
          ref={inputRef}
          type="text"
          value={termoBusca}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Buscar por nome, razão social ou nome fantasia..."
          className="busca-input"
        />
        {termoBusca && (
          <button 
            onClick={limparBusca} 
            className="limpar-btn"
            type="button"
          >
            ×
          </button>
        )}
      </div>
      
      {mostrarSugestoes && sugestoes.length > 0 && (
        <div className="sugestoes-lista" ref={listRef}>
          {sugestoes.map((sugestao, index) => (
            <div
              key={`${sugestao.id}-${index}`}
              className={`sugestao-item ${index === indiceSelecionado ? 'selecionado' : ''}`}
              onClick={() => selecionarSugestao(sugestao)}
              onMouseEnter={() => setIndiceSelecionado(index)}
            >
              <span className="sugestao-texto">{sugestao.texto}</span>
              <span className="sugestao-tipo">{sugestao.tipo}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BarraDeBusca; 